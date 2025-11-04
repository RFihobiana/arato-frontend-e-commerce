import React from "react";
import { FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Header from "../../composants/Header";
import Footer from "../../composants/FooterSection";
import SeConnecter from "../../composants/front-office/Profil/SeConnecter";
import Authentifier from "../../composants/front-office/Profil/Authentifier";

import "../../styles/front-office/Profil/profil.css";

const Profil = () => {
  return (
    <div>
      <Header />

      <div className="connexion-container">
        <h2 className="titre-connexion">Connectez-vous en 1 clic</h2>
        <div className="boutons-connexion">
          <button className="btn-facebook">
            <FaFacebookF className="icon" /> Connexion avec Facebook
          </button>
          <button className="btn-google">
            <FcGoogle className="icon" /> Connexion avec Google
          </button>
        </div>
      </div>

      <div className="profil-container">
        <div className="profil-box">
          <Authentifier />
        </div>

        <div className="profil-box">
          <SeConnecter />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profil;
