import { CheckCircle, Clock, DollarSign, FileText, Target, TrendingUp } from 'lucide-react';
import React, { useState } from 'react';

interface PilotConfig {
  organizationName: string;
  contactName: string;
  contactEmail: string;
  employeeCount: number;
  pilotSize: number;
  duration: number;
  startDate: string;
  departments: string[];
  goals: string[];
  successMetrics: string[];
  timeline: {
    phase: string;
    duration: string;
    activities: string[];
  }[];
}

const defaultDepartments = [
  'Nursing',
  'Emergency Medicine',
  'Surgery',
  'Internal Medicine',
  'Pediatrics',
  'ICU/Critical Care',
  'Administration',
  'Other'
];

const defaultGoals = [
  'Increase preventative care completion rates',
  'Improve benefits utilization',
  'Reduce healthcare costs',
  'Enhance employee satisfaction',
  'Demonstrate ROI',
  'Improve health outcomes'
];

const defaultMetrics = [
  'Preventative care appointment completion rate',
  'Benefits utilization percentage',
  'Employee engagement score',
  'Health score improvements',
  'Cost savings per employee',
  'Time to schedule appointments'
];

export default function PilotProgramSetup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [pilotConfig, setPilotConfig] = useState<PilotConfig>({
    organizationName: '',
    contactName: '',
    contactEmail: '',
    employeeCount: 0,
    pilotSize: 50,
    duration: 90,
    startDate: '',
    departments: [],
    goals: [],
    successMetrics: [],
    timeline: []
  });

  const updateConfig = (field: keyof PilotConfig, value: any) => {
    setPilotConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleArrayItem = (field: 'departments' | 'goals' | 'successMetrics', item: string) => {
    const currentArray = pilotConfig[field] as string[];
    const isSelected = currentArray.includes(item);
    
    if (isSelected) {
      updateConfig(field, currentArray.filter(i => i !== item));
    } else {
      updateConfig(field, [...currentArray, item]);
    }
  };

  const generateTimeline = () => {
    const timeline = [
      {
        phase: 'Setup & Onboarding',
        duration: '2 weeks',
        activities: [
          'Platform configuration and customization',
          'Integration with existing systems',
          'Admin training and setup',
          'Pilot group selection and communication'
        ]
      },
      {
        phase: 'Employee Enrollment',
        duration: '2 weeks',
        activities: [
          'Employee registration and profile setup',
          'Initial health assessments',
          'Platform walkthrough sessions',
          'Early adoption support'
        ]
      },
      {
        phase: 'Active Pilot Period',
        duration: `${pilotConfig.duration - 28} days`,
        activities: [
          'Daily platform usage and engagement',
          'Appointment scheduling and completion',
          'Weekly progress monitoring',
          'Feedback collection and platform optimization'
        ]
      },
      {
        phase: 'Analysis & Reporting',
        duration: '2 weeks',
        activities: [
          'Data analysis and ROI calculation',
          'Employee satisfaction surveys',
          'Results presentation preparation',
          'Recommendations for full deployment'
        ]
      }
    ];
    
    updateConfig('timeline', timeline);
  };

  const calculateROI = () => {
    const costPerEmployee = 40; // $40 per employee for pilot period
    const totalCost = pilotConfig.pilotSize * costPerEmployee;
    const projectedSavings = pilotConfig.pilotSize * 180; // Conservative $180 savings per employee
    const roi = ((projectedSavings - totalCost) / totalCost) * 100;
    
    return { totalCost, projectedSavings, roi };
  };

  const renderStep1 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937' }}>Organization Information</h3>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px' 
      }}>
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: '500', 
            color: '#374151', 
            marginBottom: '8px' 
          }}>
            Organization Name
          </label>
          <input
            type="text"
            value={pilotConfig.organizationName}
            onChange={(e) => updateConfig('organizationName', e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
            placeholder="e.g., Regional Medical Center"
          />
        </div>
        
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: '500', 
            color: '#374151', 
            marginBottom: '8px' 
          }}>
            Total Employee Count
          </label>
          <input
            type="number"
            value={pilotConfig.employeeCount || ''}
            onChange={(e) => updateConfig('employeeCount', parseInt(e.target.value))}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
            placeholder="e.g., 500"
          />
        </div>
        
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: '500', 
            color: '#374151', 
            marginBottom: '8px' 
          }}>
            Primary Contact Name
          </label>
          <input
            type="text"
            value={pilotConfig.contactName}
            onChange={(e) => updateConfig('contactName', e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
            placeholder="e.g., Sarah Williams"
          />
        </div>
        
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: '500', 
            color: '#374151', 
            marginBottom: '8px' 
          }}>
            Contact Email
          </label>
          <input
            type="email"
            value={pilotConfig.contactEmail}
            onChange={(e) => updateConfig('contactEmail', e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
            placeholder="e.g., sarah.williams@hospital.org"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937' }}>Pilot Configuration</h3>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px' 
      }}>
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: '500', 
            color: '#374151', 
            marginBottom: '8px' 
          }}>
            Pilot Group Size
          </label>
          <input
            type="number"
            value={pilotConfig.pilotSize}
            onChange={(e) => updateConfig('pilotSize', parseInt(e.target.value))}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
            min="25"
            max="200"
          />
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px', margin: '4px 0 0 0' }}>
            Recommended: 50-100 employees for meaningful results
          </p>
        </div>
        
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: '500', 
            color: '#374151', 
            marginBottom: '8px' 
          }}>
            Pilot Duration (days)
          </label>
          <select
            value={pilotConfig.duration}
            onChange={(e) => updateConfig('duration', parseInt(e.target.value))}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          >
            <option value={60}>60 days</option>
            <option value={90}>90 days (Recommended)</option>
            <option value={120}>120 days</option>
          </select>
        </div>
        
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: '500', 
            color: '#374151', 
            marginBottom: '8px' 
          }}>
            Preferred Start Date
          </label>
          <input
            type="date"
            value={pilotConfig.startDate}
            onChange={(e) => updateConfig('startDate', e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>
      
      <div>
        <label style={{ 
          display: 'block', 
          fontSize: '14px', 
          fontWeight: '500', 
          color: '#374151', 
          marginBottom: '12px' 
        }}>
          Target Departments
        </label>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px' 
        }}>
          {defaultDepartments.map(dept => (
            <label key={dept} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              cursor: 'pointer' 
            }}>
              <input
                type="checkbox"
                checked={pilotConfig.departments.includes(dept)}
                onChange={() => toggleArrayItem('departments', dept)}
                style={{ 
                  borderRadius: '4px',
                  border: '1px solid #d1d5db',
                  accentColor: '#2563eb'
                }}
              />
              <span style={{ fontSize: '14px', color: '#374151' }}>{dept}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937' }}>Goals & Success Metrics</h3>
      
      <div>
        <label style={{ 
          display: 'block', 
          fontSize: '14px', 
          fontWeight: '500', 
          color: '#374151', 
          marginBottom: '12px' 
        }}>
          Primary Goals (select 3-5)
        </label>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '12px' 
        }}>
          {defaultGoals.map(goal => (
            <label key={goal} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              cursor: 'pointer' 
            }}>
              <input
                type="checkbox"
                checked={pilotConfig.goals.includes(goal)}
                onChange={() => toggleArrayItem('goals', goal)}
                style={{ 
                  borderRadius: '4px',
                  border: '1px solid #d1d5db',
                  accentColor: '#2563eb'
                }}
              />
              <span style={{ fontSize: '14px', color: '#374151' }}>{goal}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div>
        <label style={{ 
          display: 'block', 
          fontSize: '14px', 
          fontWeight: '500', 
          color: '#374151', 
          marginBottom: '12px' 
        }}>
          Success Metrics (select 4-6)
        </label>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '12px' 
        }}>
          {defaultMetrics.map(metric => (
            <label key={metric} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              cursor: 'pointer' 
            }}>
              <input
                type="checkbox"
                checked={pilotConfig.successMetrics.includes(metric)}
                onChange={() => toggleArrayItem('successMetrics', metric)}
                style={{ 
                  borderRadius: '4px',
                  border: '1px solid #d1d5db',
                  accentColor: '#2563eb'
                }}
              />
              <span style={{ fontSize: '14px', color: '#374151' }}>{metric}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => {
    const { totalCost, projectedSavings, roi } = calculateROI();
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937' }}>Pilot Summary & ROI</h3>
        
        {/* ROI Overview */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px' 
        }}>
          <div style={{ 
            backgroundColor: '#eff6ff', 
            padding: '16px', 
            borderRadius: '12px', 
            border: '1px solid #bfdbfe' 
          }}>
            <DollarSign style={{ color: '#2563eb', marginBottom: '8px' }} size={24} />
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>
              ${totalCost.toLocaleString()}
            </div>
            <div style={{ fontSize: '14px', color: '#1d4ed8' }}>Pilot Investment</div>
          </div>
          <div style={{ 
            backgroundColor: '#f0fdf4', 
            padding: '16px', 
            borderRadius: '12px', 
            border: '1px solid #bbf7d0' 
          }}>
            <TrendingUp style={{ color: '#16a34a', marginBottom: '8px' }} size={24} />
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>
              ${projectedSavings.toLocaleString()}
            </div>
            <div style={{ fontSize: '14px', color: '#15803d' }}>Projected Savings</div>
          </div>
          <div style={{ 
            backgroundColor: '#faf5ff', 
            padding: '16px', 
            borderRadius: '12px', 
            border: '1px solid #e9d5ff' 
          }}>
            <Target style={{ color: '#a855f7', marginBottom: '8px' }} size={24} />
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#a855f7' }}>
              {roi.toFixed(0)}%
            </div>
            <div style={{ fontSize: '14px', color: '#9333ea' }}>Expected ROI</div>
          </div>
        </div>

        {/* Configuration Summary */}
        <div style={{ backgroundColor: '#f9fafb', padding: '24px', borderRadius: '12px' }}>
          <h4 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
            Pilot Configuration Summary
          </h4>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px' 
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <span style={{ fontWeight: '500', color: '#374151' }}>Organization:</span>
                <span style={{ marginLeft: '8px', color: '#6b7280' }}>
                  {pilotConfig.organizationName || 'Not specified'}
                </span>
              </div>
              <div>
                <span style={{ fontWeight: '500', color: '#374151' }}>Pilot Size:</span>
                <span style={{ marginLeft: '8px', color: '#6b7280' }}>
                  {pilotConfig.pilotSize} employees
                </span>
              </div>
              <div>
                <span style={{ fontWeight: '500', color: '#374151' }}>Duration:</span>
                <span style={{ marginLeft: '8px', color: '#6b7280' }}>
                  {pilotConfig.duration} days
                </span>
              </div>
              <div>
                <span style={{ fontWeight: '500', color: '#374151' }}>Start Date:</span>
                <span style={{ marginLeft: '8px', color: '#6b7280' }}>
                  {pilotConfig.startDate || 'TBD'}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <span style={{ fontWeight: '500', color: '#374151' }}>Departments:</span>
                <div style={{ marginTop: '4px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {pilotConfig.departments.map(dept => (
                    <span key={dept} style={{ 
                      padding: '4px 8px', 
                      backgroundColor: '#dbeafe', 
                      color: '#1d4ed8', 
                      fontSize: '12px', 
                      borderRadius: '4px' 
                    }}>
                      {dept}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span style={{ fontWeight: '500', color: '#374151' }}>Primary Goals:</span>
                <div style={{ marginTop: '4px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {pilotConfig.goals.slice(0, 3).map(goal => (
                    <span key={goal} style={{ 
                      padding: '4px 8px', 
                      backgroundColor: '#dcfce7', 
                      color: '#15803d', 
                      fontSize: '12px', 
                      borderRadius: '4px' 
                    }}>
                      {goal}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Implementation Timeline */}
        {pilotConfig.timeline.length > 0 && (
          <div>
            <h4 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
              Implementation Timeline
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {pilotConfig.timeline.map((phase, index) => (
                <div key={index} style={{ 
                  borderLeft: '4px solid #2563eb', 
                  paddingLeft: '16px' 
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <Clock style={{ color: '#2563eb', marginRight: '8px' }} size={16} />
                    <span style={{ fontWeight: '500', color: '#1f2937' }}>{phase.phase}</span>
                    <span style={{ marginLeft: '8px', fontSize: '14px', color: '#6b7280' }}>
                      ({phase.duration})
                    </span>
                  </div>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                    {phase.activities.map((activity, actIndex) => (
                      <li key={actIndex} style={{ 
                        fontSize: '14px', 
                        color: '#6b7280', 
                        display: 'flex', 
                        alignItems: 'flex-start',
                        marginBottom: '4px'
                      }}>
                        <CheckCircle style={{ 
                          color: '#16a34a', 
                          marginRight: '8px', 
                          marginTop: '2px',
                          flexShrink: 0
                        }} size={12} />
                        {activity}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const isStepComplete = (step: number) => {
    switch (step) {
      case 1:
        return pilotConfig.organizationName && pilotConfig.contactName && pilotConfig.contactEmail && pilotConfig.employeeCount > 0;
      case 2:
        return pilotConfig.pilotSize > 0 && pilotConfig.duration > 0 && pilotConfig.departments.length > 0;
      case 3:
        return pilotConfig.goals.length >= 3 && pilotConfig.successMetrics.length >= 4;
      default:
        return true;
    }
  };

  const canProceed = isStepComplete(currentStep);

  const handleNext = () => {
    if (currentStep === 3) {
      generateTimeline();
    }
    setCurrentStep(prev => Math.min(4, prev + 1));
  };

  const handleSubmit = () => {
    // Here you would typically send the pilot configuration to your backend
    console.log('Pilot Configuration:', pilotConfig);
    alert('Pilot program configured successfully! We will contact you within 24 hours to finalize the setup.');
  };

  return (
    <div style={{ 
      backgroundColor: 'white', 
      borderRadius: '16px', 
      boxShadow: '0 10px 15px rgba(0,0,0,0.1)', 
      padding: '24px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '1200px',
      margin: '20px auto',
      overflowY: 'auto'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 4px 0' }}>
            Pilot Program Setup
          </h2>
          <p style={{ color: '#6b7280', margin: 0 }}>Configure your BenefitMetrics pilot program</p>
        </div>
        <div style={{ fontSize: '14px', color: '#6b7280' }}>Step {currentStep} of 4</div>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {[1, 2, 3, 4].map((step) => (
            <React.Fragment key={step}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: '500',
                backgroundColor: step <= currentStep ? '#2563eb' : '#e5e7eb',
                color: step <= currentStep ? 'white' : '#6b7280'
              }}>
                {step < currentStep ? <CheckCircle size={16} /> : step}
              </div>
              {step < 4 && (
                <div style={{
                  flex: 1,
                  height: '4px',
                  margin: '0 8px',
                  backgroundColor: step < currentStep ? '#2563eb' : '#e5e7eb'
                }} />
              )}
            </React.Fragment>
          ))}
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginTop: '8px', 
          fontSize: '12px', 
          color: '#6b7280' 
        }}>
          <span>Organization</span>
          <span>Configuration</span>
          <span>Goals & Metrics</span>
          <span>Summary</span>
        </div>
      </div>

      {/* Step Content */}
      <div style={{ minHeight: '400px', marginBottom: '32px' }}>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <button
          onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
          disabled={currentStep === 1}
          style={{
            padding: '8px 24px',
            borderRadius: '8px',
            fontWeight: '500',
            border: 'none',
            cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
            backgroundColor: currentStep === 1 ? '#f3f4f6' : '#e5e7eb',
            color: currentStep === 1 ? '#9ca3af' : '#374151'
          }}
        >
          Previous
        </button>
        
        {currentStep < 4 ? (
          <button
            onClick={handleNext}
            disabled={!canProceed}
            style={{
              padding: '8px 24px',
              borderRadius: '8px',
              fontWeight: '500',
              border: 'none',
              cursor: canProceed ? 'pointer' : 'not-allowed',
              backgroundColor: canProceed ? '#2563eb' : '#f3f4f6',
              color: canProceed ? 'white' : '#9ca3af'
            }}
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            style={{
              padding: '8px 24px',
              backgroundColor: '#16a34a',
              color: 'white',
              borderRadius: '8px',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Submit Pilot Request
          </button>
        )}
      </div>

      {/* Help Text */}
      <div style={{ 
        padding: '16px', 
        backgroundColor: '#eff6ff', 
        borderRadius: '12px', 
        border: '1px solid #bfdbfe' 
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <FileText style={{ color: '#2563eb', marginRight: '8px', marginTop: '2px' }} size={16} />
          <div style={{ fontSize: '14px' }}>
            <div style={{ fontWeight: '500', color: '#1e40af' }}>Need Help?</div>
            <div style={{ color: '#1d4ed8' }}>
              Our team is ready to assist with pilot setup and configuration. 
              Contact us at pilots@benefitmetrics.com or schedule a consultation call.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}