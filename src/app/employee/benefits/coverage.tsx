import { Activity, Calendar, ChevronDown, ChevronUp, Heart, Info, Search } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Footer from '../../../components/Common/layout/Footer';
import Header from '../../../components/Common/layout/Header';

type CoverageCategory = {
  id: string;
  name: string;
  icon: React.ReactNode;
  items: CoverageItem[];
};

type CoverageItem = {
  id: string;
  name: string;
  coverage: string;
  frequency: string;
  copay: string;
  description?: string;
};

export default function CoverageScreen() {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['preventative']);
  const [searchQuery, setSearchQuery] = useState('');
  
  const toggleCategory = (categoryId: string) => {
    if (expandedCategories.includes(categoryId)) {
      setExpandedCategories(expandedCategories.filter(id => id !== categoryId));
    } else {
      setExpandedCategories([...expandedCategories, categoryId]);
    }
  };
  
  // Sample coverage data - in a real app, this would come from an API or context
  const coverageCategories: CoverageCategory[] = [
    {
      id: 'preventative',
      name: 'Preventative Care',
      icon: <Heart size={20} color="#4682B4" />,
      items: [
        {
          id: 'physical',
          name: 'Annual Physical',
          coverage: '100%',
          frequency: 'Once per year',
          copay: '$0',
          description: 'Comprehensive annual examination including vital signs, general physical assessment, and basic laboratory tests.'
        },
        {
          id: 'dental',
          name: 'Dental Cleaning',
          coverage: '100%',
          frequency: 'Twice per year',
          copay: '$0',
          description: 'Professional teeth cleaning, dental examination, and routine X-rays.'
        },
        {
          id: 'vision',
          name: 'Eye Exam',
          coverage: '100%',
          frequency: 'Once per year',
          copay: '$0',
          description: 'Comprehensive eye examination to evaluate vision and check for eye diseases.'
        },
        {
          id: 'skin',
          name: 'Skin Cancer Screening',
          coverage: '100%',
          frequency: 'Once per year',
          copay: '$0',
          description: 'Full-body examination to check for suspicious moles or skin lesions.'
        },
        {
          id: 'immunizations',
          name: 'Vaccinations',
          coverage: '100%',
          frequency: 'As recommended',
          copay: '$0',
          description: 'Includes flu shots, COVID-19 vaccines, and other CDC-recommended immunizations.'
        }
      ]
    },
    {
      id: 'specialist',
      name: 'Specialist Visits',
      icon: <Activity size={20} color="#4682B4" />,
      items: [
        {
          id: 'cardiology',
          name: 'Cardiology',
          coverage: '80%',
          frequency: 'As needed',
          copay: '$30',
          description: 'Consultation with heart specialists for cardiovascular health concerns.'
        },
        {
          id: 'dermatology',
          name: 'Dermatology',
          coverage: '80%',
          frequency: 'As needed',
          copay: '$30',
          description: 'Skin, hair, and nail treatment from specialized dermatologists.'
        },
        {
          id: 'orthopedics',
          name: 'Orthopedics',
          coverage: '80%',
          frequency: 'As needed',
          copay: '$30',
          description: 'Consultation for musculoskeletal issues and treatment.'
        },
        {
          id: 'mental',
          name: 'Mental Health',
          coverage: '90%',
          frequency: 'Up to 20 visits per year',
          copay: '$20',
          description: 'Therapy and counseling services with licensed mental health professionals.'
        }
      ]
    },
    {
      id: 'screening',
      name: 'Screening & Testing',
      icon: <Calendar size={20} color="#4682B4" />,
      items: [
        {
          id: 'mammogram',
          name: 'Mammogram',
          coverage: '100%',
          frequency: 'Once per year (age 40+)',
          copay: '$0',
          description: 'Breast cancer screening using low-dose X-ray imaging.'
        },
        {
          id: 'colonoscopy',
          name: 'Colonoscopy',
          coverage: '100%',
          frequency: 'Every 10 years (age 45+)',
          copay: '$0',
          description: 'Colon cancer screening and polyp detection/removal.'
        },
        {
          id: 'bloodwork',
          name: 'Comprehensive Blood Work',
          coverage: '100%',
          frequency: 'Once per year',
          copay: '$0',
          description: 'Complete blood count, cholesterol, glucose, and other routine tests.'
        },
        {
          id: 'dexa',
          name: 'Bone Density (DEXA) Scan',
          coverage: '100%',
          frequency: 'Every 2 years (age 65+)',
          copay: '$0',
          description: 'Testing for osteoporosis and bone health.'
        }
      ]
    }
  ];
  
  // Filter coverage items based on search query
  const filteredCategories = searchQuery
    ? coverageCategories.map(category => ({
        ...category,
        items: category.items.filter(item => 
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.items.length > 0)
    : coverageCategories;
  
  return (
    <View style={styles.container}>
      <Header title="Coverage Details" showBackButton />
      
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={18} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search coverage..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.infoCard}>
          <Info size={20} color="#4682B4" style={styles.infoIcon} />
          <Text style={styles.infoText}>
            Your plan provides excellent preventative care coverage with $0 copay for most services. Take advantage of these benefits to maintain your health and detect potential issues early.
          </Text>
        </View>
        
        {filteredCategories.map((category) => (
          <View key={category.id} style={styles.categoryContainer}>
            <TouchableOpacity 
              style={styles.categoryHeader}
              onPress={() => toggleCategory(category.id)}
            >
              <View style={styles.categoryIconContainer}>
                {category.icon}
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
              {expandedCategories.includes(category.id) ? (
                <ChevronUp size={20} color="#666" />
              ) : (
                <ChevronDown size={20} color="#666" />
              )}
            </TouchableOpacity>
            
            {expandedCategories.includes(category.id) && (
              <View style={styles.categoryContent}>
                {category.items.map((item) => (
                  <View key={item.id} style={styles.coverageItem}>
                    <View style={styles.coverageHeader}>
                      <Text style={styles.coverageName}>{item.name}</Text>
                      <View style={styles.coverageBadge}>
                        <Text style={styles.coverageBadgeText}>{item.coverage}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.coverageDetails}>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Frequency:</Text>
                        <Text style={styles.detailValue}>{item.frequency}</Text>
                      </View>
                      
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Copay:</Text>
                        <Text style={styles.detailValue}>{item.copay}</Text>
                      </View>
                      
                      {item.description && (
                        <Text style={styles.coverageDescription}>
                          {item.description}
                        </Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
        
        <View style={styles.disclaimerContainer}>
          <Text style={styles.disclaimerText}>
            This is a summary of your benefits. For complete details, refer to your plan documents or contact your benefits administrator.
          </Text>
        </View>
      </ScrollView>
      
      <Footer 
        activePath="benefits"
        employee={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F9',
  },
  searchContainer: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7F9',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoCard: {
    backgroundColor: '#E6F0F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#C9DEF0',
  },
  infoIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#4682B4',
    lineHeight: 20,
  },
  categoryContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  categoryIconContainer: {
    backgroundColor: '#E6F0F9',
    borderRadius: 8,
    padding: 8,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  categoryContent: {
    padding: 16,
  },
  coverageItem: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 16,
  },
  coverageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  coverageName: {
    fontSize: 14,
    fontWeight: '600',
  },
  coverageBadge: {
    backgroundColor: '#E8F5E9',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  coverageBadgeText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  coverageDetails: {
    backgroundColor: '#F5F7F9',
    borderRadius: 8,
    padding: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    width: 80,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
  coverageDescription: {
    fontSize: 12,
    color: '#333',
    marginTop: 8,
    lineHeight: 18,
  },
  disclaimerContainer: {
    marginBottom: 24,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});