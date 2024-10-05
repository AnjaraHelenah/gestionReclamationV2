import React, {useState } from 'react';

import 'react-toastify/dist/ReactToastify.css';
import telmaLogo from './image/images.png'; // Remplacez par le bon chemin vers l'image
import SignupForm from './SignupForm';
import LoginForm from './LoginForm';


const Connexion = () => {
  const [isLogin, setIsLogin] = useState(true);
  

  const handleSwitch = () => {
    setIsLogin(!isLogin);
  };

 

  return (
    <div className="main-container">
      <div className="logo-container">
        <img src={telmaLogo} alt="Telma Logo" className="animated-logo" />
      </div>
      <div className="form-section">
        {isLogin ? (
          <LoginForm onSwitch={handleSwitch} />
        ) : (
          <SignupForm onSwitch={handleSwitch}  />
        )}
      </div>
    </div>
  );
};

export default Connexion;
