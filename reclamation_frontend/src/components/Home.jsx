import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './NavBar';
import HomeContent from './HomeContent';

const Home = () => {
  const navigate = useNavigate();

  const onLogout = () => {
    // Supprimer l'indicateur de connexion
    localStorage.removeItem('isLoggedIn');
    navigate('/', { replace: true }); // Rediriger vers la page de connexion
  };

  // Créer un thème personnalisé
  const theme = createTheme({
    palette: {
      primary: {
        main: '#00692f',
      },
      secondary: {
        main: '#fdc500',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        <Navbar onLogout={onLogout} />
        <HomeContent />
      </div>
    </ThemeProvider>
  );
};

export default Home;
