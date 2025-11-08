import api from './api';

export const registerUser = async (userData) => {
  const res = await api.post('/register', {
    nom_utilisateur: userData.nomUtilisateur,
    email: userData.email,
    contact: userData.contact,
    mot_de_passe: userData.motDePasse,
    mot_de_passe_confirmation: userData.motDePasse_confirmation
  });
  return res.data;
};

export const loginUser = async (loginData) => {
  const res = await api.post('/login', {
    email: loginData.email,
    mot_de_passe: loginData.motDePasse
  });
  return res.data;
};

export const changeAdminPassword = async (payload) => {
  const token = localStorage.getItem('userToken');
  const res = await api.post('/admin/change-password', payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
