import { Tabs } from 'expo-router';
import { BarChart3, LayoutDashboard, MessageSquare, Settings, Users } from 'lucide-react-native';
import React from 'react';
import { useColorScheme } from 'react-native';

export default function EmployerLayout() {
  const colorScheme = useColorScheme();
  
  const tintColor = colorScheme === 'dark' ? '#A855F7' : '#8B5CF6';
  const inactiveColor = colorScheme === 'dark' ? '#6B7280' : '#9CA3AF';
  const backgroundColor = colorScheme === 'dark' ? '#1F2937' : '#FFFFFF';
  const borderColor = colorScheme === 'dark' ? '#374151' : '#E5E7EB';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tintColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          backgroundColor: backgroundColor,
          borderTopColor: borderColor,
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 20,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: tintColor,
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <LayoutDashboard size={size} color={color} />
          ),
          headerTitle: 'BenefitMetrics Admin',
        }}
      />
      
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analytics',
          tabBarIcon: ({ color, size }) => (
            <BarChart3 size={size} color={color} />
          ),
          headerTitle: 'Analytics & Reports',
        }}
      />
      
      <Tabs.Screen
        name="programs"
        options={{
          title: 'Programs',
          tabBarIcon: ({ color, size }) => (
            <Users size={size} color={color} />
          ),
          headerTitle: 'Wellness Programs',
        }}
      />
      
      <Tabs.Screen
        name="communications"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ color, size }) => (
            <MessageSquare size={size} color={color} />
          ),
          headerTitle: 'Employee Communications',
        }}
      />
      
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Settings size={size} color={color} />
          ),
          headerTitle: 'Admin Settings',
        }}
      />
      
      {/* Hidden tabs - accessible via navigation but not shown in tab bar */}
      <Tabs.Screen
        name="employees"
        options={{
          href: null, // Hide from tab bar
          headerTitle: 'Employee Management',
        }}
      />
      
      <Tabs.Screen
        name="benefits"
        options={{
          href: null,
          headerTitle: 'Benefits Management',
        }}
      />
    </Tabs>
  );
}