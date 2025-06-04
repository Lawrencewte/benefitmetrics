import { Calculator, DollarSign } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface ROIInputs {
  employeeCount: number;
  avgSalary: number;
  currentHealthcareCosts: number;
  absenteeismDays: number;
  turnoverRate: number;
  industry: string;
}

interface ROIResults {
  healthcareSavings: number;
  productivityGains: number;
  absenteeismReduction: number;
  turnoverSavings: number;
  netAnnualSavings: number;
  totalAnnualSavings: number;
  roi: number;
  paybackPeriod: number;
}

const industryMultipliers = {
  healthcare: { health: 1.2, productivity: 1.1, turnover: 1.3 },
  manufacturing: { health: 1.1, productivity: 1.2, turnover: 1.1 },
  technology: { health: 0.9, productivity: 1.0, turnover: 1.4 },
  finance: { health: 1.0, productivity: 1.1, turnover: 1.2 },
  education: { health: 1.1, productivity: 1.0, turnover: 0.9 },
  retail: { health: 1.0, productivity: 1.1, turnover: 1.0 }
};

export default function ROICalculatorTool() {
  const [inputs, setInputs] = useState<ROIInputs>({
    employeeCount: 100,
    avgSalary: 65000,
    currentHealthcareCosts: 12000,
    absenteeismDays: 8,
    turnoverRate: 15,
    industry: 'healthcare'
  });

  const [results, setResults] = useState<ROIResults>({
    healthcareSavings: 0,
    productivityGains: 0,
    absenteeismReduction: 0,
    turnoverSavings: 0,
    netAnnualSavings: 0,
    totalAnnualSavings: 0,
    roi: 0,
    paybackPeriod: 0
  });

  const calculateROI = () => {
    const multiplier = industryMultipliers[inputs.industry as keyof typeof industryMultipliers] || industryMultipliers.healthcare;
    const programCost = inputs.employeeCount * 25 * 12; // $25 per employee per month
    
    // Healthcare cost savings (16-22% reduction)
    const healthcareSavings = inputs.currentHealthcareCosts * inputs.employeeCount * 0.18 * multiplier.health;
    
    // Productivity gains (daily wage * productivity improvement)
    const dailyWage = inputs.avgSalary / 260; // 260 working days
    const productivityGains = dailyWage * inputs.employeeCount * 0.11 * 260 * multiplier.productivity;
    
    // Absenteeism reduction (27% improvement)
    const absenteeismCostPerDay = dailyWage;
    const absenteeismReduction = inputs.absenteeismDays * 0.27 * absenteeismCostPerDay * inputs.employeeCount;
    
    // Turnover cost savings (average $75K per turnover)
    const avgTurnoverCost = inputs.avgSalary * 0.75; // 75% of salary
    const turnoverReduction = (inputs.turnoverRate / 100) * 0.15; // 15% reduction in turnover
    const turnoverSavings = turnoverReduction * inputs.employeeCount * avgTurnoverCost * multiplier.turnover;
    
    const totalAnnualSavings = healthcareSavings + productivityGains + absenteeismReduction + turnoverSavings;
    const netAnnualSavings = totalAnnualSavings - programCost;
    const roi = (netAnnualSavings / programCost) * 100;
    const paybackPeriod = programCost / (totalAnnualSavings / 12);

    setResults({
      healthcareSavings,
      productivityGains,
      absenteeismReduction,
      turnoverSavings,
      netAnnualSavings,
      totalAnnualSavings,
      roi,
      paybackPeriod
    });
  };

  useEffect(() => {
    calculateROI();
  }, [inputs]);

  const handleInputChange = (field: keyof ROIInputs, value: string | number) => {
    setInputs(prev => ({
      ...prev,
      [field]: field === 'industry' ? value : Number(value)
    }));
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
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <Calculator style={{ color: '#2563eb', marginRight: '12px' }} size={28} />
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 4px 0' }}>ROI Calculator</h2>
          <p style={{ color: '#6b7280', margin: 0 }}>Calculate potential savings from BenefitMetrics implementation</p>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '32px' 
      }}>
        {/* Input Section */}
        <div>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            color: '#374151', 
            borderBottom: '1px solid #e5e7eb', 
            paddingBottom: '8px',
            marginBottom: '24px'
          }}>
            Organization Details
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#374151', 
                marginBottom: '8px' 
              }}>
                Number of Employees
              </label>
              <input
                type="number"
                value={inputs.employeeCount}
                onChange={(e) => handleInputChange('employeeCount', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
                min="10"
                max="10000"
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
                Average Annual Salary
              </label>
              <div style={{ position: 'relative' }}>
                <DollarSign style={{ 
                  position: 'absolute', 
                  left: '12px', 
                  top: '12px', 
                  color: '#9ca3af' 
                }} size={20} />
                <input
                  type="number"
                  value={inputs.avgSalary}
                  onChange={(e) => handleInputChange('avgSalary', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 40px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                  min="30000"
                  max="200000"
                />
              </div>
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#374151', 
                marginBottom: '8px' 
              }}>
                Annual Healthcare Cost per Employee
              </label>
              <div style={{ position: 'relative' }}>
                <DollarSign style={{ 
                  position: 'absolute', 
                  left: '12px', 
                  top: '12px', 
                  color: '#9ca3af' 
                }} size={20} />
                <input
                  type="number"
                  value={inputs.currentHealthcareCosts}
                  onChange={(e) => handleInputChange('currentHealthcareCosts', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 40px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                  min="5000"
                  max="25000"
                />
              </div>
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#374151', 
                marginBottom: '8px' 
              }}>
                Average Sick Days per Employee
              </label>
              <input
                type="number"
                value={inputs.absenteeismDays}
                onChange={(e) => handleInputChange('absenteeismDays', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
                min="3"
                max="20"
                step="0.5"
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
                Annual Turnover Rate (%)
              </label>
              <input
                type="number"
                value={inputs.turnoverRate}
                onChange={(e) => handleInputChange('turnoverRate', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
                min="5"
                max="50"
                step="1"
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
                Industry
              </label>
              <select
                value={inputs.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              >
                <option value="healthcare">Healthcare</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="technology">Technology</option>
                <option value="finance">Finance</option>
                <option value="education">Education</option>
                <option value="retail">Retail</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            color: '#374151', 
            borderBottom: '1px solid #e5e7eb', 
            paddingBottom: '8px',
            marginBottom: '24px'
          }}>
            Projected Annual Savings
          </h3>
          
          {/* Key Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div style={{ 
              backgroundColor: '#f0fdf4', 
              padding: '16px', 
              borderRadius: '12px', 
              border: '1px solid #bbf7d0' 
            }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#16a34a' }}>
                ${results.netAnnualSavings.toLocaleString()}
              </div>
              <div style={{ fontSize: '14px', color: '#15803d' }}>Net Annual Savings</div>
            </div>
            <div style={{ 
              backgroundColor: '#eff6ff', 
              padding: '16px', 
              borderRadius: '12px', 
              border: '1px solid #bfdbfe' 
            }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#2563eb' }}>
                {results.roi.toFixed(0)}%
              </div>
              <div style={{ fontSize: '14px', color: '#1d4ed8' }}>Return on Investment</div>
            </div>
          </div>

          {/* Savings Breakdown */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '12px', 
              backgroundColor: '#f9fafb', 
              borderRadius: '8px',
              marginBottom: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: '#ef4444', borderRadius: '50%', marginRight: '12px' }}></div>
                <span style={{ fontSize: '14px' }}>Healthcare Cost Reduction</span>
              </div>
              <span style={{ fontWeight: '600' }}>${results.healthcareSavings.toLocaleString()}</span>
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '12px', 
              backgroundColor: '#f9fafb', 
              borderRadius: '8px',
              marginBottom: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: '#2563eb', borderRadius: '50%', marginRight: '12px' }}></div>
                <span style={{ fontSize: '14px' }}>Productivity Improvements</span>
              </div>
              <span style={{ fontWeight: '600' }}>${results.productivityGains.toLocaleString()}</span>
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '12px', 
              backgroundColor: '#f9fafb', 
              borderRadius: '8px',
              marginBottom: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: '#16a34a', borderRadius: '50%', marginRight: '12px' }}></div>
                <span style={{ fontSize: '14px' }}>Reduced Absenteeism</span>
              </div>
              <span style={{ fontWeight: '600' }}>${results.absenteeismReduction.toLocaleString()}</span>
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '12px', 
              backgroundColor: '#f9fafb', 
              borderRadius: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: '#a855f7', borderRadius: '50%', marginRight: '12px' }}></div>
                <span style={{ fontSize: '14px' }}>Turnover Reduction</span>
              </div>
              <span style={{ fontWeight: '600' }}>${results.turnoverSavings.toLocaleString()}</span>
            </div>
          </div>

          {/* Additional Metrics */}
          <div style={{ 
            background: 'linear-gradient(to right, #eff6ff, #faf5ff)', 
            padding: '16px', 
            borderRadius: '12px', 
            border: '1px solid #e5e7eb',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>
                  {results.paybackPeriod.toFixed(1)} months
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Payback Period</div>
              </div>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>
                  ${(results.netAnnualSavings / inputs.employeeCount).toLocaleString()}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Net Savings per Employee</div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div style={{ 
            backgroundColor: '#2563eb', 
            color: 'white', 
            padding: '16px', 
            borderRadius: '12px', 
            textAlign: 'center' 
          }}>
            <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Ready to realize these savings?</div>
            <div style={{ color: '#bfdbfe', fontSize: '14px', marginBottom: '12px' }}>
              Schedule a demo to see how BenefitMetrics can transform your organization
            </div>
            <button style={{
              backgroundColor: 'white',
              color: '#2563eb',
              padding: '8px 24px',
              borderRadius: '8px',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              Schedule Demo
            </button>
          </div>
        </div>
      </div>

      {/* Methodology Section */}
      <div style={{ 
        marginTop: '40px', 
        padding: '24px', 
        backgroundColor: '#f8fafc', 
        borderRadius: '12px', 
        border: '1px solid #e2e8f0' 
      }}>
        <h3 style={{ 
          fontSize: '20px', 
          fontWeight: '600', 
          color: '#374151', 
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Calculator style={{ marginRight: '8px', color: '#64748b' }} size={20} />
          How We Calculate Your ROI
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
          
          {/* Healthcare Savings */}
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#dc2626', marginBottom: '12px' }}>
              Healthcare Cost Reduction (18%)
            </h4>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
              <strong>Formula:</strong> Annual Healthcare Cost × Employee Count × 18% × Industry Multiplier
            </div>
            <div style={{ fontSize: '13px', color: '#4b5563', lineHeight: '1.5' }}>
              Studies show preventative care programs reduce healthcare expenditures by 16-22%. 
              Johnson & Johnson's wellness programs saved $250 million over a decade, with a return of $2.71 
              for every dollar spent on wellness initiatives.
            </div>
            <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px', fontStyle: 'italic' }}>
              Source: American Journal of Preventive Medicine, J&J Corporate Wellness Reports
            </div>
          </div>

          {/* Productivity Gains */}
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#2563eb', marginBottom: '12px' }}>
              Productivity Improvements (11%)
            </h4>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
              <strong>Formula:</strong> (Annual Salary ÷ 260 days) × Employee Count × 11% × 260 × Industry Multiplier
            </div>
            <div style={{ fontSize: '13px', color: '#4b5563', lineHeight: '1.5' }}>
              Harvard Business Review research shows 11% productivity increases in companies with robust 
              preventative health programs. This accounts for reduced presenteeism (working while sick) 
              and improved cognitive performance.
            </div>
            <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px', fontStyle: 'italic' }}>
              Source: Harvard Business Review, CDC Workplace Health Research
            </div>
          </div>

          {/* Absenteeism Reduction */}
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#16a34a', marginBottom: '12px' }}>
              Reduced Absenteeism (27%)
            </h4>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
              <strong>Formula:</strong> Sick Days × 27% reduction × Daily Wage × Employee Count
            </div>
            <div style={{ fontSize: '13px', color: '#4b5563', lineHeight: '1.5' }}>
              Multiple studies document 20-30% reductions in absenteeism through preventative care programs. 
              The average cost of absenteeism is $3,600 per employee annually, making this reduction highly valuable.
            </div>
            <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px', fontStyle: 'italic' }}>
              Source: Journal of Occupational Health Psychology, CDC Economic Burden Reports
            </div>
          </div>

          {/* Turnover Reduction */}
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#a855f7', marginBottom: '12px' }}>
              Turnover Reduction (15%)
            </h4>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
              <strong>Formula:</strong> (Turnover Rate × 15% reduction) × Employee Count × (75% of Salary) × Industry Multiplier
            </div>
            <div style={{ fontSize: '13px', color: '#4b5563', lineHeight: '1.5' }}>
              Research shows 87% of employees choose employers based on health programs. Companies with 
              comprehensive wellness see 10-20% lower turnover, with replacement costs averaging 75% of salary.
            </div>
            <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px', fontStyle: 'italic' }}>
              Source: SHRM Benefits Research, Gallup Workplace Surveys
            </div>
          </div>
        </div>

        {/* Industry Adjustments */}
        <div style={{ 
          marginTop: '24px', 
          padding: '16px', 
          backgroundColor: '#fef3c7', 
          border: '1px solid #fbbf24', 
          borderRadius: '8px' 
        }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#92400e', marginBottom: '8px' }}>
            Industry-Specific Adjustments
          </h4>
          <div style={{ fontSize: '13px', color: '#451a03', lineHeight: '1.5' }}>
            <strong>Healthcare:</strong> Higher baseline health costs but greater preventative care impact (+20% health savings, +30% retention benefits)<br/>
            <strong>Manufacturing:</strong> Physical demands increase productivity and absenteeism benefits (+20% productivity, +10% health savings)<br/>
            <strong>Technology:</strong> Younger workforce with lower health costs but high turnover sensitivity (+40% retention benefits)<br/>
            <strong>Finance:</strong> Stress-related health issues make wellness programs particularly effective (+10% across all categories)<br/>
            <strong>Education:</strong> Budget constraints but stable workforce (-10% turnover benefits, +10% health savings)<br/>
            <strong>Retail:</strong> Baseline calculations apply with standard industry multipliers
          </div>
        </div>

        {/* Conservative Approach Note */}
        <div style={{ 
          marginTop: '16px', 
          padding: '16px', 
          backgroundColor: '#ecfdf5', 
          border: '1px solid #10b981', 
          borderRadius: '8px' 
        }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#065f46', marginBottom: '8px' }}>
            Conservative Calculations
          </h4>
          <div style={{ fontSize: '13px', color: '#064e3b', lineHeight: '1.5' }}>
            Our calculations use conservative industry averages to ensure realistic projections. 
            Many organizations see higher returns, particularly in the second and third years as programs mature. 
            At $25 per employee per month, BenefitMetrics typically delivers 2:1 to 6:1 ROI within the first year.
          </div>
        </div>
      </div>
    </div>
  );
}