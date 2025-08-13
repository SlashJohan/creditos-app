import nodemailer from 'nodemailer';

export function createTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

export async function sendCreditEmail({ customer_name, amount, salesperson, created_at }) {
  const transporter = createTransport();
  const to = process.env.TARGET_EMAIL;
  const html = `
    <h2>Nuevo crédito registrado</h2>
    <p><b>Cliente:</b> ${customer_name}</p>
    <p><b>Valor:</b> $${Number(amount).toLocaleString()}</p>
    <p><b>Comercial:</b> ${salesperson}</p>
    <p><b>Fecha:</b> ${new Date(created_at).toLocaleString()}</p>
  `;
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: 'Nuevo crédito registrado',
    html
  });
}
