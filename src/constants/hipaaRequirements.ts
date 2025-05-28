/**
 * HIPAA requirements for the application
 * Defines the specific HIPAA-related configurations
 */
export const hipaaRequirements = {
  /**
   * Minimum necessary requirements for different operations
   * Maps operations to purposes, and purposes to required fields
   */
  minimumNecessary: {
    'view_patient_record': {
      'treatment': [
        'patientId',
        'name',
        'dateOfBirth',
        'gender',
        'medicalHistory',
        'medications',
        'allergies',
        'vitalSigns',
        'labResults',
        'diagnoses',
        'treatments',
        'notes',
      ],
      'payment': [
        'patientId',
        'name',
        'insuranceInfo',
        'billingAddress',
        'treatments',
        'diagnoses',
        'serviceDate',
        'providerInfo',
      ],
      'healthcare_operations': [
        'patientId',
        'demographics',
        'appointmentHistory',
        'treatmentOutcomes',
        'diagnoses',
        'serviceDate',
      ],
      'research': [
        'age',
        'gender',
        'diagnoses',
        'treatments',
        'outcomes',
        'labResults',
      ],
    },
    'update_patient_record': {
      'treatment': [
        'patientId',
        'medicalHistory',
        'medications',
        'allergies',
        'vitalSigns',
        'labResults',
        'diagnoses',
        'treatments',
        'notes',
      ],
      'payment': [
        'patientId',
        'insuranceInfo',
        'billingAddress',
        'serviceDate',
        'billingCodes',
      ],
    },
    'view_appointment': {
      'treatment': [
        'appointmentId',
        'patientId',
        'name',
        'dateTime',
        'providerInfo',
        'reason',
        'notes',
      ],
      'healthcare_operations': [
        'appointmentId',
        'patientId',
        'dateTime',
        'providerInfo',
        'status',
      ],
    },
    'analytics_report': {
      'healthcare_operations': [
        'age',
        'gender',
        'serviceTrend',
        'appointmentTypes',
        'preventativeCareCompletion',
        'anonymizedOutcomes',
      ],
      'research': [
        'age',
        'gender',
        'anonymizedDiagnoses',
        'anonymizedTreatments',
        'anonymizedOutcomes',
      ],
    },
  },
  
  /**
   * Role-based access control mappings
   * Defines what actions each role can perform and for what purposes
   */
  roleBasedAccess: {
    'provider': {
      'view_patient_record': ['treatment', 'healthcare_operations'],
      'update_patient_record': ['treatment'],
      'view_appointment': ['treatment', 'healthcare_operations'],
      'schedule_appointment': ['treatment', 'healthcare_operations'],
      'prescribe_medication': ['treatment'],
      'order_test': ['treatment'],
    },
    'nurse': {
      'view_patient_record': ['treatment'],
      'update_vital_signs': ['treatment'],
      'view_appointment': ['treatment', 'healthcare_operations'],
      'schedule_appointment': ['treatment', 'healthcare_operations'],
    },
    'admin': {
      'view_appointment': ['healthcare_operations'],
      'schedule_appointment': ['healthcare_operations'],
      'view_billing_info': ['payment'],
      'update_billing_info': ['payment'],
      'run_reports': ['healthcare_operations'],
    },
    'billing': {
      'view_patient_record': ['payment'],
      'view_billing_info': ['payment'],
      'update_billing_info': ['payment'],
      'submit_claim': ['payment'],
    },
    'researcher': {
      'view_anonymized_data': ['research'],
      'run_anonymized_reports': ['research'],
    },
    'patient': {
      'view_own_record': ['user_requested'],
      'update_own_info': ['user_requested'],
      'view_own_appointment': ['user_requested'],
      'schedule_own_appointment': ['user_requested'],
    },
  },
  
  /**
   * De-identification requirements
   * Defines when data types need to be de-identified based on purpose
   */
  deIdentification: {
    'patient_record': ['research', 'healthcare_operations'],
    'appointment_data': ['research', 'healthcare_operations'],
    'billing_data': ['research', 'healthcare_operations'],
    'test_results': ['research'],
    'demographics': ['research'],
  },
  
  /**
   * Authorization validation requirements
   * Defines the validation steps for different access levels
   */
  authorizationValidation: {
    'regular_access': [
      'validate_authentication',
      'validate_role',
      'validate_purpose',
      'validate_relationship',
      'log_access',
    ],
    'sensitive_access': [
      'validate_authentication',
      'validate_role',
      'validate_purpose',
      'validate_relationship',
      'verify_necessity',
      'require_justification',
      'log_access',
    ],
    'emergency_access': [
      'validate_authentication',
      'validate_emergency_condition',
      'log_access',
      'flag_for_review',
      'notify_privacy_officer',
    ],
  },
  
  /**
   * Breach notification thresholds
   * Defines when and how to handle potential breaches
   */
  breachNotification: {
    'low_risk': {
      'affectedRecords': 1,
      'containsPHI': true,
      'requiresNotification': false,
      'documentationRequired': true,
    },
    'medium_risk': {
      'affectedRecords': 10,
      'containsPHI': true,
      'requiresNotification': true,
      'notificationTimeframe': '60 days',
      'documentationRequired': true,
    },
    'high_risk': {
      'affectedRecords': 500,
      'containsPHI': true,
      'requiresNotification': true,
      'notificationTimeframe': '30 days',
      'documentationRequired': true,
      'hhs_notification': true,
      'media_notification': true,
    },
  },
  
  /**
   * Audit logging requirements
   * Defines what events must be logged for HIPAA compliance
   */
  auditLogging: {
    'required_events': [
      'login',
      'logout',
      'view_phi',
      'modify_phi',
      'export_phi',
      'print_phi',
      'share_phi',
      'delete_phi',
      'access_control_changes',
      'system_configuration_changes',
      'security_incidents',
      'backup_restore',
    ],
    'required_fields': [
      'timestamp',
      'user_id',
      'user_role',
      'action',
      'resource_type',
      'resource_id',
      'status',
      'ip_address',
    ],
    'retention_period': '6 years',
  },
};