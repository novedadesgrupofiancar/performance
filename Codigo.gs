/**
 * Reporte Contact Center · Grupo Fiancar
 * Guarda el reporte publicado desde el dashboard y lo sirve al equipo.
 *
 * Pegar este código en script.google.com → Nuevo proyecto → implementar como app web.
 */

// CAMBIÁ ESTA CLAVE. Es la misma que vas a usar en la URL: ?admin=TU_CLAVE
const CLAVE = 'CAMBIAME_1234';

// Nombre del archivo donde queda guardado el reporte (se crea solo en tu Drive)
const ARCHIVO = 'cc_reporte.json';


/** Lectura: lo que consume el dashboard al abrirse. */
function doGet() {
  const f = buscarArchivo();
  const contenido = f ? f.getBlob().getDataAsString() : '{}';
  return ContentService.createTextOutput(contenido)
    .setMimeType(ContentService.MimeType.JSON);
}

/**Escritura: se dispara con el botón "Publicar para el equipo". */
function doPost(e) {
  try {
    if (!e || !e.postData) return json({ ok: false, error: 'Sin datos' });

    const body = JSON.parse(e.postData.contents);
    if (body.token !== CLAVE) return json({ ok: false, error: 'Clave incorrecta' });

    const data = body.data || {};
    data.publicado_el = new Date().toISOString();

    const texto = JSON.stringify(data);
    const f = buscarArchivo();
    if (f) f.setContent(texto);
    else DriveApp.createFile(ARCHIVO, texto, MimeType.PLAIN_TEXT);

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function buscarArchivo() {
  const it = DriveApp.getFilesByName(ARCHIVO);
  return it.hasNext() ? it.next() : null;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
