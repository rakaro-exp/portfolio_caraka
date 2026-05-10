# 🚀 Portfolio Super Power — End-to-End Data Engineering & BI System

**Caraka Hilmi A.S** · Data Engineer & Business Intelligence Developer

---

## 🎯 Tentang Portfolio Ini

Portfolio ini bukan sekadar kumpulan dashboard. Ini adalah **sistem data end-to-end yang fully operational** — dari entry data, otomasi, processing, querying, hingga visualisasi — dibangun dengan tools yang digunakan di dunia nyata.

Setiap tool dalam portfolio ini mensimulasikan stack data perusahaan modern:

| Stack Nyata | Stack Portfolio |
|-------------|----------------|
| CRM / ERP | Google Sheets + AppScript |
| ETL Pipeline | Python |
| Data Warehouse | SQLite |
| SQL Analytics | SQL Queries |
| BI Dashboard | AppScript Web App |

---

## 🏗️ Arsitektur Sistem

```
┌─────────────────────────────────────────────────────┐
│  LAYER 1 — Data Source                              │
│  Google Sheets + AppScript (form entry → database)  │
└────────────────────┬────────────────────────────────┘
                     │ JSON via Web App URL
┌────────────────────▼────────────────────────────────┐
│  LAYER 2 — ETL Pipeline                             │
│  Python (fetch → clean → validate → load)           │
└────────────────────┬────────────────────────────────┘
                     │ SQLite (.sqlite)
┌────────────────────▼────────────────────────────────┐
│  LAYER 3 — Query Engine                             │
│  SQL (KPI queries → aggregated result sets)         │
└────────────────────┬────────────────────────────────┘
                     │ Result layer
┌────────────────────▼────────────────────────────────┐
│  LAYER 4 — Dashboard                                │
│  AppScript Web App (5 tabs: desc, raw, SQL, py, viz)│
└─────────────────────────────────────────────────────┘
```

---

## 📦 Tools Portfolio

### [02 — Client Pipeline & Lead Tracking System](./02-client-pipeline/)
Sistem manajemen pipeline penjualan dan tracking leads dari entry hingga signed contract.

**Stack:** Google Sheets · AppScript · Python · SQLite · SQL  
**Data:** 24 kolom · Pipeline funnel · Contract management · Follow-up scheduling  
**Live Dashboard:** `[link web app]`

---

### [04 — Cash Flow Monitoring & Financial Reporting](./04-cash-flow/)
Sistem monitoring arus kas real-time dengan kategorisasi transaksi dan laporan keuangan otomatis.

**Stack:** Google Sheets · AppScript · Python · SQLite · SQL  
**Data:** 316 transaksi · Cash-in/out · Running balance · Multi payment method  
**Live Dashboard:** `[link web app]`

---

### [09 — Revenue Operations & Inventory System](./09-revenue-ops/)
Sistem operasional penjualan dengan manajemen inventori, POS transaction, dan analisis margin produk.

**Stack:** Google Sheets · AppScript · Python · SQLite · SQL  
**Data:** 104 transaksi · 100 SKU · Stockout tracking · Margin analysis  
**Live Dashboard:** `[link web app]`

---

## 🔄 Cara Kerja Pipeline

```bash
# 1. AppScript Web App mengexport data sebagai JSON
GET https://script.google.com/macros/s/{ID}/exec
→ { "data": [...], "total_rows": N, "exported_at": "..." }

# 2. Python fetch, clean, dan load ke SQLite
python 02-client-pipeline/pipeline_02.py
python 04-cash-flow/pipeline_04.py
python 09-revenue-ops/pipeline_09.py

# 3. SQL queries dijalankan untuk menghasilkan KPI
# → Hasil dikonsumsi oleh Web App Dashboard
```

Pipeline berjalan otomatis setiap hari pukul **00:01 WIB** via GitHub Actions.

---

## 🛠️ Tech Stack

![Google Sheets](https://img.shields.io/badge/Google_Sheets-34A853?style=flat&logo=google-sheets&logoColor=white)
![AppScript](https://img.shields.io/badge/Apps_Script-4285F4?style=flat&logo=google&logoColor=white)
![Python](https://img.shields.io/badge/Python_3.13-3776AB?style=flat&logo=python&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=flat&logo=sqlite&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat&logo=github-actions&logoColor=white)

---

## 📁 Struktur Repository

```
portfolio-caraka/
├── .gitignore
├── README.md
├── .github/
│   └── workflows/
│       └── daily_pipeline.yml      ← otomasi harian
├── 02-client-pipeline/
│   ├── README.md
│   ├── pipeline_02.py
│   ├── appscript/
│   │   └── export.js
│   ├── queries/
│   │   └── all_queries_02.sql
│   └── data/
│       └── sample_output.json      ← sample (bukan db asli)
├── 04-cash-flow/
│   ├── README.md
│   ├── pipeline_04.py
│   ├── appscript/
│   │   └── export.js
│   ├── queries/
│   │   └── all_queries_04.sql
│   └── data/
│       └── sample_output.json
└── 09-revenue-ops/
    ├── README.md
    ├── pipeline_09.py
    ├── appscript/
    │   └── export.js
    ├── queries/
    │   └── all_queries_09.sql
    └── data/
        └── sample_output.json
```

---

## 📬 Contact

**Caraka Hilmi A.S**  
📧 `raka.warok@gmail.com`  
💼 `@carakahilmi`  
🌐 `masraka.framer.website`
