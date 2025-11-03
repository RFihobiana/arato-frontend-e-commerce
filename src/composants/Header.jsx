import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/icones/log.png";
import panier from "../assets/icones/panier.png";
import profil from "../assets/icones/profil1.png";
import "../styles/front-office/global.css";
import "../styles/front-office/Profil/profil.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="main-header">
        <Link to="/">
          <img src={logo} alt="Logo" className="header-logo" />
        </Link>
        
        <div className="header-right">
          <div className="header-nav">
            <nav>
              <ul>
                <li>
                  <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                    Accueil
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/produit" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                    Produits
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/actualite" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                    Actualités
                  </NavLink>
                </li>
                <li>
                  <a
                    href="#footer"
                    onClick={(e) => {
                      e.preventDefault();
                      const footer = document.getElementById("footer");
                      footer?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="nav-link"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <NavLink to="/commandes" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                    Mes commandes
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>

          <div className="header-icons">
            <Link to="/panier" className="icon-link">
              <img src={panier} alt="Panier" />
            </Link>
            <Link to="/profil" className="icon-link">
              <img src={profil} alt="Profil" className="icone-profil" />
            </Link>
          </div>

          <div className="bouton-toggle" onClick={toggleMenu}>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
        </div>
      </header>

      <div 
        className={`menu-overlay ${menuOpen ? "active" : ""}`}
        onClick={closeMenu}
      ></div>

     
      <nav className={`header-nav-toggle ${menuOpen ? "active" : ""}`}>
        <button className="close-btn" onClick={closeMenu} aria-label="Fermer le menu">
          ×
        </button>

        <ul>
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
              onClick={closeMenu}
            >
              Accueil
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/produit" 
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
              onClick={closeMenu}
            >
              Produits
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/actualite" 
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
              onClick={closeMenu}
            >
              Actualités
            </NavLink>
          </li>
          <li>
            <a
              href="#footer"
              onClick={(e) => {
                e.preventDefault();
                closeMenu();
                const footer = document.getElementById("footer");
                footer?.scrollIntoView({ behavior: "smooth" });
              }}
              className="nav-link"
            >
              Contact
            </a>
          </li>
          <li>
            <NavLink 
              to="/commandes" 
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
              onClick={closeMenu}
            >
              Mes commandes
            </NavLink>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Header;