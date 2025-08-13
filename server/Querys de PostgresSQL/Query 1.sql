-- Crear la base de datos (solo si no existe)
CREATE DATABASE creditos_app;

/*Ruta General*/
\c creditos_app;

/*Ruta local*/
--C:\Users\User\creditos-app\server\Querys de PostgresSQL

-- Crear tabla de créditos
CREATE TABLE IF NOT EXISTS credits (
  id BIGSERIAL PRIMARY KEY,
  customer_name       VARCHAR(120) NOT NULL,
  customer_id         VARCHAR(60)  NOT NULL,
  amount              NUMERIC(18,2) NOT NULL,
  interest_rate       NUMERIC(5,2)  NOT NULL,
  term_months         INT           NOT NULL,
  salesperson         VARCHAR(120)  NOT NULL,
  created_at          TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices para mejorar búsquedas y ordenamientos
CREATE INDEX IF NOT EXISTS ix_credits_customer_name ON credits(customer_name);
CREATE INDEX IF NOT EXISTS ix_credits_customer_id   ON credits(customer_id);
CREATE INDEX IF NOT EXISTS ix_credits_salesperson   ON credits(salesperson);
CREATE INDEX IF NOT EXISTS ix_credits_created_at    ON credits(created_at);
CREATE INDEX IF NOT EXISTS ix_credits_amount        ON credits(amount);
