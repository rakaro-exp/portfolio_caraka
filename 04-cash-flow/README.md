# 04 — Cash Flow Monitoring & Financial Reporting System

**Live Dashboard:** `[link web app]`  
**Data Source:** Google Sheets (private) · Exported via AppScript Web App

---

## 📋 Deskripsi

Sistem monitoring arus kas real-time yang merekam setiap transaksi keuangan, mengkategorisasikannya secara otomatis, dan menghasilkan laporan keuangan dengan running balance yang selalu up-to-date.

**Masalah yang diselesaikan:**
- Visibilitas cash flow harian tanpa software akuntansi berbayar
- Kategorisasi transaksi otomatis untuk analisis pengeluaran
- Laporan keuangan yang bisa di-drill down per kategori, payment method, dan periode

---

## 🗂️ Struktur Data

**Tabel: `transactions`** (13 kolom + metadata)

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `transaction_id` | TEXT PK | Auto-generated (format: TRI/TRO + tanggal) |
| `timestamp_input` | TEXT | Waktu data diinput |
| `transaction_date` | TEXT | Tanggal transaksi sebenarnya |
| `year_month` | TEXT | Derived: YYYY-MM untuk grouping |
| `transaction_type` | TEXT | Cash-In / Cash-Out |
| `category` | TEXT | Kategori transaksi |
| `description` | TEXT | Deskripsi transaksi |
| `value` | REAL | Nilai transaksi |
| `payment_method` | TEXT | Cash / Bank / Credit Card / Paypal / Payoneer |
| `third_party_account` | TEXT | Nomor rekening pihak ketiga |
| `third_party_name` | TEXT | Nama pihak ketiga |
| `final_balance` | REAL | Running balance setelah transaksi |
| `month` | TEXT | Label bulan dari sumber data |

**Total records:** 316 transaksi

---

## ⚙️ Pipeline

```
Google Sheets (Transaction Database)
    ↓  AppScript doGet() → JSON
pipeline_04.py
    ↓  fetch → clean → validate → upsert
cashflow_db.sqlite
    ↓  SQL queries (17 queries)
Dashboard Web App
```

**Jalankan pipeline:**
```bash
python pipeline_04.py --url "YOUR_WEBAPP_URL"
```

---

## 📊 KPI & Queries

| # | Label | Keterangan |
|---|-------|-----------|
| KPI | `kpi_total_cash_in` | Total pemasukan |
| KPI | `kpi_total_cash_out` | Total pengeluaran |
| KPI | `kpi_net_cash_flow` | Selisih bersih Cash-In vs Cash-Out |
| KPI | `kpi_ending_balance` | Saldo akhir terkini |
| KPI | `kpi_total_transactions` | Total jumlah transaksi |
| KPI | `kpi_avg_daily_income` | Rata-rata pemasukan harian |
| KPI | `kpi_avg_daily_expense` | Rata-rata pengeluaran harian |
| Chart | `chart_monthly_cashflow` | Cash-in vs Cash-out per bulan |
| Chart | `chart_balance_trend` | Tren running balance |
| Chart | `chart_expense_category` | Breakdown kategori pengeluaran |
| Chart | `chart_income_category` | Breakdown kategori pemasukan |
| Chart | `chart_payment_method` | Distribusi metode pembayaran |
| Table | `table_largest_expenses` | Top 10 transaksi terbesar |
| Table | `table_largest_income` | Top 10 pemasukan terbesar |
| Table | `table_latest_transactions` | 20 transaksi terbaru |
| Analytics | `analytics_monthly_summary` | Ringkasan bulanan lengkap |
| Analytics | `analytics_top_third_party` | Pihak ketiga terbesar |

Lihat semua query lengkap di [`queries/all_queries_04.sql`](./queries/all_queries_04.sql)

---

## 📁 File Structure

```
04-cash-flow/
├── pipeline_04.py          ← ETL pipeline utama
├── appscript/
│   └── export.js           ← fungsi doGet() + exportCashFlowAsJSON()
├── queries/
│   └── all_queries_04.sql  ← semua SQL queries untuk dashboard
├── data/
│   └── sample_output.json  ← contoh output JSON dari AppScript
└── README.md
```
