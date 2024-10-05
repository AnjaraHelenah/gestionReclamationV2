import React, { useState } from 'react';
import { TextField, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';

const SignupForm = ({ onSwitch }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    userName: '',
    firstName: '',
    email: '',
    phoneNumber: '',
    department: '',
    function: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'userName') {
      setFormData({ ...formData, [name]: value.replace(/[^a-zA-Z]/g, '').toUpperCase() });
    } else if (name === 'firstName' || name === 'department' || name === 'function') {
      const formattedValue = value
        .replace(/[^a-zA-Z\s]/g, '')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      setFormData({ ...formData, [name]: formattedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    let valid = true;

    if (!formData.email.endsWith('@gmail.com')) {
      valid = false;
      toast.error("L'email doit se terminer par '@gmail.com'");
      return valid;
    }

    const phoneRegex1 = /^4[0-9]{6}$/;
    const phoneRegex2 = /^(034|038)[0-9]{7}$/;

    if (!(phoneRegex1.test(formData.phoneNumber) || phoneRegex2.test(formData.phoneNumber))) {
      valid = false;
      toast.error("Le numéro de téléphone n'est pas valide. Il doit commencer par 4 ou 034/038.");
    }

    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        valid = false;
      }
    });

    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      axios.post('http://localhost:8080/api/users/signup', formData)
        .then(response => {
          toast.success('La validation de votre compte est en attente. Vous recevrez un email quand votre compte sera actif.');

          setFormData({
            userName: '',
            firstName: '',
            email: '',
            phoneNumber: '',
            department: '',
            function: '',
            password: '',
          });
          setIsSubmitting(false);
        })
        .catch(error => {
          console.error('Erreur API:', error);
          toast.error('Il y a eu une erreur. Veuillez réessayer.');
          setIsSubmitting(false);
        });
    } else {
      toast.error('Veuillez remplir tous les champs correctement.');
    }
  };

  return (
    <div className={isSubmitting ? 'blur form-container' : 'form-container'}>
      <h3>Inscription </h3>
      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            label="Nom"
            type="text"
            fullWidth
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            margin="normal"
          />
        </div>
        <div>
          <TextField
            label="Prénom"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            
            fullWidth
            margin="normal"
          />
        </div>
        <div>
          <TextField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
        
            fullWidth
            margin="normal"
          />
        </div>
        <div>
          <TextField
            label="Numéro de téléphone"
            type="number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
         
            fullWidth
            margin="normal"
          />
        </div>
        <div>
          <TextField
            label="Département"
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
           
            fullWidth
            margin="normal"
          />
        </div>
        <div>
          <TextField
            label="Fonction"
            type="text"
            name="function"
            value={formData.function}
            onChange={handleChange}
            
            fullWidth
            margin="normal"
          />
        </div>
        <div>
          <TextField
            label="Mot de passe"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
         
            fullWidth
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </div>
        <button type="submit" disabled={isSubmitting} className="button-spacing">S'inscrire</button>
      </form>
      <ToastContainer position="top-center" transition={Slide} autoClose={5000} />
      <p>
        Vous avez déjà un compte ?{' '}
        <button onClick={onSwitch} className="switch-button">
          Connectez-vous
        </button>
      </p>
    </div>
  );
};

export default SignupForm;
