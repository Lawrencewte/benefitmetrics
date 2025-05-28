import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, Text, TextInput, View } from 'react-native';
import { AuthLayout } from '../../components/Common/layout/AuthLayout';
import { Button } from '../../components/Common/ui/Button';
import { auth } from '../../services/auth';

export default function PasswordReset() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handlePasswordReset = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    try {
      setIsLoading(true);
      await auth.requestPasswordReset(email);
      setIsSubmitted(true);
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to send reset email'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <AuthLayout>
        <View className="flex-1 justify-center p-6">
          <Text className="text-2xl font-bold text-center mb-6">Check Your Email</Text>
          <Text className="text-gray-600 text-center mb-8">
            We've sent a password reset link to {email}. Please check your email and follow the instructions to reset your password.
          </Text>
          
          <Button
            onPress={() => navigation.navigate('login')}
            label="Return to Login"
            variant="primary"
          />
          
          <Button
            onPress={() => setIsSubmitted(false)}
            label="Try Different Email"
            variant="outline"
            className="mt-4"
          />
        </View>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <View className="flex-1 justify-center p-6">
        <Text className="text-2xl font-bold text-center mb-6">Reset Password</Text>
        <Text className="text-gray-600 text-center mb-8">
          Enter your email address and we'll send you a link to reset your password.
        </Text>
        
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">Email Address</Text>
          <TextInput
            className="border border-gray-300 rounded-md p-3"
            placeholder="Enter your email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        
        <Button
          onPress={handlePasswordReset}
          label={isLoading ? "Sending..." : "Send Reset Link"}
          variant="primary"
          loading={isLoading}
          disabled={isLoading}
        />
        
        <Button
          onPress={() => navigation.navigate('login')}
          label="Back to Login"
          variant="outline"
          className="mt-4"
        />
      </View>
    </AuthLayout>
  );
}