import React from 'react';

/**
 * Componente per la visualizzazione dei feedback ambientali EcoRoute.
 * @param {string|number} co2 - I kg di CO2 prodotti dalla spedizione.
 */
const EcoBadge = ({ co2 }) => {
  const co2Val = parseFloat(co2);

  // Definizione dinamica dello stile e dell'etichetta in base alla CO2
  let badgeClass = "";
  let label = "";

  if (co2Val === 0) {
    // Caso Furgone Elettrico (es. 0 kg su 450 km)
    badgeClass = "bg-success text-white";
    label = "Impatto Zero 🌿";
  } else if (co2Val > 0 && co2Val <= 30) {
    // Caso Treno Merci (es. 17.80 kg su 890 km)
    badgeClass = "bg-warning text-dark";
    label = "Eco Moderato 🟡";
  } else {
    // Caso Furgone Diesel (es. 109.80 kg su 610 km)
    badgeClass = "bg-danger text-white";
    label = "Alto Impatto 🚨";
  }

  return (
    <span className={`badge rounded-pill ${badgeClass} px-3 py-2 shadow-sm fw-bold`}>
      {label}
    </span>
  );
};

export default EcoBadge;