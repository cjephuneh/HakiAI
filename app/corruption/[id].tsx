import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  Alert,
  Linking,
  Platform
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { 
  MapPin, 
  Clock, 
  User, 
  ThumbsUp, 
  Share2, 
  Flag,
  ChevronLeft,
  AlertTriangle,
  Eye,
  EyeOff,
  Video,
  MessageCircle
} from 'lucide-react-native';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useCorruptionStore } from '@/store/corruption-store';
import { useAuthStore } from '@/store/auth-store';
import { colors } from '@/constants/colors';

export default function CorruptionReportDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { reports, upvoteReport, updateReportStatus, isLoading } = useCorruptionStore();
  const { user, isAuthenticated } = useAuthStore();
  const [report, setReport] = useState(reports.find(item => item.id === id));
  const [comments, setComments] = useState([
    {
      id: '1',
      text: "I witnessed this too. The officer was demanding KSh 2,000 from every matatu.",
      author: "Jane Doe",
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
      upvotes: 12,
    },
    {
      id: '2',
      text: "This happens every day at this location. Authorities need to take action!",
      author: "John Smith",
      timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
      upvotes: 8,
    },
  ]);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    const foundReport = reports.find(item => item.id === id);
    if (foundReport) {
      setReport(foundReport);
    } else {
      // Report not found, go back
      Alert.alert('Error', 'Corruption report not found');
      router.back();
    }
  }, [id, reports]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const handleUpvote = async () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Authentication Required',
        'Please sign in to upvote this report',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => router.push('/auth/login') }
        ]
      );
      return;
    }

    try {
      await upvoteReport(report!.id);
    } catch (error) {
      Alert.alert('Error', 'Failed to upvote report. Please try again.');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this corruption report: ${report?.title} - View on Haki App`,
        url: `https://haki.app/corruption/${report?.id}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share. Please try again.');
    }
  };

  const handleReport = () => {
    Alert.alert(
      'Report Content',
      'Why are you reporting this content?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'False Information', onPress: () => reportContent('false_info') },
        { text: 'Inappropriate Content', onPress: () => reportContent('inappropriate') },
        { text: 'Duplicate Report', onPress: () => reportContent('duplicate') },
      ]
    );
  };

  const reportContent = (reason: string) => {
    Alert.alert(
      'Thank You',
      'Your report has been submitted and will be reviewed by our team.',
      [{ text: 'OK' }]
    );
  };

  const handleUpdateStatus = (status: string) => {
    Alert.alert(
      'Update Status',
      `Are you sure you want to mark this report as "${status}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Update', 
          onPress: async () => {
            try {
              await updateReportStatus(report!.id, status as any);
              Alert.alert('Success', 'Report status updated successfully.');
            } catch (error) {
              Alert.alert('Error', 'Failed to update status. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    
    if (!isAuthenticated) {
      Alert.alert(
        'Authentication Required',
        'Please sign in to comment on this report',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => router.push('/auth/login') }
        ]
      );
      return;
    }
    
    const newComment = {
      id: Date.now().toString(),
      text: commentText,
      author: user?.name || 'Anonymous',
      timestamp: new Date().toISOString(),
      upvotes: 0,
    };
    
    setComments([newComment, ...comments]);
    setCommentText('');
  };

  if (!report) {
    return null;
  }

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Corruption Report',
          headerBackTitle: 'Back',
        }} 
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {report.videoUrl ? (
          <View style={styles.videoContainer}>
            <View style={styles.videoPlaceholder}>
              <Video size={48} color="white" />
              <Text style={styles.videoText}>Video Evidence</Text>
              <Button 
                title="Play Video" 
                size="small" 
                style={styles.playButton}
              />
            </View>
          </View>
        ) : (
          <Image 
            source={{ uri: report.imageUrl }} 
            style={styles.image}
            resizeMode="cover"
          />
        )}
        
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{report.title}</Text>
            <StatusBadge status={report.status} size="large" />
          </View>
          
          <Text style={styles.description}>{report.description}</Text>
          
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryText}>
              {report.category.charAt(0).toUpperCase() + report.category.slice(1)}
            </Text>
            {report.officialName && (
              <Text style={styles.officialText}>
                Official: {report.officialName}
                {report.officialId && ` (${report.officialId})`}
              </Text>
            )}
          </View>
          
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <MapPin size={16} color={colors.text} />
              <Text style={styles.infoText}>
                {report.location.address || 'Unknown location'}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Clock size={16} color={colors.text} />
              <Text style={styles.infoText}>
                Reported on {formatDate(report.createdAt)}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <User size={16} color={colors.text} />
              <Text style={styles.infoText}>
                {report.anonymous ? 'Anonymous Reporter' : 'John Doe'}
              </Text>
            </View>
          </View>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleUpvote}
            >
              <ThumbsUp size={20} color={colors.primary} />
              <Text style={styles.actionButtonText}>
                Upvote ({report.upvotes})
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleShare}
            >
              <Share2 size={20} color={colors.text} />
              <Text style={styles.actionButtonText}>Share</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleReport}
            >
              <Flag size={20} color={colors.danger} />
              <Text style={styles.actionButtonText}>Report</Text>
            </TouchableOpacity>
          </View>
          
          {user?.role === 'admin' && (
            <Card style={styles.adminCard}>
              <Text style={styles.adminCardTitle}>Admin Actions</Text>
              <Text style={styles.adminCardDescription}>
                Update the status of this corruption report
              </Text>
              
              <View style={styles.adminButtons}>
                <Button 
                  title="Investigating" 
                  variant={report.status === 'investigating' ? 'primary' : 'outline'}
                  size="small"
                  style={styles.adminButton}
                  onPress={() => handleUpdateStatus('investigating')}
                  disabled={report.status === 'investigating'}
                />
                
                <Button 
                  title="Verified" 
                  variant={report.status === 'verified' ? 'primary' : 'outline'}
                  size="small"
                  style={styles.adminButton}
                  onPress={() => handleUpdateStatus('verified')}
                  disabled={report.status === 'verified'}
                />
                
                <Button 
                  title="Resolved" 
                  variant={report.status === 'resolved' ? 'success' : 'outline'}
                  size="small"
                  style={styles.adminButton}
                  onPress={() => handleUpdateStatus('resolved')}
                  disabled={report.status === 'resolved'}
                />
                
                <Button 
                  title="Dismissed" 
                  variant={report.status === 'dismissed' ? 'danger' : 'outline'}
                  size="small"
                  style={styles.adminButton}
                  onPress={() => handleUpdateStatus('dismissed')}
                  disabled={report.status === 'dismissed'}
                />
              </View>
            </Card>
          )}
          
          <View style={styles.commentsSection}>
            <Text style={styles.sectionTitle}>Comments ({comments.length})</Text>
            
            <Card style={styles.commentInputCard}>
              <Input
                placeholder="Add your comment..."
                value={commentText}
                onChangeText={setCommentText}
                multiline
                numberOfLines={2}
                textAlignVertical="top"
                style={styles.commentInput}
                rightIcon={
                  <TouchableOpacity onPress={handleAddComment}>
                    <MessageCircle size={20} color={colors.primary} />
                  </TouchableOpacity>
                }
              />
            </Card>
            
            {comments.map((comment, index) => (
              <Card key={comment.id} style={styles.commentCard}>
                <View style={styles.commentHeader}>
                  <Avatar name={comment.author} size="small" />
                  <View style={styles.commentAuthorContainer}>
                    <Text style={styles.commentAuthor}>{comment.author}</Text>
                    <Text style={styles.commentTime}>
                      {new Date(comment.timestamp).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
                
                <Text style={styles.commentText}>{comment.text}</Text>
                
                <View style={styles.commentActions}>
                  <TouchableOpacity style={styles.commentAction}>
                    <ThumbsUp size={16} color={colors.text} />
                    <Text style={styles.commentActionText}>
                      {comment.upvotes}
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.commentAction}>
                    <MessageCircle size={16} color={colors.text} />
                    <Text style={styles.commentActionText}>Reply</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.commentAction}>
                    <Flag size={16} color={colors.text} />
                    <Text style={styles.commentActionText}>Report</Text>
                  </TouchableOpacity>
                </View>
              </Card>
            ))}
          </View>
          
          <View style={styles.similarReportsSection}>
            <Text style={styles.sectionTitle}>Similar Reports</Text>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.similarReportsScroll}
            >
              {reports.filter(r => r.id !== report.id).slice(0, 3).map((item) => (
                <TouchableOpacity 
                  key={item.id}
                  style={styles.similarReportCard}
                  onPress={() => router.push(`/corruption/${item.id}`)}
                >
                  <Image 
                    source={{ uri: item.imageUrl }} 
                    style={styles.similarReportImage}
                  />
                  <View style={styles.similarReportContent}>
                    <Text style={styles.similarReportTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <View style={styles.similarReportFooter}>
                      <StatusBadge status={item.status} size="small" />
                      <Text style={styles.similarReportUpvotes}>
                        {item.upvotes} upvotes
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          
          <View style={styles.poweredByContainer}>
            <Text style={styles.poweredByText}>Powered by</Text>
            <Text style={styles.hakihackText}>hakihack</Text>
          </View>
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
  image: {
    width: '100%',
    height: 250,
    backgroundColor: colors.placeholder,
  },
  videoContainer: {
    width: '100%',
    height: 250,
    backgroundColor: '#000',
  },
  videoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoText: {
    color: 'white',
    fontSize: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  playButton: {
    minWidth: 120,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 16,
    color: colors.text,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
    color: colors.text,
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryText: {
    fontSize: 14,
    color: colors.primary,
    backgroundColor: colors.lightPrimary || `${colors.primary}15`,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 8,
    overflow: 'hidden',
  },
  officialText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  infoContainer: {
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    marginLeft: 8,
    color: colors.text,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  actionButtonText: {
    fontSize: 14,
    marginLeft: 8,
    color: colors.text,
  },
  adminCard: {
    marginBottom: 24,
  },
  adminCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: colors.text,
  },
  adminCardDescription: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
    marginBottom: 16,
  },
  adminButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  adminButton: {
    marginRight: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: colors.text,
  },
  commentsSection: {
    marginBottom: 24,
  },
  commentInputCard: {
    marginBottom: 16,
    padding: 12,
  },
  commentInput: {
    borderWidth: 0,
    padding: 0,
  },
  commentCard: {
    marginBottom: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  commentAuthorContainer: {
    marginLeft: 8,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  commentTime: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.7,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    color: colors.text,
  },
  commentActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  commentAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  commentActionText: {
    fontSize: 12,
    marginLeft: 4,
    color: colors.text,
  },
  similarReportsSection: {
    marginBottom: 24,
  },
  similarReportsScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  similarReportCard: {
    width: 200,
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  similarReportImage: {
    width: '100%',
    height: 100,
    backgroundColor: colors.placeholder,
  },
  similarReportContent: {
    padding: 12,
  },
  similarReportTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: colors.text,
  },
  similarReportFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  similarReportUpvotes: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.7,
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