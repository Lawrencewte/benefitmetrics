import { router } from 'expo-router';
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Info,
  MapPin
} from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Footer from '../../../components/Common/layout/Footer';
import Header from '../../../components/Common/layout/Header';

const CareCoordinationTimeline = () => {
  const [currentMonth, setCurrentMonth] = useState(4); // May (0-indexed)
  const [expanded, setExpanded] = useState(null);
  
  const months = [
    'January', 'February', 'March', 'April', 
    'May', 'June', 'July', 'August', 
    'September', 'October', 'November', 'December'
  ];
  
  const recommendations = [
    {
      id: 1,
      type: "Annual Physical",
      recommendedDate: "May 28, 2025",
      recommendedTime: "10:30 AM",
      provider: "Dr. Martinez",
      location: "HealthFirst Medical",
      priority: "High",
      status: "Scheduled",
      reason: "Yearly wellness check required by insurance",
      preparationSteps: [
        "Fast for 8 hours before appointment",
        "Bring current medication list",
        "Wear comfortable clothing"
      ],
      conflictResolution: null,
      workConflict: false,
      benefitDeadline: "June 30, 2025",
      workImpact: "Low (30 minutes PTO)"
    },
    {
      id: 2,
      type: "Dental Cleaning",
      recommendedDate: "June 15, 2025",
      recommendedTime: "2:00 PM",
      provider: "Dr. Wong",
      location: "Bright Smile Dental",
      priority: "Medium",
      status: "Pending Confirmation",
      reason: "Bi-annual preventative dental care",
      preparationSteps: [
        "Brush and floss before appointment"
      ],
      conflictResolution: null,
      workConflict: false,
      benefitDeadline: "December 31, 2025",
      workImpact: "Low (1 hour PTO)"
    },
    {
      id: 3,
      type: "Eye Exam",
      recommendedDate: "August 19, 2025",
      recommendedTime: "3:15 PM",
      provider: "Dr. Patel",
      location: "Clear Vision Optometry",
      priority: "Medium",
      status: "Recommended",
      reason: "Annual vision check",
      preparationSteps: [
        "Bring current glasses/contacts",
        "Plan for possible pupil dilation"
      ],
      conflictResolution: "Scheduled after your team meeting on Aug 19",
      workConflict: true,
      benefitDeadline: "December 31, 2025",
      workImpact: "Medium (2 hours PTO, limited screen use after)"
    },
    {
      id: 4,
      type: "Skin Check",
      recommendedDate: "September 10, 2025",
      recommendedTime: "9:00 AM",
      provider: "Dr. Johnson",
      location: "Dermatology Associates",
      priority: "Medium",
      status: "Recommended",
      reason: "First-time skin cancer screening",
      preparationSteps: [
        "Remove nail polish",
        "Note any concerning moles/spots",
        "Limited makeup day of appointment"
      ],
      conflictResolution: "Grouped with your quarterly planning day (half day off)",
      workConflict: false,
      benefitDeadline: "December 31, 2025",
      workImpact: "Low (combined with planned PTO)"
    },
    {
      id: 5,
      type: "Flu Vaccination",
      recommendedDate: "October 7, 2025",
      recommendedTime: "11:30 AM",
      provider: "Company Wellness Clinic",
      location: "Office 3rd Floor",
      priority: "High",
      status: "Recommended",
      reason: "Annual flu prevention",
      preparationSteps: [
        "No special preparation needed"
      ],
      conflictResolution: "On-site company clinic during lunch break",
      workConflict: false,
      benefitDeadline: "December 31, 2025",
      workImpact: "None (on-site during lunch)"
    }
  ];
  
  // Filter appointments for current month
  const currentMonthAppointments = recommendations.filter(rec => {
    const date = new Date(rec.recommendedDate);
    return date.getMonth() === currentMonth;
  });
  
  // Function to get upcoming appointments for timeline view
  const getTimelineAppointments = () => {
    return recommendations.sort((a, b) => {
      const dateA = new Date(a.recommendedDate);
      const dateB = new Date(b.recommendedDate);
      return dateA - dateB;
    });
  };
  
  const handlePrevMonth = () => {
    setCurrentMonth(prev => (prev === 0 ? 11 : prev - 1));
  };
  
  const handleNextMonth = () => {
    setCurrentMonth(prev => (prev === 11 ? 0 : prev + 1));
  };
  
  const handleExpandCard = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  const handleScheduleAppointment = (appointmentId) => {
    // Find the appointment
    const appointment = recommendations.find(rec => rec.id === appointmentId);
    
    if (appointment) {
      // Show confirmation alert with pre-selected details
      console.log(`One-click scheduling for: ${appointment.type}`);
      console.log(`Recommended: ${appointment.recommendedDate} at ${appointment.recommendedTime}`);
      console.log(`Provider: ${appointment.provider} at ${appointment.location}`);
      
      // In a real app, this would:
      // 1. Call API to book the appointment with recommended details
      // 2. Update the appointment status to "Scheduled"
      // 3. Show success confirmation
      // 4. Add to user's calendar
      
      // For demo purposes, update the status locally
      const updatedRecommendations = recommendations.map(rec => 
        rec.id === appointmentId 
          ? { ...rec, status: "Scheduled" }
          : rec
      );
      
      // Show success message
      alert(`✅ Appointment scheduled!\n\n${appointment.type}\n${appointment.recommendedDate} at ${appointment.recommendedTime}\n${appointment.provider}\n\nConfirmation sent to your email.`);
    }
  };

  const handleEditAppointment = (appointmentId) => {
    const appointment = recommendations.find(rec => rec.id === appointmentId);
    
    if (appointment) {
      console.log(`Edit appointment: ${appointment.type}`);
      
      // Navigate to the schedule appointment page
      router.push('/employee/appointments/schedule');
    }
  };
  
  const getStatusColors = (status) => {
    switch (status) {
      case "Scheduled":
        return { bg: '#dcfce7', text: '#166534' };
      case "Pending Confirmation":
        return { bg: '#fef3c7', text: '#92400e' };
      case "Recommended":
        return { bg: '#dbeafe', text: '#1e40af' };
      default:
        return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Care Coordination" showBackButton />
      
      {/* AI Recommendation Banner */}
      <View style={styles.aiBanner}>
        <View style={styles.aiIconContainer}>
          <Info size={16} color="#2563eb" />
        </View>
        <View style={styles.aiBannerContent}>
          <Text style={styles.aiBannerTitle}>AI Care Coordination</Text>
          <Text style={styles.aiBannerText}>
            We've analyzed your work calendar, benefits deadlines, and provider availability to create your optimal preventative care timeline.
          </Text>
        </View>
      </View>
      
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Monthly View Controls */}
        <View style={styles.monthlyControls}>
          <View style={styles.monthNavigation}>
            <Pressable onPress={handlePrevMonth} style={styles.navButton}>
              <ChevronLeft size={18} color="#374151" />
            </Pressable>
            <Text style={styles.monthTitle}>{months[currentMonth]} 2025</Text>
            <Pressable onPress={handleNextMonth} style={styles.navButton}>
              <ChevronRight size={18} color="#374151" />
            </Pressable>
          </View>
          
          {/* Monthly Appointments */}
          <View style={styles.monthlyAppointments}>
            {currentMonthAppointments.length > 0 ? (
              currentMonthAppointments.map(appointment => {
                const statusColors = getStatusColors(appointment.status);
                return (
                  <View key={appointment.id} style={styles.appointmentCard}>
                    <View style={styles.appointmentHeader}>
                      <Text style={styles.appointmentType}>{appointment.type}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
                        <Text style={[styles.statusText, { color: statusColors.text }]}>
                          {appointment.status}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.appointmentDetails}>
                      <View style={styles.detailRow}>
                        <Calendar size={14} color="#6b7280" />
                        <Text style={styles.detailText}>
                          {appointment.recommendedDate} at {appointment.recommendedTime}
                        </Text>
                      </View>
                      
                      <View style={styles.detailRow}>
                        <MapPin size={14} color="#6b7280" />
                        <Text style={styles.detailText}>
                          {appointment.provider}, {appointment.location}
                        </Text>
                      </View>
                    </View>
                    
                    {/* Expand/collapse button */}
                    <Pressable 
                      style={styles.expandButton}
                      onPress={() => handleExpandCard(appointment.id)}
                    >
                      <Text style={styles.expandButtonText}>
                        {expanded === appointment.id ? "Less details" : "More details"}
                      </Text>
                      <ChevronRight 
                        size={14} 
                        color="#2563eb"
                        style={[
                          styles.expandIcon,
                          expanded === appointment.id && styles.expandIconRotated
                        ]}
                      />
                    </Pressable>
                    
                    {/* Expanded content */}
                    {expanded === appointment.id && (
                      <View style={styles.expandedContent}>
                        <View style={styles.expandedSection}>
                          <Text style={styles.expandedSectionTitle}>Why this matters:</Text>
                          <Text style={styles.expandedSectionText}>{appointment.reason}</Text>
                        </View>
                        
                        {appointment.workConflict && (
                          <View style={styles.conflictSection}>
                            <AlertCircle size={16} color="#f59e0b" style={styles.conflictIcon} />
                            <Text style={styles.conflictText}>{appointment.conflictResolution}</Text>
                          </View>
                        )}
                        
                        <View style={styles.expandedSection}>
                          <Text style={styles.expandedSectionTitle}>Preparation:</Text>
                          <View style={styles.preparationList}>
                            {appointment.preparationSteps.map((step, index) => (
                              <Text key={index} style={styles.preparationItem}>
                                • {step}
                              </Text>
                            ))}
                          </View>
                        </View>
                        
                        <View style={styles.appointmentMeta}>
                          <View style={styles.metaItem}>
                            <Text style={styles.metaLabel}>Benefit deadline:</Text>
                            <Text style={styles.metaValue}>{appointment.benefitDeadline}</Text>
                          </View>
                          <View style={styles.metaItem}>
                            <Text style={styles.metaLabel}>Work impact:</Text>
                            <Text style={styles.metaValue}>{appointment.workImpact}</Text>
                          </View>
                        </View>
                        
                        {appointment.status === "Recommended" && (
                          <View style={styles.actionButtons}>
                            <Pressable 
                              style={styles.scheduleButton}
                              onPress={() => handleScheduleAppointment(appointment.id)}
                            >
                              <Text style={styles.scheduleButtonText}>Schedule Now</Text>
                            </Pressable>
                            <Pressable 
                              style={styles.editButton}
                              onPress={() => handleEditAppointment(appointment.id)}
                            >
                              <Text style={styles.editButtonText}>Edit Details</Text>
                            </Pressable>
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                );
              })
            ) : (
              <View style={styles.emptyMonth}>
                <Text style={styles.emptyMonthText}>
                  No appointments scheduled for {months[currentMonth]}
                </Text>
              </View>
            )}
          </View>
        </View>
        
        {/* Timeline View */}
        <View style={styles.timelineSection}>
          <Text style={styles.timelineTitle}>Annual Care Timeline</Text>
          <View style={styles.timelineContainer}>
            <View style={styles.timelineLine} />
            
            {getTimelineAppointments().map((appointment, index) => {
              const date = new Date(appointment.recommendedDate);
              const month = months[date.getMonth()].substring(0, 3);
              const day = date.getDate();
              
              return (
                <View key={appointment.id} style={styles.timelineItem}>
                  <View style={styles.timelineDot}>
                    {appointment.status === "Scheduled" ? (
                      <CheckCircle size={14} color="#10b981" />
                    ) : (
                      <View style={styles.timelineDotInner} />
                    )}
                  </View>
                  
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineDate}>{month} {day}</Text>
                    <Text style={styles.timelineItemTitle}>{appointment.type}</Text>
                    
                    {appointment.conflictResolution && (
                      <View style={styles.optimizedTag}>
                        <Clock size={12} color="#6b7280" />
                        <Text style={styles.optimizedText}>Optimized scheduling</Text>
                      </View>
                    )}
                  </View>
                  
                  <View style={styles.timelineAction}>
                    {appointment.status === "Scheduled" ? (
                      <Text style={styles.confirmedText}>Confirmed</Text>
                    ) : appointment.status === "Pending Confirmation" ? (
                      <Text style={styles.pendingText}>Pending</Text>
                    ) : (
                      <View style={styles.timelineActions}>
                        <Pressable 
                          style={styles.timelineScheduleButton}
                          onPress={() => handleScheduleAppointment(appointment.id)}
                        >
                          <Text style={styles.timelineScheduleText}>Schedule</Text>
                          <ArrowRight size={14} color="#2563eb" />
                        </Pressable>
                        <Pressable 
                          style={styles.timelineEditButton}
                          onPress={() => handleEditAppointment(appointment.id)}
                        >
                          <Text style={styles.timelineEditText}>Edit</Text>
                        </Pressable>
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Bottom padding to prevent content being hidden behind footer */}
        <View style={styles.bottomPadding} />
      </ScrollView>
      
      {/* Footer message */}
      <View style={styles.footerMessage}>
        <Text style={styles.footerMessageText}>
          This AI-driven timeline will update as appointments are scheduled
        </Text>
      </View>
      
      <Footer activePath="care-timeline" employee={true} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  aiBanner: {
    backgroundColor: '#eff6ff',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#dbeafe',
  },
  aiIconContainer: {
    backgroundColor: '#dbeafe',
    borderRadius: 12,
    padding: 6,
    marginRight: 12,
    marginTop: 2,
  },
  aiBannerContent: {
    flex: 1,
  },
  aiBannerTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e40af',
    marginBottom: 2,
  },
  aiBannerText: {
    fontSize: 12,
    color: '#2563eb',
    lineHeight: 16,
  },
  scrollContent: {
    flex: 1,
  },
  monthlyControls: {
    padding: 16,
  },
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  navButton: {
    padding: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  monthlyAppointments: {
    marginBottom: 24,
  },
  appointmentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  appointmentType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  statusBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  appointmentDetails: {
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  expandButtonText: {
    fontSize: 12,
    color: '#2563eb',
    marginRight: 4,
  },
  expandIcon: {
    transform: [{ rotate: '0deg' }],
  },
  expandIconRotated: {
    transform: [{ rotate: '90deg' }],
  },
  expandedContent: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  expandedSection: {
    marginBottom: 12,
  },
  expandedSectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  expandedSectionText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  conflictSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  conflictIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  conflictText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
    lineHeight: 20,
  },
  preparationList: {
    marginLeft: 8,
  },
  preparationItem: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
    lineHeight: 20,
  },
  appointmentMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 12,
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  metaValue: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  actionButtons: {
    marginTop: 8,
  },
  scheduleButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  scheduleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  editButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  emptyMonth: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyMonthText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  timelineSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  timelineContainer: {
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    left: 12,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: '#dbeafe',
    zIndex: 0,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    position: 'relative',
    zIndex: 10,
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    marginTop: 2,
  },
  timelineDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563eb',
  },
  timelineContent: {
    flex: 1,
  },
  timelineDate: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9ca3af',
    marginBottom: 2,
  },
  timelineItemTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  optimizedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  optimizedText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  timelineAction: {
    alignItems: 'flex-end',
    minWidth: 80,
  },
  timelineActions: {
    alignItems: 'flex-end',
  },
  timelineScheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  timelineScheduleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563eb',
    marginRight: 4,
  },
  timelineEditButton: {
    paddingVertical: 2,
  },
  timelineEditText: {
    fontSize: 11,
    color: '#6b7280',
    textDecorationLine: 'underline',
  },
  confirmedText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#10b981',
  },
  pendingText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#f59e0b',
  },
  footerMessage: {
    backgroundColor: '#f3f4f6',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    padding: 16,
    alignItems: 'center',
  },
  footerMessageText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  bottomPadding: {
    height: 20,
  },
});

export default CareCoordinationTimeline;