import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MaintenancesPage = () => {
  const [maintenances, setMaintenances] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Stato per il form di inserimento nuovo intervento
  const [newMaint, setNewMaint] = useState({
    vehicleId: '',
    description: '',
    date: new Date().toISOString().split('T'),
    totalEstimatedCost: ''
  });

  const url = import.meta.env.VITE_APP_BASEURL; // Recupero URL base

  const fetchData = async () => {
    try {
      // Recupero parallelo per correlare interventi e mezzi
      const [maintRes, vehRes] = await Promise.all([
        axios.get(`${url}/maintenances`),
        axios.get(`${url}/vehicles`)
      ]);
      setMaintenances(maintRes.data.sort((a, b) => new Date(b.date) - new Date(a.date)));
      setVehicles(vehRes.data);
      setLoading(false);
    } catch (error) {
      console.error("Errore nel recupero dati manutenzione:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${url}/maintenances`, {
        ...newMaint,
        totalEstimatedCost: parseFloat(newMaint.totalEstimatedCost)
      });
      setMaintenances([res.data, ...maintenances]);
      setNewMaint({ vehicleId: '', description: '', date: new Date().toISOString().split('T'), totalEstimatedCost: '' });
    } catch (err) {
      alert("Errore durante la registrazione dell'intervento");
    }
  };

  if (loading) return <div className="text-center mt-5 spinner-border text-success"></div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark">Registro Manutenzioni Flotta</h2>
        <span className="badge bg-success-subtle text-success border border-success rounded-pill px-3 py-2">
          Monitoraggio Efficienza Mezzi
        </span>
      </div>

      <div className="row g-4">
        {/* ELENCO INTERVENTI: Feedback Visivo su Costi e Mezzi */}
        <div className="col-lg-8">
          <div className="row g-3">
            {maintenances.map((m) => {
              const vehicle = vehicles.find(v => v.id === m.vehicleId);
              return (
                <div className="col-12" key={m.id}>
                  <div className="card shadow-sm border-0 border-start border-4 border-success h-100">
                    <div className="card-body p-4 d-flex justify-content-between align-items-center">
                      <div>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <span className="badge bg-dark text-uppercase small">{vehicle?.type || 'N/D'}</span>
                          <span className="text-muted small fw-bold">{new Date(m.date).toLocaleDateString('it-IT')}</span>
                        </div>
                        <h5 className="fw-bold mb-0 text-dark">{m.description}</h5>
                      </div>
                      <div className="text-end">
                        <p className="small text-muted mb-0 fw-bold text-uppercase">Costo Stimato</p>
                        <h4 className="fw-bold text-success mb-0">€ {m.totalEstimatedCost}</h4>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FORM REGISTRAZIONE: Coerenza Brand EcoRoute */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 p-4 bg-light border-top border-success border-4">
            <h5 className="fw-bold mb-3 text-success text-uppercase small">Nuova Manutenzione</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-bold">Veicolo</label>
                <select className="form-select border-success" value={newMaint.vehicleId}
                  onChange={(e) => setNewMaint({...newMaint, vehicleId: e.target.value})} required>
                  <option value="">Seleziona mezzo...</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.type} ({v.id})</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold">Descrizione Intervento</label>
                <textarea className="form-control border-success" rows="2" placeholder="Es: Cambio olio e filtri"
                  value={newMaint.description} onChange={(e) => setNewMaint({...newMaint, description: e.target.value})} required />
              </div>
              <div className="row g-2 mb-4">
                <div className="col-md-7">
                  <label className="form-label small fw-bold">Data Intervento</label>
                  <input type="date" className="form-control border-success" 
                    value={newMaint.date} onChange={(e) => setNewMaint({...newMaint, date: e.target.value})} required />
                </div>
                <div className="col-md-5">
                  <label className="form-label small fw-bold">Costo (€)</label>
                  <input type="number" className="form-control border-success" placeholder="0.00"
                    value={newMaint.totalEstimatedCost} onChange={(e) => setNewMaint({...newMaint, totalEstimatedCost: e.target.value})} required />
                </div>
              </div>
              <button type="submit" className="btn btn-success w-100 fw-bold py-2 shadow-sm">
                Registra Intervento
              </button>
            </form>
          </div>
          
          <div className="mt-4 p-3 bg-white rounded border small text-muted italic shadow-xs">
            <strong>Analisi Tecnica:</strong> Una manutenzione regolare garantisce che il coefficiente di emissione (0.00 - 0.18) rimanga costante nel tempo.
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenancesPage;