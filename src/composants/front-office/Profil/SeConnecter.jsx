import React, { useState } from 'react';
import { FiMail, FiLock } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../../services/AuthService';
import "../../../styles/front-office/Profil/profil.css";

const SeConnecter = () => {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');

    try {
     const response = await loginUser({ email, motDePasse: motDePasse }); 

      localStorage.setItem('userToken', response.access_token);
        localStorage.setItem('userData', JSON.stringify(response.user));

      navigate(response.user?.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      if (err.response?.status === 401) {
        setErreur('Email ou mot de passe incorrect.');
      } else if (err.response?.data?.message) {
        setErreur(err.response.data.message);
      } else {
        setErreur('Erreur de connexion.');
      }
      console.error(err);
    }
  };

  return (
    <div className="conteneur-formulaire">
      <form onSubmit={handleSubmit}>
        <div className='titre'>
          <h1>Déjà client ?</h1>
          <h2>Connectez-vous</h2>
        </div>

        <div className='groupe'>
          <div className="groupe-formulaire">
            <label>Email*</label>
            <div className="champ-avec-icone">
              <FiMail className="icone-champ" />
              <input 
                type="email" 
                placeholder="votre@Email.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div className="groupe-formulaire">
            <label>Mot de passe*</label>
            <p>Votre mot de passe doit contenir au moins 6 caractères.</p>
            <div className="champ-avec-icone">
              <FiLock className="icone-champ" />
              <input 
                type="password" 
                placeholder="********" 
                value={motDePasse} 
                onChange={(e) => setMotDePasse(e.target.value)} 
                required 
                minLength={6} 
              />
            </div>
          </div>

          {erreur && <p style={{ color: 'red', marginBottom: '15px' }}>{erreur}</p>}

          <button type="submit" className="bouton bouton-primaire fond-vert">S'IDENTIFIER</button>
        </div>
      </form>
    </div>
  );
};

export default SeConnecter;
