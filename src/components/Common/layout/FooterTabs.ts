import { Award, Calendar, Heart, Settings, User } from 'lucide-react-native';
import React from 'react';

// Define the FooterTabItem interface locally to avoid import issues
export interface FooterTabItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
}

// Create icon components with proper typing
const createIcon = (IconComponent: any, size: number = 20) => {
  return React.createElement(IconComponent, { size, color: undefined });
};

export const EMPLOYEE_TABS: FooterTabItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: createIcon(Heart),
  },
  {
    id: 'appointments', 
    label: 'Appointments',
    icon: createIcon(Calendar),
  },
  {
    id: 'challenges',
    label: 'Challenges', 
    icon: createIcon(Award),
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: createIcon(User),
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: createIcon(Settings),
  },
];

// Route mapping for navigation
export const TAB_ROUTES: Record<string, string> = {
  home: '/employee',
  appointments: '/employee/appointments',
  challenges: '/employee/challenges', 
  profile: '/employee/profile',
  settings: '/employee/settings',
};

// Helper function to get route from tab ID
export const getRouteFromTabId = (tabId: string): string => {
  return TAB_ROUTES[tabId] || '/employee';
};

// Helper function to get active tab from current route
export const getActiveTabFromRoute = (route: string): string => {
  const routeMap: Record<string, string> = {
    '/employee': 'home',
    '/employee/appointments': 'appointments', 
    '/employee/challenges': 'challenges',
    '/employee/profile': 'profile',
    '/employee/settings': 'settings',
  };
  
  return routeMap[route] || 'home';
};