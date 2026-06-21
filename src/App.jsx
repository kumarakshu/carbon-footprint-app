import { useState } from 'react';
import DOMPurify from 'dompurify';

export default function App() {
  const [transport, setTransport] = useState('');
  const [diet, setDiet] = useState('');
  const [energy, setEnergy] = useState('');
  const [footprint, setFootprint] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [totalSaved, setTotalSaved] = useState(0);

  const EMISSION_FACTORS = {
    transport: 0.2, // kg CO2 per km
    diet: {
        'meat-heavy': 3.3,
        'average': 2.5,
        'vegetarian': 1.7,
        'vegan': 1.5
    },
    energy: 0.5 // kg CO2 per $ spent
  };

  const calculateFootprint = (e) => {
    e.preventDefault();
    
    // Security: sanitize inputs although React escapes by default
    const cleanTransport = parseFloat(DOMPurify.sanitize(transport)) || 0;
    const cleanEnergy = parseFloat(DOMPurify.sanitize(energy)) || 0;
    
    const transportEmissions = (cleanTransport * 365 * EMISSION_FACTORS.transport) / 1000;
    const dietEmissions = EMISSION_FACTORS.diet[diet] || 2.5;
    const energyEmissions = (cleanEnergy * 12 * EMISSION_FACTORS.energy) / 1000;

    const total = parseFloat((transportEmissions + dietEmissions + energyEmissions).toFixed(2));
    setFootprint(total);

    if (total < 5) {
      setFeedback("Great job! You are well below the global average. Keep up the good work!");
    } else if (total < 10) {
      setFeedback("You're around average. Consider exploring the Action Tracker below to reduce it further.");
    } else {
      setFeedback("Your footprint is quite high. Focus on reducing transport or energy use as a first step!");
    }
  };

  const logAction = (savings) => {
    setTotalSaved(prev => parseFloat((prev + savings).toFixed(2)));
  };

  return (
    <div className="app-container">
      <header className="navbar" role="banner">
        <div className="container">
          <h1 className="logo">EcoTrack 🌱</h1>
        </div>
      </header>

      <main role="main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="container">
            <h2 id="hero-title">Take Control of Your Environmental Impact</h2>
            <p>Calculate your carbon footprint, discover personalized insights, and start reducing your emissions today.</p>
          </div>
        </section>

        <section id="calculator" className="section glass-section" aria-labelledby="calc-title">
          <div className="container">
            <h2 id="calc-title" className="section-title">Carbon Footprint Calculator</h2>
            <form onSubmit={calculateFootprint} aria-label="Carbon footprint calculator form">
              <div className="form-group">
                <label htmlFor="transport">Daily Commute (km)</label>
                <input 
                  type="number" 
                  id="transport" 
                  min="0" 
                  value={transport}
                  onChange={(e) => setTransport(e.target.value)}
                  placeholder="e.g. 15" 
                  required 
                  aria-required="true" 
                />
              </div>
              <div className="form-group">
                <label htmlFor="diet">Diet Type</label>
                <select 
                  id="diet" 
                  value={diet}
                  onChange={(e) => setDiet(e.target.value)}
                  required 
                  aria-required="true"
                >
                  <option value="" disabled>Select your diet</option>
                  <option value="meat-heavy">Meat-Heavy</option>
                  <option value="average">Average</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="energy">Monthly Electricity Bill ($)</label>
                <input 
                  type="number" 
                  id="energy" 
                  min="0" 
                  value={energy}
                  onChange={(e) => setEnergy(e.target.value)}
                  placeholder="e.g. 50" 
                  required 
                  aria-required="true" 
                />
              </div>
              <button type="submit" className="btn btn-secondary" aria-label="Calculate Footprint">
                Calculate Footprint
              </button>
            </form>
            
            {footprint !== null && (
              <div className="result-card" aria-live="polite" role="region" aria-labelledby="result-title">
                <h3 id="result-title">Your Estimated Annual Footprint:</h3>
                <p className="score-display">{footprint} Tons CO2</p>
                <p>{feedback}</p>
              </div>
            )}
          </div>
        </section>

        <section id="dashboard" className="section" aria-labelledby="dashboard-title">
          <div className="container">
            <h2 id="dashboard-title" className="section-title">Action Tracker Dashboard</h2>
            <p className="section-subtitle">Log your daily eco-actions to reduce your footprint.</p>
            
            <div className="action-grid" role="list">
              <div className="action-card" role="listitem">
                <h3>🚲 Used Public Transport</h3>
                <p>Reduces up to 2kg CO2 per day.</p>
                <button className="btn btn-action log-btn" onClick={() => logAction(2.0)} aria-label="Log Public Transport Action">Log Action</button>
              </div>
              <div className="action-card" role="listitem">
                <h3>🥗 Plant-based Meal</h3>
                <p>Reduces up to 1.5kg CO2 per meal.</p>
                <button className="btn btn-action log-btn" onClick={() => logAction(1.5)} aria-label="Log Plant-based Meal Action">Log Action</button>
              </div>
              <div className="action-card" role="listitem">
                <h3>💡 Energy Saving</h3>
                <p>Turned off unused devices. Reduces 0.5kg CO2.</p>
                <button className="btn btn-action log-btn" onClick={() => logAction(0.5)} aria-label="Log Energy Saving Action">Log Action</button>
              </div>
            </div>

            <div className="progress-section" aria-live="polite" aria-atomic="true">
              <h3>Total CO2 Saved This Week</h3>
              <p data-testid="total-saved" className="saved-display">{totalSaved} kg</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer" role="contentinfo">
        <div className="container">
          <p>&copy; 2026 EcoTrack. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
