import { ArrowLeft, Bookmark, BookmarkCheck, Clock, Heart, HeartHandshake, Share2, Tag, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  publishedDate: string;
  readTime: number;
  category: string;
  tags: string[];
  imageUrl?: string;
  summary: string;
  relatedArticles?: {
    id: string;
    title: string;
    category: string;
    readTime: number;
  }[];
  isBookmarked?: boolean;
  isLiked?: boolean;
}

interface ArticleViewerProps {
  article: Article;
  onBack?: () => void;
  onBookmark?: (articleId: string) => void;
  onLike?: (articleId: string) => void;
  onRelatedArticlePress?: (articleId: string) => void;
  showRelatedArticles?: boolean;
}

export const ArticleViewer: React.FC<ArticleViewerProps> = ({
  article,
  onBack,
  onBookmark,
  onLike,
  onRelatedArticlePress,
  showRelatedArticles = true
}) => {
  const [isBookmarked, setIsBookmarked] = useState(article.isBookmarked || false);
  const [isLiked, setIsLiked] = useState(article.isLiked || false);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onBookmark?.(article.id);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.(article.id);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this health article: ${article.title}`,
        title: article.title,
      });
    } catch (error) {
      console.error('Error sharing article:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'nutrition':
        return '#F59E0B';
      case 'fitness':
        return '#10B981';
      case 'mental health':
        return '#8B5CF6';
      case 'preventive care':
        return '#3B82F6';
      case 'wellness':
        return '#EC4899';
      default:
        return '#6B7280';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleBookmark}>
            {isBookmarked ? (
              <BookmarkCheck size={24} color="#3B82F6" />
            ) : (
              <Bookmark size={24} color="#6B7280" />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Share2 size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Article Header */}
        <View style={styles.articleHeader}>
          <View style={styles.categoryContainer}>
            <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(article.category) }]}>
              <Text style={styles.categoryText}>{article.category}</Text>
            </View>
          </View>

          <Text style={styles.title}>{article.title}</Text>
          <Text style={styles.summary}>{article.summary}</Text>

          <View style={styles.metadata}>
            <View style={styles.metadataItem}>
              <User size={16} color="#6B7280" />
              <Text style={styles.metadataText}>{article.author}</Text>
            </View>
            
            <View style={styles.metadataItem}>
              <Clock size={16} color="#6B7280" />
              <Text style={styles.metadataText}>{article.readTime} min read</Text>
            </View>
            
            <Text style={styles.publishDate}>{formatDate(article.publishedDate)}</Text>
          </View>

          {article.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {article.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Tag size={12} color="#6B7280" />
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Article Content */}
        <View style={styles.articleContent}>
          <Text style={styles.contentText}>{article.content}</Text>
        </View>

        {/* Article Actions */}
        <View style={styles.articleActions}>
          <TouchableOpacity style={styles.likeButton} onPress={handleLike}>
            {isLiked ? (
              <HeartHandshake size={20} color="#EF4444" />
            ) : (
              <Heart size={20} color="#6B7280" />
            )}
            <Text style={[styles.likeText, isLiked && styles.likeTextActive]}>
              {isLiked ? 'Liked' : 'Like this article'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Related Articles */}
        {showRelatedArticles && article.relatedArticles && article.relatedArticles.length > 0 && (
          <View style={styles.relatedSection}>
            <Text style={styles.relatedTitle}>Related Articles</Text>
            
            {article.relatedArticles.map((relatedArticle) => (
              <TouchableOpacity
                key={relatedArticle.id}
                style={styles.relatedArticle}
                onPress={() => onRelatedArticlePress?.(relatedArticle.id)}
              >
                <View style={styles.relatedArticleContent}>
                  <Text style={styles.relatedArticleTitle} numberOfLines={2}>
                    {relatedArticle.title}
                  </Text>
                  
                  <View style={styles.relatedArticleMetadata}>
                    <View style={[
                      styles.relatedCategoryBadge,
                      { backgroundColor: getCategoryColor(relatedArticle.category) }
                    ]}>
                      <Text style={styles.relatedCategoryText}>{relatedArticle.category}</Text>
                    </View>
                    
                    <View style={styles.relatedReadTime}>
                      <Clock size={12} color="#6B7280" />
                      <Text style={styles.relatedReadTimeText}>{relatedArticle.readTime} min</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            This article is for educational purposes only and should not replace professional medical advice. 
            Always consult with your healthcare provider before making health-related decisions.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  articleHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  categoryContainer: {
    marginBottom: 12,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 36,
    marginBottom: 12,
  },
  summary: {
    fontSize: 18,
    color: '#6B7280',
    lineHeight: 28,
    marginBottom: 16,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 16,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metadataText: {
    fontSize: 14,
    color: '#6B7280',
  },
  publishDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#6B7280',
  },
  articleContent: {
    padding: 20,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 26,
    color: '#374151',
  },
  articleActions: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  likeText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  likeTextActive: {
    color: '#EF4444',
  },
  relatedSection: {
    padding: 20,
  },
  relatedTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  relatedArticle: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  relatedArticleContent: {
    gap: 12,
  },
  relatedArticleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    lineHeight: 22,
  },
  relatedArticleMetadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  relatedCategoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  relatedCategoryText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  relatedReadTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  relatedReadTimeText: {
    fontSize: 12,
    color: '#6B7280',
  },
  disclaimer: {
    margin: 20,
    padding: 16,
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  disclaimerText: {
    fontSize: 12,
    color: '#92400E',
    lineHeight: 18,
    textAlign: 'center',
  },
});