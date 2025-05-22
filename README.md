# 🔒 Mi Gestor de Contraseñas Personalizado

![[Imagen de la App Gestor de Contraseñas]](https://placehold.co/700x350/1f2937/d1d5db?text=Pantallazo+Principal+de+la+App&font=Inter)
*<p align="center">Un gestor de contraseñas de escritorio seguro y personalizable construido con Electron.</p>*

---

## 🌟 Características Principales

* **Interfaz Gráfica Intuitiva:** Diseño moderno y fácil de usar con temas personalizables.
* **Autenticación Segura (PIN):** Acceso inicial mediante un PIN (configurable).
* **Almacenamiento Local y Cifrado:** Las contraseñas se guardan en una base de datos SQLite local y se cifran utilizando AES-256-CBC.
* **Gestión Completa de Contraseñas (CRUD):**
    * Añadir, ver, editar y eliminar entradas.
    * Campos para nombre del sitio/app, nombre de usuario, contraseña, categoría y notas.
* **Categorías Predefinidas y Agrupación:** Organiza tus contraseñas en categorías como "Juegos", "Redes Sociales", "Personal", "Página Web" y "Otros".
    * Visualización agrupada en el panel lateral.
    * Etiquetas de categoría coloridas en la vista de detalles.
* **Generador de Contraseñas Seguras:**
    * Personaliza la longitud.
    * Opciones para incluir mayúsculas, minúsculas, números y símbolos.
    * Indicador visual de fortaleza de contraseña.
* **Personalización:**
    * **Temas:** Elige entre temas Oscuro (con degradado), Rojo (con degradado) y Azul (con degradado).
    * **Idiomas:** Soporte para Español e Inglés.
* **Funcionalidades Adicionales:**
    * Copia rápida de usuario y contraseña al portapapeles.
    * Opción para mostrar/ocultar contraseñas.
    * Búsqueda y filtrado de entradas.
    * Timestamps de creación y última modificación.
    * Encabezado de perfil personalizable en el sidebar con acceso rápido a ajustes.
    * Enlaces a perfiles sociales (GitHub, Discord) en la pantalla de PIN.
* **Construido con Tecnologías Modernas:** Electron, Node.js, Tailwind CSS, y `better-sqlite3`.

---

## 🖼️ Vistazos de la Aplicación

*(Aquí puedes añadir más capturas de pantalla o un GIF mostrando la aplicación en acción)*

| Pantalla de PIN Mejorada                                 | Vista Principal (Tema Oscuro)                               | Modal de Añadir Contraseña                               |
| :-------------------------------------------------------: | :----------------------------------------------------------: | :-------------------------------------------------------: |
| ![[Pantalla de PIN]](https://placehold.co/450x500/111827/e5e7eb?text=Login+Screen&font=Inter) | ![[Vista Principal]](https://placehold.co/800x600/111827/d1d5db?text=App+Dashboard&font=Inter) | ![[Modal Añadir]](https://placehold.co/450x550/1f2937/e5e7eb?text=Add+Password+Modal&font=Inter) |

---

## 🛠️ Tecnologías Utilizadas

* **Electron:** Para construir aplicaciones de escritorio multiplataforma con tecnologías web.
* **Node.js:** Entorno de ejecución para JavaScript del lado del servidor (y en Electron).
* **HTML5, CSS3, JavaScript:** Para la estructura, estilo y lógica de la interfaz.
* **Tailwind CSS:** Framework CSS de utilidad para un diseño rápido y moderno.
* **Font Awesome:** Para los iconos.
* **`better-sqlite3`:** Para la base de datos SQLite local, ofreciendo un acceso síncrono y eficiente.
* **`crypto-js` (o módulo `crypto` de Node):** Para el cifrado de contraseñas.

---

## 🚀 Cómo Empezar

Sigue estos pasos para ejecutar la aplicación en tu entorno local.

### Prerrequisitos

* **Node.js:** Asegúrate de tener Node.js instalado (preferiblemente una versión LTS). Puedes descargarlo desde [nodejs.org](https://nodejs.org/).
* **npm:** Viene incluido con Node.js.

### Instalación y Ejecución

1.  **Clona el repositorio:**
    ```bash
    git clone [https://github.com/tu-usuario/tu-repositorio.git](https://github.com/tu-usuario/tu-repositorio.git)
    cd tu-repositorio
    ```
    *(Reemplaza `tu-usuario/tu-repositorio` con la URL real de tu repositorio)*

2.  **Instala las dependencias:**
    ```bash
    npm install
    ```

3.  **Inicia la aplicación:**
    ```bash
    npm start
    ```
    La aplicación debería iniciarse y mostrar la pantalla de verificación de PIN. El PIN por defecto es `0000`.

---

## ⚠️ ¡IMPORTANTE! Advertencia de Seguridad

Este proyecto fue desarrollado como una herramienta de aprendizaje y demostración. **NO SE RECOMIENDA PARA ALMACENAR CONTRASEÑAS REALES Y SENSIBLES en su estado actual** por las siguientes razones:

* **PIN Fijo:** La versión actual utiliza un PIN codificado (`0000`) para el acceso. En una aplicación real, esto debería ser una contraseña maestra robusta y única definida por el usuario.
* **Derivación de Clave Simplificada:** La clave de cifrado se deriva del PIN fijo. Una contraseña maestra fuerte y un algoritmo de derivación de clave robusto (como Argon2id o PBKDF2 con una sal única) son esenciales para una seguridad adecuada.
* **Falta de Auditorías:** El código no ha sido sometido a auditorías de seguridad profesionales.

Si deseas utilizar un gestor de contraseñas para tus credenciales importantes, por favor, considera soluciones de código abierto auditadas y bien establecidas o servicios comerciales de confianza.

**Este proyecto es excelente para aprender sobre Electron, bases de datos locales, cifrado básico y desarrollo de UI, pero úsalo con precaución.**

## 👤 Autor

* **@gaelestabaocupado**
    * GitHub: [https://github.com/gaelestabaocupado](https://github.com/gaelbloqueado)
    * Discord: [https://discord.com/users/gaelbloqueado1](https://discord.com/users/gaelbloqueado1)
    * ¡Conéctate conmigo!

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.

---

*¡Gracias por revisar mi proyecto!*

