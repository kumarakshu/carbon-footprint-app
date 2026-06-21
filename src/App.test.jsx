import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('Carbon Footprint App', () => {
  it('renders the hero section', () => {
    render(<App />);
    expect(screen.getByText(/Take Control of Your Environmental Impact/i)).toBeInTheDocument();
  });

  it('calculates the footprint correctly', () => {
    render(<App />);
    
    // Fill the form
    fireEvent.change(screen.getByLabelText(/Daily Commute/i), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText(/Diet Type/i), { target: { value: 'vegan' } });
    fireEvent.change(screen.getByLabelText(/Monthly Electricity Bill/i), { target: { value: '50' } });
    
    // Submit
    fireEvent.click(screen.getByRole('button', { name: /Calculate Footprint/i }));
    
    // Check Result: (10*365*0.2)/1000 + 1.5 + (50*12*0.5)/1000 = 0.73 + 1.5 + 0.3 = 2.53
    expect(screen.getByText(/2.53 Tons CO2/i)).toBeInTheDocument();
    expect(screen.getByText(/Great job! You are well below the global average/i)).toBeInTheDocument();
  });

  it('logs actions correctly', () => {
    render(<App />);
    
    const initialSaved = screen.getByTestId('total-saved');
    expect(initialSaved.textContent).toBe('0 kg');
    
    // Click 'Log Action' for Public Transport
    const transportLogBtn = screen.getByRole('button', { name: /Log Public Transport Action/i });
    fireEvent.click(transportLogBtn);
    
    expect(screen.getByTestId('total-saved').textContent).toBe('2 kg');
    
    // Click 'Log Action' for Energy
    const energyLogBtn = screen.getByRole('button', { name: /Log Energy Saving Action/i });
    fireEvent.click(energyLogBtn);
    
    expect(screen.getByTestId('total-saved').textContent).toBe('2.5 kg');
  });
});
