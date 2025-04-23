import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { 
  AlertTriangle, 
  ChevronRight, 
  ArrowUp, 
  Filter,
  Share2
} from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { useCorruptionStore } from '@/store/corruption-store';
import { colors } from '@/constants/colors';

type LeaderboardItem = {
  officialName: string;
  count: number;
  rank?: number;
  trend?: 'up' | 'down' | 'stable';
  department?: string;
};

export default function CorruptionLeaderboardScreen() {
  const router = useRouter();
  const { getLeaderboard, isLoading } = useCorruptionStore();
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year' | 'all'>('all');

  useEffect(() => {
    // Get leaderboard data and add some mock data for UI demonstration
    const data = getLeaderboard().map((item, index) => ({
      ...item,
      rank: index + 1,
      trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable',
      department: ['Traffic Police', 'County Government', 'National Police', 'Education Ministry', 'Health Department'][Math.floor(Math.random() * 5)],
    }));
    
    setLeaderboard(data);
  }, [timeframe]);

  const renderItem = ({ item, index }: { item: LeaderboardItem; index: number }) => (
    <Card 
      style={[
        styles.leaderboardCard,
        index < 3 ? styles.topThreeCard : null,
      ]}
    >
      <View style={styles.rankContainer}>
        <Text style={[
          styles.rankText,
          index < 3 ? styles.topThreeRank : null,
        ]}>
          #{item.rank}
        </Text>
        {item.trend === 'up' && (
          <ArrowUp size={16} color={colors.danger} style={styles.trendIcon} />
        )}
      </View>
      
      <View style={styles.officialInfo}>
        <Avatar name={item.officialName} size="medium" />
        <View style={styles.officialDetails}>
          <Text style={styles.officialName}>{item.officialName}</Text>
          <Text style={styles.departmentText}>{item.department}</Text>
        </View>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.reportCount}>
          <Text style={styles.countValue}>{item.count}</Text>
          <Text style={styles.countLabel}>Reports</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.viewButton}
          onPress={() => router.push(`/corruption/official/${encodeURIComponent(item.officialName)}`)}
        >
          <ChevronRight size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </Card>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Corruption Leaderboard</Text>
      <Text style={styles.subtitle}>
        Officials with the most corruption reports from citizens
      </Text>
      
      <View style={styles.timeframeContainer}>
        <TouchableOpacity 
          style={[styles.timeframeButton, timeframe === 'week' && styles.activeTimeframe]}
          onPress={() => setTimeframe('week')}
        >
          <Text style={[styles.timeframeText, timeframe === 'week' && styles.activeTimeframeText]}>
            This Week
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.timeframeButton, timeframe === 'month' && styles.activeTimeframe]}
          onPress={() => setTimeframe('month')}
        >
          <Text style={[styles.timeframeText, timeframe === 'month' && styles.activeTimeframeText]}>
            This Month
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.timeframeButton, timeframe === 'year' && styles.activeTimeframe]}
          onPress={() => setTimeframe('year')}
        >
          <Text style={[styles.timeframeText, timeframe === 'year' && styles.activeTimeframeText]}>
            This Year
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.timeframeButton, timeframe === 'all' && styles.activeTimeframe]}
          onPress={() => setTimeframe('all')}
        >
          <Text style={[styles.timeframeText, timeframe === 'all' && styles.activeTimeframeText]}>
            All Time
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.infoCard}>
        <AlertTriangle size={20} color={colors.warning} />
        <Text style={styles.infoText}>
          This leaderboard is based on citizen reports and is updated regularly. Officials have the right to respond to allegations.
        </Text>
      </View>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footer}>
      <Button
        title="Share Leaderboard"
        variant="outline"
        leftIcon={<Share2 size={16} color={colors.primary} />}
        style={styles.shareButton}
        onPress={() => {
          // Share functionality would go here
        }}
      />
      
      <Button
        title="Report Corruption"
        onPress={() => router.push('/corruption/report')}
        style={styles.reportButton}
      />
      
      <View style={styles.disclaimerContainer}>
        <Text style={styles.disclaimerText}>
          Haki is committed to transparency and accountability. All reports are verified before being included in the leaderboard.
        </Text>
      </View>
      
      <View style={styles.poweredByContainer}>
        <Text style={styles.poweredByText}>Powered by</Text>
        <Text style={styles.hakihackText}>hakihack</Text>
      </View>
    </View>
  );

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Corruption Leaderboard',
          headerRight: () => (
            <TouchableOpacity style={styles.filterButton}>
              <Filter size={20} color={colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading leaderboard...</Text>
        </View>
      ) : (
        <FlatList
          data={leaderboard}
          renderItem={renderItem}
          keyExtractor={(item) => item.officialName}
          contentContainerStyle={styles.container}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    opacity: 0.7,
    marginBottom: 16,
  },
  timeframeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  timeframeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: colors.lightPrimary || `${colors.primary}10`,
  },
  activeTimeframe: {
    backgroundColor: colors.primary,
  },
  timeframeText: {
    fontSize: 14,
    color: colors.primary,
  },
  activeTimeframeText: {
    color: 'white',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.lightWarning || `${colors.warning}15`,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 12,
    color: colors.text,
    lineHeight: 18,
  },
  leaderboardCard: {
    marginBottom: 12,
    padding: 16,
  },
  topThreeCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.danger,
  },
  rankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rankText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  topThreeRank: {
    color: colors.danger,
  },
  trendIcon: {
    marginLeft: 8,
  },
  officialInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  officialDetails: {
    marginLeft: 12,
    flex: 1,
  },
  officialName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  departmentText: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reportCount: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  countValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.danger,
    marginRight: 4,
  },
  countLabel: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
  },
  viewButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.lightPrimary || `${colors.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    marginTop: 16,
  },
  shareButton: {
    marginBottom: 12,
  },
  reportButton: {
    marginBottom: 24,
  },
  disclaimerContainer: {
    marginBottom: 24,
  },
  disclaimerText: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.text,
  },
  filterButton: {
    padding: 8,
  },
  poweredByContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  poweredByText: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.5,
  },
  hakihackText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primary,
    marginLeft: 4,
  },
});