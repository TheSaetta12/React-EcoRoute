import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { calculateCO2, calculateBenchmark } from '../utils/ecoCalc';

const EcoChart = ({ shipments, vehicles }) => {
  
  // 1. TRASFORMAZIONE DATI (Prepariamo i dati prima del Tooltip)
  const chartData = shipments.map(s => {
    const actual = calculateCO2(s.distanceKm, s.vehicleId, vehicles);
    const benchmark = calculateBenchmark(s.distanceKm, vehicles);
    const vehicle = vehicles.find(v => v.id === s.vehicleId);

    return {
      name: s.code,
      Actual: parseFloat(actual),
      Benchmark: parseFloat(benchmark),
      vehicleType: vehicle ? vehicle.type : 'Mezzo non definito'
    };
  });

  // 2. TOOLTIP BLINDATO (La soluzione al tuo errore)
  const CustomTooltip = ({ active, payload, label }) => {
    // Usiamo il controllo opzionale ?. e verifichiamo che l'array abbia elementi
    if (active && payload && payload.length > 0) {
      // Accediamo in sicurezza al primo elemento dell'array
      const data = payload.payload;

      // Se per qualche motivo data è ancora undefined, usiamo un fallback per non crashare
      if (!data) return null;

      const saving = (data.Benchmark - data.Actual).toFixed(2);

      return (
        <div className="bg-dark text-white p-3 rounded shadow-lg border border-success" style={{ opacity: 0.95 }}>
          <p className="fw-bold mb-1 text-success border-bottom border-secondary pb-1">{label}</p>
          <p className="small mb-1">Mezzo: <span className="fw-bold">{data.vehicleType}</span></p>
          <p className="small mb-1 text-info">Effettiva: {data.Actual} kg CO2</p>
          <p className="small mb-1 text-danger">Benchmark Diesel: {data.Benchmark} kg CO2</p>
          <hr className="my-2 border-secondary" />
          <p className="small mb-0 fw-bold text-success">
            Risparmio: {saving} kg CO2 🌿
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card shadow-sm border-0 p-4 bg-white" style={{ height: '450px' }}>
      <h5 className="fw-bold text-dark text-uppercase small mb-4">Analisi Comparativa Emissioni</h5>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          
          {/* Tooltip con la logica corretta */}
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8f9fa' }} />
          
          <Legend verticalAlign="top" align="right" />
          <Bar 
            dataKey="Actual" 
            name="CO2 EcoRoute" 
            fill="#198754" 
            isAnimationActive={true} 
            animationDuration={1000} 
          />
          <Bar 
            dataKey="Benchmark" 
            name="Benchmark Diesel" 
            fill="#dc3545" 
            isAnimationActive={true} 
            animationDuration={1000} 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EcoChart;