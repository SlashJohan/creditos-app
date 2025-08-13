import React, { useState } from 'react';
import axios from 'axios';

export default function CreditForm({ onCreditAdded }) {
  const [form, setForm] = useState({
    customer_name: '',
    customer_id: '',
    amount: '',
    interest_rate: '',
    term_months: '',
    salesperson: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ==========================
  // Validación de frontend
  // ==========================
  const validateForm = () => {
    const newErrors = {};

    if (!form.customer_name.trim()) newErrors.customer_name = 'El nombre del cliente es obligatorio';
    if (!form.customer_id.trim()) newErrors.customer_id = 'La identificación es obligatoria';
    if (!form.salesperson.trim()) newErrors.salesperson = 'El vendedor es obligatorio';

    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) {
      newErrors.amount = 'El monto debe ser un número positivo';
    }

    if (!form.interest_rate || isNaN(form.interest_rate) || Number(form.interest_rate) <= 0) {
      newErrors.interest_rate = 'La tasa de interés debe ser un número positivo';
    }

    if (!form.term_months || isNaN(form.term_months) || Number(form.term_months) <= 0) {
      newErrors.term_months = 'El plazo debe ser un número positivo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ==========================
  // Manejo de cambios
  // ==========================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ==========================
  // Submit del formulario
  // ==========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Convertir números antes de enviar
      const payload = {
        ...form,
        amount: Number(form.amount),
        interest_rate: Number(form.interest_rate),
        term_months: Number(form.term_months),
      };

      await axios.post('http://localhost:4000/api/credits', payload);
      onCreditAdded();

      // Reset formulario y errores
      setForm({
        customer_name: '',
        customer_id: '',
        amount: '',
        interest_rate: '',
        term_months: '',
        salesperson: '',
      });
      setErrors({});
    } catch (err) {
      console.error(err);

      // Mostrar errores del backend si existen
      if (err.response?.data?.details) {
        const backendErrors = Object.fromEntries(
          Object.entries(err.response.data.details).map(([key, val]) => [key, val._errors[0]])
        );
        setErrors(backendErrors);
      } else {
        alert(err.response?.data?.error || 'Error registrando crédito');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto' }}>
      {[
        { name: 'customer_name', placeholder: 'Nombre del cliente' },
        { name: 'customer_id', placeholder: 'Identificación' },
        { name: 'amount', placeholder: 'Monto', type: 'number', min: 1 },
        { name: 'interest_rate', placeholder: 'Tasa de interés (%)', type: 'number', min: 0.01, step: 0.01 },
        { name: 'term_months', placeholder: 'Plazo (meses)', type: 'number', min: 1 },
        { name: 'salesperson', placeholder: 'Vendedor' },
      ].map((field) => (
        <div key={field.name} style={{ marginBottom: 12 }}>
          <input
            name={field.name}
            value={form[field.name]}
            onChange={handleChange}
            placeholder={field.placeholder}
            type={field.type || 'text'}
            min={field.min}
            step={field.step}
            required
            style={{ width: '100%', padding: 8, boxSizing: 'border-box' }}
          />
          {errors[field.name] && <p style={{ color: 'red', margin: 4 }}>{errors[field.name]}</p>}
        </div>
      ))}

      <button
        type="submit"
        disabled={loading}
        style={{
          width: '100%',
          padding: 10,
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Registrando...' : 'Registrar crédito'}
      </button>
    </form>
  );
}
