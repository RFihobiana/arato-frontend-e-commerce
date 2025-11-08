export const logout = () => {
  localStorage.removeItem('userToken');
  localStorage.removeItem('userData');
  window.location.href = '/profil';
};
