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
import { Plus, Search, Filter } from 'lucide-react-native';
import { LostIDCard } from '@/components/LostIDCard';
import { EmptyState } from '@/components/EmptyState';
import { Input } from '@/components/ui/Input';
import { useLostIDStore } from '@/store/lost-id-store';
import { LostID } from '@/types';
import { colors } from '@/constants/colors';

export default function LostIDsScreen() {
  const router = useRouter();
  const { lostIDs, isLoading, fetchLostIDs } = useLostIDStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredIDs, setFilteredIDs] = useState<LostID[]>([]);

  useEffect(() => {
    fetchLostIDs();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredIDs(lostIDs);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = lostIDs.filter(
        id => 
          id.title.toLowerCase().includes(query) || 
          id.description.toLowerCase().includes(query) ||
          (id.location.address && id.location.address.toLowerCase().includes(query))
      );
      setFilteredIDs(filtered);
    }
  }, [searchQuery, lostIDs]);

  const handleItemPress = (item: LostID) => {
    router.push(`/lost-ids/${item.id}`);
  };

  const renderItem = ({ item }: { item: LostID }) => (
    <LostIDCard item={item} onPress={handleItemPress} />
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
        title="No Lost IDs Found"
        description={
          searchQuery 
            ? "No results match your search criteria. Try a different search term."
            : "There are no lost IDs reported yet. Be the first to report a found ID!"
        }
        icon={<Search size={48} color={colors.primary} />}
        actionLabel={searchQuery ? "Clear Search" : "Report Found ID"}
        onAction={searchQuery ? () => setSearchQuery('') : () => router.push('/lost-ids/report')}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Input
          placeholder="Search lost IDs..."
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

      <FlatList
        data={filteredIDs}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push('/lost-ids/report')}
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
  listContent: {
    padding: 16,
    paddingTop: 8,
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
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});