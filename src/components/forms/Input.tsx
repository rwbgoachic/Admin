import React from 'react';
import './Input.css';
import '../../styles/inputs.css';

type InputProps = {
  label?: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const Input = ({ label, error, ...props }: InputProps) => (
  <div className="input-container">
    {label && <label className="input-label">{label}</label>}
    <input 
      className={`input-field ${error ? 'error' : ''}`} 
      {...props} 
    />
    {error && <span className="input-error">{error}</span>}
  </div>
);