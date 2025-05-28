// File: app/employee/more.tsx

import { useRouter } from 'expo-router';
import {
  Bell,
  Briefcase,
  Calendar,
  ChevronRight,
  Clock,
  DollarSign,
  Gift,
  Lightbulb,
  TrendingUp,
  Users
} from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MoreItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  category: 'health' | 'family' | 'support';
}

export default function MoreScreen() {
  const router = useRouter();
  
  const moreItems: MoreItem[] = [
    // Health Features
    {
      id: 'benefits',
      title: 'Benefits',
      description: 'View your health benefits and coverage',
      icon: <Briefcase size={24} color="#4682B4" />,
      route: '/employee/benefits',
      category: 'health'
    },
    {
      id: 'checkups',
      title: 'Checkup Timeline',
      description: 'Track your preventative care schedule',
      icon: <Calendar size={24} color="#4682B4" />,
      route: '/employee/appointments/checkups',
      category: 'health'
    },
    {
      id: 'health-score',
      title: 'Health Score',
      description: 'View your overall health metrics',
      icon: <TrendingUp size={24} color="#4682B4" />,
      route: '/employee/features/health-score',
      category: 'health'
    },
    {
      id: 'roi-tracker',
      title: 'ROI Tracker',
      description: 'See your healthcare savings',
      icon: <DollarSign size={24} color="#4682B4" />,
      route: '/employee/features/roi-tracker',
      category: 'health'
    },
    {
      id: 'care-timeline',
      title: 'Care Timeline',
      description: 'Manage your care coordination',
      icon: <Clock size={24} color="#4682B4" />,
      route: '/employee/features/care-timeline',
      category: 'health'
    },
    
    // Family & Rewards
    {
      id: 'family',
      title: 'Family',
      description: 'Manage family member health',
      icon: <Users size={24} color="#4682B4" />,
      route: '/employee/settings/family',
      category: 'family'
    },
    {
      id: 'incentives',
      title: 'Rewards',
      description: 'Redeem your health rewards',
      icon: <Gift size={24} color="#4682B4" />,
      route: '/employee/benefits/incentives',
      category: 'family'
    },
    
    // Support & Info
    {
      id: 'tips',
      title: 'Wellness Tips',
      description: 'Personalized health guidance',
      icon: <Lightbulb size={24} color="#4682B4" />,
      route: '/employee/features/tips',
      category: 'support'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'View and manage notifications',
      icon: <Bell size={24} color="#4682B4" />,
      route: '/employee/settings/notifications',
      category: 'support'
    },
  ];

  const getItemsByCategory = (category: string) => 
    moreItems.filter(item => item.category === category);

  const renderSection = (title: string, items: MoreItem[]) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {items.map(item => (
        <TouchableOpacity
          key={item.id}
          style={styles.item}
          onPress={() => router.push(item.route as any)}
        >
          <View style={styles.itemIcon}>
            {item.icon}
          </View>
          <View style={styles.itemContent}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemDescription}>{item.description}</Text>
          </View>
          <ChevronRight size={20} color="#9CA3AF" />
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>        
        {renderSection('Health Features', getItemsByCategory('health'))}
        {renderSection('Family & Rewards', getItemsByCategory('family'))}
        {renderSection('Support & Info', getItemsByCategory('support'))}
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
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  item: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  itemIcon: {
    marginRight: 16,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  itemDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
});