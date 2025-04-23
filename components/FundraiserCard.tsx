import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Clock, Users } from 'lucide-react-native';
import { Fundraiser } from '@/types';
import { Card } from './ui/Card';
import { StatusBadge } from './ui/StatusBadge';
import { ProgressBar } from './ui/ProgressBar';
import { colors } from '@/constants/colors';

interface FundraiserCardProps {
  item: Fundraiser;
  onPress: (item: Fundraiser) => void;
}

export const FundraiserCard: React.FC<FundraiserCardProps> = ({ 
  item, 
  onPress,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const formatCurrency = (amount: number) => {
    return `KSh ${amount.toLocaleString()}`;
  };

  const calculateProgress = () => {
    return item.raisedAmount / item.targetAmount;
  };

  const getCategoryLabel = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const getDaysLeft = () => {
    const deadline = new Date(item.deadline);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Ended';
    if (diffDays === 0) return 'Last day';
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} left`;
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
          </View>
          
          <View style={styles.progressContainer}>
            <ProgressBar 
              progress={calculateProgress()} 
              height={6}
            />
            <View style={styles.amountContainer}>
              <Text style={styles.raisedAmount}>
                {formatCurrency(item.raisedAmount)}
              </Text>
              <Text style={styles.targetAmount}>
                of {formatCurrency(item.targetAmount)}
              </Text>
            </View>
          </View>
          
          <View style={styles.footer}>
            <View style={styles.infoItem}>
              <Users size={14} color={colors.text} />
              <Text style={styles.infoText}>
                For: {item.beneficiary}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Clock size={14} color={colors.text} />
              <Text style={styles.infoText}>
                {getDaysLeft()}
              </Text>
            </View>
          </View>
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
    color: colors.secondary,
    backgroundColor: `${colors.secondary}15`,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressContainer: {
    marginBottom: 12,
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  raisedAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  targetAmount: {
    fontSize: 12,
    color: colors.text,
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
});