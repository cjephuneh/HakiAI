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
import { 
  Camera, 
  Calendar, 
  X, 
  DollarSign, 
  Users,
  Heart,
  Info
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useFundraiserStore } from '@/store/fundraiser-store';
import { useAuthStore } from '@/store/auth-store';
import { colors } from '@/constants/colors';

export default function CreateFundraiserScreen() {
  const router = useRouter();
  const { addFundraiser, isLoading } = useFundraiserStore();
  const { user, isAuthenticated } = useAuthStore();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [category, setCategory] = useState<'legal' | 'medical' | 'education' | 'demonstration' | 'community' | 'other'>('legal');
  const [targetAmount, setTargetAmount] = useState('');
  const [beneficiary, setBeneficiary] = useState('');
  const [deadline, setDeadline] = useState('');
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    image?: string;
    targetAmount?: string;
    beneficiary?: string;
    deadline?: string;
  }>({});

  const categories = [
    { value: 'legal', label: 'Legal Aid', icon: <Users size={16} color={colors.primary} /> },
    { value: 'medical', label: 'Medical Support', icon: <Heart size={16} color={colors.danger} /> },
    { value: 'education', label: 'Education', icon: <Info size={16} color={colors.info} /> },
    { value: 'demonstration', label: 'Demonstration', icon: <Users size={16} color={colors.warning} /> },
    { value: 'community', label: 'Community', icon: <Users size={16} color={colors.secondary} /> },
    { value: 'other', label: 'Other', icon: <Info size={16} color={colors.text} /> },
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
      aspect: [16, 9],
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
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setErrors(prev => ({ ...prev, image: undefined }));
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
      newErrors.image = 'Please upload an image for your fundraiser';
    }
    
    if (!targetAmount.trim()) {
      newErrors.targetAmount = 'Target amount is required';
    } else if (isNaN(Number(targetAmount)) || Number(targetAmount) <= 0) {
      newErrors.targetAmount = 'Please enter a valid amount';
    }
    
    if (!beneficiary.trim()) {
      newErrors.beneficiary = 'Beneficiary is required';
    }
    
    if (!deadline.trim()) {
      newErrors.deadline = 'Deadline is required';
    } else {
      const deadlineDate = new Date(deadline);
      const today = new Date();
      if (isNaN(deadlineDate.getTime()) || deadlineDate <= today) {
        newErrors.deadline = 'Please enter a valid future date';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Authentication Required',
        'Please sign in to create a fundraiser',
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
      await addFundraiser({
        title,
        description,
        imageUrl: image || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', // Fallback image
        category,
        targetAmount: Number(targetAmount),
        beneficiary,
        organizer: user?.id || '1',
        deadline,
        status: 'active',
      });
      
      Alert.alert(
        'Success',
        'Fundraiser created successfully! Thank you for supporting your community.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create fundraiser. Please try again.');
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Create Fundraiser',
          headerBackTitle: 'Back',
        }} 
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.infoCard}>
          <Info size={24} color={colors.primary} />
          <Text style={styles.infoText}>
            Create a fundraiser to support legal aid, medical expenses, education, or community initiatives.
          </Text>
        </View>
        
        <Input
          label="Fundraiser Title"
          placeholder="e.g., Legal Aid for Detained Students"
          value={title}
          onChangeText={(text) => {
            setTitle(text);
            setErrors(prev => ({ ...prev, title: undefined }));
          }}
          error={errors.title}
        />
        
        <Input
          label="Description"
          placeholder="Describe the purpose of this fundraiser and how the funds will be used"
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
              {cat.icon}
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
        
        <Text style={styles.label}>Fundraiser Image</Text>
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
                  <Camera size={24} color={colors.secondary} />
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
        
        <Input
          label="Target Amount (KSh)"
          placeholder="e.g., 50000"
          value={targetAmount}
          onChangeText={(text) => {
            setTargetAmount(text.replace(/[^0-9]/g, ''));
            setErrors(prev => ({ ...prev, targetAmount: undefined }));
          }}
          keyboardType="numeric"
          leftIcon={<DollarSign size={20} color={colors.text} />}
          error={errors.targetAmount}
        />
        
        <Input
          label="Beneficiary"
          placeholder="e.g., Student Rights Defense Fund, John Doe"
          value={beneficiary}
          onChangeText={(text) => {
            setBeneficiary(text);
            setErrors(prev => ({ ...prev, beneficiary: undefined }));
          }}
          leftIcon={<Users size={20} color={colors.text} />}
          error={errors.beneficiary}
        />
        
        <Input
          label="Deadline"
          placeholder="YYYY-MM-DD"
          value={deadline}
          onChangeText={(text) => {
            setDeadline(text);
            setErrors(prev => ({ ...prev, deadline: undefined }));
          }}
          leftIcon={<Calendar size={20} color={colors.text} />}
          error={errors.deadline}
        />
        
        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            By creating this fundraiser, you agree to our Terms of Service and Fundraising Guidelines. All funds will be held in escrow until the fundraiser ends or the target is reached.
          </Text>
        </View>
        
        <Button
          title="Create Fundraiser"
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
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.lightPrimary || `${colors.primary}15`,
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: colors.text,
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: colors.lightSecondary || `${colors.secondary}10`,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryButtonActive: {
    backgroundColor: colors.secondary,
  },
  categoryButtonText: {
    fontSize: 14,
    color: colors.secondary,
    marginLeft: 6,
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
    backgroundColor: colors.lightSecondary || `${colors.secondary}10`,
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
  errorText: {
    color: colors.danger,
    fontSize: 12,
    marginTop: -12,
    marginBottom: 16,
  },
  termsContainer: {
    marginTop: 16,
    marginBottom: 24,
    padding: 16,
    backgroundColor: colors.lightPrimary || `${colors.primary}10`,
    borderRadius: 8,
  },
  termsText: {
    fontSize: 12,
    color: colors.text,
    lineHeight: 18,
  },
  submitButton: {
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