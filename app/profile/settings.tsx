import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Switch,
  Alert
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { 
  Bell, 
  Lock, 
  Globe, 
  Moon, 
  Smartphone, 
  Trash2,
  ChevronRight,
  LogOut,
  Mail,
  Info,
  Shield,
  FileText
} from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { useAuthStore } from '@/store/auth-store';
import { colors } from '@/constants/colors';

export default function SettingsScreen() {
  const router = useRouter();
  const { logout } = useAuthStore();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [language, setLanguage] = useState('English');

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Logout", 
          onPress: () => logout(),
          style: "destructive"
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete Account", 
          onPress: () => {
            // In a real app, this would call an API to delete the account
            Alert.alert("Account Deleted", "Your account has been successfully deleted.");
            logout();
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Settings',
        }} 
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <Card style={styles.card}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Bell size={20} color={colors.text} />
                <Text style={styles.settingText}>Push Notifications</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: colors.border, true: `${colors.primary}80` }}
                thumbColor={notificationsEnabled ? colors.primary : '#f4f3f4'}
              />
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Mail size={20} color={colors.text} />
                <Text style={styles.settingText}>Email Notifications</Text>
              </View>
              <Switch
                value={emailNotificationsEnabled}
                onValueChange={setEmailNotificationsEnabled}
                trackColor={{ false: colors.border, true: `${colors.primary}80` }}
                thumbColor={emailNotificationsEnabled ? colors.primary : '#f4f3f4'}
              />
            </View>
            
            <View style={styles.divider} />
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => router.push('/profile/notification-preferences')}
            >
              <View style={styles.settingInfo}>
                <Bell size={20} color={colors.text} />
                <Text style={styles.settingText}>Notification Preferences</Text>
              </View>
              <ChevronRight size={20} color={colors.text} />
            </TouchableOpacity>
          </Card>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          
          <Card style={styles.card}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Moon size={20} color={colors.text} />
                <Text style={styles.settingText}>Dark Mode</Text>
              </View>
              <Switch
                value={darkModeEnabled}
                onValueChange={setDarkModeEnabled}
                trackColor={{ false: colors.border, true: `${colors.primary}80` }}
                thumbColor={darkModeEnabled ? colors.primary : '#f4f3f4'}
              />
            </View>
            
            <View style={styles.divider} />
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => {
                // Show language selection
                Alert.alert(
                  "Select Language",
                  "Choose your preferred language",
                  [
                    { text: "English", onPress: () => setLanguage('English') },
                    { text: "Swahili", onPress: () => setLanguage('Swahili') },
                    { text: "Cancel", style: "cancel" }
                  ]
                );
              }}
            >
              <View style={styles.settingInfo}>
                <Globe size={20} color={colors.text} />
                <Text style={styles.settingText}>Language</Text>
              </View>
              <View style={styles.settingValue}>
                <Text style={styles.settingValueText}>{language}</Text>
                <ChevronRight size={20} color={colors.text} />
              </View>
            </TouchableOpacity>
          </Card>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          
          <Card style={styles.card}>
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => router.push('/profile/change-password')}
            >
              <View style={styles.settingInfo}>
                <Lock size={20} color={colors.text} />
                <Text style={styles.settingText}>Change Password</Text>
              </View>
              <ChevronRight size={20} color={colors.text} />
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Smartphone size={20} color={colors.text} />
                <Text style={styles.settingText}>Biometric Authentication</Text>
              </View>
              <Switch
                value={biometricsEnabled}
                onValueChange={setBiometricsEnabled}
                trackColor={{ false: colors.border, true: `${colors.primary}80` }}
                thumbColor={biometricsEnabled ? colors.primary : '#f4f3f4'}
              />
            </View>
            
            <View style={styles.divider} />
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => router.push('/profile/privacy')}
            >
              <View style={styles.settingInfo}>
                <Shield size={20} color={colors.text} />
                <Text style={styles.settingText}>Privacy Settings</Text>
              </View>
              <ChevronRight size={20} color={colors.text} />
            </TouchableOpacity>
          </Card>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <Card style={styles.card}>
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => router.push('/about')}
            >
              <View style={styles.settingInfo}>
                <Info size={20} color={colors.text} />
                <Text style={styles.settingText}>About Haki</Text>
              </View>
              <ChevronRight size={20} color={colors.text} />
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => router.push('/terms')}
            >
              <View style={styles.settingInfo}>
                <FileText size={20} color={colors.text} />
                <Text style={styles.settingText}>Terms of Service</Text>
              </View>
              <ChevronRight size={20} color={colors.text} />
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => router.push('/privacy-policy')}
            >
              <View style={styles.settingInfo}>
                <Lock size={20} color={colors.text} />
                <Text style={styles.settingText}>Privacy Policy</Text>
              </View>
              <ChevronRight size={20} color={colors.text} />
            </TouchableOpacity>
          </Card>
        </View>
        
        <View style={styles.dangerSection}>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <LogOut size={20} color={colors.danger} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.deleteAccountButton}
            onPress={handleDeleteAccount}
          >
            <Trash2 size={20} color={colors.danger} />
            <Text style={styles.deleteAccountText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>Haki v1.0.0</Text>
          <Text style={styles.poweredByText}>Powered by hakihack</Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: colors.text,
  },
  card: {
    padding: 0,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 12,
    color: colors.text,
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValueText: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
    marginRight: 8,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 48,
  },
  dangerSection: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: colors.lightDanger || `${colors.danger}15`,
    borderRadius: 8,
    marginBottom: 12,
  },
  logoutText: {
    fontSize: 16,
    color: colors.danger,
    marginLeft: 12,
    fontWeight: '500',
  },
  deleteAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: 8,
  },
  deleteAccountText: {
    fontSize: 16,
    color: colors.danger,
    marginLeft: 12,
    fontWeight: '500',
  },
  versionInfo: {
    alignItems: 'center',
    marginBottom: 32,
  },
  versionText: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.5,
    marginBottom: 4,
  },
  poweredByText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
});