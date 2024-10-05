import React, { useState, useEffect } from 'react';
import './HomeContent.css'; // Assure-toi que ce fichier est bien importé

const HomeContent = () => {
  const [time, setTime] = useState(new Date());

  // Met à jour l'heure chaque seconde
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer); // Nettoie le timer
  }, []);

  // Formate la date en français avec le jour et le mois en toutes lettres
  const formattedDate = time.toLocaleDateString('fr-FR', {
    weekday: 'long', // Jour de la semaine en toutes lettres
    day: 'numeric',  // Jour du mois en chiffres
    month: 'long',   // Mois en toutes lettres
    year: 'numeric'  // Année en chiffres
  });

  return (
    <div className="home-content">
     
      <div className="time-display">
        {/* Affichage de la date et de l'heure formatées */}
        {formattedDate} <hr></hr> {time.toLocaleTimeString('fr-FR')}
      </div>

    {/* Modern Google Style Loader */}
    <div className="google-loader">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
        <div className="circle circle-4"></div>
      </div>
   
    </div>
  );
};

export default HomeContent;
