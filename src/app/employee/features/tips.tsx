import { Activity, BookOpen, Brain, Calendar, ChevronRight, Clock, Heart, Monitor, Moon, Smile, Utensils } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// Update the import path below to the correct location of Footer, for example:
import Footer from '../../../components/Common/layout/Footer';
// Or, if Footer does not exist, create it at ../../../components/Common/layout/Footer.tsx
import Header from '../../../components/Common/layout/Header';

type WellnessTip = {
  id: string;
  title: string;
  content: string;
  category: string;
  icon: React.ReactNode;
  readTime: string;
  liked?: boolean;
  saved?: boolean;
};

type WeeklyFocus = {
  title: string;
  description: string;
  tips: string[];
  action: string;
};

export default function TipsScreen() {
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Sample data - in a real app, this would come from an API or context
  const categories = [
    { id: 'all', name: 'All Tips', icon: <BookOpen size={20} color="#4682B4" /> },
    { id: 'heart', name: 'Heart Health', icon: <Heart size={20} color="#4682B4" /> },
    { id: 'mental', name: 'Mental Health', icon: <Brain size={20} color="#4682B4" /> },
    { id: 'nutrition', name: 'Nutrition', icon: <Utensils size={20} color="#4682B4" /> },
    { id: 'fitness', name: 'Fitness', icon: <Activity size={20} color="#4682B4" /> },
    { id: 'sleep', name: 'Sleep', icon: <Moon size={20} color="#4682B4" /> }
  ];
  
  const weeklyFocus: WeeklyFocus = {
    title: 'Eye Health for Computer Users',
    description: 'Protect your vision with these eye care strategies for those who spend long hours on screens.',
    tips: [
      'Follow the 20-20-20 rule: Every 20 minutes, look at something 20 feet away for 20 seconds.',
      'Position your monitor arm\'s length away and slightly below eye level.',
      'Adjust screen brightness to match your surroundings.',
      'Consider blue light filtering glasses or screen protectors.',
      'Keep artificial tears nearby to combat dry eyes.'
    ],
    action: 'Set Reminder'
  };
  
  // Sample wellness tips
  const wellnessTips: WellnessTip[] = [
    {
      id: '1',
      title: 'The Power of Microbreaks',
      content: 'Taking 5-minute breaks every hour can boost productivity and reduce eye strain. Stand up, stretch, or walk around to reset your focus.',
      category: 'mental',
      icon: <Brain size={24} color="#4682B4" />,
      readTime: '2 min read',
      saved: true
    },
    {
      id: '2',
      title: 'Proper Ergonomic Setup',
      content: 'Position your monitor at eye level, keep your wrists straight when typing, and ensure your feet are flat on the floor to prevent back pain and repetitive strain injuries.',
      category: 'fitness',
      icon: <Monitor size={24} color="#4682B4" />,
      readTime: '3 min read',
      liked: true
    },
    {
      id: '3',
      title: 'Staying Hydrated at Work',
      content: 'Keep a water bottle at your desk and aim to refill it 3-4 times daily. Proper hydration improves concentration and prevents headaches.',
      category: 'nutrition',
      icon: <Utensils size={24} color="#4682B4" />,
      readTime: '2 min read'
    },
    {
      id: '4',
      title: 'Stress Management Techniques',
      content: 'Practice deep breathing exercises throughout your workday. Inhale for 4 counts, hold for 2, and exhale for 6 counts to activate your parasympathetic nervous system.',
      category: 'mental',
      icon: <Brain size={24} color="#4682B4" />,
      readTime: '4 min read'
    },
    {
      id: '5',
      title: 'Improving Sleep Quality',
      content: 'Limit screen time 1-2 hours before bed and create a consistent sleep schedule. Quality sleep is essential for productivity and overall health.',
      category: 'sleep',
      icon: <Moon size={24} color="#4682B4" />,
      readTime: '3 min read'
    },
    {
      id: '6',
      title: 'Heart-Healthy Work Habits',
      content: 'Stand up and move for at least 5 minutes every hour to improve circulation and heart health. Even small movements make a difference in a sedentary job.',
      category: 'heart',
      icon: <Heart size={24} color="#4682B4" />,
      readTime: '3 min read'
    }
  ];
  
  // Filter tips based on selected category
  const filteredTips = wellnessTips.filter(
    tip => activeCategory === 'all' || tip.category === activeCategory
  );
  
  const toggleLike = (id: string) => {
    // In a real app, this would update the state and make an API call
    console.log(`Toggle like for tip ${id}`);
  };
  
  const toggleSave = (id: string) => {
    // In a real app, this would update the state and make an API call
    console.log(`Toggle save for tip ${id}`);
  };
  
  const handleSetReminder = () => {
    // In a real app, this would integrate with the device's calendar or notification system
    console.log('Set reminder for weekly focus');
  };
  
  return (
    <View style={styles.container}>
      <Header title="Wellness Tips" showBackButton/>
      
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[styles.categoryButton, activeCategory === category.id && styles.activeCategoryButton]}
            onPress={() => setActiveCategory(category.id)}
          >
            <View style={styles.categoryIcon}>
              {category.icon}
            </View>
            <Text style={[styles.categoryText, activeCategory === category.id && styles.activeCategoryText]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <ScrollView style={styles.content}>
        <View style={styles.weeklyFocusCard}>
          <View style={styles.weeklyFocusHeader}>
            <View style={styles.weeklyFocusIcon}>
              <Monitor size={24} color="#FFF" />
            </View>
            <View style={styles.weeklyFocusInfo}>
              <Text style={styles.weeklyFocusLabel}>Weekly Focus</Text>
              <Text style={styles.weeklyFocusTitle}>{weeklyFocus.title}</Text>
            </View>
          </View>
          
          <Text style={styles.weeklyFocusDescription}>{weeklyFocus.description}</Text>
          
          {weeklyFocus.tips.map((tip, index) => (
            <View key={index} style={styles.focusTipItem}>
              <Text style={styles.focusTipBullet}>•</Text>
              <Text style={styles.focusTipText}>{tip}</Text>
            </View>
          ))}
          
          <TouchableOpacity 
            style={styles.weeklyFocusAction}
            onPress={handleSetReminder}
          >
            <Clock size={16} color="#FFF" style={styles.actionIcon} />
            <Text style={styles.actionText}>{weeklyFocus.action}</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.sectionTitle}>Workplace Wellness Tips</Text>
        
        {filteredTips.map(tip => (
          <TouchableOpacity key={tip.id} style={styles.tipCard}>
            <View style={styles.tipHeader}>
              <View style={styles.tipTitleContainer}>
                <View style={styles.tipIcon}>
                  {tip.icon}
                </View>
                <Text style={styles.tipTitle}>{tip.title}</Text>
              </View>
              <Text style={styles.readTime}>{tip.readTime}</Text>
            </View>
            
            <Text style={styles.tipContent}>{tip.content}</Text>
            
            <View style={styles.tipActions}>
              <View style={styles.tipMetrics}>
                <TouchableOpacity 
                  style={[styles.tipAction, tip.liked && styles.tipActionActive]}
                  onPress={() => toggleLike(tip.id)}
                >
                  <Smile 
                    size={16} 
                    color={tip.liked ? '#4682B4' : '#666'} 
                    style={styles.tipActionIcon} 
                  />
                  <Text style={[styles.tipActionText, tip.liked && styles.tipActionActiveText]}>
                    Helpful
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.tipAction, tip.saved && styles.tipActionActive]}
                  onPress={() => toggleSave(tip.id)}
                >
                  <BookOpen 
                    size={16} 
                    color={tip.saved ? '#4682B4' : '#666'} 
                    style={styles.tipActionIcon} 
                  />
                  <Text style={[styles.tipActionText, tip.saved && styles.tipActionActiveText]}>
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity style={styles.readMoreButton}>
                <Text style={styles.readMoreText}>Read More</Text>
                <ChevronRight size={16} color="#4682B4" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
        
        <View style={styles.upcomingContainer}>
          <Text style={styles.upcomingTitle}>Coming Up This Week</Text>
          
          <View style={styles.upcomingEvent}>
            <Calendar size={18} color="#4682B4" style={styles.upcomingIcon} />
            <View style={styles.upcomingInfo}>
              <Text style={styles.upcomingName}>Wellness Wednesday Webinar</Text>
              <Text style={styles.upcomingTime}>May 21, 2025 • 12:00 PM</Text>
              <Text style={styles.upcomingDescription}>
                "Mindfulness Techniques for the Workplace" - Join us for a 30-minute session on incorporating mindfulness into your workday.
              </Text>
            </View>
          </View>
          
          <View style={styles.upcomingEvent}>
            <Calendar size={18} color="#4682B4" style={styles.upcomingIcon} />
            <View style={styles.upcomingInfo}>
              <Text style={styles.upcomingName}>Step Challenge Kickoff</Text>
              <Text style={styles.upcomingTime}>May 24, 2025</Text>
              <Text style={styles.upcomingDescription}>
                Our monthly step challenge begins! Set your goals and compete with colleagues for prizes.
              </Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All Events</Text>
            <ChevronRight size={16} color="#4682B4" />
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      <Footer 
        activePath="tips"
        employee={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F9',
  },
  categoriesContainer: {
    maxHeight: 90,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  categoriesContent: {
    padding: 16,
    flexDirection: 'row',
  },
  categoryButton: {
    alignItems: 'center',
    marginRight: 16,
    minWidth: 70,
  },
  activeCategoryButton: {
    opacity: 1,
  },
  categoryIcon: {
    backgroundColor: '#E6F0F9',
    padding: 10,
    borderRadius: 12,
    marginBottom: 6,
  },
  categoryText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  activeCategoryText: {
    color: '#4682B4',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  weeklyFocusCard: {
    backgroundColor: '#4682B4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  weeklyFocusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  weeklyFocusIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 8,
    marginRight: 12,
  },
  weeklyFocusInfo: {
    flex: 1,
  },
  weeklyFocusLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 2,
  },
  weeklyFocusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  weeklyFocusDescription: {
    fontSize: 14,
    color: '#FFF',
    marginBottom: 12,
    lineHeight: 20,
  },
  focusTipItem: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingLeft: 8,
  },
  focusTipBullet: {
    fontSize: 14,
    color: '#FFF',
    marginRight: 8,
  },
  focusTipText: {
    fontSize: 14,
    color: '#FFF',
    flex: 1,
    lineHeight: 20,
  },
  weeklyFocusAction: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    marginRight: 8,
  },
  actionText: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  tipCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  tipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tipTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  tipIcon: {
    backgroundColor: '#E6F0F9',
    borderRadius: 8,
    padding: 8,
    marginRight: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  readTime: {
    fontSize: 12,
    color: '#666',
  },
  tipContent: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 12,
  },
  tipActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
  },
  tipMetrics: {
    flexDirection: 'row',
  },
  tipAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  tipActionActive: {
    opacity: 1,
  },
  tipActionIcon: {
    marginRight: 4,
  },
  tipActionText: {
    fontSize: 12,
    color: '#666',
  },
  tipActionActiveText: {
    color: '#4682B4',
    fontWeight: '500',
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readMoreText: {
    fontSize: 12,
    color: '#4682B4',
    fontWeight: '500',
    marginRight: 4,
  },
  upcomingContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  upcomingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  upcomingEvent: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  upcomingIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  upcomingInfo: {
    flex: 1,
  },
  upcomingName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  upcomingTime: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  upcomingDescription: {
    fontSize: 12,
    color: '#333',
    lineHeight: 18,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: '#4682B4',
    fontWeight: '500',
    marginRight: 4,
  },
});