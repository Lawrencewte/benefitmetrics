import { Building, Calendar, DollarSign, Mail, Phone, User, Users } from 'lucide-react';
import React, { useState } from 'react';

interface ProspectData {
  id: string;
  name: string;
  title: string;
  company: string;
  industry: string;
  employeeCount: number;
  email: string;
  phone: string;
  lastContact: string;
  nextFollowUp: string;
  stage: 'lead' | 'qualified' | 'demo-scheduled' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  score: number;
  estimatedValue: number;
  demoViewed?: string[];
  painPoints: string[];
  notes: string[];
}

const mockProspects: ProspectData[] = [
  {
    id: '1',
    name: 'Sarah Williams',
    title: 'Benefits Director',
    company: 'Acme Healthcare',
    industry: 'Healthcare',
    employeeCount: 412,
    email: 'sarah.williams@acmehealthcare.com',
    phone: '(555) 123-4567',
    lastContact: '2025-06-01',
    nextFollowUp: '2025-06-05',
    stage: 'demo-scheduled',
    score: 85,
    estimatedValue: 16480,
    demoViewed: ['hr-admin', 'nurse'],
    painPoints: ['$182K unrealized benefits', 'Low utilization rates', 'Complex reporting'],
    notes: ['Very interested in ROI tracking', 'Budget approved for Q3', 'Wants pilot with 100 employees']
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    title: 'Chief Medical Officer',
    company: 'Regional Medical Center',
    industry: 'Healthcare',
    employeeCount: 2500,
    email: 'm.chen@regionalmed.org',
    phone: '(555) 987-6543',
    lastContact: '2025-05-28',
    nextFollowUp: '2025-06-03',
    stage: 'qualified',
    score: 72,
    estimatedValue: 100000,
    demoViewed: ['doctor'],
    painPoints: ['Physician burnout', 'Poor preventative care compliance', 'High turnover'],
    notes: ['Concerns about physician adoption', 'Interested in mobile-first approach']
  },
  {
    id: '3',
    name: 'Jennifer Park',
    title: 'Chief People Officer',
    company: 'TechFlow Solutions',
    industry: 'Technology',
    employeeCount: 850,
    email: 'jennifer.park@techflow.com',
    phone: '(555) 456-7890',
    lastContact: '2025-06-02',
    nextFollowUp: '2025-06-08',
    stage: 'proposal',
    score: 91,
    estimatedValue: 34000,
    demoViewed: ['hr-admin', 'comparison'],
    painPoints: ['Remote workforce challenges', 'Benefits underutilization', 'Need better metrics'],
    notes: ['Ready to move forward', 'Wants integration with existing HRIS', 'Decision expected by June 15']
  }
];

export default function ProspectDashboard() {
  const [selectedProspect, setSelectedProspect] = useState<ProspectData | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const getStageColor = (stage: string) => {
    const colors = {
      'lead': { bg: '#f3f4f6', text: '#1f2937' },
      'qualified': { bg: '#dbeafe', text: '#1e40af' },
      'demo-scheduled': { bg: '#e9d5ff', text: '#7c2d12' },
      'proposal': { bg: '#fef3c7', text: '#92400e' },
      'negotiation': { bg: '#fed7aa', text: '#ea580c' },
      'closed-won': { bg: '#dcfce7', text: '#166534' },
      'closed-lost': { bg: '#fecaca', text: '#dc2626' }
    };
    return colors[stage as keyof typeof colors] || colors.lead;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#16a34a';
    if (score >= 60) return '#ca8a04';
    return '#dc2626';
  };

  const filteredProspects = filter === 'all' 
    ? mockProspects 
    : mockProspects.filter(p => p.stage === filter);

  const totalPipelineValue = mockProspects.reduce((sum, p) => sum + p.estimatedValue, 0);
  const avgDealSize = totalPipelineValue / mockProspects.length;

  const formatStageLabel = (stage: string) => {
    if (stage === 'all') return 'All Prospects';
    return stage.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
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
            Sales Pipeline
          </h2>
          <p style={{ color: '#6b7280', margin: 0 }}>Track prospect engagement and demo performance</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>
              ${totalPipelineValue.toLocaleString()}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Pipeline Value</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>
              ${avgDealSize.toLocaleString()}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Avg Deal Size</div>
          </div>
        </div>
      </div>

      {/* Stage Filter */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto' }}>
        {['all', 'lead', 'qualified', 'demo-scheduled', 'proposal', 'negotiation'].map(stage => (
          <button
            key={stage}
            onClick={() => setFilter(stage)}
            style={{
              padding: '6px 12px',
              borderRadius: '16px',
              fontSize: '14px',
              fontWeight: '500',
              whiteSpace: 'nowrap',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: filter === stage ? '#2563eb' : '#f3f4f6',
              color: filter === stage ? 'white' : '#6b7280',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              if (filter !== stage) {
                e.currentTarget.style.backgroundColor = '#e5e7eb';
              }
            }}
            onMouseLeave={(e) => {
              if (filter !== stage) {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
              }
            }}
          >
            {formatStageLabel(stage)}
          </button>
        ))}
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '2fr 1fr',
        gap: '24px' 
      }}>
        {/* Prospects List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredProspects.map((prospect) => {
            const stageColors = getStageColor(prospect.stage);
            
            return (
              <div 
                key={prospect.id}
                onClick={() => setSelectedProspect(prospect)}
                style={{
                  padding: '16px',
                  border: selectedProspect?.id === prospect.id ? '1px solid #2563eb' : '1px solid #e5e7eb',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  backgroundColor: selectedProspect?.id === prospect.id ? '#eff6ff' : 'white'
                }}
                onMouseEnter={(e) => {
                  if (selectedProspect?.id !== prospect.id) {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedProspect?.id !== prospect.id) {
                    e.currentTarget.style.backgroundColor = 'white';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: '#2563eb',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: '600',
                      marginRight: '12px'
                    }}>
                      {prospect.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', color: '#1f2937' }}>{prospect.name}</div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        {prospect.title} at {prospect.company}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      display: 'inline-block',
                      padding: '4px 8px',
                      borderRadius: '16px',
                      fontSize: '12px',
                      fontWeight: '500',
                      backgroundColor: stageColors.bg,
                      color: stageColors.text
                    }}>
                      {formatStageLabel(prospect.stage)}
                    </div>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      marginTop: '4px',
                      color: getScoreColor(prospect.score)
                    }}>
                      {prospect.score}/100
                    </div>
                  </div>
                </div>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr 1fr', 
                  gap: '16px', 
                  fontSize: '14px' 
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', color: '#6b7280' }}>
                    <Users size={14} style={{ marginRight: '4px' }} />
                    {prospect.employeeCount} employees
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', color: '#6b7280' }}>
                    <DollarSign size={14} style={{ marginRight: '4px' }} />
                    ${prospect.estimatedValue.toLocaleString()}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', color: '#6b7280' }}>
                    <Calendar size={14} style={{ marginRight: '4px' }} />
                    Follow up: {new Date(prospect.nextFollowUp).toLocaleDateString()}
                  </div>
                </div>

                {prospect.demoViewed && prospect.demoViewed.length > 0 && (
                  <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {prospect.demoViewed.map(demo => (
                      <span key={demo} style={{
                        padding: '4px 8px',
                        backgroundColor: '#e9d5ff',
                        color: '#7c2d12',
                        fontSize: '12px',
                        borderRadius: '4px'
                      }}>
                        {demo.replace('-', ' ')} demo
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Prospect Details */}
        <div>
          {selectedProspect ? (
            <div style={{
              backgroundColor: '#f9fafb',
              borderRadius: '12px',
              padding: '16px',
              position: 'sticky',
              top: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#2563eb',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: '600',
                  marginRight: '12px'
                }}>
                  {selectedProspect.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: '#1f2937' }}>{selectedProspect.name}</div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>{selectedProspect.title}</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
                  <Building style={{ color: '#9ca3af', marginRight: '8px' }} size={16} />
                  <span>{selectedProspect.company} ({selectedProspect.industry})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
                  <Mail style={{ color: '#9ca3af', marginRight: '8px' }} size={16} />
                  <span>{selectedProspect.email}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
                  <Phone style={{ color: '#9ca3af', marginRight: '8px' }} size={16} />
                  <span>{selectedProspect.phone}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
                  <Users style={{ color: '#9ca3af', marginRight: '8px' }} size={16} />
                  <span>{selectedProspect.employeeCount} employees</span>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Pain Points
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {selectedProspect.painPoints.map((point, index) => (
                    <div key={index} style={{
                      fontSize: '12px',
                      backgroundColor: '#fef2f2',
                      color: '#dc2626',
                      padding: '8px',
                      borderRadius: '4px'
                    }}>
                      {point}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Recent Notes
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedProspect.notes.map((note, index) => (
                    <div key={index} style={{
                      fontSize: '12px',
                      backgroundColor: '#eff6ff',
                      color: '#1d4ed8',
                      padding: '8px',
                      borderRadius: '4px'
                    }}>
                      {note}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button style={{
                  width: '100%',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                >
                  Schedule Follow-up
                </button>
                <button style={{
                  width: '100%',
                  border: '1px solid #d1d5db',
                  color: '#374151',
                  backgroundColor: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  Send Demo Link
                </button>
                <button style={{
                  width: '100%',
                  border: '1px solid #d1d5db',
                  color: '#374151',
                  backgroundColor: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  Add Note
                </button>
              </div>
            </div>
          ) : (
            <div style={{
              backgroundColor: '#f9fafb',
              borderRadius: '12px',
              padding: '32px',
              textAlign: 'center'
            }}>
              <User style={{ color: '#9ca3af', margin: '0 auto 16px' }} size={48} />
              <p style={{ color: '#6b7280', margin: 0 }}>Select a prospect to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}