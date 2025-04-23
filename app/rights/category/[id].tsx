import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { 
  Search, 
  ChevronRight, 
  Shield, 
  BookOpen, 
  Scale,
  Users,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react-native';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { colors } from '@/constants/colors';

// Mock data for rights categories
const categoriesData = {
  '1': {
    id: '1',
    title: 'Constitutional Rights',
    icon: <Shield size={24} color={colors.primary} />,
    description: 'Learn about your fundamental rights as a citizen under the Constitution of Kenya.',
    color: colors.primary,
    articles: [
      {
        id: '101',
        title: 'Right to Life',
        image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        readTime: '8 min read',
        summary: 'Every person has the right to life. The life of a person begins at conception.',
      },
      {
        id: '102',
        title: 'Right to Equality and Freedom from Discrimination',
        image: 'https://images.unsplash.com/photo-1591189824344-9c3d8c0b1c8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        readTime: '12 min read',
        summary: 'Every person is equal before the law and has the right to equal protection and benefit of the law.',
      },
      {
        id: '103',
        title: 'Right to Human Dignity',
        image: 'https://images.unsplash.com/photo-1529634597503-139d3726fed5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        readTime: '6 min read',
        summary: 'Every person has inherent dignity and the right to have that dignity respected and protected.',
      },
      {
        id: '104',
        title: 'Freedom and Security of the Person',
        image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        readTime: '10 min read',
        summary: 'Every person has the right to freedom and security of the person, which includes the right not to be detained without trial.',
      },
    ]
  },
  '2': {
    id: '2',
    title: 'Police Encounters',
    icon: <AlertTriangle size={24} color={colors.danger} />,
    description: 'Know your rights when interacting with law enforcement officers.',
    color: colors.danger,
    articles: [
      {
        id: '1',
        title: "What to Do If You're Arrested",
        image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        readTime: '5 min read',
        summary: 'Being arrested can be a frightening experience, but knowing your rights can help protect you during this difficult time.',
      },
      {
        id: '2',
        title: 'Your Rights During Police Stops',
        image: 'https://images.unsplash.com/photo-1453873623425-04e3561289aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        readTime: '7 min read',
        summary: 'Police stops are common, but knowing your rights can help ensure these interactions proceed lawfully and safely.',
      },
      {
        id: '201',
        title: 'Police Search and Seizure',
        image: 'https://images.unsplash.com/photo-1422479516648-9b1f0b6e8da8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        readTime: '9 min read',
        summary: 'Understanding when police can legally search you or your property, and what to do if your rights are violated.',
      },
    ]
  },
  '3': {
    id: '3',
    title: 'Legal Procedures',
    icon: <Scale size={24} color={colors.accent} />,
    description: 'Understanding arrest, bail, and court processes.',
    color: colors.accent,
    articles: [
      {
        id: '301',
        title: 'The Bail Process Explained',
        image: 'https://images.unsplash.com/photo-1589578527966-fdac0f44566c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        readTime: '11 min read',
        summary: 'A comprehensive guide to understanding bail, how it works, and what to expect during the bail hearing.',
      },
      {
        id: '302',
        title: 'Your First Court Appearance',
        image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        readTime: '8 min read',
        summary: 'What to expect and how to prepare for your first appearance in court after being charged with an offense.',
      },
    ]
  },
  '4': {
    id: '4',
    title: 'Freedom of Assembly',
    icon: <Users size={24} color={colors.secondary} />,
    description: 'Your rights during protests and demonstrations.',
    color: colors.secondary,
    articles: [
      {
        id: '3',
        title: "Freedom of Assembly: A Citizen's Guide",
        image: 'https://images.unsplash.com/photo-1591189824344-9c3d8c0b1c8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        readTime: '10 min read',
        summary: 'The right to peaceful assembly is fundamental in a democratic society. This guide explains your rights when participating in protests.',
      },
      {
        id: '401',
        title: 'Organizing Legal Protests',
        image: 'https://images.unsplash.com/photo-1591189824344-9c3d8c0b1c8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        readTime: '14 min read',
        summary: 'A step-by-step guide to organizing legal protests, including permits, notifications, and best practices.',
      },
    ]
  },
  '5': {
    id: '5',
    title: 'Digital Rights',
    icon: <BookOpen size={24} color={colors.info} />,
    description: 'Privacy, free speech, and online security.',
    color: colors.info,
    articles: [
      {
        id: '501',
        title: 'Online Privacy Rights',
        image: 'https://images.unsplash.com/photo-1563237023-b1e970526dcb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        readTime: '9 min read',
        summary: 'Understanding your digital privacy rights and how to protect your personal information online.',
      },
      {
        id: '502',
        title: 'Freedom of Expression Online',
        image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        readTime: '7 min read',
        summary: 'The limits and protections of free speech in digital spaces, including social media platforms.',
      },
    ]
  },
};

export default function CategoryDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  
  const category = categoriesData[id as string];
  
  if (!category) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Category not found</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color={colors.primary} />
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  const filteredArticles = category.articles.filter(article => 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: category.title,
          headerTintColor: category.color,
        }} 
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={[styles.categoryIcon, { backgroundColor: `${category.color}20` }]}>
            {category.icon}
          </View>
          <Text style={styles.title}>{category.title}</Text>
          <Text style={styles.description}>{category.description}</Text>
          
          <Input
            placeholder="Search articles..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon={<Search size={20} color={colors.text} />}
            containerStyle={styles.searchInput}
          />
        </View>
        
        <View style={styles.articlesSection}>
          <Text style={styles.sectionTitle}>
            {filteredArticles.length} Articles
          </Text>
          
          {filteredArticles.map(article => (
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
                <Text style={styles.articleSummary} numberOfLines={2}>
                  {article.summary}
                </Text>
                <View style={styles.articleFooter}>
                  <Text style={styles.articleReadTime}>{article.readTime}</Text>
                  <ChevronRight size={16} color={category.color} />
                </View>
              </View>
            </TouchableOpacity>
          ))}
          
          {filteredArticles.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No articles found matching "{searchQuery}"
              </Text>
              <TouchableOpacity 
                style={styles.clearSearchButton}
                onPress={() => setSearchQuery('')}
              >
                <Text style={styles.clearSearchText}>Clear Search</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        <Card style={styles.relatedCard}>
          <Text style={styles.relatedTitle}>Related Categories</Text>
          
          {Object.values(categoriesData)
            .filter(cat => cat.id !== category.id)
            .slice(0, 3)
            .map(cat => (
              <TouchableOpacity 
                key={cat.id}
                style={styles.relatedItem}
                onPress={() => router.push(`/rights/category/${cat.id}`)}
              >
                <View style={[styles.relatedIcon, { backgroundColor: `${cat.color}20` }]}>
                  {cat.icon}
                </View>
                <View style={styles.relatedTextContainer}>
                  <Text style={styles.relatedItemTitle}>{cat.title}</Text>
                  <Text style={styles.relatedItemCount}>
                    {cat.articles.length} articles
                  </Text>
                </View>
                <ChevronRight size={16} color={colors.text} />
              </TouchableOpacity>
            ))
          }
        </Card>
        
        <Card style={styles.helpCard}>
          <Text style={styles.helpTitle}>Need Legal Help?</Text>
          <Text style={styles.helpDescription}>
            If you're facing a situation related to {category.title.toLowerCase()}, our network of pro-bono lawyers can assist you.
          </Text>
          <TouchableOpacity 
            style={styles.helpButton}
            onPress={() => router.push('/rights/legal-aid')}
          >
            <Text style={styles.helpButtonText}>Find Legal Assistance</Text>
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
    alignItems: 'center',
  },
  categoryIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${colors.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: colors.text,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: colors.text,
    opacity: 0.7,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  searchInput: {
    marginBottom: 8,
  },
  articlesSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: colors.text,
  },
  articleCard: {
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
  articleImage: {
    width: '100%',
    height: 160,
    backgroundColor: colors.placeholder,
  },
  articleContent: {
    padding: 16,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: colors.text,
  },
  articleSummary: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
    marginBottom: 12,
    lineHeight: 20,
  },
  articleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  articleReadTime: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.7,
  },
  emptyState: {
    alignItems: 'center',
    padding: 24,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.text,
    opacity: 0.7,
    marginBottom: 16,
    textAlign: 'center',
  },
  clearSearchButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.lightPrimary || `${colors.primary}10`,
    borderRadius: 8,
  },
  clearSearchText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  relatedCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
  },
  relatedTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: colors.text,
  },
  relatedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  relatedIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  relatedTextContainer: {
    flex: 1,
  },
  relatedItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
    color: colors.text,
  },
  relatedItemCount: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.7,
  },
  helpCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: colors.text,
  },
  helpDescription: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
    marginBottom: 16,
    lineHeight: 20,
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: colors.lightPrimary || `${colors.primary}10`,
    borderRadius: 8,
  },
  helpButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginRight: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 24,
    color: colors.text,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.lightPrimary || `${colors.primary}10`,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    marginLeft: 8,
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