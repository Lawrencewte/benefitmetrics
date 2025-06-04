import { AlertTriangle, ArrowLeft, Building, CheckCircle, DollarSign, Heart, Stethoscope, TrendingUp } from 'lucide-react';
import React, { useState } from 'react';

export default function ComparisonDemo() {
  const [selectedPersona, setSelectedPersona] = useState('all');

  const personas = {
    nurse: {
      name: 'Jessica Martinez',
      role: 'ICU Nurse',
      healthScore: 76,
      trend: '+8',
      roiSavings: 1840,
      status: 'improving',
      primaryChallenge: 'Shift schedule conflicts with appointment availability',
      keyFeature: 'Smart Timeline',
      color: '#a855f7',
      bgColor: '#faf5ff'
    },
    doctor: {
      name: 'Dr. Michael Chen',
      role: 'Emergency Physician',
      healthScore: 68,
      trend: '-12',
      roiSavings: 3150,
      status: 'at-risk',
      primaryChallenge: 'Multiple overdue preventative screenings',
      keyFeature: 'Urgent Action Alerts',
      color: '#059669',
      bgColor: '#f0fdf4'
    },
    hrAdmin: {
      name: 'Sarah Williams',
      role: 'HR Benefits Director',
      healthScore: 78,
      trend: 'Company Avg',
      roiSavings: 406720,
      status: 'optimizing',
      primaryChallenge: '$182,500 in unrealized benefits value across organization',
      keyFeature: 'Benefits Optimization Dashboard',
      color: '#2563eb',
      bgColor: '#eff6ff'
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'at-risk': return { bg: '#fef2f2', text: '#dc2626' };
      case 'improving': return { bg: '#f0fdf4', text: '#16a34a' };
      case 'optimizing': return { bg: '#eff6ff', text: '#2563eb' };
      default: return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  return (
    <div style={{ 
      background: 'linear-gradient(to bottom right, #eff6ff, #faf5ff)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      minHeight: '100vh',
      overflowY: 'auto',
      paddingBottom: '40px'
    }}>
      {/* Header */}
      <div style={{ 
        background: 'linear-gradient(to right, #2563eb, #7c3aed)', 
        color: 'white', 
        padding: '24px' 
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                window.history.back();
              }}
              style={{ 
                marginRight: '16px', 
                textDecoration: 'none', 
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                padding: '4px',
                borderRadius: '4px',
                transition: 'background-color 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <ArrowLeft size={24} />
            </a>
            <div>
              <div style={{ fontSize: '28px', fontWeight: 'bold' }}>BenefitMetrics Comparison</div>
              <div style={{ color: '#bfdbfe' }}>See how our platform addresses different healthcare worker challenges</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px', paddingBottom: '60px' }}>
        {/* Persona Selector */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '12px', 
            boxShadow: '0 10px 15px rgba(0,0,0,0.1)', 
            padding: '8px', 
            display: 'flex', 
            gap: '8px' 
          }}>
            {[
              { key: 'all', label: 'All Personas', color: '#2563eb' },
              { key: 'nurse', label: 'Jessica (Nurse)', color: '#a855f7' },
              { key: 'doctor', label: 'Dr. Chen', color: '#059669' },
              { key: 'hrAdmin', label: 'Sarah (HR)', color: '#2563eb' }
            ].map(({ key, label, color }) => (
              <button 
                key={key}
                onClick={() => setSelectedPersona(key)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  backgroundColor: selectedPersona === key ? color : 'transparent',
                  color: selectedPersona === key ? 'white' : '#6b7280'
                }}
                onMouseEnter={(e) => {
                  if (selectedPersona !== key) {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedPersona !== key) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Comparison Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '24px', 
          marginBottom: '32px' 
        }}>
          {Object.entries(personas).map(([key, persona]) => {
            if (selectedPersona !== 'all' && selectedPersona !== key) return null;
            
            const statusColors = getStatusColor(persona.status);
            
            return (
              <div key={key} style={{ 
                backgroundColor: 'white', 
                borderRadius: '16px', 
                boxShadow: '0 10px 15px rgba(0,0,0,0.1)', 
                padding: '24px', 
                border: '1px solid #e5e7eb' 
              }}>
                {/* Persona Header */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '50%', 
                    backgroundColor: persona.color, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    color: 'white', 
                    fontWeight: 'bold', 
                    fontSize: '18px', 
                    marginRight: '16px'
                  }}>
                    {persona.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '18px' }}>{persona.name}</div>
                    <div style={{ color: '#6b7280' }}>{persona.role}</div>
                  </div>
                </div>

                {/* Key Metrics */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Health Score</span>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ 
                        fontSize: '24px', 
                        fontWeight: 'bold', 
                        color: persona.status === 'at-risk' ? '#dc2626' : 
                               persona.status === 'improving' ? '#2563eb' : '#374151'
                      }}>
                        {persona.healthScore}
                      </span>
                      {persona.trend !== 'Company Avg' && (
                        <span style={{ 
                          fontSize: '14px', 
                          marginLeft: '8px',
                          color: persona.trend.includes('+') ? '#16a34a' : '#dc2626'
                        }}>
                          {persona.trend}
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>ROI Savings</span>
                    <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#16a34a' }}>
                      ${persona.roiSavings.toLocaleString()}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Status</span>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '16px', 
                      fontSize: '12px', 
                      fontWeight: '500',
                      backgroundColor: statusColors.bg,
                      color: statusColors.text
                    }}>
                      {persona.status === 'at-risk' ? 'At Risk' : 
                       persona.status === 'improving' ? 'Improving' : 'Optimizing'}
                    </span>
                  </div>
                </div>

                {/* Primary Challenge */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Primary Challenge
                  </div>
                  <div style={{ 
                    fontSize: '14px', 
                    color: '#6b7280', 
                    backgroundColor: '#f9fafb', 
                    padding: '12px', 
                    borderRadius: '8px' 
                  }}>
                    {persona.primaryChallenge}
                  </div>
                </div>

                {/* Key Feature */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Key Feature
                  </div>
                  <div style={{ 
                    fontSize: '14px', 
                    backgroundColor: persona.bgColor, 
                    color: persona.color, 
                    padding: '12px', 
                    borderRadius: '8px', 
                    fontWeight: '500' 
                  }}>
                    {persona.keyFeature}
                  </div>
                </div>

                {/* Demo Link */}
                <button 
                  onClick={() => {
                    // Simulate navigation - in real app this would use proper routing
                    alert(`Opening ${persona.name.split(' ')[0]}'s demo...`);
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    backgroundColor: persona.color,
                    color: 'white',
                    textAlign: 'center',
                    padding: '12px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: '500',
                    transition: 'opacity 0.3s',
                    boxSizing: 'border-box',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  View {persona.name.split(' ')[0]}'s Demo
                </button>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison Table */}
        <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 10px 15px rgba(0,0,0,0.1)', overflow: 'hidden', marginBottom: '32px' }}>
          <div style={{ backgroundColor: '#f9fafb', padding: '16px', borderBottom: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Feature Comparison</h3>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f9fafb' }}>
                <tr>
                  <th style={{ textAlign: 'left', padding: '16px', fontWeight: '500', color: '#374151' }}>Feature</th>
                  <th style={{ textAlign: 'center', padding: '16px', fontWeight: '500', color: '#a855f7' }}>Jessica (Nurse)</th>
                  <th style={{ textAlign: 'center', padding: '16px', fontWeight: '500', color: '#059669' }}>Dr. Chen</th>
                  <th style={{ textAlign: 'center', padding: '16px', fontWeight: '500', color: '#2563eb' }}>Sarah (HR)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Health Score Tracking', nurse: 'check', doctor: 'warning', hr: 'trend' },
                  { feature: 'Smart Scheduling', nurse: 'check', doctor: 'check', hr: 'none' },
                  { feature: 'ROI Tracking', nurse: 'dollar', doctor: 'dollar', hr: 'dollar' },
                  { feature: 'Urgent Alerts', nurse: 'none', doctor: 'warning', hr: 'none' },
                  { feature: 'Benefits Optimization', nurse: 'none', doctor: 'none', hr: 'check' },
                  { feature: 'Analytics Dashboard', nurse: 'none', doctor: 'none', hr: 'check' }
                ].map((row, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '16px', fontWeight: '500', color: '#374151' }}>{row.feature}</td>
                    <td style={{ textAlign: 'center', padding: '16px' }}>
                      {row.nurse === 'check' && <CheckCircle color="#16a34a" size={20} />}
                      {row.nurse === 'warning' && <AlertTriangle color="#dc2626" size={20} />}
                      {row.nurse === 'dollar' && <DollarSign color="#16a34a" size={20} />}
                      {row.nurse === 'trend' && <TrendingUp color="#2563eb" size={20} />}
                      {row.nurse === 'none' && '-'}
                    </td>
                    <td style={{ textAlign: 'center', padding: '16px' }}>
                      {row.doctor === 'check' && <CheckCircle color="#16a34a" size={20} />}
                      {row.doctor === 'warning' && <AlertTriangle color="#dc2626" size={20} />}
                      {row.doctor === 'dollar' && <DollarSign color="#16a34a" size={20} />}
                      {row.doctor === 'trend' && <TrendingUp color="#2563eb" size={20} />}
                      {row.doctor === 'none' && '-'}
                    </td>
                    <td style={{ textAlign: 'center', padding: '16px' }}>
                      {row.hr === 'check' && <CheckCircle color="#16a34a" size={20} />}
                      {row.hr === 'warning' && <AlertTriangle color="#dc2626" size={20} />}
                      {row.hr === 'dollar' && <DollarSign color="#16a34a" size={20} />}
                      {row.hr === 'trend' && <TrendingUp color="#2563eb" size={20} />}
                      {row.hr === 'none' && '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Key Insights */}
        <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 10px 15px rgba(0,0,0,0.1)', padding: '24px', marginBottom: '32px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>Key Insights</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px' 
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                backgroundColor: '#faf5ff', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 12px' 
              }}>
                <Heart color="#a855f7" size={24} />
              </div>
              <h4 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>Healthcare Workers</h4>
              <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5' }}>
                Need mobile-first solutions that work around demanding shift schedules and provide 
                personal motivation to prioritize their own health.
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                backgroundColor: '#f0fdf4', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 12px' 
              }}>
                <Stethoscope color="#059669" size={24} />
              </div>
              <h4 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>Physicians</h4>
              <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5' }}>
                Require urgent intervention alerts and high-value ROI tracking due to irregular 
                schedules and tendency to delay personal healthcare.
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                backgroundColor: '#eff6ff', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 12px' 
              }}>
                <Building color="#2563eb" size={24} />
              </div>
              <h4 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>HR Leaders</h4>
              <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5' }}>
                Need comprehensive analytics and optimization tools to maximize benefits 
                utilization and demonstrate ROI to executive leadership.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            background: 'linear-gradient(to right, #2563eb, #7c3aed)', 
            color: 'white', 
            borderRadius: '16px', 
            padding: '32px' 
          }}>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Ready to Transform Your Organization?</h3>
            <p style={{ 
              color: '#bfdbfe', 
              marginBottom: '24px', 
              maxWidth: '600px', 
              margin: '0 auto 24px',
              lineHeight: '1.6'
            }}>
              See how BenefitMetrics can address the unique challenges in your healthcare organization. 
              Our platform adapts to different roles while maintaining a unified approach to preventative care.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <button style={{
                backgroundColor: 'white',
                color: '#2563eb',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: '500',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                Schedule Live Demo
              </button>
              <button style={{
                border: '2px solid white',
                color: 'white',
                backgroundColor: 'transparent',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Download Comparison Guide
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}