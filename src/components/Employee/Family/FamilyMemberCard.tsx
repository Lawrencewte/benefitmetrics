import { Calendar, ChevronRight, UserCircle } from 'lucide-react';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface FamilyMember {
  id: string;
  firstName: string;
  lastName: string;
  relationship: string;
  dateOfBirth: string;
  upcomingAppointments?: number;
  healthStatus?: 'good' | 'needsAttention' | 'overdue';
}

interface FamilyMemberCardProps {
  member: FamilyMember;
  onPress: () => void;
}

export function FamilyMemberCard({ member, onPress }: FamilyMemberCardProps) {
  const getHealthStatusColor = () => {
    switch (member.healthStatus) {
      case 'good':
        return 'bg-green-100 text-green-800';
      case 'needsAttention':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getHealthStatusText = () => {
    switch (member.healthStatus) {
      case 'good':
        return 'Up to date';
      case 'needsAttention':
        return 'Needs attention';
      case 'overdue':
        return 'Overdue checkups';
      default:
        return 'Status unknown';
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-lg border border-gray-200 p-4"
    >
      <View className="flex-row items-center">
        <View className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center mr-3">
          <UserCircle size={24} className="text-blue-600" />
        </View>
        
        <View className="flex-1">
          <Text className="font-medium text-lg">{member.firstName} {member.lastName}</Text>
          <Text className="text-gray-600">{member.relationship}</Text>
        </View>
        
        <ChevronRight size={20} className="text-gray-400" />
      </View>
      
      <View className="flex-row mt-4 justify-between">
        <View className="flex-row items-center">
          <Calendar size={16} className="text-gray-500 mr-1" />
          <Text className="text-gray-600">
            {member.upcomingAppointments
              ? `${member.upcomingAppointments} upcoming`
              : 'No appointments'}
          </Text>
        </View>
        
        <View className={`px-2 py-0.5 rounded-full ${getHealthStatusColor()}`}>
          <Text className={`text-xs font-medium ${getHealthStatusColor()}`}>
            {getHealthStatusText()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}