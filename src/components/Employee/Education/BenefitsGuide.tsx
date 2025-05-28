import { CheckCircle, ChevronDown, ChevronRight, DollarSign, Eye, Heart, HelpCircle, Shield, Tooth } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface BenefitGuideSection {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  content: {
    overview: string;
    coverage: string[];
    howToUse: string[];
    costs: {
      premium?: string;
      deductible?: string;
      copay?: string;
      coinsurance?: string;
    };
    importantNotes: string[];
    examples?: {
      scenario: string;
      explanation: string;
      cost: string;
    }[];
  };
}

interface BenefitsGuideProps {
  sections: BenefitGuideSection[];
  onQuestionPress?: (section: string, question: string) => void;
}

export const BenefitsGuide: React.FC<BenefitsGuideProps> = ({
  sections,
  onQuestionPress
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'overview' | 'coverage' | 'costs' | 'examples'>('overview');

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const renderSectionContent = (section: BenefitGuideSection) => {
    switch (activeTab) {
      case 'overview':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.contentText}>{section.content.overview}</Text>
            
            <View style={styles.importantNotes}>
              <Text style={styles.notesTitle}>Important to Know:</Text>
              {section.content.importantNotes.map((note, index) => (
                <View key={index} style={styles.noteItem}>
                  <CheckCircle size={14} color="#10B981" />
                  <Text style={styles.noteText}>{note}</Text>
                </View>
              ))}
            </View>
          </View>
        );
        
      case 'coverage':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabTitle}>What's Covered:</Text>
            {section.content.coverage.map((item, index) => (
              <View key={index} style={styles.coverageItem}>
                <CheckCircle size={16} color="#10B981" />
                <Text style={styles.coverageText}>{item}</Text>
              </View>
            ))}
            
            <Text style={styles.tabTitle}>How to Use Your Benefits:</Text>
            {section.content.howToUse.map((step, index) => (
              <View key={index} style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
        );
        
      case 'costs':
        return (
          <View style={styles.tabContent}>
            <View style={styles.costsGrid}>
              {Object.entries(section.content.costs).map(([key, value]) => (
                value && (
                  <View key={key} style={styles.costItem}>
                    <Text style={styles.costLabel}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}:
                    </Text>
                    <Text style={styles.costValue}>{value}</Text>
                  </View>
                )
              ))}
            </View>
            
            <View style={styles.costExplanation}>
              <Text style={styles.explanationTitle}>Understanding Your Costs:</Text>
              <View style={styles.explanationItem}>
                <Text style={styles.explanationTerm}>Premium:</Text>
                <Text style={styles.explanationText}>What you pay monthly for coverage</Text>
              </View>
              <View style={styles.explanationItem}>
                <Text style={styles.explanationTerm}>Deductible:</Text>
                <Text style={styles.explanationText}>Amount you pay before insurance kicks in</Text>
              </View>
              <View style={styles.explanationItem}>
                <Text style={styles.explanationTerm}>Copay:</Text>
                <Text style={styles.explanationText}>Fixed amount you pay for services</Text>
              </View>
              <View style={styles.explanationItem}>
                <Text style={styles.explanationTerm}>Coinsurance:</Text>
                <Text style={styles.explanationText}>Percentage you pay after deductible</Text>
              </View>
            </View>
          </View>
        );
        
      case 'examples':
        return (
          <View style={styles.tabContent}>
            {section.content.examples ? (
              section.content.examples.map((example, index) => (
                <View key={index} style={styles.exampleCard}>
                  <Text style={styles.exampleScenario}>{example.scenario}</Text>
                  <Text style={styles.exampleExplanation}>{example.explanation}</Text>
                  <View style={styles.exampleCost}>
                    <DollarSign size={16} color="#10B981" />
                    <Text style={styles.exampleCostText}>{example.cost}</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noExamplesText}>
                No examples available for this benefit type.
              </Text>
            )}
          </View>
        );
        
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Benefits Guide</Text>
        <Text style={styles.subtitle}>
          Everything you need to know about your benefits
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {sections.map((section) => {
          const IconComponent = section.icon;
          const isExpanded = expandedSections.has(section.id);
          
          return (
            <View key={section.id} style={styles.section}>
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() => toggleSection(section.id)}
              >
                <View style={styles.sectionTitleContainer}>
                  <IconComponent size={20} color="#3B82F6" />
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                </View>
                {isExpanded ? (
                  <ChevronDown size={20} color="#6B7280" />
                ) : (
                  <ChevronRight size={20} color="#6B7280" />
                )}
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.sectionContent}>
                  {/* Tab Navigation */}
                  <View style={styles.tabNavigation}>
                    {(['overview', 'coverage', 'costs', 'examples'] as const).map((tab) => (
                      <TouchableOpacity
                        key={tab}
                        style={[
                          styles.tabButton,
                          activeTab === tab && styles.tabButtonActive
                        ]}
                        onPress={() => setActiveTab(tab)}
                      >
                        <Text style={[
                          styles.tabButtonText,
                          activeTab === tab && styles.tabButtonTextActive
                        ]}>
                          {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Tab Content */}
                  {renderSectionContent(section)}
                  
                  {/* Help Button */}
                  <TouchableOpacity
                    style={styles.helpButton}
                    onPress={() => onQuestionPress?.(section.title, 'general')}
                  >
                    <HelpCircle size={16} color="#6B7280" />
                    <Text style={styles.helpButtonText}>
                      Have questions about {section.title.toLowerCase()}?
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}

        {/* Quick Reference Card */}
        <View style={styles.quickReference}>
          <Text style={styles.quickReferenceTitle}>Quick Reference</Text>
          <View style={styles.quickReferenceGrid}>
            <View style={styles.quickReferenceItem}>
              <Heart size={16} color="#EF4444" />
              <Text style={styles.quickReferenceText}>Medical: Call 1-800-HEALTH</Text>
            </View>
            <View style={styles.quickReferenceItem}>
              <Tooth size={16} color="#3B82F6" />
              <Text style={styles.quickReferenceText}>Dental: Call 1-800-DENTAL</Text>
            </View>
            <View style={styles.quickReferenceItem}>
              <Eye size={16} color="#10B981" />
              <Text style={styles.quickReferenceText}>Vision: Call 1-800-VISION</Text>
            </View>
            <View style={styles.quickReferenceItem}>
              <Shield size={16} color="#8B5CF6" />
              <Text style={styles.quickReferenceText}>Claims: portal.benefits.com</Text>
            </View>
          </View>
        </View>

        {/* Contact Support */}
        <View style={styles.supportSection}>
          <Text style={styles.supportTitle}>Need More Help?</Text>
          <Text style={styles.supportText}>
            Our benefits team is here to help you make the most of your coverage.
          </Text>
          <TouchableOpacity style={styles.contactButton}>
            <Text style={styles.contactButtonText}>Contact Benefits Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 12,
  },
  sectionContent: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  tabNavigation: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 2,
    borderBottomColor: '#3B82F6',
  },
  tabButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  tabButtonTextActive: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  tabContent: {
    padding: 16,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#374151',
    marginBottom: 16,
  },
  tabTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
    marginTop: 8,
  },
  importantNotes: {
    backgroundColor: '#EBF4FF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  notesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 8,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  noteText: {
    fontSize: 14,
    color: '#1E40AF',
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  coverageItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  coverageText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  stepText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
    lineHeight: 20,
  },
  costsGrid: {
    gap: 12,
    marginBottom: 16,
  },
  costItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  costLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  costValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  costExplanation: {
    backgroundColor: '#FFFBEB',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  explanationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 8,
  },
  explanationItem: {
    marginBottom: 6,
  },
  explanationTerm: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
  },
  explanationText: {
    fontSize: 12,
    color: '#92400E',
    lineHeight: 16,
  },
  exampleCard: {
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  exampleScenario: {
    fontSize: 14,
    fontWeight: '600',
    color: '#166534',
    marginBottom: 6,
  },
  exampleExplanation: {
    fontSize: 12,
    color: '#166534',
    lineHeight: 16,
    marginBottom: 8,
  },
  exampleCost: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exampleCostText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
    marginLeft: 4,
  },
  noExamplesText: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 16,
  },
  helpButtonText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
  },
  quickReference: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quickReferenceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  quickReferenceGrid: {
    gap: 8,
  },
  quickReferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
  },
  quickReferenceText: {
    fontSize: 12,
    color: '#374151',
    marginLeft: 8,
    fontWeight: '500',
  },
  supportSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  supportTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  supportText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  contactButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});