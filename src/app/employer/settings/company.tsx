import EmployerFooter from '@/src/components/Common/layout/EmployerFooter';
import { Building, Edit3, MapPin, Plus, Save, Trash2, Users, X } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';


interface CompanyInfo {
  name: string;
  industry: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  website: string;
  email: string;
  employeeCount: number;
  founded: string;
}

interface Department {
  id: string;
  name: string;
  employeeCount: number;
  manager: string;
  description: string;
}

export default function CompanySettings() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'departments' | 'locations'>('info');
  const [addingDepartment, setAddingDepartment] = useState(false);

  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: 'Acme Corporation',
    industry: 'Technology',
    address: '123 Innovation Drive',
    city: 'Austin',
    state: 'Texas',
    zipCode: '78701',
    phone: '+1 (555) 123-4567',
    website: 'https://acme.com',
    email: 'hr@acme.com',
    employeeCount: 412,
    founded: '2015'
  });

  const [departments, setDepartments] = useState<Department[]>([
    {
      id: '1',
      name: 'Engineering',
      employeeCount: 156,
      manager: 'Sarah Chen',
      description: 'Software development and technical operations'
    },
    {
      id: '2',
      name: 'Sales',
      employeeCount: 89,
      manager: 'Michael Rodriguez',
      description: 'Revenue generation and client acquisition'
    },
    {
      id: '3',
      name: 'Marketing',
      employeeCount: 67,
      manager: 'Jessica Thompson',
      description: 'Brand management and digital marketing'
    },
    {
      id: '4',
      name: 'Operations',
      employeeCount: 45,
      manager: 'David Kim',
      description: 'Business operations and process management'
    },
    {
      id: '5',
      name: 'Human Resources',
      employeeCount: 23,
      manager: 'Emily Johnson',
      description: 'Employee relations and organizational development'
    },
    {
      id: '6',
      name: 'Finance',
      employeeCount: 32,
      manager: 'Robert Davis',
      description: 'Financial planning and accounting'
    }
  ]);

  const [newDepartment, setNewDepartment] = useState<Partial<Department>>({
    name: '',
    manager: '',
    description: '',
    employeeCount: 0
  });

  const handleSave = () => {
    Alert.alert(
      'Save Changes',
      'Are you sure you want to save the company information changes?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save',
          onPress: () => {
            setIsEditing(false);
            Alert.alert('Success', 'Company information has been updated.');
          }
        }
      ]
    );
  };

  const handleCancel = () => {
    Alert.alert(
      'Discard Changes',
      'Are you sure you want to discard your changes?',
      [
        { text: 'Keep Editing', style: 'cancel' },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => {
            setIsEditing(false);
            // Reset form to original values
          }
        }
      ]
    );
  };

  const addDepartment = () => {
    if (!newDepartment.name || !newDepartment.manager) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    const department: Department = {
      id: Date.now().toString(),
      name: newDepartment.name!,
      manager: newDepartment.manager!,
      description: newDepartment.description || '',
      employeeCount: newDepartment.employeeCount || 0
    };

    setDepartments([...departments, department]);
    setNewDepartment({ name: '', manager: '', description: '', employeeCount: 0 });
    setAddingDepartment(false);
    Alert.alert('Success', 'Department has been added.');
  };

  const deleteDepartment = (id: string) => {
    Alert.alert(
      'Delete Department',
      'Are you sure you want to delete this department? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setDepartments(departments.filter(dept => dept.id !== id));
            Alert.alert('Success', 'Department has been deleted.');
          }
        }
      ]
    );
  };

  const renderCompanyInfo = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Company Information</Text>
        {!isEditing ? (
          <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
            <Edit3 size={16} color="#8b5cf6" />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.editActions}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <X size={16} color="#6b7280" />
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Save size={16} color="#fff" />
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.formGrid}>
        <View style={styles.formRow}>
          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Company Name *</Text>
            <TextInput
              style={[styles.textInput, !isEditing && styles.disabledInput]}
              value={companyInfo.name}
              onChangeText={(text) => setCompanyInfo({...companyInfo, name: text})}
              editable={isEditing}
              placeholder="Enter company name"
            />
          </View>
          
          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Industry</Text>
            <TextInput
              style={[styles.textInput, !isEditing && styles.disabledInput]}
              value={companyInfo.industry}
              onChangeText={(text) => setCompanyInfo({...companyInfo, industry: text})}
              editable={isEditing}
              placeholder="Enter industry"
            />
          </View>
        </View>

        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Address</Text>
          <TextInput
            style={[styles.textInput, !isEditing && styles.disabledInput]}
            value={companyInfo.address}
            onChangeText={(text) => setCompanyInfo({...companyInfo, address: text})}
            editable={isEditing}
            placeholder="Enter street address"
          />
        </View>

        <View style={styles.formRow}>
          <View style={[styles.formField, { flex: 2 }]}>
            <Text style={styles.fieldLabel}>City</Text>
            <TextInput
              style={[styles.textInput, !isEditing && styles.disabledInput]}
              value={companyInfo.city}
              onChangeText={(text) => setCompanyInfo({...companyInfo, city: text})}
              editable={isEditing}
              placeholder="Enter city"
            />
          </View>
          
          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>State</Text>
            <TextInput
              style={[styles.textInput, !isEditing && styles.disabledInput]}
              value={companyInfo.state}
              onChangeText={(text) => setCompanyInfo({...companyInfo, state: text})}
              editable={isEditing}
              placeholder="State"
            />
          </View>
          
          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>ZIP Code</Text>
            <TextInput
              style={[styles.textInput, !isEditing && styles.disabledInput]}
              value={companyInfo.zipCode}
              onChangeText={(text) => setCompanyInfo({...companyInfo, zipCode: text})}
              editable={isEditing}
              placeholder="ZIP"
            />
          </View>
        </View>

        <View style={styles.formRow}>
          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Phone</Text>
            <TextInput
              style={[styles.textInput, !isEditing && styles.disabledInput]}
              value={companyInfo.phone}
              onChangeText={(text) => setCompanyInfo({...companyInfo, phone: text})}
              editable={isEditing}
              placeholder="Enter phone number"
            />
          </View>
          
          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Email</Text>
            <TextInput
              style={[styles.textInput, !isEditing && styles.disabledInput]}
              value={companyInfo.email}
              onChangeText={(text) => setCompanyInfo({...companyInfo, email: text})}
              editable={isEditing}
              placeholder="Enter email"
            />
          </View>
        </View>

        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Website</Text>
          <TextInput
            style={[styles.textInput, !isEditing && styles.disabledInput]}
            value={companyInfo.website}
            onChangeText={(text) => setCompanyInfo({...companyInfo, website: text})}
            editable={isEditing}
            placeholder="Enter website URL"
          />
        </View>

        <View style={styles.formRow}>
          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Employee Count</Text>
            <TextInput
              style={[styles.textInput, !isEditing && styles.disabledInput]}
              value={companyInfo.employeeCount.toString()}
              onChangeText={(text) => setCompanyInfo({...companyInfo, employeeCount: parseInt(text) || 0})}
              editable={isEditing}
              placeholder="Employee count"
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Founded</Text>
            <TextInput
              style={[styles.textInput, !isEditing && styles.disabledInput]}
              value={companyInfo.founded}
              onChangeText={(text) => setCompanyInfo({...companyInfo, founded: text})}
              editable={isEditing}
              placeholder="Year founded"
            />
          </View>
        </View>
      </View>
    </View>
  );

  const renderDepartments = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Departments</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setAddingDepartment(true)}
        >
          <Plus size={16} color="#fff" />
          <Text style={styles.addButtonText}>Add Department</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.departmentsList}>
        {departments.map((department) => (
          <View key={department.id} style={styles.departmentCard}>
            <View style={styles.departmentHeader}>
              <View style={styles.departmentInfo}>
                <Text style={styles.departmentName}>{department.name}</Text>
                <Text style={styles.departmentManager}>Manager: {department.manager}</Text>
              </View>
              <View style={styles.departmentActions}>
                <Text style={styles.employeeCount}>{department.employeeCount} employees</Text>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => deleteDepartment(department.id)}
                >
                  <Trash2 size={16} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
            {department.description ? (
              <Text style={styles.departmentDescription}>{department.description}</Text>
            ) : null}
          </View>
        ))}
      </View>

      {addingDepartment && (
        <View style={styles.addDepartmentForm}>
          <Text style={styles.formTitle}>Add New Department</Text>
          
          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Department Name *</Text>
            <TextInput
              style={styles.textInput}
              value={newDepartment.name}
              onChangeText={(text) => setNewDepartment({...newDepartment, name: text})}
              placeholder="Enter department name"
            />
          </View>

          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Manager *</Text>
            <TextInput
              style={styles.textInput}
              value={newDepartment.manager}
              onChangeText={(text) => setNewDepartment({...newDepartment, manager: text})}
              placeholder="Enter manager name"
            />
          </View>

          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Employee Count</Text>
            <TextInput
              style={styles.textInput}
              value={newDepartment.employeeCount?.toString() || ''}
              onChangeText={(text) => setNewDepartment({...newDepartment, employeeCount: parseInt(text) || 0})}
              placeholder="Enter employee count"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Description</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={newDepartment.description}
              onChangeText={(text) => setNewDepartment({...newDepartment, description: text})}
              placeholder="Enter department description"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.formActions}>
            <TouchableOpacity 
              style={styles.cancelFormButton}
              onPress={() => {
                setAddingDepartment(false);
                setNewDepartment({ name: '', manager: '', description: '', employeeCount: 0 });
              }}
            >
              <Text style={styles.cancelFormButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.addFormButton} onPress={addDepartment}>
              <Text style={styles.addFormButtonText}>Add Department</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  const renderLocations = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Office Locations</Text>
        <TouchableOpacity style={styles.addButton}>
          <Plus size={16} color="#fff" />
          <Text style={styles.addButtonText}>Add Location</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.locationsList}>
        <View style={styles.locationCard}>
          <View style={styles.locationHeader}>
            <MapPin size={20} color="#8b5cf6" />
            <Text style={styles.locationName}>Headquarters</Text>
            <View style={styles.primaryBadge}>
              <Text style={styles.primaryBadgeText}>Primary</Text>
            </View>
          </View>
          <Text style={styles.locationAddress}>
            123 Innovation Drive{'\n'}Austin, TX 78701
          </Text>
          <Text style={styles.locationEmployees}>350 employees</Text>
        </View>

        <View style={styles.locationCard}>
          <View style={styles.locationHeader}>
            <MapPin size={20} color="#8b5cf6" />
            <Text style={styles.locationName}>West Coast Office</Text>
          </View>
          <Text style={styles.locationAddress}>
            456 Tech Boulevard{'\n'}San Francisco, CA 94105
          </Text>
          <Text style={styles.locationEmployees}>62 employees</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Company Settings</Text>
        <Text style={styles.subtitle}>Manage your organization information and structure</Text>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'info' && styles.activeTab]}
          onPress={() => setActiveTab('info')}
        >
          <Building size={16} color={activeTab === 'info' ? '#8b5cf6' : '#6b7280'} />
          <Text style={[styles.tabText, activeTab === 'info' && styles.activeTabText]}>
            Company Info
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'departments' && styles.activeTab]}
          onPress={() => setActiveTab('departments')}
        >
          <Users size={16} color={activeTab === 'departments' ? '#8b5cf6' : '#6b7280'} />
          <Text style={[styles.tabText, activeTab === 'departments' && styles.activeTabText]}>
            Departments
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'locations' && styles.activeTab]}
          onPress={() => setActiveTab('locations')}
        >
          <MapPin size={16} color={activeTab === 'locations' ? '#8b5cf6' : '#6b7280'} />
          <Text style={[styles.tabText, activeTab === 'locations' && styles.activeTabText]}>
            Locations
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'info' && renderCompanyInfo()}
        {activeTab === 'departments' && renderDepartments()}
        {activeTab === 'locations' && renderLocations()}
      </ScrollView>
      <EmployerFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#8b5cf6',
  },
  tabText: {
    fontSize: 14,
    color: '#6b7280',
  },
  activeTabText: {
    color: '#8b5cf6',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 14,
    color: '#8b5cf6',
    fontWeight: '500',
  },
  editActions: {
    flexDirection: 'row',
    gap: 8,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#8b5cf6',
    borderRadius: 8,
  },
  saveButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  formGrid: {
    gap: 16,
  },
  formRow: {
    flexDirection: 'row',
    gap: 16,
  },
  formField: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#fff',
  },
  disabledInput: {
    backgroundColor: '#f9fafb',
    color: '#6b7280',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#8b5cf6',
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  departmentsList: {
    gap: 12,
  },
  departmentCard: {
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  departmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  departmentInfo: {
    flex: 1,
  },
  departmentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  departmentManager: {
    fontSize: 14,
    color: '#6b7280',
  },
  departmentActions: {
    alignItems: 'flex-end',
  },
  employeeCount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  deleteButton: {
    padding: 4,
  },
  departmentDescription: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  addDepartmentForm: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  cancelFormButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelFormButtonText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  addFormButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#8b5cf6',
    borderRadius: 8,
    alignItems: 'center',
  },
  addFormButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  locationsList: {
    gap: 12,
  },
  locationCard: {
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
    flex: 1,
  },
  primaryBadge: {
    backgroundColor: '#ddd6fe',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  primaryBadgeText: {
    fontSize: 12,
    color: '#7c3aed',
    fontWeight: '500',
  },
  locationAddress: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  locationEmployees: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
});