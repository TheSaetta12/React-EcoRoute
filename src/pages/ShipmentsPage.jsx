import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ShipmentsPage = () => {
  const [shipments, setShipments] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]); // Stato per gli autisti certificati
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Stato per il form della nuova spedizione
  const [newShipment, setNewShipment] = useState({
    code: '',
    driver: '', // Popolato tramite selezione dropdown
    status: 'Preso in carico',
    vehicleId: '',
    distanceKm: ''
  });

  const url = import.meta.env.VITE_APP_BASEURL;

  const fetchData = async () => {
    try {
      // Recupero parallelo di spedizioni, veicoli e conducenti
      const [shipRes, vehRes, driRes] = await Promise.all([
        axios.get(`${url}/shipments`),
        axios.get(`${url}/vehicles`),
        axios.get(`${url}/drivers`) 
      ]);

      setShipments(shipRes.data);
      setVehicles(vehRes.data);
      setDrivers(driRes.data);
      setLoading(false);
    } catch (error) {
      console.error("Errore nel caricamento dei dati:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${url}/shipments`, {
        ...newShipment,
        distanceKm: parseInt(newShipment.distanceKm)
      });

      setShipments([...shipments, res.data]);
      // Reset del form post-invio
      setNewShipment({ code: '', driver: '', status: 'Preso in carico', vehicleId: '', distanceKm: '' });
    } catch (err) {
      alert("Errore durante la creazione della spedizione");
    }
  };

  // Logica di filtraggio per driver attivi (in transito/consegna) e non attivi
  const filteredShipments = shipments.filter(s => {
    const isActive = ['In Transito', 'Preso in carico', 'In consegna'].includes(s.status);
    if (filter === 'active') return isActive;
    if (filter === 'inactive') return s.status === 'Consegnato';
    return true;
  });

  if (loading) return <div className="text-center mt-5 spinner-border text-success"></div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark">Registro Spedizioni</h2>
        <div className="btn-group shadow-sm" role="group">
          <button className={`btn btn-sm ${filter === 'all' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setFilter('all')}>Tutti</button>
          <button className={`btn btn-sm ${filter === 'active' ? 'btn-success' : 'btn-outline-success'}`} onClick={() => setFilter('active')}>Spedizioni Attivi</button>
          <button className={`btn btn-sm ${filter === 'inactive' ? 'btn-secondary' : 'btn-outline-secondary'}`} onClick={() => setFilter('inactive')}>Consegnati</button>
        </div>
      </div>

      <div className="row g-4">
        {/* TABELLA MONITORAGGIO CON FEEDBACK VISIVO */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 h-100">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-dark">
                  <tr>
                    <th className="ps-4">Codice Spedizione</th>
                    <th>Conducente</th>
                    <th>Stato Operativo</th>
                    <th>Distanza</th>
                    <th className="pe-4 text-center">Dettagli</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredShipments.map((s) => (
                    <tr key={s.id}>
                      <td className="ps-4 fw-bold text-success">{s.code}</td>
                      <td>{s.driver}</td>
                      <td>
                        {/* Badge dinamico per lo stato */}
                        <span className={`badge rounded-pill px-3 py-2 ${
                          s.status === 'Consegnato' ? 'bg-light text-muted border' : 'bg-success-subtle text-success border border-success'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                      <td><small className="fw-bold">{s.distanceKm} km</small></td>
                      <td className="pe-4 text-center">
                        <Link to={`/spedizioni/${s.id}`} className="btn btn-sm btn-outline-dark rounded-pill px-3">Vedi Dettagli & Log</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FORM REGISTRAZIONE: Coerenza Brand e Selezione Vincolata */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 p-4 bg-light border-top border-success border-4">
            <h5 className="fw-bold mb-4 text-success text-uppercase small">Registra Nuova Spedizione</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">CODICE SPEDIZIONE</label>
                <input
                  type="text" className="form-control border-success" placeholder="Es: TRK-0000"
                  value={newShipment.code}
                  onChange={(e) => setNewShipment({...newShipment, code: e.target.value})} required
                />
              </div>

              {/* Selezione dinamica del Driver dagli autisti registrati */}
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">CONDUCENTE ASSEGNATO</label>
                <select
                  className="form-select border-success"
                  value={newShipment.driver}
                  onChange={(e) => setNewShipment({...newShipment, driver: e.target.value})} 
                  required
                >
                  <option value="">Seleziona conducente...</option>
                  {drivers.map(d => (
                    <option key={d.id} value={d.fullName}>
                      {d.fullName} (Patente {d.licenseType})
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">VETTORE LOGISTICO</label>
                <select
                  className="form-select border-success"
                  value={newShipment.vehicleId}
                  onChange={(e) => setNewShipment({...newShipment, vehicleId: e.target.value})} required
                >
                  <option value="">Seleziona veicolo...</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.type} ({v.co2PerKm} kg/km)
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold text-muted">DISTANZA PREVISTA (KM)</label>
                <input
                  type="number" className="form-control border-success" placeholder="Es: 150"
                  value={newShipment.distanceKm}
                  onChange={(e) => setNewShipment({...newShipment, distanceKm: e.target.value})} required
                />
              </div>

              <button type="submit" className="btn btn-success w-100 fw-bold shadow-sm py-2">
                Conferma e Registra
              </button>
            </form>
          </div>

          <div className="mt-4 p-3 bg-white rounded border-start border-4 border-success small text-muted">
            <strong>Nota:</strong> L'assegnazione di un driver e di un mezzo a basso impatto (0.00 o 0.02) è fondamentale per migliorare i KPI ambientali in Dashboard.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentsPage;