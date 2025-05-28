import {
    Briefcase,
    Building2,
    CheckCircle,
    ChevronRight,
    RefreshCw,
    Search,
    Users
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
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

// Mock data for company search results
const MOCK_COMPANIES = [
  { id: '1', name: 'Acme Corporation', industry: 'Technology' },
  { id: '2', name: 'Globex Inc.', industry: 'Healthcare' },
  { id: '3', name: 'Stark Industries', industry: 'Manufacturing' },
  { id: '4', name: 'Wayne Enterprises', industry: 'Conglomerate' },
  { id: '5', name: 'Umbrella Corporation', industry: 'Pharmaceuticals' },
  { id: '6', name: 'Cyberdyne Systems', industry: 'Technology' },
  { id: '7', name: 'Massive Dynamic', industry: 'Research' },
  { id: '8', name: 'Oscorp Industries', industry: 'Science' },
  { id: '9', name: 'Initech', industry: 'Software' },
  { id: '10', name: 'Hooli', industry: 'Technology' }
];

// Mock data for benefit plans
const MOCK_BENEFIT_PLANS = [
  { id: '1', name: 'Gold Plan', description: 'Comprehensive coverage with low deductibles' },
  { id: '2', name: 'Silver Plan', description: 'Balanced coverage with moderate deductibles' },
  { id: '3', name: 'Bronze Plan', description: 'Basic coverage with higher deductibles' }
];

const BenefitsConnectScreen = () => {
  const { onboardingData, updateOnboardingData, moveToNextStep } = useOnboarding();
  
  // Initialize form state from any existing data
  const [formData, setFormData] = useState({
    companyName: onboardingData.employerInfo?.companyName || '',
    employeeId: onboardingData.employerInfo?.employeeId || '',
    department: onboardingData.employerInfo?.department || '',
    benefitsPlan: onboardingData.employerInfo?.benefitsPlan || ''
  });
  
  // Form state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof MOCK_COMPANIES>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searching, setSearching] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [showBenefitPlans, setShowBenefitPlans] = useState(false);
  
  // Mock company search functionality
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setSearching(true);
    
    // Simulate API call
    setTimeout(() => {
      const results = MOCK_COMPANIES.filter(company => 
        company.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
      setSearching(false);
    }, 1000);
  };
  
  // Handle company selection
  const handleSelectCompany = (company: typeof MOCK_COMPANIES[0]) => {
    setFormData(prev => ({
      ...prev,
      companyName: company.name
    }));
    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);
  };
  
  // Handle benefit plan selection
  const handleSelectBenefitPlan = (plan: typeof MOCK_BENEFIT_PLANS[0]) => {
    setFormData(prev => ({
      ...prev,
      benefitsPlan: plan.name
    }));
    setShowBenefitPlans(false);
  };
  
  // Handle input changes
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle connect to benefits
  const handleConnect = () => {
    // Validate required fields
    if (!formData.companyName) {
      Alert.alert('Missing Information', 'Please select your company before connecting.');
      return;
    }
    
    setConnecting(true);
    
    // Simulate API call
    setTimeout(() => {
      setConnecting(false);
      setConnected(true);
      
      // Show confirmation
      Alert.alert(
        'Connected Successfully',
        'Your benefits information has been connected successfully.',
        [{ text: 'OK' }]
      );
    }, 2000);
  };
  
  // Handle manual skip
  const handleSkip = async () => {
    // Show confirmation dialog
    Alert.alert(
      'Skip Benefits Connection',
      'Connecting your employer benefits helps us provide personalized preventative care recommendations based on your coverage. You can always connect later.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Skip Anyway',
          onPress: async () => {
            // Update with whatever data we have
            updateOnboardingData({
              employerInfo: {
                ...formData
              }
            });
            
            // Move to next step
            await moveToNextStep();
          }
        }
      ]
    );
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    // Validate minimum required data
    if (!formData.companyName) {
      Alert.alert('Missing Information', 'Please select your company before continuing.');
      return;
    }
    
    // Update onboarding data
    updateOnboardingData({
      employerInfo: {
        ...formData
      }
    });
    
    // Move to next step
    await moveToNextStep();
  };
  
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Connect Employer Benefits</Text>
      <Text style={styles.sectionDescription}>
        Connect to your employer benefits to get personalized preventative care recommendations
        based on your coverage.
      </Text>
      
      <View style={styles.formSection}>
        <Text style={styles.formSectionTitle}>Company Information</Text>
        
        {/* Company Name */}
        <View style={styles.formField}>
          <Text style={styles.label}>Company Name *</Text>
          <TouchableOpacity
            style={styles.inputContainer}
            onPress={() => setShowSearch(true)}
          >
            <Building2 size={20} color="#6B7280" style={styles.inputIcon} />
            <Text
              style={[
                styles.input,
                !formData.companyName && styles.placeholderText
              ]}
            >
              {formData.companyName || 'Search for your company'}
            </Text>
            <Search size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
        
        {showSearch && (
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <TextInput
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search companies..."
                placeholderTextColor="#9CA3AF"
                returnKeyType="search"
                onSubmitEditing={handleSearch}
                autoFocus
              />
              <TouchableOpacity
                style={styles.searchButton}
                onPress={handleSearch}
                disabled={searching}
              >
                {searching ? (
                  <ActivityIndicator size="small" color="#3B82F6" />
                ) : (
                  <Search size={20} color="#3B82F6" />
                )}
              </TouchableOpacity>
            </View>
            
            {searchResults.length > 0 ? (
              <View style={styles.searchResults}>
                {searchResults.map((company) => (
                  <TouchableOpacity
                    key={company.id}
                    style={styles.searchResultItem}
                    onPress={() => handleSelectCompany(company)}
                  >
                    <View style={styles.companyIconContainer}>
                      <Building2 size={20} color="#3B82F6" />
                    </View>
                    <View style={styles.companyInfo}>
                      <Text style={styles.companyName}>{company.name}</Text>
                      <Text style={styles.companyIndustry}>{company.industry}</Text>
                    </View>
                    <ChevronRight size={16} color="#9CA3AF" />
                  </TouchableOpacity>
                ))}
              </View>
            ) : searching ? (
              <View style={styles.noResultsContainer}>
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text style={styles.searchingText}>Searching...</Text>
              </View>
            ) : searchQuery.trim() ? (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>No companies found</Text>
                <Text style={styles.noResultsSubtext}>
                  Try searching with a different name
                </Text>
              </View>
            ) : null}
          </View>
        )}
        
        {/* Employee ID */}
        <View style={styles.formField}>
          <Text style={styles.label}>Employee ID (Optional)</Text>
          <View style={styles.inputContainer}>
            <Briefcase size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={formData.employeeId}
              onChangeText={(value) => handleChange('employeeId', value)}
              placeholder="Enter your employee ID"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>
        
        {/* Department */}
        <View style={styles.formField}>
          <Text style={styles.label}>Department (Optional)</Text>
          <View style={styles.inputContainer}>
            <Users size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={formData.department}
              onChangeText={(value) => handleChange('department', value)}
              placeholder="Enter your department"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>
        
        {/* Benefits Plan */}
        <View style={styles.formField}>
          <Text style={styles.label}>Benefits Plan (Optional)</Text>
          <TouchableOpacity
            style={styles.inputContainer}
            onPress={() => setShowBenefitPlans(!showBenefitPlans)}
          >
            <Briefcase size={20} color="#6B7280" style={styles.inputIcon} />
            <Text
              style={[
                styles.input,
                !formData.benefitsPlan && styles.placeholderText
              ]}
            >
              {formData.benefitsPlan || 'Select your benefits plan'}
            </Text>
            <ChevronRight size={20} color="#6B7280" />
          </TouchableOpacity>
          
          {showBenefitPlans && (
            <View style={styles.benefitPlansContainer}>
              {MOCK_BENEFIT_PLANS.map((plan) => (
                <TouchableOpacity
                  key={plan.id}
                  style={styles.benefitPlanItem}
                  onPress={() => handleSelectBenefitPlan(plan)}
                >
                  <View style={styles.benefitPlanInfo}>
                    <Text style={styles.benefitPlanName}>{plan.name}</Text>
                    <Text style={styles.benefitPlanDescription}>{plan.description}</Text>
                  </View>
                  {formData.benefitsPlan === plan.name && (
                    <CheckCircle size={20} color="#10B981" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.connectContainer}>
        <Text style={styles.connectTitle}>Connect Automatically</Text>
        <Text style={styles.connectDescription}>
          Connect directly to your employer's benefits system to import your coverage information
        </Text>
        
        <View style={styles.connectOptionsContainer}>
          <View style={styles.connectOption}>
            <Image 
              source={require('../../../assets/sso-icon.png')}
              style={styles.connectIcon}
              resizeMode="contain"
            />
            <Text style={styles.connectOptionText}>Single Sign-On</Text>
          </View>
          
          <View style={styles.connectOption}>
            <Image 
              source={require('../../../assets/email-verification-icon.png')}
              style={styles.connectIcon}
              resizeMode="contain"
            />
            <Text style={styles.connectOptionText}>Email Verification</Text>
          </View>
          
          <View style={styles.connectOption}>
            <Image 
              source={require('../../../assets/access-code-icon.png')}
              style={styles.connectIcon}
              resizeMode="contain"
            />
            <Text style={styles.connectOptionText}>Access Code</Text>
          </View>
        </View>
        
        <Button
          onPress={handleConnect}
          style={styles.connectButton}
          disabled={connecting || !formData.companyName || connected}
        >
          {connecting ? (
            <>
              <RefreshCw size={20} color="#FFFFFF" style={styles.spinner} />
              <Text style={styles.buttonText}>Connecting...</Text>
            </>
          ) : connected ? (
            <>
              <CheckCircle size={20} color="#FFFFFF" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Connected</Text>
            </>
          ) : (
            <Text style={styles.buttonText}>Connect to Benefits</Text>
          )}
        </Button>
      </View>
      
      <View style={styles.manualContainer}>
        <Text style={styles.manualTitle}>Manual Setup</Text>
        <Text style={styles.manualDescription}>
          You can continue without connecting to your benefits system. We'll ask you about your coverage later.
        </Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button
          onPress={handleSubmit}
          style={styles.submitButton}
        >
          Continue
        </Button>
        
        <TouchableOpacity
          onPress={handleSkip}
          style={styles.skipButton}
        >
          <Text style={styles.skipButtonText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
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
  formSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
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
    height: 48,
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
  searchContainer: {
    marginTop: -8,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: '#1F2937',
  },
  searchButton: {
    padding: 8,
  },
  searchResults: {
    maxHeight: 300,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  companyIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  companyIndustry: {
    fontSize: 12,
    color: '#6B7280',
  },
  noResultsContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  noResultsText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
    marginBottom: 4,
  },
  noResultsSubtext: {
    fontSize: 12,
    color: '#6B7280',
  },
  benefitPlansContainer: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    overflow: 'hidden',
  },
  benefitPlanItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  benefitPlanInfo: {
    flex: 1,
  },
  benefitPlanName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  benefitPlanDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  connectContainer: {
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
  connectTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  connectDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  connectOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  connectOption: {
    alignItems: 'center',
    width: '30%',
  },
  connectIcon: {
    width: 48,
    height: 48,
    marginBottom: 8,
  },
  connectOptionText: {
    fontSize: 12,
    color: '#4B5563',
    textAlign: 'center',
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  spinner: {
    marginRight: 8,
    transform: [{ rotate: '45deg' }],
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  manualContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  manualTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  manualDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  buttonContainer: {
    marginBottom: 40,
  },
  submitButton: {
    height: 50,
    marginBottom: 12,
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 14,
    color: '#6B7280',
  },
});

export default BenefitsConnectScreen;