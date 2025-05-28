import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Badge from '../Common/Badge';
import Card from '../Common/Card';

/**
 * AppointmentsCard component for displaying appointment information
 * @param {Object} appointment - Appointment data
 * @param {function} onPress - Function to call when card is pressed
 * @param {Object} style - Additional style to apply
 */
export default function AppointmentsCard({ appointment, onPress, style }) {
  const router = useRouter();
  
  const handlePress = () => {
    if (onPress) {
      onPress(appointment);
    } else {
      // Default navigation if no onPress handler provided
      router.push({
        pathname: '/appointment-details',
        params: { id: appointment.id }
      });
    }
  };
  
  // Determine badge type based on appointment status
  const getBadgeType = (confirmed) => {
    return confirmed ? 'success' : 'warning';
  };
  
  // Determine badge text based on appointment status
  const getBadgeText = (confirmed) => {
    return confirmed ? 'Confirmed' : 'Pending';
  };
  
  return (
    <Card style={[styles.card, style]}>
      <Pressable onPress={handlePress} style={styles.pressable}>
        <View style={styles.headerRow}>
          <Text style={styles.appointmentType}>
            {appointment.type}
          </Text>
          <Badge
            type={getBadgeType(appointment.confirmed)}
            text={getBadgeText(appointment.confirmed)}
          />
        </View>
        
        <Text style={styles.appointmentDetail}>
          {appointment.date} at {appointment.time}
        </Text>
        
        <Text style={styles.appointmentDetail}>
          {appointment.doctor}
        </Text>
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 0,
  },
  pressable: {
    padding: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  appointmentType: {
    fontWeight: '600',
    fontSize: 15,
  },
  appointmentDetail: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
});