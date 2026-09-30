# Sistema de Feedback con Leads + Backend — Guía de instalación

Son 3 archivos:
- `index.html` → el sistema de feedback (ya con leads integrados y modo admin/equipo)
- `backend_feedback.gs` → el código del backend (Google Apps Script)
- esta guía

Seguí los pasos en orden. La única parte "nueva" es crear el backend (5 minutos, una sola vez).

---

## PARTE 1 — Crear el backend (una sola vez)

Esto es lo que hace que vos cargues datos y el equipo los vea.

1. Entrá a **https://sheets.google.com** y creá una **planilla nueva vacía**. Ponele el nombre que quieras (ej: "Feedback Backend"). No toques nada más.

2. En esa planilla, andá al menú **Extensiones → Apps Script**. Se abre un editor de código.

3. Borrá todo lo que haya en el editor y **pegá el contenido completo de `backend_feedback.gs`**.

4. En la línea que dice `var TOKEN_ADMIN = 'fiancar2026';` cambiá `fiancar2026` por la clave que quieras (o dejala así). **Anotá esa clave**, la vas a necesitar. Guardá con el ícono de disquete.

5. Arriba a la derecha, clic en **Implementar → Nueva implementación**.
   - Donde dice "Seleccionar tipo" (ícono de engranaje), elegí **Aplicación web**.
   - En "Ejecutar como": **Yo**.
   - En "Quién tiene acceso": **Cualquier persona** (importante, si no el equipo no puede leer).
   - Clic en **Implementar**.

6. Te va a pedir permisos la primera vez: **Autorizar acceso**, elegí tu cuenta, "Configuración avanzada" → "Ir a (nombre) (no seguro)" → **Permitir**. Es tu propio script, es seguro.

7. Al final te da una **URL** que termina en `/exec`. **Copiala.** Esa es la URL de tu backend.

---

## PARTE 2 — Conectar el HTML con el backend

1. Abrí `index.html` con el Bloc de notas (clic derecho → Abrir con → Bloc de notas).

2. Buscá esta línea (está cerca del principio del código, apretá Ctrl+B y buscá `PEGA_TU_URL`):
   ```
   var API_URL = 'PEGA_TU_URL_DE_APPS_SCRIPT_ACA';
   ```

3. Reemplazá `PEGA_TU_URL_DE_APPS_SCRIPT_ACA` por la URL que copiaste en el paso 7 de arriba. Debe quedar algo así:
   ```
   var API_URL = 'https://script.google.com/macros/s/AKfy..../exec';
   ```

4. Guardá el archivo.

---

## PARTE 3 — Subir a GitHub y usar

1. Subí el `index.html` a tu repositorio de GitHub (reemplazando el actual), igual que hacés siempre.

2. **Para vos (admin):** entrá a la página agregando `?admin=TU_CLAVE` al final de la URL. Ejemplo:
   ```
   https://novedadesgrupofiancar.github.io/performance/?admin=fiancar2026
   ```
   (usá la clave que pusiste en el paso 4 de la Parte 1)

   Con la clave vas a ver los botones: Gestionar datos, Generar Feedback, Control de Leads, Exportar, y **Publicar**.

3. **Para el equipo:** les pasás la URL **sin** el `?admin=`:
   ```
   https://novedadesgrupofiancar.github.io/performance/
   ```
   Ellos solo ven los datos, sin botones de edición.

---

## Cómo se usa el día a día

1. Entrás con tu URL de admin (`?admin=...`).
2. Cargás lo que tengas: CSV de llamadas, campañas, ownership, y los leads del día (botón **Control de Leads**).
3. Cuando quieras que el equipo vea lo actualizado, apretás **⬆ Publicar**.
4. Listo: el equipo, al abrir su URL, ve los datos que publicaste.

### Sobre los leads
- Botón **📊 Control de Leads**. Arriba tenés **Mes que se muestra y se publica**: ese selector define de qué mes es el puntaje que ve el equipo y que se publica. Tenelo en cuenta con el cierre de mes (ver más abajo).
- **Cargar un día** (solo admin): elegís agente y fecha, ponés **Gestionados** y **No gestionados**. Si hubo mal gestionados, marcás el check **"Hubo mal gestionados"** y se despliegan los 8 errores: marcás los del **peor** caso del día (el que tuvo más errores). Guardás. Repetís por agente.
- **Cómo se calcula:** cada día parte de 10. Cada **no gestionado** resta 2. Los **mal gestionados** restan 0,5 por cada error del peor caso (máximo −4). El puntaje del mes es el **promedio de los días cargados × 2,5** (0 a 25). Es proporcional: un mes bueno con errores sueltos da un número sano, no se funde.
- **Importar tus datos viejos de agosto:** en Control de Leads (modo admin) tenés **📥 Importar respaldo**. Subís los `backup_leads_....json` del tablero anterior (podés subir varios). Esos datos de agosto se calculan con la fórmula vieja y quedan en el mes de agosto, separados de septiembre. Piero y Shoanna se ignoran solos.
- **Respaldo:** botón **⬇ Descargar respaldo** baja un JSON con todo lo cargado. Hacelo cada tanto (una vez por semana alcanza): es tu red de seguridad. Si cambiás de compu o se borra el navegador, con **Importar respaldo** recuperás todo tal cual, con los puntajes.

### Guardado, robustez y cierre de mes (leer)
- **Cargar NO es publicar.** Cuando guardás un día, queda en tu navegador (tu "cuaderno de trabajo"). El equipo NO ve nada hasta que apretás **Publicar**.
- **Está atado al navegador:** si cargás en tu compu y después abrís en otra, no vas a ver lo no publicado. Cargá siempre en la misma compu/navegador y no le borres el caché durante el mes. Lo **publicado** sí está en la nube y se ve desde cualquier lado.
- **Tu caso agosto/septiembre:** dejá el selector en **Agosto** y publicá → el equipo ve agosto. Cambiá el selector a **Septiembre** y cargá el mes tranquilo: como no publicás, el equipo sigue viendo agosto. Cuando cierres septiembre, ponés el selector en Septiembre y **Publicar**: recién ahí el equipo pasa a ver septiembre.
- Si algo se borrara antes de publicar, importás el último **respaldo JSON** y recuperás todo.

---

## Notas importantes

- **La clave del `.gs` y la del `?admin=` tienen que ser IGUALES.** Si no, no vas a poder publicar.
- Mientras no configures la URL (Parte 2), el sistema funciona igual pero en "Modo local" (solo vos ves lo que cargás, no se comparte). Vas a ver el cartelito "Modo local" arriba.
- Publicar **pisa** el reporte anterior con el nuevo (es lo correcto: siempre se ve el último). No mezcla ni borra los datos de las llamadas del otro dashboard, porque este backend es aparte.
- Natasha no aparece en el ranking de campañas y tiene 20 puntos fijos por recepción, como pediste.
