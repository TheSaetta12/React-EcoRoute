import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HubsPage = () => {
  const [hubs, setHubs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // STATI PER LA MODIFICA INLINE
  const [editingHubId, setEditingHubId] = useState(null);
  const [editCapacity, setEditCapacity] = useState("");

  // Recupero dell'URL base dalle variabili d'ambiente
  const url = import.meta.env.VITE_APP_BASEURL;

  const fetchHubs = async () => {
    try {
      const res = await axios.get(`${url}/hubs`);
      setHubs(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Errore nel recupero degli Hub:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHubs();
  }, [url]);

  // FUNZIONE DI SALVATAGGIO INLINE (Sostituisce la vecchia updateHub)
  const handleSave = async (id) => {
    const numCapacity = parseInt(editCapacity);
    
    // Validazione della percentuale (0-100)
    if (isNaN(numCapacity) || numCapacity < 0 || numCapacity > 100) {
      alert("Inserire un valore valido tra 0 e 100");
      return;
    }

    // Logica richiesta: se >= 95% lo stato diventa "Quasi Saturo"
    const newStatus = numCapacity >= 95 ? "Quasi Saturo" : "Operativo";

    try {
      await axios.patch(`${url}/hubs/${id}`, {
        capacityPercent: numCapacity,
        status: newStatus
      });
      setEditingHubId(null); // Esci dalla modalità modifica
      fetchHubs(); // Refresh dei dati
    } catch (err) {
      alert("Errore nell'aggiornamento dell'Hub");
    }
  };

  // Determina il colore del brand in base alla saturazione
  const getStatusTheme = (percent) => {
    if (percent >= 95) return 'danger'; // Rosso: Criticità
    if (percent >= 80) return 'warning'; // Giallo: Attenzione
    return 'success'; // Verde: Ottimale
  };

  if (loading) return <div className="text-center mt-5 spinner-border text-success"></div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark">Hub Logistici e Stoccaggio</h2>
        <span className="badge bg-dark text-white rounded-pill px-3 py-2 small">
          Monitoraggio Risorse Real-Time
        </span>
      </div>

      <div className="row g-4">
        {hubs.map((hub) => {
          const isEditing = editingHubId === hub.id;
          const theme = getStatusTheme(hub.capacityPercent);

          return (
            <div className="col-md-4" key={hub.id}>
              {/* Card con bordo superiore coerente con il brand */}
              <div className={`card shadow-sm border-0 border-top border-4 border-${theme} h-100`}>
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="fw-bold mb-0 text-dark">{hub.name}</h5>
                    <span className={`badge rounded-pill bg-${theme} px-3`}>
                      {hub.status}
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="d-flex justify-content-between mb-1">
                      <label className="small fw-bold text-muted text-uppercase">Capacità Utilizzata</label>
                      
                      {/* MODIFICA INLINE: Barra d'inserimento condizionale */}
                      {isEditing ? (
                        <div className="input-group input-group-sm w-50">
                          <input 
                            type="number" 
                            className="form-control" 
                            value={editCapacity}
                            onChange={(e) => setEditCapacity(e.target.value)}
                            min="0"
                            max="100"
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      ) : (
                        <span className={`small fw-bold text-${theme}`}>{hub.capacityPercent}%</span>
                      )}
                    </div>
                    
                    {/* Progress Bar per feedback visivo immediato */}
                    <div className="progress" style={{ height: '10px' }}>
                      <div
                        className={`progress-bar bg-${theme} progress-bar-striped progress-bar-animated`}
                        role="progressbar"
                        style={{ width: `${hub.capacityPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* GESTIONE PULSANTI AZIONE */}
                  {isEditing ? (
                    <div className="d-flex gap-2">
                      <button 
                        className="btn btn-sm btn-success w-100 rounded-pill fw-bold" 
                        onClick={() => handleSave(hub.id)}
                      >
                        Salva
                      </button>
                      <button 
                        className="btn btn-sm btn-secondary w-100 rounded-pill fw-bold" 
                        onClick={() => setEditingHubId(null)}
                      >
                        Annulla
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn btn-sm btn-outline-dark w-100 rounded-pill fw-bold"
                      onClick={() => {
                        setEditingHubId(hub.id);
                        setEditCapacity(hub.capacityPercent);
                      }}
                    >
                      Gestisci Risorse
                    </button>
                  )}
                </div>

                {/* Nota informativa dinamica per stati critici */}
                {hub.capacityPercent >= 95 && (
                  <div className="card-footer bg-danger text-white border-0 py-2 text-center small fw-bold">
                    ⚠️ AZIONE RICHIESTA: REINDIRIZZARE SPEDIZIONI
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer informativo di sistema */}
      <div className="mt-5 p-3 bg-light rounded border-start border-4 border-success shadow-sm">
        <p className="small mb-0 text-muted">
          <strong>Logica di Sistema:</strong> La saturazione degli Hub influenza la disponibilità delle rotte. 
          Gli stati "Quasi Saturo" indicano che la capacità di stoccaggio ha raggiunto il benchmark critico del 95%.
        </p>
      </div>
    </div>
  );
};

export default HubsPage;