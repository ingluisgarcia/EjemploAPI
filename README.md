# 🚀 API Backend con Express, Supabase y Vercel (Ejemplo de Clase)

Este proyecto es una API RESTful estructurada para ser fácilmente entendida en clase, compatible de forma nativa con **Vercel** (a través de Serverless Functions) y conectada a una base de datos PostgreSQL alojada en la nube mediante **Supabase**.

---

## 🛠️ Tecnologías Utilizadas

- **Entorno:** Node.js (con sintaxis moderna ES Modules `import/export`).
- **Framework Web:** Express.js (el estándar de la industria y el más sencillo de enseñar/aprender).
- **Base de Datos:** [Supabase](https://supabase.com) (PostgreSQL en la nube).
- **Seguridad / Conectividad:** Middleware `cors` configurado para admitir peticiones desde cualquier origen (React, Vue, Angular, Flutter, Postman, etc.).
- **Plataforma de Despliegue:** [Vercel](https://vercel.com) (usando reescritura hacia `api/index.js` mediante Serverless Functions).

---

## 📁 Estructura del Proyecto

```text
EjemploAPI/
├── api/
│   ├── index.js             # Entrada del servidor Express y handler para Vercel
│   ├── config/
│   │   └── supabase.js      # Conexión y cliente de Supabase
│   └── routes/
│       └── tareas.js        # Rutas CRUD (GET, POST, PUT, DELETE)
├── .env.example             # Ejemplo de variables de entorno
├── .env                     # Variables de entorno locales (no se sube a GitHub)
├── .gitignore               # Excluye node_modules y .env
├── vercel.json              # Configuración de rutas para Vercel
├── schema.sql               # Script SQL para crear la tabla en Supabase
├── package.json             # Dependencias y scripts de ejecución
└── README.md                # Esta guía paso a paso
```

---

## 📋 Paso 1: Configurar la Base de Datos en Supabase

1. Ve a [supabase.com](https://supabase.com) e inicia sesión o crea una cuenta gratuita.
2. Crea un **Nuevo Proyecto** (New Project) y asígnale un nombre y contraseña.
3. En el menú lateral izquierdo, ve a **SQL Editor**.
4. Abre el archivo [`schema.sql`](file:///home/cymaniatico/Documentos/dev/EjemploAPI/schema.sql) de este proyecto, copia todo su contenido, pégalo en el editor de Supabase y presiona **Run**.
   - Esto creará la tabla `tareas`, insertará 3 registros de prueba y desactivará RLS para facilitar las pruebas de clase sin lidiar con tokens de usuario.
5. Ve a **Project Settings** (el engranaje abajo a la izquierda) > **API**.
6. Copia los siguientes dos valores:
   - **Project URL** (ej: `https://xyzcompany.supabase.co`)
   - **anon / public key** (una cadena larga que empieza por `eyJ...`)

---

## 💻 Paso 2: Ejecución y Pruebas Locales

1. Copia o edita el archivo [`.env`](file:///home/cymaniatico/Documentos/dev/EjemploAPI/.env):
   ```env
   SUPABASE_URL=https://tu-proyecto.supabase.co
   SUPABASE_KEY=tu-anon-key-de-supabase
   PORT=3000
   ```
2. Instala las dependencias (si aún no lo has hecho):
   ```bash
   npm install
   ```
3. Inicia el servidor en modo desarrollo (se reinicia automáticamente con cambios):
   ```bash
   npm run dev
   ```
4. Abre en tu navegador o cliente HTTP:
   [http://localhost:3000](http://localhost:3000)

---

## 🌐 Paso 3: Despliegue en Vercel

### Opción A: Conectando GitHub (Recomendada para estudiantes)
1. Sube este proyecto a un repositorio de GitHub (recuerda que `.env` y `node_modules` están en `.gitignore` y no se subirán).
2. Ve a [vercel.com](https://vercel.com) e inicia sesión con tu cuenta de GitHub.
3. Haz clic en **"Add New..."** > **"Project"** e importa tu repositorio.
4. En la sección **"Environment Variables"**, agrega las dos variables de Supabase:
   - `SUPABASE_URL`: Tu URL de Supabase.
   - `SUPABASE_KEY`: Tu clave anon de Supabase.
5. Haz clic en **Deploy**. ¡Listo! Vercel te dará una URL pública tipo `https://tu-api.vercel.app`.

### Opción B: Usando la CLI de Vercel
```bash
npx vercel
# Sigue las instrucciones interactivas y configura las variables de entorno con:
# npx vercel env add SUPABASE_URL
# npx vercel env add SUPABASE_KEY
```

---

## 📡 Endpoints de la API

| Método | Endpoint | Descripción | Formato de `data` en la Respuesta |
|---|---|---|---|
| **GET** | `/` | Información y estado de la API | - |
| **GET** | `/api/tareas` | Obtener todas las tareas | `Array<Object>` (`[ { id, titulo, ... } ]`) |
| **GET** | `/api/tareas/:id` | Obtener una tarea por su ID | `Array<Object>` (`[ { id, titulo, ... } ]`) |
| **POST** | `/api/tareas` | Crear una nueva tarea | `{ "respuesta": "Tarea creada con éxito" }` |
| **PUT** | `/api/tareas/:id` | Actualizar una tarea existente | `{ "respuesta": "Tarea actualizada correctamente" }` |
| **DELETE**| `/api/tareas/:id` | Eliminar una tarea por ID | `Object` (`{ id, titulo, ... }`) |

> 📌 **Formato unificado para los GET:** Tanto la consulta de todas las tareas como la búsqueda por ID devuelven el campo `data` como un arreglo de objetos (`[ { ... } ]`), facilitando el consumo iterativo desde el frontend.

---

## 📝 Guía: Cómo Diligenciar las Peticiones POST y PUT

Para realizar peticiones **POST** y **PUT** correctamente desde clientes como **Postman**, **Thunder Client** (VS Code), **Insomnia** o desde código frontend (Fetch / Axios), ten en cuenta las siguientes especificaciones:

### ⚙️ Reglas Generales (Cabeceras y Formato)
1. **Header obligatorio:**
   - `Content-Type: application/json`
2. **Formato en Postman / Thunder Client:**
   - En la pestaña **Body**, selecciona la opción **raw**.
   - En el menú desplegable del tipo de contenido a la derecha, selecciona **JSON**.

---

### 🟢 1. Cómo diligenciar un POST (Crear Tarea)

* **Método:** `POST`
* **URL:** `http://localhost:3000/api/tareas` *(o `https://tu-api.vercel.app/api/tareas`)*

#### Campos aceptados en el Body JSON:

| Campo | Tipo | Obligatorio | Descripción | Valor por defecto |
|---|---|---|---|---|
| `titulo` | `string` | **Sí** | Título de la tarea. No puede estar vacío. | *Requerido* |
| `descripcion` | `string` | No (Opcional) | Detalle o nota de la tarea. | `null` |
| `completada` | `boolean` | No (Opcional) | Estado de la tarea (`true` o `false`). | `false` |

#### Ejemplos de Body JSON para POST:

* **Ejemplo Mínimo (solo campos obligatorios):**
  ```json
  {
    "titulo": "Estudiar para el examen de Express"
  }
  ```

* **Ejemplo Completo:**
  ```json
  {
    "titulo": "Preparar presentación de proyecto",
    "descripcion": "Diseñar diapositivas y verificar los endpoints en Vercel",
    "completada": false
  }
  ```

* **Paso a paso en Postman / Thunder Client:**
  1. Selecciona el método **POST**.
  2. Ingresa la URL: `http://localhost:3000/api/tareas`.
  3. Ve a la pestaña **Body** -> selecciona **raw** -> tipo **JSON**.
  4. Pega cualquiera de los JSON de ejemplo anteriores.
  5. Haz clic en **Send**.
  6. Recibirás un estado `201 Created` con el cuerpo:
     ```json
     {
       "respuesta": "Tarea creada con éxito"
     }
     ```

---

### 🟡 2. Cómo diligenciar un PUT (Actualizar Tarea)

* **Método:** `PUT`
* **URL:** `http://localhost:3000/api/tareas/:id` *(reemplaza `:id` por el número de ID de la tarea a modificar, ej: `/api/tareas/1`)*

#### Reglas de los campos:
* **No necesitas enviar todos los campos**: Puedes enviar solo el campo o campos que deseas modificar.
* **Debes enviar al menos un campo válido** (`titulo`, `descripcion` o `completada`).
* Si envías `completada`, debe ser un valor booleano (`true` o `false`), **no** texto entre comillas (`"true"`).

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `titulo` | `string` | Opcional | Nuevo título (no puede ser un texto en blanco). |
| `descripcion` | `string` | Opcional | Nueva descripción. |
| `completada` | `boolean` | Opcional | Nuevo estado booleano (`true` o `false`). |

#### Ejemplos de Body JSON para PUT según el caso:

* **Caso A: Solo marcar la tarea como completada o pendiente:**
  ```json
  {
    "completada": true
  }
  ```

* **Caso B: Modificar título y descripción:**
  ```json
  {
    "titulo": "Título actualizado de la tarea",
    "descripcion": "Nueva descripción detallada"
  }
  ```

* **Caso C: Modificar todos los campos:**
  ```json
  {
    "titulo": "Proyecto final terminado",
    "descripcion": "Todo listo y verificado",
    "completada": true
  }
  ```

* **Paso a paso en Postman / Thunder Client:**
  1. Selecciona el método **PUT**.
  2. Ingresa la URL con el ID de la tarea: ej. `http://localhost:3000/api/tareas/1`.
  3. Ve a la pestaña **Body** -> selecciona **raw** -> tipo **JSON**.
  4. Pega el JSON con los campos que quieres cambiar.
  5. Haz clic en **Send**.
  6. Recibirás un estado `200 OK` con el cuerpo:
     ```json
     {
       "respuesta": "Tarea actualizada correctamente"
     }
     ```

---

### ⚠️ Errores Comunes y Códigos de Respuesta

| Código | Causa frecuente | Solución |
|---|---|---|
| `400 Bad Request` | Falta el campo `"titulo"` en el `POST` o se envió vacío (`""`). | Asegúrate de incluir `"titulo": "Texto válido"`. |
| `400 Bad Request` | En `PUT` enviaste un body vacío `{}`. | Envía al menos uno de los tres campos permitidos. |
| `400 Bad Request` | Enviaste `"completada": "true"` (como string). | Envíalo como valor booleano sin comillas: `"completada": true`. |
| `400 Bad Request` | Sintaxis JSON inválida (comas sobrantes, comillas simples). | Verifica que tu JSON use comillas dobles `"` y sea válido. |
| `404 Not Found` | El ID enviado en la URL (`/api/tareas/:id`) no existe en la base de datos. | Verifica el ID consultando antes con `GET /api/tareas`. |

---

## 🧪 Ejemplos de Peticiones (cURL / Postman / Thunder Client)

### 1. Obtener todas las tareas (GET)
```bash
curl http://localhost:3000/api/tareas
```

### 2. Obtener una tarea por ID (GET)
```bash
curl http://localhost:3000/api/tareas/1
```

### 3. Crear una nueva tarea (POST)
```bash
curl -X POST http://localhost:3000/api/tareas \
  -H "Content-Type: application/json" \
  -d '{"titulo": "Hacer entrega de proyecto", "descripcion": "Subir el código a GitHub"}'
```

### 4. Actualizar una tarea (PUT)
```bash
curl -X PUT http://localhost:3000/api/tareas/1 \
  -H "Content-Type: application/json" \
  -d '{"completada": true}'
```

### 5. Eliminar una tarea (DELETE)
```bash
curl -X DELETE http://localhost:3000/api/tareas/1
```
