import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { calculateCO2 } from '../utils/ecoCalc';
import EcoBadge from '../components/EcoBadge';

const ShipmentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [shipment, setShipment] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [hubs, setHubs] = useState([]); // Aggiunto per gestione rilascio risorse
  const [logs, setLogs] = useState([]);
  const [newLogMessage, setNewLogMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const url = import.meta.env.VITE_APP_BASEURL;

  const fetchData = async () => {
    try {
      const [shipRes, vehRes, logRes, hubRes] = await Promise.all([
        axios.get(`${url}/shipments/${id}`),
        axios.get(`${url}/vehicles`),
        axios.get(`${url}/logs?shipmentId=${id}`),
        axios.get(`${url}/hubs`) // Caricamento Hub per aggiornamenti dinamici
      ]);

      setShipment(shipRes.data);
      setVehicles(vehRes.data);
      setHubs(hubRes.data);
      setLogs(logRes.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
      setLoading(false);
    } catch (err) {
      console.error("Errore nel caricamento:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, url]);

  // LOGICA PRO: Rilascio Risorse e Aggiornamento Stato
  const handleStatusUpdate = async (newStatus) => {
    try {
      // 1. Aggiornamento stato spedizione
      await axios.patch(`${url}/shipments/${id}`, { status: newStatus });

      if (newStatus === "Consegnato") {
        // 2. Rilascio Risorse: Aggiornamento Hub di partenza
        // Nota: Assicurarsi che la spedizione abbia il campo departureHubId salvato in fase di creazione
        if (shipment.departureHubId) {
          const targetHub = hubs.find(h => h.id === shipment.departureHubId);
          if (targetHub) {
            const newCapacity = Math.max(targetHub.capacityPercent - 5, 0); // Libera il 5% di spazio
            await axios.patch(`${url}/hubs/${targetHub.id}`, {
              capacityPercent: newCapacity,
              status: newCapacity < 95 ? "Operativo" : targetHub.status
            });
          }
        }
        // 3. Log di sistema specifico per la consegna
        await handleAddLog("Consegna completata: Capacità Hub liberata e driver disponibile.", true);
      } else {
        // Log di sistema standard per altri cambi di stato
        await handleAddLog(`Stato della spedizione modificato in: ${newStatus}`, true);
      }

      fetchData();
    } catch (err) {
      alert("Errore nell'aggiornamento dello stato");
    }
  };

  // Funzione di logging avanzata (Sistema vs Operatore)
  const handleAddLog = async (message, isSystem = false) => {
    const msgToSend = message || newLogMessage;
    if (!msgToSend) return;

    try {
      await axios.post(`${url}/logs`, {
        shipmentId: id,
        timestamp: new Date().toISOString(),
        message: msgToSend,
        type: isSystem ? "Sistema" : "Operatore"
      });
      setNewLogMessage('');
      fetchData();
    } catch (err) {
      alert("Errore nell'inserimento del log");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Sei sicuro di voler eliminare questa spedizione?")) {
      try {
        await axios.delete(`${url}/shipments/${id}`);
        navigate('/spedizioni');
      } catch (err) {
        alert("Impossibile eliminare la spedizione.");
      }
    }
  };

  if (loading) return <div className="text-center mt-5 spinner-border text-success"></div>;
  if (!shipment) return <div className="text-center mt-5">Spedizione non trovata.</div>;

  const co2 = calculateCO2(shipment.distanceKm, shipment.vehicleId, vehicles);

  return (
    <div className="container mt-4">
      <Link to="/spedizioni" className="btn btn-sm btn-outline-dark mb-4 rounded-pill">
        ← Registro Spedizioni
      </Link>

      <div className="row g-4">
        {/* INFO CARD */}
        <div className="col-md-5">
          <div className="card shadow-sm border-0 border-top border-success border-4 p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold mb-0 text-success">{shipment.code}</h4>
              <button className="btn btn-outline-danger btn-sm rounded-pill" onClick={handleDelete}>Elimina</button>
            </div>

            <div className="mb-4">
              <p className="small text-muted fw-bold mb-1">CONDUCENTE ASSEGNATO</p>
              <p className="h5 fw-bold">{shipment.driver}</p>
              <span className="badge bg-light text-success border border-success px-3 py-2 mb-3">
                {shipment.status}
              </span>
              <p className="text-success fw-bold">Distanza: {shipment.distanceKm} km</p>
            </div>

            <hr />

            <div className="mb-4">
              <label className="form-label small fw-bold text-muted">AGGIORNA AVANZAMENTO</label>
              <select className="form-select border-success" value={shipment.status} onChange={(e) => handleStatusUpdate(e.target.value)}>
                <option value="Preso in carico">Preso in carico</option>
                <option value="In Transito">In Transito</option>
                <option value="In consegna">In consegna</option>
                <option value="Consegnato">Consegnato</option>
              </select>
            </div>

            {/* KPI AMBIENTALE */}
            <div className="p-3 bg-success text-white rounded shadow-sm">
              <h6 className="fw-bold small text-uppercase opacity-75">Impatto Ambientale Stimato</h6>
              <div className="d-flex align-items-center gap-3 my-2">
                <span className="fs-2 fw-bold">{co2} kg CO2</span>
                <EcoBadge co2={co2} />
              </div>
              <small className="opacity-75 italic">Eco-sostenibilità comparativa vs Diesel (0.18 kg/km).</small>
            </div>
          </div>
        </div>

        {/* LOG TIMELINE */}
        <div className="col-md-7">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-dark text-white py-3">
              <h5 className="mb-0 fw-bold small text-uppercase">Timeline Operativa</h5>
            </div>
            <div className="card-body">
              <div className="input-group mb-4">
                <input type="text" className="form-control border-dark" placeholder="Aggiungi nota di viaggio..." 
                       value={newLogMessage} onChange={(e) => setNewLogMessage(e.target.value)} />
                <button className="btn btn-dark" onClick={() => handleAddLog()}>Invia</button>
              </div>

              <div className="overflow-auto" style={{ maxHeight: '450px' }}>
                {logs.map(log => (
                  <div key={log.id} className="p-3 bg-light rounded border-start border-4 border-success mb-3 shadow-xs">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="badge bg-white text-success border border-success small">{log.type || "Sistema"}</span>
                      <small className="text-muted">{new Date(log.timestamp).toLocaleString('it-IT')}</small>
                    </div>
                    <p className="mb-0 small fw-bold">{log.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetailsPage;