import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Connexion from './components/Connexion';
import Home from './components/Home';
import SignupForm from './components/SignupForm';
import UserList from './components/UserList';


import SonelecForm from './components/SonelecForm';
import HomeContent from './components/HomeContent';
import ProtectedRoute from './components/ProtectedRoute';

import SonelecHistory from './components/SonelecHistory';






const AppContent = () => {
  //const location = useLocation();
 
 


  return (
    <>
  
      <Routes>
        <Route path="/" element={<Connexion />} />
        <Route path="/" element={
            <ProtectedRoute>
              <HomeContent />
            </ProtectedRoute>
          } />
        {/*<Route path="/change-password" element={<ChangePassword />} />*/}
      
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/signup" element={<SignupForm/>} />
        <Route
          path="/userlist"
          element={
            <ProtectedRoute>
              <UserList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sonelec"
          element={
            <ProtectedRoute>
              <SonelecForm />
            </ProtectedRoute>
          }
        />
      
      <Route
          path="/sonelec-history"
          element={
            <ProtectedRoute>
              <SonelecHistory />
            </ProtectedRoute>
          }
        />
     
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <div className="App">
        <AppContent />
      </div>
    </Router>
  );
};

export default App;
