# ServiConnect - Encuesta de Validación de Mercado

Este es un proyecto desarrollado con **Node.js** (Express) en el backend y un frontend altamente responsivo y dinámico, utilizando HTML5 semántico, CSS3 moderno (con efectos de glassmorphic, gradientes dinámicos y micro-animaciones) y Javascript puro.

Guarda de manera local y rápida las respuestas de los usuarios en una base de datos basada en un archivo JSON.

---

## 🚀 Cómo Iniciar el Proyecto Localmente

### 1. Requisitos Previos
* **Node.js** (versión 16 o superior recomendada)
* **Git** instalado en tu sistema

### 2. Inicializar dependencias
Ejecuta el siguiente comando en la raíz del proyecto para instalar las dependencias necesarias:
```bash
npm install
```

### 3. Ejecutar el servidor
Tienes dos modos de ejecución:

* **Modo Producción/Estándar:**
  ```bash
  npm start
  ```
  Iniciará el servidor Express en el puerto `3000`.

* **Modo Desarrollo (con auto-recarga al editar archivos):**
  ```bash
  npm run dev
  ```

Una vez que el servidor esté activo, abre tu navegador y dirígete a:
👉 [http://localhost:3000](http://localhost:3000)

---

## 📁 Estructura del Proyecto

* [server.js](file:///C:/Users/odtgo/Desktop/encuestaAppServicios/server.js): Servidor Express. Maneja la entrega del sitio estático y expone la API REST para guardar y consultar los resultados.
* [public/index.html](file:///C:/Users/odtgo/Desktop/encuestaAppServicios/public/index.html): Documento HTML de la encuesta. Contiene la interfaz multi-paso (una pregunta a la vez).
* [public/style.css](file:///C:/Users/odtgo/Desktop/encuestaAppServicios/public/style.css): Estilos visuales con un diseño premium moderno (fondo oscuro con glows ambientales, translucidez blur, transiciones y responsividad móvil).
* [public/app.js](file:///C:/Users/odtgo/Desktop/encuestaAppServicios/public/app.js): Controla la lógica de navegación del quiz, validaciones del cliente, limitaciones de opciones múltiples, control condicional e integración con la API REST.
* `data/encuestas.json`: El archivo que actúa como base de datos (se crea automáticamente en la primera ejecución).

---

## 🛠️ Comandos de Inicialización (Paso a Paso)

Si deseas recrear o saber cómo se inicializó el proyecto desde cero:

### En Node.js:
1. Crear carpeta del proyecto e ingresar a ella:
   ```bash
   mkdir encuestaAppServicios
   cd encuestaAppServicios
   ```
2. Inicializar archivo de configuración de Node:
   ```bash
   npm init -y
   ```
3. Instalar Express (framework web):
   ```bash
   npm install express
   ```

### En Git / GitHub:
Para subir este código a tu cuenta de GitHub, sigue estos comandos en tu terminal:

1. Inicializar repositorio local (Ya realizado en este directorio):
   ```bash
   git init
   ```
2. Agregar todos los archivos al área de preparación (stage):
   ```bash
   git add .
   ```
3. Crear tu primer commit local (Ya realizado en este directorio):
   ```bash
   git commit -m "Initial commit: Survey app setup with Express backend and quiz frontend"
   ```
4. Crear un nuevo repositorio vacío en tu cuenta de **GitHub** (sin README, sin .gitignore).
5. Vincular tu repositorio local con GitHub y empujar la rama principal:
   *(Reemplaza `TU_USUARIO` y `TU_REPOSITORIO` con tus datos de GitHub)*
   ```bash
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
   git push -u origin main
   ```

---

## 📝 Especificación de Preguntas y Lógica

La encuesta recopila las siguientes variables:
* **nombre** (Opcional) - Ingresado en el paso final.
* **telefono** (Opcional) - Ingresado en el paso final.
* **r1** (Obligatorio) - Experiencia previa en contratación.
* **r2** (Opcional) - Frecuencia de uso anual.
* **r3** (Opcional) - Canal de adquisición habitual.
* **r4** (Opcional, hasta 2 opciones) - Fricción o dolor principal al contratar.
* **r5** (Opcional) - Factor de decisión de compra.
* **r6** (Opcional, condicional) - Interés en usar la app (si selecciona "Tal vez", habilita un campo de texto para detallar sus condiciones).

### Base de Datos en Archivo (`data/encuestas.json`)
Las encuestas se almacenan de la siguiente manera:
```json
[
  {
    "id": "l2a1bc34_xyz",
    "fecha": "2026-06-24T12:00:00.000Z",
    "nombre": "Juan Pérez",
    "telefono": "5512345678",
    "r1": "Sí",
    "r2": "3-5 veces",
    "r3": "c) Buscar en Google Maps / Internet",
    "r4": [
      "a) Que haga un mal trabajo y no dé garantía",
      "d) Inseguridad de meter a un desconocido a casa"
    ],
    "r5": "a) Recomendación de un conocido",
    "r6": "Tal vez, dependería de: Que los precios base sean reales y las reseñas estén verificadas."
  }
]
```

---

## 🖥️ Endpoints de la API
* `POST /api/encuesta`: Guarda las respuestas de una encuesta en el archivo JSON.
* `GET /api/encuesta`: Devuelve un arreglo JSON con todas las encuestas guardadas (ideal para consultar los resultados recopilados).
