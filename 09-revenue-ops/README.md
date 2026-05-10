# 09 — Revenue Operations & Inventory System

**Live Dashboard:** `[link web app]`  
**Data Source:** Google Sheets (private) · Exported via AppScript Web App

---

## 📋 Deskripsi

Sistem operasional penjualan lengkap dengan Point of Sale (POS), manajemen inventori real-time, dan analisis profitabilitas per SKU. Dilengkapi mode automatic entry berbasis `onEdit()` trigger untuk kecepatan transaksi kasir.

**Masalah yang diselesaikan:**
- Manajemen stok 100 SKU tanpa software inventori berbayar
- Transaksi POS dengan auto-deduct stok dan cetak receipt PDF
- Analisis margin per produk untuk keputusan pricing

---

## 🗂️ Struktur Data

**Tabel 1: `stockout_transactions`** (14 kolom) — log penjualan per item

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `row_key` | TEXT PK | Composite key: invoice\|sku |
| `invoice` | TEXT | Nomor invoice (format: INV/...) |
| `sale_date` | TEXT | Tanggal penjualan |
| `year_month` | TEXT | Derived: YYYY-MM |
| `cashier` | TEXT | Nama kasir |
| `buyer` | TEXT | Nama pembeli |
| `payment_method` | TEXT | Metode pembayaran |
| `sku` | TEXT | Kode produk |
| `product_name` | TEXT | Nama produk |
| `qty` | REAL | Jumlah terjual |
| `unit_price` | REAL | Harga jual per unit |
| `discount_rate` | REAL | Diskon yang diterapkan |
| `subtotal` | REAL | Total setelah diskon |
| `margin` | REAL | Selisih harga jual vs HPP |

**Total records:** 104 line items transaksi

---

**Tabel 2: `product_stock`** (11 kolom) — master stok per SKU

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `sku` | TEXT PK | Kode produk unik |
| `product_name` | TEXT | Nama produk |
| `qty_stock` | REAL | Stok saat ini |
| `in_stock` | REAL | Total masuk |
| `out_stock` | REAL | Total keluar |
| `value_capital` | REAL | Harga modal (COGS) |
| `value_selling` | REAL | Harga jual |
| `margin_per_unit` | REAL | Derived: selling - capital |
| `margin_pct` | REAL | Derived: margin / capital × 100 |
| `is_stockout` | INTEGER | Flag: 1 jika qty_stock ≤ 0 |

**Total records:** 100 SKU aktif

---

## ⚙️ Pipeline

```
Google Sheets (Stockout + Product Stock)
    ↓  AppScript doGet() → JSON (2 datasets dalam 1 response)
pipeline_09.py
    ↓  fetch → clean kedua tabel → validate → upsert
inventory_db.sqlite (2 tabel)
    ↓  SQL queries (20 queries)
Dashboard Web App
```

**Jalankan pipeline:**
```bash
python pipeline_09.py --url "YOUR_WEBAPP_URL"
```

**Debug per sheet:**
```
YOUR_WEBAPP_URL?sheet=stockout   ← hanya transaksi
YOUR_WEBAPP_URL?sheet=products   ← hanya stok produk
```

---

## 📊 KPI & Queries

| # | Label | Keterangan |
|---|-------|-----------|
| KPI | `kpi_total_revenue` | Total revenue seluruh waktu |
| KPI | `kpi_total_profit` | Total profit / margin |
| KPI | `kpi_total_invoices` | Jumlah transaksi unik |
| KPI | `kpi_total_items_sold` | Total unit terjual |
| KPI | `kpi_avg_order_value` | Rata-rata nilai per invoice |
| KPI | `kpi_overall_margin_pct` | Margin % keseluruhan |
| KPI | `kpi_active_sku` | SKU dengan stok > 0 |
| KPI | `kpi_stockout_sku` | SKU yang habis stok |
| Chart | `chart_daily_sales` | Tren penjualan harian |
| Chart | `chart_monthly_sales` | Tren penjualan bulanan |
| Chart | `chart_top_products_revenue` | Top 10 produk by revenue |
| Chart | `chart_top_products_qty` | Top 10 produk by qty |
| Chart | `chart_payment_method` | Distribusi payment method |
| Chart | `chart_cashier_performance` | Performa per kasir |
| Table | `table_stock_alert` | SKU dengan stok ≤ 10 |
| Table | `table_product_stock` | Snapshot lengkap semua SKU |
| Table | `table_recent_transactions` | 20 invoice terbaru |
| Analytics | `analytics_sku_performance` | Revenue + profit per SKU |
| Analytics | `analytics_inventory_value` | Ringkasan nilai inventori |

Lihat semua query lengkap di [`queries/all_queries_09.sql`](./queries/all_queries_09.sql)

---

## 📁 File Structure

```
09-revenue-ops/
├── pipeline_09.py          ← ETL pipeline utama (2 tabel)
├── appscript/
│   └── export.js           ← doGet() dengan param ?sheet=
├── queries/
│   └── all_queries_09.sql  ← semua SQL queries untuk dashboard
├── data/
│   └── sample_output.json  ← contoh output JSON dari AppScript
└── README.md
```
