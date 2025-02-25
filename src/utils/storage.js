export const saveToken = (token) => {
  localStorage.setItem("access_token", token);
};

export const saveUserId = (userId) => {
  localStorage.setItem("user_id", userId);
};

export const saveRole = (role) => {
  localStorage.setItem("user_role", JSON.stringify(role));
};

export const getToken = () => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      return null;
    }
    return token;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};
export const getUserId = () => localStorage.getItem("user_id");
export const getRole = () => {
  const role = localStorage.getItem("user_role");
  return role ? JSON.parse(role) : null;
};

export const removeToken = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user_id");
  localStorage.removeItem("user_role");
};
