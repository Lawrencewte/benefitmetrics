import React, { useState } from 'react';

// Mock Lucide icons as simple components
const CheckCircle = ({ style, size }) => (
  <div style={{ ...style, width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
    ✓
  </div>
);

const XCircle = ({ style, size }) => (
  <div style={{ ...style, width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
    ✗
  </div>
);

const AlertCircle = ({ style, size }) => (
  <div style={{ ...style, width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
    ⚠
  </div>
);

const Star = ({ style, size }) => (
  <div style={{ ...style, width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
    ★
  </div>
);

const Target = ({ style, size }) => (
  <div style={{ ...style, width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
    🎯
  </div>
);

const DollarSign = ({ style, size }) => (
  <div style={{ ...style, width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
    $
  </div>
);

const Users = ({ style, size }) => (
  <div style={{ ...style, width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
    👥
  </div>
);

const competitors = [
  {
    id: 'benefitmetrics',
    name: 'BenefitMetrics',
    category: 'Preventative Healthcare Platform',
    pricing: {
      model: 'Per employee/month',
      range: '$3-8',
      setup: 'Free implementation'
    },
    strengths: [
      'Healthcare worker-specific design',
      'Smart scheduling for shift workers',
      'Real-time ROI tracking',
      'Mobile-first platform',
      'Benefits optimization engine'
    ],
    weaknesses: [
      'Newer player in market',
      'Limited enterprise integrations',
      'Smaller customer base'
    ],
    features: {
      'Health Score Tracking': 'yes',
      'Smart Scheduling': 'yes',
      'ROI Analytics': 'yes',
      'Benefits Optimization': 'yes',
      'Mobile App': 'yes',
      'Shift Worker Support': 'yes',
      'Gamification': 'yes',
      'HIPAA Compliance': 'yes',
      'EHR Integration': 'partial',
      'Family Management': 'yes',
      'Predictive Analytics': 'yes',
      'Custom Reporting': 'yes'
    },
    marketShare: 2,
    customerSatisfaction: 4.8,
    implementation: '2-4 weeks',
    targetMarket: ['Healthcare Organizations', 'Shift Workers', 'Mid-size Companies']
  },
  {
    id: 'virgin-pulse',
    name: 'Virgin Pulse',
    category: 'Corporate Wellness Platform',
    pricing: {
      model: 'Per employee/month',
      range: '$5-12',
      setup: '$50K+ implementation'
    },
    strengths: [
      'Large enterprise customer base',
      'Comprehensive wellness platform',
      'Strong brand recognition',
      'Extensive integrations'
    ],
    weaknesses: [
      'Generic, not healthcare-specific',
      'Complex implementation',
      'Poor mobile experience',
      'High cost for small-medium businesses'
    ],
    features: {
      'Health Score Tracking': 'yes',
      'Smart Scheduling': 'no',
      'ROI Analytics': 'partial',
      'Benefits Optimization': 'no',
      'Mobile App': 'partial',
      'Shift Worker Support': 'no',
      'Gamification': 'yes',
      'HIPAA Compliance': 'yes',
      'EHR Integration': 'yes',
      'Family Management': 'partial',
      'Predictive Analytics': 'premium',
      'Custom Reporting': 'premium'
    },
    marketShare: 15,
    customerSatisfaction: 3.2,
    implementation: '12-24 weeks',
    targetMarket: ['Large Enterprises', 'Fortune 500', 'Global Companies']
  },
  {
    id: 'webmd-health-services',
    name: 'WebMD Health Services',
    category: 'Health Engagement Platform',
    pricing: {
      model: 'Custom enterprise pricing',
      range: '$8-15',
      setup: '$100K+ implementation'
    },
    strengths: [
      'Medical content expertise',
      'Healthcare brand trust',
      'Clinical decision support',
      'Large enterprise focus'
    ],
    weaknesses: [
      'Expensive for mid-market',
      'Limited mobile functionality',
      'Complex user interface',
      'No preventative care focus'
    ],
    features: {
      'Health Score Tracking': 'partial',
      'Smart Scheduling': 'no',
      'ROI Analytics': 'yes',
      'Benefits Optimization': 'no',
      'Mobile App': 'partial',
      'Shift Worker Support': 'no',
      'Gamification': 'no',
      'HIPAA Compliance': 'yes',
      'EHR Integration': 'yes',
      'Family Management': 'no',
      'Predictive Analytics': 'yes',
      'Custom Reporting': 'yes'
    },
    marketShare: 12,
    customerSatisfaction: 3.5,
    implementation: '16-32 weeks',
    targetMarket: ['Healthcare Systems', 'Large Employers', 'Health Plans']
  },
  {
    id: 'thrive-global',
    name: 'Thrive Global',
    category: 'Wellness & Behavior Change',
    pricing: {
      model: 'Per employee/month',
      range: '$6-10',
      setup: '$25K+ implementation'
    },
    strengths: [
      'Behavior change focus',
      'Mental wellness emphasis',
      'Celebrity/thought leader brand',
      'Modern user experience'
    ],
    weaknesses: [
      'Limited healthcare specificity',
      'No benefits integration',
      'Expensive for outcomes delivered',
      'Limited analytics'
    ],
    features: {
      'Health Score Tracking': 'partial',
      'Smart Scheduling': 'no',
      'ROI Analytics': 'no',
      'Benefits Optimization': 'no',
      'Mobile App': 'yes',
      'Shift Worker Support': 'no',
      'Gamification': 'partial',
      'HIPAA Compliance': 'partial',
      'EHR Integration': 'no',
      'Family Management': 'no',
      'Predictive Analytics': 'no',
      'Custom Reporting': 'partial'
    },
    marketShare: 5,
    customerSatisfaction: 4.1,
    implementation: '8-12 weeks',
    targetMarket: ['Tech Companies', 'Progressive Employers', 'Startups']
  }
];

const featureList = [
  'Health Score Tracking',
  'Smart Scheduling',
  'ROI Analytics',
  'Benefits Optimization',
  'Mobile App',
  'Shift Worker Support',
  'Gamification',
  'HIPAA Compliance',
  'EHR Integration',
  'Family Management',
  'Predictive Analytics',
  'Custom Reporting'
];

export default function CompetitiveAnalysis() {
  const [selectedCompetitor, setSelectedCompetitor] = useState('benefitmetrics');
  const [viewMode, setViewMode] = useState('overview');

  const getFeatureIcon = (status) => {
    switch (status) {
      case 'yes':
        return <CheckCircle style={{ color: '#16a34a' }} size={20} />;
      case 'partial':
        return <AlertCircle style={{ color: '#ca8a04' }} size={20} />;
      case 'premium':
        return <Star style={{ color: '#2563eb' }} size={20} />;
      default:
        return <XCircle style={{ color: '#dc2626' }} size={20} />;
    }
  };

  const selectedComp = competitors.find(c => c.id === selectedCompetitor);

  return (
    <div style={{ 
      backgroundColor: 'white', 
      borderRadius: '16px', 
      boxShadow: '0 10px 15px rgba(0,0,0,0.1)', 
      padding: '24px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '1200px',
      margin: '20px auto'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 4px 0' }}>
            Competitive Analysis
          </h2>
          <p style={{ color: '#6b7280', margin: 0 }}>Compare BenefitMetrics against key competitors</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['overview', 'features', 'pricing'].map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: viewMode === mode ? '#2563eb' : '#f3f4f6',
                color: viewMode === mode ? 'white' : '#6b7280',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                if (viewMode !== mode) {
                  e.currentTarget.style.backgroundColor = '#e5e7eb';
                }
              }}
              onMouseLeave={(e) => {
                if (viewMode !== mode) {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }
              }}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Competitor Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto' }}>
        {competitors.map(comp => (
          <button
            key={comp.id}
            onClick={() => setSelectedCompetitor(comp.id)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              whiteSpace: 'nowrap',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: selectedCompetitor === comp.id ? '#2563eb' : '#f3f4f6',
              color: selectedCompetitor === comp.id ? 'white' : '#6b7280',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              if (selectedCompetitor !== comp.id) {
                e.currentTarget.style.backgroundColor = '#e5e7eb';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedCompetitor !== comp.id) {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
              }
            }}
          >
            {comp.name}
          </button>
        ))}
      </div>

      {viewMode === 'overview' && selectedComp && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: window.innerWidth > 1024 ? '1fr 1fr' : '1fr',
          gap: '32px' 
        }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
              {selectedComp.name} Overview
            </h3>
            
            {/* Key Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div style={{ backgroundColor: '#eff6ff', padding: '16px', borderRadius: '8px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>
                  {selectedComp.marketShare}%
                </div>
                <div style={{ fontSize: '14px', color: '#1d4ed8' }}>Market Share</div>
              </div>
              <div style={{ backgroundColor: '#f0fdf4', padding: '16px', borderRadius: '8px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>
                  {selectedComp.customerSatisfaction}/5
                </div>
                <div style={{ fontSize: '14px', color: '#15803d' }}>Customer Rating</div>
              </div>
            </div>

            {/* Basic Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <span style={{ fontWeight: '500', color: '#374151' }}>Category: </span>
                <span style={{ color: '#6b7280' }}>{selectedComp.category}</span>
              </div>
              <div>
                <span style={{ fontWeight: '500', color: '#374151' }}>Implementation: </span>
                <span style={{ color: '#6b7280' }}>{selectedComp.implementation}</span>
              </div>
              <div>
                <span style={{ fontWeight: '500', color: '#374151', display: 'block', marginBottom: '8px' }}>
                  Target Market:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {selectedComp.targetMarket.map(market => (
                    <span key={market} style={{
                      padding: '4px 8px',
                      backgroundColor: '#f3f4f6',
                      color: '#374151',
                      fontSize: '12px',
                      borderRadius: '4px'
                    }}>
                      {market}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            {/* Strengths & Weaknesses */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontWeight: '600', color: '#059669', marginBottom: '8px' }}>Strengths</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {selectedComp.strengths.map((strength, index) => (
                  <li key={index} style={{ display: 'flex', alignItems: 'flex-start', fontSize: '14px' }}>
                    <CheckCircle style={{ color: '#16a34a', marginRight: '8px', marginTop: '2px', flexShrink: 0 }} size={16} />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 style={{ fontWeight: '600', color: '#dc2626', marginBottom: '8px' }}>Weaknesses</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {selectedComp.weaknesses.map((weakness, index) => (
                  <li key={index} style={{ display: 'flex', alignItems: 'flex-start', fontSize: '14px' }}>
                    <XCircle style={{ color: '#dc2626', marginRight: '8px', marginTop: '2px', flexShrink: 0 }} size={16} />
                    <span>{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'features' && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ textAlign: 'left', padding: '12px', fontWeight: '500', color: '#374151' }}>
                  Feature
                </th>
                {competitors.map(comp => (
                  <th key={comp.id} style={{ 
                    textAlign: 'center', 
                    padding: '12px', 
                    fontWeight: '500', 
                    color: '#374151',
                    minWidth: '128px'
                  }}>
                    {comp.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {featureList.map(feature => (
                <tr key={feature} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '12px', fontWeight: '500', color: '#374151' }}>
                    {feature}
                  </td>
                  {competitors.map(comp => (
                    <td key={comp.id} style={{ textAlign: 'center', padding: '12px' }}>
                      {getFeatureIcon(comp.features[feature] || 'no')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          
          <div style={{ 
            marginTop: '16px', 
            display: 'flex', 
            justifyContent: 'center', 
            flexWrap: 'wrap',
            gap: '24px', 
            fontSize: '14px' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <CheckCircle style={{ color: '#16a34a', marginRight: '8px' }} size={16} />
              <span>Full Support</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <AlertCircle style={{ color: '#ca8a04', marginRight: '8px' }} size={16} />
              <span>Limited Support</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Star style={{ color: '#2563eb', marginRight: '8px' }} size={16} />
              <span>Premium Only</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <XCircle style={{ color: '#dc2626', marginRight: '8px' }} size={16} />
              <span>Not Available</span>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'pricing' && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '24px' 
        }}>
          {competitors.map(comp => (
            <div key={comp.id} style={{
              border: comp.id === 'benefitmetrics' ? '2px solid #2563eb' : '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '24px',
              backgroundColor: comp.id === 'benefitmetrics' ? '#eff6ff' : 'white',
              transition: 'all 0.3s'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0' }}>
                  {comp.name}
                </h3>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                  {comp.category}
                </div>
              </div>
              
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
                  {comp.pricing.range}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                  {comp.pricing.model}
                </div>
                {comp.pricing.setup && (
                  <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                    {comp.pricing.setup}
                  </div>
                )}
              </div>

              <div style={{ fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Market Share:</span>
                  <span style={{ fontWeight: '500' }}>{comp.marketShare}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Rating:</span>
                  <span style={{ fontWeight: '500' }}>{comp.customerSatisfaction}/5</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Implementation:</span>
                  <span style={{ fontWeight: '500', fontSize: '12px' }}>{comp.implementation}</span>
                </div>
              </div>

              {comp.id === 'benefitmetrics' && (
                <div style={{ marginTop: '16px', textAlign: 'center' }}>
                  <span style={{
                    backgroundColor: '#2563eb',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    Our Solution
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Key Differentiators */}
      <div style={{
        marginTop: '32px',
        background: 'linear-gradient(to right, #eff6ff, #f3e8ff)',
        padding: '24px',
        borderRadius: '8px'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px', textAlign: 'center' }}>
          Why BenefitMetrics Wins
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '24px' 
        }}>
          <div style={{ textAlign: 'center' }}>
            <Target style={{ color: '#2563eb', margin: '0 auto 8px auto' }} size={32} />
            <h4 style={{ fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0' }}>
              Healthcare-Specific
            </h4>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '0' }}>
              Built specifically for healthcare workers and their unique scheduling challenges
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <DollarSign style={{ color: '#16a34a', margin: '0 auto 8px auto' }} size={32} />
            <h4 style={{ fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0' }}>
              Better ROI
            </h4>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '0' }}>
              3-8x lower cost with faster implementation and higher engagement rates
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Users style={{ color: '#7c3aed', margin: '0 auto 8px auto' }} size={32} />
            <h4 style={{ fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0' }}>
              User Experience
            </h4>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '0' }}>
              4.8/5 customer satisfaction with mobile-first design for busy healthcare workers
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}