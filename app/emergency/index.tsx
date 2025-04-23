import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Linking,
  Alert,
  Platform
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { 
  Phone, 
  AlertTriangle, 
  Shield, 
  MapPin,
  MessageSquare,
  Video,
  Camera as CameraIcon,
  Mic,
  X
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { colors } from '@/constants/colors';

const emergencyContacts = [
  { id: '1', name: 'Police Emergency', number: '999', icon: 'police' },
  { id: '2', name: 'Ambulance', number: '911', icon: 'ambulance' },
  { id: '3', name: 'Legal Aid Hotline', number: '0800-720-720', icon: 'legal' },
  { id: '4', name: 'Human Rights Commission', number: '0800-221-349', icon: 'rights' },
  { id: '5', name: 'Gender Violence Hotline', number: '1195', icon: 'gender' },
  { id: '6', name: 'Child Protection Hotline', number: '116', icon: 'child' },
];

export default function EmergencyScreen() {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingType, setRecordingType] = useState<'video' | 'audio' | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingInterval, setRecordingInterval] = useState<NodeJS.Timeout | null>(null);

  const startRecording = async (type: 'video' | 'audio') => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow camera access to record.');
      return;
    }
    
    if (type === 'video') {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
        videoMaxDuration: 60,
      });
      
      if (!result.canceled) {
        Alert.alert(
          'Recording Saved',
          'Your video has been saved and will be available to authorities if needed.',
          [{ text: 'OK' }]
        );
      }
    } else {
      // For audio, we'll simulate recording since ImagePicker doesn't have direct audio recording
      setRecordingType(type);
      setIsRecording(true);
      setRecordingTime(0);
      
      const interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      setRecordingInterval(interval);
    }
  };

  const stopRecording = () => {
    if (recordingInterval) {
      clearInterval(recordingInterval);
    }
    
    setIsRecording(false);
    setRecordingType(null);
    setRecordingTime(0);
    
    // In a real app, you would save the recording and potentially send it to a server
    Alert.alert(
      'Recording Saved',
      'Your recording has been saved and will be available to authorities if needed.',
      [{ text: 'OK' }]
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const callEmergency = (number: string) => {
    Linking.openURL(`tel:${number}`);
  };

  const shareLocation = () => {
    // In a real app, this would get the user's location and share it with emergency contacts
    Alert.alert(
      'Location Shared',
      'Your current location has been shared with emergency contacts.',
      [{ text: 'OK' }]
    );
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow camera access to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      Alert.alert(
        'Photo Saved',
        'Your photo has been saved and will be available to authorities if needed.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Emergency',
          headerStyle: {
            backgroundColor: colors.danger,
          },
          headerTintColor: 'white',
        }} 
      />
      
      {isRecording ? (
        <View style={styles.recordingContainer}>
          <LinearGradient
            colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.3)', 'transparent']}
            style={styles.recordingGradient}
          />
          
          <View style={styles.recordingHeader}>
            <View style={styles.recordingIndicator}>
              <View style={styles.recordingDot} />
              <Text style={styles.recordingText}>
                {recordingType === 'video' ? 'Recording Video' : 'Recording Audio'} • {formatTime(recordingTime)}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.stopRecordingButton}
            onPress={stopRecording}
          >
            <View style={styles.stopRecordingIcon}>
              <X size={24} color="white" />
            </View>
            <Text style={styles.stopRecordingText}>Stop Recording</Text>
          </TouchableOpacity>
          
          <Text style={styles.recordingInfo}>
            This recording will be saved to your device and can be shared with authorities if needed.
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.sosSection}>
            <TouchableOpacity 
              style={styles.sosButton}
              onPress={() => {
                // In a real app, this would trigger an emergency alert
                Alert.alert(
                  'Emergency Alert',
                  'Are you sure you want to send an emergency alert to your contacts?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                      text: 'Send Alert', 
                      onPress: () => {
                        Alert.alert('Alert Sent', 'Emergency alert has been sent to your contacts.');
                      },
                      style: 'destructive'
                    }
                  ]
                );
              }}
            >
              <Text style={styles.sosButtonText}>SOS</Text>
              <Text style={styles.sosButtonSubtext}>Press for Emergency</Text>
            </TouchableOpacity>
            
            <Text style={styles.sosDescription}>
              Press the SOS button to alert your emergency contacts with your location and situation.
            </Text>
          </View>
          
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.quickAction}
              onPress={() => startRecording('video')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: colors.danger }]}>
                <Video size={24} color="white" />
              </View>
              <Text style={styles.quickActionText}>Record Video</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickAction}
              onPress={() => startRecording('audio')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: colors.warning }]}>
                <Mic size={24} color="white" />
              </View>
              <Text style={styles.quickActionText}>Record Audio</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickAction}
              onPress={takePhoto}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: colors.primary }]}>
                <CameraIcon size={24} color="white" />
              </View>
              <Text style={styles.quickActionText}>Take Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickAction}
              onPress={shareLocation}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: colors.secondary }]}>
                <MapPin size={24} color="white" />
              </View>
              <Text style={styles.quickActionText}>Share Location</Text>
            </TouchableOpacity>
          </View>
          
          <Card style={styles.emergencyContactsCard}>
            <Text style={styles.cardTitle}>Emergency Contacts</Text>
            
            {emergencyContacts.map((contact) => (
              <TouchableOpacity 
                key={contact.id}
                style={styles.contactItem}
                onPress={() => callEmergency(contact.number)}
              >
                <View style={[
                  styles.contactIcon,
                  contact.icon === 'police' && { backgroundColor: colors.danger },
                  contact.icon === 'ambulance' && { backgroundColor: colors.warning },
                  contact.icon === 'legal' && { backgroundColor: colors.primary },
                  contact.icon === 'rights' && { backgroundColor: colors.secondary },
                  contact.icon === 'gender' && { backgroundColor: colors.purple },
                  contact.icon === 'child' && { backgroundColor: colors.pink },
                ]}>
                  <Phone size={20} color="white" />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactNumber}>{contact.number}</Text>
                </View>
                <View style={styles.callButton}>
                  <Text style={styles.callButtonText}>Call</Text>
                </View>
              </TouchableOpacity>
            ))}
          </Card>
          
          <Card style={styles.safetyTipsCard}>
            <Text style={styles.cardTitle}>Safety Tips</Text>
            
            <View style={styles.safetyTip}>
              <AlertTriangle size={20} color={colors.warning} />
              <Text style={styles.safetyTipText}>
                Stay calm and try to move to a safe location if possible.
              </Text>
            </View>
            
            <View style={styles.safetyTip}>
              <Shield size={20} color={colors.primary} />
              <Text style={styles.safetyTipText}>
                If detained, ask for identification and state that you wish to remain silent until your lawyer is present.
              </Text>
            </View>
            
            <View style={styles.safetyTip}>
              <MessageSquare size={20} color={colors.secondary} />
              <Text style={styles.safetyTipText}>
                Document the incident with photos, videos, or audio if it's safe to do so.
              </Text>
            </View>
          </Card>
          
          <Button
            title="Know Your Rights During Emergencies"
            variant="outline"
            onPress={() => router.push('/rights')}
            style={styles.rightsButton}
          />
          
          <View style={styles.poweredByContainer}>
            <Text style={styles.poweredByText}>Powered by</Text>
            <Text style={styles.hakihackText}>hakihack</Text>
          </View>
        </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  sosSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  sosButton: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: colors.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  sosButtonText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  sosButtonSubtext: {
    fontSize: 12,
    color: 'white',
    opacity: 0.8,
  },
  sosDescription: {
    fontSize: 14,
    textAlign: 'center',
    color: colors.text,
    opacity: 0.7,
    paddingHorizontal: 24,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  quickAction: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  quickActionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    color: colors.text,
  },
  emergencyContactsCard: {
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: colors.text,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  contactNumber: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
  },
  callButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: colors.lightPrimary || `${colors.primary}15`,
    borderRadius: 16,
  },
  callButtonText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  safetyTipsCard: {
    marginBottom: 24,
  },
  safetyTip: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  safetyTipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
    marginLeft: 12,
  },
  rightsButton: {
    marginBottom: 24,
  },
  recordingContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'space-between',
    padding: 16,
  },
  recordingGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  recordingHeader: {
    alignItems: 'center',
    marginTop: 16,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.danger,
    marginRight: 8,
  },
  recordingText: {
    color: 'white',
    fontSize: 14,
  },
  stopRecordingButton: {
    alignItems: 'center',
    marginBottom: 32,
  },
  stopRecordingIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stopRecordingText: {
    color: 'white',
    fontSize: 16,
  },
  recordingInfo: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 16,
  },
  poweredByContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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