import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image,
  TextInput,
  Alert
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Filter,
  Star,
  ChevronRight,
  Scale,
  MessageSquare
} from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { colors } from '@/constants/Colors';

// Mock data for legal aid providers
const legalAidProvidersData = [
  {
    id: '1',
    name: 'Kituo Cha Sheria',
    image: 'https://images.unsplash.com/photo-1589391886645-d51941baf7fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviews: 124,
    specialties: ['Human Rights', 'Criminal Defense', 'Land Rights'],
    location: 'Nairobi, Kenya',
    distance: '2.3 km',
    phone: '+254 20 2451631',
    email: 'info@kituochasheria.or.ke',
    hours: 'Mon-Fri: 8:00 AM - 5:00 PM',
    description: 'Kituo Cha Sheria (Legal Advice Centre) is a national human rights organization that promotes the legal awareness of the public, addresses human rights violations, and offers legal aid to the poor and marginalized.',
  },
  {
    id: '2',
    name: 'Legal Resources Foundation',
    image: 'https://images.unsplash.com/photo-1575505586569-646b2ca898fc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    reviews: 98,
    specialties: ['Access to Justice', 'Women Rights', 'Child Protection'],
    location: 'Mombasa, Kenya',
    distance: '5.1 km',
    phone: '+254 41 2230282',
    email: 'info@lrf.co.ke',
    hours: 'Mon-Fri: 9:00 AM - 4:00 PM',
    description: 'Legal Resources Foundation Trust works to promote access to justice for all, particularly for vulnerable and marginalized groups through legal aid, education, and advocacy.',
  },
  {
    id: '3',
    name: 'Federation of Women Lawyers (FIDA)',
    image: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviews: 156,
    specialties: ['Women Rights', 'Family Law', 'Gender-Based Violence'],
    location: 'Kisumu, Kenya',
    distance: '3.7 km',
    phone: '+254 57 2023985',
    email: 'info@fidakenya.org',
    hours: 'Mon-Fri: 8:30 AM - 5:30 PM',
    description: 'FIDA Kenya is a non-profit, non-partisan membership organization committed to the creation of a society that is free from all forms of discrimination against women through legal aid, womens rights monitoring, and advocacy.',
  },
  {
    id: '4',
    name: 'International Justice Mission',
    image: 'https://images.unsplash.com/photo-1521791055366-0d553872125f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviews: 112,
    specialties: ['Human Trafficking', 'Child Protection', 'Police Abuse'],
    location: 'Nairobi, Kenya',
    distance: '4.2 km',
    phone: '+254 20 3751384',
    email: 'contact@ijm.org',
    hours: 'Mon-Fri: 9:00 AM - 5:00 PM',
    description: 'International Justice Mission is a global organization that protects people in poverty from violence by rescuing victims, bringing criminals to justice, restoring survivors to safety, and helping local law enforcement build a safe future.',
  },
];

export default function LegalAidScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  const allSpecialties = Array.from(
    new Set(
      legalAidProvidersData.flatMap(provider => provider.specialties)
    )
  ).sort();
  
  const filteredProviders = legalAidProvidersData.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         provider.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         provider.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSpecialties = selectedSpecialties.length === 0 || 
                              selectedSpecialties.some(s => provider.specialties.includes(s));
    
    return matchesSearch && matchesSpecialties;
  });
  
  const toggleSpecialty = (specialty: string) => {
    if (selectedSpecialties.includes(specialty)) {
      setSelectedSpecialties(selectedSpecialties.filter(s => s !== specialty));
    } else {
      setSelectedSpecialties([...selectedSpecialties, specialty]);
    }
  };
  
  const handleContactProvider = (provider: typeof legalAidProvidersData[0]) => {
    Alert.alert(
      "Contact Provider",
      `Would you like to contact ${provider.name}?`,
      [
        {
          text: "Call",
          onPress: () => console.log(`Calling ${provider.phone}`),
        },
        {
          text: "Email",
          onPress: () => console.log(`Emailing ${provider.email}`),
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
          title: 'Legal Aid',
        }} 
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Find Legal Assistance</Text>
          <Text style={styles.subtitle}>
            Connect with pro-bono lawyers and legal aid services near you
          </Text>
          
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Search size={20} color={colors.text} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by name, location, or specialty..."
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
              <Text style={styles.filtersTitle}>Filter by Specialty</Text>
              <View style={styles.specialtiesContainer}>
                {allSpecialties.map(specialty => (
                  <TouchableOpacity
                    key={specialty}
                    style={[
                      styles.specialtyChip,
                      selectedSpecialties.includes(specialty) && styles.specialtyChipSelected
                    ]}
                    onPress={() => toggleSpecialty(specialty)}
                  >
                    <Text 
                      style={[
                        styles.specialtyChipText,
                        selectedSpecialties.includes(specialty) && styles.specialtyChipTextSelected
                      ]}
                    >
                      {specialty}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>
        
        <View style={styles.providersSection}>
          <Text style={styles.sectionTitle}>
            {filteredProviders.length} Legal Aid Providers Available
          </Text>
          
          {filteredProviders.map(provider => (
            <Card key={provider.id} style={styles.providerCard}>
              <Image 
                source={{ uri: provider.image }} 
                style={styles.providerImage}
              />
              
              <View style={styles.providerContent}>
                <View style={styles.providerHeader}>
                  <Text style={styles.providerName}>{provider.name}</Text>
                  <View style={styles.ratingContainer}>
                    <Star size={16} color={colors.warning} fill={colors.warning} />
                    <Text style={styles.ratingText}>{provider.rating}</Text>
                    <Text style={styles.reviewsText}>({provider.reviews})</Text>
                  </View>
                </View>
                
                <View style={styles.specialtiesRow}>
                  {provider.specialties.slice(0, 3).map((specialty, index) => (
                    <View key={index} style={styles.specialtyTag}>
                      <Text style={styles.specialtyTagText}>{specialty}</Text>
                    </View>
                  ))}
                </View>
                
                <View style={styles.locationRow}>
                  <MapPin size={16} color={colors.text} style={styles.infoIcon} />
                  <Text style={styles.locationText}>{provider.location}</Text>
                  <Text style={styles.distanceText}>{provider.distance}</Text>
                </View>
                
                <View style={styles.contactRow}>
                  <View style={styles.contactItem}>
                    <Phone size={16} color={colors.text} style={styles.infoIcon} />
                    <Text style={styles.contactText}>{provider.phone}</Text>
                  </View>
                  <View style={styles.contactItem}>
                    <Clock size={16} color={colors.text} style={styles.infoIcon} />
                    <Text style={styles.contactText}>{provider.hours}</Text>
                  </View>
                </View>
                
                <Text style={styles.providerDescription} numberOfLines={3}>
                  {provider.description}
                </Text>
                
                <View style={styles.actionButtons}>
                  <Button 
                    title="Contact" 
                    onPress={() => handleContactProvider(provider)}
                    style={styles.contactButton}
                    icon={<Phone size={16} color="white" />}
                  />
                  <Button 
                    title="View Details" 
                    variant="outline"
                    onPress={() => router.push(`/rights/legal-aid/${provider.id}`)}
                    style={styles.detailsButton}
                  />
                </View>
              </View>
            </Card>
          ))}
        </View>
        
        <Card style={styles.consultationCard}>
          <View style={styles.consultationContent}>
            <MessageSquare size={32} color={colors.primary} />
            <View style={styles.consultationTextContainer}>
              <Text style={styles.consultationTitle}>Need Urgent Legal Advice?</Text>
              <Text style={styles.consultationDescription}>
                Get a free 15-minute consultation with a qualified lawyer
              </Text>
            </View>
          </View>
          <Button 
            title="Request Consultation" 
            onPress={() => router.push('/rights/legal-aid/consultation')}
            style={styles.consultationButton}
          />
        </Card>
        
        <Card style={styles.resourcesCard}>
          <Text style={styles.resourcesTitle}>Legal Resources</Text>
          
          <TouchableOpacity 
            style={styles.resourceItem}
            onPress={() => router.push('/rights/resources/documents')}
          >
            <Scale size={20} color={colors.primary} />
            <View style={styles.resourceTextContainer}>
              <Text style={styles.resourceItemTitle}>Legal Document Templates</Text>
              <Text style={styles.resourceItemDescription}>
                Access free templates for common legal documents
              </Text>
            </View>
            <ChevronRight size={16} color={colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.resourceItem}
            onPress={() => router.push('/rights/resources/faq')}
          >
            <MessageSquare size={20} color={colors.primary} />
            <View style={styles.resourceTextContainer}>
              <Text style={styles.resourceItemTitle}>Legal FAQ</Text>
              <Text style={styles.resourceItemDescription}>
                Answers to common legal questions
              </Text>
            </View>
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
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  specialtyChip: {
    backgroundColor: colors.lightPrimary || `${colors.primary}10`,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  specialtyChipSelected: {
    backgroundColor: colors.primary,
  },
  specialtyChipText: {
    fontSize: 14,
    color: colors.primary,
  },
  specialtyChipTextSelected: {
    color: 'white',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: colors.text,
  },
  providersSection: {
    padding: 16,
    paddingTop: 0,
  },
  providerCard: {
    marginBottom: 16,
    padding: 0,
    overflow: 'hidden',
  },
  providerImage: {
    width: '100%',
    height: 150,
    backgroundColor: colors.placeholder,
  },
  providerContent: {
    padding: 16,
  },
  providerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  providerName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 4,
  },
  reviewsText: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.7,
    marginLeft: 2,
  },
  specialtiesRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  specialtyTag: {
    backgroundColor: colors.lightPrimary || `${colors.primary}10`,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  specialtyTagText: {
    fontSize: 12,
    color: colors.primary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
    flex: 1,
  },
  distanceText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  contactRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    flex: 1,
  },
  infoIcon: {
    marginRight: 8,
  },
  contactText: {
    fontSize: 12,
    color: colors.text,
    flex: 1,
  },
  providerDescription: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  contactButton: {
    flex: 1,
    marginRight: 8,
  },
  detailsButton: {
    flex: 1,
    marginLeft: 8,
  },
  consultationCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
  },
  consultationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  consultationTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  consultationTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: colors.text,
  },
  consultationDescription: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
  },
  consultationButton: {
    width: '100%',
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
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  resourceTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  resourceItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
    color: colors.text,
  },
  resourceItemDescription: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
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