import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  FlatList
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Search, 
  AlertTriangle, 
  Heart, 
  ChevronRight,
  Shield,
  BookOpen,
  Megaphone
} from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LostIDCard } from '@/components/LostIDCard';
import { CorruptionReportCard } from '@/components/CorruptionReportCard';
import { FundraiserCard } from '@/components/FundraiserCard';
import { useLostIDStore } from '@/store/lost-id-store';
import { useCorruptionStore } from '@/store/corruption-store';
import { useFundraiserStore } from '@/store/fundraiser-store';
import { useAuthStore } from '@/store/auth-store';
import { colors } from '@/constants/colors';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { lostIDs, fetchLostIDs } = useLostIDStore();
  const { reports, fetchReports, upvoteReport } = useCorruptionStore();
  const { fundraisers, fetchFundraisers } = useFundraiserStore();

  useEffect(() => {
    fetchLostIDs();
    fetchReports();
    fetchFundraisers();
  }, []);

  const featuredLostIDs = lostIDs.slice(0, 3);
  const featuredReports = reports.slice(0, 3);
  const featuredFundraisers = fundraisers.slice(0, 3);

  const quickActions = [
    {
      id: '1',
      title: 'Report Lost ID',
      icon: <Search size={24} color={colors.primary} />,
      onPress: () => router.push('/lost-ids/report'),
    },
    {
      id: '2',
      title: 'Report Corruption',
      icon: <AlertTriangle size={24} color={colors.danger} />,
      onPress: () => router.push('/corruption/report'),
    },
    {
      id: '3',
      title: 'Start Fundraiser',
      icon: <Heart size={24} color={colors.secondary} />,
      onPress: () => router.push('/fundraisers/create'),
    },
    {
      id: '4',
      title: 'Know Your Rights',
      icon: <BookOpen size={24} color={colors.accent} />,
      onPress: () => router.push('/rights'),
    },
  ];

  const renderQuickAction = ({ item }: { item: typeof quickActions[0] }) => (
    <TouchableOpacity 
      style={styles.quickActionItem} 
      onPress={item.onPress}
      activeOpacity={0.7}
    >
      <View style={styles.quickActionIcon}>
        {item.icon}
      </View>
      <Text style={styles.quickActionTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeTitle}>
          Welcome{user ? `, ${user.name.split(' ')[0]}` : ''}
        </Text>
        <Text style={styles.welcomeSubtitle}>
          Make a difference in your community today
        </Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <FlatList
          data={quickActions}
          renderItem={renderQuickAction}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickActionsContainer}
        />
      </View>

      {/* Featured Cards */}
      <View style={styles.featuredSection}>
        <Card variant="elevated" style={styles.featuredCard}>
          <View style={styles.featuredCardContent}>
            <View style={styles.featuredIconContainer}>
              <Shield size={24} color="white" />
            </View>
            <View style={styles.featuredTextContainer}>
              <Text style={styles.featuredTitle}>Civic Watchdog</Text>
              <Text style={styles.featuredDescription}>
                Report corruption and hold officials accountable
              </Text>
            </View>
          </View>
          <Button 
            title="Learn More" 
            variant="outline" 
            size="small" 
            onPress={() => router.push('/about')}
          />
        </Card>

        <Card variant="elevated" style={styles.featuredCard}>
          <View style={styles.featuredCardContent}>
            <View style={[styles.featuredIconContainer, { backgroundColor: colors.secondary }]}>
              <Megaphone size={24} color="white" />
            </View>
            <View style={styles.featuredTextContainer}>
              <Text style={styles.featuredTitle}>Community Voice</Text>
              <Text style={styles.featuredDescription}>
                Join forces with others to make your voice heard
              </Text>
            </View>
          </View>
          <Button 
            title="Get Involved" 
            variant="outline" 
            size="small" 
            onPress={() => router.push('/community')}
          />
        </Card>
      </View>

      {/* Lost IDs Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Lost IDs</Text>
          <TouchableOpacity 
            style={styles.seeAllButton}
            onPress={() => router.push('/lost-ids')}
          >
            <Text style={styles.seeAllText}>See All</Text>
            <ChevronRight size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
        
        {featuredLostIDs.map(item => (
          <LostIDCard 
            key={item.id} 
            item={item} 
            onPress={(item) => router.push(`/lost-ids/${item.id}`)}
          />
        ))}
      </View>

      {/* Corruption Reports Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Corruption Reports</Text>
          <TouchableOpacity 
            style={styles.seeAllButton}
            onPress={() => router.push('/corruption')}
          >
            <Text style={styles.seeAllText}>See All</Text>
            <ChevronRight size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
        
        {featuredReports.map(item => (
          <CorruptionReportCard 
            key={item.id} 
            item={item} 
            onPress={(item) => router.push(`/corruption/${item.id}`)}
            onUpvote={upvoteReport}
          />
        ))}
      </View>

      {/* Fundraisers Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Fundraisers</Text>
          <TouchableOpacity 
            style={styles.seeAllButton}
            onPress={() => router.push('/fundraisers')}
          >
            <Text style={styles.seeAllText}>See All</Text>
            <ChevronRight size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
        
        {featuredFundraisers.map(item => (
          <FundraiserCard 
            key={item.id} 
            item={item} 
            onPress={(item) => router.push(`/fundraisers/${item.id}`)}
          />
        ))}
      </View>

      <View style={styles.footer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  welcomeSection: {
    padding: 20,
    paddingTop: 24,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    color: colors.text,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: colors.text,
    opacity: 0.7,
  },
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: colors.text,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
    marginRight: 4,
  },
  quickActionsContainer: {
    paddingRight: 20,
  },
  quickActionItem: {
    width: 100,
    alignItems: 'center',
    marginRight: 16,
  },
  quickActionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: `${colors.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 12,
    textAlign: 'center',
    color: colors.text,
  },
  featuredSection: {
    padding: 20,
    paddingTop: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  featuredCard: {
    flex: 1,
    marginHorizontal: 6,
    padding: 16,
  },
  featuredCardContent: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  featuredIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featuredTextContainer: {
    flex: 1,
  },
  featuredTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: colors.text,
  },
  featuredDescription: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.7,
  },
  footer: {
    height: 40,
  },
});