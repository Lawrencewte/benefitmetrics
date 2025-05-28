import {
    Bell,
    CheckCircle,
    Clock,
    Target
} from 'lucide-react-native';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TargetedReminder {
  id: string;
  name: string;
  trigger: {
    type: 'overdue' | 'upcoming' | 'missed' | 'anniversary' | 'custom';
    criteria: {
      service: string;
      daysOverdue?: number;
      daysBefore?: number;
      frequency?: string;
    };
  };
  targeting: {
    departments: string[];
    roles: string[];
    ageRanges: string[];
    riskLevels: string[];
    engagementLevels: string[];
    customFilters: string[];
  };
  message: {
    template: string;
    subject: string;
    content: string;
    personalization: string[];
  };
  delivery: {
    method: 'push' | 'email' | 'both';
    timing: 'immediate' | 'optimal' | 'scheduled';
    frequency: 'once' | 'weekly' | 'monthly';
    maxAttempts: number;
  };
  status: 'active' | 'paused' | 'draft';
  metrics: {
    triggered: number;
    sent: number;
    opened: number;
    actionTaken: number;
    lastTriggered?: string;
  };
  createdAt: string;
}

interface ReminderRule {
  id: string;
  name: string;
  description: string;
  triggerType: string;
  targetCount: number;
  isActive: boolean;
}

export default function TargetedReminder() {
  const [reminders, setReminders] = useState<TargetedReminder[]>([
    {
      id: '1',
      name: 'Overdue Annual Physical',
      trigger: {
        type: 'overdue',
        criteria: {
          service: 'Annual Physical',
          daysOverdue: 30
        }
      },
      targeting: {
        departments: ['All'],
        roles: ['All'],
        ageRanges: ['35+'],
        riskLevels: ['medium', 'high'],
        engagementLevels: ['low', 'medium'],
        customFilters: []
      },
      message: {
        template: 'overdue_care',
        subject: 'Your Annual Physical is Overdue',
        content: 'Hi {FIRST_NAME}, your annual physical was due {DAYS_OVERDUE} days ago. Schedule now to maintain your health benefits and earn wellness points.',
        personalization: ['FIRST_NAME', 'DAYS_OVERDUE', 'HEALTH_SCORE']
      },
      delivery: {
        method: 'both',
        timing: 'optimal',
        frequency: 'weekly',
        maxAttempts: 2
      },
      status: 'active',
      metrics: {
        triggered: 89,
        sent: 89,
        opened: 67,
        actionTaken: 23,
        lastTriggered: '2024-03-14'
      },
      createdAt: '2024-02-01'
    },
    {
      id: '3',
      name: 'Low Engagement Re-activation',
      trigger: {
        type: 'custom',
        criteria: {
          service: 'App Engagement',
          frequency: 'monthly'
        }
      },
      targeting: {
        departments: ['All'],
        roles: ['All'],
        ageRanges: ['All'],
        riskLevels: ['All'],
        engagementLevels: ['low'],
        customFilters: ['no_activity_30_days']
      },
      message: {
        template: 'reengagement',
        subject: 'We Miss You! Let\'s Get Your Health Back on Track',
        content: 'Hi {FIRST_NAME}, we noticed you haven\'t used the app recently. Check out these new features and earn {AVAILABLE_POINTS} points!',
        personalization: ['FIRST_NAME', 'LAST_LOGIN', 'AVAILABLE_POINTS']
      },
      delivery: {
        method: 'push',
        timing: 'optimal',
        frequency: 'monthly',
        maxAttempts: 1
      },
      status: 'paused',
      metrics: {
        triggered: 45,
        sent: 45,
        opened: 18,
        actionTaken: 7,
        lastTriggered: '2024-02-28'
      },
      createdAt: '2024-01-20'
    }
  ]);

  const [rules] = useState<ReminderRule[]>([
    {
      id: '1',
      name: 'Overdue Preventative Care',
      description: 'Remind employees when preventative care is overdue',
      triggerType: 'overdue',
      targetCount: 156,
      isActive: true
    },
    {
      id: '2',
      name: 'Benefits Expiration Alert',
      description: 'Alert employees about expiring benefits',
      triggerType: 'upcoming',
      targetCount: 89,
      isActive: true
    },
    {
      id: '3',
      name: 'Health Score Drop',
      description: 'Notify when health score decreases significantly',
      triggerType: 'custom',
      targetCount: 23,
      isActive: false
    },
    {
      id: '4',
      name: 'Anniversary Checkup',
      description: 'Annual reminder for comprehensive health checkup',
      triggerType: 'anniversary',
      targetCount: 412,
      isActive: true
    }
  ]);

  const [selectedTab, setSelectedTab] = useState<'reminders' | 'rules' | 'analytics'>('reminders');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [newReminder, setNewReminder] = useState<Partial<TargetedReminder>>({
    name: '',
    trigger: {
      type: 'overdue',
      criteria: {
        service: '',
        daysOverdue: 30
      }
    },
    targeting: {
      departments: [],
      roles: [],
      ageRanges: [],
      riskLevels: [],
      engagementLevels: [],
      customFilters: []
    },
    message: {
      template: '',
      subject: '',
      content: '',
      personalization: []
    },
    delivery: {
      method: 'both',
      timing: 'optimal',
      frequency: 'weekly',
      maxAttempts: 3
    },
    status: 'draft'
  });

  const getTriggerColor = (type: string) => {
    switch (type) {
      case 'overdue': return '#ef4444';
      case 'upcoming': return '#f59e0b';
      case 'missed': return '#dc2626';
      case 'anniversary': return '#3b82f6';
      case 'custom': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'paused': return '#f59e0b';
      case 'draft': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const handleReminderAction = (id: string, action: 'pause' | 'activate' | 'edit' | 'delete') => {
    const reminder = reminders.find(r => r.id === id);
    if (!reminder) return;

    switch (action) {
      case 'pause':
        setReminders(reminders.map(r => 
          r.id === id ? { ...r, status: 'paused' } : r
        ));
        Alert.alert('Success', `${reminder.name} has been paused.`);
        break;
      case 'activate':
        setReminders(reminders.map(r => 
          r.id === id ? { ...r, status: 'active' } : r
        ));
        Alert.alert('Success', `${reminder.name} has been activated.`);
        break;
      case 'edit':
        Alert.alert('Edit Reminder', `Opening editor for ${reminder.name}...`);
        break;
      case 'delete':
        Alert.alert(
          'Delete Reminder',
          `Are you sure you want to delete "${reminder.name}"?`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () => {
                setReminders(reminders.filter(r => r.id !== id));
                Alert.alert('Success', 'Reminder deleted successfully.');
              }
            }
          ]
        );
        break;
    }
  };

  const handleCreateReminder = () => {
    if (!newReminder.name || !newReminder.message?.subject) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    const reminder: TargetedReminder = {
      id: Date.now().toString(),
      name: newReminder.name!,
      trigger: newReminder.trigger!,
      targeting: newReminder.targeting!,
      message: newReminder.message!,
      delivery: newReminder.delivery!,
      status: 'draft',
      metrics: {
        triggered: 0,
        sent: 0,
        opened: 0,
        actionTaken: 0
      },
      createdAt: new Date().toISOString().split('T')[0]
    };

    setReminders([...reminders, reminder]);
    setShowCreateForm(false);
    Alert.alert('Success', 'Targeted reminder created successfully.');
  };

  const renderReminderCard = (reminder: TargetedReminder) => {
    const actionRate = reminder.metrics.sent > 0 
      ? (reminder.metrics.actionTaken / reminder.metrics.sent * 100) 
      : 0;
    const openRate = reminder.metrics.sent > 0 
      ? (reminder.metrics.opened / reminder.metrics.sent * 100) 
      : 0;

    return (
      <View key={reminder.id} style={styles.reminderCard}>
        <View style={styles.reminderHeader}>
          <View style={styles.reminderInfo}>
            <View style={styles.reminderTitleRow}>
              <View style={[
                styles.triggerIndicator,
                { backgroundColor: getTriggerColor(reminder.trigger.type) }
              ]} />
              <Text style={styles.reminderName}>{reminder.name}</Text>
              <View style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(reminder.status) }
              ]}>
                <Text style={styles.statusText}>{reminder.status}</Text>
              </View>
            </View>
            
            <Text style={styles.triggerDescription}>
              {reminder.trigger.type === 'overdue' 
                ? `Triggers when ${reminder.trigger.criteria.service} is ${reminder.trigger.criteria.daysOverdue}+ days overdue`
                : reminder.trigger.type === 'upcoming'
                ? `Triggers ${reminder.trigger.criteria.daysBefore} days before ${reminder.trigger.criteria.service} expires`
                : `Custom trigger for ${reminder.trigger.criteria.service}`
              }
            </Text>
            
            <Text style={styles.messagePreview} numberOfLines={2}>
              {reminder.message.content}
            </Text>
          </View>
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{reminder.metrics.triggered}</Text>
            <Text style={styles.metricLabel}>Triggered</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{openRate.toFixed(1)}%</Text>
            <Text style={styles.metricLabel}>Opened</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{actionRate.toFixed(1)}%</Text>
            <Text style={styles.metricLabel}>Action Rate</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{reminder.delivery.frequency}</Text>
            <Text style={styles.metricLabel}>Frequency</Text>
          </View>
        </View>

        <View style={styles.targetingInfo}>
          <Text style={styles.targetingLabel}>Targeting:</Text>
          <Text style={styles.targetingText}>
            {reminder.targeting.departments.includes('All') 
              ? 'All departments' 
              : reminder.targeting.departments.join(', ')
            } • {reminder.targeting.riskLevels.join(', ') || 'All risk levels'}
          </Text>
        </View>

        <View style={styles.reminderActions}>
          {reminder.status === 'active' ? (
            <TouchableOpacity 
              style={styles.pauseButton}
              onPress={() => handleReminderAction(reminder.id, 'pause')}
            >
              <Clock size={16} color="#f59e0b" />
              <Text style={styles.pauseButtonText}>Pause</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.activateButton}
              onPress={() => handleReminderAction(reminder.id, 'activate')}
            >
              <CheckCircle size={16} color="#10b981" />
              <Text style={styles.activateButtonText}>Activate</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => handleReminderAction(reminder.id, 'edit')}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderRulesTab = () => (
    <View style={styles.rulesContainer}>
      <Text style={styles.rulesTitle}>Reminder Rules</Text>
      <Text style={styles.rulesSubtitle}>
        Configure automated reminder triggers based on employee behavior and health data
      </Text>

      <View style={styles.rulesList}>
        {rules.map((rule) => (
          <View key={rule.id} style={styles.ruleCard}>
            <View style={styles.ruleHeader}>
              <View style={styles.ruleInfo}>
                <Text style={styles.ruleName}>{rule.name}</Text>
                <Text style={styles.ruleDescription}>{rule.description}</Text>
              </View>
              <View style={styles.ruleToggle}>
                <View style={[
                  styles.toggleSwitch,
                  rule.isActive && styles.activetoggleSwitch
                ]}>
                  <Text style={[
                    styles.toggleText,
                    rule.isActive && styles.activeToggleText
                  ]}>
                    {rule.isActive ? 'ON' : 'OFF'}
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.ruleStats}>
              <View style={styles.ruleStat}>
                <Target size={16} color="#8b5cf6" />
                <Text style={styles.ruleStatText}>{rule.targetCount} employees</Text>
              </View>
              <View style={styles.ruleStat}>
                <Bell size={16} color="#6b7280" />
                <Text style={styles.ruleStatText}>{rule.triggerType}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderAnalyticsTab = () => (
    <View style={styles.analyticsContainer}>
      <Text style={styles.analyticsTitle}>Reminder Analytics</Text>
      
      <View style={styles.analyticsGrid}>
        <View style={styles.analyticsCard}>
          <Text style={styles.analyticsValue}>847</Text>
          <Text style={styles.analyticsLabel}>Total Reminders Sent</Text>
          <Text style={styles.analyticsChange}>+23% this month</Text>
        </View>
        
        <View style={styles.analyticsCard}>
          <Text style={styles.analyticsValue}>68%</Text>
          <Text style={styles.analyticsLabel}>Average Open Rate</Text>
          <Text style={styles.analyticsChange}>+5% vs last month</Text>
        </View>
        
        <View style={styles.analyticsCard}>
          <Text style={styles.analyticsValue}>34%</Text>
          <Text style={styles.analyticsLabel}>Action Rate</Text>
          <Text style={styles.analyticsChange}>+12% vs last month</Text>
        </View>
        
        <View style={styles.analyticsCard}>
          <Text style={styles.analyticsValue}>156</Text>
          <Text style={styles.analyticsLabel}>Appointments Scheduled</Text>
          <Text style={styles.analyticsChange}>Direct from reminders</Text>
        </View>
      </View>

      <View style={styles.topPerformers}>
        <Text style={styles.topPerformersTitle}>Top Performing Reminders</Text>
        {reminders
          .sort((a, b) => {
            const aRate = a.metrics.sent > 0 ? a.metrics.actionTaken / a.metrics.sent : 0;
            const bRate = b.metrics.sent > 0 ? b.metrics.actionTaken / b.metrics.sent : 0;
            return bRate - aRate;
          })
          .slice(0, 3)
          .map((reminder, index) => {
            const actionRate = reminder.metrics.sent > 0 
              ? (reminder.metrics.actionTaken / reminder.metrics.sent * 100) 
              : 0;
            
            return (
              <View key={reminder.id} style={styles.performerCard}>
                <View style={styles.performerRank}>
                  <Text style={styles.rankNumber}>{index + 1}</Text>
                </View>
                <View style={styles.performerInfo}>
                  <Text style={styles.performerName}>{reminder.name}</Text>
                  <Text style={styles.performerStats}>
                    {actionRate.toFixed(1)}% action rate • {reminder.metrics.triggered} triggered
                  </Text>
                </View>
              </View>
            );
          })
        }
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Targeted Reminders</Text>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => setShowCreateForm(true)}
        >
          <Target size={16} color="#fff" />
          <Text style={styles.createButtonText}>Create Reminder</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabBar}>
        {(['reminders', 'rules', 'analytics'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, selectedTab === tab && styles.activeTab]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text style={[styles.tabText, selectedTab === tab && styles.activeTabText]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content}>
        {selectedTab === 'reminders' && (
          <View style={styles.remindersList}>
            {reminders.map(renderReminderCard)}
          </View>
        )}
        {selectedTab === 'rules' && renderRulesTab()}
        {selectedTab === 'analytics' && renderAnalyticsTab()}
      </ScrollView>
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
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#8b5cf6',
    borderRadius: 8,
  },
  createButtonText: {
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
  remindersList: {
    gap: 16,
  },
  reminderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  reminderHeader: {
    marginBottom: 12,
  },
  reminderInfo: {
    flex: 1,
  },
  reminderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  triggerIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  reminderName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
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
  triggerDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  messagePreview: {
    fontSize: 14,
    color: '#374151',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  metricsRow: {
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
    fontSize: 16,
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
  reminderActions: {
    flexDirection: 'row',
    gap: 8,
  },
  pauseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fef3c7',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  pauseButtonText: {
    fontSize: 12,
    color: '#92400e',
    fontWeight: '500',
  },
  activateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#d1fae5',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#34d399',
  },
  activateButtonText: {
    fontSize: 12,
    color: '#065f46',
    fontWeight: '500',
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
  },
  editButtonText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  rulesContainer: {
    flex: 1,
  },
  rulesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  rulesSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
    lineHeight: 20,
  },
  rulesList: {
    gap: 12,
  },
  ruleCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  ruleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  ruleInfo: {
    flex: 1,
  },
  ruleName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  ruleDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  ruleToggle: {
    marginLeft: 16,
  },
  toggleSwitch: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 12,
  },
  activetoggleSwitch: {
    backgroundColor: '#10b981',
  },
  toggleText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6b7280',
  },
  activeToggleText: {
    color: '#fff',
  },
  ruleStats: {
    flexDirection: 'row',
    gap: 16,
  },
  ruleStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ruleStatText: {
    fontSize: 12,
    color: '#6b7280',
  },
  analyticsContainer: {
    flex: 1,
  },
  analyticsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 20,
  },
  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  analyticsCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  analyticsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  analyticsLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  analyticsChange: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '500',
  },
  topPerformers: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  topPerformersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  performerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  performerRank: {
    width: 32,
    height: 32,
    backgroundColor: '#8b5cf6',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  performerInfo: {
    flex: 1,
  },
  performerName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  performerStats: {
    fontSize: 12,
    color: '#6b7280',
  },
});