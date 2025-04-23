import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  Alert,
  Linking,
  Platform
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { 
  MapPin, 
  Clock, 
  User, 
  Phone, 
  Share2, 
  Award,
  ChevronLeft
} from 'lucide-react-native';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { useLostIDStore } from '@/store/lost-id-store';
import { useAuthStore } from '@/store/auth-store';
import { colors } from '@/constants/colors';

export default function LostIDDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { lostIDs, claimLostID, verifyLostID, rewardFinder, isLoading } = useLostIDStore();
  const { user, isAuthenticated } = useAuthStore();
  const [lostID, setLostID] = useState(lostIDs.find(item => item.id === id));

  useEffect(() => {
    const foundID = lostIDs.find(item => item.id === id);
    if (foundID) {
      setLostID(foundID);
    } else {
      // ID not found, go back
      Alert.alert('Error', 'Lost ID not found');
      router.back();
    }
  }, [id, lostIDs]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const handleClaim = () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Authentication Required',
        'Please sign in to claim this ID',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => router.push('/auth/login') }
        ]
      );
      return;
    }

    Alert.alert(
      'Claim ID',
      'Are you the owner of this ID? You will need to verify your identity to complete the claim process.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Yes, Claim ID', 
          onPress: async () => {
            try {
              await claimLostID(lostID!.id, user!.id);
              Alert.alert('Success', 'Claim submitted successfully. You will be contacted for verification.');
            } catch (error) {
              Alert.alert('Error', 'Failed to claim ID. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleVerify = () => {
    Alert.alert(
      'Verify Claim',
      'Confirm that the ID has been verified and belongs to the claimant?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Verify', 
          onPress: async () => {
            try {
              await verifyLostID(lostID!.id);
              Alert.alert('Success', 'ID claim verified successfully.');
            } catch (error) {
              Alert.alert('Error', 'Failed to verify claim. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleReward = () => {
    Alert.alert(
      'Process Reward',
      `Confirm payment of KSh ${lostID?.reward} to the finder?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm Payment', 
          onPress: async () => {
            try {
              await rewardFinder(lostID!.id);
              Alert.alert('Success', 'Reward payment processed successfully.');
            } catch (error) {
              Alert.alert('Error', 'Failed to process reward. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Help someone find their lost ID: ${lostID?.title} - View on Haki App`,
        url: `https://haki.app/lost-ids/${lostID?.id}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share. Please try again.');
    }
  };

  const handleContact = () => {
    Alert.alert(
      'Contact Finder',
      'How would you like to contact the finder?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Call', 
          onPress: () => {
            Linking.openURL(`tel:+254712345678`);
          }
        },
        { 
          text: 'Message', 
          onPress: () => {
            Linking.openURL(`sms:+254712345678`);
          }
        }
      ]
    );
  };

  if (!lostID) {
    return null;
  }

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: lostID.title,
          headerBackTitle: 'Back',
        }} 
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Image 
          source={{ uri: lostID.imageUrl }} 
          style={styles.image}
          resizeMode="cover"
        />
        
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{lostID.title}</Text>
            <StatusBadge status={lostID.status} size="large" />
          </View>
          
          <Text style={styles.description}>{lostID.description}</Text>
          
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <MapPin size={16} color={colors.text} />
              <Text style={styles.infoText}>
                {lostID.location.address || 'Unknown location'}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Clock size={16} color={colors.text} />
              <Text style={styles.infoText}>
                Found on {formatDate(lostID.createdAt)}
              </Text>
            </View>
            
            {lostID.status === 'found' && (
              <View style={styles.rewardContainer}>
                <Award size={16} color={colors.accent} />
                <Text style={styles.rewardText}>
                  Reward: KSh {lostID.reward}
                </Text>
              </View>
            )}
          </View>
          
          <Card style={styles.finderCard}>
            <View style={styles.finderInfo}>
              <Avatar size="large" name="John Doe" />
              <View style={styles.finderDetails}>
                <Text style={styles.finderName}>John Doe</Text>
                <Text style={styles.finderSubtitle}>ID Finder</Text>
                <View style={styles.finderRating}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <Text key={star} style={styles.starIcon}>★</Text>
                  ))}
                  <Text style={styles.ratingText}>(4.8)</Text>
                </View>
              </View>
            </View>
            
            {(lostID.status === 'claimed' || lostID.status === 'verified') && (
              <TouchableOpacity 
                style={styles.contactButton}
                onPress={handleContact}
              >
                <Phone size={16} color={colors.primary} />
                <Text style={styles.contactButtonText}>Contact</Text>
              </TouchableOpacity>
            )}
          </Card>
          
          <View style={styles.actionButtons}>
            {lostID.status === 'found' && (
              <Button 
                title="This is My ID" 
                onPress={handleClaim}
                loading={isLoading}
                style={styles.primaryButton}
              />
            )}
            
            {lostID.status === 'claimed' && user?.role === 'admin' && (
              <Button 
                title="Verify Claim" 
                onPress={handleVerify}
                loading={isLoading}
                style={styles.primaryButton}
              />
            )}
            
            {lostID.status === 'verified' && user?.role === 'admin' && (
              <Button 
                title="Process Reward" 
                onPress={handleReward}
                loading={isLoading}
                style={styles.primaryButton}
              />
            )}
            
            <Button 
              title="Share" 
              variant="outline"
              onPress={handleShare}
              style={styles.secondaryButton}
              leftIcon={<Share2 size={16} color={colors.primary} />}
            />
          </View>
          
          <View style={styles.statusTimeline}>
            <Text style={styles.timelineTitle}>Status Timeline</Text>
            
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, styles.timelineDotActive]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineStatus}>Found</Text>
                <Text style={styles.timelineDate}>{formatDate(lostID.createdAt)}</Text>
                <Text style={styles.timelineDescription}>
                  ID was found and reported by John Doe
                </Text>
              </View>
            </View>
            
            <View style={[
              styles.timelineConnector,
              lostID.status !== 'found' ? styles.timelineConnectorActive : null
            ]} />
            
            <View style={styles.timelineItem}>
              <View style={[
                styles.timelineDot,
                lostID.status !== 'found' ? styles.timelineDotActive : null
              ]} />
              <View style={styles.timelineContent}>
                <Text style={[
                  styles.timelineStatus,
                  lostID.status === 'found' ? styles.timelineStatusInactive : null
                ]}>Claimed</Text>
                {lostID.status !== 'found' && (
                  <>
                    <Text style={styles.timelineDate}>{formatDate(lostID.updatedAt)}</Text>
                    <Text style={styles.timelineDescription}>
                      ID was claimed by the owner
                    </Text>
                  </>
                )}
              </View>
            </View>
            
            <View style={[
              styles.timelineConnector,
              lostID.status === 'verified' || lostID.status === 'rewarded' ? styles.timelineConnectorActive : null
            ]} />
            
            <View style={styles.timelineItem}>
              <View style={[
                styles.timelineDot,
                lostID.status === 'verified' || lostID.status === 'rewarded' ? styles.timelineDotActive : null
              ]} />
              <View style={styles.timelineContent}>
                <Text style={[
                  styles.timelineStatus,
                  lostID.status === 'found' || lostID.status === 'claimed' ? styles.timelineStatusInactive : null
                ]}>Verified</Text>
                {(lostID.status === 'verified' || lostID.status === 'rewarded') && (
                  <>
                    <Text style={styles.timelineDate}>{formatDate(lostID.updatedAt)}</Text>
                    <Text style={styles.timelineDescription}>
                      ID ownership was verified
                    </Text>
                  </>
                )}
              </View>
            </View>
            
            <View style={[
              styles.timelineConnector,
              lostID.status === 'rewarded' ? styles.timelineConnectorActive : null
            ]} />
            
            <View style={styles.timelineItem}>
              <View style={[
                styles.timelineDot,
                lostID.status === 'rewarded' ? styles.timelineDotActive : null
              ]} />
              <View style={styles.timelineContent}>
                <Text style={[
                  styles.timelineStatus,
                  lostID.status !== 'rewarded' ? styles.timelineStatusInactive : null
                ]}>Rewarded</Text>
                {lostID.status === 'rewarded' && (
                  <>
                    <Text style={styles.timelineDate}>{formatDate(lostID.updatedAt)}</Text>
                    <Text style={styles.timelineDescription}>
                      Finder was rewarded KSh {lostID.reward}
                    </Text>
                  </>
                )}
              </View>
            </View>
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
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 16,
    color: colors.text,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
    color: colors.text,
  },
  infoContainer: {
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    marginLeft: 8,
    color: colors.text,
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    padding: 8,
    backgroundColor: `${colors.accent}15`,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  rewardText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    color: colors.accent,
  },
  finderCard: {
    marginBottom: 24,
  },
  finderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  finderDetails: {
    marginLeft: 16,
    flex: 1,
  },
  finderName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  finderSubtitle: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
    marginBottom: 4,
  },
  finderRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    color: colors.accent,
    fontSize: 16,
    marginRight: 2,
  },
  ratingText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 4,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: `${colors.primary}15`,
    marginTop: 16,
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    marginBottom: 32,
  },
  primaryButton: {
    flex: 1,
    marginRight: 8,
  },
  secondaryButton: {
    width: 100,
  },
  statusTimeline: {
    marginBottom: 32,
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: colors.text,
  },
  timelineItem: {
    flexDirection: 'row',
  },
  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.border,
    marginTop: 4,
  },
  timelineDotActive: {
    backgroundColor: colors.primary,
  },
  timelineConnector: {
    width: 2,
    height: 40,
    backgroundColor: colors.border,
    marginLeft: 7,
  },
  timelineConnectorActive: {
    backgroundColor: colors.primary,
  },
  timelineContent: {
    marginLeft: 16,
    flex: 1,
    marginBottom: 16,
  },
  timelineStatus: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: colors.text,
  },
  timelineStatusInactive: {
    opacity: 0.5,
  },
  timelineDate: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
    marginBottom: 4,
  },
  timelineDescription: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
});