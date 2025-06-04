import { AlertTriangle, Award, Calendar, CheckCircle, FileText, Gift, Heart, Info, Settings } from 'lucide-react';
import React, { useState } from 'react';

// Simplified mock components to match original
const DemoHeader = ({ currentStep, totalSteps, steps }) => (
  <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '12px 16px' }}>
    <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '2px' }}>
      Demo: {steps[currentStep]?.title}
    </div>
    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
      Step {currentStep + 1} of {totalSteps}
    </div>
    <div style={{ fontSize: '12px', color: '#2563eb' }}>
      {steps[currentStep]?.description}
    </div>
  </div>
);

const PersonaCard = ({ persona }) => (
  <div style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '12px 16px' }}>
    <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '2px' }}>
      {persona.name}
    </div>
    <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '1px' }}>
      {persona.role} • {persona.department}
    </div>
    <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '1px' }}>
      {persona.workSchedule}
    </div>
    <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '1px' }}>
      {persona.yearsOfService}
    </div>
    <div style={{ fontSize: '12px', color: '#9ca3af' }}>
      Next: {persona.upcomingShifts[0]}
    </div>
    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
      {persona.benefitsUsed}
    </div>
  </div>
);

const DemoControls = ({ currentStep, totalSteps, onPrevious, onNext }) => (
  <div style={{ 
    backgroundColor: 'white', 
    borderTop: '1px solid #e5e7eb', 
    padding: '12px 16px', 
    display: 'flex', 
    justifyContent: 'space-between',
    minHeight: '60px',
    alignItems: 'center'
  }}>
    <button 
      onClick={onPrevious} 
      disabled={currentStep === 0}
      style={{
        padding: '8px 16px',
        backgroundColor: currentStep === 0 ? '#f3f4f6' : '#e5e7eb',
        border: 'none',
        borderRadius: '6px',
        fontSize: '14px',
        cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
        opacity: currentStep === 0 ? 0.5 : 1
      }}
    >
      Previous
    </button>
    <span style={{ fontSize: '12px', color: '#6b7280' }}>
      {currentStep + 1} of {totalSteps}
    </span>
    <button 
      onClick={onNext} 
      disabled={currentStep === totalSteps - 1}
      style={{
        padding: '8px 16px',
        backgroundColor: currentStep === totalSteps - 1 ? '#9ca3af' : '#2563eb',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '14px',
        cursor: currentStep === totalSteps - 1 ? 'not-allowed' : 'pointer',
        opacity: currentStep === totalSteps - 1 ? 0.5 : 1
      }}
    >
      Next
    </button>
  </div>
);

const InsightCallout = ({ type, title, content, color, size = "normal" }) => {
  const colorMap = {
    warning: { bg: '#fef2f2', border: '#fecaca', text: '#991b1b', accent: '#7f1d1d' },
    info: { bg: '#eff6ff', border: '#bfdbfe', text: '#1e40af', accent: '#1d4ed8' },
    urgent: { bg: '#fef2f2', border: '#fecaca', text: '#991b1b', accent: '#7f1d1d' },
    green: { bg: '#f0fdf4', border: '#bbf7d0', text: '#166534', accent: '#15803d' },
    blue: { bg: '#eff6ff', border: '#bfdbfe', text: '#1e40af', accent: '#1d4ed8' },
    red: { bg: '#fef2f2', border: '#fecaca', text: '#991b1b', accent: '#7f1d1d' }
  };

  const colors = colorMap[color] || colorMap.info;
  const isSmall = size === "small";

  return (
    <div style={{
      marginTop: isSmall ? '8px' : '16px',
      padding: isSmall ? '8px' : '12px',
      backgroundColor: colors.bg,
      border: `1px solid ${colors.border}`,
      borderRadius: '6px',
      fontSize: isSmall ? '11px' : '12px'
    }}>
      <div style={{
        fontWeight: '500',
        color: colors.text,
        marginBottom: '4px'
      }}>
        {title}
      </div>
      <div style={{ color: colors.accent }}>
        {content}
      </div>
    </div>
  );
};

export default function DoctorDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentScreen, setCurrentScreen] = useState('home');

  const persona = {
    name: 'Dr. Michael Chen',
    role: 'Emergency Physician',
    department: 'Emergency Medicine',
    workSchedule: 'Variable shifts (7a-7p / 7p-7a)',
    yearsOfService: '8 years',
    healthScore: 68,
    pointsEarned: 290,
    lastPhysical: 'January 2024',
    overdueCare: ['Colonoscopy', 'Cardiac Stress Test'],
    upcomingShifts: ['Mon 7p-7a', 'Thu 7p-7a', 'Sat 7a-7p'],
    benefitsUsed: '$1,240 of $3,200 annual allowance',
    roiSavings: 3150,
    nextAppointment: 'Dermatology Check - June 12, 2025, 2:00 PM'
  };

  const steps = [
    { title: "Meet Dr. Chen", description: "Emergency physician with demanding schedule and health challenges" },
    { title: "Health Score Alert", description: "Score showing impact of missed preventative care" },
    { title: "ROI Impact", description: "Significant savings potential for high earners" },
    { title: "Urgent Action", description: "High-priority recommendations for busy physicians" },
    { title: "Schedule Integration", description: "Smart coordination around unpredictable ER shifts" }
  ];

  const handleFeatureClick = (stepIndex) => {
    if (currentStep < stepIndex) setCurrentStep(stepIndex);
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh', 
      maxWidth: '400px', 
      margin: '0 auto',
      backgroundColor: '#f9fafb',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <DemoHeader currentStep={currentStep} totalSteps={steps.length} steps={steps} />
      
      {/* App Header */}
      <div style={{ 
        background: 'linear-gradient(to right, #3b82f6, #2563eb)', 
        color: 'white', 
        padding: '16px', 
        textAlign: 'center' 
      }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>BenefitMetrics</div>
      </div>

      {/* Persona Card */}
      <PersonaCard persona={persona} />
      
      {/* Main Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', paddingBottom: '32px' }}>
        {/* Welcome Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '24px' 
        }}>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px', color: '#000' }}>
              Hi, there!
            </div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>
              Let's stay on top of your health
            </div>
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            backgroundColor: '#dbeafe', 
            padding: '8px 12px', 
            borderRadius: '9999px' 
          }}>
            <Award size={18} style={{ color: '#2563eb', marginRight: '4px' }} />
            <span style={{ color: '#2563eb', fontWeight: '500' }}>
              {persona.pointsEarned} pts
            </span>
          </div>
        </div>

        {/* Health Score Card */}
        <div 
          style={{ 
            backgroundColor: 'white', 
            padding: '24px', 
            borderRadius: '8px', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
            marginBottom: '16px',
            border: currentStep === 1 ? '2px solid #ef4444' : '1px solid #e5e7eb',
            cursor: 'pointer'
          }}
          onClick={() => handleFeatureClick(1)}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px', color: '#000' }}>
              Your Health Score
            </div>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#ef4444', marginBottom: '8px' }}>
              {persona.healthScore}
            </div>
            <div style={{ 
              fontSize: '14px', 
              color: '#ef4444', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginBottom: '12px'
            }}>
              <AlertTriangle size={16} style={{ marginRight: '4px' }} />
              ↓ 12 points
            </div>
            <div style={{ 
              height: '8px', 
              backgroundColor: '#e5e7eb', 
              borderRadius: '4px', 
              overflow: 'hidden',
              marginBottom: '8px'
            }}>
              <div style={{ 
                height: '100%', 
                backgroundColor: '#ef4444', 
                width: `${persona.healthScore}%`,
                transition: 'width 0.3s ease'
              }} />
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              fontSize: '12px', 
              color: '#6b7280' 
            }}>
              <span>0</span>
              <span>Bronze Level - 12 points to Silver</span>
              <span>100</span>
            </div>
          </div>
          
          {currentStep === 1 && (
            <InsightCallout 
              type="warning"
              title="Demo Insight"
              content="Dr. Chen's score dropped 12 points due to overdue colonoscopy and cardiac screening. High-stress jobs often correlate with delayed preventative care."
              color="red"
            />
          )}
        </div>

        {/* ROI and Next Appointment Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '12px', 
          marginBottom: '16px' 
        }}>
          {/* ROI Card */}
          <div 
            style={{ 
              backgroundColor: 'white', 
              padding: '16px', 
              borderRadius: '8px', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: currentStep === 2 ? '2px solid #10b981' : '1px solid #e5e7eb',
              cursor: 'pointer',
              textAlign: 'center'
            }}
            onClick={() => handleFeatureClick(2)}
          >
            <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#000' }}>
              ROI
            </div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981' }}>
              ${persona.roiSavings.toLocaleString()}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              Savings
            </div>
            
            {currentStep === 2 && (
              <InsightCallout 
                type="info"
                title="Demo Insight"
                content="Higher earners like Dr. Chen have greater savings potential. Early detection of cardiovascular issues alone could save $50K+."
                color="green"
                size="small"
              />
            )}
          </div>

          {/* Next Appointment Card */}
          <div style={{ 
            backgroundColor: 'white', 
            padding: '16px', 
            borderRadius: '8px', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#000' }}>
              Next: Dermatology Check
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.4' }}>
              June 12, 2025, 2:00 PM
            </div>
          </div>
        </div>

        {/* Care Timeline Banner */}
        <div 
          style={{ 
            backgroundColor: '#eff6ff', 
            border: '1px solid #bfdbfe', 
            borderRadius: '8px', 
            padding: '16px', 
            marginBottom: '24px',
            cursor: 'pointer'
          }}
          onClick={() => handleFeatureClick(4)}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{ 
              width: '24px', 
              height: '24px', 
              borderRadius: '50%', 
              backgroundColor: '#2563eb', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginRight: '12px',
              flexShrink: 0
            }}>
              <Info size={14} style={{ color: 'white' }} />
            </div>
            <div style={{ fontSize: '14px', color: '#1e40af', flex: 1 }}>
              Your care timeline has been optimized to fit your work schedule and benefit deadlines.
            </div>
          </div>
          
          {currentStep === 4 && (
            <InsightCallout 
              type="info"
              title="Demo Insight"
              content="The platform accounts for Dr. Chen's unpredictable ER schedule, finding appointments during planned time off and coordinating around on-call periods."
              color="blue"
            />
          )}
        </div>

        {/* Urgent Action */}
        <div 
          style={{ 
            backgroundColor: '#fef2f2', 
            border: '2px solid #fecaca', 
            borderRadius: '8px', 
            padding: '16px', 
            marginBottom: '24px',
            cursor: 'pointer'
          }}
          onClick={() => handleFeatureClick(3)}
        >
          <div style={{ fontSize: '16px', fontWeight: '500', color: '#991b1b', marginBottom: '8px' }}>
            Urgent Action Required
          </div>
          <div style={{ fontSize: '14px', color: '#374151', marginBottom: '12px' }}>
            Schedule overdue colonoscopy screening
          </div>
          <button style={{ 
            backgroundColor: '#dc2626', 
            color: 'white', 
            padding: '8px 16px', 
            borderRadius: '6px', 
            border: 'none',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer'
          }}>
            Schedule Now
          </button>
          
          {currentStep === 3 && (
            <InsightCallout 
              type="urgent"
              title="Demo Insight"
              content="At 50+, Dr. Chen's colonoscopy is 18 months overdue. The platform flags urgent care based on age, family history, and professional stress factors."
              color="red"
            />
          )}
        </div>

        {/* Quick Actions */}
        <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#000' }}>
          Quick Actions
        </div>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '12px', 
          marginBottom: '24px' 
        }}>
          {[
            { icon: Calendar, label: 'Schedule Appointment' },
            { icon: CheckCircle, label: 'Checkup Timeline' },
            { icon: Gift, label: 'Redeem Rewards' },
            { icon: FileText, label: 'Wellness Tips' }
          ].map((item, index) => (
            <div 
              key={index}
              style={{ 
                backgroundColor: 'white', 
                padding: '16px', 
                borderRadius: '8px', 
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer'
              }}
            >
              <item.icon size={24} style={{ color: '#2563eb', marginBottom: '8px' }} />
              <div style={{ fontSize: '14px', fontWeight: '500', textAlign: 'center', color: '#000' }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>

        {/* Health Goals */}
        <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#000' }}>
          Health Goals
        </div>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '16px', 
          borderRadius: '8px', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '12px' 
          }}>
            <div style={{ fontSize: '16px', fontWeight: '500', color: '#000' }}>
              Annual Checkup Progress
            </div>
            <div style={{ fontSize: '14px', color: '#ef4444', fontWeight: '500' }}>
              1/5
            </div>
          </div>
          <div style={{ 
            height: '8px', 
            backgroundColor: '#e5e7eb', 
            borderRadius: '4px', 
            overflow: 'hidden',
            marginBottom: '8px'
          }}>
            <div style={{ 
              height: '100%', 
              backgroundColor: '#ef4444', 
              width: '20%',
              transition: 'width 0.3s ease'
            }} />
          </div>
          <div style={{ fontSize: '12px', color: '#ef4444' }}>
            Behind schedule - 4 screenings overdue
          </div>
        </div>
      </div>
      
      {/* Footer Navigation */}
      <div style={{ 
        backgroundColor: 'white', 
        borderTop: '1px solid #e5e7eb', 
        display: 'flex', 
        justifyContent: 'space-around',
        padding: '8px 0'
      }}>
        {[
          { icon: Heart, label: 'Home', screen: 'home' },
          { icon: Calendar, label: 'Appointments', screen: 'appointments' },
          { icon: Award, label: 'Challenges', screen: 'challenges' },
          { icon: Settings, label: 'Settings', screen: 'settings' },
          { icon: null, label: 'More', screen: 'more' }
        ].map((item, index) => (
          <button
            key={index}
            onClick={() => setCurrentScreen(item.screen)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '8px 12px',
              backgroundColor: currentScreen === item.screen ? '#eff6ff' : 'transparent',
              color: currentScreen === item.screen ? '#2563eb' : '#6b7280',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            {item.icon ? (
              <item.icon size={20} />
            ) : (
              <div style={{ fontSize: '16px', height: '20px', display: 'flex', alignItems: 'center' }}>
                •••
              </div>
            )}
            <div style={{ marginTop: '2px' }}>{item.label}</div>
          </button>
        ))}
      </div>

      {/* Demo Controls */}
      <DemoControls 
        currentStep={currentStep}
        totalSteps={steps.length}
        onPrevious={() => setCurrentStep(Math.max(0, currentStep - 1))}
        onNext={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
      />
    </div>
  );
}