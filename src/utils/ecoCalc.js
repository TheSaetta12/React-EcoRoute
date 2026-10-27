/**
 * Calcola la CO2 prodotta effettivamente da una spedizione.
 * @param {number|string} distance - La distanza percorsa in km.
 * @param {string} vehicleId - L'ID del veicolo utilizzato (es. 'v1', 'v2').
 * @param {Array} vehicles - L'elenco completo dei veicoli dal database.
 * @returns {string} - I kg di CO2 prodotti, formattati a due decimali.
 */
export const calculateCO2 = (distance, vehicleId, vehicles) => {
  if (!distance || !vehicleId || !vehicles.length) return "0.00";

  // Ricerca del veicolo per recuperare il suo coefficiente specifico (co2PerKm)
  const vehicle = vehicles.find(v => v.id === vehicleId);
  
  // Se il veicolo non viene trovato, il calcolo fallisce (default 0)
  const coefficient = vehicle ? vehicle.co2PerKm : 0;
  
  return (parseFloat(distance) * coefficient).toFixed(2);
};

/**
 * Calcola la CO2 di riferimento (Benchmark) basata su un furgone diesel standard.
 * Secondo le specifiche, il benchmark è fissato a 0.18 kg/km.
 * @param {number|string} distance - La distanza percorsa in km.
 * @returns {string} - I kg di CO2 che avrebbe prodotto un furgone diesel, formattati a due decimali.
 */
export const calculateBenchmark = (distance) => {
  if (!distance) return "0.00";

  // Coefficiente standard di riferimento (Diesel tradizionale: 0.18 kg/km)
  const DIESEL_BENCHMARK_COEFF = 0.18;
  
  return (parseFloat(distance) * DIESEL_BENCHMARK_COEFF).toFixed(2);
};

/**
 * Calcola il risparmio ecologico netto.
 * @param {number|string} actualCO2 - La CO2 calcolata per il mezzo scelto.
 * @param {number|string} benchmarkCO2 - La CO2 calcolata per il diesel standard.
 * @returns {string} - Il risparmio in kg di CO2.
 */
export const calculateSavings = (actualCO2, benchmarkCO2) => {
  const savings = parseFloat(benchmarkCO2) - parseFloat(actualCO2);
  return savings.toFixed(2);
};