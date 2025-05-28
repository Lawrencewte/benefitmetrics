import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { AlertCircle, Calendar, Mail, MapPin, Phone, User } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

// Hooks
import { useOnboarding } from '../../../context/OnboardingContext';

// Components
import { Button } from '../../../components/Common/ui/Button';

// Validators
import {
    isValidDate,
    isValidEmail,
    isValidName,
    isValidPhone,
    isValidZipCode
} from '../../../utils/securityValidators';

type FormErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
};

const genderOptions = [
  'Male',
  'Female',
  'Non-binary',
  'Prefer not to say'
];

// List of US states (abbreviated)
const states = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

const ProfileSetupScreen = () => {
  const { onboardingData, updateOnboardingData, moveToNextStep } = useOnboarding();
  
  // Initialize form state from any existing data
  const [formData, setFormData] = useState({
    firstName: onboardingData.userProfile?.firstName || '',
    lastName: onboardingData.userProfile?.lastName || '',
    email: onboardingData.userProfile?.email || '',
    phone: onboardingData.userProfile?.phone || '',
    dateOfBirth: onboardingData.userProfile?.dateOfBirth || '',
    gender: onboardingData.userProfile?.gender || '',
    street: onboardingData.userProfile?.address?.street || '',
    city: onboardingData.userProfile?.address?.city || '',
    state: onboardingData.userProfile?.address?.state || '',
    zipCode: onboardingData.userProfile?.address?.zipCode || ''
  });
  
  // Form validation errors
  const [errors, setErrors] = useState<FormErrors>({});
  
  // Date picker state
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Gender selector state
  const [showGenderSelector, setShowGenderSelector] = useState(false);
  
  // State selector state
  const [showStateSelector, setShowStateSelector] = useState(false);
  
  // Refs for form navigation
  const lastNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const streetRef = useRef<TextInput>(null);
  const cityRef = useRef<TextInput>(null);
  const stateRef = useRef<TextInput>(null);
  const zipCodeRef = useRef<TextInput>(null);
  
  // Handle input changes
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear errors when field is edited
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };
  
  // Handle date picker change
  const handleDateChange = (_: any, date?: Date) => {
    setShowDatePicker(false);
    
    if (date) {
      const dateString = format(date, 'yyyy-MM-dd');
      handleChange('dateOfBirth', dateString);
    }
  };
  
  // Handle gender selection
  const handleGenderSelect = (gender: string) => {
    handleChange('gender', gender);
    setShowGenderSelector(false);
  };
  
  // Handle state selection
  const handleStateSelect = (state: string) => {
    handleChange('state', state);
    setShowStateSelector(false);
  };
  
  // Validate form inputs
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Required fields
    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    } else if (!isValidName(formData.firstName)) {
      newErrors.firstName = 'Please enter a valid name';
    }
    
    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    } else if (!isValidName(formData.lastName)) {
      newErrors.lastName = 'Please enter a valid name';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (formData.phone && !isValidPhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else if (!isValidDate(formData.dateOfBirth)) {
      newErrors.dateOfBirth = 'Please enter a valid date';
    }
    
    // Optional fields with validation
    if (formData.zipCode && !isValidZipCode(formData.zipCode)) {
      newErrors.zipCode = 'Please enter a valid ZIP code';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    if (validateForm()) {
      // Update onboarding data
      updateOnboardingData({
        userProfile: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          address: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode
          }
        }
      });
      
      // Move to next step
      await moveToNextStep();
    } else {
      // Show error message
      Alert.alert(
        'Missing Information',
        'Please complete all required fields correctly before continuing.',
        [{ text: 'OK' }]
      );
    }
  };
  
  // Format date of birth for display
  const formatDateOfBirth = () => {
    if (!formData.dateOfBirth) return '';
    
    try {
      const date = new Date(formData.dateOfBirth);
      return format(date, 'MM/dd/yyyy');
    } catch (error) {
      return formData.dateOfBirth;
    }
  };
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <ScrollView style={styles.scrollView}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <Text style={styles.sectionDescription}>
          Let's set up your profile with some basic information
        </Text>
        
        <View style={styles.formSection}>
          {/* First Name */}
          <View style={styles.formField}>
            <Text style={styles.label}>First Name *</Text>
            <View style={[styles.inputContainer, errors.firstName && styles.inputError]}>
              <User size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={formData.firstName}
                onChangeText={(value) => handleChange('firstName', value)}
                placeholder="Enter your first name"
                placeholderTextColor="#9CA3AF"
                returnKeyType="next"
                onSubmitEditing={() => lastNameRef.current?.focus()}
                testID="firstName-input"
              />
            </View>
            {errors.firstName && (
              <Text style={styles.errorText}>{errors.firstName}</Text>
            )}
          </View>
          
          {/* Last Name */}
          <View style={styles.formField}>
            <Text style={styles.label}>Last Name *</Text>
            <View style={[styles.inputContainer, errors.lastName && styles.inputError]}>
              <User size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                ref={lastNameRef}
                style={styles.input}
                value={formData.lastName}
                onChangeText={(value) => handleChange('lastName', value)}
                placeholder="Enter your last name"
                placeholderTextColor="#9CA3AF"
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current?.focus()}
                testID="lastName-input"
              />
            </View>
            {errors.lastName && (
              <Text style={styles.errorText}>{errors.lastName}</Text>
            )}
          </View>
          
          {/* Email */}
          <View style={styles.formField}>
            <Text style={styles.label}>Email Address *</Text>
            <View style={[styles.inputContainer, errors.email && styles.inputError]}>
              <Mail size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                ref={emailRef}
                style={styles.input}
                value={formData.email}
                onChangeText={(value) => handleChange('email', value)}
                placeholder="Enter your email address"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => phoneRef.current?.focus()}
                testID="email-input"
              />
            </View>
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
          </View>
          
          {/* Phone */}
          <View style={styles.formField}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={[styles.inputContainer, errors.phone && styles.inputError]}>
              <Phone size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                ref={phoneRef}
                style={styles.input}
                value={formData.phone}
                onChangeText={(value) => handleChange('phone', value)}
                placeholder="Enter your phone number"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                returnKeyType="next"
                testID="phone-input"
              />
            </View>
            {errors.phone && (
              <Text style={styles.errorText}>{errors.phone}</Text>
            )}
          </View>
          
          {/* Date of Birth */}
          <View style={styles.formField}>
            <Text style={styles.label}>Date of Birth *</Text>
            <TouchableOpacity
              style={[styles.inputContainer, errors.dateOfBirth && styles.inputError]}
              onPress={() => setShowDatePicker(true)}
              testID="dateOfBirth-input"
            >
              <Calendar size={20} color="#6B7280" style={styles.inputIcon} />
              <Text
                style={[
                  styles.input,
                  !formData.dateOfBirth && styles.placeholderText
                ]}
              >
                {formData.dateOfBirth ? formatDateOfBirth() : 'Select your date of birth'}
              </Text>
            </TouchableOpacity>
            {errors.dateOfBirth && (
              <Text style={styles.errorText}>{errors.dateOfBirth}</Text>
            )}
            {showDatePicker && (
              <DateTimePicker
                value={formData.dateOfBirth ? new Date(formData.dateOfBirth) : new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )}
          </View>
          
          {/* Gender */}
          <View style={styles.formField}>
            <Text style={styles.label}>Gender</Text>
            <TouchableOpacity
              style={styles.inputContainer}
              onPress={() => setShowGenderSelector(!showGenderSelector)}
              testID="gender-input"
            >
              <User size={20} color="#6B7280" style={styles.inputIcon} />
              <Text
                style={[
                  styles.input,
                  !formData.gender && styles.placeholderText
                ]}
              >
                {formData.gender || 'Select your gender'}
              </Text>
            </TouchableOpacity>
            {showGenderSelector && (
              <View style={styles.selectorContainer}>
                {genderOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={styles.selectorOption}
                    onPress={() => handleGenderSelect(option)}
                  >
                    <Text style={styles.selectorOptionText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
        
        <Text style={styles.sectionTitle}>Address Information</Text>
        <Text style={styles.sectionDescription}>
          This information helps us with location-specific benefits
        </Text>
        
        <View style={styles.formSection}>
          {/* Street */}
          <View style={styles.formField}>
            <Text style={styles.label}>Street Address</Text>
            <View style={styles.inputContainer}>
              <MapPin size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                ref={streetRef}
                style={styles.input}
                value={formData.street}
                onChangeText={(value) => handleChange('street', value)}
                placeholder="Enter your street address"
                placeholderTextColor="#9CA3AF"
                returnKeyType="next"
                onSubmitEditing={() => cityRef.current?.focus()}
                testID="street-input"
              />
            </View>
          </View>
          
          {/* City */}
          <View style={styles.formField}>
            <Text style={styles.label}>City</Text>
            <View style={styles.inputContainer}>
              <MapPin size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                ref={cityRef}
                style={styles.input}
                value={formData.city}
                onChangeText={(value) => handleChange('city', value)}
                placeholder="Enter your city"
                placeholderTextColor="#9CA3AF"
                returnKeyType="next"
                testID="city-input"
              />
            </View>
          </View>
          
          <View style={styles.rowFields}>
            {/* State */}
            <View style={[styles.formField, styles.halfField]}>
              <Text style={styles.label}>State</Text>
              <TouchableOpacity
                style={styles.inputContainer}
                onPress={() => setShowStateSelector(!showStateSelector)}
                testID="state-input"
              >
                <MapPin size={20} color="#6B7280" style={styles.inputIcon} />
                <Text
                  style={[
                    styles.input,
                    !formData.state && styles.placeholderText
                  ]}
                >
                  {formData.state || 'State'}
                </Text>
              </TouchableOpacity>
              {showStateSelector && (
                <View style={styles.stateSelector}>
                  <ScrollView style={styles.stateSelectorScroll}>
                    {states.map((state) => (
                      <TouchableOpacity
                        key={state}
                        style={styles.selectorOption}
                        onPress={() => handleStateSelect(state)}
                      >
                        <Text style={styles.selectorOptionText}>{state}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
            
            {/* ZIP Code */}
            <View style={[styles.formField, styles.halfField]}>
              <Text style={styles.label}>ZIP Code</Text>
              <View style={[styles.inputContainer, errors.zipCode && styles.inputError]}>
                <MapPin size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  ref={zipCodeRef}
                  style={styles.input}
                  value={formData.zipCode}
                  onChangeText={(value) => handleChange('zipCode', value)}
                  placeholder="ZIP"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  maxLength={5}
                  testID="zipCode-input"
                />
              </View>
              {errors.zipCode && (
                <Text style={styles.errorText}>{errors.zipCode}</Text>
              )}
            </View>
          </View>
        </View>
        
        <View style={styles.privacyNote}>
          <AlertCircle size={16} color="#6B7280" style={styles.noteIcon} />
          <Text style={styles.noteText}>
            Your information is encrypted and protected under our privacy policy. We only collect what's necessary to provide you with personalized healthcare recommendations.
          </Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            onPress={handleSubmit}
            style={styles.submitButton}
            testID="continue-button"
          >
            Continue
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },
  formSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  formField: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    color: '#1F2937',
    fontSize: 16,
  },
  placeholderText: {
    color: '#9CA3AF',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  selectorContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    marginTop: 4,
    overflow: 'hidden',
    maxHeight: 200,
  },
  stateSelector: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  stateSelectorScroll: {
    maxHeight: 200,
  },
  selectorOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  selectorOptionText: {
    fontSize: 16,
    color: '#1F2937',
  },
  rowFields: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfField: {
    width: '48%',
  },
  privacyNote: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  noteIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  noteText: {
    flex: 1,
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
  buttonContainer: {
    marginBottom: 40,
  },
  submitButton: {
    height: 50,
  },
});

export default ProfileSetupScreen;