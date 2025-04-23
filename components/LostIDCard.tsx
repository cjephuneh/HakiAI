import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MapPin, Clock } from 'lucide-react-native';
import { LostID } from '@/types';
import { Card } from './ui/Card';
import { StatusBadge } from './ui/StatusBadge';
import { colors } from '@/constants/colors';

interface LostIDCardProps {
  item: LostID;
  onPress: (item: LostID) => void;
}

export const LostIDCard: React.FC<LostIDCardProps> = ({ item, onPress }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
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
          {item.status === 'found' && (
            <View style={styles.rewardBadge}>
              <Text style={styles.rewardText}>
                Reward: KSh {item.reward}
              </Text>
            </View>
          )}
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
  rewardBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: colors.accent,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  rewardText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});