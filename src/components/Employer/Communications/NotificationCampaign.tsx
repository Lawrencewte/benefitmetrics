import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import { 
  Send, 
  Users, 
  Calendar, 
  Target, 
  Bell,
  Eye,
  Clock,
  CheckCircle,
  X,
  Plus,
  Filter
} from 'lucide-react-native';

interface NotificationCampaign {
  id: string;
  name: string;
  type: 'reminder' | 'announcement' | 'challenge' | 'wellness' | 'benefits';
  status: 'draft' | 'scheduled' | 'sent' | 'active';
  subject: string;
  message: string;
  targetAudience: {
    departments: string[];
    roles: string[];
    ageRanges: string[];
    healthRiskLevels: string[];
    engagementLevels: string[];
  };
  delivery: {
    method: 'push' | 'email' | 'both';
    timing: 'immediate' | 'scheduled' | 'recurring';
    scheduledFor?: string;
    recurrence?: {
      frequency: 'daily' | 'weekly' | 'monthly';
      interval: number;
      endDate?: string;
    };
  };
  metrics: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    engaged: number;
  };
  createdAt: string;
  createdBy: string;
}

interface CampaignTemplate {
  id: string;
  name: string;
  type: string;
  subject: string;
  message: string;
  category: string;
}

export default function NotificationCampaign() {
  const [campaigns, setCampaigns] = useState<NotificationCampaign[]>([
    {
      id: '1',
      name: 'Annual Physical Reminder',
      type: 'reminder',
      status: 'active',
      subject: 'Time for Your Annual Physical',
      message: 'Your annual physical is due. Schedule now to maintain your health score and earn rewards.',
      targetAudience: {
        departments: ['All'],
        roles: ['All'],
        ageRanges: ['All'],
        healthRiskLevels: ['medium', 'high'],
        engagementLevels: ['low', 'medium']
      },
      delivery: {
        method: 'both',
        timing: 'immediate'
      },
      metrics: {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        engaged: 0
      },
      createdAt: '2024-01-01',
      createdBy: 'Admin'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'scheduled': return '#f59e0b';
      case 'sent': return '#3b82f6';
      case 'draft': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'reminder': return Bell;
      case 'announcement': return Users;
      case 'challenge': return Target;
      case 'wellness': return CheckCircle;
      case 'benefits': return Calendar;
      default: return Bell;
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => campaign.status === activeTab);

  const handleCreateCampaign = () => {
    if (!newCampaign.name || !newCampaign.subject || !newCampaign.message) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    const campaign: NotificationCampaign = {
      id: Date.now().toString(),
      name: newCampaign.name!,
      type: newCampaign.type!,
      status: 'draft',
      subject: newCampaign.subject!,
      message: newCampaign.message!,
      targetAudience: newCampaign.targetAudience!,
      delivery: newCampaign.delivery!,
      metrics: {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        engaged: 0
      },
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: 'Current User'
    };

    setCampaigns([...campaigns, campaign]);
    setNewCampaign({
      name: '',
      type: 'reminder',
      subject: '',
      message: '',
      targetAudience: {
        departments: [],
        roles: [],
        ageRanges: [],
        healthRiskLevels: [],
        engagementLevels: []
      },
      delivery: {
        method: 'both',
        timing: 'immediate'
      }
    });
    setShowCreateForm(false);
    Alert.alert('Success', 'Campaign created successfully.');
  };

  const handleCampaignAction = (campaignId: string, action: 'send' | 'schedule' | 'duplicate' | 'delete') => {
    const campaign = campaigns.find(c => c.id === campaignId);
    if (!campaign) return;

    switch (action) {
      case 'send':
        Alert.alert(
          'Send Campaign',
          `Are you sure you want to send "${campaign.name}" now?`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Send',
              onPress: () => {
                setCampaigns(campaigns.map(c => 
                  c.id === campaignId ? { ...c, status: 'sent' } : c
                ));
                Alert.alert('Success', 'Campaign sent successfully.');
              }
            }
          ]
        );
        break;
      case 'schedule':
        Alert.alert('Schedule Campaign', 'Opening scheduling options...');
        break;
      case 'duplicate':
        const duplicatedCampaign = {
          ...campaign,
          id: `${campaign.id}_copy_${Date.now()}`,
          name: `${campaign.name} (Copy)`,
          status: 'draft' as const,
          metrics: {
            sent: 0,
            delivered: 0,
            opened: 0,
            clicked: 0,
            engaged: 0
          },
          createdAt: new Date().toISOString().split('T')[0]
        };
        setCampaigns([...campaigns, duplicatedCampaign]);
        Alert.alert('Success', 'Campaign duplicated successfully.');
        break;
      case 'delete':
        Alert.alert(
          'Delete Campaign',
          `Are you sure you want to delete "${campaign.name}"?`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () => {
                setCampaigns(campaigns.filter(c => c.id !== campaignId));
                Alert.alert('Success', 'Campaign deleted successfully.');
              }
            }
          ]
        );
        break;
    }
  };

  const renderCampaignCard = (campaign: NotificationCampaign) => {
    const TypeIcon = getTypeIcon(campaign.type);
    const openRate = campaign.metrics.sent > 0 ? (campaign.metrics.opened / campaign.metrics.sent * 100) : 0;
    const clickRate = campaign.metrics.opened > 0 ? (campaign.metrics.clicked / campaign.metrics.opened * 100) : 0;

    return (
      <View key={campaign.id} style={styles.campaignCard}>
        <View style={styles.campaignHeader}>
          <View style={styles.campaignInfo}>
            <View style={styles.campaignTitleRow}>
              <TypeIcon size={20} color="#8b5cf6" />
              <Text style={styles.campaignName}>{campaign.name}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(campaign.status) }]}>
                <Text style={styles.statusText}>{campaign.status}</Text>
              </View>
            </View>
            <Text style={styles.campaignSubject}>{campaign.subject}</Text>
            <Text style={styles.campaignMessage} numberOfLines={2}>{campaign.message}</Text>
          </View>
        </View>

        {campaign.status === 'sent' || campaign.status === 'active' ? (
          <View style={styles.metricsContainer}>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{campaign.metrics.sent}</Text>
              <Text style={styles.metricLabel}>Sent</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{openRate.toFixed(1)}%</Text>
              <Text style={styles.metricLabel}>Opened</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{clickRate.toFixed(1)}%</Text>
              <Text style={styles.metricLabel}>Clicked</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{campaign.metrics.engaged}</Text>
              <Text style={styles.metricLabel}>Engaged</Text>
            </View>
          </View>
        ) : (
          <View style={styles.targetingInfo}>
            <Text style={styles.targetingLabel}>Target Audience:</Text>
            <Text style={styles.targetingText}>
              {campaign.targetAudience.departments.includes('All') 
                ? 'All Departments' 
                : campaign.targetAudience.departments.join(', ')
              }
            </Text>
          </View>
        )}

        <View style={styles.campaignActions}>
          {campaign.status === 'draft' && (
            <>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleCampaignAction(campaign.id, 'send')}
              >
                <Send size={16} color="#fff" />
                <Text style={styles.actionButtonText}>Send Now</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={() => handleCampaignAction(campaign.id, 'schedule')}
              >
                <Calendar size={16} color="#8b5cf6" />
                <Text style={styles.secondaryButtonText}>Schedule</Text>
              </TouchableOpacity>
            </>
          )}
          
          {campaign.status === 'scheduled' && (
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleCampaignAction(campaign.id, 'send')}
            >
              <Send size={16} color="#fff" />
              <Text style={styles.actionButtonText}>Send Now</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => handleCampaignAction(campaign.id, 'duplicate')}
          >
            <Plus size={16} color="#6b7280" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => setSelectedCampaign(campaign.id)}
          >
            <Eye size={16} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderCreateForm = () => (
    <View style={styles.createForm}>
      <View style={styles.formHeader}>
        <Text style={styles.formTitle}>Create New Campaign</Text>
        <TouchableOpacity onPress={() => setShowCreateForm(false)}>
          <X size={24} color="#6b7280" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.formContent}>
        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Campaign Name *</Text>
          <TextInput
            style={styles.textInput}
            value={newCampaign.name}
            onChangeText={(text) => setNewCampaign({...newCampaign, name: text})}
            placeholder="Enter campaign name"
          />
        </View>

        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Type</Text>
          <View style={styles.typeSelector}>
            {['reminder', 'announcement', 'challenge', 'wellness', 'benefits'].map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeOption,
                  newCampaign.type === type && styles.selectedTypeOption
                ]}
                onPress={() => setNewCampaign({...newCampaign, type: type as any})}
              >
                <Text style={[
                  styles.typeOptionText,
                  newCampaign.type === type && styles.selectedTypeOptionText
                ]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Subject *</Text>
          <TextInput
            style={styles.textInput}
            value={newCampaign.subject}
            onChangeText={(text) => setNewCampaign({...newCampaign, subject: text})}
            placeholder="Enter subject line"
          />
        </View>

        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Message *</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            value={newCampaign.message}
            onChangeText={(text) => setNewCampaign({...newCampaign, message: text})}
            placeholder="Enter message content"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Delivery Method</Text>
          <View style={styles.deliverySelector}>
            {['push', 'email', 'both'].map((method) => (
              <TouchableOpacity
                key={method}
                style={[
                  styles.deliveryOption,
                  newCampaign.delivery?.method === method && styles.selectedDeliveryOption
                ]}
                onPress={() => setNewCampaign({
                  ...newCampaign, 
                  delivery: {...newCampaign.delivery!, method: method as any}
                })}
              >
                <Text style={[
                  styles.deliveryOptionText,
                  newCampaign.delivery?.method === method && styles.selectedDeliveryOptionText
                ]}>
                  {method === 'both' ? 'Push + Email' : method.charAt(0).toUpperCase() + method.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.templatesSection}>
          <Text style={styles.templatesTitle}>Quick Templates</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.templatesList}>
              {templates.map((template) => (
                <TouchableOpacity
                  key={template.id}
                  style={styles.templateCard}
                  onPress={() => {
                    setNewCampaign({
                      ...newCampaign,
                      subject: template.subject,
                      message: template.message,
                      type: template.type as any
                    });
                  }}
                >
                  <Text style={styles.templateName}>{template.name}</Text>
                  <Text style={styles.templateCategory}>{template.category}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </ScrollView>

      <View style={styles.formActions}>
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => setShowCreateForm(false)}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.createButton}
          onPress={handleCreateCampaign}
        >
          <Text style={styles.createButtonText}>Create Campaign</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notification Campaigns</Text>
        <TouchableOpacity 
          style={styles.createNewButton}
          onPress={() => setShowCreateForm(true)}
        >
          <Plus size={16} color="#fff" />
          <Text style={styles.createNewButtonText}>Create Campaign</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabBar}>
        {(['active', 'draft', 'scheduled', 'sent'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)} ({campaigns.filter(c => c.status === tab).length})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content}>
        {filteredCampaigns.length > 0 ? (
          <View style={styles.campaignsList}>
            {filteredCampaigns.map(renderCampaignCard)}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Bell size={48} color="#d1d5db" />
            <Text style={styles.emptyStateTitle}>No {activeTab} campaigns</Text>
            <Text style={styles.emptyStateText}>
              {activeTab === 'draft' 
                ? 'Create your first campaign to get started'
                : `No ${activeTab} campaigns found`
              }
            </Text>
          </View>
        )}
      </ScrollView>

      {showCreateForm && renderCreateForm()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  createNewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#8b5cf6',
    borderRadius: 8,
  },
  createNewButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#8b5cf6',
  },
  tabText: {
    fontSize: 14,
    color: '#6b7280',
  },
  activeTabText: {
    color: '#8b5cf6',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  campaignsList: {
    gap: 16,
  },
  campaignCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  campaignHeader: {
    marginBottom: 12,
  },
  campaignInfo: {
    flex: 1,
  },
  campaignTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  campaignName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  campaignSubject: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  campaignMessage: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  metricItem: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  metricLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  targetingInfo: {
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  targetingLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  targetingText: {
    fontSize: 14,
    color: '#6b7280',
  },
  campaignActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    backgroundColor: '#8b5cf6',
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  secondaryButtonText: {
    fontSize: 14,
    color: '#8b5cf6',
    fontWeight: '500',
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  createForm: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    zIndex: 1000,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  formContent: {
    flex: 1,
    padding: 16,
  },
  formField: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  selectedTypeOption: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
  },
  typeOptionText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  selectedTypeOptionText: {
    color: '#fff',
  },
  deliverySelector: {
    flexDirection: 'row',
    gap: 8,
  },
  deliveryOption: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  selectedDeliveryOption: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
  },
  deliveryOptionText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  selectedDeliveryOptionText: {
    color: '#fff',
  },
  templatesSection: {
    marginTop: 20,
  },
  templatesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  templatesList: {
    flexDirection: 'row',
    gap: 12,
  },
  templateCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    width: 140,
  },
  templateName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  templateCategory: {
    fontSize: 12,
    color: '#6b7280',
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  createButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#8b5cf6',
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
});

  const [templates] = useState<CampaignTemplate[]>([
    {
      id: '1',
      name: 'Preventative Care Reminder',
      type: 'reminder',
      subject: 'Don\'t Forget Your {SERVICE_TYPE}',
      message: 'Hi {FIRST_NAME}, your {SERVICE_TYPE} is due. Schedule now to stay on track with your health goals.',
      category: 'Health Reminders'
    },
    {
      id: '2',
      name: 'Benefits Expiration Alert',
      type: 'benefits',
      subject: 'Your {BENEFIT_TYPE} Benefits Expire Soon',
      message: 'Use your {BENEFIT_TYPE} benefits before they expire on {EXPIRATION_DATE}. Schedule your appointment today.',
      category: 'Benefits'
    },
    {
      id: '3',
      name: 'Wellness Challenge Launch',
      type: 'challenge',
      subject: 'New Challenge: {CHALLENGE_NAME}',
      message: 'Join our latest wellness challenge and earn up to {POINTS} points! Challenge starts {START_DATE}.',
      category: 'Challenges'
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'active' | 'draft' | 'scheduled' | 'sent'>('active');

  const [newCampaign, setNewCampaign] = useState<Partial<NotificationCampaign>>({
    name: '',
    type: 'reminder',
    subject: '',
    message: '',
    targetAudience: {
      departments: [],
      roles: [],
      ageRanges: [],
      healthRiskLevels: [],
      engagementLevels: []
    },
    delivery: {
      method: 'both',
      timing: 'immediate'