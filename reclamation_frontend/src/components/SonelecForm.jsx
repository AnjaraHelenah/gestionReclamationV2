import React, { useState } from 'react';
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import Navbar from './NavBar';
import CloseIcon from '@mui/icons-material/Close';



const SonelecForm = () => {
  const [open, setOpen] = useState(true);
  const [formData, setFormData] = useState({
    typeReclamation: '',
    nameCustomer: '',
    firstNameCustomer: '',
    msisdn: '',
    meterID: '',
    transID: '',
    amount: '',
    dateAchat: '',
    dateReclamation: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
    navigate('/home');
  };

  const capitalizeFirstLetter = (str) => {
    return str.replace(/\b\w+/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
  };

  const validateFields = () => {
    const newErrors = {};

    if (!formData.nameCustomer) {
      newErrors.nameCustomer = 'Le nom du client est requis';
    }
    if (!formData.firstNameCustomer) {
      newErrors.firstNameCustomer = 'Le prénom du client est requis';
    }

    // Validation pour le numéro de téléphone
  
    const regex4 = /^4\d{6}$/;
    if ( !regex4.test(formData.msisdn)) {
      newErrors.msisdn = 'Le numéro doit commencer par 4 (6 chiffres après)';
    }

    // Validation pour le numéro de compteur
    if (!(formData.meterID.length === 11 || formData.meterID.length === 13)) {
      newErrors.meterID = 'Le numéro de compteur doit contenir 11 ou 13 chiffres';
    }

    // Validation pour la référence d'achat
    if (formData.transID.length !== 10) {
      newErrors.transID = 'La référence d\'achat doit contenir exactement 10 chiffres';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0; // Si pas d'erreurs, retourne vrai
  };

  const handleChange = (e) => {
    let { name, value } = e.target;

    // Contrôles de validation à la saisie
    if (name === 'nameCustomer') {
      value = value.toUpperCase();
    }

    if (name === 'firstNameCustomer') {
      value = capitalizeFirstLetter(value);
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation des champs
    if (!validateFields()) {
      console.error('Le formulaire contient des erreurs');
      return; // Si le formulaire contient des erreurs, ne pas soumettre
    }

    try {
      await fetch('http://localhost:8080/api/reclamations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      handleClose();
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la réclamation:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div>
       
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xm"
        fullWidth
        PaperProps={{
          style: {
            maxWidth: '500px',
            height: '450px',
          },
        }}
      >
        <DialogTitle style={{ fontSize: '16px', fontFamily: 'cursive'}}>
           Réclamation pour Sonelec
          <IconButton
            aria-label="close"
            onClick={handleClose}
            style={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: '#000',
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Type de réclamation"
              margin="normal"
              variant="outlined"
              name="typeReclamation"
              value={formData.typeReclamation}
              onChange={handleChange}
            
            />
            <TextField
              fullWidth
              label="Date de réclamation"
              margin="normal"
              variant="outlined"
              type="date"
              name="dateReclamation"
              InputLabelProps={{ shrink: true }}
              value={formData.dateReclamation}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Nom du client"
              margin="normal"
              variant="outlined"
              name="nameCustomer"
              value={formData.nameCustomer}
              onChange={handleChange}
              error={!!errors.nameCustomer}
              helperText={errors.nameCustomer}
            />
            <TextField
              fullWidth
              label="Prénom du client"
              margin="normal"
              variant="outlined"
              name="firstNameCustomer"
              value={formData.firstNameCustomer}
              onChange={handleChange}
              error={!!errors.firstNameCustomer}
              helperText={errors.firstNameCustomer}
            />
            <TextField
              fullWidth
              label="Numéro de téléphone du client"
              margin="normal"
              variant="outlined"
              name="msisdn"
              value={formData.msisdn}
              onChange={handleChange}
              error={!!errors.msisdn}
              helperText={errors.msisdn}
            />
            <TextField
              fullWidth
              label="Numéro compteur du client"
              margin="normal"
              variant="outlined"
              name="meterID"
              value={formData.meterID}
              onChange={handleChange}
              error={!!errors.meterID}
              helperText={errors.meterID}
            />
            <TextField
              fullWidth
              label="Référence de l'achat"
              margin="normal"
              variant="outlined"
              name="transID"
              value={formData.transID}
              onChange={handleChange}
              error={!!errors.transID}
              helperText={errors.transID}
            />
            <TextField
              fullWidth
              label="Montant de l'achat"
              margin="normal"
              variant="outlined"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Date d'achat"
              margin="normal"
              variant="outlined"
              type="date"
              name="dateAchat"
              InputLabelProps={{ shrink: true }}
              value={formData.dateAchat}
              onChange={handleChange}
            />
            <DialogActions>
              <Button
                variant="contained"
                onClick={handleClose}
                sx={{
                  backgroundColor: 'green',
                  color: 'white',
                  textTransform: 'capitalize',
                  fontFamily: 'cursive',
                  '&:hover': {
                    backgroundColor: 'darkgreen',
                    color: 'black',
                  },
                }}
                fullWidth
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: '#fdc500',
                  color: 'white',
                  textTransform: 'capitalize',
                  fontFamily: 'cursive',
                  '&:hover': {
                    backgroundColor: '#e5b800',
                    color: 'black',
                  },
                }}
                fullWidth
              >
                Soumettre
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
      </div>
    </>
  );
};

export default SonelecForm;
