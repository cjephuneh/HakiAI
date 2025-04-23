import React, { useEffect, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator,
  TouchableOpacity,
  Text
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Plus, 
  Search, 
  Filter, 
  BarChart2,
  AlertTriangle
} from 'lucide-react-native';
import { CorruptionReportCard } from '@/components/CorruptionReportCard';
import { EmptyState } from '@/components/EmptyState';
import { Input } from '@/components/ui/Input';
import { useCorruptionStore } from '@/store/corruption-store';
import { CorruptionReport } from '@/types';
import { colors } from '@/constants/colors';

export default function CorruptionScreen() {
  const router = useRouter();
  const { reports, isLoading, fetchReports, upvoteReport } = useCorruptionStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredReports, setFilteredReports] = useState<CorruptionReport[]>([]);
  const [activeTab, setActiveTab] = useState('reports');

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredReports(reports);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = reports.filter(
        report => 
          report.title.toLowerCase().includes(query) || 
          report.description.toLowerCase().includes(query) ||
          (report.officialName && report.officialName.toLowerCase().includes(query)) ||
          report.category.toLowerCase().includes(query) ||
          (report.location.address && report.location.address.toLowerCase().includes(query))
      );
      setFilteredReports(filtered);
    }
  }, [searchQuery, reports]);

  const handleItemPress = (item: CorruptionReport) => {
    router.push(`/corruption/${item.id}`);
  };

  const renderItem = ({ item }: { item: CorruptionReport }) => (
    <CorruptionReportCard 
      item={item} 
      onPress={handleItemPress} 
      onUpvote={upvoteReport}
    />
  );

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

    return (
      <EmptyState
        title="No Corruption Reports Found"
        description={
          searchQuery 
            ? "No results match your search criteria. Try a different search term."
            : "There are no corruption reports yet. Be the first to report corruption!"
        }
        icon={<AlertTriangle size={48} color={colors.danger} />}
        actionLabel={searchQuery ? "Clear Search" : "Report Corruption"}
        onAction={searchQuery ? () => setSearchQuery('') : () => router.push('/corruption/report')}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Input
          placeholder="Search corruption reports..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Search size={20} color={colors.text} />}
          containerStyle={styles.searchInput}
        />
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => {/* Show filter options */}}
        >
          <Filter size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'reports' && styles.activeTab]}
          onPress={() => setActiveTab('reports')}
        >
          <Text style={[styles.tabText, activeTab === 'reports' && styles.activeTabText]}>Reports</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'leaderboard' && styles.activeTab]}
          onPress={() => {
            setActiveTab('leaderboard');
            router.push('/corruption/leaderboard');
          }}
        >
          <Text style={[styles.tabText, activeTab === 'leaderboard' && styles.activeTabText]}>Leaderboard</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'stats' && styles.activeTab]}
          onPress={() => {
            setActiveTab('stats');
            router.push('/corruption/stats');
          }}
        >
          <BarChart2 size={16} color={activeTab === 'stats' ? colors.primary : colors.text} />
          <Text style={[styles.tabText, activeTab === 'stats' && styles.activeTabText]}>Stats</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredReports}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push('/corruption/report')}
        activeOpacity={0.8}
      >
        <Plus size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 8,
  },
  searchInput: {
    flex: 1,
    marginBottom: 0,
  },
  filterButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.card,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  activeTab: {
    backgroundColor: `${colors.primary}15`,
  },
  tabText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 4,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '500',
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});