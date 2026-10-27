import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import del componente di navigazione globale
import Navbar from './components/Navbar';

// Import di tutte le pagine del sistema EcoRoute
import DashboardPage from './pages/DashboardPage';
import ShipmentsPage from './pages/ShipmentsPage';
import ShipmentDetailsPage from './pages/ShipmentDetailsPage';
import SimulatorPage from './pages/SimulatorPage';
import FleetPage from './pages/FleetPage';
import HubsPage from './pages/HubsPage';
import DriversPage from './pages/DriversPage';
import MaintenancesPage from './pages/MaintenancesPage';

function App() {
  return (
    <Router>
      <div className="min-vh-100 bg-light">
        {/* Navbar scura con branding Verde Success */}
        <Navbar />

        {/* Container delle rotte principali dell'applicazione */}
        <main>
          <Routes>
            {/* 1. Dashboard: Analisi KPI ambientali in tempo reale */}
            <Route path="/" element={<DashboardPage />} />

            {/* 2. Spedizioni: Registro e Dettaglio con log dinamici */}
            <Route path="/spedizioni" element={<ShipmentsPage />} />
            <Route path="/spedizioni/:id" element={<ShipmentDetailsPage />} />

            {/* 3. Simulatore: Calcolo eco-sostenibilità comparativa */}
            <Route path="/simulatore" element={<SimulatorPage />} />

            {/* 4. Flotta: Configurazione mezzi e coefficienti CO2 */}
            <Route path="/flotta" element={<FleetPage />} />

            {/* 5. Hub Logistici: Monitoraggio saturazione magazzini */}
            <Route path="/hubs" element={<HubsPage />} />

            {/* 6. Autisti: Anagrafica e scadenze patenti CQC */}
            <Route path="/autisti" element={<DriversPage />} />

            {/* 7. Manutenzioni: Registro tecnico e costi di efficienza */}
            <Route path="/manutenzioni" element={<MaintenancesPage />} />

            {/* Gestione rotte non trovate */}
            <Route path="*" element={
              <div className="container mt-5 text-center">
                <h3 className="text-muted">404 - Pagina non trovata.</h3>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;