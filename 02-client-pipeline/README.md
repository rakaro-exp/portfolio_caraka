# 02 — Client Pipeline & Lead Tracking System

**Live Dashboard:** `[link web app]`  
**Data Source:** Google Sheets (private) · Exported via AppScript Web App

---

## 📋 Deskripsi

Sistem manajemen pipeline penjualan yang merekam seluruh perjalanan leads dari pertama kali masuk hingga signed contract. Dibangun untuk mensimulasikan workflow CRM nyata dengan otomasi penuh menggunakan AppScript.

**Masalah yang diselesaikan:**
- Tracking ratusan leads tanpa tools berbayar
- Otomasi entry dan update data tanpa risiko human error
- Visibilitas pipeline real-time untuk decision making

---

## 🗂️ Struktur Data

**Tabel: `leads`** (24 kolom)

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `id_leads` | TEXT PK | Auto-generated (format: LRK2507XXX) |
| `lead_name` | TEXT | Nama lengkap lead |
| `company` | TEXT | Nama perusahaan |
| `source` | TEXT | Sumber lead (referral, social media, dll) |
| `lead_number` | TEXT | Nomor kontak |
| `lead_email` | TEXT | Email |
| `created_date` | TEXT | Tanggal lead masuk |
| `status` | TEXT | New / Contacted / Qualified / Closed |
| `lead_score` | REAL | Skor kualifikasi 0–100 |
| `total_interaction` | REAL | Jumlah interaksi tercatat |
| `country_region` | TEXT | Negara / wilayah |
| `service_interest` | TEXT | Layanan yang diminati |
| `lead_owner` | TEXT | PIC yang menangani |
| `preferred_contact` | TEXT | Metode kontak forehand |
| `priority_level` | TEXT | High / Medium / Normal / Low |
| `estimated_budget` | TEXT | Estimasi budget range |
| `notes_summary` | TEXT | Catatan ringkas |
| `decision_stage` | TEXT | Tahap keputusan |
| `contract_status` | TEXT | Not Started / Signed / In Progress |
| `project_budget` | REAL | Nilai kontrak aktual |
| `contract_start` | TEXT | Tanggal mulai kontrak |
| `contract_end` | TEXT | Tanggal selesai kontrak |
| `last_contact_date` | TEXT | Tanggal kontak terakhir |
| `next_followup_date` | TEXT | Jadwal follow-up berikutnya |

---

## ⚙️ Pipeline

```
Google Sheets (Database Leads)
    ↓  AppScript doGet() → JSON
pipeline_02.py
    ↓  fetch → clean → validate → upsert
leads_db.sqlite
    ↓  SQL queries (19 queries)
Dashboard Web App
```

**Jalankan pipeline:**
```bash
pip install requests
python pipeline_02.py --url "YOUR_WEBAPP_URL"
```

---

## 📊 KPI & Queries

| # | Label | Keterangan |
|---|-------|-----------|
| KPI | `kpi_total_leads` | Total semua leads |
| KPI | `kpi_qualified_leads` | Leads dengan status Qualified |
| KPI | `kpi_signed_clients` | Leads dengan contract Signed |
| KPI | `kpi_conversion_rate` | Signed / Total × 100% |
| KPI | `kpi_avg_lead_score` | Rata-rata skor kualifikasi |
| KPI | `kpi_total_signed_budget` | Total nilai kontrak signed |
| Chart | `chart_leads_by_month` | Tren leads per bulan |
| Chart | `chart_source_breakdown` | Distribusi sumber lead |
| Chart | `chart_status_breakdown` | Distribusi status lead |
| Chart | `chart_decision_stage` | Breakdown decision stage |
| Chart | `chart_signed_budget_by_source` | Budget signed per source |
| Table | `table_top_qualified` | Top 10 qualified leads |
| Table | `table_high_priority` | High priority leads belum signed |
| Table | `table_signed_clients` | Detail semua signed clients |
| Analytics | `analytics_pipeline_funnel` | Funnel conversion keseluruhan |
| Analytics | `analytics_score_distribution` | Distribusi tier skor |

Lihat semua query lengkap di [`queries/all_queries_02.sql`](./queries/all_queries_02.sql)

---

## 📁 File Structure

```
02-client-pipeline/
├── pipeline_02.py          ← ETL pipeline utama
├── appscript/
│   └── export.js           ← fungsi doGet() + exportLeadsAsJSON()
├── queries/
│   └── all_queries_02.sql  ← semua SQL queries untuk dashboard
├── data/
│   └── sample_output.json  ← contoh output JSON dari AppScript
└── README.md
```
