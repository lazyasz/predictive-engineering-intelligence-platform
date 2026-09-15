import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateIntegrationsConfig } from '../../services/api';
import { X, CheckCircle, Save, Key, Shield, Layers, Database, Sparkles } from 'lucide-react';

export default function SettingsDrawer() {
  const { settingsOpen, setSettingsOpen, integrations, refreshIntegrations, showNotification } = useAuth();
  const [saving, setSaving] = useState(false);

  const [googleClientId, setGoogleClientId] = useState('');
  const [jiraDomain, setJiraDomain] = useState('');
  const [jiraEmail, setJiraEmail] = useState('');
  const [jiraToken, setJiraToken] = useState('');
  const [jiraProjectKey, setJiraProjectKey] = useState('DEBT');
  const [notionApiKey, setNotionApiKey] = useState('');
  const [notionDbId, setNotionDbId] = useState('');

  useEffect(() => {
    if (integrations) {
      if (integrations.jira?.domain) setJiraDomain(integrations.jira.domain);
      if (integrations.jira?.project_key) setJiraProjectKey(integrations.jira.project_key);
      if (integrations.notion?.database_id) setNotionDbId(integrations.notion.database_id);
    }
  }, [integrations]);

  if (!settingsOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateIntegrationsConfig({
        google_client_id: googleClientId,
        jira_domain: jiraDomain,
        jira_email: jiraEmail,
        jira_api_token: jiraToken,
        jira_project_key: jiraProjectKey,
        notion_api_key: notionApiKey,
        notion_database_id: notionDbId
      });
      await refreshIntegrations();
      showNotification('Enterprise integration settings updated successfully!');
      setSettingsOpen(false);
    } catch (err) {
      showNotification('Failed to update settings: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col">
          
          {/* Drawer Header */}
          <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-xl">
                <Key className="h-5 w-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-base font-bold">Enterprise Integrations</h3>
                <p className="text-xs text-slate-400">Google OAuth, Jira Cloud & Notion Credentials</p>
              </div>
            </div>
            <button
              onClick={() => setSettingsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
            
            {/* Google OAuth Section */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center gap-1.5 text-slate-800">
                  <Shield className="h-4 w-4 text-emerald-600" /> Google OAuth 2.0
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  integrations?.google_auth?.configured
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {integrations?.google_auth?.configured ? 'Live Active' : 'Sandbox Demo Mode'}
                </span>
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Google Client ID (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. 123456789-abc.apps.googleusercontent.com"
                  value={googleClientId}
                  onChange={(e) => setGoogleClientId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Jira Cloud Section */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center gap-1.5 text-slate-800">
                  <Layers className="h-4 w-4 text-blue-600" /> Atlassian Jira Cloud
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  integrations?.jira?.configured
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {integrations?.jira?.configured ? 'Live Active' : 'Sandbox Demo Mode'}
                </span>
              </div>
              <div className="space-y-2">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Atlassian Domain</label>
                  <input
                    type="text"
                    placeholder="your-org.atlassian.net"
                    value={jiraDomain}
                    onChange={(e) => setJiraDomain(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Atlassian Email</label>
                    <input
                      type="email"
                      placeholder="engineer@org.com"
                      value={jiraEmail}
                      onChange={(e) => setJiraEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Project Key</label>
                    <input
                      type="text"
                      placeholder="DEBT"
                      value={jiraProjectKey}
                      onChange={(e) => setJiraProjectKey(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Jira API Token</label>
                  <input
                    type="password"
                    placeholder="••••••••••••••••••••••••"
                    value={jiraToken}
                    onChange={(e) => setJiraToken(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Notion Workspace Section */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center gap-1.5 text-slate-800">
                  <Database className="h-4 w-4 text-slate-800" /> Notion Workspace
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  integrations?.notion?.configured
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {integrations?.notion?.configured ? 'Live Active' : 'Sandbox Demo Mode'}
                </span>
              </div>
              <div className="space-y-2">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Notion Internal Integration Token</label>
                  <input
                    type="password"
                    placeholder="secret_••••••••••••••••"
                    value={notionApiKey}
                    onChange={(e) => setNotionApiKey(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Notion Database ID</label>
                  <input
                    type="text"
                    placeholder="e.g. 1a2b3c4d5e6f..."
                    value={notionDbId}
                    onChange={(e) => setNotionDbId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500"
                  />
                </div>
              </div>
            </div>

            {/* Submit Bar */}
            <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSettingsOpen(false)}
                className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2 bg-slate-900 hover:bg-black text-white font-semibold rounded-lg shadow transition cursor-pointer"
              >
                <Save className="h-4 w-4" />
                <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
