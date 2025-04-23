import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { 
  Search, 
  FileText, 
  Download, 
  Filter,
  ChevronRight,
  Eye,
  Share2
} from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { colors } from '@/constants/colors';

// Mock data for legal documents
const documentsData = [
  {
    id: '1',
    title: 'Affidavit Template',
    category: 'Court Documents',
    description: 'A general affidavit template for making sworn statements in legal proceedings.',
    downloads: 1245,
    lastUpdated: '2023-08-15',
    fileSize: '42 KB',
    fileType: 'DOCX',
  },
  {
    id: '2',
    title: 'Police Complaint Form',
    category: 'Law Enforcement',
    description: 'Standard form for filing complaints against police misconduct or abuse of power.',
    downloads: 3782,
    lastUpdated: '2023-09-22',
    fileSize: '38 KB',
    fileType: 'PDF',
  },
  {
    id: '3',
    title: 'Bail Application',
    category: 'Court Documents',
    description: 'Template for applying for bail in criminal proceedings.',
    downloads: 2156,
    lastUpdated: '2023-07-10',
    fileSize: '56 KB',
    fileType: 'DOCX',
  },
  {
    id: '4',
    title: 'Habeas Corpus Petition',
    category: 'Court Documents',
    description: 'Legal document to report an unlawful detention or imprisonment to a court.',
    downloads: 987,
    lastUpdated: '2023-06-30',
    fileSize: '64 KB',
    fileType: 'PDF',
  },
  {
    id: '5',
    title: 'Power of Attorney',
    category: 'Personal Documents',
    description: 'Legal document giving one person the authority to act for another person.',
    downloads: 4521,
    lastUpdated: '2023-08-05',
    fileSize: '48 KB',
    fileType: 'DOCX',
  },
  {
    id: '6',
    title: 'Witness Statement Form',
    category: 'Law Enforcement',
    description: 'Template for recording witness statements in criminal investigations.',
    downloads: 1876,
    lastUpdated: '2023-09-12',
    fileSize: '35 KB',
    fileType: 'PDF',
  },
  {
    id: '7',
    title: 'Constitutional Rights Violation Complaint',
    category: 'Human Rights',
    description: 'Form for reporting violations of constitutional rights to relevant authorities.',
    downloads: 2345,
    lastUpdated: '2023-07-28',
    fileSize: '52 KB',
    fileType: 'DOCX',
  },
];

// Get unique categories from documents
const categories = Array.from(new Set(documentsData.map(doc => doc.category))).sort();

export default function LegalDocumentsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const filteredDocuments = documentsData.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === '' || doc.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  const handleDownload = (document: typeof documentsData[0]) => {
    Alert.alert(
      "Download Document",
      `Would you like to download "${document.title}" (${document.fileSize})?`,
      [
        {
          text: "Download",
          onPress: () => {
            // Download functionality would go here
            Alert.alert("Success", "Document downloaded successfully");
          },
        },
        {
          text: "Cancel",
          style: "cancel"
        }
      ]
    );
  };
  
  const handleShare = (document: typeof documentsData[0]) => {
    Alert.alert(
      "Share Document",
      `Share "${document.title}" with others`,
      [
        {
          text: "Share",
          onPress: () => {
            // Share functionality would go here
            Alert.alert("Success", "Document shared successfully");
          },
        },
        {
          text: "Cancel",
          style: "cancel"
        }
      ]
    );
  };
  
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Legal Documents',
        }} 
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Legal Document Templates</Text>
          <Text style={styles.subtitle}>
            Access free templates for common legal documents and forms
          </Text>
          
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Search size={20} color={colors.text} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search documents..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor={colors.placeholder}
              />
            </View>
            
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => setShowFilters(!showFilters)}
            >
              <Filter size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          {showFilters && (
            <View style={styles.filtersContainer}>
              <Text style={styles.filtersTitle}>Filter by Category</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.categoriesScroll}
              >
                <TouchableOpacity
                  style={[
                    styles.categoryChip,
                    selectedCategory === '' && styles.categoryChipSelected
                  ]}
                  onPress={() => setSelectedCategory('')}
                >
                  <Text 
                    style={[
                      styles.categoryChipText,
                      selectedCategory === '' && styles.categoryChipTextSelected
                    ]}
                  >
                    All
                  </Text>
                </TouchableOpacity>
                
                {categories.map(category => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryChip,
                      selectedCategory === category && styles.categoryChipSelected
                    ]}
                    onPress={() => setSelectedCategory(category)}
                  >
                    <Text 
                      style={[
                        styles.categoryChipText,
                        selectedCategory === category && styles.categoryChipTextSelected
                      ]}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
        
        <View style={styles.documentsSection}>
          <Text style={styles.sectionTitle}>
            {filteredDocuments.length} Documents Available
          </Text>
          
          {filteredDocuments.map(document => (
            <Card key={document.id} style={styles.documentCard}>
              <View style={styles.documentHeader}>
                <View style={styles.fileIconContainer}>
                  <FileText size={24} color={colors.primary} />
                  <Text style={styles.fileType}>{document.fileType}</Text>
                </View>
                
                <View style={styles.documentInfo}>
                  <Text style={styles.documentTitle}>{document.title}</Text>
                  <View style={styles.categoryTag}>
                    <Text style={styles.categoryTagText}>{document.category}</Text>
                  </View>
                </View>
              </View>
              
              <Text style={styles.documentDescription}>
                {document.description}
              </Text>
              
              <View style={styles.documentMeta}>
                <Text style={styles.documentMetaText}>
                  {document.downloads.toLocaleString()} downloads • Last updated: {document.lastUpdated} • {document.fileSize}
                </Text>
              </View>
              
              <View style={styles.documentActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => router.push(`/rights/resources/documents/${document.id}`)}
                >
                  <Eye size={16} color={colors.text} />
                  <Text style={styles.actionButtonText}>Preview</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleShare(document)}
                >
                  <Share2 size={16} color={colors.text} />
                  <Text style={styles.actionButtonText}>Share</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionButton, styles.downloadButton]}
                  onPress={() => handleDownload(document)}
                >
                  <Download size={16} color="white" />
                  <Text style={styles.downloadButtonText}>Download</Text>
                </TouchableOpacity>
              </View>
            </Card>
          ))}
          
          {filteredDocuments.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No documents found matching your search
              </Text>
              <TouchableOpacity 
                style={styles.clearSearchButton}
                onPress={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                }}
              >
                <Text style={styles.clearSearchText}>Clear Filters</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        <Card style={styles.requestCard}>
          <Text style={styles.requestTitle}>Need a Specific Document?</Text>
          <Text style={styles.requestDescription}>
            If you can't find the document template you need, you can request it from our legal team.
          </Text>
          <TouchableOpacity 
            style={styles.requestButton}
            onPress={() => router.push('/rights/resources/request')}
          >
            <Text style={styles.requestButtonText}>Request Document</Text>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
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
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: colors.lightPrimary || `${colors.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  filtersContainer: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: colors.text,
  },
  categoriesScroll: {
    marginHorizontal: -8,
  },
  categoryChip: {
    backgroundColor: colors.lightPrimary || `${colors.primary}10`,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 4,
  },
  categoryChipSelected: {
    backgroundColor: colors.primary,
  },
  categoryChipText: {
    fontSize: 14,
    color: colors.primary,
  },
  categoryChipTextSelected: {
    color: 'white',
  },
  documentsSection: {
    padding: 16,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: colors.text,
  },
  documentCard: {
    marginBottom: 16,
    padding: 16,
  },
  documentHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  fileIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: colors.lightPrimary || `${colors.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  fileType: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 2,
  },
  documentInfo: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: colors.text,
  },
  categoryTag: {
    backgroundColor: colors.lightPrimary || `${colors.primary}10`,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  categoryTagText: {
    fontSize: 12,
    color: colors.primary,
  },
  documentDescription: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  documentMeta: {
    marginBottom: 16,
  },
  documentMetaText: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.7,
  },
  documentActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.lightPrimary || `${colors.primary}10`,
  },
  actionButtonText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 6,
  },
  downloadButton: {
    backgroundColor: colors.primary,
  },
  downloadButtonText: {
    fontSize: 14,
    color: 'white',
    marginLeft: 6,
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
  requestCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
  },
  requestTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: colors.text,
  },
  requestDescription: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
    marginBottom: 16,
    lineHeight: 20,
  },
  requestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: colors.lightPrimary || `${colors.primary}10`,
    borderRadius: 8,
  },
  requestButtonText: {
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