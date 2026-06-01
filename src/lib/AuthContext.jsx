import React, { createContext, useState, useContext, useEffect } from 'react';

const DISCORD_CLIENT_ID = '1511122411733389423';
const REDIRECT_URI = `${window.location.origin}${import.meta.env.BASE_URL}callback`;
const DISCORD_AUTH_URL = `https://discord.com/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=identify`;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('discord_token');
    if (!token) {
      setIsLoadingAuth(false);
      return;
    }

    try {
      const res = await fetch('https://discord.com/api/v10/users/@me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        // Token expired or invalid
        localStorage.removeItem('discord_token');
        setIsLoadingAuth(false);
        return;
      }

      const data = await res.json();
      setUser({
        id: data.id,
        username: data.username,
        global_name: data.global_name,
        avatar: data.avatar
          ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`
          : `https://cdn.discordapp.com/embed/avatars/${Number(data.discriminator || 0) % 5}.png`,
        email: data.email,
      });
      setIsAuthenticated(true);
    } catch {
      localStorage.removeItem('discord_token');
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const loginWithDiscord = () => {
    window.location.href = DISCORD_AUTH_URL;
  };

  const logout = () => {
    localStorage.removeItem('discord_token');
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = import.meta.env.BASE_URL;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoadingAuth,
        loginWithDiscord,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
