import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiLock } from 'react-icons/fi'; 
import { useNavigate } from 'react-router-dom';
import "../../../styles/front-office/Profil/profil.css";

const SeConnecter = () => {
  const [Email, definirEmail] = useState('');
  const [motDePasse, definirMotDePasse] = useState('');
const naviguer = useNavigate();
  const soumettreFormulaire = (e) => {
    e.preventDefault();
  if (Email === 'admin@gmail.com' && motDePasse === 'MotDePasseValide1') {
       console.log('Connexion réussie en tant qu\'Agriculteur/Admin.');
      naviguer('/admin'); 
      
    } else if (Email === 'client@agro.com' && motDePasse === 'MotDePasseValide1') {
        
             console.log('Connexion réussie en tant qu\'Acheteur.');
        naviguer('/'); 
        
    } else {
      alert('Erreur de connexion. Vérifiez vos identifiants.');
    } 
  };

  return (
          <div className="conteneur-formulaire">
          <form onSubmit={soumettreFormulaire}>
           <div className='titre'>
            <h1>Déjà client?</h1>
          
            <h2>Connectez-vous</h2>
          </div>
          <div className='groupe'>
            <div className="groupe-formulaire">
              <label htmlFor="connexion-Email">Adresse email*</label>
              <div className="champ-avec-icone">
                <FiMail className="icone-champ" />
                <input
                  type="email"
                  id="connexion-Email"
                  placeholder="votre@Email.com"
                  value={Email}
                  onChange={(e) => definirEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="groupe-formulaire">
              <label htmlFor="connexion-mot-de-passe">Mot de passe*</label>
              <p>Votre mot de passe doit contenir au moins 8 caractères dont 1 chiffre</p>
              <div className="champ-avec-icone">
                <FiLock className="icone-champ" />
                <input
                  type="password"
                  id="connexion-mot-de-passe"
                  placeholder="********"
                  value={motDePasse}
                  onChange={(e) => definirMotDePasse(e.target.value)}
                  required
                />
              </div>
            </div>
            </div>
            <button type="submit" className="bouton bouton-primaire fond-vert">
              S'IDENTIFIER
            </button>
            
            
          </form>
          
         
       
      </div>
 
  );
};

export default SeConnecter;