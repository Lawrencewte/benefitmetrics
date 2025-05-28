import { Clock, ExternalLink, Tag } from 'lucide-react-native';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PartnerDiscount {
  id: string;
  partner: string;
  discount: string;
  description: string;
  expires: string;
  category: 'fitness' | 'nutrition' | 'wellness' | 'healthcare' | 'mental-health';
  code?: string;
  url?: string;
}

interface PartnerDiscountsProps {
  discounts: PartnerDiscount[];
  onDiscountPress?: (discount: PartnerDiscount) => void;
}

export const PartnerDiscounts: React.FC<PartnerDiscountsProps> = ({
  discounts,
  onDiscountPress
}) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'fitness':
        return '#10B981';
      case 'nutrition':
        return '#F59E0B';
      case 'wellness':
        return '#8B5CF6';
      case 'healthcare':
        return '#3B82F6';
      case 'mental-health':
        return '#EC4899';
      default:
        return '#6B7280';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'fitness':
        return 'Fitness';
      case 'nutrition':
        return 'Nutrition';
      case 'wellness':
        return 'Wellness';
      case 'healthcare':
        return 'Healthcare';
      case 'mental-health':
        return 'Mental Health';
      default:
        return 'Other';
    }
  };

  const isExpiringSoon = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const timeDiff = expiry.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff <= 30;
  };

  const renderDiscountCard = ({ item }: { item: PartnerDiscount }) => (
    <TouchableOpacity
      style={styles.discountCard}
      onPress={() => onDiscountPress?.(item)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.partnerInfo}>
          <Text style={styles.partnerName}>{item.partner}</Text>
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) }]}>
            <Text style={styles.categoryText}>{getCategoryLabel(item.category)}</Text>
          </View>
        </View>
        {item.url && <ExternalLink size={20} color="#6B7280" />}
      </View>

      <View style={styles.discountInfo}>
        <View style={styles.discountBadge}>
          <Tag size={16} color="#DC2626" />
          <Text style={styles.discountText}>{item.discount}</Text>
        </View>
      </View>

      <Text style={styles.description}>{item.description}</Text>

      <View style={styles.footer}>
        <View style={styles.expiryInfo}>
          <Clock size={14} color={isExpiringSoon(item.expires) ? "#EF4444" : "#6B7280"} />
          <Text style={[
            styles.expiryText,
            isExpiringSoon(item.expires) && styles.expiryWarning
          ]}>
            Expires: {item.expires}
          </Text>
        </View>

        {item.code && (
          <View style={styles.codeContainer}>
            <Text style={styles.codeLabel}>Code:</Text>
            <Text style={styles.code}>{item.code}</Text>
          </View>
        )}
      </View>

      {isExpiringSoon(item.expires) && (
        <View style={styles.urgencyBanner}>
          <Text style={styles.urgencyText}>Expires Soon!</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Partner Discounts</Text>
        <Text style={styles.subtitle}>
          Save money on wellness products and services
        </Text>
      </View>

      <FlatList
        data={discounts}
        renderItem={renderDiscountCard}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  listContainer: {
    padding: 16,
  },
  discountCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    position: 'relative',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  partnerInfo: {
    flex: 1,
  },
  partnerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  discountInfo: {
    marginBottom: 12,
  },
  discountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  discountText: {
    marginLeft: 6,
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expiryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  expiryText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#6B7280',
  },
  expiryWarning: {
    color: '#EF4444',
    fontWeight: '500',
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  codeLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginRight: 4,
  },
  code: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'monospace',
  },
  urgencyBanner: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 8,
  },
  urgencyText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
});