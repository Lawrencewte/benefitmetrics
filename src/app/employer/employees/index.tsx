import { ArrowUpDown, BarChart2, Bell, Building, ChevronDown, Mail, Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import EmployerFooter from '../../../components/Common/layout/EmployerFooter';
import Header from '../../../components/Common/layout/Header';
import Button from '../../../components/Common/ui/Button';
import Card from '../../../components/Common/ui/Card';
import ProgressBar from '../../../components/Common/ui/ProgressBar';
import { getEmployeeDirectory } from '../../../services/employer/employeeData';
import { anonymization } from '../../../utils/anonymization';

const EmployeeDirectory = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name-asc');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Mock employee data with proper anonymization
  const mockEmployeeData = [
    {
      id: 1,
      name: 'Employee ID: 4872',
      title: 'Software Engineer',
      department: 'Engineering',
      healthScore: 86,
      participationRate: 92,
      checkups: {
        completed: 4,
        total: 5,
        nextDue: '2025-07-15',
      },
      recentActivities: [
        { type: 'Annual Physical', date: '2025-02-10', status: 'completed' },
        { type: 'Dental Checkup', date: '2025-03-22', status: 'completed' },
        { type: 'Eye Exam', date: '2025-04-05', status: 'completed' },
      ],
    },
    {
      id: 2,
      name: 'Employee ID: 6391',
      title: 'Sales Manager',
      department: 'Sales',
      healthScore: 65,
      participationRate: 58,
      checkups: {
        completed: 2,
        total: 5,
        nextDue: '2025-05-30',
      },
      recentActivities: [
        { type: 'Annual Physical', date: '2025-02-18', status: 'completed' },
        { type: 'Skin Check', date: '2025-06-15', status: 'scheduled' },
      ],
    },
    {
      id: 3,
      name: 'Employee ID: 2189',
      title: 'Marketing Specialist',
      department: 'Marketing',
      healthScore: 78,
      participationRate: 74,
      checkups: {
        completed: 3,
        total: 5,
        nextDue: '2025-06-10',
      },
      recentActivities: [
        { type: 'Annual Physical', date: '2025-01-20', status: 'completed' },
        { type: 'Dental Checkup', date: '2025-02-05', status: 'completed' },
        { type: 'Eye Exam', date: '2025-06-10', status: 'scheduled' },
      ],
    },
    {
      id: 4,
      name: 'Employee ID: 7514',
      title: 'Product Manager',
      department: 'Product',
      healthScore: 92,
      participationRate: 96,
      checkups: {
        completed: 5,
        total: 5,
        nextDue: '2025-08-22',
      },
      recentActivities: [
        { type: 'Annual Physical', date: '2025-01-12', status: 'completed' },
        { type: 'Dental Checkup', date: '2025-02-25', status: 'completed' },
        { type: 'Eye Exam', date: '2025-03-18', status: 'completed' },
        { type: 'Skin Check', date: '2025-04-05', status: 'completed' },
      ],
    },
    {
      id: 5,
      name: 'Employee ID: 3256',
      title: 'UX Designer',
      department: 'Design',
      healthScore: 74,
      participationRate: 68,
      checkups: {
        completed: 2,
        total: 4,
        nextDue: '2025-05-18',
      },
      recentActivities: [
        { type: 'Annual Physical', date: '2025-01-30', status: 'completed' },
        { type: 'Dental Checkup', date: '2025-03-15', status: 'completed' },
        { type: 'Eye Exam', date: '2025-05-18', status: 'scheduled' },
      ],
    },
    {
      id: 6,
      name: 'Employee ID: 9012',
      title: 'HR Specialist',
      department: 'HR',
      healthScore: 82,
      participationRate: 88,
      checkups: {
        completed: 4,
        total: 5,
        nextDue: '2025-07-05',
      },
      recentActivities: [
        { type: 'Annual Physical', date: '2025-02-05', status: 'completed' },
        { type: 'Dental Checkup', date: '2025-03-10', status: 'completed' },
        { type: 'Eye Exam', date: '2025-04-15', status: 'completed' },
        { type: 'Mental Health Check', date: '2025-05-01', status: 'completed' },
      ],
    },
  ];

  const fetchEmployeeData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Try to fetch real data, fall back to mock data
      try {
        const data = await getEmployeeDirectory();
        const anonymizedData = anonymization?.anonymizeEmployeeData ? 
          anonymization.anonymizeEmployeeData(data) : data;
        setEmployees(anonymizedData);
      } catch (apiError) {
        console.log('API not available, using mock data');
        // Use mock data as fallback
        setEmployees(mockEmployeeData);
      }
    } catch (err) {
      console.error('Error in fetchEmployeeData:', err);
      // Even if there's an error, show mock data
      setEmployees(mockEmployeeData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  useEffect(() => {
    // Apply filters and sorting
    let filtered = [...employees];
    
    // Apply department filter
    if (departmentFilter !== 'all') {
      filtered = filtered.filter(employee => 
        employee.department?.toLowerCase() === departmentFilter.toLowerCase()
      );
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(employee => 
        employee.name?.toLowerCase().includes(query) || 
        employee.department?.toLowerCase().includes(query) ||
        employee.title?.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'name-asc':
        filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      case 'name-desc':
        filtered.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
        break;
      case 'department':
        filtered.sort((a, b) => (a.department || '').localeCompare(b.department || ''));
        break;
      case 'health-score-asc':
        filtered.sort((a, b) => (a.healthScore || 0) - (b.healthScore || 0));
        break;
      case 'health-score-desc':
        filtered.sort((a, b) => (b.healthScore || 0) - (a.healthScore || 0));
        break;
      case 'participation-asc':
        filtered.sort((a, b) => (a.participationRate || 0) - (b.participationRate || 0));
        break;
      case 'participation-desc':
        filtered.sort((a, b) => (b.participationRate || 0) - (a.participationRate || 0));
        break;
      default:
        break;
    }
    
    setFilteredEmployees(filtered);
  }, [employees, departmentFilter, searchQuery, sortBy]);

  const handleSendReminders = (employeeIds) => {
    console.log(`Sending reminders to employees: ${employeeIds.join(', ')}`);
    // Implementation for sending reminders to selected employees
  };

  const handleRetry = () => {
    fetchEmployeeData();
  };

  const departments = [
    { id: 'all', name: 'All Departments' },
    { id: 'engineering', name: 'Engineering' },
    { id: 'sales', name: 'Sales' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'product', name: 'Product' },
    { id: 'design', name: 'Design' },
    { id: 'hr', name: 'Human Resources' },
    { id: 'finance', name: 'Finance' },
  ];

  const sortOptions = [
    { id: 'name-asc', name: 'Name (A-Z)' },
    { id: 'name-desc', name: 'Name (Z-A)' },
    { id: 'department', name: 'Department' },
    { id: 'health-score-desc', name: 'Health Score (High-Low)' },
    { id: 'health-score-asc', name: 'Health Score (Low-High)' },
    { id: 'participation-desc', name: 'Participation (High-Low)' },
    { id: 'participation-asc', name: 'Participation (Low-High)' },
  ];

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header title="Employee Directory" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading employee data...</Text>
        </View>
        <EmployerFooter />
      </View>
    );
  }

  // Calculate stats from current employees
  const totalEmployees = employees.length;
  const participatingEmployees = employees.filter(emp => emp.participationRate > 0).length;
  const participationRate = totalEmployees > 0 ? Math.round((participatingEmployees / totalEmployees) * 100) : 0;

  return (
    <View style={styles.container}>
      <Header title="Employee Directory" />
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.pageTitle}>Employee Health Directory</Text>
            <Text style={styles.pageSubtitle}>
              View anonymized health metrics and preventative care participation
            </Text>
          </View>
          <View style={styles.headerStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalEmployees}</Text>
              <Text style={styles.statLabel}>Employees</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{participationRate}%</Text>
              <Text style={styles.statLabel}>Participation</Text>
            </View>
          </View>
        </View>

        <Card style={styles.filtersCard}>
          <View style={styles.searchContainer}>
            <Search size={18} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search employees..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <View style={styles.filterRow}>
            <View style={styles.filterDropdown}>
              <View style={styles.filterLabel}>
                <Building size={16} color="#666" />
                <Text style={styles.filterText}>Department:</Text>
              </View>
              <Pressable 
                style={styles.dropdown}
                onPress={() => setShowDepartmentDropdown(!showDepartmentDropdown)}
              >
                <Text style={styles.dropdownText}>
                  {departments.find(d => d.id === departmentFilter)?.name}
                </Text>
                <ChevronDown size={16} color="#666" />
              </Pressable>
              {showDepartmentDropdown && (
                <View style={styles.dropdownMenu}>
                  {departments.map(dept => (
                    <Pressable
                      key={dept.id}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setDepartmentFilter(dept.id);
                        setShowDepartmentDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{dept.name}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
            
            <View style={styles.filterDropdown}>
              <View style={styles.filterLabel}>
                <ArrowUpDown size={16} color="#666" />
                <Text style={styles.filterText}>Sort by:</Text>
              </View>
              <Pressable 
                style={styles.dropdown}
                onPress={() => setShowSortDropdown(!showSortDropdown)}
              >
                <Text style={styles.dropdownText}>
                  {sortOptions.find(o => o.id === sortBy)?.name}
                </Text>
                <ChevronDown size={16} color="#666" />
              </Pressable>
              {showSortDropdown && (
                <View style={styles.dropdownMenu}>
                  {sortOptions.map(option => (
                    <Pressable
                      key={option.id}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSortBy(option.id);
                        setShowSortDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{option.name}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          </View>
        </Card>

        <Card style={styles.bulkActionsCard}>
          <Text style={styles.bulkActionsText}>Send reminders to employees with:</Text>
          <View style={styles.bulkActionsButtons}>
            <Button 
              title="Low Health Score" 
              variant="outline" 
              onPress={() => handleSendReminders([2, 5])}
              style={styles.bulkActionButton}
            />
            <Button 
              title="Upcoming Checkups" 
              variant="outline" 
              onPress={() => handleSendReminders([2, 3, 5])}
              style={styles.bulkActionButton}
            />
            <Button 
              title="Missed Appointments" 
              variant="outline" 
              onPress={() => handleSendReminders([2])}
              style={styles.bulkActionButton}
            />
          </View>
        </Card>

        <View style={styles.directoryResults}>
          <Text style={styles.resultsCount}>
            Showing {filteredEmployees.length} of {employees.length} employees
          </Text>
          
          {filteredEmployees.map(employee => (
            <Card key={employee.id} style={styles.employeeCard}>
              <View style={styles.employeeHeader}>
                <View>
                  <Text style={styles.employeeName}>{employee.name}</Text>
                  <Text style={styles.employeeTitle}>{employee.title} • {employee.department}</Text>
                </View>
                <View style={styles.employeeActions}>
                  <Pressable style={styles.actionButton}>
                    <Mail size={18} color="#3b82f6" />
                  </Pressable>
                  <Pressable style={styles.actionButton}>
                    <Bell size={18} color="#3b82f6" />
                  </Pressable>
                </View>
              </View>
              
              <View style={styles.metricsContainer}>
                <View style={styles.metricItem}>
                  <View style={styles.metricHeader}>
                    <Text style={styles.metricLabel}>Health Score</Text>
                    <Text 
                      style={[
                        styles.metricValue,
                        employee.healthScore >= 80 ? styles.highScore : 
                        employee.healthScore >= 60 ? styles.mediumScore : 
                        styles.lowScore
                      ]}
                    >
                      {employee.healthScore}
                    </Text>
                  </View>
                  <ProgressBar 
                    progress={employee.healthScore / 100} 
                    color={
                      employee.healthScore >= 80 ? '#10b981' : 
                      employee.healthScore >= 60 ? '#f59e0b' : 
                      '#ef4444'
                    } 
                  />
                </View>
                
                <View style={styles.metricItem}>
                  <View style={styles.metricHeader}>
                    <Text style={styles.metricLabel}>Participation Rate</Text>
                    <Text 
                      style={[
                        styles.metricValue,
                        employee.participationRate >= 80 ? styles.highScore : 
                        employee.participationRate >= 60 ? styles.mediumScore : 
                        styles.lowScore
                      ]}
                    >
                      {employee.participationRate}%
                    </Text>
                  </View>
                  <ProgressBar 
                    progress={employee.participationRate / 100} 
                    color={
                      employee.participationRate >= 80 ? '#10b981' : 
                      employee.participationRate >= 60 ? '#f59e0b' : 
                      '#ef4444'
                    } 
                  />
                </View>
              </View>
              
              <View style={styles.preventativeCare}>
                <Text style={styles.preventativeCareLabel}>
                  Preventative Care: {employee.checkups.completed}/{employee.checkups.total} completed
                </Text>
                <Text style={styles.nextCheckupDate}>
                  Next checkup due: {employee.checkups.nextDue}
                </Text>
              </View>
              
              <View style={styles.activityContainer}>
                <Text style={styles.activityLabel}>Recent Activities:</Text>
                {employee.recentActivities.map((activity, index) => (
                  <View key={index} style={styles.activityItem}>
                    <Text style={styles.activityType}>{activity.type}</Text>
                    <View style={styles.activityDetails}>
                      <Text style={styles.activityDate}>{activity.date}</Text>
                      <View 
                        style={[
                          styles.activityStatusBadge,
                          activity.status === 'completed' ? styles.completedBadge : styles.scheduledBadge
                        ]}
                      >
                        <Text 
                          style={[
                            styles.activityStatusText,
                            activity.status === 'completed' ? styles.completedText : styles.scheduledText
                          ]}
                        >
                          {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
              
              <View style={styles.employeeCardEmployerFooter}>
                <Button 
                  icon={<BarChart2 size={16} />}
                  title="View Health Analytics" 
                  variant="primary" 
                  onPress={() => console.log(`View analytics for employee ${employee.id}`)}
                />
              </View>
            </Card>
          ))}
        </View>

        {filteredEmployees.length === 0 && (
          <Card style={styles.noResultsCard}>
            <Text style={styles.noResultsText}>No employees found matching your criteria.</Text>
            <Button title="Clear Filters" onPress={() => {
              setSearchQuery('');
              setDepartmentFilter('all');
              setSortBy('name-asc');
            }} />
          </Card>
        )}
      </ScrollView>
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
    marginBottom: 20,
  },
  headerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 8,
  },
  statItem: {
    alignItems: 'center',
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
    height: 24,
    width: 1,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 24,
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
    marginBottom: 16,
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
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterDropdown: {
    flex: 1,
    marginHorizontal: 4,
    position: 'relative',
  },
  filterLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 4,
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    backgroundColor: '#f9fafb',
  },
  dropdownText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    marginTop: 4,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#333',
  },
  bulkActionsCard: {
    backgroundColor: '#f0f9ff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  bulkActionsText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  bulkActionsButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  bulkActionButton: {
    flex: 1,
  },
  directoryResults: {
    marginBottom: 20,
  },
  resultsCount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  employeeCard: {
    marginBottom: 16,
    padding: 16,
  },
  employeeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  employeeTitle: {
    fontSize: 14,
    color: '#666',
  },
  employeeActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricsContainer: {
    marginBottom: 16,
    gap: 12,
  },
  metricItem: {
    marginBottom: 8,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  metricLabel: {
    fontSize: 14,
    color: '#666',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: 'bold',
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
  preventativeCare: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  preventativeCareLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  nextCheckupDate: {
    fontSize: 14,
    color: '#666',
  },
  activityContainer: {
    marginBottom: 16,
  },
  activityLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  activityType: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  activityDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  activityDate: {
    fontSize: 14,
    color: '#666',
  },
  activityStatusBadge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 12,
  },
  completedBadge: {
    backgroundColor: '#dcfce7',
  },
  scheduledBadge: {
    backgroundColor: '#dbeafe',
  },
  activityStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  completedText: {
    color: '#10b981',
  },
  scheduledText: {
    color: '#3b82f6',
  },
  employeeCardEmployerFooter: {
    marginTop: 8,
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
});

export default EmployeeDirectory;