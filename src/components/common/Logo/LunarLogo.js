import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LunarLogo.css';

const LunarLogo = ({ variant = 'black' }) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <div 
      className={`lunar-logo ${variant}`} 
      onClick={handleLogoClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter') {
          handleLogoClick();
        }
      }}
    >
      <div className="moon-phases">
        <div className="moon waxing-crescent"></div>
        <div className="moon waxing-gibbous"></div>
        <div className="moon full"></div>
        <div className="moon waning-gibbous"></div>
        <div className="moon waning-crescent"></div>
      </div>
      <div className="logo-text">
        <span>L</span>
        <span>U</span>
        <span>N</span>
        <span>A</span>
        <span>R</span>
      </div>
    </div>
  );
};

export default LunarLogo;