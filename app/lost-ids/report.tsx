import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image,
  Alert,
  Platform
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Camera as CameraIcon, MapPin, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useLostIDStore } from '@/store/lost-id-store';
import { useAuthStore } from '@/store/auth-store';
import { colors } from '@/constants/colors';

export default function ReportLostIDScreen() {
  const router = useRouter();
  const { reportLostID, isLoading } = useLostIDStore();
  const { user, isAuthenticated } = useAuthStore();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [reward, setReward] = useState('500');
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    address?: string;
  } | null>(null);
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    image?: string;
    location?: string;
  }>({});

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
      setErrors(prev => ({ ...prev, image: undefined }));
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your camera to take a photo.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setErrors(prev => ({ ...prev, image: undefined }));
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
    
    if (!image) {
      newErrors.image = 'Please upload an image of the ID';
    }
    
    if (!location) {
      newErrors.location = 'Please add the location where you found the ID';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Authentication Required',
        'Please sign in to report a lost ID',
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
      await reportLostID({
        title,
        description,
        imageUrl: image || '',
        location: location!,
        status: 'found',
        reward: parseInt(reward) || 500,
        foundBy: user?.id || '',
      });
      
      Alert.alert(
        'Success',
        'Lost ID reported successfully! Thank you for helping someone recover their ID.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to report lost ID. Please try again.');
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Report Lost ID',
          headerBackTitle: 'Back',
        }} 
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.subtitle}>
          Help someone recover their lost ID by reporting it here. You'll receive a reward when the owner claims it.
        </Text>
        
        <Input
          label="Title"
          placeholder="e.g., National ID Card, Student ID, Driver's License"
          value={title}
          onChangeText={(text) => {
            setTitle(text);
            setErrors(prev => ({ ...prev, title: undefined }));
          }}
          error={errors.title}
        />
        
        <Input
          label="Description"
          placeholder="Describe the ID and where you found it"
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
        
        <Text style={styles.label}>ID Photo</Text>
        {image ? (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: image }} style={styles.imagePreview} />
            <TouchableOpacity 
              style={styles.removeImageButton}
              onPress={() => setImage(null)}
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
            </View>
          </Card>
        )}
        {errors.image && <Text style={styles.errorText}>{errors.image}</Text>}
        
        <Text style={styles.label}>Location Found</Text>
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
        
        <Input
          label="Reward Amount (KSh)"
          placeholder="e.g., 500"
          value={reward}
          onChangeText={setReward}
          keyboardType="numeric"
        />
        
        <Button
          title="Submit Report"
          onPress={handleSubmit}
          loading={isLoading}
          style={styles.submitButton}
        />
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
    backgroundColor: `${colors.primary}10`,
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
  imagePreviewContainer: {
    position: 'relative',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  removeImageButton: {
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
    backgroundColor: `${colors.primary}10`,
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
  errorText: {
    color: colors.danger,
    fontSize: 12,
    marginTop: -12,
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 16,
    marginBottom: 32,
  },
});