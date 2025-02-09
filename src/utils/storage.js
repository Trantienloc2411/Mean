export const saveToken = (token) => {
  localStorage.setItem("token", token);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const removeToken = () => {
  localStorage.removeItem("token");
};
export const saveUserId = (userId) => {
  localStorage.setItem("userId", userId);
};

export const getUserId = () => {
  return localStorage.getItem("userId");
};

export const removeUserId = () => {
  localStorage.removeItem("userId");
};
export const saveRole = (roleName) => {
  localStorage.setItem("role", roleName);
};

export const getRole = () => {
  return localStorage.getItem("role");
};

export const removeRole = () => {
  localStorage.removeItem("role");
};
