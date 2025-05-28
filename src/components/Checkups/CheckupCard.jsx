import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function CheckupCard({ checkup, onSchedule }) {
  const getStatusStyles = (status) => {
    switch (status) {
      case 'Scheduled':
        return {
          container: styles.scheduledBadge,
          text: styles.scheduledText,
        };
      case 'Due Soon':
        return {
          container: styles.dueSoonBadge,
          text: styles.dueSoonText,
        };
      case 'Overdue':
        return {
          container: styles.overdueBadge,
          text: styles.overdueText,
        };
      default:
        return {
          container: styles.dueSoonBadge,
          text: styles.dueSoonText,
        };
    }
  };

  const statusStyles = getStatusStyles(checkup.status);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.checkupName}>{checkup.name}</Text>
        <View style={statusStyles.container}>
          <Text style={statusStyles.text}>{checkup.status}</Text>
        </View>
      </View>
      
      <Text style={styles.checkupDetail}>
        Recommended frequency: <Text style={styles.detailValue}>{checkup.frequency}</Text>
      </Text>
      <Text style={styles.checkupDetail}>
        Last completed: <Text style={styles.detailValue}>{checkup.lastDate}</Text>
      </Text>
      <Text style={styles.checkupDetail}>
        Next due: <Text style={styles.detailValue}>{checkup.nextDue}</Text>
      </Text>
      
      {checkup.status !== 'Scheduled' && (
        <Pressable
          style={styles.button}
          onPress={onSchedule}
        >
          <Text style={styles.buttonText}>Schedule Now</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  checkupName: {
    fontWeight: '600',
    fontSize: 15,
  },
  scheduledBadge: {
    backgroundColor: '#DEF7EC',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  scheduledText: {
    color: '#057A55',
    fontSize: 12,
    fontWeight: '500',
  },
  dueSoonBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  dueSoonText: {
    color: '#D97706',
    fontSize: 12,
    fontWeight: '500',
  },
  overdueBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  overdueText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '500',
  },
  checkupDetail: {
    fontSize: 14,
    marginTop: 6,
  },
  detailValue: {
    color: '#6B7280',
  },
  button: {
    backgroundColor: '#3B82F6',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 14,
  },
});