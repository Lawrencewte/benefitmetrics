// src/components/Common/layout/EmployerFooter.tsx
import { usePathname, useRouter } from 'expo-router';
import {
  BarChart3,
  MessageSquare,
  MoreHorizontal,
  Target
} from 'lucide-react';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const EmployerFooter = () => {
  const router = useRouter();
  const pathname = usePathname();

  const footerTabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      route: '/employer',
      activeRoutes: ['/employer/dashboard', '/employer/']
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      route: '/employer/analytics',
      activeRoutes: ['/employer/analytics']
    },
    {
      id: 'programs',
      label: 'Programs',
      icon: Target,
      route: '/employer/programs',
      activeRoutes: ['/employer/programs', '/employer/program']
    },
    {
      id: 'communications',
      label: 'Communications',
      icon: MessageSquare,
      route: '/employer/communications',
      activeRoutes: ['/employer/communications']
    },
    {
      id: 'more',
      label: 'More',
      icon: MoreHorizontal,
      route: '/employer/more',
      activeRoutes: ['/employer/more', '/employer/settings', '/employer/employees', '/employer/benefits']
    }
  ];

  type FooterTab = {
    id: string;
    label: string;
    icon: React.ComponentType<{ size: number; color: string }>;
    route: string;
    activeRoutes: string[];
  };

  const isTabActive = (tab: FooterTab) => {
    // Check if current pathname starts with any of the tab's active routes
    return tab.activeRoutes.some(route => pathname.startsWith(route));
  };

  const handleTabPress = (route) => {
    router.push(route);
  };

  return (
    <View style={styles.container}>
      {footerTabs.map((tab) => {
        const IconComponent = tab.icon;
        const isActive = isTabActive(tab);
        
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tabItem}
            onPress={() => handleTabPress(tab.route)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, isActive && styles.activeIconContainer]}>
              <IconComponent 
                size={20} 
                color={isActive ? '#8b5cf6' : '#6b7280'} 
              />
            </View>
            <Text style={[
              styles.tabLabel, 
              isActive ? styles.activeTabLabel : styles.inactiveTabLabel
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingVertical: 8,
    paddingHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  iconContainer: {
    marginBottom: 4,
    padding: 2,
  },
  activeIconContainer: {
    // Optional: Add background or border for active state
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  activeTabLabel: {
    color: '#8b5cf6', // Purple color to match employer theme
  },
  inactiveTabLabel: {
    color: '#6b7280',
  },
});

export default EmployerFooter;