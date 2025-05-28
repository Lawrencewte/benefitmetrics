import { Bell, Copy, Edit, Mail, MessageSquare, Plus, Search } from 'lucide-react-native';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface MessageTemplate {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'push_notification' | 'in_app';
  category: 'wellness' | 'preventative_care' | 'benefits' | 'reminders' | 'challenges';
  subject?: string;
  content: string;
  variables: string[];
  isDefault: boolean;
  usageCount: number;
  lastUsed?: string;
  createdAt: string;
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<MessageTemplate[]>([
    {
      id: '1',
      name: 'Annual Physical Reminder',
      type: 'email',
      category: 'preventative_care',
      subject: 'Time for Your Annual Physical - {employee_name}',
      content: `Hi {employee_name},

It's time to schedule your annual physical exam! This important checkup is:
• 100% covered by your health plan
• Essential for maintaining your health score
• Required to maximize your wellness benefits

Schedule online or call your provider directly.

Best regards,
{company_name} Wellness Team`,
      variables: ['employee_name', 'company_name'],
      isDefault: true,
      usageCount: 45,
      lastUsed: '2025-05-20',
      createdAt: '2025-01-15'
    },
    {
      id: '2',
      name: 'Challenge Invitation',
      type: 'push_notification',
      category: 'challenges',
      content: 'Join the {challenge_name} starting {start_date}! Earn up to {max_points} points.',
      variables: ['challenge_name', 'start_date', 'max_points'],
      isDefault: false,
      usageCount: 12,
      lastUsed: '2025-05-18',
      createdAt: '2025-03-10'
    },
    {
      id: '3',
      name: 'Benefits Expiration Warning',
      type: 'email',
      category: 'benefits',
      subject: 'Use Your Benefits Before They Expire - {days_remaining} Days Left',
      content: `Dear {employee_name},

Your health benefits are set to expire in {days_remaining} days. Don't let these valuable benefits go unused:

Remaining Benefits:
• Wellness Fund: {remaining_wellness_fund}
• Vision Allowance: {remaining_vision}
• Dental Coverage: Available

Schedule your appointments now to maximize your healthcare savings.

Questions? Contact HR at {hr_contact}.`,
      variables: ['employee_name', 'days_remaining', 'remaining_wellness_fund', 'remaining_vision', 'hr_contact'],
      isDefault: true,
      usageCount: 89,
      lastUsed: '2025-05-21',
      createdAt: '2025-01-20'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail size={16} color="#3B82F6" />;
      case 'sms':
        return <MessageSquare size={16} color="#10B981" />;
      case 'push_notification':
        return <Bell size={16} color="#F59E0B" />;
      case 'in_app':
        return <Bell size={16} color="#8B5CF6" />;
      default:
        return <Mail size={16} color="#6B7280" />;
    }
  };

  const getCategoryColors = (category: string) => {
    switch (category) {
      case 'wellness':
        return { bg: '#dcfce7', text: '#166534' };
      case 'preventative_care':
        return { bg: '#dbeafe', text: '#1e40af' };
      case 'benefits':
        return { bg: '#e0e7ff', text: '#5b21b6' };
      case 'reminders':
        return { bg: '#fef3c7', text: '#92400e' };
      case 'challenges':
        return { bg: '#fed7aa', text: '#c2410c' };
      default:
        return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesType = selectedType === 'all' || template.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const duplicateTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      const newTemplate: MessageTemplate = {
        ...template,
        id: Date.now().toString(),
        name: `${template.name} (Copy)`,
        isDefault: false,
        usageCount: 0,
        lastUsed: undefined,
        createdAt: new Date().toISOString()
      };
      setTemplates([...templates, newTemplate]);
    }
  };

  const handleCreateTemplate = () => {
    setShowCreateModal(true);
    console.log('Create new template');
  };

  const handleUseTemplate = (templateId: string) => {
    console.log(`Using template: ${templateId}`);
  };

  const handleEditTemplate = (templateId: string) => {
    console.log(`Editing template: ${templateId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Message Templates</Text>
            <Text style={styles.headerSubtitle}>
              Create and manage communication templates
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleCreateTemplate}
            style={styles.createButton}
          >
            <Plus size={20} color="white" />
            <Text style={styles.createButtonText}>Create Template</Text>
          </TouchableOpacity>
        </View>

        {/* Search and Filters */}
        <View style={styles.filtersCard}>
          <View style={styles.searchContainer}>
            <Search size={20} color="#6B7280" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search templates..."
              style={styles.searchInput}
            />
          </View>

          <View style={styles.filtersContainer}>
            {/* Category Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Category</Text>
              <View style={styles.filterOptions}>
                {['all', 'wellness', 'preventative_care', 'benefits', 'reminders', 'challenges'].map((category) => (
                  <TouchableOpacity
                    key={category}
                    onPress={() => setSelectedCategory(category)}
                    style={[
                      styles.filterOption,
                      selectedCategory === category && styles.selectedFilterOption
                    ]}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      selectedCategory === category && styles.selectedFilterOptionText
                    ]}>
                      {category === 'all' ? 'All' : category.replace('_', ' ')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Type Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Type</Text>
              <View style={styles.filterOptions}>
                {['all', 'email', 'sms', 'push_notification', 'in_app'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => setSelectedType(type)}
                    style={[
                      styles.filterOption,
                      selectedType === type && styles.selectedFilterOption
                    ]}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      selectedType === type && styles.selectedFilterOptionText
                    ]}>
                      {type === 'all' ? 'All' : type.replace('_', ' ')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Templates List */}
        <View style={styles.templatesContainer}>
          {filteredTemplates.map((template) => {
            const categoryColors = getCategoryColors(template.category);
            return (
              <View key={template.id} style={styles.templateCard}>
                <View style={styles.templateContent}>
                  <View style={styles.templateHeader}>
                    <View style={styles.templateTitleArea}>
                      <View style={styles.templateTitleRow}>
                        {getTypeIcon(template.type)}
                        <Text style={styles.templateTitle}>
                          {template.name}
                        </Text>
                        {template.isDefault && (
                          <View style={styles.defaultBadge}>
                            <Text style={styles.defaultBadgeText}>Default</Text>
                          </View>
                        )}
                      </View>
                      
                      <View style={styles.templateMeta}>
                        <View style={[styles.categoryBadge, { backgroundColor: categoryColors.bg }]}>
                          <Text style={[styles.categoryBadgeText, { color: categoryColors.text }]}>
                            {template.category.replace('_', ' ')}
                          </Text>
                        </View>
                        <Text style={styles.typeText}>
                          {template.type.replace('_', ' ')}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.templateActions}>
                      <TouchableOpacity 
                        onPress={() => duplicateTemplate(template.id)}
                        style={styles.actionButton}
                      >
                        <Copy size={20} color="#6B7280" />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        onPress={() => handleEditTemplate(template.id)}
                        style={styles.actionButton}
                      >
                        <Edit size={20} color="#6B7280" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Subject Line (for emails) */}
                  {template.subject && (
                    <View style={styles.subjectSection}>
                      <Text style={styles.sectionLabel}>Subject</Text>
                      <Text style={styles.subjectText}>
                        {template.subject}
                      </Text>
                    </View>
                  )}

                  {/* Content Preview */}
                  <View style={styles.contentSection}>
                    <Text style={styles.sectionLabel}>Content</Text>
                    <Text style={styles.contentText}>
                      {template.content.length > 200 
                        ? `${template.content.substring(0, 200)}...` 
                        : template.content}
                    </Text>
                  </View>

                  {/* Variables */}
                  {template.variables.length > 0 && (
                    <View style={styles.variablesSection}>
                      <Text style={styles.sectionLabel}>Variables</Text>
                      <View style={styles.variablesList}>
                        {template.variables.map((variable, index) => (
                          <View key={index} style={styles.variableBadge}>
                            <Text style={styles.variableText}>
                              {`{${variable}}`}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}

                  {/* Usage Stats */}
                  <View style={styles.statsSection}>
                    <View style={styles.statsContainer}>
                      <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Usage Count</Text>
                        <Text style={styles.statValue}>
                          {template.usageCount}
                        </Text>
                      </View>
                      {template.lastUsed && (
                        <View style={styles.statItem}>
                          <Text style={styles.statLabel}>Last Used</Text>
                          <Text style={styles.statValue}>
                            {new Date(template.lastUsed).toLocaleDateString()}
                          </Text>
                        </View>
                      )}
                    </View>
                    
                    <TouchableOpacity 
                      onPress={() => handleUseTemplate(template.id)}
                      style={styles.useButton}
                    >
                      <Text style={styles.useButtonText}>Use Template</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <View style={styles.emptyState}>
            <Mail size={48} color="#D1D5DB" style={styles.emptyIcon} />
            <Text style={styles.emptyTitle}>
              No templates found
            </Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery || selectedCategory !== 'all' || selectedType !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Create your first message template to get started'}
            </Text>
            <TouchableOpacity
              onPress={handleCreateTemplate}
              style={styles.emptyActionButton}
            >
              <Text style={styles.emptyActionText}>Create Template</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Template Categories */}
        <View style={styles.categoriesCard}>
          <Text style={styles.categoriesTitle}>Popular Template Categories</Text>
          <View style={styles.categoriesGrid}>
            <View style={styles.categoryItem}>
              <Text style={styles.categoryItemTitle}>Preventative Care</Text>
              <Text style={styles.categoryItemDescription}>
                Annual physicals, screenings, vaccinations
              </Text>
            </View>
            <View style={styles.categoryItem}>
              <Text style={styles.categoryItemTitle}>Benefits Reminders</Text>
              <Text style={styles.categoryItemDescription}>
                Use-it-or-lose-it alerts, enrollment periods
              </Text>
            </View>
            <View style={styles.categoryItem}>
              <Text style={styles.categoryItemTitle}>Wellness Challenges</Text>
              <Text style={styles.categoryItemDescription}>
                Step challenges, health goals, competitions
              </Text>
            </View>
            <View style={styles.categoryItem}>
              <Text style={styles.categoryItemTitle}>Health Education</Text>
              <Text style={styles.categoryItemDescription}>
                Seasonal health tips, wellness resources
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
  },
  createButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  createButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  filtersCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#111827',
  },
  filtersContainer: {
    gap: 16,
  },
  filterSection: {
    flex: 1,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: 'white',
  },
  selectedFilterOption: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  filterOptionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    textTransform: 'capitalize',
  },
  selectedFilterOptionText: {
    color: 'white',
  },
  templatesContainer: {
    gap: 16,
  },
  templateCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  templateContent: {
    padding: 16,
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  templateTitleArea: {
    flex: 1,
  },
  templateTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  templateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  defaultBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1e40af',
  },
  templateMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  typeText: {
    fontSize: 14,
    color: '#6b7280',
    textTransform: 'capitalize',
  },
  templateActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  subjectSection: {
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  subjectText: {
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#f9fafb',
    padding: 8,
    borderRadius: 4,
  },
  contentSection: {
    marginBottom: 12,
  },
  contentText: {
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 4,
    lineHeight: 20,
  },
  variablesSection: {
    marginBottom: 12,
  },
  variablesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  variableBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  variableText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#92400e',
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    alignItems: 'flex-start',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  useButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  useButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  emptyState: {
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 32,
    alignItems: 'center',
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyActionButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyActionText: {
    color: 'white',
    fontWeight: '500',
  },
  categoriesCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    padding: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  categoriesTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e40af',
    marginBottom: 12,
  },
  categoriesGrid: {
    gap: 16,
  },
  categoryItem: {
    marginBottom: 8,
  },
  categoryItemTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1d4ed8',
    marginBottom: 4,
  },
  categoryItemDescription: {
    fontSize: 14,
    color: '#2563eb',
  },
});