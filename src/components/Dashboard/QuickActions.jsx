import { useRouter } from 'expo-router';
import { Calendar, CheckCircle, FileText, Gift } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function QuickActions() {
  const router = useRouter();

  const actions = [
    { 
      id: 1, 
      icon: Calendar, 
      title: 'Schedule Appointment', 
      route: '/appointments' 
    },
    { 
      id: 2, 
      icon: CheckCircle, 
      title: 'Checkup Timeline', 
      route: '/checkups' 
    },
    { 
      id: 3, 
      icon: Gift, 
      title: 'Redeem Rewards', 
      route: '/incentives' 
    },
    { 
      id: 4, 
      icon: FileText, 
      title: 'Wellness Tips', 
      route: '/tips' 
    },
  ];

  const handleActionPress = (route) => {
    router.push(route);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      
      <View style={styles.actionsGrid}>
        {actions.map((action) => (
          <Pressable
            key={action.id}
            style={styles.actionCard}
            onPress={() => handleActionPress(action.route)}
          >
            <action.icon size={24} color="#3B82F6" style={styles.actionIcon} />
            <Text style={styles.actionText}>{action.title}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  actionIcon: {
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});