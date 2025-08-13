import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { pool } from './db.js';
import { z } from 'zod';

const app = express();
app.use(cors());
app.use(express.json());

// =======================
// Validación con Zod
// =======================
const CreditSchema = z.object({
  customer_name: z.string().min(2, 'El nombre del cliente es obligatorio'),
  customer_id: z.string().min(3, 'La identificación es obligatoria'),
  amount: z.preprocess((val) => Number(val), z.number().positive('El monto debe ser mayor a 0')),
  interest_rate: z.preprocess((val) => Number(val), z.number().positive('La tasa de interés debe ser mayor a 0')),
  term_months: z.preprocess((val) => Number(val), z.number().int().positive('El plazo debe ser mayor a 0')),
  salesperson: z.string().min(2, 'El vendedor es obligatorio')
});

// =======================
// Ruta para consultar créditos con filtros y orden
// =======================
app.get('/api/credits', async (req, res) => {
  try {
    const { q, customer_id, salesperson, orderBy = 'created_at', order = 'desc', page = 1, size = 10 } = req.query;

    const allowedOrderBy = ['created_at', 'amount'];
    const allowedOrder = ['asc', 'desc'];

    const sortCol = allowedOrderBy.includes(String(orderBy)) ? orderBy : 'created_at';
    const sortDir = allowedOrder.includes(String(order)) ? order : 'desc';
    const limit = Math.min(Number(size) || 10, 100);
    const offset = (Math.max(Number(page) || 1, 1) - 1) * limit;

    const params = [];
    const where = [];

    if (q) {
      params.push(`%${q}%`);
      where.push(`customer_name ILIKE $${params.length}`);
    }
    if (customer_id) {
      params.push(customer_id);
      where.push(`customer_id = $${params.length}`);
    }
    if (salesperson) {
      params.push(`%${salesperson}%`);
      where.push(`salesperson ILIKE $${params.length}`);
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const sql = `
      SELECT id, customer_name, customer_id, amount, interest_rate, term_months, salesperson, created_at
      FROM credits
      ${whereSql}
      ORDER BY ${sortCol} ${sortDir}
      LIMIT ${limit} OFFSET ${offset};
    `;
    const countSql = `SELECT COUNT(*) FROM credits ${whereSql};`;

    const [rowsResult, countResult] = await Promise.all([
      pool.query(sql, params),
      pool.query(countSql, params)
    ]);

    res.json({ data: rowsResult.rows, total: Number(countResult.rows[0].count) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error consultando créditos' });
  }
});

// =======================
// Ruta para registrar un crédito
// =======================
app.post('/api/credits', async (req, res) => {
  try {
    const parsed = CreditSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Datos inválidos', details: parsed.error.format() });
    }

    const c = parsed.data;

    const insertSql = `
      INSERT INTO credits (customer_name, customer_id, amount, interest_rate, term_months, salesperson)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, customer_name, customer_id, amount, interest_rate, term_months, salesperson, created_at;
    `;
    const { rows } = await pool.query(insertSql, [
      c.customer_name,
      c.customer_id,
      c.amount,
      c.interest_rate,
      c.term_months,
      c.salesperson
    ]);

    const credit = rows[0];

    // NOTIFY para que un worker pueda enviar correo (opcional)
    const payload = JSON.stringify({
      id: credit.id,
      customer_name: credit.customer_name,
      amount: credit.amount,
      salesperson: credit.salesperson,
      created_at: credit.created_at
    });
    // await pool.query(`NOTIFY credit_created, '${payload.replace(/'/g, "''")}'`);

    res.status(201).json({ data: credit });
  } catch (err) {
    console.error('Error registrando crédito:', err);
    res.status(500).json({ error: 'Error registrando crédito' });
  }
});

// =======================
// Ruta de prueba
// =======================
app.get('/', (_req, res) => res.send('API Créditos funcionando 🚀'));

// =======================
// Iniciar servidor
// =======================
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API en http://localhost:${PORT}`));
