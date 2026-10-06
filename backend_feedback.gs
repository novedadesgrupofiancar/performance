/**
 * Backend del Sistema de Feedback — Grupo Fiancar
 * Guarda y sirve el reporte de feedback (puntajes + leads) para todo el equipo.
 *
 * CÓMO FUNCIONA:
 *  - doGet()  -> devuelve el último reporte publicado (lo usa todo el equipo al abrir la página).
 *  - doPost() -> guarda un reporte nuevo. Solo funciona si el token coincide (es tu clave de admin).
 *
 * Guarda los datos en una hoja de cálculo (celda A1), que se crea sola la primera vez.
 */

// 🔑 PONÉ ACÁ TU CLAVE DE ADMIN. Tiene que ser LA MISMA que usás en la URL como ?admin=ESTA_CLAVE
var TOKEN_ADMIN = 'fiancar2026';

// Nombre de la hoja donde se guarda (no hace falta tocar)
var NOMBRE_HOJA = 'feedback_data';

function _hoja() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(NOMBRE_HOJA);
  if (!sh) { sh = ss.insertSheet(NOMBRE_HOJA); }
  return sh;
}

function doGet(e) {
  var out = { };
  try {
    var val = _hoja().getRange('A1').getValue();
    if (val) {
      out = JSON.parse(val);
    } else {
      out = { agents: null };
    }
  } catch (err) {
    out = { agents: null, error: String(err) };
  }
  return ContentService
    .createTextOutput(JSON.stringify(out))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var res = { ok: false };
  try {
    var body = JSON.parse(e.postData.contents);
    if (!body || body.token !== TOKEN_ADMIN) {
      res.error = 'Token invalido';
      return ContentService.createTextOutput(JSON.stringify(res))
        .setMimeType(ContentService.MimeType.JSON);
    }
    var data = body.data || {};
    data.publicado_el = new Date().toISOString();
    _hoja().getRange('A1').setValue(JSON.stringify(data));
    res.ok = true;
    res.publicado_el = data.publicado_el;
  } catch (err) {
    res.error = String(err);
  }
  return ContentService.createTextOutput(JSON.stringify(res))
    .setMimeType(ContentService.MimeType.JSON);
}
