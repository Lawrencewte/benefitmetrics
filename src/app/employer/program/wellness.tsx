import { ArrowRight, Calendar, Clock, Download, Edit, FileText, Film, Play, PlusCircle, Trash2, User, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import EmployerFooter from '../../../components/Common/layout/EmployerFooter';
import Header from '../../../components/Common/layout/Header';
import Button from '../../../components/Common/ui/Button';
import Card from '../../../components/Common/ui/Card';
import Modal from '../../../components/Common/ui/Modal';
import { createWellnessResource, deleteWellnessResource, getWellnessContent } from '../../../services/employer/programManagement';

const WellnessProgram = () => {
  const [resources, setResources] = useState([]);
  const [events, setEvents] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data
  const mockUpcomingEvents = [
    {
      id: 1,
      title: 'Mental Health Awareness Session',
      date: 'May 24, 2025',
      time: '10:00 AM - 11:30 AM',
      location: 'Virtual',
      attendees: 86,
      type: 'webinar',
    },
    {
      id: 2,
      title: 'Preventative Health Screening Day',
      date: 'June 10, 2025',
      time: '9:00 AM - 4:00 PM',
      location: 'Main Office - 4th Floor',
      attendees: 145,
      type: 'in-person',
    },
    {
      id: 3,
      title: 'Nutrition Workshop Series: Week 1',
      date: 'June 14, 2025',
      time: '12:00 PM - 1:00 PM',
      location: 'Virtual',
      attendees: 58,
      type: 'webinar',
    },
  ];

  const mockWellnessResources = [
    {
      id: 1,
      title: 'Guide to Preventative Screenings',
      description: 'A comprehensive guide to recommended preventative screenings by age and risk factors',
      type: 'document',
      downloads: 205,
      dateAdded: '2025-03-15',
      category: 'preventative',
    },
    {
      id: 2,
      title: 'Mental Health at Work',
      description: 'Educational video series on maintaining mental health in the workplace',
      type: 'video',
      downloads: 168,
      dateAdded: '2025-04-02',
      category: 'mental',
    },
    {
      id: 3,
      title: 'Healthy Eating on a Budget',
      description: 'Practical tips and recipes for eating healthy while saving money',
      type: 'document',
      downloads: 312,
      dateAdded: '2025-02-28',
      category: 'nutrition',
    },
    {
      id: 4,
      title: 'Stress Management Techniques',
      description: 'Quick and effective techniques for managing workplace stress',
      type: 'audio',
      downloads: 287,
      dateAdded: '2025-03-10',
      category: 'mental',
    },
    {
      id: 5,
      title: 'Benefits of Preventative Care',
      description: 'Why preventative care matters and how it improves long-term health outcomes',
      type: 'video',
      downloads: 152,
      dateAdded: '2025-04-18',
      category: 'preventative',
    },
    {
      id: 6,
      title: 'Office Ergonomics Guide',
      description: 'How to set up your workspace to prevent injuries and improve comfort',
      type: 'document',
      downloads: 198,
      dateAdded: '2025-01-22',
      category: 'physical',
    },
  ];

  const fetchWellnessContent = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Try to fetch real data, fall back to mock data
      try {
        const data = await getWellnessContent();
        setResources(data.resources || mockWellnessResources);
        setEvents(data.events || mockUpcomingEvents);
      } catch (apiError) {
        console.log('API not available, using mock data');
        // Use mock data as fallback
        setResources(mockWellnessResources);
        setEvents(mockUpcomingEvents);
      }
    } catch (err) {
      console.error('Error in fetchWellnessContent:', err);
      // Even if there's an error, show mock data
      setResources(mockWellnessResources);
      setEvents(mockUpcomingEvents);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWellnessContent();
  }, []);

  const handleCreateResource = async (formData) => {
    try {
      await createWellnessResource(formData);
      setShowCreateModal(false);
      // Reload resources
      await fetchWellnessContent();
    } catch (err) {
      console.error('Error creating wellness resource:', err);
      // For now, just close modal - in real app, show error to user
      setShowCreateModal(false);
    }
  };

  const handleDeleteResource = async () => {
    if (!selectedResource) return;
    
    try {
      await deleteWellnessResource(selectedResource.id);
      setShowDeleteModal(false);
      setSelectedResource(null);
      // Reload resources
      await fetchWellnessContent();
    } catch (err) {
      console.error('Error deleting wellness resource:', err);
      // For now, just close modal - in real app, show error to user
      setShowDeleteModal(false);
      setSelectedResource(null);
    }
  };

  const confirmDelete = (resource) => {
    setSelectedResource(resource);
    setShowDeleteModal(true);
  };

  const handleRetry = () => {
    fetchWellnessContent();
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header title="Wellness Program" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading wellness content...</Text>
        </View>
        <EmployerFooter />
      </View>
    );
  }

  // Filter resources by category
  const filteredResources = activeCategory === 'all' 
    ? resources 
    : resources.filter(resource => resource.category === activeCategory);

  const getResourceIcon = (type) => {
    switch (type) {
      case 'document':
        return <FileText size={20} color="#3b82f6" />;
      case 'video':
        return <Film size={20} color="#3b82f6" />;
      case 'audio':
        return <Play size={20} color="#3b82f6" />;
      default:
        return <FileText size={20} color="#3b82f6" />;
    }
  };

  const getCategoryBadgeStyle = (category) => {
    switch (category) {
      case 'preventative':
        return { backgroundColor: '#dbeafe', color: '#3b82f6' };
      case 'mental':
        return { backgroundColor: '#f3e8ff', color: '#8b5cf6' };
      case 'nutrition':
        return { backgroundColor: '#dcfce7', color: '#10b981' };
      case 'physical':
        return { backgroundColor: '#fef3c7', color: '#f59e0b' };
      default:
        return { backgroundColor: '#f3f4f6', color: '#666' };
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Wellness Program" />
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.pageTitle}>Wellness Resources</Text>
            <Text style={styles.pageSubtitle}>
              Manage educational content and events for your wellness program
            </Text>
          </View>
          <Button 
            icon={<PlusCircle size={18} />}
            title="Add Resource" 
            onPress={() => setShowCreateModal(true)}
            variant="primary"
          />
        </View>

        <Text style={styles.sectionTitle}>Upcoming Wellness Events</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.eventsScrollContainer}>
          {events.map(event => (
            <Card key={event.id} style={styles.eventCard}>
              <View style={styles.eventHeader}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <View 
                  style={[
                    styles.eventTypeBadge,
                    event.type === 'webinar' ? styles.webinarBadge : styles.inPersonBadge
                  ]}
                >
                  <Text 
                    style={[
                      styles.eventTypeText,
                      event.type === 'webinar' ? styles.webinarText : styles.inPersonText
                    ]}
                  >
                    {event.type === 'webinar' ? 'Webinar' : 'In-Person'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.eventDetails}>
                <View style={styles.eventDetailItem}>
                  <Calendar size={14} color="#666" />
                  <Text style={styles.eventDetailText}>{event.date}</Text>
                </View>
                
                <View style={styles.eventDetailItem}>
                  <Clock size={14} color="#666" />
                  <Text style={styles.eventDetailText}>{event.time}</Text>
                </View>
                
                <View style={styles.eventDetailItem}>
                  <User size={14} color="#666" />
                  <Text style={styles.eventDetailText}>{event.location}</Text>
                </View>
                
                <View style={styles.eventDetailItem}>
                  <Users size={14} color="#666" />
                  <Text style={styles.eventDetailText}>{event.attendees} registered</Text>
                </View>
              </View>
              
              <View style={styles.eventActions}>
                <Button 
                  title="Edit Event" 
                  variant="outline" 
                  onPress={() => console.log(`Edit event ${event.id}`)}
                  style={styles.eventActionButton}
                />
                <Button 
                  title="Send Reminder" 
                  variant="outline" 
                  onPress={() => console.log(`Send reminder for event ${event.id}`)}
                  style={styles.eventActionButton}
                />
              </View>
            </Card>
          ))}
          
          <Pressable style={styles.addEventCardContainer} onPress={() => console.log('Add new event')}>
            <View style={styles.addEventCard}>
              <PlusCircle size={36} color="#3b82f6" />
              <Text style={styles.addEventText}>Schedule New Event</Text>
            </View>
          </Pressable>
        </ScrollView>

        <Pressable style={styles.viewAllEventsLink} onPress={() => console.log('View all events')}>
          <Text style={styles.viewAllText}>View All Events</Text>
          <ArrowRight size={16} color="#3b82f6" />
        </Pressable>

        <View style={styles.resourcesHeader}>
          <Text style={styles.sectionTitle}>Educational Resources</Text>
          <View style={styles.categoryTabs}>
            {[
              { key: 'all', label: 'All' },
              { key: 'preventative', label: 'Preventative' },
              { key: 'mental', label: 'Mental Health' },
              { key: 'nutrition', label: 'Nutrition' },
              { key: 'physical', label: 'Physical' }
            ].map(category => (
              <Pressable
                key={category.key}
                style={[
                  styles.categoryTab, 
                  activeCategory === category.key && styles.activeTab
                ]}
                onPress={() => setActiveCategory(category.key)}
              >
                <Text 
                  style={[
                    styles.categoryText,
                    activeCategory === category.key && styles.activeTabText
                  ]}
                >
                  {category.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {filteredResources.map(resource => {
          const badgeStyle = getCategoryBadgeStyle(resource.category);
          return (
            <Card key={resource.id} style={styles.resourceCard}>
              <View style={styles.resourceHeader}>
                <View style={styles.resourceTitleContainer}>
                  {getResourceIcon(resource.type)}
                  <Text style={styles.resourceTitle}>{resource.title}</Text>
                </View>
                <View 
                  style={[
                    styles.categoryBadge,
                    { backgroundColor: badgeStyle.backgroundColor }
                  ]}
                >
                  <Text 
                    style={[
                      styles.categoryBadgeText,
                      { color: badgeStyle.color }
                    ]}
                  >
                    {resource.category.charAt(0).toUpperCase() + resource.category.slice(1)}
                  </Text>
                </View>
              </View>
              
              <Text style={styles.resourceDescription}>
                {resource.description}
              </Text>
              
              <View style={styles.resourceMeta}>
                <View style={styles.resourceType}>
                  <Text style={styles.resourceTypeText}>
                    {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                  </Text>
                </View>
                
                <View style={styles.resourceStats}>
                  <Download size={14} color="#666" />
                  <Text style={styles.resourceStatsText}>
                    {resource.downloads} downloads
                  </Text>
                </View>
                
                <Text style={styles.resourceDate}>
                  Added: {resource.dateAdded}
                </Text>
              </View>
              
              <View style={styles.resourceActions}>
                <Button 
                  icon={<Download size={16} />}
                  title="Download" 
                  variant="primary" 
                  onPress={() => console.log(`Download resource ${resource.id}`)}
                  style={styles.resourceAction}
                />
                
                <Button 
                  icon={<Edit size={16} />}
                  title="Edit" 
                  variant="outline" 
                  onPress={() => console.log(`Edit resource ${resource.id}`)}
                  style={styles.resourceAction}
                />
                
                <Button 
                  icon={<Trash2 size={16} />}
                  title="Delete" 
                  variant="outline" 
                  onPress={() => confirmDelete(resource)}
                  style={styles.resourceAction}
                />
              </View>
            </Card>
          );
        })}

        {filteredResources.length === 0 && (
          <Card style={styles.noResultsCard}>
            <Text style={styles.noResultsText}>
              No resources found in the {activeCategory} category.
            </Text>
            <Button 
              title="View All Resources" 
              onPress={() => setActiveCategory('all')} 
            />
          </Card>
        )}
      </ScrollView>

      {/* Create Resource Modal */}
      <Modal
        visible={showCreateModal}
        title="Add Wellness Resource"
        onClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalContent}>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Resource Title</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Enter resource title"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Description</Text>
            <TextInput
              style={[styles.formInput, styles.textArea]}
              placeholder="Enter resource description"
              multiline
              numberOfLines={4}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Resource Type</Text>
            <View style={styles.formTabs}>
              <Pressable style={[styles.formTab, styles.activeFormTab]}>
                <Text style={styles.activeFormTabText}>Document</Text>
              </Pressable>
              
              <Pressable style={styles.formTab}>
                <Text style={styles.formTabText}>Video</Text>
              </Pressable>
              
              <Pressable style={styles.formTab}>
                <Text style={styles.formTabText}>Audio</Text>
              </Pressable>
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Category</Text>
            <View style={styles.formTabs}>
              <Pressable style={[styles.formTab, styles.activeFormTab]}>
                <Text style={styles.activeFormTabText}>Preventative</Text>
              </Pressable>
              
              <Pressable style={styles.formTab}>
                <Text style={styles.formTabText}>Mental Health</Text>
              </Pressable>
              
              <Pressable style={styles.formTab}>
                <Text style={styles.formTabText}>Nutrition</Text>
              </Pressable>
              
              <Pressable style={styles.formTab}>
                <Text style={styles.formTabText}>Physical</Text>
              </Pressable>
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Upload File</Text>
            <View style={styles.fileUploadContainer}>
              <Button 
                title="Choose File" 
                variant="outline" 
                onPress={() => console.log('Choose file')}
              />
              <Text style={styles.noFileText}>No file chosen</Text>
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
              title="Add Resource"
              variant="primary"
              onPress={() => handleCreateResource({})}
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
          setSelectedResource(null);
        }}
      >
        <View style={styles.modalContent}>
          <Text style={styles.deleteConfirmText}>
            Are you sure you want to delete the resource 
            "{selectedResource?.title}"? This action cannot be undone.
          </Text>
          
          <View style={styles.modalActions}>
            <Button
              title="Cancel"
              variant="outline"
              onPress={() => {
                setShowDeleteModal(false);
                setSelectedResource(null);
              }}
              style={styles.modalButton}
            />
            <Button
              title="Delete"
              variant="primary"
              onPress={handleDeleteResource}
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    marginBottom: 12,
  },
  eventsScrollContainer: {
    marginBottom: 8,
  },
  eventCard: {
    width: 300,
    marginRight: 12,
    padding: 16,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    maxWidth: '70%',
  },
  eventTypeBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
  },
  webinarBadge: {
    backgroundColor: '#dbeafe',
  },
  inPersonBadge: {
    backgroundColor: '#dcfce7',
  },
  eventTypeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  webinarText: {
    color: '#3b82f6',
  },
  inPersonText: {
    color: '#10b981',
  },
  eventDetails: {
    marginBottom: 16,
  },
  eventDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },
  eventDetailText: {
    fontSize: 14,
    color: '#666',
  },
  eventActions: {
    flexDirection: 'row',
    gap: 8,
  },
  eventActionButton: {
    flex: 1,
  },
  addEventCardContainer: {
    width: 300,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addEventCard: {
    width: 200,
    height: 150,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  addEventText: {
    fontSize: 16,
    color: '#3b82f6',
    marginTop: 8,
    fontWeight: 'bold',
  },
  viewAllEventsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 24,
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: 'bold',
  },
  resourcesHeader: {
    marginBottom: 16,
  },
  categoryTabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  categoryTab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
  },
  activeTab: {
    backgroundColor: '#dbeafe',
  },
  categoryText: {
    fontSize: 12,
    color: '#666',
  },
  activeTabText: {
    color: '#3b82f6',
    fontWeight: 'bold',
  },
  resourceCard: {
    marginBottom: 16,
    padding: 16,
  },
  resourceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  resourceTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    maxWidth: '75%',
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  categoryBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 16,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  resourceDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  resourceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
    flexWrap: 'wrap',
  },
  resourceType: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  resourceTypeText: {
    fontSize: 12,
    color: '#666',
  },
  resourceStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  resourceStatsText: {
    fontSize: 12,
    color: '#666',
  },
  resourceDate: {
    fontSize: 12,
    color: '#666',
  },
  resourceActions: {
    flexDirection: 'row',
    gap: 8,
  },
  resourceAction: {
    flex: 1,
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
    borderRadius: 4,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  formTabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  formTab: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    backgroundColor: '#f3f4f6',
  },
  activeFormTab: {
    backgroundColor: '#dbeafe',
  },
  formTabText: {
    fontSize: 14,
    color: '#666',
  },
  activeFormTabText: {
    color: '#3b82f6',
    fontWeight: 'bold',
  },
  fileUploadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  noFileText: {
    fontSize: 14,
    color: '#666',
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

export default WellnessProgram;