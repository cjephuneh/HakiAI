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
  Heart as HeartIcon
} from 'lucide-react-native';
import { FundraiserCard } from '@/components/FundraiserCard';
import { EmptyState } from '@/components/EmptyState';
import { Input } from '@/components/ui/Input';
import { useFundraiserStore } from '@/store/fundraiser-store';
import { Fundraiser } from '@/types';
import { colors } from '@/constants/colors';

export default function FundraisersScreen() {
  const router = useRouter();
  const { fundraisers, isLoading, fetchFundraisers, donateFundraiser } = useFundraiserStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFundraisers, setFilteredFundraisers] = useState<Fundraiser[]>([]);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  useEffect(() => {
    fetchFundraisers();
  }, []);

  useEffect(() => {
    let filtered = [...fundraisers];
    
    // Apply search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        fundraiser => 
          fundraiser.title.toLowerCase().includes(query) || 
          fundraiser.description.toLowerCase().includes(query) ||
          fundraiser.category.toLowerCase().includes(query) ||
          fundraiser.beneficiary.toLowerCase().includes(query)
      );
    }
    
    // Apply category filter
    if (activeFilter) {
      filtered = filtered.filter(fundraiser => fundraiser.category === activeFilter);
    }
    
    setFilteredFundraisers(filtered);
  }, [searchQuery, fundraisers, activeFilter]);

  const handleItemPress = (item: Fundraiser) => {
    router.push(`/fundraisers/${item.id}`);
  };

  const renderItem = ({ item }: { item: Fundraiser }) => (
    <FundraiserCard 
      item={item} 
      onPress={handleItemPress} 
      onDonate={donateFundraiser}
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
        title="No Fundraisers Found"
        description={
          searchQuery 
            ? "No results match your search criteria. Try a different search term."
            : "There are no active fundraisers yet. Start one to support your community!"
        }
        icon={<HeartIcon size={48} color={colors.secondary} />}
        actionLabel={searchQuery ? "Clear Search" : "Start Fundraiser"}
        onAction={searchQuery ? () => setSearchQuery('') : () => router.push('/fundraisers/create')}
      />
    );
  };

  const categories = [
    { value: 'legal', label: 'Legal Aid' },
    { value: 'medical', label: 'Medical' },
    { value: 'education', label: 'Education' },
    { value: 'demonstration', label: 'Demonstration' },
    { value: 'community', label: 'Community' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Input
          placeholder="Search fundraisers..."
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

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        <TouchableOpacity 
          style={[
            styles.categoryChip,
            activeFilter === null && styles.activeCategoryChip
          ]}
          onPress={() => setActiveFilter(null)}
        >
          <Text style={[
            styles.categoryChipText,
            activeFilter === null && styles.activeCategoryChipText
          ]}>
            All
          </Text>
        </TouchableOpacity>
        
        {categories.map((category) => (
          <TouchableOpacity 
            key={category.value}
            style={[
              styles.categoryChip,
              activeFilter === category.value && styles.activeCategoryChip
            ]}
            onPress={() => setActiveFilter(
              activeFilter === category.value ? null : category.value
            )}
          >
            <Text style={[
              styles.categoryChipText,
              activeFilter === category.value && styles.activeCategoryChipText
            ]}>
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredFundraisers}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push('/fundraisers/create')}
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
  categoriesContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  categoriesContent: {
    paddingRight: 16,
  },
  categoryChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: colors.lightSecondary || `${colors.secondary}10`,
    marginRight: 8,
  },
  activeCategoryChip: {
    backgroundColor: colors.secondary,
  },
  categoryChipText: {
    fontSize: 14,
    color: colors.secondary,
  },
  activeCategoryChipText: {
    color: 'white',
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
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});