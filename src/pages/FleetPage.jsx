import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FleetPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newVehicle, setNewVehicle] = useState({ type: '', co2PerKm: '' });

  // Stati per la modifica in linea
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ type: '', co2PerKm: '' });

  const url = import.meta.env.VITE_APP_BASEURL;

  const fetchVehicles = async () => {
    try {
      const res = await axios.get(`${url}/vehicles`);
      setVehicles(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Errore nel caricamento flotta:", error);
      setLoading(false);
    }
  };

  useEffect(() => { fetchVehicles(); }, [url]);

  // FUNZIONE ELIMINA: Con pop-up di conferma "Sei sicuro?"
  const handleDelete = async (id) => {
    if (window.confirm("Sei sicuro?")) {
      try {
        await axios.delete(`${url}/vehicles/${id}`);
        setVehicles(vehicles.filter(v => v.id !== id));
      } catch (err) {
        alert("Errore durante l'eliminazione.");
      }
    }
  };

  // Attiva la modalità modifica per una riga specifica
  const startEdit = (vehicle) => {
    setEditingId(vehicle.id);
    setEditForm({ type: vehicle.type, co2PerKm: vehicle.co2PerKm });
  };

  // Salva le modifiche effettuate nella barra d'inserimento
  const handleSave = async (id) => {
    try {
      const res = await axios.patch(`${url}/vehicles/${id}`, {
        type: editForm.type,
        co2PerKm: parseFloat(editForm.co2PerKm)
      });
      setVehicles(vehicles.map(v => v.id === id ? res.data : v));
      setEditingId(null); // Esce dalla modalità modifica
    } catch (err) {
      alert("Errore durante il salvataggio.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${url}/vehicles`, {
        ...newVehicle,
        co2PerKm: parseFloat(newVehicle.co2PerKm)
      });
      setVehicles([...vehicles, res.data]);
      setNewVehicle({ type: '', co2PerKm: '' });
    } catch (err) {
      alert("Errore nell'inserimento.");
    }
  };

  const getBadge = (co2) => {
    if (co2 === 0) return { label: 'Impatto Zero 🌿', color: 'success' };
    if (co2 <= 0.02) return { label: 'Eco Moderato 🟡', color: 'warning' };
    return { label: 'Alto Impatto 🚨', color: 'danger' };
  };

  if (loading) return <div className="text-center mt-5 spinner-border text-success"></div>;

  return (
    <div className="container mt-4">
      <h2 className="fw-bold text-dark mb-4">Gestione Flotta Aziendale</h2>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-dark">
                  <tr>
                    <th className="ps-4">Tipo Veicolo</th>
                    <th>Emissioni CO2</th>
                    <th>Stato Eco</th>
                    <th className="pe-4 text-center">Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((v) => {
                    const isEditing = editingId === v.id;
                    const badge = getBadge(v.co2PerKm);
                    return (
                      <tr key={v.id}>
                        <td className="ps-4">
                          {isEditing ? (
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              value={editForm.type}
                              onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                            />
                          ) : (
                            <span className="fw-bold">{v.type}</span>
                          )}
                        </td>
                        <td>
                          {isEditing ? (
                            <input
                              type="number"
                              step="0.01"
                              className="form-control form-control-sm"
                              value={editForm.co2PerKm}
                              onChange={(e) => setEditForm({ ...editForm, co2PerKm: e.target.value })}
                            />
                          ) : (
                            <span className="font-monospace">{v.co2PerKm} kg/km</span>
                          )}
                        </td>
                        <td>
                          <span className={`badge rounded-pill bg-${badge.color} px-3 py-2`}>
                            {badge.label}
                          </span>
                        </td>
                        <td className="pe-4 text-center">
                          {isEditing ? (
                            <div className="btn-group shadow-sm rounded-pill overflow-hidden">
                              <button className="btn btn-sm btn-success" onClick={() => handleSave(v.id)}>Salva</button>
                              <button className="btn btn-sm btn-secondary" onClick={() => setEditingId(null)}>Annulla</button>
                            </div>
                          ) : (
                            <div className="btn-group shadow-sm rounded-pill overflow-hidden">
                              <button className="btn btn-sm btn-outline-dark" onClick={() => startEdit(v)}>Modifica</button>
                              <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(v.id)}>Elimina</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Form Aggiunta Nuovo Mezzo */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 p-4 bg-light border-top border-success border-4">
            <h5 className="fw-bold mb-4 text-success text-uppercase small">Nuovo Veicolo</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-bold">Tipo di Veicolo</label>
                <input
                  type="text"
                  className="form-control border-success"
                  placeholder="Es: Drone Express"
                  value={newVehicle.type}
                  onChange={(e) => setNewVehicle({ ...newVehicle, type: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="form-label small fw-bold">Emissioni (kg/km)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control border-success"
                  placeholder="0.00"
                  value={newVehicle.co2PerKm}
                  onChange={(e) => setNewVehicle({ ...newVehicle, co2PerKm: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="btn btn-success w-100 fw-bold py-2 shadow-sm">
                Aggiungi alla Flotta
              </button>
            </form>

            {/* NOTA INFORMATIVA AGGIUNTA SOTTO IL PULSANTE */}
            <div className="mt-3 p-3 bg-white rounded border border-success border-opacity-25">
              <p className="small text-muted mb-0">
                <strong>Nota:</strong> Per un calcolo corretto, utilizza <strong>0.00</strong> per i mezzi elettrici,
                <strong> 0.02</strong> per il trasporto su rotaia e <strong>0.18</strong> per i mezzi diesel standard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FleetPage;