# 🏢 Coworking Oxygen - Gestión de Empresas

Este proyecto es una aplicación web desarrollada para **Coworking Oxygen**, con el objetivo de digitalizar y facilitar la gestión de las empresas que forman parte de su espacio de coworking.

## 👥 Autores

- Oscar Gracia  
- Christian Gil  
- Daniel Poveda  

## 🚀 Tecnologías utilizadas

- **React** – Interfaz de usuario  
- **Redux Toolkit** – Gestión global del estado  
- **Firebase** –  
  - Firestore como base de datos  
  - Autenticación de usuarios  
  - Hosting para despliegue
- **Vite** – Herramienta de desarrollo y build    

## 📋 Descripción

Coworking Oxygen almacenaba sus datos de empresas en hojas de cálculo Excel. Este proyecto transforma esos datos en una **aplicación web dinámica** con funcionalidades como:

- Carga y validación de datos desde Excel
- Visualización de empresas en tablas interactivas
- Paginación, búsqueda y filtrado
- Formulario para ver y editar detalles de empresas
- Gestión de estados (activo, pendiente, inactivo)
- Indicadores visuales según el estado de cada empresa

## 🛠️ Estructura del proyecto

📁 src/<br>
├── common/ → Lógica compartida (hooks, helpers, etc.)<br>
├── components/ → Componentes reutilizables (tablas, botones, etc.)<br>
├── enums/ → Enumeraciones para estados y etiquetas<br>
├── interfaces/ → Tipado TypeScript (empresas, usuarios, etc.)<br>
├── layout/ → Estructura visual (navbars, wrappers, layout general)<br>
├── pages/ → Páginas principales (login, dashboard, empresa, etc.)<br>
├── store/ → Redux Toolkit (slices y configuración del store)<br>
├── firebaseConfig.ts → Configuración de Firebase<br>
├── App.tsx → Componente raíz con rutas<br>
├── main.tsx → Entrada principal de la app<br>
├── index.css → Estilos globales<br>
└── vite-env.d.ts → Tipado de Vite<br>

---

## ✅ Requisitos

- Node.js
- Cuenta de Firebase configurada con:
  - Firestore
  - Firebase Authentication
  - Firebase Hosting
- Archivo `serviceAccountKey.json` válido (colocado en la raíz del uploader)

---

## 🔐 Seguridad

El acceso a la aplicación está protegido mediante **Firebase Authentication**.  
Solo los usuarios autenticados pueden acceder a las funcionalidades de la aplicación, incluyendo visualización y edición de datos.

---

✨ Estado actual
 Carga de empresas desde Excel

 Tablas con paginación y visualización por estado

 Vista detallada por empresa

 Conexión completa con Firebase

 Edición de datos en frontend (en desarrollo)

📄 Licencia
Este proyecto es privado y desarrollado exclusivamente para Coworking Oxygen.
