import { Building, Calendar, Clock, DollarSign, Stethoscope, User, Users } from 'lucide-react';
import React from 'react';

interface PersonaCardProps {
  persona: any;
  role: 'nurse' | 'doctor' | 'hr-admin';
}

export default function PersonaCard({ persona, role }: PersonaCardProps) {
  const getColorScheme = () => {
    switch (role) {
      case 'nurse':
        return {
          bg: 'from-purple-50 to-blue-50',
          iconColor: 'text-purple-500',
          initials: 'bg-purple-500'
        };
      case 'doctor':
        return {
          bg: 'from-green-50 to-blue-50',
          iconColor: 'text-green-500',
          initials: 'bg-green-600'
        };
      case 'hr-admin':
        return {
          bg: 'from-purple-50 to-blue-50',
          iconColor: 'text-purple-500',
          initials: 'bg-purple-600'
        };
      default:
        return {
          bg: 'from-blue-50 to-purple-50',
          iconColor: 'text-blue-500',
          initials: 'bg-blue-500'
        };
    }
  };

  const colors = getColorScheme();
  const initials = persona.name.split(' ').map((n: string) => n[0]).join('');

  const renderPersonaDetails = () => {
    if (role === 'hr-admin') {
      return (
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center">
            <Building size={12} className={`${colors.iconColor} mr-1`} />
            <span>{persona.company}</span>
          </div>
          <div className="flex items-center">
            <Users size={12} className={`${colors.iconColor} mr-1`} />
            <span>{persona.employeeCount} Employees</span>
          </div>
          <div className="flex items-center">
            <DollarSign size={12} className={`${colors.iconColor} mr-1`} />
            <span>${persona.unrealizedBenefits?.toLocaleString()} Unrealized</span>
          </div>
          <div className="flex items-center">
            <User size={12} className={`${colors.iconColor} mr-1`} />
            <span>{persona.avgHealthScore}% Avg Score</span>
          </div>
        </div>
      );
    } else {
      return (
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center">
            <Clock size={12} className={`${colors.iconColor} mr-1`} />
            <span>{persona.workSchedule}</span>
          </div>
          <div className="flex items-center">
            {role === 'doctor' ? (
              <Stethoscope size={12} className={`${colors.iconColor} mr-1`} />
            ) : (
              <User size={12} className={`${colors.iconColor} mr-1`} />
            )}
            <span>{persona.yearsOfService}</span>
          </div>
          <div className="flex items-center">
            <Calendar size={12} className={`${colors.iconColor} mr-1`} />
            <span>Next: {persona.upcomingShifts?.[0] || 'TBD'}</span>
          </div>
          <div className="flex items-center">
            <DollarSign size={12} className={`${colors.iconColor} mr-1`} />
            <span>{persona.benefitsUsed}</span>
          </div>
        </div>
      );
    }
  };

  return (
    <div className={`bg-gradient-to-r ${colors.bg} p-4 border-b`}>
      <div className="flex items-center mb-3">
        <div className={`w-12 h-12 rounded-full ${colors.initials} flex items-center justify-center text-white font-bold text-lg`}>
          {initials}
        </div>
        <div className="ml-3">
          <div className="font-semibold text-lg">{persona.name}</div>
          <div className="text-sm text-gray-600">{persona.role} • {persona.department}</div>
        </div>
      </div>
      
      {renderPersonaDetails()}
    </div>
  );
}