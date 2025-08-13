-- Nos aseguramos de que no exista una versión anterior
DROP TRIGGER IF EXISTS notify_credit_created ON credits;
DROP FUNCTION IF EXISTS notify_credit_created();

-- Creamos la función que enviará la notificación
CREATE OR REPLACE FUNCTION notify_credit_created()
RETURNS TRIGGER AS $$
DECLARE
    payload JSON;
BEGIN
    -- Construimos el JSON con todos los campos que necesitamos
    payload := json_build_object(
        'id', NEW.id,
        'customer_name', NEW.customer_name,
        'customer_id', NEW.customer_id,
        'amount', NEW.amount,
        'interest_rate', NEW.interest_rate,
        'term_months', NEW.term_months,
        'salesperson', NEW.salesperson,
        'created_at', NEW.created_at
    );

    -- Enviamos la notificación al canal "credit_created"
    PERFORM pg_notify('credit_created', payload::text);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Creamos el trigger para que se ejecute DESPUÉS de insertar en credits
CREATE TRIGGER notify_credit_created
AFTER INSERT ON credits
FOR EACH ROW
EXECUTE FUNCTION notify_credit_created();
