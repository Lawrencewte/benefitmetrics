import {
  Activity,
  Award,
  Building,
  Users
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import EmployerFooter from '../../../components/Common/layout/EmployerFooter';
import Header from '../../../components/Common/layout/Header';
import Button from '../../../components/Common/ui/Button';
import Card from '../../../components/Common/ui/Card';
import Modal from '../../../components/Common/ui/Modal';
import ProgressBar from '../../../components/Common/ui/ProgressBar';

// Mock data to replace the failing service calls
const mockDepartmentsData = [
  {
    id: 1,
    name: 'Engineering',
    employeeCount: 142,
    manager: 'Employee ID: 1056',
    healthMetrics: {
      healthScore: 84,
      participationRate: 82,
      preventativeCompletion: 88,
      checkupsMissed: 3,
    },
    topChallenges: [
      'Skin Cancer Screenings (62%)',
      'Mental Health Utilization (68%)',
    ],
  },
  {
    id: 2,
    name: 'Sales',
    employeeCount: 78,
    manager: 'Employee ID: 3845',
    healthMetrics: {
      healthScore: 64,
      participationRate: 58,
      preventativeCompletion: 61,
      checkupsMissed: 15,
    },
    topChallenges: [
      'Annual Physical Completion (58%)',
      'Dental Checkups (62%)',
      'Eye Exams (45%)',
      'Skin Cancer Screenings (32%)',
    ],
  },
  {
    id: 3,
    name: 'Marketing',
    employeeCount: 56,
    manager: 'Employee ID: 2781',
    healthMetrics: {
      healthScore: 76,
      participationRate: 74,
      preventativeCompletion: 79,
      checkupsMissed: 6,
    },
    topChallenges: [
      'Eye Exams (65%)',
      'Skin Cancer Screenings (54%)',
    ],
  },
  {
    id: 4,
    name: 'Product',
    employeeCount: 48,
    manager: 'Employee ID: 4203',
    healthMetrics: {
      healthScore: 88,
      participationRate: 90,
      preventativeCompletion: 92,
      checkupsMissed: 1,
    },
    topChallenges: [
      'Mental Health Utilization (72%)',
    ],
  },
  {
    id: 5,
    name: 'Design',
    employeeCount: 32,
    manager: 'Employee ID: 5617',
    healthMetrics: {
      healthScore: 75,
      participationRate: 68,
      preventativeCompletion: 72,
      checkupsMissed: 7,
    },
    topChallenges: [
      'Eye Exams (60%)',
      'Skin Cancer Screenings (42%)',
    ],
  },
  {
    id: 6,
    name: 'Human Resources',
    employeeCount: 18,
    manager: 'Employee ID: 6390',
    healthMetrics: {
      healthScore: 82,
      participationRate: 88,
      preventativeCompletion: 85,
      checkupsMissed: 2,
    },
    topChallenges: [
      'Mental Health Utilization (62%)',
    ],
  },
  {
    id: 7,
    name: 'Finance',
    employeeCount: 24,
    manager: 'Employee ID: 7502',
    healthMetrics: {
      healthScore: 72,
      participationRate: 70,
      preventativeCompletion: 76,
      checkupsMissed: 5,
    },
    topChallenges: [
      'Eye Exams (58%)',
      'Skin Cancer Screenings (50%)',
    ],
  },
];

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    manager: '',
    employeeCount: ''
  });

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setIsLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setDepartments(mockDepartmentsData);
        setError(null);
      } catch (err) {
        setError('Failed to load department data');
        console.error('Error fetching department data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleUpdateDepartment = async (departmentId, updateData) => {
    try {
      // Simulate API call
      console.log('Updating department:', departmentId, updateData);
      
      // Update local state
      const updatedDepartments = departments.map(dept => 
        dept.id === departmentId 
          ? { ...dept, ...updateData }
          : dept
      );
      setDepartments(updatedDepartments);
      setShowEditModal(false);
      setSelectedDepartment(null);
    } catch (err) {
      console.error('Error updating department:', err);
    }
  };

  const openEditModal = (department) => {
    setSelectedDepartment(department);
    setEditFormData({
      name: department.name,
      manager: department.manager,
      employeeCount: department.employeeCount.toString()
    });
    setShowEditModal(true);
  };

  const calculateOverallStats = () => {
    if (!departments.length) return { avgHealth: 0, avgParticipation: 0, totalEmployees: 0 };
    
    const totalEmployees = departments.reduce((sum, dept) => sum + dept.employeeCount, 0);
    const avgHealth = Math.round(
      departments.reduce((sum, dept) => sum + dept.healthMetrics.healthScore, 0) / departments.length
    );
    const avgParticipation = Math.round(
      departments.reduce((sum, dept) => sum + dept.healthMetrics.participationRate, 0) / departments.length
    );
    
    return { avgHealth, avgParticipation, totalEmployees };
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 65) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreStyle = (score) => {
    if (score >= 80) return styles.highScore;
    if (score >= 65) return styles.mediumScore;
    return styles.lowScore;
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header title="Department Management" />
        <View style={styles.loadingContainer}>
          <Text>Loading department data...</Text>
        </View>
        <EmployerFooter />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Header title="Department Management" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button title="Retry" onPress={() => setError(null)} />
        </View>
        <EmployerFooter />
      </View>
    );
  }

  const stats = calculateOverallStats();

  return (
    <View style={styles.container}>
      <Header title="Department Management" />
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.pageTitle}>Department Health</Text>
            <Text style={styles.pageSubtitle}>
              Monitor preventative care metrics by department
            </Text>
          </View>
          <Button 
            title="Add Department" 
            onPress={() => setShowCreateModal(true)}
            variant="primary"
            style={styles.addButton}
          />
        </View>

        <View style={styles.statsOverview}>
          <Card style={styles.statsCard}>
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Users size={24} color="#3b82f6" />
                <View style={styles.statContent}>
                  <Text style={styles.statValue}>{departments.length}</Text>
                  <Text style={styles.statLabel}>Departments</Text>
                </View>
              </View>
              
              <View style={styles.statDivider} />
              
              <View style={styles.statItem}>
                <Building size={24} color="#3b82f6" />
                <View style={styles.statContent}>
                  <Text style={styles.statValue}>{stats.totalEmployees}</Text>
                  <Text style={styles.statLabel}>Total Employees</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Award size={24} color="#3b82f6" />
                <View style={styles.statContent}>
                  <Text style={styles.statValue}>{stats.avgHealth}%</Text>
                  <Text style={styles.statLabel}>Avg. Health Score</Text>
                </View>
              </View>
              
              <View style={styles.statDivider} />
              
              <View style={styles.statItem}>
                <Activity size={24} color="#3b82f6" />
                <View style={styles.statContent}>
                  <Text style={styles.statValue}>{stats.avgParticipation}%</Text>
                  <Text style={styles.statLabel}>Avg. Participation</Text>
                </View>
              </View>
            </View>
          </Card>
        </View>

        <Text style={styles.sectionTitle}>Department Health Rankings</Text>
        <View style={styles.rankingHeader}>
          <Text style={[styles.rankingHeaderItem, { flex: 3 }]}>Department</Text>
          <Text style={[styles.rankingHeaderItem, { flex: 1, textAlign: 'center' }]}>Health Score</Text>
          <Text style={[styles.rankingHeaderItem, { flex: 1, textAlign: 'center' }]}>Participation</Text>
          <Text style={[styles.rankingHeaderItem, { flex: 2, textAlign: 'right' }]}>Actions</Text>
        </View>
        
        {departments
          .sort((a, b) => b.healthMetrics.healthScore - a.healthMetrics.healthScore)
          .map((department, index) => (
            <Card key={department.id} style={styles.departmentRankingCard}>
              <View style={styles.rankingRow}>
                <View style={styles.departmentCol}>
                  <Text style={styles.rankNumber}>{index + 1}</Text>
                  <View>
                    <Text style={styles.departmentName}>{department.name}</Text>
                    <Text style={styles.employeeCount}>{department.employeeCount} employees</Text>
                  </View>
                </View>
                
                <View style={styles.scoreCol}>
                  <Text 
                    style={[
                      styles.scoreValue,
                      getScoreStyle(department.healthMetrics.healthScore)
                    ]}
                  >
                    {department.healthMetrics.healthScore}
                  </Text>
                </View>
                
                <View style={styles.participationCol}>
                  <Text 
                    style={[
                      styles.participationValue,
                      getScoreStyle(department.healthMetrics.participationRate)
                    ]}
                  >
                    {department.healthMetrics.participationRate}%
                  </Text>
                </View>
                
                <View style={styles.actionsCol}>
                  <Button 
                    title="Details" 
                    variant="outline" 
                    onPress={() => console.log(`View details for ${department.name}`)}
                    style={styles.detailsButton}
                  />
                </View>
              </View>
            </Card>
          ))}

        <Text style={styles.sectionTitle}>Department Details</Text>
        
        {departments.map(department => (
          <Card key={department.id} style={styles.departmentCard}>
            <View style={styles.departmentHeader}>
              <View style={styles.departmentInfo}>
                <Text style={styles.departmentTitle}>{department.name} Department</Text>
                <Text style={styles.departmentDetail}>
                  {department.employeeCount} employees • Manager: {department.manager}
                </Text>
              </View>
              <Button 
                title="Edit" 
                variant="outline" 
                onPress={() => openEditModal(department)}
                style={styles.editButton}
              />
            </View>
            
            <View style={styles.metricsContainer}>
              <View style={styles.metricRow}>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Health Score</Text>
                  <Text 
                    style={[
                      styles.metricValue,
                      getScoreStyle(department.healthMetrics.healthScore)
                    ]}
                  >
                    {department.healthMetrics.healthScore}
                  </Text>
                  <ProgressBar 
                    progress={department.healthMetrics.healthScore / 100} 
                    color={getScoreColor(department.healthMetrics.healthScore)}
                  />
                </View>
                
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Participation Rate</Text>
                  <Text 
                    style={[
                      styles.metricValue,
                      getScoreStyle(department.healthMetrics.participationRate)
                    ]}
                  >
                    {department.healthMetrics.participationRate}%
                  </Text>
                  <ProgressBar 
                    progress={department.healthMetrics.participationRate / 100} 
                    color={getScoreColor(department.healthMetrics.participationRate)}
                  />
                </View>
              </View>
              
              <View style={styles.metricRow}>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Preventative Completion</Text>
                  <Text 
                    style={[
                      styles.metricValue,
                      getScoreStyle(department.healthMetrics.preventativeCompletion)
                    ]}
                  >
                    {department.healthMetrics.preventativeCompletion}%
                  </Text>
                  <ProgressBar 
                    progress={department.healthMetrics.preventativeCompletion / 100} 
                    color={getScoreColor(department.healthMetrics.preventativeCompletion)}
                  />
                </View>
                
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Checkups Missed</Text>
                  <Text 
                    style={[
                      styles.metricValue,
                      department.healthMetrics.checkupsMissed <= 5 ? styles.highScore : 
                      department.healthMetrics.checkupsMissed <= 10 ? styles.mediumScore : 
                      styles.lowScore
                    ]}
                  >
                    {department.healthMetrics.checkupsMissed}
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.challengesContainer}>
              <Text style={styles.challengesTitle}>Top Improvement Areas:</Text>
              {department.topChallenges.map((challenge, index) => (
                <View key={index} style={styles.challengeItem}>
                  <Text style={styles.challengeText}>• {challenge}</Text>
                </View>
              ))}
            </View>
            
            <View style={styles.departmentActions}>
              <Button 
                title="Detailed Analytics" 
                variant="primary" 
                onPress={() => console.log(`View analytics for ${department.name}`)}
                style={styles.departmentAction}
              />
              <Button 
                title="Employee List" 
                variant="outline" 
                onPress={() => console.log(`View employees for ${department.name}`)}
                style={styles.departmentAction}
              />
            </View>
          </Card>
        ))}
      </ScrollView>

      {/* Edit Department Modal */}
      <Modal
        visible={showEditModal}
        title={`Edit ${selectedDepartment?.name} Department`}
        onClose={() => {
          setShowEditModal(false);
          setSelectedDepartment(null);
        }}
      >
        <View style={styles.modalContent}>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Department Name</Text>
            <TextInput
              style={styles.formInput}
              value={editFormData.name}
              onChangeText={(text) => setEditFormData(prev => ({ ...prev, name: text }))}
              placeholder="Enter department name"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Manager ID</Text>
            <TextInput
              style={styles.formInput}
              value={editFormData.manager}
              onChangeText={(text) => setEditFormData(prev => ({ ...prev, manager: text }))}
              placeholder="Enter manager ID"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Employee Count</Text>
            <TextInput
              style={styles.formInput}
              value={editFormData.employeeCount}
              onChangeText={(text) => setEditFormData(prev => ({ ...prev, employeeCount: text }))}
              placeholder="Enter employee count"
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.modalActions}>
            <Button
              title="Cancel"
              variant="outline"
              onPress={() => {
                setShowEditModal(false);
                setSelectedDepartment(null);
              }}
              style={styles.modalButton}
            />
            <Button
              title="Save Changes"
              variant="primary"
              onPress={() => handleUpdateDepartment(selectedDepartment?.id, {
                name: editFormData.name,
                manager: editFormData.manager,
                employeeCount: parseInt(editFormData.employeeCount) || 0
              })}
              style={styles.modalButton}
            />
          </View>
        </View>
      </Modal>

      {/* Create Department Modal */}
      <Modal
        visible={showCreateModal}
        title="Create New Department"
        onClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalContent}>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Department Name</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Enter department name"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Manager ID</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Enter manager ID"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Initial Employee Count</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Enter employee count"
              keyboardType="numeric"
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
              title="Create Department"
              variant="primary"
              onPress={() => {
                console.log('Creating new department');
                setShowCreateModal(false);
              }}
              style={styles.modalButton}
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
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
  addButton: {
    minWidth: 120,
  },
  statsOverview: {
    marginBottom: 24,
  },
  statsCard: {
    padding: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  statDivider: {
    height: 40,
    width: 1,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    marginTop: 8,
  },
  rankingHeader: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    marginBottom: 8,
  },
  rankingHeaderItem: {
    fontWeight: 'bold',
    color: '#666',
    fontSize: 14,
  },
  departmentRankingCard: {
    marginBottom: 8,
    padding: 12,
  },
  rankingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  departmentCol: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rankNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  departmentName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  employeeCount: {
    fontSize: 12,
    color: '#666',
  },
  scoreCol: {
    flex: 1,
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  participationCol: {
    flex: 1,
    alignItems: 'center',
  },
  participationValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionsCol: {
    flex: 2,
    alignItems: 'flex-end',
  },
  highScore: {
    color: '#10b981',
  },
  mediumScore: {
    color: '#f59e0b',
  },
  lowScore: {
    color: '#ef4444',
  },
  detailsButton: {
    paddingHorizontal: 8,
    minWidth: 80,
  },
  departmentCard: {
    marginBottom: 16,
    padding: 16,
  },
  departmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  departmentInfo: {
    flex: 1,
  },
  departmentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  departmentDetail: {
    fontSize: 14,
    color: '#666',
  },
  editButton: {
    minWidth: 60,
  },
  metricsContainer: {
    marginBottom: 16,
  },
  metricRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  metricItem: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  challengesContainer: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 4,
    marginBottom: 16,
  },
  challengesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  challengeItem: {
    marginBottom: 4,
  },
  challengeText: {
    fontSize: 14,
    color: '#666',
  },
  departmentActions: {
    flexDirection: 'row',
    gap: 8,
  },
  departmentAction: {
    flex: 1,
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
    color: '#333',
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
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
});

export default DepartmentManagement;