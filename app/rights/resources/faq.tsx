import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  MessageSquare,
  ChevronRight
} from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { colors } from '@/constants/colors';

// Mock data for FAQ categories and questions
const faqData = [
  {
    id: '1',
    category: 'Arrest and Detention',
    questions: [
      {
        id: '101',
        question: "What should I do if I'm arrested?",
        answer: "If you're arrested, remain calm and remember these key points: 1) You have the right to remain silent. 2) Ask why you're being arrested. 3) State clearly that you wish to speak with a lawyer. 4) Do not resist arrest, even if you believe it's unlawful. 5) Do not consent to searches, but don't physically resist. 6) Do not sign any documents without legal advice.",
      },
      {
        id: '102',
        question: "How long can the police hold me without charges?",
        answer: "Under Kenyan law, you must be brought before a court as soon as reasonably possible, but not later than 24 hours after arrest. For serious offenses like terrorism, this period may be extended, but only with court approval.",
      },
      {
        id: '103',
        question: "Do I have to answer police questions?",
        answer: "No. You have the constitutional right to remain silent. You only need to provide your name and address. For any other questions, you can politely state that you wish to speak with a lawyer before answering questions.",
      },
      {
        id: '104',
        question: "Can I make a phone call after being arrested?",
        answer: "Yes. You have the right to communicate with an advocate or another person whose assistance is necessary. The police should allow you to make a phone call to your lawyer, family member, or friend.",
      },
    ]
  },
  {
    id: '2',
    category: 'Police Encounters',
    questions: [
      {
        id: '201',
        question: "Can police search me without a warrant?",
        answer: "Police can conduct a search without a warrant in certain circumstances: 1) If you give consent. 2) During a lawful arrest. 3) If they have reasonable suspicion that you possess illegal items. 4) In emergency situations where evidence might be destroyed. However, they must have reasonable grounds for the search.",
      },
      {
        id: '202',
        question: "What should I do during a traffic stop?",
        answer: "During a traffic stop: 1) Pull over safely. 2) Keep your hands visible on the steering wheel. 3) Be polite but remember your rights. 4) Provide your license, registration, and insurance when asked. 5) You can refuse searches of your vehicle, though police may still have legal grounds to search. 6) If asked to exit the vehicle, comply but state clearly if you do not consent to searches.",
      },
    ]
  },
  {
    id: '3',
    category: 'Court Procedures',
    questions: [
      {
        id: '301',
        question: "What is bail and how does it work?",
        answer: "Bail is a temporary release from custody until your court hearing, usually with payment of a sum of money as guarantee. After arrest and being charged, you can apply for bail at your first court appearance. The court considers factors like the seriousness of the offense, flight risk, and community ties when deciding whether to grant bail and the amount.",
      },
      {
        id: '302',
        question: "What happens at my first court appearance?",
        answer: "At your first court appearance (arraignment): 1) The charges against you will be read. 2) You'll be asked to enter a plea (guilty or not guilty). 3) Bail may be discussed and set. 4) The court may assign a public defender if you cannot afford a lawyer. 5) Future court dates will be scheduled. It's usually brief and procedural.",
      },
    ]
  },
  {
    id: '4',
    category: 'Rights During Protests',
    questions: [
      {
        id: '401',
        question: "Do I need permission to organize a protest?",
        answer: "Under Kenyan law, you have the right to peaceful assembly, but for public demonstrations, you should notify the local police at least 3 days in advance. This is not asking for permission, but notification. The police can only prevent the demonstration if there's another demonstration planned for the same time and place, or if there's a clear security threat.",
      },
      {
        id: '402',
        question: "What should I do if police use excessive force during a protest?",
        answer: "If police use excessive force: 1) Try to move to safety. 2) Document the incident if possible (photos, video, officer names/numbers). 3) Get medical attention and keep records. 4) Collect witness information. 5) Report the incident to the Independent Policing Oversight Authority (IPOA) or Kenya National Commission on Human Rights (KNCHR). 6) Consider consulting a lawyer about legal action.",
      },
    ]
  },
];

export default function LegalFAQScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [expandedQuestions, setExpandedQuestions] = useState<string[]>([]);
  
  // Toggle category expansion
  const toggleCategory = (categoryId: string) => {
    if (expandedCategories.includes(categoryId)) {
      setExpandedCategories(expandedCategories.filter(id => id !== categoryId));
    } else {
      setExpandedCategories([...expandedCategories, categoryId]);
    }
  };
  
  // Toggle question expansion
  const toggleQuestion = (questionId: string) => {
    if (expandedQuestions.includes(questionId)) {
      setExpandedQuestions(expandedQuestions.filter(id => id !== questionId));
    } else {
      setExpandedQuestions([...expandedQuestions, questionId]);
    }
  };
  
  // Filter FAQ data based on search query
  const filteredFAQ = searchQuery.trim() === '' 
    ? faqData 
    : faqData.map(category => {
        const filteredQuestions = category.questions.filter(q => 
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        return {
          ...category,
          questions: filteredQuestions
        };
      }).filter(category => category.questions.length > 0);
  
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Legal FAQ',
        }} 
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Frequently Asked Questions</Text>
          <Text style={styles.subtitle}>
            Find answers to common legal questions and concerns
          </Text>
          
          <View style={styles.searchInputContainer}>
            <Search size={20} color={colors.text} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search questions..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={colors.placeholder}
            />
          </View>
        </View>
        
        <View style={styles.faqSection}>
          {filteredFAQ.length > 0 ? (
            filteredFAQ.map(category => (
              <View key={category.id} style={styles.categoryContainer}>
                <TouchableOpacity 
                  style={styles.categoryHeader}
                  onPress={() => toggleCategory(category.id)}
                >
                  <Text style={styles.categoryTitle}>{category.category}</Text>
                  {expandedCategories.includes(category.id) ? (
                    <ChevronUp size={20} color={colors.text} />
                  ) : (
                    <ChevronDown size={20} color={colors.text} />
                  )}
                </TouchableOpacity>
                
                {expandedCategories.includes(category.id) && (
                  <View style={styles.questionsContainer}>
                    {category.questions.map(question => (
                      <Card key={question.id} style={styles.questionCard}>
                        <TouchableOpacity 
                          style={styles.questionHeader}
                          onPress={() => toggleQuestion(question.id)}
                        >
                          <Text style={styles.questionText}>{question.question}</Text>
                          {expandedQuestions.includes(question.id) ? (
                            <ChevronUp size={16} color={colors.text} />
                          ) : (
                            <ChevronDown size={16} color={colors.text} />
                          )}
                        </TouchableOpacity>
                        
                        {expandedQuestions.includes(question.id) && (
                          <Text style={styles.answerText}>{question.answer}</Text>
                        )}
                      </Card>
                    ))}
                  </View>
                )}
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No questions found matching "{searchQuery}"
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
        
        <Card style={styles.askQuestionCard}>
          <View style={styles.askQuestionContent}>
            <MessageSquare size={32} color={colors.primary} />
            <View style={styles.askQuestionTextContainer}>
              <Text style={styles.askQuestionTitle}>Can't Find Your Answer?</Text>
              <Text style={styles.askQuestionDescription}>
                Submit your question and our legal experts will respond within 24 hours
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.askQuestionButton}
            onPress={() => router.push('/rights/resources/ask-question')}
          >
            <Text style={styles.askQuestionButtonText}>Ask a Question</Text>
            <ChevronRight size={16} color={colors.primary} />
          </TouchableOpacity>
        </Card>
        
        <Card style={styles.resourcesCard}>
          <Text style={styles.resourcesTitle}>Related Resources</Text>
          
          <TouchableOpacity 
            style={styles.resourceItem}
            onPress={() => router.push('/rights/resources/documents')}
          >
            <Text style={styles.resourceItemTitle}>Legal Document Templates</Text>
            <ChevronRight size={16} color={colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.resourceItem}
            onPress={() => router.push('/rights/legal-aid')}
          >
            <Text style={styles.resourceItemTitle}>Find Legal Assistance</Text>
            <ChevronRight size={16} color={colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.resourceItem}
            onPress={() => router.push('/rights')}
          >
            <Text style={styles.resourceItemTitle}>Know Your Rights Articles</Text>
            <ChevronRight size={16} color={colors.text} />
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
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 8,
  },
  faqSection: {
    padding: 16,
    paddingTop: 0,
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  questionsContainer: {
    marginTop: 8,
  },
  questionCard: {
    marginBottom: 8,
    padding: 16,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  answerText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
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
  askQuestionCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
  },
  askQuestionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  askQuestionTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  askQuestionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: colors.text,
  },
  askQuestionDescription: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
  },
  askQuestionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: colors.lightPrimary || `${colors.primary}10`,
    borderRadius: 8,
  },
  askQuestionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginRight: 8,
  },
  resourcesCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
  },
  resourcesTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: colors.text,
  },
  resourceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  resourceItemTitle: {
    fontSize: 16,
    color: colors.text,
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