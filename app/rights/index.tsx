import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { 
  Search, 
  ChevronRight, 
  Shield, 
  BookOpen, 
  Scale,
  Users,
  AlertTriangle,
  Phone
} from 'lucide-react-native';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { colors } from '@/constants/colors';

const rightsCategoriesData = [
  {
    id: '1',
    title: 'Constitutional Rights',
    icon: <Shield size={24} color={colors.primary} />,
    description: 'Learn about your fundamental rights as a citizen',
    count: 12,
  },
  {
    id: '2',
    title: 'Police Encounters',
    icon: <AlertTriangle size={24} color={colors.danger} />,
    description: 'What to do when stopped by police',
    count: 8,
  },
  {
    id: '3',
    title: 'Legal Procedures',
    icon: <Scale size={24} color={colors.accent} />,
    description: 'Understanding arrest, bail, and court processes',
    count: 15,
  },
  {
    id: '4',
    title: 'Freedom of Assembly',
    icon: <Users size={24} color={colors.secondary} />,
    description: 'Your rights during protests and demonstrations',
    count: 6,
  },
  {
    id: '5',
    title: 'Digital Rights',
    icon: <BookOpen size={24} color={colors.info} />,
    description: 'Privacy, free speech, and online security',
    count: 9,
  },
];

const emergencyContactsData = [
  { id: '1', name: 'Police Emergency', number: '999', icon: 'police' },
  { id: '2', name: 'Legal Aid Hotline', number: '0800-720-720', icon: 'legal' },
  { id: '3', name: 'Human Rights Commission', number: '0800-221-349', icon: 'rights' },
];

const featuredArticlesData = [
  {
    id: '1',
    title: "What to Do If You're Arrested",
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    readTime: '5 min read',
  },
  {
    id: '2',
    title: 'Your Rights During Police Stops',
    image: 'https://images.unsplash.com/photo-1453873623425-04e3561289aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    readTime: '7 min read',
  },
  {
    id: '3',
    title: "Freedom of Assembly: A Citizen's Guide",
    image: 'https://images.unsplash.com/photo-1591189824344-9c3d8c0b1c8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    readTime: '10 min read',
  },
];

export default function RightsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Know Your Rights',
        }} 
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Know Your Rights</Text>
          <Text style={styles.subtitle}>
            Empowering citizens with legal knowledge and resources
          </Text>
          
          <Input
            placeholder="Search rights, laws, procedures..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon={<Search size={20} color={colors.text} />}
            containerStyle={styles.searchInput}
          />
        </View>
        
        <View style={styles.emergencySection}>
          <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          
          <View style={styles.emergencyCards}>
            {emergencyContactsData.map((contact) => (
              <TouchableOpacity 
                key={contact.id}
                style={styles.emergencyCard}
                onPress={() => {
                  // Dial number functionality
                }}
              >
                <View style={[
                  styles.emergencyIconContainer,
                  contact.icon === 'police' && { backgroundColor: colors.danger },
                  contact.icon === 'legal' && { backgroundColor: colors.primary },
                  contact.icon === 'rights' && { backgroundColor: colors.secondary },
                ]}>
                  <Phone size={20} color="white" />
                </View>
                <Text style={styles.emergencyName}>{contact.name}</Text>
                <Text style={styles.emergencyNumber}>{contact.number}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Rights Categories</Text>
          
          {rightsCategoriesData.map((category) => (
            <TouchableOpacity 
              key={category.id}
              style={styles.categoryCard}
              onPress={() => router.push(`/rights/category/${category.id}`)}
            >
              <View style={styles.categoryIcon}>
                {category.icon}
              </View>
              <View style={styles.categoryContent}>
                <Text style={styles.categoryTitle}>{category.title}</Text>
                <Text style={styles.categoryDescription}>{category.description}</Text>
                <Text style={styles.categoryCount}>{category.count} articles</Text>
              </View>
              <ChevronRight size={20} color={colors.text} />
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.featuredSection}>
          <Text style={styles.sectionTitle}>Featured Articles</Text>
          
          {featuredArticlesData.map((article) => (
            <TouchableOpacity 
              key={article.id}
              style={styles.articleCard}
              onPress={() => router.push(`/rights/article/${article.id}`)}
            >
              <Image 
                source={{ uri: article.image }} 
                style={styles.articleImage}
              />
              <View style={styles.articleContent}>
                <Text style={styles.articleTitle}>{article.title}</Text>
                <Text style={styles.articleReadTime}>{article.readTime}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        <Card style={styles.legalAidCard}>
          <View style={styles.legalAidContent}>
            <Scale size={32} color={colors.primary} />
            <View style={styles.legalAidTextContainer}>
              <Text style={styles.legalAidTitle}>Need Legal Help?</Text>
              <Text style={styles.legalAidDescription}>
                Connect with pro-bono lawyers and legal aid services
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.legalAidButton}
            onPress={() => router.push('/rights/legal-aid')}
          >
            <Text style={styles.legalAidButtonText}>Find Legal Aid</Text>
            <ChevronRight size={16} color={colors.primary} />
          </TouchableOpacity>
        </Card>
        
        <View style={styles.poweredByContainer}>
          <Text style={styles.poweredByText}>Powered by</Text>
          <Text style={styles.hakihackText}>hakihack</Text>
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
  header: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    opacity: 0.7,
    marginBottom: 16,
    lineHeight: 22,
  },
  searchInput: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: colors.text,
  },
  emergencySection: {
    padding: 16,
    paddingTop: 0,
  },
  emergencyCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  emergencyCard: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.card,
    borderRadius: 12,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emergencyIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  emergencyName: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 4,
    color: colors.text,
  },
  emergencyNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primary,
  },
  categoriesSection: {
    padding: 16,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.lightPrimary || `${colors.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryContent: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: colors.text,
  },
  categoryDescription: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  featuredSection: {
    padding: 16,
  },
  articleCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  articleImage: {
    width: '100%',
    height: 160,
    backgroundColor: colors.placeholder,
  },
  articleContent: {
    padding: 16,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: colors.text,
  },
  articleReadTime: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.7,
  },
  legalAidCard: {
    margin: 16,
    padding: 16,
  },
  legalAidContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  legalAidTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  legalAidTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: colors.text,
  },
  legalAidDescription: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
  },
  legalAidButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: colors.lightPrimary || `${colors.primary}10`,
    borderRadius: 8,
  },
  legalAidButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginRight: 8,
  },
  poweredByContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 16,
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