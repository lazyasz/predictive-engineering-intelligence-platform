import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuthMe, getDemoProfiles, loginWithGoogle, switchDemoProfile, logoutAuth, getIntegrationsStatus } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState({
    id: 'usr_lead_01',
    name: 'Dhruv Patel',
    email: 'dhruv.lead@engineering.org',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    role: 'Lead Architect',
    role_code: 'lead_architect',
    permissions: ['prioritize', 'export_jira', 'sync_notion', 'override_weights', 'manage_integrations'],
    team: 'Core Platform & Architecture'
  });

  const [profiles, setProfiles] = useState({});
  const [integrations, setIntegrations] = useState({
    google_auth: { configured: false, mode: 'sandbox_mock' },
    jira: { configured: false, mode: 'sandbox_mock', project_key: 'DEBT', domain: 'engineering-hub.atlassian.net' },
    notion: { configured: false, mode: 'sandbox_mock', database_id: 'notion_db_pei_backlog_2026' }
  });
  const [loading, setLoading] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const refreshUser = async () => {
    try {
      const res = await getAuthMe();
      if (res?.user) setUser(res.user);
    } catch (e) {
      console.warn('Failed to load user state');
    }
  };

  const refreshIntegrations = async () => {
    try {
      const data = await getIntegrationsStatus();
      if (data) setIntegrations(data);
    } catch (e) {
      console.warn('Failed to load integration status');
    }
  };

  useEffect(() => {
    refreshUser();
    refreshIntegrations();
    getDemoProfiles().then(res => {
      if (res?.profiles) setProfiles(res.profiles);
    });
  }, []);

  const handleGoogleLogin = async (credential) => {
    setLoading(true);
    try {
      const res = await loginWithGoogle(credential);
      if (res?.user) {
        setUser(res.user);
        showNotification(`Welcome, ${res.user.name}! Authenticated via Google.`);
        setAuthModalOpen(false);
      }
    } catch (err) {
      showNotification('Google sign-in failed. Switched to sandbox demo session.', 'warning');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchPersona = async (profileKey) => {
    setLoading(true);
    try {
      const res = await switchDemoProfile(profileKey);
      if (res?.user) {
        setUser(res.user);
        showNotification(`Switched persona to ${res.user.name} (${res.user.role})`);
        setAuthModalOpen(false);
      }
    } catch (err) {
      showNotification('Could not switch persona', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutAuth();
    await refreshUser();
    showNotification('Logged out to default Lead Architect persona.');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profiles,
        integrations,
        loading,
        authModalOpen,
        settingsOpen,
        notification,
        setAuthModalOpen,
        setSettingsOpen,
        showNotification,
        handleGoogleLogin,
        handleSwitchPersona,
        handleLogout,
        refreshIntegrations
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
