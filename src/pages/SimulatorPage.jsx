import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { calculateCO2, calculateBenchmark } from '../utils/ecoCalc';
import EcoBadge from '../components/EcoBadge';

const SimulatorPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Stato del simulatore
  const [formData, setFormData] = useState({
    distance: '',
    vehicleId: ''
  });

  const url = import.meta.env.VITE_APP_BASEURL;

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await axios.get(`${url}/vehicles`);
        setVehicles(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Errore nel recupero dei mezzi:", err);
        setLoading(false);
      }
    };
    fetchVehicles();
  }, [url]);

  // Calcoli dinamici basati sull'input dell'utente
  const actualCO2 = calculateCO2(formData.distance, formData.vehicleId, vehicles);
  const benchmarkCO2 = calculateBenchmark(formData.distance);
  const savings = (parseFloat(benchmarkCO2) - parseFloat(actualCO2)).toFixed(2);

  if (loading) return <div className="text-center mt-5 spinner-border text-success"></div>;

  return (
    <div className="container mt-4">
      <div className="mb-4">
        <h2 className="fw-bold text-success">Simulatore Green</h2>
        <p className="text-muted">Confronta l'impatto ambientale dei diversi vettori logistici rispetto allo standard diesel.</p>
      </div>

      <div className="row g-4">
        {/* COLONNA SINISTRA: Input Simulazione */}
        <div className="col-lg-5">
          <div className="card shadow-sm border-0 p-4 bg-light border-top border-success border-4">
            <h5 className="fw-bold mb-4 text-success text-uppercase small">Parametri di Viaggio</h5>
            
            <div className="mb-3">
              <label className="form-label small fw-bold">DISTANZA PREVISTA (KM)</label>
              <input 
                type="number" 
                className="form-control border-success" 
                placeholder="Es: 890"
                value={formData.distance}
                onChange={(e) => setFormData({...formData, distance: e.target.value})}
              />
            </div>

            <div className="mb-4">
              <label className="form-label small fw-bold">MEZZO DI TRASPORTO</label>
              <select 
                className="form-select border-success"
                value={formData.vehicleId}
                onChange={(e) => setFormData({...formData, vehicleId: e.target.value})}
              >
                <option value="">Seleziona un mezzo...</option>
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>{v.type}</option>
                ))}
              </select>
            </div>

            <div className="p-3 bg-white rounded border small text-muted">
              <strong>Nota:</strong> Il calcolo utilizza i coefficienti di sistema: 
              Elettrico (0.00), Treno (0.02) e Diesel (0.18).
            </div>
          </div>
        </div>

        {/* COLONNA DESTRA: Risultato Comparativo */}
        <div className="col-lg-7">
          <div className="card shadow-sm border-0 h-100 overflow-hidden">
            <div className="card-header bg-dark text-white py-3">
              <h5 className="mb-0 fw-bold small text-uppercase">Analisi Comparativa Emissioni</h5>
            </div>
            
            <div className="card-body p-4 d-flex flex-column justify-content-center">
              {!formData.distance || !formData.vehicleId ? (
                <div className="text-center py-5">
                  <p className="text-muted italic">Inserisci distanza e mezzo per visualizzare il risparmio ecologico.</p>
                </div>
              ) : (
                <div className="row text-center g-4">
                  {/* Risultato Mezzo Scelto */}
                  <div className="col-md-6">
                    <div className="p-3 border rounded bg-light h-100">
                      <p className="small fw-bold text-muted text-uppercase mb-2">Emissione Scelta</p>
                      <h3 className="fw-bold text-dark mb-2">{actualCO2} kg</h3>
                      <EcoBadge co2={actualCO2} />
                    </div>
                  </div>

                  {/* Risultato Benchmark Diesel */}
                  <div className="col-md-6">
                    <div className="p-3 border rounded bg-white h-100">
                      <p className="small fw-bold text-muted text-uppercase mb-2">Benchmark Diesel</p>
                      <h3 className="fw-bold text-danger mb-2">{benchmarkCO2} kg</h3>
                      <span className="badge rounded-pill bg-danger px-3 py-2">Alto Impatto 🚨</span>
                    </div>
                  </div>

                  {/* Box Risparmio Totale */}
                  <div className="col-12 mt-4">
                    <div className="p-4 bg-success text-white rounded-3 shadow-sm">
                      <h6 className="text-uppercase small fw-bold opacity-75">Risparmio CO2 Garantito</h6>
                      <h1 className="display-4 fw-bold mb-0">{savings} kg</h1>
                      <p className="mb-0 mt-2 opacity-75">Emissioni evitate scegliendo una logica eco-sostenibile.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulatorPage;