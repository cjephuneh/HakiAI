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
import { useRouter } from 'expo-router';
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Award,
  Heart,
  Search,
  AlertTriangle
} from 'lucide-react-native';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth-store';
import { colors } from '@/constants/colors';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

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

  const menuItems = [
    {
      id: '1',
      title: 'My Lost IDs',
      icon: <Search size={20} color={colors.primary} />,
      onPress: () => router.push('/profile/lost-ids'),
    },
    {
      id: '2',
      title: 'My Reports',
      icon: <AlertTriangle size={20} color={colors.danger} />,
      onPress: () => router.push('/profile/reports'),
    },
    {
      id: '3',
      title: 'My Fundraisers',
      icon: <Heart size={20} color={colors.secondary} />,
      onPress: () => router.push('/profile/fundraisers'),
    },
    {
      id: '4',
      title: 'Achievements',
      icon: <Award size={20} color={colors.accent} />,
      onPress: () => router.push('/profile/achievements'),
    },
    {
      id: '5',
      title: 'Settings',
      icon: <Settings size={20} color={colors.text} />,
      onPress: () => router.push('/profile/settings'),
    },
    {
      id: '6',
      title: 'Notifications',
      icon: <Bell size={20} color={colors.text} />,
      rightElement: (
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          trackColor={{ false: colors.border, true: `${colors.primary}80` }}
          thumbColor={notificationsEnabled ? colors.primary : '#f4f3f4'}
        />
      ),
    },
    {
      id: '7',
      title: 'Privacy & Security',
      icon: <Shield size={20} color={colors.text} />,
      onPress: () => router.push('/profile/privacy'),
    },
    {
      id: '8',
      title: 'Help & Support',
      icon: <HelpCircle size={20} color={colors.text} />,
      onPress: () => router.push('/profile/help'),
    },
  ];

  if (!isAuthenticated) {
    return (
      <View style={styles.authContainer}>
        <View style={styles.authContent}>
          <User size={64} color={colors.primary} />
          <Text style={styles.authTitle}>Join Haki</Text>
          <Text style={styles.authDescription}>
            Sign in to report lost IDs, corruption incidents, and participate in community fundraisers
          </Text>
          <Button 
            title="Sign In" 
            onPress={() => router.push('/auth/login')}
            style={styles.authButton}
          />
          <Button 
            title="Create Account" 
            variant="outline"
            onPress={() => router.push('/auth/register')}
            style={styles.authButton}
          />
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Avatar 
          source={user?.avatar}
          name={user?.name}
          size="xlarge"
        />
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user?.points || 0}</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Reports</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>IDs Found</Text>
          </View>
        </View>
        
        <Button 
          title="Edit Profile" 
          variant="outline"
          size="small"
          onPress={() => router.push('/profile/edit')}
          style={styles.editButton}
        />
      </View>

      <Card style={styles.menuCard}>
        {menuItems.map((item, index) => (
          <React.Fragment key={item.id}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={item.onPress}
              disabled={!item.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                {item.icon}
                <Text style={styles.menuItemTitle}>{item.title}</Text>
              </View>
              {item.rightElement || (
                item.onPress && <ChevronRight size={20} color={colors.text} />
              )}
            </TouchableOpacity>
            {index < menuItems.length - 1 && <View style={styles.menuDivider} />}
          </React.Fragment>
        ))}
      </Card>

      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
        activeOpacity={0.7}
      >
        <LogOut size={20} color={colors.danger} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Haki v1.0.0</Text>
        <Text style={styles.footerText}>© 2023 Haki. All rights reserved.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    paddingBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 12,
    color: colors.text,
  },
  email: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 24,
    marginBottom: 16,
    width: '100%',
    justifyContent: 'center',
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.7,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: colors.border,
  },
  editButton: {
    marginTop: 8,
  },
  menuCard: {
    margin: 16,
    marginTop: 8,
    padding: 0,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemTitle: {
    fontSize: 16,
    marginLeft: 16,
    color: colors.text,
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 56,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    margin: 16,
    marginTop: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  logoutText: {
    fontSize: 16,
    color: colors.danger,
    marginLeft: 8,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    padding: 24,
  },
  footerText: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.5,
    marginBottom: 4,
  },
  authContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    padding: 24,
  },
  authContent: {
    alignItems: 'center',
  },
  authTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: colors.text,
  },
  authDescription: {
    fontSize: 16,
    textAlign: 'center',
    color: colors.text,
    opacity: 0.7,
    marginBottom: 32,
  },
  authButton: {
    width: '100%',
    marginBottom: 16,
  },
});