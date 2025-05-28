import { Bookmark, BookOpen, Clock, FileText, Filter, Search, Star, Video } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

interface Resource {
  id: string;
  title: string;
  type: 'article' | 'video' | 'guide' | 'infographic' | 'webinar';
  category: string;
  description: string;
  readTime?: number;
  duration?: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  views: number;
  isBookmarked: boolean;
  isFeatured: boolean;
  tags: string[];
  publishedDate: string;
  author: string;
  healthScoreImpact?: number;
}

interface ResourceLibraryProps {
  onResourceSelect: (resourceId: string) => void;
  onBookmarkToggle: (resourceId: string) => void;
  searchQuery?: string;
  selectedCategory?: string;
}

export default function ResourceLibrary({
  onResourceSelect,
  onBookmarkToggle,
  searchQuery = '',
  selectedCategory = 'all'
}: ResourceLibraryProps) {
  const [resources] = useState<Resource[]>([
    {
      id: '1',
      title: 'The Complete Guide to Preventative Care',
      type: 'guide',
      category: 'Preventative Care',
      description: 'Everything you need to know about staying ahead of health issues through preventative care and regular screenings.',
      readTime: 12,
      difficulty: 'beginner',
      rating: 4.8,
      views: 1247,
      isBookmarked: false,
      isFeatured: true,
      tags: ['Preventative Care', 'Screenings', 'Annual Physical', 'Health Maintenance'],
      publishedDate: '2025-05-15',
      author: 'Dr. Sarah Johnson',
      healthScoreImpact: 15
    },
    {
      id: '2',
      title: 'Understanding Your Health Insurance Benefits',
      type: 'article',
      category: 'Benefits Education',
      description: 'Navigate your health insurance plan like a pro and maximize your benefits throughout the year.',
      readTime: 8,
      difficulty: 'intermediate',
      rating: 4.6,
      views: 892,
      isBookmarked: true,
      isFeatured: false,
      tags: ['Insurance', 'Benefits', 'Coverage', 'Deductibles', 'Copays'],
      publishedDate: '2025-05-10',
      author: 'Benefits Team',
      healthScoreImpact: 5
    },
    {
      id: '3',
      title: 'Stress Management Techniques for the Workplace',
      type: 'video',
      category: 'Mental Health',
      description: 'Learn practical strategies to manage workplace stress and improve your mental well-being.',
      duration: 18,
      difficulty: 'beginner',
      rating: 4.7,
      views: 2156,
      isBookmarked: false,
      isFeatured: true,
      tags: ['Mental Health', 'Stress Management', 'Workplace Wellness', 'Mindfulness'],
      publishedDate: '2025-05-08',
      author: 'Dr. Michael Chen',
      healthScoreImpact: 10
    },
    {
      id: '4',
      title: 'Nutrition Basics: Eating for Energy and Health',
      type: 'webinar',
      category: 'Nutrition',
      description: 'Join our nutritionist for an interactive session on building healthy eating habits that boost energy and support long-term health.',
      duration: 45,
      difficulty: 'beginner',
      rating: 4.5,
      views: 567,
      isBookmarked: false,
      isFeatured: false,
      tags: ['Nutrition', 'Healthy Eating', 'Energy', 'Wellness'],
      publishedDate: '2025-05-05',
      author: 'Lisa Rodriguez, RD',
      healthScoreImpact: 8
    },
    {
      id: '5',
      title: 'Skin Cancer Prevention and Early Detection',
      type: 'infographic',
      category: 'Cancer Prevention',
      description: 'Visual guide to protecting your skin and recognizing early signs of skin cancer.',
      readTime: 5,
      difficulty: 'beginner',
      rating: 4.9,
      views: 1834,
      isBookmarked: true,
      isFeatured: true,
      tags: ['Cancer Prevention', 'Skin Health', 'Sun Safety', 'Early Detection'],
      publishedDate: '2025-05-03',
      author: 'Dermatology Associates',
      healthScoreImpact: 12
    }
  ]);

  const [filters, setFilters] = useState({
    type: 'all',
    difficulty: 'all',
    duration: 'all'
  });

  const [showFilters, setShowFilters] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article':
        return <FileText size={16} color="#3B82F6" />;
      case 'video':
        return <Video size={16} color="#EF4444" />;
      case 'guide':
        return <BookOpen size={16} color="#10B981" />;
      case 'infographic':
        return <FileText size={16} color="#8B5CF6" />;
      case 'webinar':
        return <Video size={16} color="#F59E0B" />;
      default:
        return <FileText size={16} color="#6B7280" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(localSearchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesType = filters.type === 'all' || resource.type === filters.type;
    const matchesDifficulty = filters.difficulty === 'all' || resource.difficulty === filters.difficulty;
    
    let matchesDuration = true;
    if (filters.duration !== 'all') {
      const time = resource.readTime || resource.duration || 0;
      switch (filters.duration) {
        case 'short':
          matchesDuration = time <= 10;
          break;
        case 'medium':
          matchesDuration = time > 10 && time <= 30;
          break;
        case 'long':
          matchesDuration = time > 30;
          break;
      }
    }
    
    return matchesSearch && matchesCategory && matchesType && matchesDifficulty && matchesDuration;
  });

  const featuredResources = filteredResources.filter(resource => resource.isFeatured);
  const regularResources = filteredResources.filter(resource => !resource.isFeatured);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={12}
        color={i < Math.floor(rating) ? "#F59E0B" : "#D1D5DB"}
        fill={i < Math.floor(rating) ? "#F59E0B" : "none"}
      />
    ));
  };

  const formatTime = (resource: Resource) => {
    if (resource.readTime) {
      return `${resource.readTime} min read`;
    } else if (resource.duration) {
      return `${resource.duration} min watch`;
    }
    return '';
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {/* Search */}
        <View className="flex-row items-center mb-4 bg-white rounded-lg shadow-sm border border-gray-200 p-3">
          <Search size={20} color="#6B7280" />
          <TextInput
            value={localSearchQuery}
            onChangeText={setLocalSearchQuery}
            placeholder="Search resources, topics, tags..."
            className="flex-1 ml-3 text-gray-900"
          />
          <Pressable
            onPress={() => setShowFilters(!showFilters)}
            className="p-1 ml-2"
          >
            <Filter size={20} color="#6B7280" />
          </Pressable>
        </View>

        {/* Filters */}
        {showFilters && (
          <View className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
            <Text className="font-medium text-gray-900 mb-3">Filters</Text>
            
            <View className="space-y-3">
              {/* Type Filter */}
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">Content Type</Text>
                <View className="flex-row flex-wrap gap-2">
                  {['all', 'article', 'video', 'guide', 'infographic', 'webinar'].map((type) => (
                    <Pressable
                      key={type}
                      onPress={() => setFilters(prev => ({ ...prev, type }))}
                      className={`px-3 py-1 rounded-full border ${
                        filters.type === type
                          ? 'bg-blue-600 border-blue-600'
                          : 'bg-white border-gray-300'
                      }`}
                    >
                      <Text className={`text-xs font-medium capitalize ${
                        filters.type === type ? 'text-white' : 'text-gray-700'
                      }`}>
                        {type}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Difficulty Filter */}
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">Difficulty</Text>
                <View className="flex-row space-x-2">
                  {['all', 'beginner', 'intermediate', 'advanced'].map((difficulty) => (
                    <Pressable
                      key={difficulty}
                      onPress={() => setFilters(prev => ({ ...prev, difficulty }))}
                      className={`px-3 py-1 rounded-full border ${
                        filters.difficulty === difficulty
                          ? 'bg-blue-600 border-blue-600'
                          : 'bg-white border-gray-300'
                      }`}
                    >
                      <Text className={`text-xs font-medium capitalize ${
                        filters.difficulty === difficulty ? 'text-white' : 'text-gray-700'
                      }`}>
                        {difficulty}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Duration Filter */}
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">Duration</Text>
                <View className="flex-row space-x-2">
                  {[
                    { key: 'all', label: 'All' },
                    { key: 'short', label: '≤10 min' },
                    { key: 'medium', label: '10-30 min' },
                    { key: 'long', label: '>30 min' }
                  ].map((duration) => (
                    <Pressable
                      key={duration.key}
                      onPress={() => setFilters(prev => ({ ...prev, duration: duration.key }))}
                      className={`px-3 py-1 rounded-full border ${
                        filters.duration === duration.key
                          ? 'bg-blue-600 border-blue-600'
                          : 'bg-white border-gray-300'
                      }`}
                    >
                      <Text className={`text-xs font-medium ${
                        filters.duration === duration.key ? 'text-white' : 'text-gray-700'
                      }`}>
                        {duration.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Featured Resources */}
        {featuredResources.length > 0 && (
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">Featured Resources</Text>
            <View className="space-y-3">
              {featuredResources.map((resource) => (
                <Pressable
                  key={resource.id}
                  onPress={() => onResourceSelect(resource.id)}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
                >
                  <View className="flex-row items-start justify-between mb-3">
                    <View className="flex-1">
                      <View className="flex-row items-center mb-2">
                        {getTypeIcon(resource.type)}
                        <Text className="font-semibold text-gray-900 text-lg ml-2 flex-1">
                          {resource.title}
                        </Text>
                        <Pressable
                          onPress={() => onBookmarkToggle(resource.id)}
                          className="p-1"
                        >
                          <Bookmark
                            size={20}
                            color={resource.isBookmarked ? "#3B82F6" : "#D1D5DB"}
                            fill={resource.isBookmarked ? "#3B82F6" : "none"}
                          />
                        </Pressable>
                      </View>
                      <Text className="text-gray-600 mb-2">{resource.description}</Text>
                    </View>
                  </View>

                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center space-x-3">
                      <View className={`px-2 py-1 rounded-full ${getDifficultyColor(resource.difficulty)}`}>
                        <Text className="text-xs font-medium capitalize">{resource.difficulty}</Text>
                      </View>
                      <View className="flex-row items-center">
                        <Clock size={14} color="#6B7280" />
                        <Text className="text-sm text-gray-600 ml-1">{formatTime(resource)}</Text>
                      </View>
                      <View className="flex-row items-center">
                        {renderStars(resource.rating)}
                        <Text className="text-sm text-gray-600 ml-1">({resource.views})</Text>
                      </View>
                    </View>
                    
                    {resource.healthScoreImpact && (
                      <View className="bg-green-100 px-2 py-1 rounded">
                        <Text className="text-xs font-medium text-green-700">
                          +{resource.healthScoreImpact} pts
                        </Text>
                      </View>
                    )}
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* All Resources */}
        <View>
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            All Resources ({regularResources.length})
          </Text>
          <View className="space-y-3">
            {regularResources.map((resource) => (
              <Pressable
                key={resource.id}
                onPress={() => onResourceSelect(resource.id)}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
              >
                <View className="flex-row items-start justify-between mb-2">
                  <View className="flex-1">
                    <View className="flex-row items-center mb-1">
                      {getTypeIcon(resource.type)}
                      <Text className="font-medium text-gray-900 ml-2 flex-1">
                        {resource.title}
                      </Text>
                      <Pressable
                        onPress={() => onBookmarkToggle(resource.id)}
                        className="p-1"
                      >
                        <Bookmark
                          size={18}
                          color={resource.isBookmarked ? "#3B82F6" : "#D1D5DB"}
                          fill={resource.isBookmarked ? "#3B82F6" : "none"}
                        />
                      </Pressable>
                    </View>
                    <Text className="text-gray-600 text-sm mb-2">{resource.description}</Text>
                  </View>
                </View>

                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center space-x-2">
                    <View className={`px-2 py-1 rounded-full ${getDifficultyColor(resource.difficulty)}`}>
                      <Text className="text-xs font-medium capitalize">{resource.difficulty}</Text>
                    </View>
                    <View className="flex-row items-center">
                      <Clock size={12} color="#6B7280" />
                      <Text className="text-xs text-gray-600 ml-1">{formatTime(resource)}</Text>
                    </View>
                    <View className="flex-row items-center">
                      {renderStars(resource.rating)}
                      <Text className="text-xs text-gray-600 ml-1">({resource.views})</Text>
                    </View>
                  </View>
                  
                  {resource.healthScoreImpact && (
                    <View className="bg-green-100 px-2 py-1 rounded">
                      <Text className="text-xs font-medium text-green-700">
                        +{resource.healthScoreImpact} pts
                      </Text>
                    </View>
                  )}
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Empty State */}
        {filteredResources.length === 0 && (
          <View className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <BookOpen size={48} color="#D1D5DB" className="mx-auto mb-4" />
            <Text className="text-lg font-medium text-gray-900 mb-2">
              No resources found
            </Text>
            <Text className="text-gray-600">
              Try adjusting your search terms or filters
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}