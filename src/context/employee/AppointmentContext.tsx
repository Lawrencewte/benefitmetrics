import { format } from 'date-fns';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appointment, AppointmentStatus, AppointmentType, Doctor } from '../../types/employee';
import { useAuth } from '../AuthContext';
import { useNotifications } from '../Common/NotificationsContext';

interface AppointmentState {
  appointments: Appointment[];
  upcomingAppointments: Appointment[];
  pastAppointments: Appointment[];
  appointmentTypes: AppointmentType[];
  recommendedAppointments: AppointmentType[];
  doctors: Doctor[];
  isLoading: boolean;
  error: string | null;
}

interface AppointmentContextType extends AppointmentState {
  fetchAppointments: () => Promise<void>;
  fetchAppointmentTypes: () => Promise<void>;
  fetchDoctors: (specialtyId?: string) => Promise<void>;
  fetchRecommendedAppointments: () => Promise<void>;
  scheduleAppointment: (appointmentData: Partial<Appointment>) => Promise<Appointment>;
  updateAppointment: (id: string, appointmentData: Partial<Appointment>) => Promise<Appointment>;
  cancelAppointment: (id: string, reason?: string) => Promise<void>;
  confirmAppointment: (id: string) => Promise<void>;
  rescheduleAppointment: (id: string, newDate: Date, newTime: string) => Promise<Appointment>;
  getAvailableTimes: (doctorId: string, date: Date) => Promise<string[]>;
  getAppointmentById: (id: string) => Appointment | undefined;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const authContext = useAuth();
  const notificationContext = useNotifications();
  
  // Mock user and token if auth context is not available or returns undefined
  const user = authContext?.user || { 
    id: '1', 
    name: 'Taylor', 
    email: 'taylor@example.com' 
  };
  const token = authContext?.token || 'demo-token-123';
  
  // Use the correct notification function signature - only 3 parameters (title, body, trigger)
  const schedulePushNotification = notificationContext?.schedulePushNotification || 
    ((title: string, body: string, trigger: Date) => {
      console.log('Mock notification:', { title, body, trigger });
      return Promise.resolve();
    });
  
  const [state, setState] = useState<AppointmentState>({
    appointments: [],
    upcomingAppointments: [],
    pastAppointments: [],
    appointmentTypes: [],
    recommendedAppointments: [],
    doctors: [],
    isLoading: false,
    error: null,
  });

  // Load appointments when user changes
  useEffect(() => {
    if (user && token) {
      fetchAppointments();
      fetchAppointmentTypes();
      fetchRecommendedAppointments();
    } else {
      // Clear appointments when user logs out
      setState({
        appointments: [],
        upcomingAppointments: [],
        pastAppointments: [],
        appointmentTypes: [],
        recommendedAppointments: [],
        doctors: [],
        isLoading: false,
        error: null,
      });
    }
  }, [user, token]);

  // Set up appointment reminders
  useEffect(() => {
    const setupAppointmentReminders = async () => {
      if (!user || state.upcomingAppointments.length === 0) return;
      
      try {
        // Schedule reminder notifications for upcoming appointments
        for (const appointment of state.upcomingAppointments) {
          // Only schedule reminders for confirmed appointments
          if (appointment.status !== 'confirmed') continue;
          
          const appointmentDate = new Date(appointment.date);
          
          // Validate the appointment date
          if (isNaN(appointmentDate.getTime())) {
            console.warn('Invalid appointment date:', appointment.date);
            continue;
          }
          
          // Parse the time and set it on the appointment date
          const [timeStr, period] = appointment.time.split(' ');
          const [hours, minutes] = timeStr.split(':').map(Number);
          let adjustedHours = hours;
          
          if (period === 'PM' && hours !== 12) {
            adjustedHours += 12;
          } else if (period === 'AM' && hours === 12) {
            adjustedHours = 0;
          }
          
          appointmentDate.setHours(adjustedHours, minutes, 0, 0);
          
          // Schedule reminder for 1 day before at 9 AM
          const oneDayBefore = new Date(appointmentDate);
          oneDayBefore.setDate(oneDayBefore.getDate() - 1);
          oneDayBefore.setHours(9, 0, 0, 0);
          
          if (oneDayBefore > new Date()) {
            await schedulePushNotification(
              'Appointment Reminder',
              `Your ${appointment.type.name} appointment with ${appointment.doctor.name} is tomorrow at ${appointment.time}`,
              oneDayBefore
            );
          }
          
          // Schedule reminder for 2 hours before
          const twoHoursBefore = new Date(appointmentDate);
          twoHoursBefore.setHours(twoHoursBefore.getHours() - 2);
          
          if (twoHoursBefore > new Date()) {
            await schedulePushNotification(
              'Appointment Soon',
              `Your ${appointment.type.name} appointment with ${appointment.doctor.name} is in 2 hours`,
              twoHoursBefore
            );
          }
        }
      } catch (error) {
        console.error('Error setting up appointment reminders:', error);
        // Don't crash the app if notifications fail
      }
    };

    setupAppointmentReminders();
  }, [state.upcomingAppointments, schedulePushNotification]);

  const fetchAppointments = async () => {
    setState(prevState => ({
      ...prevState,
      isLoading: true,
      error: null,
    }));
    
    try {
      // For demo purposes, use mock data instead of API call
      const mockAppointments: Appointment[] = [
        {
          id: '1',
          type: { id: '1', name: 'Annual Physical', category: 'preventive' },
          doctor: { 
            id: '1', 
            name: 'Dr. Martinez', 
            specialty: 'Internal Medicine',
            location: 'Main Medical Center'
          },
          date: '2025-05-28',
          time: '10:30 AM',
          status: 'confirmed' as AppointmentStatus,
          location: 'Main Medical Center',
          notes: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          type: { id: '2', name: 'Dental Cleaning', category: 'dental' },
          doctor: { 
            id: '2', 
            name: 'Dr. Wong', 
            specialty: 'Dentistry',
            location: 'Dental Associates'
          },
          date: '2025-06-15',
          time: '2:00 PM',
          status: 'scheduled' as AppointmentStatus,
          location: 'Dental Associates',
          notes: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];
      
      const now = new Date();
      
      // Separate appointments into upcoming and past
      const upcomingAppointments = mockAppointments.filter(appointment => {
        const appointmentDate = new Date(appointment.date);
        return appointmentDate >= now || appointment.status === 'scheduled' || appointment.status === 'confirmed';
      });
      
      const pastAppointments = mockAppointments.filter(appointment => {
        const appointmentDate = new Date(appointment.date);
        return appointmentDate < now && appointment.status !== 'scheduled' && appointment.status !== 'confirmed';
      });
      
      setState(prevState => ({
        ...prevState,
        appointments: mockAppointments,
        upcomingAppointments,
        pastAppointments,
        isLoading: false,
      }));
    } catch (error) {
      setState(prevState => ({
        ...prevState,
        error: error instanceof Error ? error.message : 'Failed to fetch appointments',
        isLoading: false,
      }));
      console.error('Failed to fetch appointments:', error);
    }
  };

  const fetchAppointmentTypes = async () => {
    try {
      const mockTypes: AppointmentType[] = [
        { id: '1', name: 'Blood Work', category: 'lab' },
        { id: '2', name: 'Annual Physical', category: 'preventive' },
        { id: '3', name: 'Dental Cleaning', category: 'dental' },
        { id: '4', name: 'Eye Exam', category: 'vision' },
      ];
      
      setState(prevState => ({
        ...prevState,
        appointmentTypes: mockTypes,
      }));
    } catch (error) {
      console.error('Failed to fetch appointment types:', error);
    }
  };

  const fetchDoctors = async (specialtyId?: string) => {
    try {
      const mockDoctors: Doctor[] = [
        { 
          id: '1', 
          name: 'Dr. Sarah Martinez', 
          specialty: 'Internal Medicine',
          location: 'Main Clinic'
        },
        { 
          id: '2', 
          name: 'Dr. Wong', 
          specialty: 'Dentistry',
          location: 'Dental Associates'
        },
      ];
      
      setState(prevState => ({
        ...prevState,
        doctors: mockDoctors,
      }));
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
    }
  };

  const fetchRecommendedAppointments = async () => {
    try {
      const mockRecommended: AppointmentType[] = [
        { id: '1', name: 'Blood Work', category: 'lab' },
        { id: '2', name: 'Annual Physical', category: 'preventive' },
      ];
      
      setState(prevState => ({
        ...prevState,
        recommendedAppointments: mockRecommended,
      }));
    } catch (error) {
      console.error('Failed to fetch recommended appointments:', error);
    }
  };

  const scheduleAppointment = async (appointmentData: Partial<Appointment>): Promise<Appointment> => {
    setState(prevState => ({
      ...prevState,
      isLoading: true,
      error: null,
    }));
    
    try {
      const mockAppointment: Appointment = {
        id: Date.now().toString(),
        type: appointmentData.type || { id: '1', name: 'Blood Work', category: 'lab' },
        doctor: appointmentData.doctor || { 
          id: '1', 
          name: 'Dr. Sarah Martinez', 
          specialty: 'Internal Medicine',
          location: 'Main Clinic'
        },
        date: appointmentData.date || new Date().toISOString(),
        time: appointmentData.time || '10:30 AM',
        status: 'scheduled' as AppointmentStatus,
        location: appointmentData.location || 'Main Clinic',
        notes: appointmentData.notes || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setState(prevState => {
        const appointments = [...prevState.appointments, mockAppointment];
        const upcomingAppointments = [...prevState.upcomingAppointments, mockAppointment];
        
        return {
          ...prevState,
          appointments,
          upcomingAppointments,
          isLoading: false,
        };
      });
      
      // Schedule confirmation reminder with correct parameters
      try {
        await schedulePushNotification(
          'Appointment Scheduled',
          `Your ${mockAppointment.type.name} appointment with ${mockAppointment.doctor.name} has been scheduled for ${format(new Date(mockAppointment.date), 'MMM d, yyyy')} at ${mockAppointment.time}`,
          new Date(Date.now() + 5000) // Show notification in 5 seconds for immediate feedback
        );
      } catch (notificationError) {
        console.warn('Failed to schedule notification:', notificationError);
        // Don't fail the appointment creation if notification fails
      }
      
      return mockAppointment;
    } catch (error) {
      setState(prevState => ({
        ...prevState,
        error: error instanceof Error ? error.message : 'Failed to schedule appointment',
        isLoading: false,
      }));
      console.error('Failed to schedule appointment:', error);
      throw error;
    }
  };

  const updateAppointment = async (id: string, appointmentData: Partial<Appointment>): Promise<Appointment> => {
    setState(prevState => ({
      ...prevState,
      isLoading: true,
      error: null,
    }));
    
    try {
      const existingAppointment = state.appointments.find(apt => apt.id === id);
      if (!existingAppointment) {
        throw new Error('Appointment not found');
      }
      
      const updatedAppointment: Appointment = {
        ...existingAppointment,
        ...appointmentData,
        updatedAt: new Date().toISOString(),
      };
      
      setState(prevState => {
        const appointments = prevState.appointments.map(appointment =>
          appointment.id === id ? updatedAppointment : appointment
        );
        
        const now = new Date();
        const appointmentDate = new Date(updatedAppointment.date);
        const isUpcoming = appointmentDate >= now || 
                          updatedAppointment.status === 'scheduled' || 
                          updatedAppointment.status === 'confirmed';
        
        let upcomingAppointments = [...prevState.upcomingAppointments];
        let pastAppointments = [...prevState.pastAppointments];
        
        upcomingAppointments = upcomingAppointments.filter(appointment => appointment.id !== id);
        pastAppointments = pastAppointments.filter(appointment => appointment.id !== id);
        
        if (isUpcoming) {
          upcomingAppointments.push(updatedAppointment);
        } else {
          pastAppointments.push(updatedAppointment);
        }
        
        return {
          ...prevState,
          appointments,
          upcomingAppointments,
          pastAppointments,
          isLoading: false,
        };
      });
      
      return updatedAppointment;
    } catch (error) {
      setState(prevState => ({
        ...prevState,
        error: error instanceof Error ? error.message : 'Failed to update appointment',
        isLoading: false,
      }));
      console.error('Failed to update appointment:', error);
      throw error;
    }
  };

  const cancelAppointment = async (id: string, reason?: string): Promise<void> => {
    setState(prevState => ({
      ...prevState,
      isLoading: true,
      error: null,
    }));
    
    try {
      setState(prevState => {
        const updateStatus = (appointment: Appointment): Appointment => {
          if (appointment.id === id) {
            return {
              ...appointment,
              status: 'cancelled' as AppointmentStatus,
              cancellationReason: reason || 'Cancelled by user',
            };
          }
          return appointment;
        };
        
        const appointments = prevState.appointments.map(updateStatus);
        const upcomingAppointments = prevState.upcomingAppointments
          .map(updateStatus)
          .filter(appointment => appointment.id !== id);
        
        const appointmentToCancel = appointments.find(appointment => appointment.id === id);
        const isInPast = prevState.pastAppointments.some(appointment => appointment.id === id);
        
        let pastAppointments = [...prevState.pastAppointments];
        
        if (appointmentToCancel && !isInPast) {
          pastAppointments.push({
            ...appointmentToCancel,
            status: 'cancelled',
            cancellationReason: reason || 'Cancelled by user',
          });
        } else {
          pastAppointments = pastAppointments.map(updateStatus);
        }
        
        return {
          ...prevState,
          appointments,
          upcomingAppointments,
          pastAppointments,
          isLoading: false,
        };
      });
    } catch (error) {
      setState(prevState => ({
        ...prevState,
        error: error instanceof Error ? error.message : 'Failed to cancel appointment',
        isLoading: false,
      }));
      console.error('Failed to cancel appointment:', error);
      throw error;
    }
  };

  const confirmAppointment = async (id: string): Promise<void> => {
    try {
      setState(prevState => {
        const updateStatus = (appointment: Appointment): Appointment => {
          if (appointment.id === id) {
            return {
              ...appointment,
              status: 'confirmed' as AppointmentStatus,
            };
          }
          return appointment;
        };
        
        return {
          ...prevState,
          appointments: prevState.appointments.map(updateStatus),
          upcomingAppointments: prevState.upcomingAppointments.map(updateStatus),
          pastAppointments: prevState.pastAppointments.map(updateStatus),
        };
      });
      
      const appointment = state.appointments.find(appointment => appointment.id === id);
      
      if (appointment) {
        try {
          await schedulePushNotification(
            'Appointment Confirmed',
            `Your ${appointment.type.name} appointment with ${appointment.doctor.name} on ${format(new Date(appointment.date), 'MMM d, yyyy')} at ${appointment.time} has been confirmed.`,
            new Date(Date.now() + 2000) // Show notification in 2 seconds
          );
        } catch (notificationError) {
          console.warn('Failed to schedule confirmation notification:', notificationError);
        }
      }
    } catch (error) {
      console.error('Failed to confirm appointment:', error);
      throw error;
    }
  };

  const rescheduleAppointment = async (id: string, newDate: Date, newTime: string): Promise<Appointment> => {
    try {
      const existingAppointment = state.appointments.find(apt => apt.id === id);
      if (!existingAppointment) {
        throw new Error('Appointment not found');
      }
      
      const updatedAppointment: Appointment = {
        ...existingAppointment,
        date: newDate.toISOString(),
        time: newTime,
        updatedAt: new Date().toISOString(),
      };
      
      setState(prevState => {
        const appointments = prevState.appointments.map(appointment =>
          appointment.id === id ? updatedAppointment : appointment
        );
        
        const upcomingAppointments = prevState.upcomingAppointments.map(appointment =>
          appointment.id === id ? updatedAppointment : appointment
        );
        
        const pastAppointments = prevState.pastAppointments.map(appointment =>
          appointment.id === id ? updatedAppointment : appointment
        );
        
        return {
          ...prevState,
          appointments,
          upcomingAppointments,
          pastAppointments,
        };
      });
      
      try {
        await schedulePushNotification(
          'Appointment Rescheduled',
          `Your appointment has been rescheduled for ${format(newDate, 'MMM d, yyyy')} at ${newTime}.`,
          new Date(Date.now() + 2000) // Show notification in 2 seconds
        );
      } catch (notificationError) {
        console.warn('Failed to schedule reschedule notification:', notificationError);
      }
      
      return updatedAppointment;
    } catch (error) {
      console.error('Failed to reschedule appointment:', error);
      throw error;
    }
  };

  const getAvailableTimes = async (doctorId: string, date: Date): Promise<string[]> => {
    try {
      const mockTimes = [
        '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', 
        '11:00 AM', '11:30 AM', '2:00 PM', '2:30 PM', 
        '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
      ];
      
      return mockTimes;
    } catch (error) {
      console.error('Failed to get available times:', error);
      throw error;
    }
  };

  const getAppointmentById = (id: string): Appointment | undefined => {
    return state.appointments.find(appointment => appointment.id === id);
  };

  return (
    <AppointmentContext.Provider
      value={{
        ...state,
        fetchAppointments,
        fetchAppointmentTypes,
        fetchDoctors,
        fetchRecommendedAppointments,
        scheduleAppointment,
        updateAppointment,
        cancelAppointment,
        confirmAppointment,
        rescheduleAppointment,
        getAvailableTimes,
        getAppointmentById,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  
  if (context === undefined) {
    throw new Error('useAppointments must be used within an AppointmentProvider');
  }
  
  return context;
};

export default AppointmentContext;