import { router } from 'expo-router';
import { Calendar, CheckCircle, Clock, MapPin, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Footer from '../../../components/Common/layout/Footer';
import Header from '../../../components/Common/layout/Header';
import { useAppointments } from '../../../hooks/employee/useAppointments';
import { formatDate } from '../../../utils/dateUtils';

const appointmentTypes = [
  { id: 'annual', name: 'Annual Physical', icon: 'stethoscope' },
  { id: 'dental', name: 'Dental Checkup', icon: 'tooth' },
  { id: 'vision', name: 'Eye Exam', icon: 'eye' },
  { id: 'skin', name: 'Skin Check', icon: 'framer' },
  { id: 'bloodwork', name: 'Blood Work', icon: 'droplet' },
  { id: 'other', name: 'Other', icon: 'more-horizontal' }
];

// Simplified list of sample providers for demo purposes
const providers = [
  { id: 'p1', name: 'Dr. Sarah Martinez', specialty: 'Primary Care', availability: ['9:00 AM', '10:30 AM', '2:00 PM'] },
  { id: 'p2', name: 'Dr. John Wong', specialty: 'Dentist', availability: ['8:30 AM', '11:00 AM', '3:30 PM'] },
  { id: 'p3', name: 'Dr. Olivia Johnson', specialty: 'Ophthalmologist', availability: ['10:00 AM', '1:30 PM', '4:00 PM'] }
];

export default function ScheduleAppointmentScreen() {
  const { scheduleAppointment } = useAppointments();
  const [currentStep, setCurrentStep] = useState(1);
  const [appointmentType, setAppointmentType] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  
  // For demo purposes, simplified date selection (would use a date picker in a real app)
  const today = new Date();
  const nextDays = Array.from({ length: 5 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() + i + 1);
    return date;
  });
  
  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final submission
      scheduleAppointment({
        type: appointmentTypes.find(t => t.id === appointmentType)?.name || 'Appointment',
        date: selectedDate ? formatDate(selectedDate) : '',
        time: selectedTime,
        provider: providers.find(p => p.id === selectedProvider)?.name || '',
        location: 'Main Clinic', // Simplified for demo
        notes,
        confirmed: false,
      });
      
      // Navigate back to appointments list
      router.push('/employee/appointments');
    }
  };
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };
  
  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!appointmentType;
      case 2:
        return !!selectedDate;
      case 3:
        return !!selectedProvider && !!selectedTime;
      case 4:
        return true; // Notes are optional
      default:
        return false;
    }
  };
  
  return (
    <View style={styles.container}>
      <Header title="Schedule Appointment" showBackButton onBackPress={handleBack} />
      
      <View style={styles.progressContainer}>
        {[1, 2, 3, 4].map((step) => (
          <View key={step} style={styles.progressItem}>
            <View 
              style={[
                styles.progressDot,
                step <= currentStep ? styles.activeDot : styles.inactiveDot
              ]} 
            />
            {step < 4 && (
              <View 
                style={[
                  styles.progressLine,
                  step < currentStep ? styles.activeLine : styles.inactiveLine
                ]} 
              />
            )}
          </View>
        ))}
      </View>
      
      <ScrollView style={styles.content}>
        {currentStep === 1 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Select Appointment Type</Text>
            {appointmentTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.optionCard,
                  appointmentType === type.id && styles.selectedOption
                ]}
                onPress={() => setAppointmentType(type.id)}
              >
                <View style={styles.optionIconContainer}>
                  {/* Using a general icon for simplicity */}
                  <User size={20} color="#4682B4" />
                </View>
                <Text style={styles.optionText}>{type.name}</Text>
                {appointmentType === type.id && (
                  <CheckCircle size={16} color="#4682B4" style={styles.checkIcon} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        {currentStep === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Select Date</Text>
            <View style={styles.calendarContainer}>
              {/* Simplified calendar - would use a proper date picker in a real app */}
              {nextDays.map((date) => (
                <TouchableOpacity
                  key={date.toISOString()}
                  style={[
                    styles.dateOption,
                    selectedDate && date.toDateString() === selectedDate.toDateString() && styles.selectedDate
                  ]}
                  onPress={() => setSelectedDate(date)}
                >
                  <Text style={styles.dateWeekday}>{date.toLocaleDateString('en-US', { weekday: 'short' })}</Text>
                  <Text style={styles.dateDay}>{date.getDate()}</Text>
                  <Text style={styles.dateMonth}>{date.toLocaleDateString('en-US', { month: 'short' })}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.infoText}>
              Dates shown are based on recommended appointment availability and your calendar.
            </Text>
          </View>
        )}
        
        {currentStep === 3 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Select Provider & Time</Text>
            <View style={styles.sectionTitle}>
              <Text style={styles.sectionTitleText}>Available Providers</Text>
            </View>
            {providers.map((provider) => (
              <TouchableOpacity
                key={provider.id}
                style={[
                  styles.providerCard,
                  selectedProvider === provider.id && styles.selectedProvider
                ]}
                onPress={() => setSelectedProvider(provider.id)}
              >
                <View style={styles.providerIconContainer}>
                  <User size={20} color="#4682B4" />
                </View>
                <View style={styles.providerInfo}>
                  <Text style={styles.providerName}>{provider.name}</Text>
                  <Text style={styles.providerSpecialty}>{provider.specialty}</Text>
                </View>
                {selectedProvider === provider.id && (
                  <CheckCircle size={16} color="#4682B4" />
                )}
              </TouchableOpacity>
            ))}
            
            {selectedProvider && (
              <>
                <View style={styles.sectionTitle}>
                  <Text style={styles.sectionTitleText}>Available Times</Text>
                </View>
                <View style={styles.timeSlotContainer}>
                  {providers
                    .find(p => p.id === selectedProvider)
                    ?.availability.map((time) => (
                      <TouchableOpacity
                        key={time}
                        style={[
                          styles.timeSlot,
                          selectedTime === time && styles.selectedTimeSlot
                        ]}
                        onPress={() => setSelectedTime(time)}
                      >
                        <Clock size={14} color={selectedTime === time ? '#FFF' : '#4682B4'} />
                        <Text 
                          style={[
                            styles.timeText,
                            selectedTime === time && styles.selectedTimeText
                          ]}
                        >
                          {time}
                        </Text>
                      </TouchableOpacity>
                    ))
                  }
                </View>
              </>
            )}
          </View>
        )}
        
        {currentStep === 4 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Review & Confirm</Text>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Appointment Summary</Text>
              
              <View style={styles.summaryRow}>
                <View style={styles.summaryIconContainer}>
                  <Calendar size={16} color="#4682B4" />
                </View>
                <View style={styles.summaryTextContainer}>
                  <Text style={styles.summaryLabel}>Type</Text>
                  <Text style={styles.summaryValue}>
                    {appointmentTypes.find(t => t.id === appointmentType)?.name || 'Appointment'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.summaryRow}>
                <View style={styles.summaryIconContainer}>
                  <Calendar size={16} color="#4682B4" />
                </View>
                <View style={styles.summaryTextContainer}>
                  <Text style={styles.summaryLabel}>Date & Time</Text>
                  <Text style={styles.summaryValue}>
                    {selectedDate ? formatDate(selectedDate) : ''} at {selectedTime}
                  </Text>
                </View>
              </View>
              
              <View style={styles.summaryRow}>
                <View style={styles.summaryIconContainer}>
                  <User size={16} color="#4682B4" />
                </View>
                <View style={styles.summaryTextContainer}>
                  <Text style={styles.summaryLabel}>Provider</Text>
                  <Text style={styles.summaryValue}>
                    {providers.find(p => p.id === selectedProvider)?.name || ''}
                  </Text>
                </View>
              </View>
              
              <View style={styles.summaryRow}>
                <View style={styles.summaryIconContainer}>
                  <MapPin size={16} color="#4682B4" />
                </View>
                <View style={styles.summaryTextContainer}>
                  <Text style={styles.summaryLabel}>Location</Text>
                  <Text style={styles.summaryValue}>Main Clinic</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.notesContainer}>
              <Text style={styles.notesLabel}>Additional Notes (Optional)</Text>
              <TextInput
                style={styles.notesInput}
                multiline
                placeholder="Add any notes or questions for your provider..."
                value={notes}
                onChangeText={setNotes}
              />
            </View>
            
            <View style={styles.infoCard}>
              <Text style={styles.infoCardText}>
                This appointment is covered by your insurance with $0 co-pay.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
      
      <View style={styles.actionContainer}>
        <TouchableOpacity 
          style={[
            styles.actionButton,
            !canProceed() && styles.disabledButton
          ]}
          onPress={handleNext}
          disabled={!canProceed()}
        >
          <Text style={styles.actionButtonText}>
            {currentStep < 4 ? 'Continue' : 'Schedule Appointment'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <Footer 
        activePath="appointments"
        employee={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F9',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFF',
  },
  progressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  activeDot: {
    backgroundColor: '#4682B4',
  },
  inactiveDot: {
    backgroundColor: '#E0E0E0',
  },
  progressLine: {
    flex: 1,
    height: 2,
    marginHorizontal: 4,
  },
  activeLine: {
    backgroundColor: '#4682B4',
  },
  inactiveLine: {
    backgroundColor: '#E0E0E0',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  stepContainer: {
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  optionCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedOption: {
    borderColor: '#4682B4',
    backgroundColor: '#F0F7FF',
  },
  optionIconContainer: {
    backgroundColor: '#E6F0F9',
    borderRadius: 8,
    padding: 8,
    marginRight: 12,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  checkIcon: {
    marginLeft: 8,
  },
  calendarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateOption: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    width: '18%',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedDate: {
    borderColor: '#4682B4',
    backgroundColor: '#F0F7FF',
  },
  dateWeekday: {
    fontSize: 10,
    color: '#666',
    marginBottom: 4,
  },
  dateDay: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  dateMonth: {
    fontSize: 10,
    color: '#666',
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 8,
  },
  sectionTitle: {
    marginBottom: 12,
    marginTop: 16,
  },
  sectionTitleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  providerCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedProvider: {
    borderColor: '#4682B4',
    backgroundColor: '#F0F7FF',
  },
  providerIconContainer: {
    backgroundColor: '#E6F0F9',
    borderRadius: 8,
    padding: 8,
    marginRight: 12,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  providerSpecialty: {
    fontSize: 12,
    color: '#666',
  },
  timeSlotContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  timeSlot: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedTimeSlot: {
    borderColor: '#4682B4',
    backgroundColor: '#4682B4',
  },
  timeText: {
    fontSize: 12,
    color: '#333',
    marginLeft: 6,
  },
  selectedTimeText: {
    color: '#FFF',
  },
  summaryCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  summaryIconContainer: {
    backgroundColor: '#E6F0F9',
    borderRadius: 8,
    padding: 8,
    marginRight: 12,
  },
  summaryTextContainer: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  notesContainer: {
    marginBottom: 16,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  notesInput: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    height: 100,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    textAlignVertical: 'top',
  },
  infoCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  infoCardText: {
    fontSize: 12,
    color: '#2E7D32',
  },
  actionContainer: {
    padding: 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  actionButton: {
    backgroundColor: '#4682B4',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#C5D5E4',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
});