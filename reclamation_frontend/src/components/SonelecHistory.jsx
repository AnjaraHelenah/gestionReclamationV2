import React, { useEffect, useState } from 'react';
import { Card, Button, Form, FormControl, Container, Row, Col, Modal } from 'react-bootstrap';
import axios from 'axios';
import Navbar from './NavBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const SonelecHistory = () => {
  const [reclamations, setReclamations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApiDetails, setSelectedApiDetails] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [modalError, setModalError] = useState('');

  const fetchReclamations = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/reclamations');
      setReclamations(Array.isArray(response.data) ? response.data : []);
      setLoading(false);
    } catch (err) {
      setError('Erreur lors de la récupération des réclamations');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReclamations();
  }, );

  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/', { replace: true });
  };

  const updateReclamationStatus = async (id) => {
    try {
      await axios.patch(`http://localhost:8080/api/reclamations/${id}/status`, { status: true });
      setReclamations(reclamations.map((rec) => (rec.id === id ? { ...rec, status: true } : rec)));
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut', err);
    }
  };

  const deleteReclamation = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/reclamations/${id}`);
      setReclamations(reclamations.filter((rec) => rec.id !== id));
    } catch (err) {
      console.error('Erreur lors de la suppression de la réclamation', err);
    }
  };

 const handleStatusChange = async (id, meterID, transID) => {
  try {
    const response = await axios.post('http://localhost:8080/api/apis/check', { meterID, transID });

    if (response.data && response.data.exists) {
      setSelectedApiDetails({
        statusReason: response.data.statusReason,
        msisdn: response.data.msisdn,
        meterID: response.data.meterID,
        code: response.data.code,
        amount: response.data.amount,
        quantity: response.data.quantity,
      });
      setShowModal(true);
      setModalError('');
      setProcessingId(id);
      await updateReclamationStatus(id); // Mise à jour du statut après la vérification
    } else {
      setModalError('Les données ne correspondent pas. Vérifiez les données enregistrées.');
      setShowModal(true);
      await deleteReclamation(id); // Supprimer la réclamation si les données ne correspondent pas
    }
  } catch (err) {
    setModalError('Erreur lors de la vérification des informations.');
    setShowModal(true);
    console.error('Erreur lors de la vérification des informations ou de la mise à jour du statut', err);
  }
};


  const handleConsultation = async (id, meterID, transID) => {
    try {
      const response = await axios.post('http://localhost:8080/api/apis/check', { meterID, transID });

      if (response.data && response.data.exists) {
        setSelectedApiDetails({
          statusReason: response.data.statusReason,
          msisdn: response.data.msisdn,
          meterID: response.data.meterID,
          code: response.data.code,
          amount: response.data.amount,
          quantity: response.data.quantity,
        });
        setShowModal(true);
        setModalError('');
      } else {
        setModalError('Les données ne correspondent pas.');
        setShowModal(true);
      }
    } catch (err) {
      setModalError('Erreur lors de la vérification des informations.');
      setShowModal(true);
      console.error('Erreur lors de la consultation des informations', err);
    }
  };

  const filteredReclamations = reclamations.filter(
    (reclamation) => reclamation.msisdn.includes(searchTerm) || reclamation.transID.includes(searchTerm)
  );

  if (loading) {
    return <div>Chargement des réclamations...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <Navbar onLogout={onLogout} className="fixed-top" />
      <div style={{ marginTop: '120px' }}>
        <Form className="mb-4">
          <FormControl
            type="text"
            placeholder="Rechercher par numéro de téléphone ou référence de l'achat"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form>

        {filteredReclamations.length === 0 && (
          <div className="alert alert-warning" role="alert">
            Aucune réclamation trouvée.
          </div>
        )}

        <Container>
          <Row>
            {filteredReclamations.map((reclamation) => (
              <Col key={reclamation.id} md={4} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title style={{ fontFamily: 'cursive', fontSize: '16px' }}>
                      {reclamation.typeReclamation}
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {new Date(reclamation.dateReclamation).toLocaleDateString()}
                    </Card.Subtitle>
                    <Card.Text>
                      <strong>Nom :</strong> {reclamation.nameCustomer} <br />
                      <strong>Prénom :</strong> {reclamation.firstNameCustomer} <br />
                      <strong>Téléphone :</strong> {reclamation.msisdn} <br />
                      <strong>Numéro de compteur :</strong> {reclamation.meterID} <br />
                      <strong>Date d'achat :</strong> {new Date(reclamation.dateAchat).toLocaleDateString()} <br />
                      <strong>Référence :</strong> {reclamation.transID} <br />
                      <strong>Montant :</strong> {reclamation.amount} Fc <br />
                      <strong>Status :</strong>&nbsp;
                      <span style={{ color: reclamation.status ? 'green' : 'red' }}>
                        {reclamation.status ? 'Traité' : 'Non traité'}
                      </span> <br />
                    </Card.Text>
                    {reclamation.status ? (
                      // Afficher le bouton "Consulter" pour les réclamations traitées
                      <Button
                        variant="primary"
                        onClick={() => handleConsultation(reclamation.id, reclamation.meterID, reclamation.transID)}
                      >
                        Consulter
                      </Button>
                    ) : (
                      // Afficher le bouton "Initier" pour les réclamations non traitées
                      <Button
                        variant="success"
                        onClick={() => handleStatusChange(reclamation.id, reclamation.meterID, reclamation.transID)}
                      >
                        {processingId === reclamation.id ? 'Traitement en cours...' : 'Initier'}
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontFamily: 'cursive' }}>Résultat de la vérification</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalError ? (
            <p style={{ color: 'red' }}>{modalError}</p>
          ) : selectedApiDetails ? (
            <>
              <p><strong>Statut :</strong> {selectedApiDetails.statusReason}</p>
              <p><strong>Numéro téléphone :</strong> {selectedApiDetails.msisdn}</p>
              <p><strong>Numéro du compteur :</strong> {selectedApiDetails.meterID}</p>
              <p><strong>Code :</strong> {selectedApiDetails.code}</p>
              <p><strong>Montant :</strong> {selectedApiDetails.amount} Fc</p>
              <p><strong>Quantité :</strong> {selectedApiDetails.quantity} Kw</p>
            </>
          ) : (
            <p>Aucune information trouvée.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SonelecHistory;
