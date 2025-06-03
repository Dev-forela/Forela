import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Download, 
  Trash2, 
  Moon, 
  Sun,
  Smartphone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ChevronRight,
  Info,
  HelpCircle,
  LogOut,
  Palette,
  Volume2,
  VolumeX
} from 'lucide-react';

interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  type: 'toggle' | 'navigate' | 'action';
  value?: boolean;
  onToggle?: (value: boolean) => void;
  onClick?: () => void;
  color?: string;
}

interface SettingSection {
  title: string;
  items: SettingItem[];
}

const Settings: React.FC = () => {
  const [notifications, setNotifications] = useState({
    journalReminders: true,
    companionMessages: true,
    healthTrends: false,
    weeklyReports: true,
    emailUpdates: false
  });

  const [privacy, setPrivacy] = useState({
    dataSharing: false,
    analytics: true,
    locationData: false
  });

  const [preferences, setPreferences] = useState({
    darkMode: false,
    soundEnabled: true,
    autoBackup: true
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleNotificationToggle = (key: keyof typeof notifications) => (value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handlePrivacyToggle = (key: keyof typeof privacy) => (value: boolean) => {
    setPrivacy(prev => ({ ...prev, [key]: value }));
  };

  const handlePreferenceToggle = (key: keyof typeof preferences) => (value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const settingSections: SettingSection[] = [
    {
      title: "Account",
      items: [
        {
          id: 'profile',
          title: 'Edit Profile',
          subtitle: 'Update your personal information',
          icon: <User size={20} />,
          type: 'navigate',
          onClick: () => console.log('Navigate to profile'),
          color: '#1E6E8B'
        },
        {
          id: 'password',
          title: 'Change Password',
          subtitle: 'Update your account password',
          icon: <Lock size={20} />,
          type: 'navigate',
          onClick: () => console.log('Navigate to password change'),
          color: '#A36456'
        }
      ]
    },
    {
      title: "Notifications",
      items: [
        {
          id: 'journal-reminders',
          title: 'Journal Reminders',
          subtitle: 'Daily prompts to record your feelings',
          icon: <Bell size={20} />,
          type: 'toggle',
          value: notifications.journalReminders,
          onToggle: handleNotificationToggle('journalReminders'),
          color: '#E2B6A1'
        },
        {
          id: 'companion-messages',
          title: 'Companion Messages',
          subtitle: 'Notifications from your AI companion',
          icon: <Smartphone size={20} />,
          type: 'toggle',
          value: notifications.companionMessages,
          onToggle: handleNotificationToggle('companionMessages'),
          color: '#4CB944'
        },
        {
          id: 'health-trends',
          title: 'Health Trend Alerts',
          subtitle: 'Important changes in your patterns',
          icon: <Info size={20} />,
          type: 'toggle',
          value: notifications.healthTrends,
          onToggle: handleNotificationToggle('healthTrends'),
          color: '#D99C8F'
        },
        {
          id: 'weekly-reports',
          title: 'Weekly Reports',
          subtitle: 'Summary of your health journey',
          icon: <Mail size={20} />,
          type: 'toggle',
          value: notifications.weeklyReports,
          onToggle: handleNotificationToggle('weeklyReports'),
          color: '#1E6E8B'
        },
        {
          id: 'email-updates',
          title: 'Email Updates',
          subtitle: 'Receive updates via email',
          icon: <Mail size={20} />,
          type: 'toggle',
          value: notifications.emailUpdates,
          onToggle: handleNotificationToggle('emailUpdates'),
          color: '#6F5E53'
        }
      ]
    },
    {
      title: "Privacy & Security",
      items: [
        {
          id: 'data-sharing',
          title: 'Data Sharing',
          subtitle: 'Share anonymized data for research',
          icon: <Shield size={20} />,
          type: 'toggle',
          value: privacy.dataSharing,
          onToggle: handlePrivacyToggle('dataSharing'),
          color: '#A36456'
        },
        {
          id: 'analytics',
          title: 'Usage Analytics',
          subtitle: 'Help improve the app with usage data',
          icon: <Eye size={20} />,
          type: 'toggle',
          value: privacy.analytics,
          onToggle: handlePrivacyToggle('analytics'),
          color: '#1E6E8B'
        },
        {
          id: 'location-data',
          title: 'Location Data',
          subtitle: 'Use location for movement tracking',
          icon: <Shield size={20} />,
          type: 'toggle',
          value: privacy.locationData,
          onToggle: handlePrivacyToggle('locationData'),
          color: '#E2B6A1'
        }
      ]
    },
    {
      title: "App Preferences",
      items: [
        {
          id: 'dark-mode',
          title: 'Dark Mode',
          subtitle: 'Switch to dark theme',
          icon: preferences.darkMode ? <Moon size={20} /> : <Sun size={20} />,
          type: 'toggle',
          value: preferences.darkMode,
          onToggle: handlePreferenceToggle('darkMode'),
          color: '#311D00'
        },
        {
          id: 'sound',
          title: 'Sound Effects',
          subtitle: 'Enable app sounds and notifications',
          icon: preferences.soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />,
          type: 'toggle',
          value: preferences.soundEnabled,
          onToggle: handlePreferenceToggle('soundEnabled'),
          color: '#4CB944'
        },
        {
          id: 'auto-backup',
          title: 'Auto Backup',
          subtitle: 'Automatically backup your data',
          icon: <Download size={20} />,
          type: 'toggle',
          value: preferences.autoBackup,
          onToggle: handlePreferenceToggle('autoBackup'),
          color: '#1E6E8B'
        }
      ]
    },
    {
      title: "Data & Storage",
      items: [
        {
          id: 'export-data',
          title: 'Export My Data',
          subtitle: 'Download all your health data',
          icon: <Download size={20} />,
          type: 'action',
          onClick: () => console.log('Export data'),
          color: '#A36456'
        },
        {
          id: 'delete-account',
          title: 'Delete Account',
          subtitle: 'Permanently delete your account and data',
          icon: <Trash2 size={20} />,
          type: 'action',
          onClick: () => setShowDeleteConfirm(true),
          color: '#ef4444'
        }
      ]
    },
    {
      title: "Support",
      items: [
        {
          id: 'help',
          title: 'Help & FAQ',
          subtitle: 'Get answers to common questions',
          icon: <HelpCircle size={20} />,
          type: 'navigate',
          onClick: () => console.log('Navigate to help'),
          color: '#6F5E53'
        },
        {
          id: 'about',
          title: 'About Forela',
          subtitle: 'App version and information',
          icon: <Info size={20} />,
          type: 'navigate',
          onClick: () => console.log('Navigate to about'),
          color: '#A36456'
        },
        {
          id: 'logout',
          title: 'Log Out',
          subtitle: 'Sign out of your account',
          icon: <LogOut size={20} />,
          type: 'action',
          onClick: () => console.log('Log out'),
          color: '#D99C8F'
        }
      ]
    }
  ];

  const ToggleSwitch = ({ enabled, onToggle, color }: { enabled: boolean; onToggle: (value: boolean) => void; color: string }) => (
    <button
      onClick={() => onToggle(!enabled)}
      style={{
        position: 'relative',
        width: 48,
        height: 28,
        borderRadius: 14,
        border: 'none',
        background: enabled ? color : '#D9CFC2',
        cursor: 'pointer',
        transition: 'background-color 0.2s'
      }}
      aria-label={enabled ? 'Disable' : 'Enable'}
    >
      <div style={{
        position: 'absolute',
        top: 2,
        left: enabled ? 22 : 2,
        width: 24,
        height: 24,
        borderRadius: '50%',
        background: '#fff',
        transition: 'left 0.2s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
      }} />
    </button>
  );

  const SettingItemComponent = ({ item }: { item: SettingItem }) => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 0',
      borderBottom: '1px solid #F5F1ED'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
        <div style={{ color: item.color || '#6F5E53' }}>
          {item.icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#311D00', marginBottom: 2 }}>
            {item.title}
          </div>
          {item.subtitle && (
            <div style={{ fontSize: 14, color: '#6F5E53' }}>
              {item.subtitle}
            </div>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {item.type === 'toggle' && item.onToggle && (
          <ToggleSwitch 
            enabled={item.value || false} 
            onToggle={item.onToggle}
            color={item.color || '#1E6E8B'}
          />
        )}
        {(item.type === 'navigate' || item.type === 'action') && (
          <button
            onClick={item.onClick}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: item.color || '#6F5E53',
              padding: 8
            }}
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ background: '#EAE9E5', minHeight: '100vh', paddingBottom: 120 }}>
      {/* Header */}
      <div style={{ 
        background: '#fff', 
        padding: '1.5rem 1.5rem 1rem 4rem',
        borderBottom: '1px solid #D9CFC2',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 30
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <SettingsIcon size={32} color="#A36456" />
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#311D00', margin: 0, fontFamily: 'Inter, Arial, Helvetica, sans-serif' }}>
            Settings
          </h1>
        </div>
      </div>

      {/* User Profile Section */}
      <div style={{ background: '#fff', margin: '80px 1.5rem 16px 1.5rem', borderRadius: 12, padding: '1.5rem', boxShadow: '0 2px 8px rgba(49,29,0,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #E2B6A1, #A36456)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 24,
            fontWeight: 700
          }}>
            O
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#311D00', marginBottom: 4 }}>
              Olivia Johnson
            </div>
            <div style={{ fontSize: 14, color: '#6F5E53', marginBottom: 2 }}>
              olivia.johnson@email.com
            </div>
            <div style={{ fontSize: 12, color: '#A36456' }}>
              Member since January 2025
            </div>
          </div>
          <button
            style={{
              background: '#E2B6A1',
              color: '#8C5A51',
              border: 'none',
              borderRadius: 8,
              padding: '8px 16px',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Edit
          </button>
        </div>
      </div>

      {/* Settings Sections */}
      <div style={{ padding: '0 1.5rem' }}>
        {settingSections.map((section, sectionIndex) => (
          <div 
            key={sectionIndex}
            style={{
              background: '#fff',
              borderRadius: 12,
              marginBottom: 16,
              boxShadow: '0 2px 8px rgba(49,29,0,0.08)',
              overflow: 'hidden'
            }}
          >
            <div style={{ 
              padding: '16px 20px 8px 20px',
              fontSize: 14,
              fontWeight: 700,
              color: '#A36456',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {section.title}
            </div>
            <div style={{ padding: '0 20px' }}>
              {section.items.map((item, itemIndex) => (
                <SettingItemComponent key={item.id} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1.5rem'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 12,
            padding: '2rem',
            maxWidth: 400,
            width: '100%'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ color: '#ef4444', marginBottom: 16 }}>
                <Trash2 size={48} />
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#311D00', marginBottom: 8 }}>
                Delete Account
              </h2>
              <p style={{ fontSize: 14, color: '#6F5E53', lineHeight: 1.5 }}>
                This action cannot be undone. All your journal entries, health data, and account information will be permanently deleted.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                style={{
                  flex: 1,
                  background: '#F5F1ED',
                  color: '#6F5E53',
                  border: 'none',
                  borderRadius: 8,
                  padding: '12px 24px',
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log('Delete account confirmed');
                  setShowDeleteConfirm(false);
                }}
                style={{
                  flex: 1,
                  background: '#ef4444',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '12px 24px',
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* App Version Footer */}
      <div style={{ 
        padding: '2rem 1.5rem 1rem 1.5rem',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: 12, color: '#6F5E53', marginBottom: 4 }}>
          Forela Health App
        </div>
        <div style={{ fontSize: 12, color: '#A36456' }}>
          Version 1.0.0 • Built with ❤️ for women's health
        </div>
      </div>
    </div>
  );
};

export default Settings; 