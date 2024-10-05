import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn');

  // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  // Si l'utilisateur est connecté, afficher les enfants (composants protégés)
  return children;
};

export default ProtectedRoute;
