// src/components/SideBar.jsx
import React from "react";
import { FaTachometerAlt, FaBox, FaTags, FaNewspaper, FaMoneyBillWave, FaShoppingCart, FaUsers } from "react-icons/fa";
import "../../styles/back-office/SideBar.css";
import logo from "../../assets/icones/log.png"; 

const SideBar = () => {
  const menuItems = [
    { icon: <FaTachometerAlt />, label: "Tableau de bord" },
    { icon: <FaBox />, label: "Produits" },
    { icon: <FaTags />, label: "Promotion" },
    { icon: <FaNewspaper />, label: "Articles" },
    { icon: <FaMoneyBillWave />, label: "Paiement" },
    { icon: <FaShoppingCart />, label: "Commandes" },
    { icon: <FaUsers />, label: "Clients" },
  ];

  return (
    <div className="sidebar" style={{overflow:"hidden"}}>
      <div className="sidebar-logo">
        <img src={logo} alt="Logo Arato" />
       
      </div>
      <ul className="sidebar-menu">
        {menuItems.map((item, index) => (
          <li key={index} className="sidebar-item">
            {item.icon}
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideBar;
