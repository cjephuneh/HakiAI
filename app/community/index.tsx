import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image,
  FlatList
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { 
  Users, 
  MessageCircle, 
  Calendar, 
  MapPin,
  Plus,
  Search,
  Filter
} from 'lucide-react-native';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { colors } from '@/constants/colors';

// Mock data for community events
const eventsData = [
  {
    id: '1',
    title: 'Anti-Corruption Protest',
    description: 'Join us for a peaceful protest against corruption in government institutions.',
    date: '2023-07-15T10:00:00',
    location: 'Freedom Corner, Uhuru Park',
    organizer: 'Citizens Against Corruption',
    attendees: 156,
    image: 'https://images.unsplash.com/photo-1591189824344-9c3d8c0b1c8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '2',
    title: 'Legal Rights Workshop',
    description: 'Learn about your constitutional rights and how to protect yourself during police encounters.',
    date: '2023-07-22T14:00:00',
    location: 'Community Center, CBD',
    organizer: 'Legal Aid Kenya',
    attendees: 78,
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '3',
    title: 'Community Cleanup',
    description: 'Help clean up our neighborhood and make it a better place for everyone.',
    date: '2023-07-29T09:00:00',
    location: 'Kibera Community Park',
    organizer: 'Green Kenya Initiative',
    attendees: 42,
    image: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
];

// Mock data for community discussions
const discussionsData = [
  {
    id: '1',
    title: 'How to report police harassment effectively',
    author: 'Jane Doe',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    date: '2023-07-10T15:30:00',
    replies: 24,
    likes: 45,
  },
  {
    id: '2',
    title: 'Organizing community watch groups',
    author: 'John Smith',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    date: '2023-07-08T09:15:00',
    replies: 18,
    likes: 32,
  },
  {
    id: '3',
    title: 'Fundraising strategies for legal aid',
    author: 'Mary Johnson',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    date: '2023-07-05T11:45:00',
    replies: 15,
    likes: 28,
  },
];

export default function CommunityScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'events' | 'discussions'>('events');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderEventItem = ({ item }: { item: typeof eventsData[0] }) => (
    <TouchableOpacity 
      style={styles.eventCard}
      onPress={() => router.push(`/community/event/${item.id}`)}
      activeOpacity={0.8}
    >
      <Image 
        source={{ uri: item.image }} 
        style={styles.eventImage}
        resizeMode="cover"
      />
      <View style={styles.eventContent}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        
        <View style={styles.eventMeta}>
          <View style={styles.eventMetaItem}>
            <Calendar size={14} color={colors.text} />
            <Text style={styles.eventMetaText}>
              {formatDate(item.date)}
            </Text>
          </View>
          
          <View style={styles.eventMetaItem}>
            <MapPin size={14} color={colors.text} />
            <Text style={styles.eventMetaText} numberOfLines={1}>
              {item.location}
            </Text>
          </View>
        </View>
        
        <Text style={styles.eventDescription} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.eventFooter}>
          <View style={styles.eventOrganizer}>
            <Text style={styles.organizerText}>By {item.organizer}</Text>
          </View>
          
          <View style={styles.eventAttendees}>
            <Users size={14} color={colors.primary} />
            <Text style={styles.attendeesText}>{item.attendees} attending</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderDiscussionItem = ({ item }: { item: typeof discussionsData[0] }) => (
    <TouchableOpacity 
      style={styles.discussionCard}
      onPress={() => router.push(`/community/discussion/${item.id}`)}
      activeOpacity={0.8}
    >
      <View style={styles.discussionHeader}>
        <View style={styles.discussionAuthor}>
          <Avatar 
            source={item.authorAvatar}
            size="small"
          />
          <View style={styles.authorInfo}>
            <Text style={styles.authorName}>{item.author}</Text>
            <Text style={styles.discussionDate}>{formatDate(item.date)}</Text>
          </View>
        </View>
      </View>
      
      <Text style={styles.discussionTitle}>{item.title}</Text>
      
      <View style={styles.discussionFooter}>
        <View style={styles.discussionStat}>
          <MessageCircle size={14} color={colors.text} />
          <Text style={styles.discussionStatText}>{item.replies} replies</Text>
        </View>
        
        <View style={styles.discussionStat}>
          <ThumbsUp size={14} color={colors.text} />
          <Text style={styles.discussionStatText}>{item.likes} likes</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Community',
        }} 
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.searchContainer}>
            <Input
              placeholder={activeTab === 'events' ? "Search events..." : "Search discussions..."}
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
          
          <View style={styles.tabs}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'events' && styles.activeTab]}
              onPress={() => setActiveTab('events')}
            >
              <Calendar size={16} color={activeTab === 'events' ? colors.primary : colors.text} />
              <Text style={[styles.tabText, activeTab === 'events' && styles.activeTabText]}>
                Events
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'discussions' && styles.activeTab]}
              onPress={() => setActiveTab('discussions')}
            >
              <MessageCircle size={16} color={activeTab === 'discussions' ? colors.primary : colors.text} />
              <Text style={[styles.tabText, activeTab === 'discussions' && styles.activeTabText]}>
                Discussions
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {activeTab === 'events' ? (
          <>
            <FlatList
              data={eventsData}
              renderItem={renderEventItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={
                <View style={styles.listHeader}>
                  <Text style={styles.listTitle}>Upcoming Events</Text>
                  <TouchableOpacity onPress={() => router.push('/community/events')}>
                    <Text style={styles.viewAllText}>View All</Text>
                  </TouchableOpacity>
                </View>
              }
              ListFooterComponent={
                <View style={styles.poweredByContainer}>
                  <Text style={styles.poweredByText}>Powered by</Text>
                  <Text style={styles.hakihackText}>hakihack</Text>
                </View>
              }
            />
            
            <TouchableOpacity 
              style={styles.fab}
              onPress={() => router.push('/community/create-event')}
              activeOpacity={0.8}
            >
              <Plus size={24} color="white" />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <FlatList
              data={discussionsData}
              renderItem={renderDiscussionItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={
                <View style={styles.listHeader}>
                  <Text style={styles.listTitle}>Recent Discussions</Text>
                  <TouchableOpacity onPress={() => router.push('/community/discussions')}>
                    <Text style={styles.viewAllText}>View All</Text>
                  </TouchableOpacity>
                </View>
              }
              ListFooterComponent={
                <View style={styles.poweredByContainer}>
                  <Text style={styles.poweredByText}>Powered by</Text>
                  <Text style={styles.hakihackText}>hakihack</Text>
                </View>
              }
            />
            
            <TouchableOpacity 
              style={styles.fab}
              onPress={() => router.push('/community/create-discussion')}
              activeOpacity={0.8}
            >
              <Plus size={24} color="white" />
            </TouchableOpacity>
          </>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
    paddingBottom: 0,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
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
  tabs: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: colors.lightPrimary || `${colors.primary}10`,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    marginLeft: 8,
    color: colors.text,
  },
  activeTabText: {
    color: 'white',
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 80,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  viewAllText: {
    fontSize: 14,
    color: colors.primary,
  },
  eventCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  eventImage: {
    width: '100%',
    height: 160,
    backgroundColor: colors.placeholder,
  },
  eventContent: {
    padding: 16,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: colors.text,
  },
  eventMeta: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  eventMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  eventMetaText: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.7,
    marginLeft: 4,
  },
  eventDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
    marginBottom: 12,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventOrganizer: {
    flex: 1,
  },
  organizerText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
  },
  eventAttendees: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightPrimary || `${colors.primary}10`,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  attendeesText: {
    fontSize: 12,
    color: colors.primary,
    marginLeft: 4,
  },
  discussionCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  discussionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  discussionAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorInfo: {
    marginLeft: 12,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  discussionDate: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.7,
  },
  discussionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: colors.text,
  },
  discussionFooter: {
    flexDirection: 'row',
  },
  discussionStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  discussionStatText: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.7,
    marginLeft: 4,
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
  poweredByContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
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