import { Briefcase, ChevronRight, Clock, DollarSign, Download, FileText, Heart, Shield } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Footer from '../../../components/Common/layout/Footer';
import Header from '../../../components/Common/layout/Header';

type GuideCategory = {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  guides: Guide[];
};

type Guide = {
  id: string;
  title: string;
  fileType: string;
  size: string;
  updatedDate: string;
  path: string;
};

export default function BenefitsGuidesScreen() {
  // Sample data - in a real app, this would come from an API or context
  const categories: GuideCategory[] = [
    {
      id: 'health',
      name: 'Health Insurance',
      icon: <Heart size={24} color="#4682B4" />,
      description: 'Comprehensive guides to understand your health insurance benefits and coverage details.',
      guides: [
        {
          id: '1',
          title: 'Health Plan Summary',
          fileType: 'PDF',
          size: '2.4 MB',
          updatedDate: 'January 15, 2025',
          path: '/files/health-plan-summary.pdf'
        },
        {
          id: '2',
          title: 'In-Network Provider Directory',
          fileType: 'PDF',
          size: '3.8 MB',
          updatedDate: 'March 1, 2025',
          path: '/files/provider-directory.pdf'
        },
        {
          id: '3',
          title: 'Prescription Drug Coverage',
          fileType: 'PDF',
          size: '1.6 MB',
          updatedDate: 'February 10, 2025',
          path: '/files/drug-coverage.pdf'
        }
      ]
    },
    {
      id: 'preventative',
      name: 'Preventative Care',
      icon: <Shield size={24} color="#4682B4" />,
      description: 'Learn about all the preventative services covered at 100% and recommended screening schedules.',
      guides: [
        {
          id: '4',
          title: 'Preventative Benefits Overview',
          fileType: 'PDF',
          size: '1.8 MB',
          updatedDate: 'January 5, 2025',
          path: '/files/preventative-benefits.pdf'
        },
        {
          id: '5',
          title: 'Age-Based Screening Recommendations',
          fileType: 'PDF',
          size: '2.1 MB',
          updatedDate: 'February 12, 2025',
          path: '/files/screening-recommendations.pdf'
        }
      ]
    },
    {
      id: 'financial',
      name: 'Financial Benefits',
      icon: <DollarSign size={24} color="#4682B4" />,
      description: 'Guides to help you maximize your financial benefits like HSA, FSA, and retirement plans.',
      guides: [
        {
          id: '6',
          title: 'HSA User Guide',
          fileType: 'PDF',
          size: '1.2 MB',
          updatedDate: 'March 5, 2025',
          path: '/files/hsa-guide.pdf'
        },
        {
          id: '7',
          title: 'FSA Eligible Expenses',
          fileType: 'PDF',
          size: '0.9 MB',
          updatedDate: 'January 20, 2025',
          path: '/files/fsa-expenses.pdf'
        },
        {
          id: '8',
          title: '401(k) Enrollment Guide',
          fileType: 'PDF',
          size: '1.5 MB',
          updatedDate: 'February 15, 2025',
          path: '/files/401k-guide.pdf'
        }
      ]
    },
    {
      id: 'time',
      name: 'Time Off & Leave',
      icon: <Clock size={24} color="#4682B4" />,
      description: 'Information about PTO, sick leave, parental leave, and other time off benefits.',
      guides: [
        {
          id: '9',
          title: 'PTO Policy',
          fileType: 'PDF',
          size: '0.7 MB',
          updatedDate: 'January 10, 2025',
          path: '/files/pto-policy.pdf'
        },
        {
          id: '10',
          title: 'Family & Medical Leave Guide',
          fileType: 'PDF',
          size: '1.4 MB',
          updatedDate: 'February 8, 2025',
          path: '/files/fmla-guide.pdf'
        }
      ]
    }
  ];

  const handleDownload = (guide: Guide) => {
    // In a real app, this would trigger file download
    console.log(`Downloading guide: ${guide.title}`);
    // Show download confirmation
    alert(`Download started for ${guide.title}`);
  };

  return (
    <View style={styles.container}>
      <Header title="Benefits Guides" showBackButton />
      
      <ScrollView style={styles.content}>
        <Text style={styles.description}>
          Access comprehensive guides and documentation about your employee benefits. These resources will help you understand and maximize your benefits.
        </Text>

        {categories.map(category => (
          <View key={category.id} style={styles.categoryContainer}>
            <View style={styles.categoryHeader}>
              <View style={styles.categoryIconContainer}>
                {category.icon}
              </View>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryDescription}>{category.description}</Text>
              </View>
            </View>

            {category.guides.map(guide => (
              <View key={guide.id} style={styles.guideItem}>
                <View style={styles.guideInfo}>
                  <View style={styles.fileIconContainer}>
                    <FileText size={20} color="#4682B4" />
                  </View>
                  <View style={styles.guideDetails}>
                    <Text style={styles.guideTitle}>{guide.title}</Text>
                    <View style={styles.guideMeta}>
                      <Text style={styles.guideType}>{guide.fileType}</Text>
                      <Text style={styles.guideDot}>•</Text>
                      <Text style={styles.guideSize}>{guide.size}</Text>
                      <Text style={styles.guideDot}>•</Text>
                      <Text style={styles.guideDate}>Updated: {guide.updatedDate}</Text>
                    </View>
                  </View>
                </View>
                
                <TouchableOpacity 
                  style={styles.downloadButton}
                  onPress={() => handleDownload(guide)}
                >
                  <Download size={16} color="#4682B4" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ))}

        <View style={styles.needHelpCard}>
          <View style={styles.needHelpIconContainer}>
            <Briefcase size={24} color="#4682B4" />
          </View>
          <View style={styles.needHelpContent}>
            <Text style={styles.needHelpTitle}>Need Help with Your Benefits?</Text>
            <Text style={styles.needHelpText}>
              If you have questions about your benefits or need assistance, contact your HR department or benefits coordinator.
            </Text>
            <TouchableOpacity style={styles.contactButton}>
              <Text style={styles.contactButtonText}>Contact Benefits Team</Text>
              <ChevronRight size={16} color="#4682B4" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      
      <Footer 
        activePath="education"
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
  content: {
    flex: 1,
    padding: 16,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 24,
  },
  categoryContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  categoryHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  categoryIconContainer: {
    backgroundColor: '#E6F0F9',
    borderRadius: 12,
    padding: 10,
    marginRight: 12,
    alignSelf: 'flex-start',
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  guideItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  guideInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fileIconContainer: {
    marginRight: 12,
  },
  guideDetails: {
    flex: 1,
  },
  guideTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  guideMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  guideType: {
    fontSize: 12,
    color: '#4682B4',
    fontWeight: '500',
  },
  guideDot: {
    fontSize: 12,
    color: '#999',
    marginHorizontal: 4,
  },
  guideSize: {
    fontSize: 12,
    color: '#666',
  },
  guideDate: {
    fontSize: 12,
    color: '#666',
  },
  downloadButton: {
    padding: 8,
  },
  needHelpCard: {
    backgroundColor: '#E6F0F9',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#C9DEF0',
    flexDirection: 'row',
  },
  needHelpIconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  needHelpContent: {
    flex: 1,
  },
  needHelpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4682B4',
    marginBottom: 4,
  },
  needHelpText: {
    fontSize: 14,
    color: '#4682B4',
    lineHeight: 20,
    marginBottom: 12,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  contactButtonText: {
    fontSize: 14,
    color: '#4682B4',
    fontWeight: '500',
    marginRight: 4,
  },
});