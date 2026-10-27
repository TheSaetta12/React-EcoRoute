import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DriversPage = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Stato per la registrazione di un nuovo conducente
  const [newDriver, setNewDriver] = useState({
    fullName: '',
    birthDate: '',
    licenseType: 'B',
    licenseExpiry: '',
    cqcHours: ''
  });

  const url = import.meta.env.VITE_APP_BASEURL;

  const fetchDrivers = async () => {
    try {
      const res = await axios.get(`${url}/drivers`);
      setDrivers(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Errore nel recupero dei conducenti:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, [url]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${url}/drivers`, {
        ...newDriver,
        cqcHours: newDriver.cqcHours ? parseInt(newDriver.cqcHours) : null
      });
      setDrivers([...drivers, res.data]);
      setNewDriver({ fullName: '', birthDate: '', licenseType: 'B', licenseExpiry: '', cqcHours: '' });
    } catch (err) {
      alert("Errore durante il salvataggio del conducente");
    }
  };

  // Logica di Feedback Visivo: Controllo scadenza patente
  const getLicenseStatus = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffMonths = (expiry - today) / (1000 * 60 * 60 * 24 * 30);

    if (diffMonths < 0) return { label: 'SCADUTA 🚨', color: 'danger' };
    if (diffMonths <= 6) return { label: 'IN SCADENZA ⚠️', color: 'warning' };
    return { label: 'VALIDA ✓', color: 'success' };
  };

  if (loading) return <div className="text-center mt-5 spinner-border text-success"></div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark">Anagrafica Conducenti</h2>
        <span className="badge bg-dark text-white rounded-pill px-3 py-2">
          {drivers.length} Operatori Registrati
        </span>
      </div>

      <div className="row g-4">
        {/* ELENCO AUTISTI RAFFINATO */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-success text-dark">
                  <tr>
                    <th className="ps-4 text-uppercase small fw-bold">Nominativo</th>
                    <th className="text-uppercase small fw-bold">Patente</th>
                    <th className="text-uppercase small fw-bold">Scadenza</th>
                    <th className="pe-4 text-center text-uppercase small fw-bold">Stato</th>
                  </tr>
                </thead>
                <tbody>
                  {drivers.map((d) => {
                    const status = getLicenseStatus(d.licenseExpiry);
                    return (
                      <tr key={d.id}>
                        <td className="ps-4">
                          <div className="fw-bold text-dark">{d.fullName}</div>
                          <div className="small text-muted">Data di nascita: {new Date(d.birthDate).toLocaleDateString('it-IT')}</div>
                        </td>
                        <td>
                          <span className="badge bg-dark px-3">{d.licenseType}</span>
                          {d.cqcHours && <div className="small text-success fw-bold mt-1">CQC: {d.cqcHours}h</div>}
                        </td>
                        <td className="small fw-bold">{new Date(d.licenseExpiry).toLocaleDateString('it-IT')}</td>
                        <td className="pe-4 text-center">
                          <span className={`badge bg-${status.color} rounded-pill px-3 py-2 shadow-sm`}>
                            {status.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FORM REGISTRAZIONE COERENTE */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 p-4 bg-light border-top border-success border-4">
            <h5 className="fw-bold mb-4 text-success text-uppercase small">Nuovo Inserimento</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-bold">Nome Completo</label>
                <input type="text" className="form-control border-success" 
                  value={newDriver.fullName} onChange={(e) => setNewDriver({...newDriver, fullName: e.target.value})} required />
              </div>
              <div className="row g-2 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Patente</label>
                  <select className="form-select border-success" value={newDriver.licenseType}
                    onChange={(e) => setNewDriver({...newDriver, licenseType: e.target.value})}>
                    <option value="B">Cat. B</option>
                    <option value="C">Cat. C</option>
                    <option value="CE">Cat. CE</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Ore CQC</label>
                  <input type="number" className="form-control border-success" placeholder="Es: 140"
                    value={newDriver.cqcHours} onChange={(e) => setNewDriver({...newDriver, cqcHours: e.target.value})} />
                </div>
              </div>
              <div className="mb-4">
                <label className="form-label small fw-bold">Scadenza Patente</label>
                <input type="date" className="form-control border-success" 
                  value={newDriver.licenseExpiry} onChange={(e) => setNewDriver({...newDriver, licenseExpiry: e.target.value})} required />
              </div>
              <button type="submit" className="btn btn-success w-100 fw-bold py-2 shadow-sm">
                Registra Conducente
              </button>
            </form>
          </div>
          <div className="mt-4 p-3 bg-white rounded border-start border-4 border-info small text-muted">
            <strong>Nota:</strong> Il sistema calcola automaticamente lo stato della patente basandosi sulla data odierna, evidenziando le criticità per la gestione dei driver attivi.
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriversPage;