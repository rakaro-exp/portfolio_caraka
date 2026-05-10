// ============================================================
// TAMBAHKAN KE APPSCRIPT TOOL 09 (Revenue Operations)
// Tambahkan di bawah fungsi-fungsi yang sudah ada
// Tool 09 mengexport 2 tabel: stockout_transactions + product_stock
// ============================================================

function doGet(e) {
  const param = e && e.parameter && e.parameter.sheet ? e.parameter.sheet : 'all';

  if (param === 'stockout') {
    return ContentService
      .createTextOutput(JSON.stringify(exportStockoutAsJSON(), null, 2))
      .setMimeType(ContentService.MimeType.JSON);
  } else if (param === 'products') {
    return ContentService
      .createTextOutput(JSON.stringify(exportProductStockAsJSON(), null, 2))
      .setMimeType(ContentService.MimeType.JSON);
  } else {
    // Default: export keduanya dalam satu response
    const result = {
      error:       false,
      tool:        '09_revenue_ops',
      exported_at: Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      stockout:    exportStockoutAsJSON(),
      products:    exportProductStockAsJSON()
    };
    return ContentService
      .createTextOutput(JSON.stringify(result, null, 2))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ------------------------------------------------------------
// Export sheet Stockout (transaksi penjualan per item)
// ------------------------------------------------------------
function exportStockoutAsJSON() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Stockout');

  if (!sheet) return { error: true, message: 'Sheet Stockout tidak ditemukan.' };

  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return { error: true, message: 'Sheet Stockout kosong.' };

  const keyMap = {
    'Invoice':        'invoice',
    'Tanggal Out':    'sale_date',
    'Cashier':        'cashier',
    'Buyer':          'buyer',
    'Payment Method': 'payment_method',
    'SKU Product':    'sku',
    'Product Name':   'product_name',
    'Qty':            'qty',
    'Amount':         'unit_price',
    'Discount':       'discount_rate',
    'Subtotal':       'subtotal',
    'GAP':            'margin'
  };

  // Hanya ambil 12 kolom pertama (sisanya adalah kolom dokumentasi/notes)
  const headers = data[0].slice(0, 12).map(h => String(h).trim());
  const records = [];

  const exportedAt = Utilities.formatDate(
    new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd'T'HH:mm:ss'Z'"
  );

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    // Skip jika invoice kosong
    if (!row[0] || String(row[0]).trim() === '') continue;
    // Skip jika bukan format invoice (INV/...)
    if (!String(row[0]).startsWith('INV/')) continue;

    const record = {};
    headers.forEach((header, idx) => {
      const key = keyMap[header] || header.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
      let value = row[idx];

      if (value instanceof Date) {
        value = Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd');
      } else if (value === null || value === undefined || value === '') {
        value = null;
      } else if (typeof value === 'number') {
        value = value;
      } else {
        value = String(value).trim();
      }

      record[key] = value;
    });

    records.push(record);
  }

  return {
    error:      false,
    sheet:      'stockout',
    total_rows: records.length,
    columns:    Object.keys(records[0] || {}),
    data:       records
  };
}

// ------------------------------------------------------------
// Export sheet Product Stock (master stok per SKU)
// ------------------------------------------------------------
function exportProductStockAsJSON() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Product Stock');

  if (!sheet) return { error: true, message: 'Sheet Product Stock tidak ditemukan.' };

  // Data header ada di baris ke-8 (index 7), data mulai baris ke-9
  const allData   = sheet.getDataRange().getValues();
  const headerRow = allData[7]; // row index 7 = baris 8
  const records   = [];

  const keyMap = {
    'SKU Product':   'sku',
    'Product Name':  'product_name',
    'Qty Stock':     'qty_stock',
    'In Stock':      'in_stock',
    'Out Stock':     'out_stock',
    'Value Capital': 'value_capital',
    'Value Selling': 'value_selling'
  };

  // Temukan index kolom yang kita butuhkan
  const colIdx = {};
  headerRow.forEach((h, i) => {
    const key = keyMap[String(h).trim()];
    if (key) colIdx[key] = i;
  });

  const exportedAt = Utilities.formatDate(
    new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd'T'HH:mm:ss'Z'"
  );

  for (let i = 8; i < allData.length; i++) {
    const row = allData[i];
    const sku = row[colIdx['sku']];

    // Skip baris kosong
    if (!sku || String(sku).trim() === '' || String(sku).trim() === 'nan') continue;
    // Skip baris yang bukan SKU produk (harus format GLB atau alfanumerik)
    if (typeof sku !== 'string' && typeof sku !== 'number') continue;

    const record = {
      sku:           String(row[colIdx['sku']]).trim(),
      product_name:  String(row[colIdx['product_name']] || '').trim() || null,
      qty_stock:     typeof row[colIdx['qty_stock']] === 'number' ? row[colIdx['qty_stock']] : null,
      in_stock:      typeof row[colIdx['in_stock']] === 'number' ? row[colIdx['in_stock']] : null,
      out_stock:     typeof row[colIdx['out_stock']] === 'number' ? row[colIdx['out_stock']] : null,
      value_capital: typeof row[colIdx['value_capital']] === 'number' ? row[colIdx['value_capital']] : null,
      value_selling: typeof row[colIdx['value_selling']] === 'number' ? row[colIdx['value_selling']] : null
    };

    // Skip jika semua nilai numerik null (baris kosong tersembunyi)
    if (record.qty_stock === null && record.in_stock === null) continue;

    records.push(record);
  }

  return {
    error:      false,
    sheet:      'product_stock',
    total_rows: records.length,
    columns:    Object.keys(records[0] || {}),
    data:       records
  };
}

function testExportJSON() {
  const stockout  = exportStockoutAsJSON();
  const products  = exportProductStockAsJSON();
  Logger.log('Stockout rows: ' + stockout.total_rows);
  Logger.log('Product rows : ' + products.total_rows);
  Logger.log('First stockout: ' + JSON.stringify(stockout.data[0]));
  Logger.log('First product : ' + JSON.stringify(products.data[0]));
  SpreadsheetApp.getUi().alert(
    'Export berhasil!\n' +
    'Stockout transaksi: ' + stockout.total_rows + '\n' +
    'Products (SKU)    : ' + products.total_rows
  );
}

// Di onOpen() yang ada, tambahkan di sub menu Data Management:
// .addItem('🔁 Test Export JSON', 'testExportJSON')
