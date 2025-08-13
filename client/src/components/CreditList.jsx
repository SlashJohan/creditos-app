import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function CreditList({ reload }) {
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  // Paginación y filtros
  const [page, setPage] = useState(1);
  const [size] = useState(5);
  const [search, setSearch] = useState('');
  const [filterCustomerId, setFilterCustomerId] = useState('');
  const [filterSalesperson, setFilterSalesperson] = useState('');

  const fetchCredits = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size,
        q: search || undefined,
        customer_id: filterCustomerId.trim() || undefined, // recortamos espacios
        salesperson: filterSalesperson.trim() || undefined,
      };

      const res = await axios.get('http://localhost:4000/api/credits', { params });
      setCredits(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCredits();
  }, [page, search, filterCustomerId, filterSalesperson, reload]);

  const totalPages = Math.ceil(total / size);

  return (
    <div style={{ marginTop: 20, width: '100%', maxWidth: 800 }}>
      <h2>Lista de Créditos</h2>

      {/* Filtros */}
      <div style={{ marginBottom: 10, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <input
          placeholder="Buscar por cliente"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          placeholder="Filtrar por ID"
          value={filterCustomerId}
          onChange={(e) => setFilterCustomerId(e.target.value)}
        />
        <input
          placeholder="Filtrar por vendedor"
          value={filterSalesperson}
          onChange={(e) => setFilterSalesperson(e.target.value)}
        />
      </div>

      {/* Tabla */}
      {loading ? (
        <p>Cargando créditos...</p>
      ) : credits.length === 0 ? (
        <p>No se encontraron créditos.</p>
      ) : (
        <table
          border="1"
          cellPadding="6"
          cellSpacing="0"
          style={{ width: '100%', borderCollapse: 'collapse', margin: '0 auto' }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Identificación</th>
              <th>Monto</th>
              <th>Tasa (%)</th>
              <th>Plazo (meses)</th>
              <th>Vendedor</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {credits.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.customer_name}</td>
                <td>{c.customer_id}</td>
                <td>${c.amount}</td>
                <td>{c.interest_rate}</td>
                <td>{c.term_months}</td>
                <td>{c.salesperson}</td>
                <td>{new Date(c.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div style={{ marginTop: 10, display: 'flex', justifyContent: 'center', gap: 10 }}>
          <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
            Anterior
          </button>
          <span>
            Página {page} de {totalPages}
          </span>
          <button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages}>
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
