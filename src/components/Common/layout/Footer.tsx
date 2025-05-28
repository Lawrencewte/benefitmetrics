import { router } from 'expo-router';
import { Award, Calendar, Heart, Settings, User } from 'lucide-react-native';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface FooterTabItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  route: string;
}

interface FooterProps {
  activeTab?: string;
  backgroundColor?: string;
  activeColor?: string;
  inactiveColor?: string;
  style?: any;
}

// Universal tab configuration for all employee screens
export const EMPLOYEE_TABS: FooterTabItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: <Heart size={20} />,
    route: '/employee',
  },
  {
    id: 'appointments',
    label: 'Appointments', 
    icon: <Calendar size={20} />,
    route: '/employee/appointments',
  },
  {
    id: 'challenges',
    label: 'Challenges',
    icon: <Award size={20} />,
    route: '/employee/challenges',
  },
  {
    id: 'more',
    label: 'More',
    icon: <User size={20} />,
    route: '/employee/more',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings size={20} />,
    route: '/employee/settings',
  },
];

const Footer: React.FC<FooterProps> = ({
  activeTab = 'home',
  backgroundColor = '#FFFFFF',
  activeColor = '#4682B4',
  inactiveColor = '#6B7280',
  style,
}) => {
  const insets = useSafeAreaInsets();

  const handleTabPress = (tabId: string) => {
    const tab = EMPLOYEE_TABS.find(t => t.id === tabId);
    if (tab) {
      router.push(tab.route);
    }
  };

  const cloneIconWithColor = (icon: React.ReactNode, color: string) => {
    if (React.isValidElement(icon)) {
      try {
        return React.cloneElement(icon, { 
          color,
          style: { color }
        } as any);
      } catch (error) {
        return (
          <View>
            {icon}
          </View>
        );
      }
    }
    return icon;
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
          paddingBottom: Platform.OS === 'ios' ? insets.bottom : 0,
          borderTopColor: '#E5E7EB',
        },
        style,
      ]}
    >
      <View style={styles.tabContainer}>
        {EMPLOYEE_TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          const color = isActive ? activeColor : inactiveColor;

          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tab}
              onPress={() => handleTabPress(tab.id)}
              activeOpacity={0.7}
            >
              <View style={styles.tabContent}>
                {cloneIconWithColor(tab.icon, color)}
                <Text
                  style={[
                    styles.tabLabel,
                    {
                      color,
                      fontWeight: isActive ? '600' : '400',
                    },
                  ]}
                >
                  {tab.label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

// Helper function to determine active tab from current route
export const getActiveTabFromRoute = (pathname: string): string => {
  if (pathname.includes('/appointments')) return 'appointments';
  if (pathname.includes('/challenges')) return 'challenges';
  if (pathname.includes('/more')) return 'more';
  if (pathname.includes('/settings')) return 'settings';
  return 'home';
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default Footer;