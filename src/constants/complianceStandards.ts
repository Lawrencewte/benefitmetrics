/**
 * Compliance standards for the application
 * These define the requirements for various compliance frameworks
 */
export const complianceStandards = {
  /**
   * HIPAA compliance requirements
   */
  hipaa: {
    standardName: 'Health Insurance Portability and Accountability Act',
    version: '2013 Omnibus Rule',
    safeguards: {
      administrative: [
        'SecurityManagement',
        'SecurityPersonnel',
        'InfoSystemActivity',
        'WorkforceManagement',
        'SecurityIncidents',
        'ContingencyPlan',
        'EvaluationProcedures',
        'BusinessAssociates',
      ],
      physical: [
        'FacilityAccess',
        'WorkstationUse',
        'WorkstationSecurity',
        'DeviceMedia',
      ],
      technical: [
        'AccessControl',
        'AuditControls',
        'IntegrityControls',
        'TransmissionSecurity',
      ],
    },
    policyDocuments: [
      'PrivacyPolicy',
      'SecurityPolicy',
      'BreachNotificationPolicy',
      'DisasterRecovery',
      'BusinessContinuity',
    ],
  },
  
  /**
   * GDPR compliance requirements
   */
  gdpr: {
    standardName: 'General Data Protection Regulation',
    version: '2016/679',
    dataSubjectRights: [
      'RightToBeInformed',
      'RightOfAccess',
      'RightToRectification',
      'RightToErasure',
      'RightToRestrictProcessing',
      'RightToDataPortability',
      'RightToObject',
      'RightsRelatedToAutomatedDecision',
    ],
    lawfulBases: [
      'Consent',
      'Contract',
      'LegalObligation',
      'VitalInterests',
      'PublicTask',
      'LegitimateInterests',
    ],
    requiredDocumentation: [
      'RecordsOfProcessingActivities',
      'DataProtectionImpactAssessment',
      'DataProcessingAgreement',
      'ConsentManagement',
      'DataBreachProcedures',
    ],
  },
  
  /**
   * CCPA compliance requirements
   */
  ccpa: {
    standardName: 'California Consumer Privacy Act',
    version: '2020 with CPRA amendments',
    consumerRights: [
      'RightToKnow',
      'RightToDelete',
      'RightToOptOut',
      'RightToNonDiscrimination',
      'RightToAccessPortable',
      'RightToCorrect',
      'RightToLimit',
    ],
    businessObligations: [
      'PrivacyPolicyDisclosure',
      'NoticeAtCollection',
      'NoticeOfFinancialIncentive',
      'OptOutButton',
      'ServiceProviderContracts',
      'EmployeeDataProtection',
    ],
  },
  
  /**
   * SOC 2 compliance requirements
   */
  soc2: {
    standardName: 'Service Organization Control 2',
    version: 'AICPA TSP section 100',
    trustServiceCriteria: [
      'Security',
      'Availability',
      'ProcessIntegrity',
      'Confidentiality',
      'Privacy',
    ],
    controlCategories: [
      'OrganizationManagement',
      'CommunicationsManagement',
      'RiskManagement',
      'MonitoringActivities',
      'ControlActivities',
      'LogicalAccessControls',
      'SystemOperationsControls',
      'ChangeManagement',
    ],
  },
  
  /**
   * ISO 27001 compliance requirements
   */
  iso27001: {
    standardName: 'ISO/IEC 27001 - Information Security Management',
    version: '2022',
    controlDomains: [
      'InformationSecurityPolicies',
      'OrganizationOfInfoSecurity',
      'HumanResourceSecurity',
      'AssetManagement',
      'AccessControl',
      'Cryptography',
      'PhysicalEnvironmentalSecurity',
      'OperationsSecurity',
      'CommunicationsSecurity',
      'SystemAcquisitionDevelopmentMaintenance',
      'SupplierRelationships',
      'InfoSecurityIncidentManagement',
      'BusinessContinuityManagement',
      'Compliance',
    ],
    documentationRequirements: [
      'ScopeOfISMS',
      'InformationSecurityPolicy',
      'RiskTreatmentPlan',
      'StatementOfApplicability',
      'RiskAssessmentMethodology',
    ],
  },
};