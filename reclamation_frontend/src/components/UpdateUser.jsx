import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid , IconButton, InputAdornment} from '@mui/material';
import axios from 'axios';
import './UpdateUser.css';
import AddIcon from '@mui/icons-material/Add';
import { Visibility, VisibilityOff } from '@mui/icons-material';


const UpdateUser = ({ user, onClose, onUserUpdated, edit, enregistrer, constantFalse }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    firstName: '',
    userName: '',
    email: '',
    phoneNumber: '',
    department: '',
    function: '',
    password: '',
  });
 

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        userName: user.userName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        department: user.department || '',
        function: user.function || '',
      });
    }
  }, [user]);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validation pour le nom
    if (name === 'userName') {
      setFormData({ ...formData, [name]: value.replace(/[^a-zA-Z]/g, '').toUpperCase() });
    } 
    // Validation pour les champs firstName, department, function
    else if (name === 'firstName' || name === 'department' || name === 'function') {
      const formattedValue = value
        .replace(/[^a-zA-Z\s]/g, '')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      setFormData({ ...formData, [name]: formattedValue });
    } 
    else {
      setFormData({ ...formData, [name]: value });
    }
    // Effacer l'erreur si le champ est rempli correctement
  if (errors[name]) {
    const updatedErrors = { ...errors };
    delete updatedErrors[name]; // Supprimer l'erreur pour ce champ
    setErrors(updatedErrors);   // Mettre à jour l'état des erreurs
  }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {}; // Initialisation de l'objet newErrors
  
    // Validation de l'email
    if (!formData.email.endsWith('@gmail.com')) {
      valid = false;
      newErrors.email = "L'email doit se terminer par '@gmail.com'";
    }
  
    // Validation du numéro de téléphone
    const phoneRegex1 = /^4[0-9]{6}$/;
    const phoneRegex2 = /^(034|038)[0-9]{7}$/;
  
    if (!(phoneRegex1.test(formData.phoneNumber) || phoneRegex2.test(formData.phoneNumber))) {
      valid = false;
      newErrors.phoneNumber = "Le numéro de téléphone n'est pas valide. Il doit commencer par 4 ou 034/038.";
    }
  
    // Vérification des champs vides
    Object.keys(formData).forEach((key) => {
      if (!formData[key] && key !== 'password') {
        valid = false;
        newErrors[key] = `Le champ ${key} est requis.`;
      }
    });
  
    // Si des erreurs sont présentes, on les stocke dans l'état et on retourne false
    if (!valid) {
      setErrors(newErrors); // Mettez à jour les erreurs dans l'état
    }
  
    return valid;
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Appel à validateForm pour vérifier les données
    if (!validateForm()) {
      return; // Si la validation échoue, on arrête le processus
    }

    try {
      // Utiliser le nouvel endpoint pour la mise à jour des informations utilisateur
      await axios.put(`http://localhost:8080/api/users/users/${user.id}/update-info`, formData);
      setErrors({});
      setFormData({
        firstName: '',
        userName: '',
        email: '',
        phoneNumber: '',
        department: '',
        function: '',
      });
      onUserUpdated(); // Appeler cette fonction pour rafraîchir la liste des utilisateurs
      onClose(); // Fermer la modal après soumission
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur", error);
    }
  };

  const handleClose = () => {
    setFormData({
      firstName: '',
      userName: '',
      email: '',
      phoneNumber: '',
      department: '',
      function: '',
    });
    constantFalse();
  };

  const handleAjoutDirect = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Si la validation échoue, on arrête le processus
    }

    const userData = {
      userName: formData.userName,
      firstName: formData.firstName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      department: formData.department,
      function: formData.function,
      password: formData.password,
    };
     // Réinitialiser immédiatement les champs du formulaire
      setFormData({
        userName: '',
        firstName: '',
        email: '',
        phoneNumber: '',
        department: '',
        function: '',
        password: '',
      });

      // Fermer la modal immédiatement après soumission
      onClose();

    try {
      const response = await fetch('http://localhost:8080/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const newUser = await response.json();
        console.log('Utilisateur créé :', newUser);
      } else {
        console.error('Erreur lors de la création de l\'utilisateur');
      }
    } catch (error) {
      console.error('Erreur de connexion au serveur :', error);
    } 
  };

  return (
    <div className="modal-content">
      <form onSubmit={user ? handleSubmit : handleAjoutDirect}>
        <Grid container spacing={2}>
          {/* Ligne 1 : Nom, Prénom et Email côte à côte */}
          <Grid item xs={12} sm={4}>
            <TextField
              label="Nom"
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              fullWidth
              error={!!errors.userName} 
              helperText={errors.userName} 
             />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Numéro de téléphone"
              type="number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              fullWidth
              error={!!errors.phoneNumber} 
              helperText={errors.phoneNumber} 
           />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
             label="Fonction"
             type="text"
             name="function"
             value={formData.function}
             onChange={handleChange}
             fullWidth
             error={!!errors.function} 
             helperText={errors.function} 
            />
          </Grid>

          {/* Ligne 2 : Numéro de téléphone, Département et Fonction côte à côte */}
          <Grid item xs={12} sm={4}>
            <TextField
            label="Prénom"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            fullWidth
            error={!!errors.firstName} 
            helperText={errors.firstName} 
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
            label="Département"
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            fullWidth
            error={!!errors.department} 
            helperText={errors.department} 
          />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
            label="Mot de passe"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            error={!!errors.password} 
            helperText={errors.password} 
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
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            error={!!errors.email} // Affiche un style d'erreur si une erreur est présente
            helperText={errors.email} // Affiche le message d'erreur en dessous du champ
          />
          </Grid>
          <Grid item xs={12} sm={4}>
          </Grid>

          {enregistrer && (
            <Grid item xs={12} sm={4}>
              <Button 
                onClick={handleAjoutDirect}
                variant="contained"
                sx={{
                  backgroundColor: '#fdc500',
                  color: 'white',
                  textTransform: 'capitalize',
                  marginLeft: '130px',
                  width: '150px',
                  fontFamily: 'cursive',
                  '&:hover': {
                    backgroundColor: '#e5b800',
                    color: 'black',
                  },
                }}
              >
                 <AddIcon sx={{ marginRight: '8px' }} /> {/* Ajoutez l'icône ici */}
                Ajouter
              </Button>
            </Grid>
          )}
          <Grid item xs={12} sm={4}>
          </Grid>
  
          {/* Ligne des boutons */}
          {edit && (
            <Grid item xs={12} sm={4}>
              <Button
                onClick={handleClose}
                variant="contained"
                sx={{
                  backgroundColor: 'green',
                  color: 'white',
                  textTransform: 'capitalize',
                  fontFamily: 'cursive',
                  marginTop: '-150px', 
                  marginLeft:'950px',
                  width:'100px',
                  '&:hover': {
                    backgroundColor: 'darkgreen',
                    color: 'black',
                  },
                }}
              
              >
                Annuler
              </Button>
            </Grid>
          )}
  
          {edit && (
            <Grid item xs={12} sm={4}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: '#fdc500',
                  color: 'white',
                  textTransform: 'capitalize',
                  fontFamily: 'cursive',
                  marginLeft:'650px',
                  marginTop: '-150px', 
                  '&:hover': {
                    backgroundColor: '#e5b800',
                    color: 'black',
                  },
                }}
              
              >
                Enregistrer
              </Button>
            </Grid>
          )}
        </Grid>
      </form>
    </div>
  );
  
};

export default UpdateUser;
