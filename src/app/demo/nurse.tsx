import { Award, Calendar, CheckCircle, FileText, Gift, Heart, Settings, TrendingUp } from 'lucide-react';
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
    red: { bg: '#fef2f2', border: '#fecaca', text: '#991b1b', accent: '#7f1d1d' },
    orange: { bg: '#fff7ed', border: '#fed7aa', text: '#9a3412', accent: '#7c2d12' }
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

export default function NurseDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentScreen, setCurrentScreen] = useState('home');

  const persona = {
    name: 'Jessica Martinez',
    role: 'ICU Nurse',
    department: 'Critical Care',
    workSchedule: '3x12 hour shifts (7am-7pm)',
    yearsOfService: '4 years',
    healthScore: 76,
    pointsEarned: 420,
    lastPhysical: 'March 2024',
    overdueCare: ['Eye Exam', 'Dental Cleaning'],
    upcomingShifts: ['Tue 7a-7p', 'Wed 7a-7p', 'Thu 7a-7p'],
    benefitsUsed: '$850 of $2,500 annual allowance',
    roiSavings: 1840,
    nextAppointment: 'Annual Physical - May 28, 2025, 10:30 AM'
  };

  const steps = [
    { title: "Meet Jessica", description: "ICU Nurse with typical healthcare worker challenges" },
    { title: "Health Score", description: "Personalized health tracking designed for shift workers" },
    { title: "Next Action", description: "AI-powered recommendations for optimal care timing" },
    { title: "ROI Tracking", description: "Personal savings from preventative care" },
    { title: "Smart Timeline", description: "Care coordination that fits work schedules" }
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
            border: currentStep === 1 ? '2px solid #3b82f6' : '1px solid #e5e7eb',
            cursor: 'pointer'
          }}
          onClick={() => handleFeatureClick(1)}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px', color: '#000' }}>
              Your Health Score
            </div>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '8px' }}>
              {persona.healthScore}
            </div>
            <div style={{ 
              fontSize: '14px', 
              color: '#10b981', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginBottom: '12px'
            }}>
              <TrendingUp size={16} style={{ marginRight: '4px' }} />
              ↑ 8 points
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
                backgroundColor: '#3b82f6', 
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
              <span>Silver Level - 1 point to Gold</span>
              <span>100</span>
            </div>
          </div>
          
          {currentStep === 1 && (
            <InsightCallout 
              type="info"
              title="Demo Insight"
              content="Jessica's score improved 8 points after completing her annual physical. The gamification keeps healthcare workers engaged with their own care."
              color="blue"
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
              border: currentStep === 3 ? '2px solid #10b981' : '1px solid #e5e7eb',
              cursor: 'pointer',
              textAlign: 'center'
            }}
            onClick={() => handleFeatureClick(3)}
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
            
            {currentStep === 3 && (
              <InsightCallout 
                type="info"
                title="Demo Insight"
                content="Shows personal savings from preventative care - early detection, avoided complications, insurance discounts."
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
              Next: Annual Physical
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.4' }}>
              May 28, 2025, 10:30 AM
            </div>
          </div>
        </div>

        {/* Recommended Next Action */}
        <div 
          style={{ 
            backgroundColor: '#fff7ed', 
            border: '2px solid #fed7aa', 
            borderRadius: '8px', 
            padding: '16px', 
            marginBottom: '24px',
            cursor: 'pointer'
          }}
          onClick={() => handleFeatureClick(2)}
        >
          <div style={{ fontSize: '16px', fontWeight: '500', color: '#9a3412', marginBottom: '8px' }}>
            Recommended Next Action
          </div>
          <div style={{ fontSize: '14px', color: '#374151', marginBottom: '12px' }}>
            Schedule your annual eye exam
          </div>
          <button style={{ 
            backgroundColor: '#2563eb', 
            color: 'white', 
            padding: '8px 24px', 
            borderRadius: '6px', 
            border: 'none',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer'
          }}>
            Schedule Now
          </button>
          
          {currentStep === 2 && (
            <InsightCallout 
              type="info"
              title="Demo Insight"
              content="AI analyzes Jessica's health data, benefits, and work schedule to recommend the most impactful next action. Eye exams are often overlooked by healthcare workers."
              color="orange"
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

        {/* Smart Timeline Banner */}
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
              <CheckCircle size={14} style={{ color: 'white' }} />
            </div>
            <div style={{ fontSize: '14px', color: '#1e40af', flex: 1 }}>
              Your care timeline has been optimized to fit your work schedule and benefit deadlines.
            </div>
          </div>
          
          {currentStep === 4 && (
            <InsightCallout 
              type="info"
              title="Demo Insight"
              content="The platform automatically coordinates appointments around Jessica's 12-hour shifts and ensures she uses benefits before they expire."
              color="blue"
            />
          )}
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
            <div style={{ fontSize: '14px', color: '#2563eb', fontWeight: '500' }}>
              3/4
            </div>
          </div>
          <div style={{ 
            height: '8px', 
            backgroundColor: '#e5e7eb', 
            borderRadius: '4px', 
            overflow: 'hidden'
          }}>
            <div style={{ 
              height: '100%', 
              backgroundColor: '#2563eb', 
              width: '75%',
              transition: 'width 0.3s ease'
            }} />
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