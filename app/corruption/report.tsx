import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Alert,
  Platform,
  Switch
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { 
  Camera as CameraIcon, 
  MapPin, 
  X, 
  Video, 
  Shield, 
  AlertTriangle,
  Eye,
  EyeOff
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useCorruptionStore } from '@/store/corruption-store';
import { useAuthStore } from '@/store/auth-store';
import { colors } from '@/constants/colors';

export default function ReportCorruptionScreen() {
  const router = useRouter();
  const { addReport, isLoading } = useCorruptionStore();
  const { user, isAuthenticated } = useAuthStore();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [video, setVideo] = useState<string | null>(null);
  const [category, setCategory] = useState<'traffic' | 'government' | 'police' | 'education' | 'health' | 'other'>('traffic');
  const [officialName, setOfficialName] = useState('');
  const [officialId, setOfficialId] = useState('');
  const [anonymous, setAnonymous] = useState(true);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    address?: string;
  } | null>(null);
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    media?: string;
    location?: string;
  }>({});

  const categories = [
    { value: 'traffic', label: 'Traffic Police' },
    { value: 'government', label: 'Government Official' },
    { value: 'police', label: 'Police Officer' },
    { value: 'education', label: 'Education Sector' },
    { value: 'health', label: 'Health Sector' },
    { value: 'other', label: 'Other' },
  ];

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your photo library to upload an image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setVideo(null);
      setErrors(prev => ({ ...prev, media: undefined }));
    }
  };

  const pickVideo = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your photo library to upload a video.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
      videoMaxDuration: 60,
    });

    if (!result.canceled) {
      setVideo(result.assets[0].uri);
      setImage(null);
      setErrors(prev => ({ ...prev, media: undefined }));
    }
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
      setImage(result.assets[0].uri);
      setVideo(null);
      setErrors(prev => ({ ...prev, media: undefined }));
    }
  };

  const recordVideo = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow camera access to record videos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
      videoMaxDuration: 60,
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    });

    if (!result.canceled) {
      setVideo(result.assets[0].uri);
      setImage(null);
      setErrors(prev => ({ ...prev, media: undefined }));
    }
  };

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your location.');
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      // Get address from coordinates
      const [address] = await Location.reverseGeocodeAsync({ latitude, longitude });
      
      const formattedAddress = address 
        ? `${address.street || ''}, ${address.city || ''}, ${address.region || ''}`
        : undefined;
      
      setLocation({
        latitude,
        longitude,
        address: formattedAddress,
      });
      
      setErrors(prev => ({ ...prev, location: undefined }));
    } catch (error) {
      Alert.alert('Error', 'Failed to get your location. Please try again.');
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!image && !video) {
      newErrors.media = 'Please upload an image or video as evidence';
    }
    
    if (!location) {
      newErrors.location = 'Please add the location of the incident';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Authentication Required',
        'Please sign in to report corruption',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => router.push('/auth/login') }
        ]
      );
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await addReport({
        title,
        description,
        imageUrl: image || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', // Fallback image
        videoUrl: video,
        location: location!,
        category,
        officialName: officialName || undefined,
        officialId: officialId || undefined,
        status: 'reported',
        reportedBy: user?.id || '1',
        anonymous,
      });
      
      Alert.alert(
        'Success',
        'Corruption report submitted successfully! Thank you for standing up against corruption.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit report. Please try again.');
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Report Corruption',
          headerBackTitle: 'Back',
        }} 
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.warningCard}>
          <AlertTriangle size={24} color={colors.warning} />
          <Text style={styles.warningText}>
            Your safety is important. Only report corruption when it's safe to do so.
          </Text>
        </View>
        
        <Text style={styles.subtitle}>
          Help fight corruption by reporting incidents. Your report can be anonymous and will be handled with confidentiality.
        </Text>
        
        <Input
          label="Title"
          placeholder="e.g., Traffic Police Bribery, Official Demanding Payment"
          value={title}
          onChangeText={(text) => {
            setTitle(text);
            setErrors(prev => ({ ...prev, title: undefined }));
          }}
          error={errors.title}
        />
        
        <Input
          label="Description"
          placeholder="Describe what happened, when, and how"
          value={description}
          onChangeText={(text) => {
            setDescription(text);
            setErrors(prev => ({ ...prev, description: undefined }));
          }}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          style={styles.textArea}
          error={errors.description}
        />
        
        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryContainer}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.value}
              style={[
                styles.categoryButton,
                category === cat.value && styles.categoryButtonActive
              ]}
              onPress={() => setCategory(cat.value as any)}
            >
              <Text 
                style={[
                  styles.categoryButtonText,
                  category === cat.value && styles.categoryButtonTextActive
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <Input
          label="Official's Name (if known)"
          placeholder="e.g., Officer Kimani, Dr. Otieno"
          value={officialName}
          onChangeText={setOfficialName}
        />
        
        <Input
          label="Official's ID/Badge Number (if known)"
          placeholder="e.g., KP-12345"
          value={officialId}
          onChangeText={setOfficialId}
        />
        
        <Text style={styles.label}>Evidence</Text>
        {(image || video) ? (
          <View style={styles.mediaPreviewContainer}>
            {image ? (
              <Image source={{ uri: image }} style={styles.mediaPreview} />
            ) : video ? (
              <View style={styles.videoPreview}>
                <Video size={40} color="white" />
                <Text style={styles.videoText}>Video Selected</Text>
              </View>
            ) : null}
            <TouchableOpacity 
              style={styles.removeMediaButton}
              onPress={() => {
                setImage(null);
                setVideo(null);
              }}
            >
              <X size={20} color="white" />
            </TouchableOpacity>
          </View>
        ) : (
          <Card style={styles.uploadCard}>
            <View style={styles.uploadOptions}>
              <TouchableOpacity 
                style={styles.uploadOption}
                onPress={takePhoto}
              >
                <View style={styles.uploadIconContainer}>
                  <CameraIcon size={24} color={colors.primary} />
                </View>
                <Text style={styles.uploadOptionText}>Take Photo</Text>
              </TouchableOpacity>
              
              <View style={styles.uploadDivider} />
              
              <TouchableOpacity 
                style={styles.uploadOption}
                onPress={pickImage}
              >
                <View style={styles.uploadIconContainer}>
                  <Image 
                    source={{ uri: 'https://images.unsplash.com/photo-1598128558393-70ff21433be0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }} 
                    style={styles.galleryIcon} 
                  />
                </View>
                <Text style={styles.uploadOptionText}>Gallery</Text>
              </TouchableOpacity>
              
              <View style={styles.uploadDivider} />
              
              <TouchableOpacity 
                style={styles.uploadOption}
                onPress={recordVideo}
              >
                <View style={styles.uploadIconContainer}>
                  <Video size={24} color={colors.primary} />
                </View>
                <Text style={styles.uploadOptionText}>Record Video</Text>
              </TouchableOpacity>
            </View>
          </Card>
        )}
        {errors.media && <Text style={styles.errorText}>{errors.media}</Text>}
        
        <Text style={styles.label}>Location of Incident</Text>
        <TouchableOpacity 
          style={[
            styles.locationButton,
            location ? styles.locationButtonActive : null,
            errors.location ? styles.locationButtonError : null,
          ]}
          onPress={getLocation}
        >
          <MapPin size={20} color={location ? colors.primary : colors.text} />
          <Text style={[
            styles.locationButtonText,
            location ? styles.locationButtonTextActive : null,
          ]}>
            {location ? location.address || 'Location added' : 'Add current location'}
          </Text>
        </TouchableOpacity>
        {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
        
        <View style={styles.anonymousContainer}>
          <View style={styles.anonymousTextContainer}>
            <Text style={styles.anonymousTitle}>Report Anonymously</Text>
            <Text style={styles.anonymousDescription}>
              Your identity will not be revealed to the public or the reported official
            </Text>
          </View>
          <Switch
            value={anonymous}
            onValueChange={setAnonymous}
            trackColor={{ false: colors.border, true: `${colors.primary}80` }}
            thumbColor={anonymous ? colors.primary : '#f4f3f4'}
          />
        </View>
        
        {!anonymous && (
          <View style={styles.warningCard}>
            <Eye size={20} color={colors.warning} />
            <Text style={styles.warningText}>
              Your name will be visible to Haki administrators for verification purposes.
            </Text>
          </View>
        )}
        
        <Button
          title="Submit Report"
          onPress={handleSubmit}
          loading={isLoading}
          style={styles.submitButton}
        />
        
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
  contentContainer: {
    padding: 16,
  },
  warningCard: {
    flexDirection: 'row',
    backgroundColor: colors.lightWarning || `${colors.warning}15`,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  warningText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  subtitle: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
    marginBottom: 24,
    lineHeight: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: colors.text,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: colors.lightPrimary || `${colors.primary}10`,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
  },
  categoryButtonText: {
    fontSize: 14,
    color: colors.primary,
  },
  categoryButtonTextActive: {
    color: 'white',
  },
  uploadCard: {
    marginBottom: 16,
    padding: 0,
    overflow: 'hidden',
  },
  uploadOptions: {
    flexDirection: 'row',
    height: 120,
  },
  uploadOption: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadDivider: {
    width: 1,
    height: '100%',
    backgroundColor: colors.border,
  },
  uploadIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.lightPrimary || `${colors.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  uploadOptionText: {
    fontSize: 14,
    color: colors.text,
  },
  galleryIcon: {
    width: 24,
    height: 24,
    borderRadius: 4,
  },
  mediaPreviewContainer: {
    position: 'relative',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  mediaPreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  videoPreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoText: {
    color: 'white',
    marginTop: 8,
    fontWeight: '500',
  },
  removeMediaButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: colors.card,
  },
  locationButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.lightPrimary || `${colors.primary}10`,
  },
  locationButtonError: {
    borderColor: colors.danger,
  },
  locationButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: colors.text,
  },
  locationButtonTextActive: {
    color: colors.primary,
  },
  anonymousContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  anonymousTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  anonymousTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
    color: colors.text,
  },
  anonymousDescription: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.7,
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    marginTop: -12,
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 16,
    marginBottom: 24,
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