function doGet(e) {
  const output = exportLeadsAsJSON();
  return ContentService
    .createTextOutput(JSON.stringify(output, null, 2))
    .setMimeType(ContentService.MimeType.JSON);
}
 
function exportLeadsAsJSON() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Database Leads');
 
  if (!sheet) {
    return { error: true, message: 'Sheet Database Leads tidak ditemukan.' };
  }
 
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) {
    return { error: true, message: 'Database kosong.' };
  }
 
  // Header dari baris pertama
  const headers = data[0].map(h => String(h).trim());
 
  // Map nama header ke key yang bersih (snake_case, aman untuk Python & SQL)
  const keyMap = {
    'ID Leads':               'id_leads',
    'Lead Name':              'lead_name',
    'Company':                'company',
    'Source':                 'source',
    'Lead Number':            'lead_number',
    'Lead Email':             'lead_email',
    'Date':                   'created_date',
    'Status':                 'status',
    'Score':                  'lead_score',
    'Total Interaction':      'total_interaction',
    'Country / Region':       'country_region',
    'Service':                'service_interest',
    'Owner':                  'lead_owner',
    'Preferred Contact':      'preferred_contact',
    'Priority Level':         'priority_level',
    'Estimated Budget Range': 'estimated_budget',
    'Notes Summary':          'notes_summary',
    'Stage':                  'decision_stage',
    'Contract Status':        'contract_status',
    'Budget':                 'project_budget',
    'Contract Start':         'contract_start',
    'Contract End':           'contract_end',
    'Last Contact Date':      'last_contact_date',
    'Follow Up':              'next_followup_date'
  };
 
  const records = [];
  const exportedAt = Utilities.formatDate(
    new Date(),
    Session.getScriptTimeZone(),
    "yyyy-MM-dd'T'HH:mm:ss'Z'"
  );
 
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
 
    // Skip baris kosong (cek kolom A = ID Leads)
    if (!row[0] || String(row[0]).trim() === '') continue;
 
    const record = {};
    headers.forEach((header, idx) => {
      const key = keyMap[header] || header.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
      let value = row[idx];
 
      // Normalisasi tipe data
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
    error:       false,
    tool:        '02_client_pipeline',
    exported_at: exportedAt,
    total_rows:  records.length,
    columns:     Object.keys(records[0] || {}),
    data:        records
  };
}
 
// ------------------------------------------------------------
// TRIGGER MANUAL — bisa dipanggil dari menu untuk test
// ------------------------------------------------------------
function testExportJSON() {
  const result = exportLeadsAsJSON();
  Logger.log('Total rows exported: ' + result.total_rows);
  Logger.log('Columns: ' + JSON.stringify(result.columns));
  Logger.log('First record: ' + JSON.stringify(result.data[0]));
  SpreadsheetApp.getUi().alert(
    'Export berhasil!\n' +
    'Total leads: ' + result.total_rows + '\n' +
    'Exported at: ' + result.exported_at
  );
}
