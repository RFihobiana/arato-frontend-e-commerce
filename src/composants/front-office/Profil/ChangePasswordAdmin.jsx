import React, { useState } from 'react';
import { changeAdminPassword } from '../../../services/AuthService';
import "../../../styles/back-office/admin.css";

const ChangePasswordAdmin = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (newPassword !== confirmPassword) {
      setMessage('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      const res = await changeAdminPassword({
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword
      });

      setMessage(res.message);

      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
      window.location.href = '/profil';
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur lors du changement de mot de passe');
      console.error(err);
    }
  };

  return (
    <div className="conteneur-formulaire">
      <form onSubmit={handleSubmit}>
        <h2>Changer le mot de passe Admin</h2>
        <div className="groupe-formulaire">
          <label>Mot de passe actuel</label>
          <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
        </div>
        <div className="groupe-formulaire">
          <label>Nouveau mot de passe</label>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
        </div>
        <div className="groupe-formulaire">
          <label>Confirmer le nouveau mot de passe</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>
        <button type="submit" className="bouton bouton-primaire fond-vert">Changer le mot de passe</button>
        {message && <p style={{color:'red', marginTop:'10px'}}>{message}</p>}
      </form>
    </div>
  );
};

export default ChangePasswordAdmin;