export const anonymization = {
  /**
   * Adds Laplace noise to a numeric value for differential privacy
   * @param value The original value
   * @param epsilon Privacy parameter (smaller = more privacy)
   * @returns The value with noise added
   */
  addNoise(value: number, epsilon: number): number {
    // Implement Laplace mechanism for differential privacy
    const scale = 1 / epsilon;
    return value + this.laplaceSample(0, scale);
  },
  
  /**
   * Samples from a Laplace distribution
   * @param mu Location parameter (mean)
   * @param b Scale parameter
   * @returns A random sample from the Laplace distribution
   */
  laplaceSample(mu: number, b: number): number {
    const u = Math.random() - 0.5;
    return mu - b * Math.sign(u) * Math.log(1 - 2 * Math.abs(u));
  },
  
  /**
   * Removes direct identifiers from a data object
   * @param data The original data object
   * @param identifiers Array of field names to remove
   * @returns A new object with identifiers removed
   */
  removeIdentifiers<T extends Record<string, any>>(
    data: T,
    identifiers: string[]
  ): Partial<T> {
    const result = { ...data };
    
    for (const field of identifiers) {
      if (field in result) {
        delete result[field];
      }
    }
    
    return result;
  },
  
  /**
   * Generalizes a value by reducing precision
   * @param value The original value
   * @param method Generalization method
   * @returns The generalized value
   */
  generalizeValue(
    value: any,
    method: 'date' | 'age' | 'zipcode' | 'category'
  ): any {
    switch (method) {
      case 'date':
        // Generalize date to just year-month
        if (value instanceof Date) {
          return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}`;
        } else if (typeof value === 'string') {
          const date = new Date(value);
          return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        }
        return value;
      
      case 'age':
        // Generalize age to age ranges
        if (typeof value === 'number') {
          return `${Math.floor(value / 10) * 10}-${Math.floor(value / 10) * 10 + 9}`;
        }
        return value;
      
      case 'zipcode':
        // Truncate ZIP code to first 3 digits
        if (typeof value === 'string') {
          return value.substring(0, 3) + '**';
        }
        return value;
      
      case 'category':
        // Use more general category (implementation would depend on category hierarchy)
        return value;
      
      default:
        return value;
    }
  },
  
  /**
   * Performs k-anonymization on a dataset
   * @param data Array of data objects
   * @param quasiIdentifiers Array of quasi-identifier field names
   * @param k Anonymity parameter (minimum group size)
   * @returns Anonymized dataset
   */
  kAnonymize<T extends Record<string, any>>(
    data: T[],
    quasiIdentifiers: string[],
    k: number
  ): T[] {
    // Group records by their quasi-identifiers
    const groups = this.groupByQuasiIdentifiers(data, quasiIdentifiers);
    
    // For each group with fewer than k records, generalize quasi-identifiers
    const result: T[] = [];
    
    for (const group of Object.values(groups)) {
      if (group.length >= k) {
        // Group already satisfies k-anonymity
        result.push(...group);
      } else {
        // Group needs generalization
        const generalizedGroup = this.generalizeGroup(group, quasiIdentifiers);
        result.push(...generalizedGroup);
      }
    }
    
    return result;
  },
  
  /**
   * Groups records by their quasi-identifiers
   * @param data Array of data objects
   * @param quasiIdentifiers Array of quasi-identifier field names
   * @returns Record groups
   */
  groupByQuasiIdentifiers<T extends Record<string, any>>(
    data: T[],
    quasiIdentifiers: string[]
  ): Record<string, T[]> {
    return data.reduce((groups, record) => {
      // Create a key from the quasi-identifiers
      const key = quasiIdentifiers
        .map(field => String(record[field]))
        .join('|');
      
      if (!groups[key]) {
        groups[key] = [];
      }
      
      groups[key].push(record);
      return groups;
    }, {} as Record<string, T[]>);
  },
  
  /**
   * Generalizes quasi-identifiers for a group of records
   * @param group Array of records in a group
   * @param quasiIdentifiers Array of quasi-identifier field names
   * @returns Generalized records
   */
  generalizeGroup<T extends Record<string, any>>(
    group: T[],
    quasiIdentifiers: string[]
  ): T[] {
    // Determine appropriate generalization method for each quasi-identifier
    const generalizationMethods: Record<string, 'date' | 'age' | 'zipcode' | 'category'> = {};
    
    for (const field of quasiIdentifiers) {
      // Choose generalization method based on field name or type
      if (field.toLowerCase().includes('date')) {
        generalizationMethods[field] = 'date';
      } else if (field.toLowerCase().includes('age')) {
        generalizationMethods[field] = 'age';
      } else if (field.toLowerCase().includes('zip') || field.toLowerCase().includes('postal')) {
        generalizationMethods[field] = 'zipcode';
      } else {
        generalizationMethods[field] = 'category';
      }
    }
    
    // Apply generalization to each record
    return group.map(record => {
      const generalizedRecord = { ...record };
      
      for (const field of quasiIdentifiers) {
        generalizedRecord[field] = this.generalizeValue(
          record[field],
          generalizationMethods[field]
        );
      }
      
      return generalizedRecord;
    });
  },
  
  /**
   * Pseudonymizes identifiers in a record
   * @param record The original record
   * @param fields Fields to pseudonymize
   * @param salt Salt value for hashing
   * @returns Record with pseudonymized fields
   */
  pseudonymizeRecord<T extends Record<string, any>>(
    record: T,
    fields: string[],
    salt: string
  ): T {
    const result = { ...record };
    
    for (const field of fields) {
      if (field in result && result[field]) {
        // Create a hash of the field value with the salt
        const hashInput = `${result[field]}${salt}`;
        result[field] = this.hashString(hashInput);
      }
    }
    
    return result;
  },
  
  /**
   * Simplified hash function (for demonstration purposes)
   * In production, use a cryptographic hash function
   */
  hashString(input: string): string {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(36);
  },
};