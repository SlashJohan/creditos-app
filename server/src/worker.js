import 'dotenv/config';
import pg from 'pg';
import nodemailer from 'nodemailer';

const { Client } = pg;

async function startWorker() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  await client.connect();
  console.log('Worker escuchando canal: credit_created');
  await client.query('LISTEN credit_created');

  // Crear cuenta de prueba en Ethereal
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });

  client.on('notification', async (msg) => {
    try {
      const payload = JSON.parse(msg.payload);
      console.log('Nuevo crédito detectado:', payload);

      const mailOptions = {
        from: process.env.SMTP_FROM,
        to: process.env.TARGET_EMAIL,
        subject: `Nuevo crédito registrado #${payload.id}`,
        text: `Se ha registrado un nuevo crédito:\n\n` +
              `Cliente: ${payload.customer_name}\n` +
              `Identificación: ${payload.customer_id}\n` +
              `Monto: $${payload.amount}\n` +
              `Interés: ${payload.interest_rate}%\n` +
              `Plazo: ${payload.term_months} meses\n` +
              `Vendedor: ${payload.salesperson}\n`
      };

      const info = await transporter.sendMail(mailOptions);

      console.log(`Correo enviado por crédito #${payload.id}`);
      console.log(`Vista previa del correo: ${nodemailer.getTestMessageUrl(info)}`);

    } catch (error) {
      console.error('Error enviando correo:', error);
    }
  });
}

startWorker().catch(console.error);
