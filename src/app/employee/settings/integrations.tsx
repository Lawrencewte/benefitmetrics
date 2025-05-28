import { Calendar, Check, Link, RefreshCw, Smartphone, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from '../../../components/Common/ui/Button';

interface Integration {
  id: string;
  name: string;
  type: 'calendar' | 'health' | 'fitness';
  isConnected: boolean;
  description: string;
  icon: React.ReactNode;
  lastSync?: string;
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
}

export default function IntegrationsSettings() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      type: 'calendar',
      isConnected: true,
      description: 'Sync appointments with your Google Calendar',
      icon: <Calendar size={24} color="#4682B4" />,
      lastSync: '2025-05-21T10:30:00Z',
      status: 'connected',
    },
    {
      id: 'apple-health',
      name: 'Apple Health',
      type: 'health',
      isConnected: false,
      description: 'Import health data from Apple Health app',
      icon: <Smartphone size={24} color="#9CA3AF" />,
      status: 'disconnected',
    },
    {
      id: 'outlook-calendar',
      name: 'Outlook Calendar',
      type: 'calendar',
      isConnected: false,
      description: 'Sync appointments with your Outlook Calendar',
      icon: <Calendar size={24} color="#9CA3AF" />,
      status: 'disconnected',
    },
  ]);

  const handleConnect = async (integrationId: string) => {
    setIntegrations(prev => 
      prev.map(integration =>
        integration.id === integrationId
          ? { ...integration, status: 'syncing' }
          : integration
      )
    );

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIntegrations(prev => 
        prev.map(integration =>
          integration.id === integrationId
            ? { 
                ...integration, 
                isConnected: true, 
                status: 'connected',
                lastSync: new Date().toISOString(),
              }
            : integration
        )
      );
      
      Alert.alert('Success', 'Integration connected successfully!');
    } catch (error) {
      setIntegrations(prev => 
        prev.map(integration =>
          integration.id === integrationId
            ? { ...integration, status: 'error' }
            : integration
        )
      );
      Alert.alert('Error', 'Failed to connect integration.');
    }
  };

  const handleDisconnect = async (integrationId: string) => {
    Alert.alert(
      'Disconnect Integration',
      'Are you sure you want to disconnect this integration?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: () => {
            setIntegrations(prev => 
              prev.map(integration =>
                integration.id === integrationId
                  ? { 
                      ...integration, 
                      isConnected: false, 
                      status: 'disconnected',
                      lastSync: undefined,
                    }
                  : integration
              )
            );
          },
        },
      ]
    );
  };

  const handleSync = async (integrationId: string) => {
    setIntegrations(prev => 
      prev.map(integration =>
        integration.id === integrationId
          ? { ...integration, status: 'syncing' }
          : integration
      )
    );

    try {
      // Simulate sync
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIntegrations(prev => 
        prev.map(integration =>
          integration.id === integrationId
            ? { 
                ...integration, 
                status: 'connected',
                lastSync: new Date().toISOString(),
              }
            : integration
        )
      );
      
      Alert.alert('Success', 'Data synced successfully!');
    } catch (error) {
      setIntegrations(prev => 
        prev.map(integration =>
          integration.id === integrationId
            ? { ...integration, status: 'error' }
            : integration
        )
      );
      Alert.alert('Error', 'Failed to sync data.');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <Check size={20} color="#10B981" />;
      case 'syncing':
        return <RefreshCw size={20} color="#4682B4" />;
      case 'error':
        return <X size={20} color="#EF4444" />;
      default:
        return <Link size={20} color="#9CA3AF" />;
    }
  };

  const formatLastSync = (lastSync?: string) => {
    if (!lastSync) return null;
    
    const date = new Date(lastSync);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Integrations</Text>
        
        <Text style={styles.subtitle}>
          Connect your accounts to automatically sync appointments and health data.
        </Text>

        <View style={styles.integrationsContainer}>
          {integrations.map(integration => (
            <View key={integration.id} style={styles.integrationCard}>
              <View style={styles.integrationHeader}>
                <View style={styles.integrationInfo}>
                  {integration.icon}
                  <Text style={styles.integrationName}>{integration.name}</Text>
                </View>
                {getStatusIcon(integration.status)}
              </View>
              
              <Text style={styles.integrationDescription}>
                {integration.description}
              </Text>
              
              {integration.lastSync && (
                <Text style={styles.lastSyncText}>
                  Last synced: {formatLastSync(integration.lastSync)}
                </Text>
              )}
              
              <View style={styles.buttonRow}>
                {integration.isConnected ? (
                  <>
                    <View style={styles.buttonWrapper}>
                      <Button
                        onPress={() => handleSync(integration.id)}
                        label="Sync Now"
                        variant="outline"
                        size="small"
                        disabled={integration.status === 'syncing'}
                      />
                    </View>
                    <View style={styles.buttonWrapper}>
                      <Button
                        onPress={() => handleDisconnect(integration.id)}
                        label="Disconnect"
                        variant="outline"
                        size="small"
                      />
                    </View>
                  </>
                ) : (
                  <View style={styles.buttonWrapper}>
                    <Button
                      onPress={() => handleConnect(integration.id)}
                      label={integration.status === 'syncing' ? 'Connecting...' : 'Connect'}
                      variant="primary"
                      size="small"
                      disabled={integration.status === 'syncing'}
                    />
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Available Integrations */}
        <View style={styles.futureSection}>
          <Text style={styles.futureSectionTitle}>More Integrations Coming Soon</Text>
          <View style={styles.futureCard}>
            <Text style={styles.futureDescription}>
              We're working on adding more integrations including:
            </Text>
            <View style={styles.futureList}>
              <Text style={styles.futureListItem}>• Fitbit & Garmin fitness trackers</Text>
              <Text style={styles.futureListItem}>• Epic MyChart</Text>
              <Text style={styles.futureListItem}>• Microsoft Teams Calendar</Text>
              <Text style={styles.futureListItem}>• Pharmacy apps</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
    lineHeight: 22,
  },
  integrationsContainer: {
    gap: 16,
  },
  integrationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  integrationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  integrationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  integrationName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1F2937',
    marginLeft: 12,
  },
  integrationDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  lastSyncText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  buttonWrapper: {
    flex: 1,
  },
  futureSection: {
    marginTop: 32,
    marginBottom: 32,
  },
  futureSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  futureCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  futureDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  futureList: {
    gap: 4,
  },
  futureListItem: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});