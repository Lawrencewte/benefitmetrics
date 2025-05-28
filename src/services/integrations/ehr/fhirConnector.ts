import { HrisDataMapping, HrisIntegration } from '../../../types/integration';
import { api } from '../../api';

interface EmployeeRecord {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  jobTitle: string;
  hireDate: string;
  terminationDate?: string;
  status: 'active' | 'inactive' | 'terminated';
  manager?: string;
  location?: string;
  salary?: number;
  customFields?: Record<string, any>;
}

export const hrisConnectorService = {
  /**
   * Test connection to HRIS system
   */
  async testConnection(integration: HrisIntegration): Promise<boolean> {
    try {
      const response = await fetch(`${integration.apiEndpoint}/health`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${integration.credentials?.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      
      return response.ok;
    } catch (error) {
      console.error('HRIS connection test failed:', error);
      return false;
    }
  },
  
  /**
   * Fetch employee data from HRIS
   */
  async fetchEmployeeData(integration: HrisIntegration): Promise<EmployeeRecord[]> {
    try {
      let allEmployees: EmployeeRecord[] = [];
      let page = 1;
      let hasMore = true;
      
      while (hasMore) {
        const response = await fetch(`${integration.apiEndpoint}/employees?page=${page}&limit=100`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${integration.credentials?.apiKey}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch employee data: ${response.statusText}`);
        }
        
        const data = await response.json();
        const employees = data.employees || data.data || data;
        
        // Map HRIS data to our format using the data mapping
        const mappedEmployees = employees.map((emp: any) => this.mapEmployeeData(emp, integration.dataMapping));
        
        allEmployees = [...allEmployees, ...mappedEmployees];
        
        // Check if there are more pages
        hasMore = data.has_more || data.hasNextPage || employees.length === 100;
        page++;
      }
      
      return allEmployees;
    } catch (error) {
      console.error('Error fetching employee data from HRIS:', error);
      throw error;
    }
  },
  
  /**
   * Map HRIS employee data to our format
   */
  mapEmployeeData(hrisData: any, mapping: HrisDataMapping): EmployeeRecord {
    return {
      employeeId: this.getNestedValue(hrisData, mapping.employeeId),
      firstName: this.getNestedValue(hrisData, mapping.firstName),
      lastName: this.getNestedValue(hrisData, mapping.lastName),
      email: this.getNestedValue(hrisData, mapping.email),
      department: this.getNestedValue(hrisData, mapping.department),
      jobTitle: this.getNestedValue(hrisData, mapping.jobTitle),
      hireDate: this.getNestedValue(hrisData, mapping.hireDate),
      terminationDate: mapping.terminationDate ? this.getNestedValue(hrisData, mapping.terminationDate) : undefined,
      status: this.getNestedValue(hrisData, mapping.status),
      manager: mapping.manager ? this.getNestedValue(hrisData, mapping.manager) : undefined,
      location: mapping.location ? this.getNestedValue(hrisData, mapping.location) : undefined,
      salary: mapping.salary ? this.getNestedValue(hrisData, mapping.salary) : undefined,
      customFields: mapping.customFields ? Object.entries(mapping.customFields).reduce((acc, [key, path]) => {
        acc[key] = this.getNestedValue(hrisData, path);
        return acc;
      }, {} as Record<string, any>) : undefined,
    };
  },
  
  /**
   * Get nested value from object using dot notation path
   */
  getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  },
  
  /**
   * Sync employee data and update our database
   */
  async syncEmployeeData(integration: HrisIntegration): Promise<{
    added: number;
    updated: number;
    deactivated: number;
    errors: string[];
  }> {
    try {
      const employees = await this.fetchEmployeeData(integration);
      const results = {
        added: 0,
        updated: 0,
        deactivated: 0,
        errors: [] as string[],
      };
      
      // Process each employee record
      for (const employee of employees) {
        try {
          // Check if employee already exists
          const existingEmployee = await api.get(`/employees/by-employee-id/${employee.employeeId}`);
          
          if (existingEmployee.data) {
            // Update existing employee
            await api.patch(`/employees/${existingEmployee.data.id}`, employee);
            results.updated++;
          } else {
            // Create new employee
            await api.post('/employees', {
              ...employee,
              employerId: integration.employerId,
            });
            results.added++;
          }
        } catch (employeeError) {
          console.error(`Error processing employee ${employee.employeeId}:`, employeeError);
          results.errors.push(`Employee ${employee.employeeId}: ${employeeError instanceof Error ? employeeError.message : 'Unknown error'}`);
        }
      }
      
      // Deactivate employees not in the current sync
      try {
        const currentEmployeeIds = employees.map(emp => emp.employeeId);
        const deactivateResponse = await api.post('/employees/deactivate-missing', {
          employerId: integration.employerId,
          currentEmployeeIds,
        });
        results.deactivated = deactivateResponse.data.deactivated || 0;
      } catch (deactivateError) {
        console.error('Error deactivating missing employees:', deactivateError);
        results.errors.push('Failed to deactivate missing employees');
      }
      
      // Update integration sync status
      await api.patch(`/integrations/hris/${integration.id}`, {
        lastSyncDate: new Date().toISOString(),
        lastSyncStatus: results.errors.length === 0 ? 'success' : 'partial',
        errorMessage: results.errors.length > 0 ? results.errors.join('; ') : null,
      });
      
      return results;
    } catch (error) {
      console.error('Error syncing employee data:', error);
      
      // Update integration sync status to error
      await api.patch(`/integrations/hris/${integration.id}`, {
        lastSyncDate: new Date().toISOString(),
        lastSyncStatus: 'error',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      });
      
      throw error;
    }
  },
  
  /**
   * Send employee update to HRIS (for bidirectional sync)
   */
  async updateEmployeeInHris(
    integration: HrisIntegration,
    employeeId: string,
    updates: Partial<EmployeeRecord>
  ): Promise<void> {
    try {
      if (integration.syncSettings.syncDirection === 'inbound') {
        throw new Error('Integration is configured for inbound sync only');
      }
      
      // Map our data format back to HRIS format
      const hrisUpdates = this.mapToHrisFormat(updates, integration.dataMapping);
      
      const response = await fetch(`${integration.apiEndpoint}/employees/${employeeId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${integration.credentials?.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(hrisUpdates),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update employee in HRIS: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error updating employee in HRIS:', error);
      throw error;
    }
  },
  
  /**
   * Map our employee data format back to HRIS format
   */
  mapToHrisFormat(employeeData: Partial<EmployeeRecord>, mapping: HrisDataMapping): any {
    const hrisData: any = {};
    
    // Reverse the mapping process
    if (employeeData.firstName !== undefined) {
      this.setNestedValue(hrisData, mapping.firstName, employeeData.firstName);
    }
    if (employeeData.lastName !== undefined) {
      this.setNestedValue(hrisData, mapping.lastName, employeeData.lastName);
    }
    if (employeeData.email !== undefined) {
      this.setNestedValue(hrisData, mapping.email, employeeData.email);
    }
    if (employeeData.department !== undefined) {
      this.setNestedValue(hrisData, mapping.department, employeeData.department);
    }
    if (employeeData.jobTitle !== undefined) {
      this.setNestedValue(hrisData, mapping.jobTitle, employeeData.jobTitle);
    }
    if (employeeData.status !== undefined) {
      this.setNestedValue(hrisData, mapping.status, employeeData.status);
    }
    
    return hrisData;
  },
  
  /**
   * Set nested value in object using dot notation path
   */
  setNestedValue(obj: any, path: string, value: any): void {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const target = keys.reduce((current, key) => {
      if (!current[key]) {
        current[key] = {};
      }
      return current[key];
    }, obj);
    target[lastKey] = value;
  },
};