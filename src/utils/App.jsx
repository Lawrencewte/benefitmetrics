import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppointmentProvider } from '../context/employee/AppointmentContext';
import { BenefitsProvider } from '../context/employee/BenefitsContext';
import { ChallengesProvider } from '../context/employee/ChallengesContext';
import { IncentivesProvider } from '../context/IncentivesContext';
import { UserProvider } from '../context/UserContext';
import { WellnessProvider } from '../context/WellnessContext';

export default function App({ children }) {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <AppointmentProvider>
          <ChallengesProvider>
            <IncentivesProvider>
              <BenefitsProvider>
                <WellnessProvider>
                  {children}
                </WellnessProvider>
              </BenefitsProvider>
            </IncentivesProvider>
          </ChallengesProvider>
        </AppointmentProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
}