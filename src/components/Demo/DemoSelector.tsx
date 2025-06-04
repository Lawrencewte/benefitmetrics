import { Link } from 'expo-router';
import { Building, Heart, Stethoscope, Users } from 'lucide-react';
import React from 'react';

interface DemoOption {
  id: string;
  persona: {
    name: string;
    role: string;
    initials: string;
    color: string;
  };
  features: string[];
  challenges: string[];
  href: string;
}

const demoOptions: DemoOption[] = [
  {
    id: 'nurse',
    persona: {
      name: 'Jessica Martinez',
      role: 'ICU Nurse',
      initials: 'JM',
      color: 'purple'
    },
    features: ['Health Score', 'ROI Tracking', 'Smart Timeline'],
    challenges: ['3x12 hour shifts', 'Delays own care', 'Irregular schedule'],
    href: '/demo/nurse'
  },
  {
    id: 'doctor',
    persona: {
      name: 'Dr. Michael Chen',
      role: 'Emergency Physician',
      initials: 'MC',
      color: 'green'
    },
    features: ['Urgent Alerts', 'High ROI', 'Schedule Integration'],
    challenges: ['Variable shifts', 'High-stress environment', 'Overdue screenings'],
    href: '/demo/doctor'
  },
  {
    id: 'hr-admin',
    persona: {
      name: 'Sarah Williams',
      role: 'HR Benefits Director',
      initials: 'SW',
      color: 'blue'
    },
    features: ['Benefits Optimization', 'Analytics', 'ROI Reports'],
    challenges: ['412 employees', '$182K unrealized', 'Complex metrics'],
    href: '/demo/hr-admin'
  }
];

export default function DemoSelector() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {demoOptions.map((option) => (
        <Link key={option.id} href={option.href} className="block">
          <div className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-gray-200 hover:border-${option.persona.color}-300`}>
            <div className="flex items-center mb-4">
              <div className={`w-12 h-12 rounded-full bg-${option.persona.color}-500 flex items-center justify-center text-white font-bold text-lg mr-4`}>
                {option.persona.initials}
              </div>
              <div>
                <div className="font-semibold text-lg">{option.persona.name}</div>
                <div className="text-gray-600">{option.persona.role}</div>
              </div>
            </div>
            
            <div className="space-y-3 mb-4">
              {option.challenges.map((challenge, index) => (
                <div key={index} className="flex items-center text-sm text-gray-600">
                  {option.id === 'nurse' && <Heart size={16} className={`text-${option.persona.color}-500 mr-2`} />}
                  {option.id === 'doctor' && <Stethoscope size={16} className={`text-${option.persona.color}-500 mr-2`} />}
                  {option.id === 'hr-admin' && (index === 0 ? <Building size={16} className={`text-${option.persona.color}-500 mr-2`} /> : <Users size={16} className={`text-${option.persona.color}-500 mr-2`} />)}
                  <span>{challenge}</span>
                </div>
              ))}
            </div>

            <div className="text-sm text-gray-700 mb-4">
              {option.id === 'nurse' && 'Experience how BenefitMetrics helps healthcare workers prioritize their own preventative care with smart scheduling and gamified health tracking.'}
              {option.id === 'doctor' && 'See how physicians with demanding schedules can catch up on critical preventative care with urgent action alerts and flexible scheduling.'}
              {option.id === 'hr-admin' && 'Discover how HR leaders can optimize benefits utilization, track ROI, and identify opportunities to improve employee health outcomes.'}
            </div>

            <div className={`bg-${option.persona.color}-50 p-3 rounded-lg`}>
              <div className={`text-xs font-medium text-${option.persona.color}-800`}>Key Features:</div>
              <div className={`text-xs text-${option.persona.color}-700`}>
                {option.features.join(' • ')}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}