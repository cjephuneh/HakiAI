import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@/constants/colors';

interface ProgressBarProps {
  progress: number; // 0 to 1
  height?: number;
  showPercentage?: boolean;
  color?: string;
  backgroundColor?: string;
  style?: ViewStyle;
  animated?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  showPercentage = false,
  color = colors.primary,
  backgroundColor = colors.border,
  style,
  animated = true,
}) => {
  // Ensure progress is between 0 and 1
  const normalizedProgress = Math.min(Math.max(progress, 0), 1);
  
  // Calculate percentage for display
  const percentage = Math.round(normalizedProgress * 100);

  return (
    <View style={[styles.container, style]}>
      <View 
        style={[
          styles.background, 
          { 
            height, 
            backgroundColor,
            borderRadius: height / 2,
          }
        ]}
      >
        <View 
          style={[
            styles.progress, 
            { 
              width: `${percentage}%`, 
              height, 
              backgroundColor: color,
              borderRadius: height / 2,
            },
            animated && styles.animated,
          ]}
        />
      </View>
      {showPercentage && (
        <Text style={styles.percentage}>{percentage}%</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  background: {
    flex: 1,
    overflow: 'hidden',
  },
  progress: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  animated: {
    transition: 'width 0.3s ease-in-out',
  },
  percentage: {
    marginLeft: 8,
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
  },
});