import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Context Providers
import { AuthProvider } from '../context/AuthContext';
import { NotificationsProvider } from '../context/Common/NotificationsContext';
import { ThemeProvider } from '../context/Common/ThemeContext';
import { OnboardingProvider } from '../context/OnboardingContext';
import { RoleProvider } from '../context/RoleContext';
import { SecurityProvider } from '../context/SecurityContext';

// Employee Context Providers
import { AppointmentProvider } from '../context/employee/AppointmentContext';
import { BenefitsProvider } from '../context/employee/BenefitsContext';
import { ChallengesProvider } from '../context/employee/ChallengesContext';
import { EducationProvider } from '../context/employee/EducationContext';
import { FamilyProvider } from '../context/employee/FamilyContext';
import { HealthScoreProvider } from '../context/employee/HealthScoreContext';
import { ProfileProvider } from '../context/employee/ProfileContext';
import { ROIProvider } from '../context/employee/ROIContext';

// Employer Context Providers
import { CareTimelineProvider } from '../context/employee/CareTimelineContext';
import { AnalyticsProvider } from '../context/employer/AnalyticsContext';
import { ComplianceProvider } from '../context/employer/ComplianceContext';
import { EmployeeDataProvider } from '../context/employer/EmployeeDataContext';
import { ProgramProvider } from '../context/employer/ProgramContext';

export default function RootLayout() {
  useEffect(() => {
    // Initialize app-level configurations
    const initializeApp = async () => {
      try {
        // Initialize analytics
        // Initialize crash reporting
        // Initialize performance monitoring
        // Initialize security monitoring
      } catch (error) {
        console.error('Failed to initialize app:', error);
      }
    };

    initializeApp();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <SecurityProvider>
              <RoleProvider>
                <OnboardingProvider>
                  <NotificationsProvider>
                    {/* Employee Context Providers */}
                    <AppointmentProvider>
                      <BenefitsProvider userId={"REPLACE_WITH_USER_ID"}>
                        <ChallengesProvider userId={"REPLACE_WITH_USER_ID"}>
                          <HealthScoreProvider>
                            <ROIProvider>
                              <CareTimelineProvider>
                              <ProfileProvider userId={"REPLACE_WITH_USER_ID"}>
                                <FamilyProvider userId={"REPLACE_WITH_USER_ID"}>
                                  <EducationProvider>
                                    {/* Employer Context Providers */}
                                    <AnalyticsProvider>
                                      <ProgramProvider>
                                        <EmployeeDataProvider>
                                          <ComplianceProvider>
                                            <Stack
                                              screenOptions={{
                                                headerShown: false,
                                                animation: 'slide_from_right',
                                                gestureEnabled: true,
                                                gestureDirection: 'horizontal',
                                              }}
                                            >
                                              {/* Landing/Auth Screens */}
                                              <Stack.Screen
                                                name="index"
                                                options={{
                                                  title: 'Welcome to BenefitMetrics',
                                                }}
                                              />
                                              
                                              <Stack.Screen
                                                name="auth/login"
                                                options={{
                                                  title: 'Sign In',
                                                  presentation: 'modal',
                                                }}
                                              />
                                              
                                              <Stack.Screen
                                                name="auth/register"
                                                options={{
                                                  title: 'Create Account',
                                                  presentation: 'modal',
                                                }}
                                              />
                                              
                                              <Stack.Screen
                                                name="auth/password-reset"
                                                options={{
                                                  title: 'Reset Password',
                                                  presentation: 'modal',
                                                }}
                                              />

                                              {/* Onboarding Screens */}
                                              <Stack.Screen
                                                name="onboarding"
                                                options={{
                                                  title: 'Setup',
                                                  gestureEnabled: false,
                                                }}
                                              />

                                              {/* Employee Screens */}
                                              <Stack.Screen
                                                name="employee"
                                                options={{
                                                  title: 'BenefitMetrics',
                                                }}
                                              />

                                              {/* Employer Screens */}
                                              <Stack.Screen
                                                name="employer"
                                                options={{
                                                  title: 'BenefitMetrics Admin',
                                                }}
                                              />
                                            </Stack>
                                            
                                            <StatusBar style="auto" />
                                          </ComplianceProvider>
                                        </EmployeeDataProvider>
                                      </ProgramProvider>
                                    </AnalyticsProvider>
                                  </EducationProvider>
                                </FamilyProvider>
                              </ProfileProvider>
                              </CareTimelineProvider>
                            </ROIProvider>
                          </HealthScoreProvider>
                        </ChallengesProvider>
                      </BenefitsProvider>
                    </AppointmentProvider>
                  </NotificationsProvider>
                </OnboardingProvider>
              </RoleProvider>
            </SecurityProvider>
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}