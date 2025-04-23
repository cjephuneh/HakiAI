import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { Stack } from 'expo-router';
import { 
  BarChart2, 
  PieChart, 
  MapPin, 
  Calendar, 
  TrendingUp,
  Download,
  Share2
} from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { colors } from '@/constants/colors';

const { width } = Dimensions.get('window');
const chartWidth = width - 48;

export default function CorruptionStatsScreen() {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year' | 'all'>('month');
  
  // Mock data for charts
  const categoryData = [
    { category: 'Traffic Police', count: 42, color: colors.danger },
    { category: 'Government', count: 28, color: colors.primary },
    { category: 'Police', count: 35, color: colors.warning },
    { category: 'Education', count: 15, color: colors.secondary },
    { category: 'Health', count: 22, color: colors.accent },
    { category: 'Other', count: 8, color: colors.info },
  ];
  
  const locationData = [
    { location: 'Nairobi CBD', count: 45 },
    { location: 'Westlands', count: 32 },
    { location: 'Mombasa Road', count: 28 },
    { location: 'Thika Road', count: 25 },
    { location: 'Kiambu Road', count: 18 },
  ];
  
  const monthlyData = [
    { month: 'Jan', count: 15 },
    { month: 'Feb', count: 18 },
    { month: 'Mar', count: 22 },
    { month: 'Apr', count: 28 },
    { month: 'May', count: 32 },
    { month: 'Jun', count: 38 },
    { month: 'Jul', count: 42 },
    { month: 'Aug', count: 45 },
    { month: 'Sep', count: 50 },
    { month: 'Oct', count: 48 },
    { month: 'Nov', count: 52 },
    { month: 'Dec', count: 58 },
  ];
  
  const statusData = [
    { status: 'Reported', count: 120, color: colors.info },
    { status: 'Investigating', count: 45, color: colors.warning },
    { status: 'Verified', count: 35, color: colors.primary },
    { status: 'Resolved', count: 28, color: colors.success },
    { status: 'Dismissed', count: 12, color: colors.danger },
  ];

  // Calculate total reports
  const totalReports = categoryData.reduce((sum, item) => sum + item.count, 0);
  
  // Find highest category
  const highestCategory = [...categoryData].sort((a, b) => b.count - a.count)[0];
  
  // Calculate resolution rate
  const resolvedCount = statusData.find(item => item.status === 'Resolved')?.count || 0;
  const resolutionRate = Math.round((resolvedCount / totalReports) * 100);
  
  // Calculate monthly growth
  const currentMonth = monthlyData[monthlyData.length - 1].count;
  const previousMonth = monthlyData[monthlyData.length - 2].count;
  const monthlyGrowth = Math.round(((currentMonth - previousMonth) / previousMonth) * 100);

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Corruption Statistics',
          headerRight: () => (
            <TouchableOpacity style={styles.headerButton}>
              <Download size={20} color={colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Corruption Analytics</Text>
          <Text style={styles.subtitle}>
            Data-driven insights on corruption reports
          </Text>
          
          <View style={styles.timeframeContainer}>
            <TouchableOpacity 
              style={[styles.timeframeButton, timeframe === 'week' && styles.activeTimeframe]}
              onPress={() => setTimeframe('week')}
            >
              <Text style={[styles.timeframeText, timeframe === 'week' && styles.activeTimeframeText]}>
                Week
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.timeframeButton, timeframe === 'month' && styles.activeTimeframe]}
              onPress={() => setTimeframe('month')}
            >
              <Text style={[styles.timeframeText, timeframe === 'month' && styles.activeTimeframeText]}>
                Month
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.timeframeButton, timeframe === 'year' && styles.activeTimeframe]}
              onPress={() => setTimeframe('year')}
            >
              <Text style={[styles.timeframeText, timeframe === 'year' && styles.activeTimeframeText]}>
                Year
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.timeframeButton, timeframe === 'all' && styles.activeTimeframe]}
              onPress={() => setTimeframe('all')}
            >
              <Text style={[styles.timeframeText, timeframe === 'all' && styles.activeTimeframeText]}>
                All Time
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{totalReports}</Text>
            <Text style={styles.statLabel}>Total Reports</Text>
          </Card>
          
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{resolutionRate}%</Text>
            <Text style={styles.statLabel}>Resolution Rate</Text>
          </Card>
          
          <Card style={styles.statCard}>
            <Text style={[styles.statValue, monthlyGrowth > 0 ? styles.positiveGrowth : styles.negativeGrowth]}>
              {monthlyGrowth > 0 ? '+' : ''}{monthlyGrowth}%
            </Text>
            <Text style={styles.statLabel}>Monthly Growth</Text>
          </Card>
          
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{highestCategory.category}</Text>
            <Text style={styles.statLabel}>Top Category</Text>
          </Card>
        </View>
        
        <Card style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View style={styles.chartTitleContainer}>
              <BarChart2 size={20} color={colors.primary} />
              <Text style={styles.chartTitle}>Reports by Category</Text>
            </View>
            <TouchableOpacity style={styles.chartAction}>
              <Share2 size={16} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.chartContainer}>
            {/* Simple bar chart visualization */}
            {categoryData.map((item, index) => (
              <View key={index} style={styles.barChartRow}>
                <Text style={styles.barChartLabel}>{item.category}</Text>
                <View style={styles.barContainer}>
                  <View 
                    style={[
                      styles.bar, 
                      { 
                        width: `${(item.count / Math.max(...categoryData.map(d => d.count))) * 100}%`,
                        backgroundColor: item.color,
                      }
                    ]} 
                  />
                  <Text style={styles.barValue}>{item.count}</Text>
                </View>
              </View>
            ))}
          </View>
        </Card>
        
        <Card style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View style={styles.chartTitleContainer}>
              <PieChart size={20} color={colors.primary} />
              <Text style={styles.chartTitle}>Reports by Status</Text>
            </View>
            <TouchableOpacity style={styles.chartAction}>
              <Share2 size={16} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.pieChartContainer}>
            <View style={styles.pieChartPlaceholder}>
              {/* In a real app, you would use a proper chart library */}
              <Text style={styles.pieChartText}>Pie Chart</Text>
            </View>
            
            <View style={styles.legendContainer}>
              {statusData.map((item, index) => (
                <View key={index} style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                  <Text style={styles.legendLabel}>{item.status}</Text>
                  <Text style={styles.legendValue}>{item.count}</Text>
                </View>
              ))}
            </View>
          </View>
        </Card>
        
        <Card style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View style={styles.chartTitleContainer}>
              <TrendingUp size={20} color={colors.primary} />
              <Text style={styles.chartTitle}>Monthly Trend</Text>
            </View>
            <TouchableOpacity style={styles.chartAction}>
              <Share2 size={16} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.lineChartContainer}>
            {/* Simple line chart visualization */}
            <View style={styles.lineChartPlaceholder}>
              <Text style={styles.lineChartText}>Line Chart</Text>
            </View>
          </View>
        </Card>
        
        <Card style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View style={styles.chartTitleContainer}>
              <MapPin size={20} color={colors.primary} />
              <Text style={styles.chartTitle}>Top Locations</Text>
            </View>
            <TouchableOpacity style={styles.chartAction}>
              <Share2 size={16} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.locationList}>
            {locationData.map((item, index) => (
              <View key={index} style={styles.locationItem}>
                <Text style={styles.locationRank}>#{index + 1}</Text>
                <Text style={styles.locationName}>{item.location}</Text>
                <Text style={styles.locationCount}>{item.count} reports</Text>
              </View>
            ))}
          </View>
        </Card>
        
        <Button
          title="Download Full Report"
          leftIcon={<Download size={16} color="white" />}
          style={styles.downloadButton}
        />
        
        <View style={styles.poweredByContainer}>
          <Text style={styles.poweredByText}>Powered by</Text>
          <Text style={styles.hakihackText}>hakihack</Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    opacity: 0.7,
    marginBottom: 16,
  },
  timeframeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  timeframeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: colors.lightPrimary || `${colors.primary}10`,
  },
  activeTimeframe: {
    backgroundColor: colors.primary,
  },
  timeframeText: {
    fontSize: 14,
    color: colors.primary,
  },
  activeTimeframeText: {
    color: 'white',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    paddingTop: 0,
  },
  statCard: {
    width: '48%',
    padding: 16,
    marginBottom: 16,
    marginRight: '4%',
  },
  statCard: {
    width: '48%',
    padding: 16,
    marginBottom: 16,
    marginRight: '4%',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    color: colors.text,
  },
  statLabel: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
  },
  positiveGrowth: {
    color: colors.success,
  },
  negativeGrowth: {
    color: colors.danger,
  },
  chartCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    color: colors.text,
  },
  chartAction: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.lightPrimary || `${colors.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartContainer: {
    marginBottom: 8,
  },
  barChartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  barChartLabel: {
    width: 100,
    fontSize: 12,
    color: colors.text,
  },
  barContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 20,
  },
  bar: {
    height: 16,
    borderRadius: 8,
  },
  barValue: {
    marginLeft: 8,
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
  },
  pieChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pieChartPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.lightPrimary || `${colors.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pieChartText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
  legendContainer: {
    flex: 1,
    marginLeft: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendLabel: {
    flex: 1,
    fontSize: 12,
    color: colors.text,
  },
  legendValue: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
  },
  lineChartContainer: {
    height: 200,
    marginBottom: 8,
  },
  lineChartPlaceholder: {
    flex: 1,
    backgroundColor: colors.lightPrimary || `${colors.primary}10`,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lineChartText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
  locationList: {
    marginBottom: 8,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  locationRank: {
    width: 30,
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  locationName: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  locationCount: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  downloadButton: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  headerButton: {
    padding: 8,
  },
  poweredByContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  poweredByText: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.5,
  },
  hakihackText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primary,
    marginLeft: 4,
  },
});