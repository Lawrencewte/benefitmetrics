import { Award, BarChart2, DollarSign, Edit, Eye, Filter, Gift, PlusCircle, Search, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import EmployerFooter from '../../../components/Common/layout/EmployerFooter';
import Header from '../../../components/Common/layout/Header';
import Button from '../../../components/Common/ui/Button';
import Card from '../../../components/Common/ui/Card';
import Modal from '../../../components/Common/ui/Modal';
import { createIncentive, deleteIncentive, getIncentives } from '../../../services/employer/programManagement';

const IncentivesManager = () => {
  const [incentives, setIncentives] = useState([]);
  const [filteredIncentives, setFilteredIncentives] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedIncentive, setSelectedIncentive] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock incentives data
  const mockIncentivesData = [
    {
      id: 1,
      name: 'Health Insurance Premium Discount',
      description: '$25 monthly discount on your premiums',
      pointsRequired: 500,
      claimed: 125,
      eligible: 280,
      type: 'financial',
      value: '$300/year',
    },
    {
      id: 2,
      name: 'Fitness Membership',
      description: 'Free 3-month gym membership',
      pointsRequired: 400,
      claimed: 78,
      eligible: 163,
      type: 'wellness',
      value: '$150',
    },
    {
      id: 3,
      name: 'Wellness Day Off',
      description: 'Extra PTO day for wellness activities',
      pointsRequired: 300,
      claimed: 42,
      eligible: 155,
      type: 'time',
      value: '1 day',
    },
    {
      id: 4,
      name: 'Healthy Meal Delivery',
      description: 'Week of healthy prepared meals',
      pointsRequired: 250,
      claimed: 95,
      eligible: 212,
      type: 'wellness',
      value: '$120',
    },
    {
      id: 5,
      name: 'Standing Desk',
      description: 'Ergonomic standing desk for home office',
      pointsRequired: 750,
      claimed: 32,
      eligible: 68,
      type: 'equipment',
      value: '$350',
    },
    {
      id: 6,
      name: 'HSA Contribution',
      description: 'Extra $100 contribution to your HSA',
      pointsRequired: 350,
      claimed: 102,
      eligible: 226,
      type: 'financial',
      value: '$100',
    },
  ];

  const fetchIncentives = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Try to fetch real data, fall back to mock data
      try {
        const data = await getIncentives();
        setIncentives(data || mockIncentivesData);
      } catch (apiError) {
        console.log('API not available, using mock data');
        // Use mock data as fallback
        setIncentives(mockIncentivesData);
      }
    } catch (err) {
      console.error('Error in fetchIncentives:', err);
      // Even if there's an error, show mock data
      setIncentives(mockIncentivesData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIncentives();
  }, []);

  useEffect(() => {
    // Apply filters and search
    let filtered = incentives;
    
    // Apply type filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(incentive => incentive.type?.toLowerCase() === activeFilter);
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(incentive => 
        incentive.name?.toLowerCase().includes(query) || 
        incentive.description?.toLowerCase().includes(query)
      );
    }
    
    setFilteredIncentives(filtered);
  }, [incentives, activeFilter, searchQuery]);

  const handleCreateIncentive = async (formData) => {
    try {
      await createIncentive(formData);
      setShowCreateModal(false);
      // Reload incentives
      await fetchIncentives();
    } catch (err) {
      console.error('Error creating incentive:', err);
      // For now, just close modal - in real app, show error to user
      setShowCreateModal(false);
    }
  };

  const handleDeleteIncentive = async () => {
    if (!selectedIncentive) return;
    
    try {
      await deleteIncentive(selectedIncentive.id);
      setShowDeleteModal(false);
      setSelectedIncentive(null);
      // Reload incentives
      await fetchIncentives();
    } catch (err) {
      console.error('Error deleting incentive:', err);
      // For now, just close modal - in real app, show error to user
      setShowDeleteModal(false);
      setSelectedIncentive(null);
    }
  };

  const confirmDelete = (incentive) => {
    setSelectedIncentive(incentive);
    setShowDeleteModal(true);
  };

  const handleRetry = () => {
    fetchIncentives();
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header title="Incentives Management" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading incentives...</Text>
        </View>
        <EmployerFooter />
      </View>
    );
  }

  const getTypeBadgeStyle = (type) => {
    switch (type) {
      case 'financial':
        return { backgroundColor: '#dcfce7', color: '#10b981' };
      case 'wellness':
        return { backgroundColor: '#dbeafe', color: '#3b82f6' };
      case 'time':
        return { backgroundColor: '#fef3c7', color: '#f59e0b' };
      case 'equipment':
        return { backgroundColor: '#fae8ff', color: '#c026d3' };
      default:
        return { backgroundColor: '#f3f4f6', color: '#666' };
    }
  };

  const filterOptions = [
    { key: 'all', label: 'All' },
    { key: 'financial', label: 'Financial' },
    { key: 'wellness', label: 'Wellness' },
    { key: 'time', label: 'Time Off' },
    { key: 'equipment', label: 'Equipment' }
  ];

  // Calculate summary statistics
  const totalIncentives = incentives.length;
  const totalClaimed = incentives.reduce((sum, incentive) => sum + incentive.claimed, 0);
  const totalValue = incentives.reduce((sum, incentive) => {
    const valueNumber = parseFloat(incentive.value.replace(/[^0-9.]/g, ''));
    return sum + (valueNumber * incentive.claimed);
  }, 0);

  return (
    <View style={styles.container}>
      <Header title="Incentives Management" />
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.pageTitle}>Rewards & Incentives</Text>
            <Text style={styles.pageSubtitle}>
              Manage rewards for your organization's wellness and preventative care program
            </Text>
          </View>
          <Button 
            icon={<PlusCircle size={18} />}
            title="Create Incentive" 
            onPress={() => setShowCreateModal(true)}
            variant="primary"
          />
        </View>

        <Card style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Gift size={24} color="#8b5cf6" />
              <Text style={styles.summaryValue}>{totalIncentives}</Text>
              <Text style={styles.summaryLabel}>Total Incentives</Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Award size={24} color="#8b5cf6" />
              <Text style={styles.summaryValue}>{totalClaimed}</Text>
              <Text style={styles.summaryLabel}>Rewards Claimed</Text>
            </View>
            
            <View style={styles.summaryItem}>
              <DollarSign size={24} color="#8b5cf6" />
              <Text style={styles.summaryValue}>${totalValue.toLocaleString()}</Text>
              <Text style={styles.summaryLabel}>Total Value</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.filtersCard}>
          <View style={styles.searchContainer}>
            <Search size={18} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search incentives..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <View style={styles.filterContainer}>
            <View style={styles.filterLabel}>
              <Filter size={16} color="#666" />
              <Text style={styles.filterText}>Filter by type:</Text>
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

        {filteredIncentives.map(incentive => {
          const typeBadgeStyle = getTypeBadgeStyle(incentive.type);
          return (
            <Card key={incentive.id} style={styles.incentiveCard}>
              <View style={styles.incentiveHeader}>
                <View style={styles.incentiveInfo}>
                  <Text style={styles.incentiveName}>{incentive.name}</Text>
                  <Text style={styles.incentiveDescription}>
                    {incentive.description}
                  </Text>
                </View>
                <View style={styles.pointsContainer}>
                  <Award size={16} color="#8b5cf6" />
                  <Text style={styles.pointsText}>{incentive.pointsRequired} pts</Text>
                </View>
              </View>
              
              <View style={styles.incentiveDetails}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Type:</Text>
                  <View 
                    style={[
                      styles.typeBadge,
                      { backgroundColor: typeBadgeStyle.backgroundColor }
                    ]}
                  >
                    <Text 
                      style={[
                        styles.typeText,
                        { color: typeBadgeStyle.color }
                      ]}
                    >
                      {incentive.type?.charAt(0).toUpperCase() + incentive.type?.slice(1)}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Estimated Value:</Text>
                  <Text style={styles.detailValue}>{incentive.value}</Text>
                </View>
              </View>
              
              <View style={styles.claimsContainer}>
                <View style={styles.claimsHeader}>
                  <Text style={styles.claimsLabel}>
                    Claims: {incentive.claimed}/{incentive.eligible} eligible employees
                  </Text>
                  <Text style={styles.claimsPercentage}>
                    {Math.round((incentive.claimed / incentive.eligible) * 100)}%
                  </Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <View 
                    style={[
                      styles.progressBar,
                      { width: `${(incentive.claimed / incentive.eligible) * 100}%` }
                    ]}
                  />
                </View>
              </View>
              
              <View style={styles.incentiveActions}>
                <Button 
                  icon={<Eye size={16} />}
                  title="View Details" 
                  variant="primary" 
                  onPress={() => console.log(`View incentive ${incentive.id}`)}
                  style={styles.actionButton}
                />
                
                <Button 
                  icon={<Edit size={16} />}
                  title="Edit" 
                  variant="outline" 
                  onPress={() => console.log(`Edit incentive ${incentive.id}`)}
                  style={styles.actionButton}
                />
                
                <Button 
                  icon={<BarChart2 size={16} />}
                  title="Analytics" 
                  variant="outline" 
                  onPress={() => console.log(`View analytics for incentive ${incentive.id}`)}
                  style={styles.actionButton}
                />
                
                <Button 
                  icon={<Trash2 size={16} />}
                  title="Delete" 
                  variant="outline" 
                  onPress={() => confirmDelete(incentive)}
                  style={styles.actionButton}
                />
              </View>
            </Card>
          );
        })}

        {filteredIncentives.length === 0 && (
          <Card style={styles.noResultsCard}>
            <Text style={styles.noResultsText}>
              No incentives found matching your criteria.
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

      {/* Create Incentive Modal */}
      <Modal
        visible={showCreateModal}
        title="Create New Incentive"
        onClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalContent}>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Incentive Name</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Enter incentive name"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Description</Text>
            <TextInput
              style={[styles.formInput, styles.textArea]}
              placeholder="Enter incentive description"
              multiline
              numberOfLines={4}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Required Points</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Enter points required"
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Incentive Type</Text>
            <View style={styles.typeOptions}>
              {filterOptions.slice(1).map(option => (
                <Pressable key={option.key} style={styles.typeOption}>
                  <Text style={styles.typeOptionText}>{option.label}</Text>
                  {/* Radio button would go here */}
                </Pressable>
              ))}
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Estimated Value</Text>
            <TextInput
              style={styles.formInput}
              placeholder="E.g., $100, 1 day, etc."
            />
          </View>
          
          <View style={styles.modalActions}>
            <Button
              title="Cancel"
              variant="outline"
              onPress={() => setShowCreateModal(false)}
              style={styles.modalButton}
            />
            <Button
              title="Create Incentive"
              variant="primary"
              onPress={() => handleCreateIncentive({})}
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
          setSelectedIncentive(null);
        }}
      >
        <View style={styles.modalContent}>
          <Text style={styles.deleteConfirmText}>
            Are you sure you want to delete the incentive 
            "{selectedIncentive?.name}"? This action cannot be undone.
          </Text>
          
          <View style={styles.modalActions}>
            <Button
              title="Cancel"
              variant="outline"
              onPress={() => {
                setShowDeleteModal(false);
                setSelectedIncentive(null);
              }}
              style={styles.modalButton}
            />
            <Button
              title="Delete"
              variant="primary"
              onPress={handleDeleteIncentive}
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
  summaryCard: {
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 12,
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
    flexWrap: 'wrap',
  },
  filterLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 8,
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
    marginBottom: 8,
  },
  activeFilterButton: {
    backgroundColor: '#f3e8ff',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
  },
  activeFilterText: {
    color: '#8b5cf6',
    fontWeight: 'bold',
  },
  incentiveCard: {
    marginBottom: 16,
    padding: 16,
  },
  incentiveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  incentiveInfo: {
    flex: 1,
    marginRight: 12,
  },
  incentiveName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  incentiveDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3e8ff',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
    gap: 4,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8b5cf6',
  },
  incentiveDetails: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 24,
    flexWrap: 'wrap',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  typeBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 16,
  },
  typeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  claimsContainer: {
    marginBottom: 16,
  },
  claimsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  claimsLabel: {
    fontSize: 14,
    color: '#666',
  },
  claimsPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#8b5cf6',
    borderRadius: 4,
  },
  incentiveActions: {
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
  typeOptions: {
    gap: 8,
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  typeOptionText: {
    fontSize: 16,
    color: '#333',
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

export default IncentivesManager;