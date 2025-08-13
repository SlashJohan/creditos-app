# Creditos-App

## Descripción
Creditos-App es una aplicación que permite registrar y consultar créditos de clientes, integrando un backend con PostgreSQL y un frontend en React.

Captura de envio de correo de pruebas.png

## Tecnologías Utilizadas
- **Backend:** Node.js, Express, PostgreSQL, Nodemailer
- **Frontend:** React, Axios
- **Otras:** dotenv, CORS

## Instalación

1. Clona el repositorio:
   ```bash
   git clone <url-del-repositorio>


## Navega a la carpeta del proyecto

cd creditos-app

## instala las dependencias

npm install

## Crea un archivo .env con las variables de entorno necesarias (comparto ejemplo para mi caso personal).

Se utilizo Ethereal Email ya que no fue posible utilizar el medio general que seria con gmail o outlook generando una contraseña de aplicacion por que ya no esta permitido.

# Configuración del servidor backend
PORT=4000

# Configuración de PostgreSQL
DATABASE_URL=postgres://postgres:karina03@localhost:5432/creditos_app

# Configuración de SMTP para Ethereal (se llenará dinámicamente)
SMTP_HOST=
SMTP_PORT=
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
SMTP_FROM="Notificador Créditos <no-reply@example.com>"

# Correo de destino (solo para mostrar en el correo)
TARGET_EMAIL=fyasocialcapital@gmail.com



## Inicia el servidor:

npm run dev


## Uso

El backend se ejecuta en http://localhost:4000.
El frontend se ejecuta en http://localhost:3000 (o el puerto que uses).
