import React from 'react';
import { NavLink, Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
      <div className="container">
        {/* Logo EcoRoute in Verde Success come da brand identity */}
        <Link className="navbar-brand fw-bold text-success fs-3" to="/">
          React-EcoRoute
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto gap-1">
            {/* Voci principali */}
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link px-3 ${isActive ? 'text-success fw-bold' : ''}`} to="/">
                Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link px-3 ${isActive ? 'text-success fw-bold' : ''}`} to="/spedizioni">
                Spedizioni
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link px-3 ${isActive ? 'text-success fw-bold' : ''}`} to="/simulatore">
                Simulatore Green
              </NavLink>
            </li>

            {/* Nuove sezioni gestionali integrate */}
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link px-3 ${isActive ? 'text-success fw-bold' : ''}`} to="/flotta">
                Flotta
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link px-3 ${isActive ? 'text-success fw-bold' : ''}`} to="/hubs">
                Hub Logistici
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link px-3 ${isActive ? 'text-success fw-bold' : ''}`} to="/autisti">
                Autisti
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link px-3 ${isActive ? 'text-success fw-bold' : ''}`} to="/manutenzioni">
                Manutenzioni
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;