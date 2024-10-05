import React, { useState, useEffect } from 'react';
import { TextField, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginForm = ({ onSwitch }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(''); // Nouvel état pour stocker le rôle
  const navigate = useNavigate();

  // Fonction pour afficher/masquer le mot de passe
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
 

  // Fonction pour récupérer le rôle de l'utilisateur
  useEffect(() => {
    if (email) {
      axios.get(`http://localhost:8080/api/users/role-by-email?email=${email}`)
        .then(response => {
          const userRole = response.data.role;
          setRole(userRole); // Stocker le rôle récupéré
        })
        .catch(error => {
          console.error('Erreur lors de la récupération du rôle', error);
          setRole(''); // Effacer le rôle si l'email n'est pas valide ou qu'il n'existe pas
        });
    } else {
      setRole('');
    }
  }, [email]);

  // Fonction de soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
  
    axios.post('http://localhost:8080/api/users/login', { email, password })
    .then(response => {
      const { role } = response.data;
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', response.data.role); // Stocker correctement le rôle
      toast.success('Connexion réussie');
      navigate('/home'); // Redirige vers la page d'accueil
    })
    .catch(error => {
      if (error.response && error.response.status === 403) {
        toast.error('Votre compte n\'est pas encore validé.');
      } else {
        toast.error('Identifiants invalides.');
      }
    });
  };
  

  return (
    <div className="form-container">
      <h3>Connexion</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <TextField
        
            label="Email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
           
          />
        </div>
        <div>
          <TextField
            label="Mot de passe"
            type={showPassword ? "text" : "password"}
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            
            fullWidth
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </div>
        {/* Champ pour afficher le rôle */}
        <div style={{display: 'none'}}>
          <TextField
            label="Rôle"
            value={role} // Le rôle récupéré depuis l'API
            InputProps={{
              readOnly: true, // Le champ est en lecture seule
            }}
            fullWidth
            margin="normal"
          />
        </div>
        <button type="submit">Se connecter</button>
      </form>
      <ToastContainer position="top-center" transition={Slide} autoClose={5000} />
      <p>
        Vous n'avez pas de compte ?{' '}
        <button onClick={onSwitch} className="switch-button">
          Inscrivez-vous
        </button>
      </p>
    </div>
  );
};

export default LoginForm;
