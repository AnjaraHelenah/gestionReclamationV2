import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UserList.css';
import Navbar from './NavBar';
import UpdateUser from './UpdateUser';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);
  const [buttonEnregister, setButtonEnregister] = useState(true);
  const [isBlurred, setIsBlurred] = useState(false);
  
  const navigate = useNavigate();
 

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/users/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs', error);
      setError('Erreur lors de la récupération des utilisateurs');
    }
  };
  useEffect(() => {
    fetchUsers();
  }, );

  const onLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/', { replace: true });
  };

  const handleDeleteUser = async (userId, userName, firstName) => {
    try {
      await axios.delete(`http://localhost:8080/api/users/users/${userId}`);
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      setIsBlurred(true);
      toast.success(`L'utilisateur ${userName} ${firstName} a été supprimé avec succès !`, {
        onClose: () => setIsBlurred(false),
      });
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur", error);
      toast.error("Erreur lors de la suppression de l'utilisateur");
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setButtonVisible(true);
    setButtonEnregister(false);
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Optionnel : Permet de défiler en douceur
    });
    
  };

  const handleVisible = (user) => {
    setButtonVisible(false);
    setButtonEnregister(true);
  };

  const updateUserToAgent = async (userId) => {
    try {
      const updatedUser = {
        enabled: true,
        role: "Agent"
      };
      await axios.put(`http://localhost:8080/api/users/users/${userId}`, updatedUser);
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, enabled: true, role: "Agent" } : user
        )
      );
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur', error);
    }
  };

  const updateUserToAdmin = async (userId) => {
    try {
      const updatedUser = {
        enabled: true,
        role: "Administrateur"
      };
      await axios.put(`http://localhost:8080/api/users/users/${userId}`, updatedUser);
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, enabled: true, role: "Administrateur" } : user
        )
      );
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur', error);
    }
  };

  const closeModal = () => {
    setOpenModal(false);
    setSelectedUser(null);
  };

  const filteredUsers = users.filter(user =>
    (user.userName ? user.userName.toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
    (user.firstName ? user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
    (user.email ? user.email.toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
    (user.phoneNumber ? user.phoneNumber.includes(searchTerm) : false)
  );

  return (
    <div>
      {/* Fixe la Navbar en haut avec la classe fixed-top */}
      <Navbar onLogout={onLogout} className="fixed-top" />
      
      {/* Décaler le contenu pour éviter de se superposer avec la navbar */}
      <div className="container mt-4" id='id'>
        <UpdateUser user={selectedUser} onClose={closeModal} onUserUpdated={fetchUsers} edit={buttonVisible} enregistrer={buttonEnregister} constantFalse={handleVisible}/>

        <input
          type="text"
          placeholder="Rechercher..."
          className="form-control my-3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="row">
          {filteredUsers.map(user => (
            <div key={user.id} className="col-md-3 mb-3">
              <div className={`card shadow ${isBlurred ? 'blurred' : ''}`} style={{ backgroundColor: '#f9f9f9' }}>
                <div className="card-body">
                  <h5 className="card-title text-dark">{user.userName} <br /> {user.firstName}</h5>
                  <p className="card-text"><strong>Email:</strong> {user.email} </p>
                  <p className="card-text"><strong>Téléphone:</strong> {user.phoneNumber}</p>
                  <p className="card-text"><strong>Département:</strong> {user.department}</p>
                  <p className="card-text"><strong>Fonction:</strong> {user.function}</p>
                  <p className="card-text"><strong>Rôle:</strong> <span className="badge bg-warning text-dark" >{user.role}</span></p>
                  <p className="card-text"><strong>Vérification:</strong> {user.enabled ? <span className="badge bg-success">Validé</span> : <span className="badge bg-danger">Non validé</span>}</p>

                  <div className="d-flex justify-content-between">
                    <button 
                      className="btn btn-outline-success" 
                      style={{ padding: '5px 10px', fontSize: '14px', fontFamily: 'cursive'}}
                      onClick={() => updateUserToAgent(user.id)}
                    >
                      Agent
                    </button>
                    <button 
                      className="btn btn-outline-warning" 
                      style={{ padding: '5px 10px', fontSize: '14px',fontFamily: 'cursive' }} 
                      onClick={() => updateUserToAdmin(user.id)}
                    >
                      Admin
                    </button>
                  </div>
                  
                  <div className="mt-3 d-flex justify-content-between">
                        
                        <a href='#' onClick={() => handleEditUser(user)}  > <EditIcon style={{ fontSize: '16px' }} /> </a>
                        <button
                          onClick={() => handleDeleteUser(user.id, user.userName, user.firstName)} 
                          className="btn btn-danger" 
                          style={{ padding: '5px 10px', fontSize: '12px',fontFamily: 'cursive'}}  // Taille réduite
                        >
                          <DeleteIcon style={{ fontSize: '16px' }} />   {/* Réduction de l'icône */}
                        </button>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UserList;
