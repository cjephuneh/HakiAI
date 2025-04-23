import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  Alert,
  TextInput
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { 
  Calendar, 
  Users, 
  Heart, 
  Share2, 
  Flag,
  DollarSign,
  Clock,
  User,
  ChevronDown,
  ChevronUp,
  MessageCircle
} from 'lucide-react-native';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useFundraiserStore } from '@/store/fundraiser-store';
import { useAuthStore } from '@/store/auth-store';
import { colors } from '@/constants/colors';

export default function FundraiserDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { fundraisers, contributeToCampaign, updateFundraiserStatus, isLoading } = useFundraiserStore();
  const { user, isAuthenticated } = useAuthStore();
  const [fundraiser, setFundraiser] = useState(fundraisers.find(item => item.id === id));
  const [donationAmount, setDonationAmount] = useState('');
  const [showDonationOptions, setShowDonationOptions] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [updates, setUpdates] = useState([
    {
      id: '1',
      text: "Thank you for your support! We've reached 50% of our goal in just 3 days!",
      date: new Date(Date.now() - 86400000 * 3).toISOString(),
      author: "Campaign Organizer",
    },
    {
      id: '2',
      text: "We've secured a lawyer for the detained students. Your contributions are making a real difference!",
      date: new Date(Date.now() - 86400000 * 1).toISOString(),
      author: "Campaign Organizer",
    },
  ]);
  const [donors, setDonors] = useState([
    { id: '1', name: "Jane Doe", amount: 5000, date: new Date(Date.now() - 86400000 * 4).toISOString() },
    { id: '2', name: "John Smith", amount: 2500, date: new Date(Date.now() - 86400000 * 3).toISOString() },
    { id: '3', name: "Anonymous", amount: 10000, date: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: '4', name: "Mary Johnson", amount: 1000, date: new Date(Date.now() - 86400000 * 1).toISOString() },
    { id: '5', name: "Robert Brown", amount: 3000, date: new Date(Date.now() - 3600000 * 5).toISOString() },
  ]);

  useEffect(() => {
    const foundFundraiser = fundraisers.find(item => item.id === id);
    if (foundFundraiser) {
      setFundraiser(foundFundraiser);
    } else {
      // Fundraiser not found, go back
      Alert.alert('Error', 'Fundraiser not found');
      router.back();
    }
  }, [id, fundraisers]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const formatCurrency = (amount: number) => {
    return `KSh ${amount.toLocaleString()}`;
  };

  const calculateProgress = () => {
    return fundraiser ? fundraiser.raisedAmount / fundraiser.targetAmount : 0;
  };

  const getDaysLeft = () => {
    if (!fundraiser) return '';
    
    const deadline = new Date(fundraiser.deadline);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Ended';
    if (diffDays === 0) return 'Last day';
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} left`;
  };

  const handleDonate = async () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Authentication Required',
        'Please sign in to donate to this fundraiser',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => router.push('/auth/login') }
        ]
      );
      return;
    }

    const amount = parseInt(donationAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid donation amount');
      return;
    }

    Alert.alert(
      'Confirm Donation',
      `Are you sure you want to donate ${formatCurrency(amount)} to this fundraiser?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Donate', 
          onPress: async () => {
            try {
              await contributeToCampaign(fundraiser!.id, amount);
              
              // Add donor to the list
              const newDonor = {
                id: Date.now().toString(),
                name: user?.name || 'Anonymous',
                amount,
                date: new Date().toISOString(),
              };
              setDonors([newDonor, ...donors]);
              
              setDonationAmount('');
              setShowDonationOptions(false);
              
              Alert.alert('Thank You!', 'Your donation has been processed successfully.');
            } catch (error) {
              Alert.alert('Error', 'Failed to process donation. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Support this fundraiser: ${fundraiser?.title} - View on Haki App`,
        url: `https://haki.app/fundraisers/${fundraiser?.id}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share. Please try again.');
    }
  };

  const handleReport = () => {
    Alert.alert(
      'Report Fundraiser',
      'Why are you reporting this fundraiser?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Suspicious Activity', onPress: () => reportFundraiser('suspicious') },
        { text: 'Inappropriate Content', onPress: () => reportFundraiser('inappropriate') },
        { text: 'Misleading Information', onPress: () => reportFundraiser('misleading') },
      ]
    );
  };

  const reportFundraiser = (reason: string) => {
    Alert.alert(
      'Thank You',
      'Your report has been submitted and will be reviewed by our team.',
      [{ text: 'OK' }]
    );
  };

  const handleUpdateStatus = (status: string) => {
    Alert.alert(
      'Update Status',
      `Are you sure you want to mark this fundraiser as "${status}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Update', 
          onPress: async () => {
            try {
              await updateFundraiserStatus(fundraiser!.id, status as any);
              Alert.alert('Success', 'Fundraiser status updated successfully.');
            } catch (error) {
              Alert.alert('Error', 'Failed to update status. Please try again.');
            }
          }
        }
      ]
    );
  };

  const predefinedAmounts = [500, 1000, 2000, 5000, 10000];

  if (!fundraiser) {
    return null;
  }

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Fundraiser Details',
          headerBackTitle: 'Back',
        }} 
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Image 
          source={{ uri: fundraiser.imageUrl }} 
          style={styles.image}
          resizeMode="cover"
        />
        
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{fundraiser.title}</Text>
            <StatusBadge status={fundraiser.status} size="large" />
          </View>
          
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryText}>
              {fundraiser.category.charAt(0).toUpperCase() + fundraiser.category.slice(1)}
            </Text>
          </View>
          
          <View style={styles.progressSection}>
            <ProgressBar 
              progress={calculateProgress()} 
              height={8}
              showPercentage
            />
            
            <View style={styles.amountContainer}>
              <Text style={styles.raisedAmount}>
                {formatCurrency(fundraiser.raisedAmount)}
              </Text>
              <Text style={styles.targetAmount}>
                raised of {formatCurrency(fundraiser.targetAmount)} goal
              </Text>
            </View>
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Users size={16} color={colors.text} />
                <Text style={styles.statText}>
                  {donors.length} donors
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <Clock size={16} color={colors.text} />
                <Text style={styles.statText}>
                  {getDaysLeft()}
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.actionButtons}>
            <Button 
              title="Donate Now" 
              onPress={() => setShowDonationOptions(true)}
              style={styles.donateButton}
              disabled={fundraiser.status !== 'active'}
            />
            
            <TouchableOpacity 
              style={styles.shareButton}
              onPress={handleShare}
            >
              <Share2 size={20} color={colors.text} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.reportButton}
              onPress={handleReport}
            >
              <Flag size={20} color={colors.danger} />
            </TouchableOpacity>
          </View>
          
          {showDonationOptions && (
            <Card style={styles.donationCard}>
              <Text style={styles.donationTitle}>Make a Donation</Text>
              
              <View style={styles.amountOptions}>
                {predefinedAmounts.map((amount) => (
                  <TouchableOpacity
                    key={amount}
                    style={[
                      styles.amountOption,
                      donationAmount === amount.toString() && styles.selectedAmount
                    ]}
                    onPress={() => setDonationAmount(amount.toString())}
                  >
                    <Text 
                      style={[
                        styles.amountOptionText,
                        donationAmount === amount.toString() && styles.selectedAmountText
                      ]}
                    >
                      {formatCurrency(amount)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <View style={styles.customAmountContainer}>
                <Text style={styles.customAmountLabel}>Or enter custom amount:</Text>
                <View style={styles.customAmountInput}>
                  <Text style={styles.currencySymbol}>KSh</Text>
                  <TextInput
                    style={styles.amountInput}
                    value={donationAmount}
                onChangeText={(text) => setDonationAmount(text.replace(/[^0-9]/g, ''))}
                    keyboardType="numeric"
                    placeholder="Enter amount"
                    placeholderTextColor={colors.placeholder}
                  />
                </View>
              </View>
              
              <View style={styles.donationButtons}>
                <Button
                  title="Cancel"
                  variant="outline"
                  onPress={() => {
                    setShowDonationOptions(false);
                    setDonationAmount('');
                  }}
                  style={styles.donationButton}
                />
                
                <Button
                  title="Donate"
                  onPress={handleDonate}
                  loading={isLoading}
                  style={styles.donationButton}
                  disabled={!donationAmount || isNaN(parseInt(donationAmount)) || parseInt(donationAmount) <= 0}
                />
              </View>
            </Card>
          )}
          
          <View style={styles.organizerSection}>
            <Text style={styles.sectionTitle}>Organizer</Text>
            
            <Card style={styles.organizerCard}>
              <View style={styles.organizerInfo}>
                <Avatar size="medium" name="John Doe" />
                <View style={styles.organizerDetails}>
                  <Text style={styles.organizerName}>John Doe</Text>
                  <Text style={styles.organizerSubtitle}>Campaign Organizer</Text>
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.contactButton}
                onPress={() => {
                  // Contact organizer functionality
                }}
              >
                <MessageCircle size={16} color={colors.secondary} />
                <Text style={styles.contactButtonText}>Contact</Text>
              </TouchableOpacity>
            </Card>
          </View>
          
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>About this Fundraiser</Text>
            
            <Text style={styles.description}>
              {showFullDescription 
                ? fundraiser.description 
                : `${fundraiser.description.substring(0, 150)}${fundraiser.description.length > 150 ? '...' : ''}`}
            </Text>
            
            {fundraiser.description.length > 150 && (
              <TouchableOpacity 
                style={styles.readMoreButton}
                onPress={() => setShowFullDescription(!showFullDescription)}
              >
                <Text style={styles.readMoreText}>
                  {showFullDescription ? 'Read Less' : 'Read More'}
                </Text>
                {showFullDescription 
                  ? <ChevronUp size={16} color={colors.secondary} />
                  : <ChevronDown size={16} color={colors.secondary} />
                }
              </TouchableOpacity>
            )}
            
            <View style={styles.beneficiaryInfo}>
              <Text style={styles.beneficiaryLabel}>Beneficiary:</Text>
              <Text style={styles.beneficiaryValue}>{fundraiser.beneficiary}</Text>
            </View>
          </View>
          
          <View style={styles.updatesSection}>
            <Text style={styles.sectionTitle}>Updates ({updates.length})</Text>
            
            {updates.map((update) => (
              <Card key={update.id} style={styles.updateCard}>
                <View style={styles.updateHeader}>
                  <Text style={styles.updateAuthor}>{update.author}</Text>
                  <Text style={styles.updateDate}>{formatDate(update.date)}</Text>
                </View>
                <Text style={styles.updateText}>{update.text}</Text>
              </Card>
            ))}
          </View>
          
          <View style={styles.donorsSection}>
            <Text style={styles.sectionTitle}>Recent Donors ({donors.length})</Text>
            
            {donors.map((donor) => (
              <View key={donor.id} style={styles.donorItem}>
                <Avatar size="small" name={donor.name} />
                <View style={styles.donorInfo}>
                  <Text style={styles.donorName}>{donor.name}</Text>
                  <Text style={styles.donorDate}>{formatDate(donor.date)}</Text>
                </View>
                <Text style={styles.donorAmount}>{formatCurrency(donor.amount)}</Text>
              </View>
            ))}
          </View>
          
          {user?.role === 'admin' && (
            <Card style={styles.adminCard}>
              <Text style={styles.adminCardTitle}>Admin Actions</Text>
              <Text style={styles.adminCardDescription}>
                Update the status of this fundraiser
              </Text>
              
              <View style={styles.adminButtons}>
                <Button 
                  title="Active" 
                  variant={fundraiser.status === 'active' ? 'primary' : 'outline'}
                  size="small"
                  style={styles.adminButton}
                  onPress={() => handleUpdateStatus('active')}
                  disabled={fundraiser.status === 'active'}
                />
                
                <Button 
                  title="Completed" 
                  variant={fundraiser.status === 'completed' ? 'success' : 'outline'}
                  size="small"
                  style={styles.adminButton}
                  onPress={() => handleUpdateStatus('completed')}
                  disabled={fundraiser.status === 'completed'}
                />
                
                <Button 
                  title="Cancelled" 
                  variant={fundraiser.status === 'cancelled' ? 'danger' : 'outline'}
                  size="small"
                  style={styles.adminButton}
                  onPress={() => handleUpdateStatus('cancelled')}
                  disabled={fundraiser.status === 'cancelled'}
                />
              </View>
            </Card>
          )}
          
          <View style={styles.similarSection}>
            <Text style={styles.sectionTitle}>Similar Fundraisers</Text>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.similarScroll}
            >
              {fundraisers.filter(f => f.id !== fundraiser.id).slice(0, 3).map((item) => (
                <TouchableOpacity 
                  key={item.id}
                  style={styles.similarCard}
                  onPress={() => router.push(`/fundraisers/${item.id}`)}
                >
                  <Image 
                    source={{ uri: item.imageUrl }} 
                    style={styles.similarImage}
                  />
                  <View style={styles.similarContent}>
                    <Text style={styles.similarTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <View style={styles.similarProgress}>
                      <ProgressBar 
                        progress={item.raisedAmount / item.targetAmount} 
                        height={4}
                      />
                    </View>
                    <Text style={styles.similarAmount}>
                      {formatCurrency(item.raisedAmount)} raised
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
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
  image: {
    width: '100%',
    height: 250,
    backgroundColor: colors.placeholder,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 16,
    color: colors.text,
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryText: {
    fontSize: 14,
    color: colors.secondary,
    backgroundColor: colors.lightSecondary || `${colors.secondary}15`,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
  progressSection: {
    marginBottom: 16,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 8,
    marginBottom: 8,
  },
  raisedAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginRight: 8,
  },
  targetAmount: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    marginLeft: 8,
    color: colors.text,
  },
  actionButtons: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  donateButton: {
    flex: 1,
    marginRight: 8,
  },
  shareButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.lightPrimary || `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  reportButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.lightDanger || `${colors.danger}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  donationCard: {
    marginBottom: 24,
  },
  donationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    color: colors.text,
  },
  amountOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  amountOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.lightSecondary || `${colors.secondary}15`,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedAmount: {
    backgroundColor: colors.secondary,
  },
  amountOptionText: {
    fontSize: 14,
    color: colors.secondary,
  },
  selectedAmountText: {
    color: 'white',
  },
  customAmountContainer: {
    marginBottom: 16,
  },
  customAmountLabel: {
    fontSize: 14,
    marginBottom: 8,
    color: colors.text,
  },
  customAmountInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  currencySymbol: {
    fontSize: 16,
    color: colors.text,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  donationButtons: {
    flexDirection: 'row',
  },
  donationButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: colors.text,
  },
  organizerSection: {
    marginBottom: 24,
  },
  organizerCard: {
    padding: 16,
  },
  organizerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  organizerDetails: {
    marginLeft: 12,
    flex: 1,
  },
  organizerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  organizerSubtitle: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.lightSecondary || `${colors.secondary}15`,
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.secondary,
    marginLeft: 8,
  },
  descriptionSection: {
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
    marginBottom: 16,
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  readMoreText: {
    fontSize: 14,
    color: colors.secondary,
    fontWeight: '500',
    marginRight: 4,
  },
  beneficiaryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightPrimary || `${colors.primary}15`,
    padding: 12,
    borderRadius: 8,
  },
  beneficiaryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginRight: 8,
  },
  beneficiaryValue: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  updatesSection: {
    marginBottom: 24,
  },
  updateCard: {
    marginBottom: 12,
  },
  updateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  updateAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  updateDate: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.7,
  },
  updateText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
  },
  donorsSection: {
    marginBottom: 24,
  },
  donorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  donorInfo: {
    flex: 1,
    marginLeft: 12,
  },
  donorName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  donorDate: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.7,
  },
  donorAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.secondary,
  },
  adminCard: {
    marginBottom: 24,
  },
  adminCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: colors.text,
  },
  adminCardDescription: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
    marginBottom: 16,
  },
  adminButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  adminButton: {
    marginRight: 8,
    marginBottom: 8,
  },
  similarSection: {
    marginBottom: 24,
  },
  similarScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  similarCard: {
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
  similarImage: {
    width: '100%',
    height: 100,
    backgroundColor: colors.placeholder,
  },
  similarContent: {
    padding: 12,
  },
  similarTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: colors.text,
  },
  similarProgress: {
    marginBottom: 8,
  },
  similarAmount: {
    fontSize: 12,
    color: colors.text,
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