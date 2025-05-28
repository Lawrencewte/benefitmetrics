import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, Bookmark, Calendar, Share, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Button } from '../../../../components/Common/ui/Button';
import { educationService } from '../../../../services/employee/educationService';

interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  publishedDate: string;
  category: string;
  tags: string[];
  imageUrl?: string;
}

export default function ArticleViewer() {
  const route = useRoute();
  const navigation = useNavigation();
  const { params } = route;
  const articleId = params?.id;
  
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (articleId) {
      loadArticle(articleId);
    }
  }, [articleId]);

  const loadArticle = async (id: string) => {
    try {
      setIsLoading(true);
      const articleData = await educationService.getArticleById(id);
      setArticle(articleData);
    } catch (error) {
      console.error('Error loading article:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = () => {
    // Implement sharing functionality
    console.log('Share article:', article?.title);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Implement bookmark functionality
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Text>Loading article...</Text>
      </View>
    );
  }

  if (!article) {
    return (
      <View className="flex-1 bg-white justify-center items-center p-6">
        <Text className="text-lg font-medium mb-4">Article not found</Text>
        <Button
          onPress={() => navigation.goBack()}
          label="Go Back"
          variant="outline"
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <View className="flex-1" />
        <TouchableOpacity onPress={handleShare} className="mr-3">
          <Share size={24} color="#374151" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleBookmark}>
          <Bookmark 
            size={24} 
            color={isBookmarked ? "#3B82F6" : "#374151"}
            fill={isBookmarked ? "#3B82F6" : "none"}
          />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        {/* Article Image */}
        {article.imageUrl && (
          <Image
            source={{ uri: article.imageUrl }}
            className="w-full h-48"
            resizeMode="cover"
          />
        )}

        <View className="p-4">
          {/* Category Badge */}
          <View className="bg-blue-100 px-3 py-1 rounded-full self-start mb-3">
            <Text className="text-blue-800 text-sm font-medium">{article.category}</Text>
          </View>

          {/* Title */}
          <Text className="text-2xl font-bold mb-4">{article.title}</Text>

          {/* Metadata */}
          <View className="flex-row items-center mb-4 space-x-4">
            <View className="flex-row items-center">
              <User size={16} color="#6B7280" />
              <Text className="text-gray-600 text-sm ml-1">{article.author}</Text>
            </View>
            <View className="flex-row items-center">
              <Calendar size={16} color="#6B7280" />
              <Text className="text-gray-600 text-sm ml-1">
                {new Date(article.publishedDate).toLocaleDateString()}
              </Text>
            </View>
          </View>

          {/* Summary */}
          <View className="bg-gray-50 p-4 rounded-lg mb-6">
            <Text className="font-medium mb-2">Summary</Text>
            <Text className="text-gray-700">{article.summary}</Text>
          </View>

          {/* Content */}
          <View className="mb-6">
            <Text className="text-gray-800 leading-6">{article.content}</Text>
          </View>

          {/* Tags */}
          {article.tags.length > 0 && (
            <View className="mb-6">
              <Text className="font-medium mb-2">Tags</Text>
              <View className="flex-row flex-wrap">
                {article.tags.map((tag, index) => (
                  <View key={index} className="bg-gray-100 px-3 py-1 rounded-full mr-2 mb-2">
                    <Text className="text-gray-700 text-sm">{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View className="space-y-3">
            <Button
              onPress={() => navigation.navigate('employee/education')}
              label="More Articles"
              variant="primary"
            />
            <Button
              onPress={() => navigation.navigate('employee/appointments/schedule')}
              label="Schedule Related Appointment"
              variant="outline"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}