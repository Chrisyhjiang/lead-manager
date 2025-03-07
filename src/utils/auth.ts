let isAuthenticated = false;

const hardcodedCredentials = {
  username: "admin",
  password: "pwd123",
};

export const login = (username: string, password: string): boolean => {
  if (
    username === hardcodedCredentials.username &&
    password === hardcodedCredentials.password
  ) {
    isAuthenticated = true;
    return true;
  }
  return false;
};

export const logout = () => {
  isAuthenticated = false;
};

export const isAuthenticatedUser = () => {
  return isAuthenticated;
};
