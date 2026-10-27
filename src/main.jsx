import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Importazione di Bootstrap: fondamentale per la gestione dei KPI e della UI
// Fornisce gli stili per i badge "Impatto Zero", "Eco Moderato" e "Alto Impatto"
import 'bootstrap/dist/css/bootstrap.min.css'

/**
 * Punto di ingresso dell'applicazione EcoRoute.
 * Rimosso index.css per utilizzare esclusivamente il framework Bootstrap 
 * per il monitoraggio eco-sostenibile in tempo reale.
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)