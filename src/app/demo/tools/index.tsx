import { ArrowLeft, ArrowRight, BarChart, Calculator, CheckCircle, Clipboard, Clock, Star, Users } from 'lucide-react';
import React from 'react';

export default function SalesToolsIndex() {
  const tools = [
    {
      id: 'roi-calculator',
      title: 'ROI Calculator',
      description: 'Calculate specific savings estimates for your organization',
      icon: Calculator,
      route: '/demo/tools/roi-calculator',
      time: '5 minutes',
      difficulty: 'Easy',
      value: 'Get personalized savings projections',
      color: '#a855f7',
      bgColor: '#faf5ff',
      recommended: true
    },
    {
      id: 'pilot-setup',
      title: 'Pilot Program Designer',
      description: 'Create a custom 90-day pilot program proposal',
      icon: Users,
      route: '/demo/tools/pilot-setup',
      time: '10 minutes',
      difficulty: 'Medium',
      value: 'Design your implementation plan',
      color: '#2563eb',
      bgColor: '#eff6ff',
      recommended: true
    },
    {
      id: 'competitive-analysis',
      title: 'Competitive Analysis',
      description: 'See how BenefitMetrics compares to other solutions',
      icon: BarChart,
      route: '/demo/tools/competitive-analysis',
      time: '3 minutes',
      difficulty: 'Easy',
      value: 'Understand our advantages',
      color: '#059669',
      bgColor: '#f0fdf4',
      recommended: false
    },
    {
      id: 'executive-summary',
      title: 'Executive Summary',
      description: 'Generate a personalized report for stakeholders',
      icon: Clipboard,
      route: '/demo/tools/prospect-dashboard',
      time: '2 minutes',
      difficulty: 'Easy',
      value: 'Present to decision makers',
      color: '#4f46e5',
      bgColor: '#eef2ff',
      recommended: true
    }
  ];

  const recommendedTools = tools.filter(tool => tool.recommended);
  const otherTools = tools.filter(tool => !tool.recommended);

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
        background: 'linear-gradient(to right, #a855f7, #2563eb)', 
        color: 'white', 
        padding: '16px' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <button 
            onClick={() => window.history.back()}
            style={{
              display: 'flex',
              alignItems: 'center',
              color: 'white',
              marginRight: '16px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            <ArrowLeft size={20} style={{ marginRight: '8px' }} />
            Back to Demos
          </button>
        </div>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', margin: 0 }}>Sales Tools</h1>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', margin: 0 }}>
            Get specific information for your organization
          </p>
        </div>
      </div>

      <div style={{ padding: '16px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Introduction */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          padding: '16px', 
          marginBottom: '24px', 
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontWeight: '600', fontSize: '18px', marginBottom: '8px', margin: '0 0 8px 0' }}>Build Your Business Case</h2>
          <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '12px', margin: '0 0 12px 0' }}>
            These tools help you create a compelling proposal for implementing BenefitMetrics at your organization.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', color: '#2563eb', fontSize: '14px' }}>
            <CheckCircle size={16} style={{ marginRight: '8px' }} />
            <span>All tools provide downloadable reports</span>
          </div>
        </div>

        {/* Recommended Tools */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>Recommended Starting Points</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {recommendedTools.map((tool) => (
              <div
                key={tool.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  border: '1px solid #e5e7eb',
                  overflow: 'hidden'
                }}
              >
                <div style={{ 
                  background: `linear-gradient(to right, ${tool.color}, ${tool.color}dd)`, 
                  padding: '16px', 
                  color: 'white' 
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        backgroundColor: 'rgba(255,255,255,0.2)', 
                        borderRadius: '8px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        marginRight: '12px' 
                      }}>
                        <tool.icon size={20} />
                      </div>
                      <div>
                        <h3 style={{ fontWeight: '600', margin: '0 0 4px 0' }}>{tool.title}</h3>
                        <p style={{ fontSize: '14px', opacity: 0.9, margin: 0 }}>{tool.description}</p>
                      </div>
                    </div>
                    <ArrowRight size={20} />
                  </div>
                </div>
                
                <div style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px', color: '#6b7280' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Clock size={14} style={{ marginRight: '4px' }} />
                        <span>{tool.time}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Star size={14} style={{ marginRight: '4px' }} />
                        <span>{tool.difficulty}</span>
                      </div>
                    </div>
                    <span style={{ 
                      backgroundColor: '#f0fdf4', 
                      color: '#16a34a', 
                      padding: '4px 8px', 
                      borderRadius: '16px', 
                      fontSize: '12px', 
                      fontWeight: '500' 
                    }}>
                      Recommended
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', color: '#6b7280', marginBottom: '12px' }}>
                    <CheckCircle size={14} style={{ color: '#16a34a', marginRight: '8px' }} />
                    <span style={{ fontSize: '14px' }}>{tool.value}</span>
                  </div>
                  
                  <button
                    onClick={() => window.location.href = tool.route}
                    style={{
                      width: '100%',
                      background: `linear-gradient(to right, ${tool.color}, ${tool.color}dd)`,
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontWeight: '500',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'opacity 0.3s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                  >
                    Start {tool.title}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Tools */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>Additional Resources</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {otherTools.map((tool) => (
              <div
                key={tool.id}
                onClick={() => window.location.href = tool.route}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid #e5e7eb',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ 
                      width: '32px', 
                      height: '32px', 
                      backgroundColor: tool.bgColor, 
                      borderRadius: '8px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      marginRight: '12px' 
                    }}>
                      <tool.icon size={16} style={{ color: tool.color }} />
                    </div>
                    <div>
                      <h4 style={{ fontWeight: '500', color: '#1f2937', margin: '0 0 4px 0' }}>{tool.title}</h4>
                      <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>{tool.description}</p>
                    </div>
                  </div>
                  <ArrowRight size={16} style={{ color: '#9ca3af' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Start Guide */}
        <div style={{ 
          backgroundColor: '#eff6ff', 
          border: '1px solid #bfdbfe', 
          borderRadius: '12px', 
          padding: '16px' 
        }}>
          <h3 style={{ fontWeight: '600', color: '#1e40af', marginBottom: '8px' }}>Quick Start Recommendation</h3>
          <p style={{ color: '#1d4ed8', fontSize: '14px', marginBottom: '12px' }}>
            For the best results, we recommend this order:
          </p>
          <ol style={{ fontSize: '14px', color: '#1d4ed8', margin: '0 0 12px 0', paddingLeft: '20px' }}>
            <li style={{ marginBottom: '4px' }}>1. <strong>ROI Calculator</strong> - Get specific savings estimates</li>
            <li style={{ marginBottom: '4px' }}>2. <strong>Pilot Program Designer</strong> - Plan your implementation</li>
            <li>3. <strong>Executive Summary</strong> - Present to stakeholders</li>
          </ol>
          <button
            onClick={() => window.location.href = '/demo/tools/roi-calculator'}
            style={{
              width: '100%',
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Start with ROI Calculator
          </button>
        </div>
      </div>
    </div>
  );
}