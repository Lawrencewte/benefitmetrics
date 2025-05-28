import { CheckSquare, Square } from 'lucide-react';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface ConsentItem {
  id: string;
  title: string;
  description: string;
  required: boolean;
}

interface ConsentFormProps {
  title?: string;
  subtitle?: string;
  consentItems: ConsentItem[];
  privacyPolicyUrl?: string;
  termsOfServiceUrl?: string;
  onSubmit: (consents: Record<string, boolean>) => void;
  onCancel?: () => void;
  onPrivacyPolicyPress?: () => void;
  onTermsOfServicePress?: () => void;
}

const ConsentForm: React.FC<ConsentFormProps> = ({
  title = 'Consent Agreement',
  subtitle = 'Please review and consent to the following items before proceeding.',
  consentItems,
  privacyPolicyUrl,
  termsOfServiceUrl,
  onSubmit,
  onCancel,
  onPrivacyPolicyPress,
  onTermsOfServicePress,
}) => {
  const [consents, setConsents] = useState<Record<string, boolean>>(
    consentItems.reduce((acc, item) => {
      acc[item.id] = item.required;
      return acc;
    }, {} as Record<string, boolean>)
  );

  const toggleConsent = (id: string) => {
    // Don't allow toggling of required consents
    const item = consentItems.find((item) => item.id === id);
    if (item?.required) return;

    setConsents((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const areRequiredConsentsChecked = () => {
    return consentItems
      .filter((item) => item.required)
      .every((item) => consents[item.id]);
  };

  const handleSubmit = () => {
    onSubmit(consents);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      <ScrollView style={styles.scrollContainer}>
        {consentItems.map((item) => (
          <Card key={item.id} style={styles.consentCard}>
            <TouchableOpacity
              onPress={() => toggleConsent(item.id)}
              style={styles.consentItem}
            >
              <View style={styles.checkboxContainer}>
                {consents[item.id] ? (
                  <CheckSquare width={24} height={24} color="#2563EB" />
                ) : (
                  <Square width={24} height={24} color="#6B7280" />
                )}
              </View>
              <View style={styles.consentContent}>
                <Text style={styles.consentTitle}>
                  {item.title} {item.required && <Text style={styles.requiredText}>*</Text>}
                </Text>
                <Text style={styles.consentDescription}>{item.description}</Text>
              </View>
            </TouchableOpacity>
          </Card>
        ))}

        <View style={styles.legalLinksContainer}>
          <Text style={styles.legalText}>
            By proceeding, you agree to our{' '}
            <Text
              style={styles.legalLink}
              onPress={onTermsOfServicePress}
            >
              Terms of Service
            </Text>{' '}
            and{' '}
            <Text
              style={styles.legalLink}
              onPress={onPrivacyPolicyPress}
            >
              Privacy Policy
            </Text>
          </Text>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        {onCancel && (
          <Button
            title="Cancel"
            onPress={onCancel}
            variant="outline"
            style={styles.cancelButton}
          />
        )}
        <Button
          title="I Agree"
          onPress={handleSubmit}
          disabled={!areRequiredConsentsChecked()}
          style={onCancel ? styles.submitButtonWithCancel : styles.submitButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  scrollContainer: {
    flex: 1,
  },
  consentCard: {
    marginBottom: 16,
  },
  consentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkboxContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  consentContent: {
    flex: 1,
  },
  consentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  consentDescription: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  requiredText: {
    color: '#EF4444',
  },
  legalLinksContainer: {
    marginVertical: 20,
  },
  legalText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  legalLink: {
    color: '#2563EB',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  submitButton: {
    flex: 1,
  },
  submitButtonWithCancel: {
    flex: 1,
    marginLeft: 8,
  },
});

export default ConsentForm;