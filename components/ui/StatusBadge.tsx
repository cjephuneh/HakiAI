import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';

type StatusType = 
  | 'found' | 'claimed' | 'verified' | 'rewarded' // Lost ID statuses
  | 'reported' | 'investigating' | 'verified' | 'resolved' | 'dismissed' // Corruption report statuses
  | 'active' | 'completed' | 'cancelled'; // Fundraiser statuses

interface StatusBadgeProps {
  status: StatusType;
  size?: 'small' | 'medium' | 'large';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'medium',
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'found':
      case 'reported':
        return colors.info;
      case 'claimed':
      case 'investigating':
      case 'active':
        return colors.warning;
      case 'verified':
        return colors.primary;
      case 'rewarded':
      case 'resolved':
      case 'completed':
        return colors.success;
      case 'dismissed':
      case 'cancelled':
        return colors.danger;
      default:
        return colors.info;
    }
  };

  const getStatusText = () => {
    // Capitalize first letter
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <View style={[
      styles.badge,
      styles[size],
      { backgroundColor: getStatusColor() + '20' }, // 20% opacity
    ]}>
      <View style={[styles.dot, { backgroundColor: getStatusColor() }]} />
      <Text style={[
        styles.text,
        styles[`${size}Text`],
        { color: getStatusColor() }
      ]}>
        {getStatusText()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 100,
    alignSelf: 'flex-start',
  },
  small: {
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  medium: {
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  large: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  text: {
    fontWeight: '500',
  },
  smallText: {
    fontSize: 10,
  },
  mediumText: {
    fontSize: 12,
  },
  largeText: {
    fontSize: 14,
  },
});