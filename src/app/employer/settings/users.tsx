import {
    AlertTriangle,
    Clock,
    Edit3,
    Filter,
    Mail,
    Search,
    Shield,
    Trash2,
    UserPlus,
    Users,
    X
} from 'lucide-react-native';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'viewer';
  department: string;
  status: 'active' | 'pending' | 'suspended';
  lastLogin: string;
  createdAt: string;
  permissions: string[];
}

interface PendingInvitation {
  id: string;
  email: string;
  role: 'admin' | 'manager' | 'viewer';
  department: string;
  invitedBy: string;
  invitedAt: string;
  expiresAt: string;
}

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'admin' | 'manager' | 'viewer'>('all');
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'pending' | 'roles'>('users');

  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Sarah Chen',
      email: 'sarah.chen@acme.com',
      role: 'admin',
      department: 'Engineering',
      status: 'active',
      lastLogin: '2 hours ago',
      createdAt: '2023-01-15',
      permissions: ['full_access', 'user_management', 'system_config']
    },
    {
      id: '2',
      name: 'Michael Rodriguez',
      email: 'michael.r@acme.com',
      role: 'manager',
      department: 'Sales',
      status: 'active',
      lastLogin: '1 day ago',
      createdAt: '2023-02-20',
      permissions: ['department_analytics', 'team_management']
    },
    {
      id: '3',
      name: 'Jessica Thompson',
      email: 'jessica.t@acme.com',
      role: 'manager',
      department: 'Marketing',
      status: 'active',
      lastLogin: '3 days ago',
      createdAt: '2023-03-10',
      permissions: ['department_analytics', 'team_management']
    },
    {
      id: '4',
      name: 'David Kim',
      email: 'david.kim@acme.com',
      role: 'viewer',
      department: 'Operations',
      status: 'active',
      lastLogin: '1 week ago',
      createdAt: '2023-04-05',
      permissions: ['read_only_access']
    },
    {
      id: '5',
      name: 'Emily Johnson',
      email: 'emily.j@acme.com',
      role: 'admin',
      department: 'Human Resources',
      status: 'suspended',
      lastLogin: '2 weeks ago',
      createdAt: '2023-01-25',
      permissions: ['full_access', 'user_management']
    }
  ]);

  const [pendingInvitations, setPendingInvitations] = useState<PendingInvitation[]>([
    {
      id: '1',
      email: 'new.hire@acme.com',
      role: 'manager',
      department: 'Engineering',
      invitedBy: 'Sarah Chen',
      invitedAt: '2024-03-20',
      expiresAt: '2024-03-27'
    },
    {
      id: '2',
      email: 'consultant@external.com',
      role: 'viewer',
      department: 'Finance',
      invitedBy: 'Robert Davis',
      invitedAt: '2024-03-19',
      expiresAt: '2024-03-26'
    },
    {
      id: '3',
      email: 'temp.admin@acme.com',
      role: 'admin',
      department: 'IT',
      invitedBy: 'Sarah Chen',
      invitedAt: '2024-03-18',
      expiresAt: '2024-03-25'
    }
  ]);

  const [newInvitation, setNewInvitation] = useState({
    email: '',
    role: 'viewer' as 'admin' | 'manager' | 'viewer',
    department: ''
  });

  const roleColors = {
    admin: '#ef4444',
    manager: '#f59e0b',
    viewer: '#10b981'
  };

  const statusColors = {
    active: '#10b981',
    pending: '#f59e0b',
    suspended: '#ef4444'
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || user.role === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleInviteUser = () => {
    if (!newInvitation.email || !newInvitation.department) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    const invitation: PendingInvitation = {
      id: Date.now().toString(),
      email: newInvitation.email,
      role: newInvitation.role,
      department: newInvitation.department,
      invitedBy: 'Current User',
      invitedAt: new Date().toISOString().split('T')[0],
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    setPendingInvitations([...pendingInvitations, invitation]);
    setNewInvitation({ email: '', role: 'viewer', department: '' });
    setShowInviteForm(false);
    Alert.alert('Success', 'Invitation sent successfully.');
  };

  const handleUserAction = (userId: string, action: 'edit' | 'suspend' | 'delete') => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    switch (action) {
      case 'edit':
        Alert.alert('Edit User', `Edit ${user.name}'s profile and permissions.`);
        break;
      case 'suspend':
        Alert.alert(
          'Suspend User',
          `Are you sure you want to suspend ${user.name}?`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Suspend',
              style: 'destructive',
              onPress: () => {
                setUsers(users.map(u => 
                  u.id === userId ? { ...u, status: 'suspended' } : u
                ));
                Alert.alert('Success', `${user.name} has been suspended.`);
              }
            }
          ]
        );
        break;
      case 'delete':
        Alert.alert(
          'Delete User',
          `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () => {
                setUsers(users.filter(u => u.id !== userId));
                Alert.alert('Success', `${user.name} has been deleted.`);
              }
            }
          ]
        );
        break;
    }
  };

  const handleInvitationAction = (invitationId: string, action: 'resend' | 'cancel') => {
    const invitation = pendingInvitations.find(inv => inv.id === invitationId);
    if (!invitation) return;

    switch (action) {
      case 'resend':
        Alert.alert('Success', `Invitation resent to ${invitation.email}.`);
        break;
      case 'cancel':
        Alert.alert(
          'Cancel Invitation',
          `Are you sure you want to cancel the invitation to ${invitation.email}?`,
          [
            { text: 'No', style: 'cancel' },
            {
              text: 'Yes',
              onPress: () => {
                setPendingInvitations(pendingInvitations.filter(inv => inv.id !== invitationId));
                Alert.alert('Success', 'Invitation has been cancelled.');
              }
            }
          ]
        );
        break;
    }
  };

  const renderUsers = () => (
    <View style={styles.container}>
      <View style={styles.searchAndFilter}>
        <View style={styles.searchContainer}>
          <Search size={16} color="#6b7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search users..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={16} color="#6b7280" />
          <Text style={styles.filterText}>{selectedFilter}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterChips}>
        {(['all', 'admin', 'manager', 'viewer'] as const).map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterChip, selectedFilter === filter && styles.activeFilterChip]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text style={[
              styles.filterChipText,
              selectedFilter === filter && styles.activeFilterChipText
            ]}>
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.usersList} showsVerticalScrollIndicator={false}>
        {filteredUsers.map((user) => (
          <View key={user.id} style={styles.userCard}>
            <View style={styles.userHeader}>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                <View style={styles.userMeta}>
                  <View style={[styles.roleBadge, { backgroundColor: roleColors[user.role] }]}>
                    <Text style={styles.roleBadgeText}>{user.role}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: statusColors[user.status] }]}>
                    <Text style={styles.statusBadgeText}>{user.status}</Text>
                  </View>
                  <Text style={styles.department}>{user.department}</Text>
                </View>
              </View>
              
              <View style={styles.userActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleUserAction(user.id, 'edit')}
                >
                  <Edit3 size={16} color="#6b7280" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleUserAction(user.id, user.status === 'active' ? 'suspend' : 'delete')}
                >
                  {user.status === 'active' ? (
                    <AlertTriangle size={16} color="#f59e0b" />
                  ) : (
                    <Trash2 size={16} color="#ef4444" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.userDetails}>
              <View style={styles.detailItem}>
                <Clock size={14} color="#6b7280" />
                <Text style={styles.detailText}>Last login: {user.lastLogin}</Text>
              </View>
              <View style={styles.detailItem}>
                <Shield size={14} color="#6b7280" />
                <Text style={styles.detailText}>{user.permissions.length} permissions</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderPendingInvitations = () => (
    <View style={styles.container}>
      <View style={styles.pendingHeader}>
        <Text style={styles.pendingTitle}>Pending Invitations ({pendingInvitations.length})</Text>
        <Text style={styles.pendingSubtitle}>Invitations expire after 7 days</Text>
      </View>

      <ScrollView style={styles.invitationsList} showsVerticalScrollIndicator={false}>
        {pendingInvitations.map((invitation) => (
          <View key={invitation.id} style={styles.invitationCard}>
            <View style={styles.invitationHeader}>
              <View style={styles.invitationInfo}>
                <Text style={styles.invitationEmail}>{invitation.email}</Text>
                <View style={styles.invitationMeta}>
                  <View style={[styles.roleBadge, { backgroundColor: roleColors[invitation.role] }]}>
                    <Text style={styles.roleBadgeText}>{invitation.role}</Text>
                  </View>
                  <Text style={styles.department}>{invitation.department}</Text>
                </View>
                <Text style={styles.invitationDetails}>
                  Invited by {invitation.invitedBy} on {invitation.invitedAt}
                </Text>
                <Text style={styles.expirationText}>
                  Expires on {invitation.expiresAt}
                </Text>
              </View>
              
              <View style={styles.invitationActions}>
                <TouchableOpacity 
                  style={styles.resendButton}
                  onPress={() => handleInvitationAction(invitation.id, 'resend')}
                >
                  <Mail size={16} color="#8b5cf6" />
                  <Text style={styles.resendButtonText}>Resend</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => handleInvitationAction(invitation.id, 'cancel')}
                >
                  <X size={16} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderRoles = () => (
    <View style={styles.container}>
      <Text style={styles.rolesTitle}>Role Permissions</Text>
      <Text style={styles.rolesSubtitle}>Manage what each role can access in the system</Text>

      <View style={styles.rolesList}>
        <View style={styles.roleCard}>
          <View style={styles.roleHeader}>
            <View style={[styles.roleIcon, { backgroundColor: '#fee2e2' }]}>
              <Shield size={20} color="#ef4444" />
            </View>
            <View style={styles.roleInfo}>
              <Text style={styles.roleName}>Administrator</Text>
              <Text style={styles.roleDescription}>Full system access and user management</Text>
            </View>
          </View>
          <View style={styles.permissionsList}>
            <Text style={styles.permissionItem}>• Full system access</Text>
            <Text style={styles.permissionItem}>• User management</Text>
            <Text style={styles.permissionItem}>• System configuration</Text>
            <Text style={styles.permissionItem}>• All analytics and reports</Text>
            <Text style={styles.permissionItem}>• Data export capabilities</Text>
          </View>
        </View>

        <View style={styles.roleCard}>
          <View style={styles.roleHeader}>
            <View style={[styles.roleIcon, { backgroundColor: '#fef3c7' }]}>
              <Users size={20} color="#f59e0b" />
            </View>
            <View style={styles.roleInfo}>
              <Text style={styles.roleName}>Manager</Text>
              <Text style={styles.roleDescription}>Department-level access and team management</Text>
            </View>
          </View>
          <View style={styles.permissionsList}>
            <Text style={styles.permissionItem}>• Department analytics</Text>
            <Text style={styles.permissionItem}>• Team member management</Text>
            <Text style={styles.permissionItem}>• Program management</Text>
            <Text style={styles.permissionItem}>• Communication tools</Text>
            <Text style={styles.permissionItem}>• Limited reporting</Text>
          </View>
        </View>

        <View style={styles.roleCard}>
          <View style={styles.roleHeader}>
            <View style={[styles.roleIcon, { backgroundColor: '#d1fae5' }]}>
              <Clock size={20} color="#10b981" />
            </View>
            <View style={styles.roleInfo}>
              <Text style={styles.roleName}>Viewer</Text>
              <Text style={styles.roleDescription}>Read-only access to assigned data</Text>
            </View>
          </View>
          <View style={styles.permissionsList}>
            <Text style={styles.permissionItem}>• Read-only dashboard access</Text>
            <Text style={styles.permissionItem}>• Basic reporting</Text>
            <Text style={styles.permissionItem}>• Limited analytics</Text>
            <Text style={styles.permissionItem}>• No management capabilities</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>User Management</Text>
        <TouchableOpacity 
          style={styles.inviteButton}
          onPress={() => setShowInviteForm(true)}
        >
          <UserPlus size={16} color="#fff" />
          <Text style={styles.inviteButtonText}>Invite User</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'users' && styles.activeTab]}
          onPress={() => setActiveTab('users')}
        >
          <Text style={[styles.tabText, activeTab === 'users' && styles.activeTabText]}>
            Users ({users.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
          onPress={() => setActiveTab('pending')}
        >
          <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>
            Pending ({pendingInvitations.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'roles' && styles.activeTab]}
          onPress={() => setActiveTab('roles')}
        >
          <Text style={[styles.tabText, activeTab === 'roles' && styles.activeTabText]}>
            Roles & Permissions
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'users' && renderUsers()}
      {activeTab === 'pending' && renderPendingInvitations()}
      {activeTab === 'roles' && renderRoles()}

      {/* Invite User Modal */}
      {showInviteForm && (
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Invite New User</Text>
              <TouchableOpacity onPress={() => setShowInviteForm(false)}>
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalContent}>
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Email Address *</Text>
                <TextInput
                  style={styles.textInput}
                  value={newInvitation.email}
                  onChangeText={(text) => setNewInvitation({...newInvitation, email: text})}
                  placeholder="Enter email address"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Role *</Text>
                <View style={styles.roleSelector}>
                  {(['admin', 'manager', 'viewer'] as const).map((role) => (
                    <TouchableOpacity
                      key={role}
                      style={[
                        styles.roleOption,
                        newInvitation.role === role && styles.selectedRoleOption
                      ]}
                      onPress={() => setNewInvitation({...newInvitation, role})}
                    >
                      <Text style={[
                        styles.roleOptionText,
                        newInvitation.role === role && styles.selectedRoleOptionText
                      ]}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Department *</Text>
                <TextInput
                  style={styles.textInput}
                  value={newInvitation.department}
                  onChangeText={(text) => setNewInvitation({...newInvitation, department: text})}
                  placeholder="Enter department"
                />
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelModalButton}
                onPress={() => setShowInviteForm(false)}
              >
                <Text style={styles.cancelModalButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.sendInviteButton}
                onPress={handleInviteUser}
              >
                <Text style={styles.sendInviteButtonText}>Send Invitation</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  inviteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#8b5cf6',
    borderRadius: 8,
  },
  inviteButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
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
  container: {
    flex: 1,
    padding: 16,
  },
  searchAndFilter: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingLeft: 8,
    fontSize: 14,
    color: '#111827',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  filterText: {
    fontSize: 14,
    color: '#374151',
    textTransform: 'capitalize',
  },
  filterChips: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
  },
  activeFilterChip: {
    backgroundColor: '#8b5cf6',
  },
  filterChipText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  activeFilterChipText: {
    color: '#fff',
  },
  usersList: {
    flex: 1,
  },
  userCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleBadgeText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  department: {
    fontSize: 12,
    color: '#6b7280',
  },
  userActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
  },
  userDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#6b7280',
  },
  pendingHeader: {
    marginBottom: 16,
  },
  pendingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  pendingSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  invitationsList: {
    flex: 1,
  },
  invitationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  invitationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  invitationInfo: {
    flex: 1,
  },
  invitationEmail: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  invitationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  invitationDetails: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  expirationText: {
    fontSize: 12,
    color: '#f59e0b',
    fontWeight: '500',
  },
  invitationActions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
  },
  resendButtonText: {
    fontSize: 12,
    color: '#8b5cf6',
    fontWeight: '500',
  },
  cancelButton: {
    padding: 6,
    backgroundColor: '#fef2f2',
    borderRadius: 6,
  },
  rolesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  rolesSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
  },
  rolesList: {
    gap: 16,
  },
  roleCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  roleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  roleIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  roleInfo: {
    flex: 1,
  },
  roleName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  roleDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  permissionsList: {
    gap: 6,
  },
  permissionItem: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  modalContent: {
    padding: 20,
    gap: 16,
  },
  formField: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
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
  roleSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  roleOption: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  selectedRoleOption: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
  },
  roleOptionText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  selectedRoleOptionText: {
    color: '#fff',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  cancelModalButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelModalButtonText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  sendInviteButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#8b5cf6',
    borderRadius: 8,
    alignItems: 'center',
  },
  sendInviteButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
});