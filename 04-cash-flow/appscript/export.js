// ============================================================
// TAMBAHKAN KE APPSCRIPT TOOL 04 (Cash Flow Monitoring)
// Tambahkan di bawah fungsi kirimDataUang yang sudah ada
// ============================================================

function doGet(e) {
  const output = exportCashFlowAsJSON();
  return ContentService
    .createTextOutput(JSON.stringify(output, null, 2))
    .setMimeType(ContentService.MimeType.JSON);
}

function exportCashFlowAsJSON() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Transaction Database');

  if (!sheet) {
    return { error: true, message: 'Sheet Transaction Database tidak ditemukan.' };
  }

  const data = sheet.getDataRange().getValues();
  if (data.length < 2) {
    return { error: true, message: 'Database kosong.' };
  }

  const keyMap = {
    'Transaction ID':       'transaction_id',
    'Timestamp Input':      'timestamp_input',
    'Transaction Date':     'transaction_date',
    'Type of Transaction':  'transaction_type',
    'Category':             'category',
    'Description':          'description',
    'Value':                'value',
    'Payment Methods':      'payment_method',
    'Third-Party Account':  'third_party_account',
    'Third-Party Name':     'third_party_name',
    'Final Balanced':       'final_balance',
    'Month':                'month'
  };

  const headers = data[0].map(h => String(h).trim());
  const records = [];
  const exportedAt = Utilities.formatDate(
    new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd'T'HH:mm:ss'Z'"
  );

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[0] || String(row[0]).trim() === '') continue;

    const record = {};
    headers.forEach((header, idx) => {
      const key = keyMap[header] || header.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
      let value = row[idx];

      if (value instanceof Date) {
        value = Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
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
    error:       false,
    tool:        '04_cash_flow',
    exported_at: exportedAt,
    total_rows:  records.length,
    columns:     Object.keys(records[0] || {}),
    data:        records
  };
}

function testExportJSON() {
  const result = exportCashFlowAsJSON();
  Logger.log('Total rows exported: ' + result.total_rows);
  Logger.log('First record: ' + JSON.stringify(result.data[0]));
  SpreadsheetApp.getUi().alert(
    'Export berhasil!\nTotal transaksi: ' + result.total_rows + '\nExported at: ' + result.exported_at
  );
}

// Di onOpen() yang ada, tambahkan:
// .addSeparator()
// .addItem('🔁 Test Export JSON', 'testExportJSON')
