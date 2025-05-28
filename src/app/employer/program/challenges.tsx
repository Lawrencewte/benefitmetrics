import { Award, BarChart2, Calendar, Edit, Eye, Filter, PlusCircle, Search, Trash2, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import EmployerFooter from '../../../components/Common/layout/EmployerFooter';
import Header from '../../../components/Common/layout/Header';
import Button from '../../../components/Common/ui/Button';
import Card from '../../../components/Common/ui/Card';
import Modal from '../../../components/Common/ui/Modal';
import ProgressBar from '../../../components/Common/ui/ProgressBar';
import { createChallenge, deleteChallenge, getChallenges } from '../../../services/employer/programManagement';

const ChallengeManager = () => {
  const [challenges, setChallenges] = useState([]);
  const [filteredChallenges, setFilteredChallenges] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock challenges data
  const mockChallengesData = [
    {
      id: 1,
      name: 'Step Challenge',
      description: 'Complete 10,000 steps per day for 30 days',
      startDate: '2025-05-01',
      endDate: '2025-05-31',
      status: 'active',
      participants: 256,
      totalEmployees: 412,
      rewards: [
        { points: 300, description: 'Complete 250,000 steps' },
        { points: 150, description: 'Complete 150,000 steps' },
        { points: 75, description: 'Complete 75,000 steps' },
      ],
    },
    {
      id: 2,
      name: 'Preventative Screening Challenge',
      description: 'Complete all recommended preventative screenings',
      startDate: '2025-04-15',
      endDate: '2025-06-15',
      status: 'active',
      participants: 198,
      totalEmployees: 412,
      rewards: [
        { points: 500, description: 'Complete all screenings' },
        { points: 100, description: 'Per screening completed' },
      ],
    },
    {
      id: 3,
      name: 'Hydration Challenge',
      description: 'Drink 64oz of water daily for 30 days',
      startDate: '2025-06-01',
      endDate: '2025-06-30',
      status: 'scheduled',
      participants: 0,
      totalEmployees: 412,
      rewards: [
        { points: 200, description: 'Complete all 30 days' },
        { points: 100, description: 'Complete 20 days' },
        { points: 50, description: 'Complete 10 days' },
      ],
    },
    {
      id: 4,
      name: 'Mental Wellness Week',
      description: 'Participate in daily mental wellness activities',
      startDate: '2025-07-10',
      endDate: '2025-07-17',
      status: 'scheduled',
      participants: 0,
      totalEmployees: 412,
      rewards: [
        { points: 250, description: 'Complete all activities' },
        { points: 50, description: 'Per activity completed' },
      ],
    },
    {
      id: 5,
      name: 'Annual Physical Completion',
      description: 'Complete your annual physical examination',
      startDate: '2025-01-01',
      endDate: '2025-03-31',
      status: 'completed',
      participants: 352,
      totalEmployees: 400,
      rewards: [
        { points: 300, description: 'Complete physical examination' },
        { points: 100, description: 'Complete health assessment' },
      ],
    },
    {
      id: 6,
      name: 'Dental Checkup Challenge',
      description: 'Complete your bi-annual dental checkup',
      startDate: '2025-02-01',
      endDate: '2025-04-30',
      status: 'completed',
      participants: 298,
      totalEmployees: 400,
      rewards: [
        { points: 200, description: 'Complete dental checkup' },
      ],
    },
  ];

  const fetchChallenges = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Try to fetch real data, fall back to mock data
      try {
        const data = await getChallenges();
        setChallenges(data || mockChallengesData);
      } catch (apiError) {
        console.log('API not available, using mock data');
        // Use mock data as fallback
        setChallenges(mockChallengesData);
      }
    } catch (err) {
      console.error('Error in fetchChallenges:', err);
      // Even if there's an error, show mock data
      setChallenges(mockChallengesData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  useEffect(() => {
    // Apply filters and search
    let filtered = challenges;
    
    // Apply status filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(challenge => challenge.status?.toLowerCase() === activeFilter);
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(challenge => 
        challenge.name?.toLowerCase().includes(query) || 
        challenge.description?.toLowerCase().includes(query)
      );
    }
    
    setFilteredChallenges(filtered);
  }, [challenges, activeFilter, searchQuery]);

  const handleCreateChallenge = async (formData) => {
    try {
      await createChallenge(formData);
      setShowCreateModal(false);
      // Reload challenges
      await fetchChallenges();
    } catch (err) {
      console.error('Error creating challenge:', err);
      // For now, just close modal - in real app, show error to user
      setShowCreateModal(false);
    }
  };

  const handleDeleteChallenge = async () => {
    if (!selectedChallenge) return;
    
    try {
      await deleteChallenge(selectedChallenge.id);
      setShowDeleteModal(false);
      setSelectedChallenge(null);
      // Reload challenges
      await fetchChallenges();
    } catch (err) {
      console.error('Error deleting challenge:', err);
      // For now, just close modal - in real app, show error to user
      setShowDeleteModal(false);
      setSelectedChallenge(null);
    }
  };

  const confirmDelete = (challenge) => {
    setSelectedChallenge(challenge);
    setShowDeleteModal(true);
  };

  const handleRetry = () => {
    fetchChallenges();
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header title="Challenge Management" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading challenges...</Text>
        </View>
        <EmployerFooter />
      </View>
    );
  }

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'active':
        return { backgroundColor: '#dcfce7', color: '#10b981' };
      case 'scheduled':
        return { backgroundColor: '#dbeafe', color: '#3b82f6' };
      case 'completed':
        return { backgroundColor: '#f3e8ff', color: '#8b5cf6' };
      default:
        return { backgroundColor: '#f3f4f6', color: '#666' };
    }
  };

  const filterOptions = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'scheduled', label: 'Scheduled' },
    { key: 'completed', label: 'Completed' }
  ];

  return (
    <View style={styles.container}>
      <Header title="Challenge Management" />
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.pageTitle}>Health Challenges</Text>
            <Text style={styles.pageSubtitle}>
              Create and manage health challenges for your organization
            </Text>
          </View>
          <Button 
            icon={<PlusCircle size={18} />}
            title="Create Challenge" 
            onPress={() => setShowCreateModal(true)}
            variant="primary"
          />
        </View>

        <Card style={styles.filtersCard}>
          <View style={styles.searchContainer}>
            <Search size={18} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search challenges..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <View style={styles.filterContainer}>
            <View style={styles.filterLabel}>
              <Filter size={16} color="#666" />
              <Text style={styles.filterText}>Filter:</Text>
            </View>
            
            <View style={styles.filterButtons}>
              {filterOptions.map(option => (
                <Pressable
                  key={option.key}
                  style={[
                    styles.filterButton, 
                    activeFilter === option.key && styles.activeFilterButton
                  ]}
                  onPress={() => setActiveFilter(option.key)}
                >
                  <Text 
                    style={[
                      styles.filterButtonText,
                      activeFilter === option.key && styles.activeFilterText
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </Card>

        {filteredChallenges.map(challenge => {
          const statusStyle = getStatusBadgeStyle(challenge.status);
          return (
            <Card key={challenge.id} style={styles.challengeCard}>
              <View style={styles.challengeHeader}>
                <View style={styles.challengeInfo}>
                  <Text style={styles.challengeName}>{challenge.name}</Text>
                  <Text style={styles.challengeDescription}>
                    {challenge.description}
                  </Text>
                </View>
                <View 
                  style={[
                    styles.statusBadge,
                    { backgroundColor: statusStyle.backgroundColor }
                  ]}
                >
                  <Text 
                    style={[
                      styles.statusText,
                      { color: statusStyle.color }
                    ]}
                  >
                    {challenge.status?.charAt(0).toUpperCase() + challenge.status?.slice(1)}
                  </Text>
                </View>
              </View>
              
              <View style={styles.challengeDetails}>
                <View style={styles.detailItem}>
                  <Calendar size={16} color="#666" />
                  <Text style={styles.detailText}>
                    {challenge.startDate} to {challenge.endDate}
                  </Text>
                </View>
                
                {challenge.status !== 'scheduled' && (
                  <View style={styles.detailItem}>
                    <Users size={16} color="#666" />
                    <Text style={styles.detailText}>
                      {challenge.participants}/{challenge.totalEmployees} participants
                    </Text>
                  </View>
                )}
              </View>
              
              {challenge.status !== 'scheduled' && (
                <View style={styles.participationContainer}>
                  <Text style={styles.participationLabel}>
                    Participation Rate: {Math.round((challenge.participants / challenge.totalEmployees) * 100)}%
                  </Text>
                  <ProgressBar 
                    progress={challenge.participants / challenge.totalEmployees} 
                    color={challenge.status === 'active' ? '#3b82f6' : '#8b5cf6'} 
                  />
                </View>
              )}
              
              <View style={styles.rewardsContainer}>
                <Text style={styles.rewardsTitle}>Rewards:</Text>
                {challenge.rewards?.map((reward, index) => (
                  <View key={index} style={styles.rewardItem}>
                    <Award size={14} color="#8b5cf6" />
                    <Text style={styles.rewardText}>
                      <Text style={styles.pointsText}>{reward.points} pts</Text> - {reward.description}
                    </Text>
                  </View>
                ))}
              </View>
              
              <View style={styles.challengeActions}>
                <Button 
                  icon={<Eye size={16} />}
                  title="View Details" 
                  variant="primary" 
                  onPress={() => console.log(`View challenge ${challenge.id}`)}
                  style={styles.actionButton}
                />
                
                {challenge.status !== 'completed' && (
                  <Button 
                    icon={<Edit size={16} />}
                    title="Edit" 
                    variant="outline" 
                    onPress={() => console.log(`Edit challenge ${challenge.id}`)}
                    style={styles.actionButton}
                  />
                )}
                
                {challenge.status === 'active' && (
                  <Button 
                    icon={<BarChart2 size={16} />}
                    title="Analytics" 
                    variant="outline" 
                    onPress={() => console.log(`View analytics for challenge ${challenge.id}`)}
                    style={styles.actionButton}
                  />
                )}
                
                {challenge.status !== 'completed' && (
                  <Button 
                    icon={<Trash2 size={16} />}
                    title="Delete" 
                    variant="outline" 
                    onPress={() => confirmDelete(challenge)}
                    style={styles.actionButton}
                  />
                )}
              </View>
            </Card>
          );
        })}

        {filteredChallenges.length === 0 && (
          <Card style={styles.noResultsCard}>
            <Text style={styles.noResultsText}>
              No challenges found matching your criteria.
            </Text>
            <Button 
              title="Clear Filters" 
              onPress={() => {
                setSearchQuery('');
                setActiveFilter('all');
              }} 
            />
          </Card>
        )}
      </ScrollView>

      {/* Create Challenge Modal */}
      <Modal
        visible={showCreateModal}
        title="Create New Challenge"
        onClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalContent}>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Challenge Name</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Enter challenge name"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Description</Text>
            <TextInput
              style={[styles.formInput, styles.textArea]}
              placeholder="Enter challenge description"
              multiline
              numberOfLines={4}
            />
          </View>
          
          <View style={styles.formRow}>
            <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.formLabel}>Start Date</Text>
              <TextInput
                style={styles.formInput}
                placeholder="YYYY-MM-DD"
              />
            </View>
            
            <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.formLabel}>End Date</Text>
              <TextInput
                style={styles.formInput}
                placeholder="YYYY-MM-DD"
              />
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Reward Structure</Text>
            <View style={styles.rewardForm}>
              <View style={styles.rewardFormRow}>
                <TextInput
                  style={[styles.formInput, styles.pointsInput]}
                  placeholder="Points"
                  keyboardType="numeric"
                />
                <TextInput
                  style={[styles.formInput, { flex: 1 }]}
                  placeholder="Achievement description"
                />
              </View>
              
              <Pressable style={styles.addRewardButton}>
                <PlusCircle size={16} color="#3b82f6" />
                <Text style={styles.addRewardText}>Add Another Reward</Text>
              </Pressable>
            </View>
          </View>
          
          <View style={styles.modalActions}>
            <Button
              title="Cancel"
              variant="outline"
              onPress={() => setShowCreateModal(false)}
              style={styles.modalButton}
            />
            <Button
              title="Create Challenge"
              variant="primary"
              onPress={() => handleCreateChallenge({})}
              style={styles.modalButton}
            />
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        title="Confirm Delete"
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedChallenge(null);
        }}
      >
        <View style={styles.modalContent}>
          <Text style={styles.deleteConfirmText}>
            Are you sure you want to delete the challenge 
            "{selectedChallenge?.name}"? This action cannot be undone.
          </Text>
          
          <View style={styles.modalActions}>
            <Button
              title="Cancel"
              variant="outline"
              onPress={() => {
                setShowDeleteModal(false);
                setSelectedChallenge(null);
              }}
              style={styles.modalButton}
            />
            <Button
              title="Delete"
              variant="primary"
              onPress={handleDeleteChallenge}
              style={[styles.modalButton, styles.deleteButton]}
            />
          </View>
        </View>
      </Modal>

      <EmployerFooter />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  filtersCard: {
    marginBottom: 20,
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  filterText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  filterButtons: {
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#f9fafb',
  },
  activeFilterButton: {
    backgroundColor: '#dbeafe',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
  },
  activeFilterText: {
    color: '#3b82f6',
    fontWeight: 'bold',
  },
  challengeCard: {
    marginBottom: 16,
    padding: 16,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  challengeInfo: {
    flex: 1,
    marginRight: 12,
  },
  challengeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  challengeDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  challengeDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  participationContainer: {
    marginBottom: 16,
  },
  participationLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  rewardsContainer: {
    marginBottom: 16,
  },
  rewardsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },
  rewardText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  pointsText: {
    fontWeight: 'bold',
    color: '#8b5cf6',
  },
  challengeActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionButton: {
    minWidth: 110,
  },
  noResultsCard: {
    padding: 24,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalContent: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  formInput: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  rewardForm: {
    gap: 12,
  },
  rewardFormRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pointsInput: {
    width: 80,
  },
  addRewardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    alignSelf: 'flex-start',
    gap: 6,
  },
  addRewardText: {
    fontSize: 14,
    color: '#3b82f6',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    gap: 8,
  },
  modalButton: {
    minWidth: 120,
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    borderColor: '#ef4444',
  },
  deleteConfirmText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
    lineHeight: 24,
  },
});

export default ChallengeManager;