import { AlertTriangle, ChevronRight, Eye, Lock, Shield } from 'lucide-react';
import React, { useState } from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import Card from '../ui/Card';

interface PrivacySetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  editable: boolean;
  impactLevel?: 'low' | 'medium' | 'high';
  icon?: React.ReactNode;
  onPress?: () => void;
}

interface PrivacyControlsProps {
  settings: PrivacySetting[];
  onSettingChange: (id: string, enabled: boolean) => void;
  onSettingPress?: (id: string) => void;
}

const PrivacyControls: React.FC<PrivacyControlsProps> = ({
  settings,
  onSettingChange,
  onSettingPress,
}) => {
  // Local state to allow for responsive UI before the parent state updates
  const [localSettings, setLocalSettings] = useState<Record<string, boolean>>(
    settings.reduce((acc, setting) => {
      acc[setting.id] = setting.enabled;
      return acc;
    }, {} as Record<string, boolean>)
  );

  const getImpactColor = (level?: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low':
        return '#10B981'; // green-500
      case 'medium':
        return '#F59E0B'; // amber-500
      case 'high':
        return '#EF4444'; // red-500
      default:
        return '#6B7280'; // gray-500
    }
  };

  const getImpactText = (level?: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low':
        return 'Low Impact';
      case 'medium':
        return 'Medium Impact';
      case 'high':
        return 'High Impact';
      default:
        return 'Unknown Impact';
    }
  };

  const handleSettingChange = (id: string, value: boolean) => {
    setLocalSettings((prev) => ({
      ...prev,
      [id]: value,
    }));
    onSettingChange(id, value);
  };

  const handleSettingPress = (id: string) => {
    if (onSettingPress) {
      onSettingPress(id);
    }
  };

  const renderSettingIcon = (setting: PrivacySetting) => {
    if (setting.icon) return setting.icon;

    // Default icons based on impact level
    switch (setting.impactLevel) {
      case 'low':
        return <Shield width={22} height={22} color="#10B981" />;
      case 'medium':
        return <Eye width={22} height={22} color="#F59E0B" />;
      case 'high':
        return <AlertTriangle width={22} height={22} color="#EF4444" />;
      default:
        return <Lock width={22} height={22} color="#6B7280" />;
    }
  };

  return (
    <View style={styles.container}>
      {settings.map((setting) => (
        <Card key={setting.id} style={styles.settingCard}>
          <TouchableOpacity
            style={styles.settingContainer}
            onPress={() => handleSettingPress(setting.id)}
            disabled={!setting.onPress && !onSettingPress}
          >
            <View style={styles.settingIconContainer}>{renderSettingIcon(setting)}</View>
            
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>{setting.title}</Text>
              <Text style={styles.settingDescription}>{setting.description}</Text>
              
              {setting.impactLevel && (
                <View style={styles.impactContainer}>
                  <View
                    style={[
                      styles.impactIndicator,
                      { backgroundColor: getImpactColor(setting.impactLevel) },
                    ]}
                  />
                  <Text
                    style={[
                      styles.impactText,
                      { color: getImpactColor(setting.impactLevel) },
                    ]}
                  >
                    {getImpactText(setting.impactLevel)}
                  </Text>
                </View>
              )}
            </View>
            
            <View style={styles.settingControl}>
              {setting.editable ? (
                <Switch
                  value={localSettings[setting.id]}
                  onValueChange={(value) => handleSettingChange(setting.id, value)}
                  trackColor={{ false: '#E5E7EB', true: '#BFDBFE' }}
                  thumbColor={localSettings[setting.id] ? '#2563EB' : '#9CA3AF'}
                  ios_backgroundColor="#E5E7EB"
                />
              ) : (
                setting.onPress && <ChevronRight width={20} height={20} color="#9CA3AF" />
              )}
            </View>
          </TouchableOpacity>
        </Card>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  settingCard: {
    marginBottom: 16,
  },
  settingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
    settingContent: {
      flex: 1,
    },
  });