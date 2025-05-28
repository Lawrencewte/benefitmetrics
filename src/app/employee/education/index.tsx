import { Link } from 'expo-router';
import { ArrowRight, BookOpen, Briefcase, Clock, FileText, Heart, Search, Star, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Footer from '../../../components/Common/layout/Footer';
import Header from '../../../components/Common/layout/Header';

type ResourceCategory = {
  id: string;
  name: string;
  icon: React.ReactNode;
};

type Resource = {
  id: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  featured?: boolean;
  new?: boolean;
  slug: string;
};

export default function EducationResourcesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Sample data - in a real app, this would come from an API or context
  const categories: ResourceCategory[] = [
    { id: 'all', name: 'All Resources', icon: <BookOpen size={20} color="#4682B4" /> },
    { id: 'preventative', name: 'Preventative Care', icon: <Heart size={20} color="#4682B4" /> },
    { id: 'benefits', name: 'Benefits Education', icon: <Briefcase size={20} color="#4682B4" /> },
    { id: 'wellness', name: 'Wellness', icon: <User size={20} color="#4682B4" /> },
  ];

  const resources: Resource[] = [
    {
      id: '1',
      title: 'Understanding Your Preventative Care Benefits',
      description: 'Learn about all the preventative care services covered by your health insurance plan at no cost to you.',
      category: 'benefits',
      readTime: '5 min read',
      featured: true,
      slug: 'understanding-preventative-benefits'
    },
    {
      id: '2',
      title: 'The Importance of Annual Check-ups',
      description: 'Why annual physical examinations are critical for early detection and prevention of health issues.',
      category: 'preventative',
      readTime: '4 min read',
      slug: 'importance-annual-checkups'
    },
    {
      id: '3',
      title: 'Maximizing Your Health Savings Account (HSA)',
      description: 'Strategies to make the most of your HSA for both current healthcare needs and long-term savings.',
      category: 'benefits',
      readTime: '6 min read',
      slug: 'maximizing-hsa'
    },
    {
      id: '4',
      title: 'Recommended Screenings by Age and Gender',
      description: 'A comprehensive guide to preventative screenings recommended at different life stages.',
      category: 'preventative',
      readTime: '7 min read',
      new: true,
      slug: 'recommended-screenings'
    },
    {
      id: '5',
      title: 'Stress Management in the Workplace',
      description: 'Effective techniques to manage work-related stress and prevent burnout.',
      category: 'wellness',
      readTime: '5 min read',
      slug: 'stress-management'
    },
    {
      id: '6',
      title: 'Understanding Your Flexible Spending Account (FSA)',
      description: 'How to utilize your FSA effectively and avoid forfeiting funds at year-end.',
      category: 'benefits',
      readTime: '4 min read',
      slug: 'understanding-fsa'
    },
    {
      id: '7',
      title: 'Creating a Balanced Nutrition Plan',
      description: 'Guidelines for developing a nutrition plan that supports your health goals and prevents chronic conditions.',
      category: 'wellness',
      readTime: '6 min read',
      slug: 'balanced-nutrition'
    }
  ];

  // Filter resources based on search query and active category
  const filteredResources = resources.filter(resource => {
    const matchesSearch = searchQuery === '' || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === 'all' || resource.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Separate featured resources
  const featuredResources = filteredResources.filter(resource => resource.featured);
  const regularResources = filteredResources.filter(resource => !resource.featured);

  return (
    <View style={styles.container}>
      <Header title="Education Resources" />
      
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={16} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search resources..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      
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
        {featuredResources.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Featured Resources</Text>
            
            {featuredResources.map(resource => (
              <Link 
                key={resource.id} 
                href={`/employee/education/articles/${resource.slug}`}
                asChild
              >
                <TouchableOpacity style={styles.featuredCard}>
                  <View style={styles.featuredBadge}>
                    <Star size={12} color="#FFF" />
                    <Text style={styles.featuredBadgeText}>Featured</Text>
                  </View>
                  
                  <Text style={styles.featuredTitle}>{resource.title}</Text>
                  <Text style={styles.featuredDescription}>{resource.description}</Text>
                  
                  <View style={styles.resourceMeta}>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryBadgeText}>{resource.category}</Text>
                    </View>
                    <View style={styles.readTimeContainer}>
                      <Clock size={12} color="#666" style={styles.readTimeIcon} />
                      <Text style={styles.readTimeText}>{resource.readTime}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.readMoreLink}>
                    <Text style={styles.readMoreText}>Read More</Text>
                    <ArrowRight size={14} color="#4682B4" />
                  </View>
                </TouchableOpacity>
              </Link>
            ))}
          </>
        )}
        
        {regularResources.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>All Resources</Text>
            
            {regularResources.map(resource => (
              <Link 
                key={resource.id} 
                href={`/employee/education/articles/${resource.slug}`}
                asChild
              >
                <TouchableOpacity style={styles.resourceCard}>
                  <View style={styles.resourceHeader}>
                    <View style={styles.resourceTitleContainer}>
                      <Text style={styles.resourceTitle}>{resource.title}</Text>
                      {resource.new && (
                        <View style={styles.newBadge}>
                          <Text style={styles.newBadgeText}>New</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  
                  <Text style={styles.resourceDescription}>{resource.description}</Text>
                  
                  <View style={styles.resourceFooter}>
                    <View style={styles.resourceMeta}>
                      <View style={styles.categoryBadge}>
                        <Text style={styles.categoryBadgeText}>{resource.category}</Text>
                      </View>
                      <View style={styles.readTimeContainer}>
                        <Clock size={12} color="#666" style={styles.readTimeIcon} />
                        <Text style={styles.readTimeText}>{resource.readTime}</Text>
                      </View>
                    </View>
                    <ArrowRight size={16} color="#4682B4" />
                  </View>
                </TouchableOpacity>
              </Link>
            ))}
          </>
        )}
        
        {filteredResources.length === 0 && (
          <View style={styles.emptyState}>
            <FileText size={48} color="#DDD" />
            <Text style={styles.emptyStateTitle}>No Resources Found</Text>
            <Text style={styles.emptyStateText}>
              We couldn't find any resources matching your search. Try adjusting your search terms or categories.
            </Text>
            <TouchableOpacity 
              style={styles.resetButton}
              onPress={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
            >
              <Text style={styles.resetButtonText}>Show All Resources</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>Looking for Something Specific?</Text>
          <Text style={styles.suggestionsText}>
            Browse our additional resource collections or contact our benefits team for personalized assistance.
          </Text>
          
          <View style={styles.suggestionsButtons}>
            <Link href="/employee/education/benefits-guides" asChild>
              <TouchableOpacity style={styles.suggestionButton}>
                <Text style={styles.suggestionButtonText}>Benefits Guides</Text>
              </TouchableOpacity>
            </Link>
            
            <Link href="/employee/education/provider-directory" asChild>
              <TouchableOpacity style={styles.suggestionButton}>
                <Text style={styles.suggestionButtonText}>Provider Directory</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
      
      <Footer 
        activePath="education"
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
  searchContainer: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7F9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
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
    minWidth: 80,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 4,
  },
  featuredCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    position: 'relative',
  },
  featuredBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#4682B4',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredBadgeText: {
    fontSize: 10,
    color: '#FFF',
    fontWeight: '500',
    marginLeft: 4,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    paddingRight: 80, // Space for the badge
  },
  featuredDescription: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 12,
  },
  resourceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: '#E6F0F9',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 12,
  },
  categoryBadgeText: {
    fontSize: 10,
    color: '#4682B4',
    fontWeight: '500',
  },
  readTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readTimeIcon: {
    marginRight: 4,
  },
  readTimeText: {
    fontSize: 10,
    color: '#666',
  },
  readMoreLink: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  readMoreText: {
    fontSize: 12,
    color: '#4682B4',
    fontWeight: '500',
    marginRight: 4,
  },
  resourceCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  resourceHeader: {
    marginBottom: 8,
  },
  resourceTitleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  newBadge: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 6,
    marginTop: 2,
  },
  newBadgeText: {
    fontSize: 10,
    color: '#4CAF50',
    fontWeight: '500',
  },
  resourceDescription: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 12,
  },
  resourceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 16,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  resetButton: {
    backgroundColor: '#4682B4',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  resetButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
  suggestionsContainer: {
    backgroundColor: '#E6F0F9',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#C9DEF0',
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4682B4',
    marginBottom: 8,
  },
  suggestionsText: {
    fontSize: 14,
    color: '#4682B4',
    lineHeight: 20,
    marginBottom: 12,
  },
  suggestionsButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionButton: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#4682B4',
  },
  suggestionButtonText: {
    fontSize: 12,
    color: '#4682B4',
    fontWeight: '500',
  },
});