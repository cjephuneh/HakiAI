import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MapPin, Clock, ThumbsUp } from 'lucide-react-native';
import { CorruptionReport } from '@/types';
import { Card } from './ui/Card';
import { StatusBadge } from './ui/StatusBadge';
import { colors } from '@/constants/colors';

interface CorruptionReportCardProps {
  item: CorruptionReport;
  onPress: (item: CorruptionReport) => void;
  onUpvote: (id: string) => void;
}

export const CorruptionReportCard: React.FC<CorruptionReportCardProps> = ({ 
  item, 
  onPress,
  onUpvote
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const getCategoryLabel = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <TouchableOpacity 
      activeOpacity={0.7} 
      onPress={() => onPress(item)}
    >
      <Card variant="elevated" style={styles.card}>
        <Image 
          source={{ uri: item.imageUrl }} 
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
            <StatusBadge status={item.status} />
          </View>
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
          
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryText}>
              {getCategoryLabel(item.category)}
            </Text>
            {item.officialName && (
              <Text style={styles.officialText} numberOfLines={1}>
                Official: {item.officialName}
              </Text>
            )}
          </View>
          
          <View style={styles.footer}>
            <View style={styles.infoItem}>
              <MapPin size={14} color={colors.text} />
              <Text style={styles.infoText} numberOfLines={1}>
                {item.location.address || 'Unknown location'}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Clock size={14} color={colors.text} />
              <Text style={styles.infoText}>
                {formatDate(item.createdAt)}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.upvoteButton}
            onPress={() => onUpvote(item.id)}
            activeOpacity={0.7}
          >
            <ThumbsUp size={14} color={colors.primary} />
            <Text style={styles.upvoteText}>{item.upvotes}</Text>
          </TouchableOpacity>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    overflow: 'hidden',
    padding: 0,
  },
  image: {
    width: '100%',
    height: 160,
    backgroundColor: colors.placeholder,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  description: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 12,
    lineHeight: 20,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 12,
    color: colors.primary,
    backgroundColor: `${colors.primary}15`,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 8,
  },
  officialText: {
    fontSize: 12,
    color: colors.text,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    color: colors.text,
    marginLeft: 4,
  },
  upvoteButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.primary}15`,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  upvoteText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
});