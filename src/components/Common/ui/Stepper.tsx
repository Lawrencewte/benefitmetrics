import { Check } from 'lucide-react'; // Assuming we're using lucide-react for icons
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Step {
  id: string | number;
  title: string;
  subtitle?: string;
  isCompleted?: boolean;
}

interface StepperProps {
  steps: Step[];
  activeStep: string | number;
  orientation?: 'horizontal' | 'vertical';
  style?: any;
}

const Stepper: React.FC<StepperProps> = ({
  steps,
  activeStep,
  orientation = 'horizontal',
  style,
}) => {
  const isStepActive = (step: Step) => step.id === activeStep;
  const isStepCompleted = (step: Step) => step.isCompleted;
  const isStepPending = (step: Step) => !isStepActive(step) && !isStepCompleted(step);

  const getStepBackgroundColor = (step: Step) => {
    if (isStepCompleted(step)) return '#2563EB'; // blue-600 for completed
    if (isStepActive(step)) return '#FFFFFF'; // white for active
    return '#F3F4F6'; // gray-100 for pending
  };

  const getStepBorderColor = (step: Step) => {
    if (isStepCompleted(step)) return '#2563EB'; // blue-600 for completed
    if (isStepActive(step)) return '#2563EB'; // blue-600 for active
    return '#D1D5DB'; // gray-300 for pending
  };

  const getStepTextColor = (step: Step) => {
    if (isStepCompleted(step)) return '#2563EB'; // blue-600 for completed
    if (isStepActive(step)) return '#111827'; // gray-900 for active
    return '#6B7280'; // gray-500 for pending
  };

  const getLineColor = (step: Step, index: number) => {
    if (index === steps.length - 1) return 'transparent'; // no line for last step
    
    const nextStepIndex = steps.findIndex(s => s.id === steps[index + 1].id);
    const nextStep = steps[nextStepIndex];
    
    if (isStepCompleted(step)) return '#2563EB'; // blue-600 if current step is completed
    return '#E5E7EB'; // gray-200 otherwise
  };

  const renderHorizontalStepper = () => (
    <View style={[styles.horizontalContainer, style]}>
      {steps.map((step, index) => (
        <View key={step.id} style={styles.horizontalStepWrapper}>
          <View style={styles.horizontalStep}>
            <View
              style={[
                styles.stepCircle,
                {
                  backgroundColor: getStepBackgroundColor(step),
                  borderColor: getStepBorderColor(step),
                },
              ]}
            >
              {isStepCompleted(step) ? (
                <Check width={16} height={16} color="#FFFFFF" />
              ) : (
                <Text
                  style={[
                    styles.stepNumber,
                    {
                      color: isStepActive(step) ? '#2563EB' : '#6B7280',
                    },
                  ]}
                >
                  {index + 1}
                </Text>
              )}
            </View>
            
            {index < steps.length - 1 && (
              <View
                style={[
                  styles.horizontalLine,
                  {
                    backgroundColor: getLineColor(step, index),
                  },
                ]}
              />
            )}
          </View>
          
          <Text
            style={[
              styles.stepTitle,
              {
                color: getStepTextColor(step),
                fontWeight: isStepActive(step) ? '600' : '400',
              },
            ]}
            numberOfLines={1}
          >
            {step.title}
          </Text>
        </View>
      ))}
    </View>
  );

  const renderVerticalStepper = () => (
    <View style={[styles.verticalContainer, style]}>
      {steps.map((step, index) => (
        <View key={step.id} style={styles.verticalStepWrapper}>
          <View style={styles.verticalStepContent}>
            <View
              style={[
                styles.stepCircle,
                {
                  backgroundColor: getStepBackgroundColor(step),
                  borderColor: getStepBorderColor(step),
                },
              ]}
            >
              {isStepCompleted(step) ? (
                <Check width={16} height={16} color="#FFFFFF" />
              ) : (
                <Text
                  style={[
                    styles.stepNumber,
                    {
                      color: isStepActive(step) ? '#2563EB' : '#6B7280',
                    },
                  ]}
                >
                  {index + 1}
                </Text>
              )}
            </View>
            
            <View style={styles.stepTextContainer}>
              <Text
                style={[
                  styles.stepTitle,
                  {
                    color: getStepTextColor(step),
                    fontWeight: isStepActive(step) ? '600' : '400',
                  },
                ]}
              >
                {step.title}
              </Text>
              
              {step.subtitle && (
                <Text style={styles.stepSubtitle}>{step.subtitle}</Text>
              )}
            </View>
          </View>
          
          {index < steps.length - 1 && (
            <View
              style={[
                styles.verticalLine,
                {
                  backgroundColor: getLineColor(step, index),
                },
              ]}
            />
          )}
        </View>
      ))}
    </View>
  );

  return orientation === 'horizontal' ? renderHorizontalStepper() : renderVerticalStepper();
};

const styles = StyleSheet.create({
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  horizontalStepWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  horizontalStep: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  horizontalLine: {
    height: 2,
    flex: 1,
    marginHorizontal: 8,
  },
  verticalContainer: {
    paddingHorizontal: 16,
  },
  verticalStepWrapper: {
    marginBottom: 24,
  },
  verticalStepContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verticalLine: {
    width: 2,
    height: 24,
    marginLeft: 12,
    marginTop: 4,
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: '600',
  },
  stepTextContainer: {
    marginLeft: 12,
  },
  stepTitle: {
    fontSize: 14,
  },
  stepSubtitle: {
    fontSize: 12,
    color: '#6B7280', // gray-500
    marginTop: 2,
  },
});

export default Stepper;