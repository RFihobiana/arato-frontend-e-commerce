import React from "react";
import { NavLink } from "react-router-dom";
// Importez les icônes nécessaires
import { FaTachometerAlt, FaBox, FaNewspaper, FaShoppingBag, FaCreditCard, FaTag, FaUsers } from 'react-icons/fa'; // <<-- FaUsers ajouté
import "../../styles/back-office/SideBar.css";

const SideBar = () => {
  const menuItems = [
    { label: "Tableau de bord", path: "/admin", icon: FaTachometerAlt },
    { label: "Produits", path: "/admin/produits", icon: FaBox },
    { label: "Articles", path: "/admin/articles", icon: FaNewspaper },
    { label: "Commandes", path: "/admin/commandes", icon: FaShoppingBag },
    { label: "Paiements", path: "/admin/paiement", icon: FaCreditCard },
    { label: "Promotions", path: "/admin/promotion", icon: FaTag },
    { label: "Clients", path: "/admin/clients", icon: FaUsers }, // <<-- Nouvelle entrée Client
  ];

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Admin</h2>
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
    </div>
  );
};

export default SideBar;