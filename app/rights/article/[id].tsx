import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  Share
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { 
  BookOpen, 
  Share2, 
  ThumbsUp, 
  Bookmark,
  Clock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { colors } from '@/constants/colors';

// Mock article data
const articlesData = {
  '1': {
    id: '1',
    title: "What to Do If You're Arrested",
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    readTime: '5 min read',
    author: 'Jane Doe',
    authorTitle: 'Human Rights Lawyer',
    date: '2023-05-15',
    content: [
      {
        type: 'paragraph',
        text: 'Being arrested can be a frightening experience, but knowing your rights can help protect you during this difficult time. This guide outlines what you should do if you are arrested in Kenya.',
      },
      {
        type: 'heading',
        text: 'Your Rights During Arrest',
      },
      {
        type: 'paragraph',
        text: 'Under the Kenyan Constitution, you have several rights when arrested:',
      },
      {
        type: 'list',
        items: [
          'The right to remain silent',
          'The right to be informed of the reason for your arrest',
          'The right to communicate with an advocate or other person whose assistance is necessary',
          'The right not to be compelled to make any confession or admission that could be used as evidence against you',
          'The right to be held separately from persons serving a sentence',
          'The right to be brought before a court as soon as reasonably possible, but not later than 24 hours after arrest',
        ],
      },
      {
        type: 'heading',
        text: 'What to Say and Do',
      },
      {
        type: 'paragraph',
        text: 'When arrested, remain calm and follow these steps:',
      },
      {
        type: 'list',
        items: [
          'Identify yourself when asked, but remember you have the right to remain silent beyond that',
          'Ask why you are being arrested',
          'State clearly: "I wish to remain silent and I want to speak with a lawyer"',
          'Do not resist arrest, even if you believe it is unlawful',
          'Do not consent to searches, but do not physically resist',
          'Do not sign any documents without legal advice',
        ],
      },
      {
        type: 'heading',
        text: 'After the Arrest',
      },
      {
        type: 'paragraph',
        text: 'Once at the police station:',
      },
      {
        type: 'list',
        items: [
          'You should be allowed to make a phone call to your lawyer or family',
          'You should be informed of the charges against you',
          'You should be brought before a court within 24 hours',
          'You have the right to apply for bail or bond',
        ],
      },
      {
        type: 'paragraph',
        text: 'Remember, the police must treat you with dignity and respect your human rights throughout the process. Any violation of these rights should be reported to the Independent Policing Oversight Authority (IPOA) or the Kenya National Commission on Human Rights (KNCHR).',
      },
    ],
    relatedArticles: ['2', '3'],
  },
  '2': {
    id: '2',
    title: 'Your Rights During Police Stops',
    image: 'https://images.unsplash.com/photo-1453873623425-04e3561289aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    readTime: '7 min read',
    author: 'John Smith',
    authorTitle: 'Constitutional Law Expert',
    date: '2023-04-22',
    content: [
      {
        type: 'paragraph',
        text: 'Police stops are common, but knowing your rights can help ensure these interactions proceed lawfully and safely.',
      },
      // More content would be here
    ],
    relatedArticles: ['1', '3'],
  },
  '3': {
    id: '3',
    title: "Freedom of Assembly: A Citizen's Guide",
    image: 'https://images.unsplash.com/photo-1591189824344-9c3d8c0b1c8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    readTime: '10 min read',
    author: 'Robert Johnson',
    authorTitle: 'Civil Rights Activist',
    date: '2023-03-10',
    content: [
      {
        type: 'paragraph',
        text: 'The right to peaceful assembly is fundamental in a democratic society. This guide explains your rights when participating in protests and demonstrations.',
      },
      // More content would be here
    ],
    relatedArticles: ['1', '2'],
  },
};

export default function ArticleDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  const article = articlesData[id as string];
  
  if (!article) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Article not found</Text>
        <Button 
          title="Go Back" 
          onPress={() => router.back()}
          style={styles.errorButton}
        />
      </View>
    );
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this article: ${article.title} - View on Haki App`,
        url: `https://haki.app/rights/article/${article.id}`,
      });
    } catch (error) {
      console.error('Error sharing article:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const renderContent = (content: any[]) => {
    return content.map((item, index) => {
      switch (item.type) {
        case 'paragraph':
          return (
            <Text key={index} style={styles.paragraph}>
              {item.text}
            </Text>
          );
        case 'heading':
          return (
            <Text key={index} style={styles.heading}>
              {item.text}
            </Text>
          );
        case 'list':
          return (
            <View key={index} style={styles.list}>
              {item.items.map((listItem: string, listIndex: number) => (
                <View key={listIndex} style={styles.listItem}>
                  <View style={styles.bullet} />
                  <Text style={styles.listItemText}>{listItem}</Text>
                </View>
              ))}
            </View>
          );
        default:
          return null;
      }
    });
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: '',
          headerTransparent: true,
          headerTintColor: 'white',
          headerBackTitle: '',
        }} 
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: article.image }} 
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.overlay} />
        </View>
        
        <View style={styles.content}>
          <View style={styles.metaInfo}>
            <View style={styles.readTime}>
              <Clock size={14} color={colors.text} />
              <Text style={styles.readTimeText}>{article.readTime}</Text>
            </View>
            <Text style={styles.date}>{formatDate(article.date)}</Text>
          </View>
          
          <Text style={styles.title}>{article.title}</Text>
          
          <View style={styles.authorContainer}>
            <View style={styles.authorInfo}>
              <View style={styles.authorAvatar}>
                <Text style={styles.authorInitials}>
                  {article.author.split(' ').map(n => n[0]).join('')}
                </Text>
              </View>
              <View>
                <Text style={styles.authorName}>{article.author}</Text>
                <Text style={styles.authorTitle}>{article.authorTitle}</Text>
              </View>
            </View>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => setIsLiked(!isLiked)}
              >
                <ThumbsUp 
                  size={20} 
                  color={isLiked ? colors.primary : colors.text} 
                  fill={isLiked ? colors.primary : 'transparent'}
                />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => setIsBookmarked(!isBookmarked)}
              >
                <Bookmark 
                  size={20} 
                  color={isBookmarked ? colors.primary : colors.text}
                  fill={isBookmarked ? colors.primary : 'transparent'}
                />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={handleShare}
              >
                <Share2 size={20} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.articleContent}>
            {renderContent(article.content)}
          </View>
          
          <View style={styles.relatedArticlesSection}>
            <Text style={styles.relatedTitle}>Related Articles</Text>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.relatedScroll}
            >
              {article.relatedArticles.map((relatedId) => {
                const relatedArticle = articlesData[relatedId];
                return (
                  <TouchableOpacity 
                    key={relatedId}
                    style={styles.relatedCard}
                    onPress={() => router.push(`/rights/article/${relatedId}`)}
                  >
                    <Image 
                      source={{ uri: relatedArticle.image }} 
                      style={styles.relatedImage}
                    />
                    <View style={styles.relatedContent}>
                      <Text style={styles.relatedArticleTitle} numberOfLines={2}>
                        {relatedArticle.title}
                      </Text>
                      <Text style={styles.relatedReadTime}>
                        {relatedArticle.readTime}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
          
          <Card style={styles.helpCard}>
            <Text style={styles.helpTitle}>Need Legal Help?</Text>
            <Text style={styles.helpDescription}>
              If you're facing a situation related to this article, our network of pro-bono lawyers can assist you.
            </Text>
            <Button 
              title="Get Legal Assistance" 
              onPress={() => router.push('/rights/legal-aid')}
              style={styles.helpButton}
            />
          </Card>
          
          <View style={styles.navigationButtons}>
            {article.id !== '1' && (
              <TouchableOpacity 
                style={styles.navButton}
                onPress={() => router.push(`/rights/article/${parseInt(article.id) - 1}`)}
              >
                <ChevronLeft size={16} color={colors.primary} />
                <Text style={styles.navButtonText}>Previous</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={[styles.navButton, styles.navButtonRight]}
              onPress={() => router.push('/rights')}
            >
              <Text style={styles.navButtonText}>All Articles</Text>
            </TouchableOpacity>
            
            {article.id !== '3' && (
              <TouchableOpacity 
                style={styles.navButton}
                onPress={() => router.push(`/rights/article/${parseInt(article.id) + 1}`)}
              >
                <Text style={styles.navButtonText}>Next</Text>
                <ChevronRight size={16} color={colors.primary} />
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.poweredByContainer}>
            <Text style={styles.poweredByText}>Powered by</Text>
            <Text style={styles.hakihackText}>hakihack</Text>
          </View>
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
  imageContainer: {
    position: 'relative',
    height: 250,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  content: {
    padding: 16,
    marginTop: -40,
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  readTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readTimeText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 6,
  },
  date: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: colors.text,
  },
  authorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  authorInitials: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  authorTitle: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.lightPrimary || `${colors.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  articleContent: {
    marginBottom: 24,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
    marginBottom: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 24,
    marginBottom: 16,
  },
  list: {
    marginBottom: 16,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 8,
    marginRight: 12,
  },
  listItemText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
  },
  relatedArticlesSection: {
    marginBottom: 24,
  },
  relatedTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: colors.text,
  },
  relatedScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  relatedCard: {
    width: 200,
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  relatedImage: {
    width: '100%',
    height: 100,
    backgroundColor: colors.placeholder,
  },
  relatedContent: {
    padding: 12,
  },
  relatedArticleTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: colors.text,
  },
  relatedReadTime: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.7,
  },
  helpCard: {
    marginBottom: 24,
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: colors.text,
  },
  helpDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
    marginBottom: 16,
  },
  helpButton: {
    alignSelf: 'flex-start',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  navButtonRight: {
    backgroundColor: colors.lightPrimary || `${colors.primary}10`,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  navButtonText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    marginHorizontal: 4,
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
    marginBottom: 16,
    color: colors.text,
  },
  errorButton: {
    minWidth: 120,
  },
  poweredByContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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