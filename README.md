# Finder

![Laravel](https://img.shields.io/badge/Laravel-12.x-red?logo=laravel)
![React](https://img.shields.io/badge/React-19.x-blue?logo=react)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?logo=mysql)
![Inertia.js](https://img.shields.io/badge/Inertia.js-0.10-purple)

**Finder** es una aplicación web desarrollada con **Laravel** e **Inertia.js (React)**, diseñada para facilitar la búsqueda y gestión de negocios locales de manera rápida y eficiente.

## Tecnologías utilizadas

- **Laravel**: Framework PHP para el backend.
- **Inertia.js + React**: Para la construcción del frontend moderno sin perder la simplicidad de Laravel.
- **MySQL**: Base de datos relacional para almacenamiento de información.
- **Google Auth Login**: Autenticación de usuarios mediante Google.

## Arquitectura del proyecto

El proyecto sigue una arquitectura **Controlador → Servicio → Repositorio**, lo que permite una separación clara de responsabilidades:

- **Controlador**: Recibe las solicitudes HTTP y coordina la ejecución de la lógica.
- **Servicio**: Contiene la lógica de negocio central.
- **Repositorio**: Encargado de la interacción con la base de datos.

Para la validación y manejo de datos de entrada se utilizan **DTOs (Data Transfer Objects)**, asegurando que los datos recibidos sean consistentes y seguros antes de procesarlos.

## Funcionalidades principales

- Registro e inicio de sesión mediante **Google Auth**.
- Gestión y búsqueda de negocios locales.
- Interfaz moderna y reactiva gracias a **React** con **Inertia.js**.

## Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/tu-usuario/finder.git
```
