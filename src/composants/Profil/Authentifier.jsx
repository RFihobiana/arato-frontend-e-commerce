import React, { useState } from 'react';
import { FiUser, FiMail, FiPhone, FiLock } from 'react-icons/fi'; 
import { Link } from 'react-router-dom';
import "../../styles/front-office/Profil/profil.css";

const Authentifier = () => {
  const [nom, definirNom] = useState('');
  const [courriel, definirCourriel] = useState('');
  const [telephone, definirTelephone] = useState('');
   const [typeCompte, definirTypeCompte] = useState('Acheteur');
  const [motDePasse, definirMotDePasse] = useState('');
  const [confirmerMotDePasse, definirConfirmerMotDePasse] = useState('');

  const soumettreFormulaire = (e) => {
    e.preventDefault();
    if (motDePasse !== confirmerMotDePasse) {
      alert('Les mots de passe ne correspondent pas !');
      return;
    }
    console.log('Inscription avec:', { 
      nom, courriel, telephone, typeCompte, motDePasse 
    });
  };

  return (
    <div className="conteneur-formulaire">
      <form  onSubmit={soumettreFormulaire}>
        <div className='titre'>
        <h1>Vous n'avez pas de compte ?</h1>
      <h2>Pour commander nous vous demanderons les informations nécessaires à la livraison</h2>
        </div>
        
        <div className='groupe'>
        <div className="groupe-formulaire">
          <label htmlFor="inscription-nom">Nom *</label>
          <div className="champ-avec-icone">
            <FiUser className="icone-champ" />
            <input className='champ'
              type="text"
              id="inscription-nom"
              placeholder="Joanella"
              value={nom}
              onChange={(e) => definirNom(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="groupe-formulaire">
          <label htmlFor="inscription-courriel">Adresse email *</label>
          <div className="champ-avec-icone">
            <FiMail className="icone-champ" />
            <input className='champ'
              type="email"
              id="inscription-courriel"
              placeholder="votre@courriel.com"
              value={courriel}
              onChange={(e) => definirCourriel(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="groupe-formulaire">
          <label htmlFor="inscription-telephone">Téléphone *</label>
          <div className="champ-avec-icone">
            <FiPhone className="icone-champ" />
            <input className='champ'
              type="tel"
              id="inscription-telephone"
              placeholder="+261 34 00 000 00"
              value={telephone}

              onChange={(e) => definirTelephone(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="groupe-formulaire">
          <label htmlFor="type-compte">Type de compte</label>
          <div className="champ-avec-icone">
          <select className='champ'
            id="type-compte"
            value={typeCompte}
            onChange={(e) => definirTypeCompte(e.target.value)}
            required
          >
            <option value="Acheteur">Acheteur</option>
            <option value="Agriculteur">Agriculteur</option>
          </select>
          </div>
        </div>

        <div className="groupe-formulaire">
          <label htmlFor="inscription-mot-de-passe">Mot de passe</label>
           <p>Votre mot de passe doit contenir au moins 8 caractères dont 1 chiffre</p>

          <div className="champ-avec-icone">
            <FiLock className="icone-champ" />
            <input className='champ'
              type="password"
              id="inscription-mot-de-passe"
              value={motDePasse}
              onChange={(e) => definirMotDePasse(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="groupe-formulaire">
          <label htmlFor="confirmer-mot-de-passe">Confirmer le mot de passe</label>
          <div className="champ-avec-icone">
            <FiLock className="icone-champ" />
            <input className='champ'
              type="password"
              id="confirmer-mot-de-passe"
              value={confirmerMotDePasse}
              onChange={(e) => definirConfirmerMotDePasse(e.target.value)}
              required
            />
          </div>
        </div>
 </div>
        <button type="submit" className="bouton bouton-primaire fond-vert">
         CRÉER MON COMPTE
        </button>
       
          
      </form>
     
    </div>
  );
};

export default Authentifier;