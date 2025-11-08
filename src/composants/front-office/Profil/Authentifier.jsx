import React, { useState } from 'react';
import { FiUser, FiMail, FiPhone, FiLock } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../../services/AuthService';
import "../../../styles/front-office/Profil/profil.css";

const Authentifier = () => {
  const [nomUtilisateur, setNomUtilisateur] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [confirmerMotDePasse, setConfirmerMotDePasse] = useState('');
  const [erreur, setErreur] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');

    if (motDePasse !== confirmerMotDePasse) {
      setErreur('Les mots de passe ne correspondent pas !');
      return;
    }

    try {
      const userData = {
        nomUtilisateur,
        email,
        contact,
        motDePasse,
        confirmerMotDePasse
      };

      const response = await registerUser(userData);

      localStorage.setItem('userToken', response.access_token);
      localStorage.setItem('userData', JSON.stringify(response.user));

      navigate('/client/dashboard');
    } catch (err) {
      if (err.response?.data?.message) setErreur(err.response.data.message);
      else setErreur('Erreur lors de l\'inscription.');
      console.error(err);
    }
  };

  return (
    <div className="conteneur-formulaire">
      <form onSubmit={handleSubmit}>
        <div className='titre'>
          <h1>Vous n'avez pas de compte ?</h1>
          <h2>Pour commander, nous avons besoin de vos informations de livraison</h2>
        </div>

        <div className='groupe'>
          <div className="groupe-formulaire">
            <label>Nom *</label>
            <div className="champ-avec-icone">
              <FiUser className="icone-champ" />
              <input 
                type="text" 
                placeholder="Joanella" 
                value={nomUtilisateur} 
                onChange={(e) => setNomUtilisateur(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div className="groupe-formulaire">
            <label>Email *</label>
            <div className="champ-avec-icone">
              <FiMail className="icone-champ" />
              <input 
                type="email" 
                placeholder="votre@courriel.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div className="groupe-formulaire">
            <label>Téléphone *</label>
            <div className="champ-avec-icone">
              <FiPhone className="icone-champ" />
              <input 
                type="tel" 
                placeholder="+261 34 00 000 00" 
                value={contact} 
                onChange={(e) => setContact(e.target.value)} 
                required 
                maxLength={15} 
              />
            </div>
          </div>

          <div className="groupe-formulaire">
            <label>Mot de passe *</label>
            <p>Votre mot de passe doit contenir au moins 6 caractères.</p>
            <div className="champ-avec-icone">
              <FiLock className="icone-champ" />
              <input 
                type="password" 
                value={motDePasse} 
                onChange={(e) => setMotDePasse(e.target.value)} 
                required 
                minLength={6} 
              />
            </div>
          </div>

          <div className="groupe-formulaire">
            <label>Confirmer le mot de passe *</label>
            <div className="champ-avec-icone">
              <FiLock className="icone-champ" />
              <input 
                type="password" 
                value={confirmerMotDePasse} 
                onChange={(e) => setConfirmerMotDePasse(e.target.value)} 
                required 
              />
            </div>
          </div>

          {erreur && <p style={{ color: 'red', marginTop: '10px' }}>{erreur}</p>}
        </div>

        <button type="submit" className="bouton bouton-primaire fond-vert">CRÉER MON COMPTE</button>
      </form>
    </div>
  );
};

export default Authentifier;
