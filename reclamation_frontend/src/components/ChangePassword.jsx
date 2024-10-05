import React, { useState } from 'react';
import { TextField, Button, Typography, InputAdornment, IconButton, Modal, Box } from '@mui/material';
import axios from 'axios';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const ChangePassword = ({ open, handleClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(''); // Nouvel état pour l'email

  const modalStyle = {
    position: 'absolute',
    padding: '0px',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    height: 500,
    bgcolor: 'background.paper',
    borderRadius: '10px',
    boxShadow: 24,
    p: 4,
  };
  

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Les nouveaux mots de passe ne correspondent pas.');
      return;
    }
    try {
      const response = await axios.put('http://localhost:8080/api/users/change-password', {
        email,
        currentPassword,
        newPassword,
      });

      if (response.data === "Mot de passe changé avec succès.") {
        setSuccess('Mot de passe changé avec succès.');
        // Réinitialiser les champs après une modification réussie
        setEmail('');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        handleClose(); // Fermer le modal après un changement réussi
      } else {
        setError(response.data);  // Afficher la réponse renvoyée par le serveur s'il y a un problème
      }
    } catch (error) {
      if (error.response) {
        // Affichez les détails de l'erreur renvoyée par le serveur (statut et message d'erreur)
        console.log("Erreur du serveur:", error.response.status, error.response.data);
        setError(`Erreur: ${error.response.data || 'Problème lors du changement de mot de passe.'}`);
      } else if (error.request) {
        // Le serveur ne répond pas
        console.log("Aucune réponse du serveur:", error.request);
        setError('Aucune réponse du serveur.');
      } 
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography id="modal-modal-title" variant="h6" component="h2" fontFamily="cursive">
          Changer le mot de passe
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Mot de passe actuel"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Nouveau mot de passe"
            type="password"
            fullWidth
            margin="normal"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            
          />
          <TextField
            label="Confirmer le nouveau mot de passe"
            type="password"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
           
          />
          {error && <Typography color="error">{error}</Typography>}
          {success && <Typography color="primary">{success}</Typography>}
          <Button 
          type="submit" 
          variant="contained" 
         
          fullWidth
          style={{ 
            textTransform: 'none',
            fontFamily:'cursive',
            backgroundColor: 'green',
            marginTop: '10px', 
            }}>
            Changer le mot de passe
          </Button>
          <Button 
          onClick={handleClose} 
          variant="contained" 
          fullWidth 
          style={{
          marginTop: '10px', 
          textTransform: 'none',
          backgroundColor: '#fdc500',
          fontFamily:'cursive',
        
           }}>
            Annuler
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default ChangePassword;
