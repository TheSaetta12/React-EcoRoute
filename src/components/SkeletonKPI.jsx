import React from 'react';

/**
 * Componente Skeleton Loader per la sezione KPI della Dashboard.
 * Riproduce il layout a tre colonne delle statistiche ambientali.
 */
const SkeletonKPI = () => {
  return (
    <div className="row g-4 mb-5">
      {/* Generazione di 3 card segnaposto che mimano i KPI della flotta */}
      {[4-6].map((i) => (
        <div className="col-md-4" key={i}>
          <div className="card shadow-sm border-0 p-4 h-100 bg-light placeholder-glow" style={{ minHeight: '140px' }}>
            {/* Segnaposto per il titolo del KPI (es: Emissioni Totali Flotta) */}
            <div className="placeholder col-8 rounded mb-3 bg-secondary opacity-25" style={{ height: '15px' }}></div>
            
            {/* Segnaposto per il valore principale (es: i kg di CO2) */}
            <div className="placeholder col-5 rounded mb-3 bg-secondary opacity-25" style={{ height: '35px' }}></div>
            
            {/* Segnaposto per il testo informativo inferiore */}
            <div className="placeholder col-10 rounded bg-secondary opacity-25" style={{ height: '12px' }}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonKPI;