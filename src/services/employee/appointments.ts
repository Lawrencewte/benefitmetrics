import {
  Appointment,
  AppointmentsResponse,
  AppointmentTypesResponse,
  AvailableTimesResponse,
  CancelAppointmentResponse,
  ConfirmAppointmentResponse,
  DoctorsResponse,
  RecommendedAppointmentsResponse,
  RescheduleAppointmentResponse,
  ScheduleAppointmentResponse,
  UpdateAppointmentResponse,
} from '../../types/employee';
import api from '../api';

/**
 * Get all appointments for the current user
 * 
 * @param token Auth token
 * @returns Response with appointments
 */
export const getAppointments = async (token: string): Promise<AppointmentsResponse> => {
  try {
    const response = await api.get<AppointmentsResponse>(
      '/employee/appointments',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Failed to get appointments:', error);
    return {
      success: false,
      message: error.displayMessage || 'Failed to retrieve appointments',
    };
  }
};

/**
 * Get all appointment types
 * 
 * @param token Auth token
 * @returns Response with appointment types
 */
export const getAppointmentTypes = async (token: string): Promise<AppointmentTypesResponse> => {
  try {
    const response = await api.get<AppointmentTypesResponse>(
      '/employee/appointment-types',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Failed to get appointment types:', error);
    return {
      success: false,
      message: error.displayMessage || 'Failed to retrieve appointment types',
    };
  }
};

/**
 * Get doctors/providers by specialty
 * 
 * @param token Auth token
 * @param specialtyId Optional specialty ID filter
 * @returns Response with doctors
 */
export const getDoctors = async (token: string, specialtyId?: string): Promise<DoctorsResponse> => {
  try {
    const url = specialtyId 
      ? `/employee/doctors?specialtyId=${specialtyId}`
      : '/employee/doctors';
      
    const response = await api.get<DoctorsResponse>(
      url,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Failed to get doctors:', error);
    return {
      success: false,
      message: error.displayMessage || 'Failed to retrieve doctors',
    };
  }
};

/**
 * Get recommended appointment types based on user profile
 * 
 * @param token Auth token
 * @returns Response with recommended appointment types
 */
export const getRecommendedAppointments = async (token: string): Promise<RecommendedAppointmentsResponse> => {
  try {
    const response = await api.get<RecommendedAppointmentsResponse>(
      '/employee/recommended-appointments',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Failed to get recommended appointments:', error);
    return {
      success: false,
      message: error.displayMessage || 'Failed to retrieve recommended appointments',
    };
  }
};

/**
 * Schedule a new appointment
 * 
 * @param token Auth token
 * @param appointmentData Appointment data
 * @returns Response with created appointment
 */
export const scheduleAppointment = async (
  token: string,
  appointmentData: Partial<Appointment>
): Promise<ScheduleAppointmentResponse> => {
  try {
    const response = await api.post<ScheduleAppointmentResponse>(
      '/employee/appointments',
      appointmentData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Failed to schedule appointment:', error);
    return {
      success: false,
      message: error.displayMessage || 'Failed to schedule appointment',
    };
  }
};

/**
 * Update an existing appointment
 * 
 * @param token Auth token
 * @param appointmentId Appointment ID
 * @param appointmentData Updated appointment data
 * @returns Response with updated appointment
 */
export const updateAppointment = async (
  token: string,
  appointmentId: string,
  appointmentData: Partial<Appointment>
): Promise<UpdateAppointmentResponse> => {
  try {
    const response = await api.put<UpdateAppointmentResponse>(
      `/employee/appointments/${appointmentId}`,
      appointmentData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Failed to update appointment:', error);
    return {
      success: false,
      message: error.displayMessage || 'Failed to update appointment',
    };
  }
};

/**
 * Cancel an appointment
 * 
 * @param token Auth token
 * @param appointmentId Appointment ID
 * @param reason Optional cancellation reason
 * @returns Response with success status
 */
export const cancelAppointment = async (
  token: string,
  appointmentId: string,
  reason?: string
): Promise<CancelAppointmentResponse> => {
  try {
    const response = await api.post<CancelAppointmentResponse>(
      `/employee/appointments/${appointmentId}/cancel`,
      { reason },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Failed to cancel appointment:', error);
    return {
      success: false,
      message: error.displayMessage || 'Failed to cancel appointment',
    };
  }
};

/**
 * Confirm an appointment
 * 
 * @param token Auth token
 * @param appointmentId Appointment ID
 * @returns Response with success status
 */
export const confirmAppointment = async (
  token: string,
  appointmentId: string
): Promise<ConfirmAppointmentResponse> => {
  try {
    const response = await api.post<ConfirmAppointmentResponse>(
      `/employee/appointments/${appointmentId}/confirm`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Failed to confirm appointment:', error);
    return {
      success: false,
      message: error.displayMessage || 'Failed to confirm appointment',
    };
  }
};

/**
 * Reschedule an appointment
 * 
 * @param token Auth token
 * @param appointmentId Appointment ID
 * @param newDate New appointment date
 * @param newTime New appointment time
 * @returns Response with updated appointment
 */
export const rescheduleAppointment = async (
  token: string,
  appointmentId: string,
  newDate: Date,
  newTime: string
): Promise<RescheduleAppointmentResponse> => {
  try {
    const response = await api.post<RescheduleAppointmentResponse>(
      `/employee/appointments/${appointmentId}/reschedule`,
      { date: newDate, time: newTime },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Failed to reschedule appointment:', error);
    return {
      success: false,
      message: error.displayMessage || 'Failed to reschedule appointment',
    };
  }
};

/**
 * Get available time slots for a doctor on a specific date
 * 
 * @param token Auth token
 * @param doctorId Doctor ID
 * @param date Appointment date
 * @returns Response with available times
 */
export const getAvailableTimes = async (
  token: string,
  doctorId: string,
  date: Date
): Promise<AvailableTimesResponse> => {
  try {
    const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD
    
    const response = await api.get<AvailableTimesResponse>(
      `/employee/doctors/${doctorId}/available-times?date=${formattedDate}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Failed to get available times:', error);
    return {
      success: false,
      message: error.displayMessage || 'Failed to retrieve available times',
    };
  }
};