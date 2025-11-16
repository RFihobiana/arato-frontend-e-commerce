import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  FaTachometerAlt, 
  FaBox, 
  FaNewspaper, 
  FaShoppingBag, 
  FaCreditCard, 
  FaTag, 
  FaUsers,
  FaUserCircle,  
  FaLock,         
  FaSignOutAlt,   
  FaHome,
  FaTruck

} from 'react-icons/fa';
import profile from '../../assets/icones/log.png';
import "../../styles/back-office/SideBar.css";

const SideBar = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const menuItems = [
    { label: "Tableau de bord", path: "/admin", icon: FaTachometerAlt },
    { label: "Produits", path: "/admin/produits", icon: FaBox },
    { label: "Articles", path: "/admin/articles", icon: FaNewspaper },
    { label: "Commandes", path: "/admin/commandes", icon: FaShoppingBag },
    { label: "Paiements", path: "/admin/paiement", icon: FaCreditCard },
    { label: "Promotions", path: "/admin/promotion", icon: FaTag },
    { label: "Clients", path: "/admin/clients", icon: FaUsers },
    { label: "Livraisons", path: "/admin/livraisons", icon: FaTruck },
  ];

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    window.location.href = '/profil';
  };

  return (
    <div className="sidebar">
      <h2 className="sidebar-title"> 
        <img src={profile} alt="admin-profile" style={{width: '38%'}} />
         {JSON.parse(localStorage.getItem('userData')).nomUtilisateur} 
      </h2>
      
      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          const IconComponent = item.icon; 
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                isActive ? "sidebar-item active" : "sidebar-item"
              }
            >
              {IconComponent && <IconComponent className="sidebar-icon" />}
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <a href="/" className="sidebar-item sidebar-front-office">
          <FaHome className="sidebar-icon" />
          Front-Office
        </a>

        <div className="sidebar-profile-menu-container">
          <div 
            className={`sidebar-item sidebar-profile-toggle ${isProfileMenuOpen ? 'active' : ''}`}
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          >
            <FaUserCircle className="sidebar-icon" />
            Profil
          </div>
          
          {isProfileMenuOpen && (
            <div className="sidebar-dropdown">
              <NavLink
                to="/admin/change-password"
                className="sidebar-dropdown-item"
                onClick={() => setIsProfileMenuOpen(false)}
              >
                <FaLock className="sidebar-icon-small" />
                Changer mot de passe
              </NavLink>

              <button
                onClick={handleLogout}
                className="sidebar-dropdown-item sidebar-logout-btn"
              >
                <FaSignOutAlt className="sidebar-icon-small" />
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SideBar;