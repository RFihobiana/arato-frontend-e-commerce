import React from "react";
import { Link } from "react-router-dom";
import "../../styles/front-office/Profil/profil.css";

const SousMenu = ({ estConnecte, surDeconnexion }) => {
  return (
    <div className="sous-menu-profil">
      <ul>
        {estConnecte ? (
          <>
            <li>
              <Link to="/profil">Mon Profil</Link>
            </li>
            <li>
              <button onClick={surDeconnexion} className="lien-deconnexion">
                Déconnexion
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/connexion">Se connecter</Link> 
            </li>
            <li>
              <Link to="/inscription">S'inscrire</Link> 
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default SousMenu;