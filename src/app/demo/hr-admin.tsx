import { Activity, AlertTriangle, BarChart, Bell, Building, Clock, DollarSign, Eye, PieChart, Users } from 'lucide-react';
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
      {persona.company}
    </div>
    <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '1px' }}>
      Managing {persona.employeeCount} employees
    </div>
    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
      Total ROI: ${persona.totalSavings.toLocaleString()}
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
        backgroundColor: currentStep === totalSteps - 1 ? '#9ca3af' : '#7c3aed',
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

const InsightCallout = ({ type, title, content, color }) => {
  const colorMap = {
    strategic: { bg: '#f3f4f6', border: '#d1d5db', text: '#374151', accent: '#1f2937' },
    purple: { bg: '#faf5ff', border: '#e9d5ff', text: '#7c3aed', accent: '#6b21a8' },
    blue: { bg: '#eff6ff', border: '#bfdbfe', text: '#1e40af', accent: '#1d4ed8' },
    green: { bg: '#f0fdf4', border: '#bbf7d0', text: '#166534', accent: '#15803d' },
    orange: { bg: '#fff7ed', border: '#fed7aa', text: '#9a3412', accent: '#7c2d12' }
  };

  const colors = colorMap[color] || colorMap.strategic;

  return (
    <div style={{
      marginTop: '16px',
      padding: '12px',
      backgroundColor: colors.bg,
      border: `1px solid ${colors.border}`,
      borderRadius: '6px',
      fontSize: '12px'
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

export default function HRAdminDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentScreen, setCurrentScreen] = useState('dashboard');

  const persona = {
    name: 'Sarah Williams',
    role: 'Benefits Director',
    department: 'Human Resources',
    company: 'Acme Corporation',
    employeeCount: 412,
    unrealizedBenefits: 182500,
    avgHealthScore: 78,
    totalSavings: 406720,
    participationRate: '328/412 employees',
    avgSavingsPerEmployee: 1240,
    absenteeismReduction: 27,
    costReduction: 16
  };

  const steps = [
    { title: "Meet Sarah", description: "HR Benefits Director managing 412 employees at Acme Corporation" },
    { title: "Full Dashboard View", description: "All three key features expanded to show complete capabilities" },
    { title: "Benefits Optimization", description: "$182,500 in unrealized benefits value - here's how to capture it" },
    { title: "Health Metrics", description: "Department performance gaps reveal targeted intervention opportunities" },
    { title: "ROI Analysis", description: "Proven $406,720 savings with specific performance metrics" },
    { title: "Preventative Care", description: "28% skin check completion represents largest improvement opportunity" }
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
        background: 'linear-gradient(to right, #7c3aed, #2563eb)', 
        color: 'white', 
        padding: '16px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px' }}>
              BenefitMetrics Admin
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ position: 'relative', marginRight: '16px' }}>
              <Bell size={24} />
              <div style={{ 
                position: 'absolute', 
                top: '-4px', 
                right: '-4px', 
                backgroundColor: '#ef4444', 
                borderRadius: '50%', 
                width: '20px', 
                height: '20px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '12px' 
              }}>
                5
              </div>
            </div>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%', 
              backgroundColor: 'white', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <Building size={24} style={{ color: '#7c3aed' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Persona Card */}
      <PersonaCard persona={persona} />
      
      {/* Main Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', paddingBottom: '32px' }}>
        {/* Dashboard Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '24px' 
        }}>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#000' }}>HR Dashboard</div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>{persona.company}</div>
          </div>
          <div style={{ 
            backgroundColor: '#f3e8ff', 
            padding: '8px 12px', 
            borderRadius: '9999px' 
          }}>
            <span style={{ color: '#7c3aed', fontWeight: '500' }}>
              {persona.employeeCount} Employees
            </span>
          </div>
        </div>

        {/* Main Dashboard Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          {/* Benefits Optimization Card */}
          <div 
            style={{ 
              backgroundColor: 'white', 
              padding: '16px', 
              borderRadius: '8px', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
              border: currentStep >= 1 ? '2px solid #7c3aed' : '1px solid #e5e7eb',
              cursor: 'pointer',
              gridColumn: currentStep >= 1 ? 'span 2' : 'span 1'
            }}
            onClick={() => handleFeatureClick(1)}
          >
            {currentStep >= 1 && (
              <div style={{ 
                backgroundColor: '#f3e8ff', 
                color: '#7c3aed', 
                fontSize: '11px', 
                padding: '2px 8px', 
                borderRadius: '4px', 
                marginBottom: '8px', 
                display: 'inline-block' 
              }}>
                NEW FEATURE
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <DollarSign style={{ color: '#7c3aed', marginRight: '8px' }} size={20} />
              <div style={{ fontWeight: '500', color: '#000' }}>Benefits Optimization</div>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#7c3aed' }}>
              ${persona.unrealizedBenefits.toLocaleString()}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Unrealized benefits value</div>
            
            {currentStep >= 1 && (
              <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#f3e8ff', borderRadius: '6px', fontSize: '14px' }}>
                <div style={{ fontWeight: '500', marginBottom: '8px', color: '#7c3aed' }}>
                  Benefits Optimization Dashboard
                </div>
                <p style={{ color: '#374151', marginBottom: '12px' }}>
                  Identify unrealized benefit value and opportunities to increase utilization.
                </p>
                
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ fontSize: '12px' }}>Benefits Utilization Rate</div>
                    <div style={{ fontSize: '12px', fontWeight: '500' }}>63%</div>
                  </div>
                  <div style={{ height: '6px', backgroundColor: '#e5e7eb', borderRadius: '3px' }}>
                    <div style={{ height: '100%', backgroundColor: '#7c3aed', borderRadius: '3px', width: '63%' }}></div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <AlertTriangle size={14} style={{ color: '#f59e0b', marginRight: '4px', marginTop: '2px', flexShrink: 0 }} />
                  <div style={{ fontSize: '12px', color: '#374151' }}>
                    Only 28% of eligible employees have completed skin cancer screenings.
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <AlertTriangle size={14} style={{ color: '#f59e0b', marginRight: '4px', marginTop: '2px', flexShrink: 0 }} />
                  <div style={{ fontSize: '12px', color: '#374151' }}>
                    Sales team has the lowest preventative care completion at 58%.
                  </div>
                </div>
                
                <button style={{ 
                  width: '100%', 
                  backgroundColor: '#7c3aed', 
                  color: 'white', 
                  padding: '6px 12px', 
                  borderRadius: '4px', 
                  border: 'none',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}>
                  <Eye size={14} style={{ marginRight: '4px' }} />
                  View Full Dashboard
                </button>

                {currentStep === 2 && (
                  <InsightCallout 
                    type="strategic"
                    title="Strategic Insight"
                    content="The $182,500 represents 37% of your total benefits budget going unused. By targeting the Sales team's 58% completion rate and addressing the skin screening gap, you could recapture $68,000 annually while improving employee health outcomes."
                    color="purple"
                  />
                )}
              </div>
            )}
          </div>
          
          {/* Health Metrics Card */}
          <div 
            style={{ 
              backgroundColor: 'white', 
              padding: '16px', 
              borderRadius: '8px', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
              border: currentStep >= 1 ? '2px solid #2563eb' : '1px solid #e5e7eb',
              cursor: 'pointer',
              gridColumn: currentStep >= 1 ? 'span 2' : 'span 1'
            }}
            onClick={() => handleFeatureClick(2)}
          >
            {currentStep >= 1 && (
              <div style={{ 
                backgroundColor: '#eff6ff', 
                color: '#2563eb', 
                fontSize: '11px', 
                padding: '2px 8px', 
                borderRadius: '4px', 
                marginBottom: '8px', 
                display: 'inline-block' 
              }}>
                NEW FEATURE
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <Activity style={{ color: '#2563eb', marginRight: '8px' }} size={20} />
              <div style={{ fontWeight: '500', color: '#000' }}>Health Metrics</div>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2563eb' }}>
              {persona.avgHealthScore}%
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Average health score</div>
            
            {currentStep >= 1 && (
              <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#eff6ff', borderRadius: '6px', fontSize: '14px' }}>
                <div style={{ fontWeight: '500', marginBottom: '8px', color: '#2563eb' }}>
                  Health Score Analytics
                </div>
                <p style={{ color: '#374151', marginBottom: '12px' }}>
                  Company-wide analytics on employee health scores and preventative care engagement.
                </p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px' }}>
                  <div style={{ backgroundColor: 'white', padding: '8px', borderRadius: '4px', border: '1px solid #bfdbfe' }}>
                    <div style={{ fontWeight: '500', color: '#2563eb', marginBottom: '4px' }}>Department Comparison</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Engineering</span>
                      <span style={{ fontWeight: '500' }}>82%</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Marketing</span>
                      <span style={{ fontWeight: '500' }}>79%</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Sales</span>
                      <span style={{ fontWeight: '500', color: '#f59e0b' }}>64%</span>
                    </div>
                  </div>
                  
                  <div style={{ backgroundColor: 'white', padding: '8px', borderRadius: '4px', border: '1px solid #bfdbfe' }}>
                    <div style={{ fontWeight: '500', color: '#2563eb', marginBottom: '4px' }}>Score Categories</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Preventative</span>
                      <span style={{ fontWeight: '500' }}>76%</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Wellness</span>
                      <span style={{ fontWeight: '500' }}>68%</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Risk Factors</span>
                      <span style={{ fontWeight: '500' }}>82%</span>
                    </div>
                  </div>
                </div>
                
                <button style={{ 
                  width: '100%', 
                  backgroundColor: '#2563eb', 
                  color: 'white', 
                  padding: '6px 12px', 
                  borderRadius: '4px', 
                  border: 'none',
                  fontSize: '12px',
                  marginTop: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}>
                  <BarChart size={14} style={{ marginRight: '4px' }} />
                  View Health Analytics
                </button>

                {currentStep === 3 && (
                  <InsightCallout 
                    type="strategic"
                    title="Strategic Insight"
                    content="The 18-point gap between Engineering (82%) and Sales (64%) indicates the need for role-specific interventions. Sales teams often have irregular schedules and high stress - targeted programs could bring them to company average, saving an estimated $45,000 annually in health costs."
                    color="blue"
                  />
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* ROI Analysis Card */}
        <div 
          style={{ 
            backgroundColor: 'white', 
            padding: '16px', 
            borderRadius: '8px', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
            marginBottom: '24px',
            border: currentStep >= 1 ? '2px solid #10b981' : '1px solid #e5e7eb',
            cursor: 'pointer'
          }}
          onClick={() => handleFeatureClick(3)}
        >
          {currentStep >= 1 && (
            <div style={{ 
              backgroundColor: '#f0fdf4', 
              color: '#10b981', 
              fontSize: '11px', 
              padding: '2px 8px', 
              borderRadius: '4px', 
              marginBottom: '8px', 
              display: 'inline-block' 
            }}>
              NEW FEATURE
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <DollarSign style={{ color: '#10b981', marginRight: '8px' }} size={20} />
              <div style={{ fontWeight: '500', color: '#000' }}>ROI Analysis</div>
            </div>
            <div style={{ color: '#10b981', fontWeight: 'bold', fontSize: '24px' }}>
              ${persona.totalSavings.toLocaleString()}
            </div>
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
            Total company healthcare savings
          </div>
          
          {currentStep >= 1 && (
            <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#f0fdf4', borderRadius: '6px', fontSize: '14px' }}>
              <div style={{ fontWeight: '500', marginBottom: '4px', color: '#10b981' }}>
                Healthcare ROI Report
              </div>
              <p style={{ color: '#374151', marginBottom: '12px' }}>
                Financial impact analysis of your company's preventative healthcare program.
              </p>
              
              <div style={{ fontSize: '12px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <div>Program Participation</div>
                  <div style={{ fontWeight: '500' }}>{persona.participationRate}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <div>Average Savings Per Employee</div>
                  <div style={{ fontWeight: '500' }}>${persona.avgSavingsPerEmployee.toLocaleString()}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <div>Reduced Absenteeism</div>
                  <div style={{ fontWeight: '500' }}>{persona.absenteeismReduction}%</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>Healthcare Cost Reduction</div>
                  <div style={{ fontWeight: '500' }}>{persona.costReduction}%</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{ 
                  flex: 1, 
                  backgroundColor: '#10b981', 
                  color: 'white', 
                  padding: '6px 12px', 
                  borderRadius: '4px', 
                  border: 'none',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}>
                  <PieChart size={14} style={{ marginRight: '4px' }} />
                  View Report
                </button>
                <button style={{ 
                  flex: 1, 
                  border: '1px solid #10b981', 
                  color: '#10b981', 
                  backgroundColor: 'white',
                  padding: '6px 12px', 
                  borderRadius: '4px', 
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}>
                  <Clock size={14} style={{ marginRight: '4px' }} />
                  Schedule Report
                </button>
              </div>

              {currentStep === 4 && (
                <InsightCallout 
                  type="strategic"
                  title="Strategic Insight"
                  content="The $406,720 represents a 3.2:1 ROI on your preventative care investment. With 328 of 412 employees participating, you're missing potential savings from 84 employees. Full participation could increase total savings to $515,000 annually - a compelling case for expanded program promotion."
                  color="green"
                />
              )}
            </div>
          )}
        </div>
        
        {/* Preventative Care Completion */}
        <div 
          style={{ 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
            border: currentStep === 5 ? '2px solid #3b82f6' : '1px solid #e5e7eb',
            padding: '16px', 
            marginBottom: '24px',
            cursor: 'pointer'
          }}
          onClick={() => handleFeatureClick(5)}
        >
          <div style={{ fontWeight: '500', marginBottom: '12px', color: '#000' }}>
            Preventative Care Completion
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <div style={{ fontSize: '14px' }}>Annual Physicals</div>
                <div style={{ fontSize: '14px', fontWeight: '500' }}>78%</div>
              </div>
              <div style={{ height: '6px', backgroundColor: '#e5e7eb', borderRadius: '3px' }}>
                <div style={{ height: '100%', backgroundColor: '#2563eb', borderRadius: '3px', width: '78%' }}></div>
              </div>
            </div>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <div style={{ fontSize: '14px' }}>Dental Checkups</div>
                <div style={{ fontSize: '14px', fontWeight: '500' }}>65%</div>
              </div>
              <div style={{ height: '6px', backgroundColor: '#e5e7eb', borderRadius: '3px' }}>
                <div style={{ height: '100%', backgroundColor: '#10b981', borderRadius: '3px', width: '65%' }}></div>
              </div>
            </div>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <div style={{ fontSize: '14px' }}>Eye Exams</div>
                <div style={{ fontSize: '14px', fontWeight: '500' }}>42%</div>
              </div>
              <div style={{ height: '6px', backgroundColor: '#e5e7eb', borderRadius: '3px' }}>
                <div style={{ height: '100%', backgroundColor: '#f59e0b', borderRadius: '3px', width: '42%' }}></div>
              </div>
            </div>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <div style={{ fontSize: '14px' }}>Skin Checks</div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#ef4444' }}>28%</div>
              </div>
              <div style={{ height: '6px', backgroundColor: '#e5e7eb', borderRadius: '3px' }}>
                <div style={{ height: '100%', backgroundColor: '#ef4444', borderRadius: '3px', width: '28%' }}></div>
              </div>
            </div>
          </div>
          
          {currentStep === 5 && (
            <InsightCallout 
              type="strategic"
              title="Strategic Insight"
              content="The 28% skin check completion rate represents your biggest opportunity. Dermatology screenings have the highest early detection value - bringing this to 65% (matching dental) would save an estimated $95,000 annually and potentially save lives through early cancer detection."
              color="orange"
            />
          )}
        </div>
        
        {/* Quick Actions */}
        <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: '#000' }}>
          Quick Actions
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            padding: '12px', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer'
          }}>
            <Users style={{ color: '#7c3aed', marginBottom: '8px' }} size={24} />
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#000' }}>Create Challenge</div>
          </div>
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            padding: '12px', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer'
          }}>
            <Bell style={{ color: '#7c3aed', marginBottom: '8px' }} size={24} />
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#000' }}>Send Reminder</div>
          </div>
        </div>
      </div>
      
      {/* Footer Navigation */}
      <div style={{ 
        backgroundColor: '#f3f4f6', 
        borderTop: '1px solid #e5e7eb', 
        display: 'flex', 
        justifyContent: 'space-around',
        padding: '12px 0'
      }}>
        {[
          { icon: PieChart, label: 'Dashboard', screen: 'dashboard' },
          { icon: BarChart, label: 'Analytics', screen: 'analytics' },
          { icon: Users, label: 'Programs', screen: 'programs' },
          { icon: Bell, label: 'Notify', screen: 'notify' },
          { icon: null, label: 'More', screen: 'more' }
        ].map((item, index) => (
          <button
            key={index}
            onClick={() => setCurrentScreen(item.screen)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '4px 8px',
              backgroundColor: 'transparent',
              color: currentScreen === item.screen ? '#7c3aed' : '#6b7280',
              border: 'none',
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