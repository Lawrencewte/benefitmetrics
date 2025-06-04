import { Building, Heart, Stethoscope, Users } from 'lucide-react';
import React from 'react';

export default function DemoIndex() {
  const demoCards = [
    {
      id: 'nurse',
      href: '/demo/nurse',
      avatar: 'JM',
      name: 'Jessica Martinez',
      role: 'ICU Nurse',
      color: '#a855f7',
      bgColor: '#faf5ff',
      features: [
        { icon: Heart, text: '3x12 hour shifts, irregular schedule' },
        { icon: Stethoscope, text: 'Delays own care while caring for others' }
      ],
      description: 'Experience how BenefitMetrics helps healthcare workers prioritize their own preventative care with smart scheduling and gamified health tracking.',
      keyFeatures: 'Health Score • ROI Tracking • Smart Timeline'
    },
    {
      id: 'doctor',
      href: '/demo/doctor',
      avatar: 'MC',
      name: 'Dr. Michael Chen',
      role: 'Emergency Physician',
      color: '#059669',
      bgColor: '#f0fdf4',
      features: [
        { icon: Heart, text: 'Variable shifts, high-stress environment' },
        { icon: Stethoscope, text: 'Multiple overdue screenings' }
      ],
      description: 'See how physicians with demanding schedules can catch up on critical preventative care with urgent action alerts and flexible scheduling.',
      keyFeatures: 'Urgent Alerts • High ROI • Schedule Integration'
    },
    {
      id: 'hr-admin',
      href: '/demo/hr-admin',
      avatar: 'SW',
      name: 'Sarah Williams',
      role: 'HR Benefits Director',
      color: '#2563eb',
      bgColor: '#eff6ff',
      features: [
        { icon: Building, text: 'Manages 412 employees' },
        { icon: Users, text: '$182K in unrealized benefits' }
      ],
      description: 'Discover how HR leaders can optimize benefits utilization, track ROI, and identify opportunities to improve employee health outcomes.',
      keyFeatures: 'Benefits Optimization • Analytics • ROI Reports'
    }
  ];

  return (
    <>
      {/* Header */}
      <div style={{ 
        background: 'linear-gradient(to right, #2563eb, #7c3aed)', 
        color: 'white', 
        padding: '24px 20px'
      }}>
        <div style={{ maxWidth: '1024px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '6px' }}>
            BenefitMetrics
          </div>
          <div style={{ fontSize: '16px', marginBottom: '8px' }}>
            Interactive Demo Experience
          </div>
          <div style={{ color: '#bfdbfe', fontSize: '14px' }}>
            See how our platform transforms preventative healthcare for different roles
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ 
        background: 'linear-gradient(to bottom right, #eff6ff, #faf5ff)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '30px 20px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Title Section */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#1f2937', 
              margin: '0 0 12px 0'
            }}>
              Choose Your Demo Experience
            </h2>
            <p style={{ 
              fontSize: '16px', 
              color: '#6b7280', 
              maxWidth: '600px', 
              margin: '0 auto',
              lineHeight: '1.5'
            }}>
              Experience BenefitMetrics from different perspectives. Each demo showcases 
              role-specific challenges and how our platform addresses them.
            </p>
          </div>

          {/* Demo Cards Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '20px', 
            marginBottom: '40px'
          }}>
            {demoCards.map((demo) => (
              <a 
                key={demo.id}
                href={demo.href} 
                style={{ 
                  display: 'block', 
                  textDecoration: 'none', 
                  color: 'inherit'
                }}
              >
                <div 
                  style={{ 
                    backgroundColor: 'white', 
                    borderRadius: '16px', 
                    boxShadow: '0 4px 6px rgba(0,0,0,0.07)', 
                    padding: '20px', 
                    border: '1px solid #e5e7eb',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
                    e.currentTarget.style.borderColor = demo.color;
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.07)';
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {/* Header with Avatar and Name */}
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                    <div style={{ 
                      width: '56px', 
                      height: '56px', 
                      borderRadius: '50%', 
                      backgroundColor: demo.color, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      color: 'white', 
                      fontWeight: 'bold', 
                      fontSize: '20px', 
                      marginRight: '16px',
                      flexShrink: 0
                    }}>
                      {demo.avatar}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', fontSize: '20px', color: '#1f2937', marginBottom: '4px' }}>
                        {demo.name}
                      </div>
                      <div style={{ color: '#6b7280', fontSize: '16px' }}>
                        {demo.role}
                      </div>
                    </div>
                  </div>
                  
                  {/* Feature Icons */}
                  <div style={{ marginBottom: '20px' }}>
                    {demo.features.map((feature, index) => (
                      <div key={index} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        fontSize: '14px', 
                        color: '#6b7280',
                        marginBottom: index === 0 ? '12px' : '0'
                      }}>
                        <feature.icon size={16} style={{ color: demo.color, marginRight: '8px', flexShrink: 0 }} />
                        <span>{feature.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Description */}
                  <div style={{ 
                    fontSize: '15px', 
                    color: '#374151', 
                    lineHeight: '1.6',
                    marginBottom: '20px',
                    flex: 1
                  }}>
                    {demo.description}
                  </div>

                  {/* Key Features */}
                  <div style={{ 
                    backgroundColor: demo.bgColor, 
                    padding: '16px', 
                    borderRadius: '12px',
                    marginTop: 'auto'
                  }}>
                    <div style={{ 
                      fontSize: '13px', 
                      fontWeight: '600', 
                      color: demo.color,
                      marginBottom: '6px'
                    }}>
                      Key Features:
                    </div>
                    <div style={{ 
                      fontSize: '13px', 
                      color: demo.color === '#a855f7' ? '#6b21a8' : demo.color === '#059669' ? '#047857' : '#1d4ed8',
                      fontWeight: '500'
                    }}>
                      {demo.keyFeatures}
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Action Buttons */}
          <div style={{ 
            textAlign: 'center',
            marginBottom: '30px'
          }}>
            <div style={{
              display: 'inline-flex',
              gap: '16px',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              <a 
                href="/demo/comparison"
                style={{
                  display: 'block',
                  backgroundColor: '#1f2937',
                  color: 'white',
                  padding: '14px 28px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '16px',
                  border: 'none',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#374151';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#1f2937';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Compare All Demos
              </a>
              
              <a 
                href="/demo/tools"
                style={{
                  display: 'block',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  padding: '14px 28px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '16px',
                  border: 'none',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#1d4ed8';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(37, 99, 235, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#2563eb';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Try Our Tools
              </a>
              
              <button 
                style={{
                  display: 'block',
                  border: '2px solid #d1d5db',
                  color: '#374151',
                  backgroundColor: 'white',
                  padding: '14px 28px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontWeight: '600',
                  fontSize: '16px',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                  e.currentTarget.style.borderColor = '#9ca3af';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Schedule Live Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ 
        backgroundColor: '#1f2937', 
        color: 'white', 
        padding: '30px 20px'
      }}>
        <div style={{ maxWidth: '1024px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ 
            fontSize: '20px', 
            fontWeight: '600', 
            marginBottom: '12px' 
          }}>
            Ready to transform your organization's preventative healthcare?
          </div>
          <div style={{ 
            color: '#d1d5db', 
            marginBottom: '16px',
            fontSize: '16px'
          }}>
            Contact us to discuss your specific needs and ROI potential.
          </div>
          <div style={{ 
            fontSize: '14px', 
            color: '#9ca3af' 
          }}>
            Based in Austin, TX • HIPAA Compliant • Mobile-First Platform
          </div>
        </div>
      </div>
    </>
  );
}