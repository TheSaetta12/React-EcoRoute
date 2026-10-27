import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { calculateCO2, calculateBenchmark } from '../utils/ecoCalc';
import EcoChart from '../components/EcoChart';

const DashboardPage = () => {
  const [shipments, setShipments] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [maintenances, setMaintenances] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Stato aggiunto per la gestione degli errori e della connessione
  const [error, setError] = useState(null);

  const url = import.meta.env.VITE_APP_BASEURL;

  const fetchDashboardData = async () => {
    try {
      // Tentativo di recupero parallelo dei dati
      const [shipRes, vehRes, maintRes] = await Promise.all([
        axios.get(`${url}/shipments`),
        axios.get(`${url}/vehicles`),
        axios.get(`${url}/maintenances`)
      ]);

      setShipments(shipRes.data);
      setVehicles(vehRes.data);
      setMaintenances(maintRes.data);
      
      // Reset errore in caso di connessione riuscita
      setError(null);
      setLoading(false);
    } catch (err) {
      console.error("Errore critico backend:", err);
      // Feedback visivo per lo stato di connessione interrotto
      setError("Connessione al server EcoRoute interrotta. Verifica che il database locale (json-server) sia attivo.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Monitoraggio in tempo reale ogni 10 secondi
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 10000);

    return () => clearInterval(interval);
  }, [url]);

  // Calcolo KPI (Dati derivati dallo stato attuale)
  const monitoredShipments = shipments.filter(s =>
    ['In Transito', 'Preso in carico', 'In consegna', 'Consegnato'].includes(s.status)
  );

  const activeDriversCount = shipments.filter(s =>
    ['In Transito', 'Preso in carico', 'In consegna'].includes(s.status)
  ).length;

  const totalActualCO2 = monitoredShipments.reduce((acc, s) => {
    return acc + parseFloat(calculateCO2(s.distanceKm, s.vehicleId, vehicles));
  }, 0);

  const totalBenchmarkCO2 = monitoredShipments.reduce((acc, s) => {
    return acc + parseFloat(calculateBenchmark(s.distanceKm));
  }, 0);

  const totalSavings = (totalBenchmarkCO2 - totalActualCO2).toFixed(2);

  // LOGICA ALERT MANUTENZIONE (Miglioria Pro)
  const maintenanceAlerts = vehicles.filter(vehicle => {
    const vMaint = maintenances
      .filter(m => m.vehicleId === vehicle.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    if (!vMaint) return true; // Mai revisionato
    const lastDate = new Date(vMaint.date);
    const diffDays = Math.floor((new Date() - lastDate) / (1000 * 60 * 60 * 24));
    return diffDays > 30; // Alert se fermo da oltre 30gg
  });

  // GESTIONE VISIVA STATO DI ERRORE
  if (error) return (
    <div className="container mt-5 text-center">
      <div className="card shadow border-0 p-5 bg-light">
        <div className="mb-4 display-1">🔌</div>
        <h3 className="fw-bold text-danger">Errore di Connessione</h3>
        <p className="text-muted mb-4">{error}</p>
        <div className="d-flex justify-content-center gap-3">
          <button className="btn btn-dark rounded-pill px-4" onClick={() => window.location.reload()}>
            Ricarica Pagina
          </button>
          <button className="btn btn-outline-danger rounded-pill px-4" onClick={fetchDashboardData}>
            Riprova Sincronizzazione
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-success" role="status">
        <span className="visually-hidden">Caricamento EcoRoute...</span>
      </div>
    </div>
  );

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark">Dashboard</h2>
        <span className="badge bg-success-subtle text-success border border-success rounded-pill px-3">
          ● Live Sync Attivo
        </span>
      </div>

      {/* ALERT MANUTENZIONE */}
      {maintenanceAlerts.length > 0 && (
        <div className="alert border-0 border-start border-4 border-warning bg-light shadow-sm mb-4 p-3">
          <h6 className="fw-bold text-dark mb-1">⚠️ Manutenzione Richiesta</h6>
          <small className="text-muted">I veicoli {maintenanceAlerts.map(v => v.type).join(', ')} superano i 30gg dall'ultimo controllo.</small>
        </div>
      )}

      {/* SEZIONE KPI */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-4 h-100 border-top border-dark border-4">
            <h6 className="text-muted text-uppercase small fw-bold">CO2 Prodotta Totale</h6>
            <h2 className="fw-bold">{totalActualCO2.toFixed(2)} kg</h2>
            <p className="small text-muted mb-0">Basato su {monitoredShipments.length} viaggi</p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 bg-success text-white p-4 h-100">
            <h6 className="text-uppercase small fw-bold opacity-75">Risparmio Ecologico</h6>
            <h2 className="fw-bold">{totalSavings} kg</h2>
            <p className="small mb-0">CO2 evitata vs Diesel (0.18)</p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 bg-dark text-white p-4 h-100">
            <h6 className="text-uppercase small fw-bold opacity-75">Spedizioni</h6>
            <h2 className="fw-bold">{activeDriversCount}</h2>
            <p className="small mb-0">Conducenti attivi in tempo reale</p>
          </div>
        </div>
      </div>

      {/* ANALISI COMPARATIVA */}
      <div className="row mb-4">
        <div className="col-12">
          <EcoChart shipments={monitoredShipments} vehicles={vehicles} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;