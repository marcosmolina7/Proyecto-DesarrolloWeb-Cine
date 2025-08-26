<<<<<<< HEAD
# 🎬 Backend - Sistema de Cine

Este proyecto corresponde al **backend** de un sistema de cine, desarrollado con **NestJS**, **Prisma** y **PostgreSQL**.  
Se ha implementado un esquema modular y en capas, siguiendo las buenas prácticas de NestJS, utilizando **DTOs, Services, Controllers, Modules, Guards, Decorators** y **Auth con JWT + bcrypt**.

---

## 🚀 Tecnologías utilizadas

- **[NestJS](https://nestjs.com/)** - Framework para Node.js con arquitectura modular.
- **[TypeScript](https://www.typescriptlang.org/)** - Lenguaje base para mayor tipado y escalabilidad.
- **[Prisma](https://www.prisma.io/)** - ORM moderno para comunicación con la base de datos.
- **[PostgreSQL](https://www.postgresql.org/)** - Motor de base de datos relacional.
- **[JWT](https://jwt.io/)** - Manejo de autenticación y sesiones.
- **[bcrypt](https://www.npmjs.com/package/bcrypt)** - Encriptación de contraseñas.

---

## 📂 Estructura del proyecto

El proyecto sigue la filosofía de **arquitectura modular en capas**:

Cada módulo cuenta con su propia carpeta que incluye:
- **Controller** → Maneja las rutas y peticiones HTTP.
- **Service** → Contiene la lógica de negocio.
- **DTOs** → Validación y tipado de datos.
- **Module** → Ensambla el módulo dentro del ecosistema NestJS.

---

## 🔑 Autenticación

Se utiliza **JWT** para la gestión de sesiones y roles.  
- Las contraseñas se almacenan usando **bcrypt** (hash + salt).  
- Se incluyen **Guards** y **Decorators** para proteger rutas y manejar permisos según roles.

---

## ⚙️ Instalación y configuración

### 1️⃣ Clonar el repositorio
```bash
git clone https://github.com/Marioooooc/Backend-Cine.git
cd Backend-Cine

2️⃣ Instalar dependencias
bash
npm install

3️⃣ Configurar variables de entorno
Crear un archivo .env en la raíz del proyecto con el siguiente contenido:
DATABASE_URL="postgresql://usuario:password@localhost:5432/cine_db"

4️⃣ Ejecutar migraciones con Prisma
npx prisma migrate dev

5️⃣ Levantar el servidor
npm run start:dev

📌 Scripts disponibles
npm run start → Inicia la app en modo producción.
npm run start:dev → Inicia en modo desarrollo con hot reload.
npm run build → Compila el proyecto a JavaScript.
npx prisma studio → Interfaz visual de Prisma para la BD.

🧱 Modelo de diseño
El sistema sigue un patrón modular en capas, caracterizado por:
Separación de responsabilidades (Controller ↔ Service ↔ DTO).
Arquitectura escalable mediante módulos independientes.
Facilidad de mantenimiento y extensión (agregar nuevos módulos sin romper los existentes).

👨‍💻 Autor
Desarrollado por: Mario Noel Molina Che
Proyecto académico/profesional para la gestión de un Sistema de Cine.
=======
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
>>>>>>> d77cca8e6f166149a821b940edbb47a89d6d33e3
