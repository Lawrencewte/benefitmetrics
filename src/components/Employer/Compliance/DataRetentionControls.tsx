import {
    AlertTriangle,
    CheckCircle,
    Clock,
    Database,
    Download,
    RefreshCw,
    Settings,
    Trash2
} from 'lucide-react';
import { useState } from 'react';

interface DataCategory {
  id: string;
  name: string;
  description: string;
  retentionPeriod: number; // in years
  minimumRetention: number; // minimum required by law
  maximumRetention: number; // maximum allowed
  autoDelete: boolean;
  complianceRule: string;
  currentDataSize: string;
  lastCleanup: string;
  nextCleanup: string;
  status: 'compliant' | 'warning' | 'violation';
}

interface RetentionPolicy {
  id: string;
  name: string;
  description: string;
  categories: string[];
  isActive: boolean;
  createdDate: string;
  lastModified: string;
}

export default function DataRetentionControls() {
  const [dataCategories, setDataCategories] = useState<DataCategory[]>([
    {
      id: '1',
      name: 'Employee Health Records',
      description: 'Personal health information and medical records',
      retentionPeriod: 7,
      minimumRetention: 6,
      maximumRetention: 10,
      autoDelete: true,
      complianceRule: 'HIPAA - 45 CFR 164.530',
      currentDataSize: '245 MB',
      lastCleanup: '2025-01-15',
      nextCleanup: '2025-07-15',
      status: 'compliant'
    },
    {
      id: '2',
      name: 'Appointment History',
      description: 'Scheduling and appointment completion records',
      retentionPeriod: 5,
      minimumRetention: 3,
      maximumRetention: 7,
      autoDelete: true,
      complianceRule: 'State Medical Records Law',
      currentDataSize: '156 MB',
      lastCleanup: '2025-02-01',
      nextCleanup: '2025-08-01',
      status: 'compliant'
    },
    {
      id: '3',
      name: 'Audit Logs',
      description: 'System access and activity logs',
      retentionPeriod: 3,
      minimumRetention: 2,
      maximumRetention: 5,
      autoDelete: false,
      complianceRule: 'SOX Compliance',
      currentDataSize: '892 MB',
      lastCleanup: '2024-11-15',
      nextCleanup: '2025-05-15',
      status: 'warning'
    },
    {
      id: '4',
      name: 'Communication Records',
      description: 'Emails, notifications, and messaging history',
      retentionPeriod: 2,
      minimumRetention: 1,
      maximumRetention: 3,
      autoDelete: true,
      complianceRule: 'Company Policy',
      currentDataSize: '67 MB',
      lastCleanup: '2025-03-01',
      nextCleanup: '2025-09-01',
      status: 'compliant'
    },
    {
      id: '5',
      name: 'Benefits Data',
      description: 'Insurance and benefits enrollment information',
      retentionPeriod: 8,
      minimumRetention: 7,
      maximumRetention: 10,
      autoDelete: false,
      complianceRule: 'ERISA Requirements',
      currentDataSize: '189 MB',
      lastCleanup: '2024-12-01',
      nextCleanup: '2025-12-01',
      status: 'violation'
    }
  ]);

  const [retentionPolicies, setRetentionPolicies] = useState<RetentionPolicy[]>([
    {
      id: '1',
      name: 'Healthcare Compliance Policy',
      description: 'HIPAA-compliant retention for all health-related data',
      categories: ['1', '2'],
      isActive: true,
      createdDate: '2024-01-15',
      lastModified: '2025-03-01'
    },
    {
      id: '2',
      name: 'General Business Records',
      description: 'Standard retention for non-medical business data',
      categories: ['3', '4', '5'],
      isActive: true,
      createdDate: '2024-01-15',
      lastModified: '2025-02-15'
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState<DataCategory | null>(null);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [showCleanupModal, setShowCleanupModal] = useState(false);

  const getStatusColor = (status: DataCategory['status']) => {
    switch (status) {
      case 'compliant':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'violation':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: DataCategory['status']) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle size={16} />;
      case 'warning':
        return <AlertTriangle size={16} />;
      case 'violation':
        return <AlertTriangle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const calculateDaysUntilCleanup = (nextCleanup: string) => {
    const today = new Date();
    const cleanupDate = new Date(nextCleanup);
    const diffTime = cleanupDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleRetentionChange = (categoryId: string, newPeriod: number) => {
    setDataCategories(prev => 
      prev.map(cat => 
        cat.id === categoryId 
          ? { ...cat, retentionPeriod: newPeriod }
          : cat
      )
    );
  };

  const handleAutoDeleteToggle = (categoryId: string) => {
    setDataCategories(prev => 
      prev.map(cat => 
        cat.id === categoryId 
          ? { ...cat, autoDelete: !cat.autoDelete }
          : cat
      )
    );
  };

  const handleManualCleanup = (categoryId: string) => {
    // Implement manual cleanup logic
    setDataCategories(prev => 
      prev.map(cat => 
        cat.id === categoryId 
          ? { 
              ...cat, 
              lastCleanup: new Date().toISOString().split('T')[0],
              nextCleanup: new Date(Date.now() + (cat.retentionPeriod * 365 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
              status: 'compliant' as const
            }
          : cat
      )
    );
  };

  const getTotalDataSize = () => {
    return dataCategories.reduce((total, cat) => {
      const size = parseFloat(cat.currentDataSize.replace(/[^0-9.]/g, ''));
      return total + size;
    }, 0).toFixed(0);
  };

  const getComplianceOverview = () => {
    const compliant = dataCategories.filter(cat => cat.status === 'compliant').length;
    const warning = dataCategories.filter(cat => cat.status === 'warning').length;
    const violation = dataCategories.filter(cat => cat.status === 'violation').length;
    
    return { compliant, warning, violation };
  };

  const compliance = getComplianceOverview();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="font-medium text-lg">Data Retention Controls</div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowPolicyModal(true)}
            className="bg-purple-600 text-white py-2 px-3 rounded text-sm hover:bg-purple-700 flex items-center"
          >
            <Settings size={14} className="mr-1" />
            Manage Policies
          </button>
          <button
            onClick={() => setShowCleanupModal(true)}
            className="bg-red-600 text-white py-2 px-3 rounded text-sm hover:bg-red-700 flex items-center"
          >
            <Trash2 size={14} className="mr-1" />
            Bulk Cleanup
          </button>
        </div>
      </div>

      {/* Compliance Overview */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="flex items-center">
            <Database className="text-blue-600 mr-2" size={20} />
            <div>
              <div className="font-medium text-blue-800">Total Data</div>
              <div className="text-lg font-bold text-blue-600">{getTotalDataSize()} MB</div>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <div className="flex items-center">
            <CheckCircle className="text-green-600 mr-2" size={20} />
            <div>
              <div className="font-medium text-green-800">Compliant</div>
              <div className="text-lg font-bold text-green-600">{compliance.compliant}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
          <div className="flex items-center">
            <AlertTriangle className="text-yellow-600 mr-2" size={20} />
            <div>
              <div className="font-medium text-yellow-800">Warning</div>
              <div className="text-lg font-bold text-yellow-600">{compliance.warning}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
          <div className="flex items-center">
            <AlertTriangle className="text-red-600 mr-2" size={20} />
            <div>
              <div className="font-medium text-red-800">Violations</div>
              <div className="text-lg font-bold text-red-600">{compliance.violation}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Categories */}
      <div className="space-y-4">
        <div className="font-medium">Data Categories</div>
        
        {dataCategories.map(category => {
          const daysUntilCleanup = calculateDaysUntilCleanup(category.nextCleanup);
          
          return (
            <div key={category.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <div className="font-medium">{category.name}</div>
                    <div className={`ml-2 px-2 py-0.5 rounded text-xs flex items-center ${getStatusColor(category.status)}`}>
                      {getStatusIcon(category.status)}
                      <span className="ml-1 capitalize">{category.status}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">{category.description}</div>
                  <div className="text-xs text-gray-500">
                    Compliance Rule: {category.complianceRule}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCategory(category)}
                  className="bg-gray-100 text-gray-700 py-1 px-3 rounded text-sm hover:bg-gray-200"
                >
                  Configure
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="text-sm">
                  <span className="font-medium">Current Size:</span> {category.currentDataSize}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Retention Period:</span> {category.retentionPeriod} years
                </div>
                <div className="text-sm">
                  <span className="font-medium">Last Cleanup:</span> {formatDate(category.lastCleanup)}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Next Cleanup:</span> {formatDate(category.nextCleanup)}
                  {daysUntilCleanup <= 30 && (
                    <span className="ml-1 text-orange-600">({daysUntilCleanup} days)</span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={category.autoDelete}
                      onChange={() => handleAutoDeleteToggle(category.id)}
                      className="mr-2"
                    />
                    Auto-delete after retention period
                  </label>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleManualCleanup(category.id)}
                    className="bg-orange-100 text-orange-700 py-1 px-3 rounded text-sm hover:bg-orange-200 flex items-center"
                  >
                    <RefreshCw size={12} className="mr-1" />
                    Cleanup Now
                  </button>
                  <button className="bg-blue-100 text-blue-700 py-1 px-3 rounded text-sm hover:bg-blue-200 flex items-center">
                    <Download size={12} className="mr-1" />
                    Export
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Policies */}
      <div className="mt-8">
        <div className="font-medium mb-4">Active Retention Policies</div>
        <div className="space-y-3">
          {retentionPolicies.filter(policy => policy.isActive).map(policy => (
            <div key={policy.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium">{policy.name}</div>
                <div className="text-xs text-gray-500">
                  Modified: {formatDate(policy.lastModified)}
                </div>
              </div>
              <div className="text-sm text-gray-600 mb-2">{policy.description}</div>
              <div className="text-xs text-gray-500">
                Applies to {policy.categories.length} data categories
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Configuration Modal */}
      {selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="font-medium text-lg mb-4">Configure {selectedCategory.name}</div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Retention Period (years)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min={selectedCategory.minimumRetention}
                    max={selectedCategory.maximumRetention}
                    value={selectedCategory.retentionPeriod}
                    onChange={(e) => handleRetentionChange(selectedCategory.id, parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <div className="w-12 text-center text-sm font-medium">
                    {selectedCategory.retentionPeriod}
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Min: {selectedCategory.minimumRetention}</span>
                  <span>Max: {selectedCategory.maximumRetention}</span>
                </div>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedCategory.autoDelete}
                    onChange={() => handleAutoDeleteToggle(selectedCategory.id)}
                    className="mr-2"
                  />
                  <span className="text-sm">Enable automatic deletion</span>
                </label>
                <div className="text-xs text-gray-500 mt-1">
                  Data will be automatically deleted after the retention period expires
                </div>
              </div>

              <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                <div className="flex items-start">
                  <AlertTriangle size={16} className="text-yellow-600 mr-2 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <div className="font-medium mb-1">Compliance Note</div>
                    <div>{selectedCategory.complianceRule}</div>
                    <div className="mt-1">
                      Minimum retention: {selectedCategory.minimumRetention} years
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded">
                <div className="text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div>Current Size: {selectedCategory.currentDataSize}</div>
                    <div>Last Cleanup: {formatDate(selectedCategory.lastCleanup)}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setSelectedCategory(null)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded text-sm hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => setSelectedCategory(null)}
                className="flex-1 bg-purple-600 text-white py-2 rounded text-sm hover:bg-purple-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Policy Management Modal */}
      {showPolicyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="font-medium text-lg mb-4">Retention Policy Management</div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {retentionPolicies.map(policy => (
                <div key={policy.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{policy.name}</div>
                    <div className="flex items-center space-x-2">
                      <label className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={policy.isActive}
                          onChange={() => {
                            setRetentionPolicies(prev => 
                              prev.map(p => 
                                p.id === policy.id 
                                  ? { ...p, isActive: !p.isActive }
                                  : p
                              )
                            );
                          }}
                          className="mr-1"
                        />
                        Active
                      </label>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">{policy.description}</div>
                  <div className="text-xs text-gray-500">
                    Created: {formatDate(policy.createdDate)} | 
                    Modified: {formatDate(policy.lastModified)}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowPolicyModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded text-sm hover:bg-gray-200"
              >
                Close
              </button>
              <button className="bg-purple-600 text-white py-2 px-4 rounded text-sm hover:bg-purple-700">
                New Policy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Cleanup Modal */}
      {showCleanupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="font-medium text-lg mb-4">Bulk Data Cleanup</div>
            
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-4">
                Select data categories for immediate cleanup of expired records:
              </div>
              
              <div className="space-y-2">
                {dataCategories.map(category => (
                  <label key={category.id} className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">{category.name}</span>
                    <span className="ml-auto text-xs text-gray-500">
                      {category.currentDataSize}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-red-50 p-3 rounded border border-red-200 mb-4">
              <div className="flex items-start">
                <AlertTriangle size={16} className="text-red-600 mr-2 mt-0.5" />
                <div className="text-sm text-red-800">
                  <div className="font-medium">Warning</div>
                  <div>This action will permanently delete data that has exceeded its retention period. This cannot be undone.</div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowCleanupModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded text-sm hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCleanupModal(false)}
                className="flex-1 bg-red-600 text-white py-2 rounded text-sm hover:bg-red-700"
              >
                Confirm Cleanup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}