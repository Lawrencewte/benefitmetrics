import { Calendar, Clock, MapPin, User } from 'lucide-react';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface Appointment {
  id: string;
  type: string;
  providerName: string;
  facilityName?: string;
  date: string;
  time: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'canceled';
}

interface UpcomingAppointmentsProps {
  appointments: Appointment[];
  onAppointmentPress: (appointmentId: string) => void;
}

export function UpcomingAppointments({ 
  appointments, 
  onAppointmentPress 
}: UpcomingAppointmentsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (appointments.length === 0) {
    return (
      <View className="bg-white rounded-lg p-6 border border-gray-200 items-center">
        <Calendar size={48} color="#9CA3AF" />
        <Text className="text-lg font-medium mt-4 mb-2">No Upcoming Appointments</Text>
        <Text className="text-gray-600 text-center">
          You don't have any scheduled appointments.
        </Text>
      </View>
    );
  }

  return (
    <View className="space-y-3">
      {appointments.map(appointment => (
        <TouchableOpacity
          key={appointment.id}
          onPress={() => onAppointmentPress(appointment.id)}
          className="bg-white rounded-lg p-4 border border-gray-200"
        >
          <View className="flex-row justify-between items-start mb-3">
            <Text className="font-semibold text-lg">{appointment.type}</Text>
            <View className={`px-2 py-1 rounded-full ${getStatusColor(appointment.status)}`}>
              <Text className={`text-xs font-medium ${getStatusColor(appointment.status)}`}>
                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
              </Text>
            </View>
          </View>
          
          <View className="space-y-2">
            <View className="flex-row items-center">
              <Calendar size={16} className="text-gray-500 mr-2" />
              <Text className="text-gray-700">{new Date(appointment.date).toLocaleDateString()}</Text>
            </View>
            
            <View className="flex-row items-center">
              <Clock size={16} className="text-gray-500 mr-2" />
              <Text className="text-gray-700">{appointment.time}</Text>
            </View>
            
            <View className="flex-row items-center">
              <User size={16} className="text-gray-500 mr-2" />
              <Text className="text-gray-700">{appointment.providerName}</Text>
            </View>
            
            {appointment.facilityName && (
              <View className="flex-row items-center">
                <MapPin size={16} className="text-gray-500 mr-2" />
                <Text className="text-gray-700">{appointment.facilityName}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}