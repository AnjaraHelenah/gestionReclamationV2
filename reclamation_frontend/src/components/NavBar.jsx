import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Badge, Button, Menu, MenuItem } from '@mui/material';
import { Mail as MailIcon, ExitToApp as ExitToAppIcon, AccountCircle as AccountCircleIcon } from '@mui/icons-material'; 
import { styled } from '@mui/system';
import TelmaLogo from './image/images.png';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import ChangePassword from './ChangePassword'; // Importer le composant de changement de mot de passe

// Styles personnalisés
const GoldAppBar = styled(AppBar)({
  backgroundColor: '#fdc500',
  transition: 'background-color 0.3s ease',
  zIndex: 1300, // S'assurer que la barre de navigation est toujours au-dessus
});

const StyledIconButton = styled(IconButton)({
  color: '#000',
  '&:hover': {
    color: '#00692f',
    transform: 'scale(1.1)',
    transition: 'transform 0.3s ease, color 0.3s ease',
  },
});

const StyledButton = styled(Button)(({ active }) => ({
  color: '#000',
  fontSize: '1rem',
  fontFamily: 'cursive',
  padding: '6px 12px',
  textTransform: 'none', 
  borderBottom: active ? '2px solid #00692f' : 'none',
  '&:hover': {
    color: '#00692f',
    transform: 'scale(1.1)',
    transition: 'transform 0.3s ease, color 0.3s ease',
  },
}));

const StyledMenuItem = styled(MenuItem)({
  fontSize: '0.8rem',
  fontFamily: 'cursive',
});

const Navbar = ({ onLogout }) => {
  const [activeButton, setActiveButton] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElHistory, setAnchorElHistory] = useState(null);
  const [anchorElProfile, setAnchorElProfile] = useState(null);
  const [disabledUsersCount, setDisabledUsersCount] = useState(0);
  const [isAgent, setIsAgent] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false); // État pour gérer l'ouverture du modal

  const navigate = useNavigate();
  const location = useLocation();

  const fetchDisabledUsersCount = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/users/users/count-disabled');
      setDisabledUsersCount(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs désactivés', error);
    }
  };

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    setIsAgent(userRole && userRole.trim().toLowerCase() === 'agent');
  }, );

  useEffect(() => {
    fetchDisabledUsersCount();
  }, );

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/userlist')) {
      setActiveButton('userlist');
    } else if (path.includes('/sonelec')) {
      setActiveButton('sonelec');
    } else if (path.includes('/sonelec-history')) {  // Correction pour historique SONELEC
      setActiveButton('history');
    } else {
      setActiveButton('');
    }
  }, [location]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setActiveButton('reclamations');
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSonelecClick = () => {
    handleClose();
    setActiveButton('sonelec');
    navigate('/sonelec');
  };

  const handleHistoryClick = (event) => {
    setAnchorElHistory(event.currentTarget);
    setActiveButton('history');
  };

  const handleHistoryClose = () => {
    setAnchorElHistory(null);
  };

  const handleProfileClick = (event) => {
    setAnchorElProfile(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorElProfile(null);
  };

  const handleChangePassword = () => {
    setOpenChangePassword(true); // Ouvrir le modal
    handleProfileClose();
  };

  const handleCloseChangePassword = () => {
    setOpenChangePassword(false); // Fermer le modal
  };

   // Redirection vers la page historique SONELEC
   const handleSonelecHistoryClick = () => {
    handleHistoryClose();
    navigate('/sonelec-history'); // Nouvelle route pour l'historique de SONELEC
  };

  return (
    <> 
      <GoldAppBar position="fixed"> {/* Changer à 'fixed' */}
        <Toolbar>
          <StyledIconButton edge="start" aria-label="logo">
            <img src={TelmaLogo} alt="Telma Logo" style={{ height: '60px' }} />
          </StyledIconButton>

          <Typography variant="h6" style={{ flexGrow: 1, textAlign: 'center' }}>
            {/* Menu Réclamations */}
            <StyledButton
              active={activeButton === 'reclamations'}
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleClick}
            >
              <strong>Réclamations</strong>
            </StyledButton>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <StyledMenuItem active={activeButton === 'reclamations'}
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleSonelecClick}>SONELEC</StyledMenuItem>
              <StyledMenuItem onClick={handleClose}>Welcome bonus</StyledMenuItem>
              <StyledMenuItem onClick={handleClose}>Transfert international</StyledMenuItem>
              <StyledMenuItem onClick={handleClose}>Bank to wallet</StyledMenuItem>
            </Menu>

            {/* Menu Historique de réclamation */}
            
              <StyledButton
                active={activeButton === 'history'}
                aria-controls="history-menu"
                aria-haspopup="true"
                onClick={handleHistoryClick}
              >
                <strong>Historiques de réclamations</strong>
              </StyledButton>
            
            <Menu
              id="history-menu"
              anchorEl={anchorElHistory}
              keepMounted
              open={Boolean(anchorElHistory)}
              onClose={handleHistoryClose}
            >
              <StyledMenuItem active={activeButton === 'reclamations'}
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleSonelecHistoryClick}>Historique SONELEC</StyledMenuItem>
              <StyledMenuItem onClick={handleHistoryClose}>Historique Welcome bonus</StyledMenuItem>
              <StyledMenuItem onClick={handleHistoryClose}>Historique Transfert international</StyledMenuItem>
              <StyledMenuItem onClick={handleHistoryClose}>Historique Bank to wallet</StyledMenuItem>
            </Menu>

            {/* Liste des utilisateurs */}
            {!isAgent && (
              <StyledButton
                active={activeButton === 'userlist'}
                component={Link}
                to="/userlist"
              >
                <strong>Liste des utilisateurs</strong>
              </StyledButton>
            )}
          </Typography>

          {/* Icône Profil */}
          <StyledIconButton onClick={handleProfileClick}>
            <AccountCircleIcon />
          </StyledIconButton>
          <Menu
            id="profile-menu"
            anchorEl={anchorElProfile}
            keepMounted
            open={Boolean(anchorElProfile)}
            onClose={handleProfileClose}
          >
            <StyledMenuItem onClick={handleChangePassword}>Changer mot de passe</StyledMenuItem>
          </Menu>

          {/* Boîte de réception */}
          {!isAgent && (
            <StyledIconButton>
              <Badge badgeContent={disabledUsersCount} color="success">
                <MailIcon />
              </Badge>
            </StyledIconButton>
          )}

          {/* Bouton de déconnexion */}
          <StyledIconButton onClick={onLogout}>
            <ExitToAppIcon />
          </StyledIconButton>
        </Toolbar>
      </GoldAppBar>

      {/* Modal pour changer le mot de passe */}
      <ChangePassword open={openChangePassword} handleClose={handleCloseChangePassword} /> {/* Remplacez onClose par handleClose */}

      {/* Ajout de marge pour éviter le chevauchement */}
      <div style={{ marginTop: '64px' }}></div> {/* Ajuste la valeur selon la hauteur de la Navbar */}
    </>
  );
};

export default Navbar;
