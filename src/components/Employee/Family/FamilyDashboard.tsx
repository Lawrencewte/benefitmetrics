import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function FamilyDashboard() {
  // This would normally connect to a data provider
  const familyStats = {
    upToDate: 2,
    dueThisMonth: 1,
    overdue: 1,
    totalAppointments: 4,
    upcomingAppointments: 2,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Family Health Status</Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <View style={[styles.iconContainer, styles.greenBackground]}>
            <CheckCircle size={20} color="#059669" />
          </View>
          <Text style={[styles.statNumber, styles.greenText]}>{familyStats.upToDate}</Text>
          <Text style={styles.statLabel}>Up to Date</Text>
        </View>
        
        <View style={styles.statItem}>
          <View style={[styles.iconContainer, styles.yellowBackground]}>
            <Clock size={20} color="#D97706" />
          </View>
          <Text style={[styles.statNumber, styles.yellowText]}>{familyStats.dueThisMonth}</Text>
          <Text style={styles.statLabel}>Due Soon</Text>
        </View>
        
        <View style={styles.statItem}>
          <View style={[styles.iconContainer, styles.redBackground]}>
            <AlertTriangle size={20} color="#DC2626" />
          </View>
          <Text style={[styles.statNumber, styles.redText]}>{familyStats.overdue}</Text>
          <Text style={styles.statLabel}>Overdue</Text>
        </View>
      </View>
      
      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total scheduled appointments</Text>
          <Text style={styles.summaryValue}>{familyStats.totalAppointments}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Upcoming appointments</Text>
          <Text style={styles.summaryValue}>{familyStats.upcomingAppointments}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  greenBackground: {
    backgroundColor: '#DCFCE7',
  },
  yellowBackground: {
    backgroundColor: '#FEF3C7',
  },
  redBackground: {
    backgroundColor: '#FEE2E2',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  greenText: {
    color: '#059669',
  },
  yellowText: {
    color: '#D97706',
  },
  redText: {
    color: '#DC2626',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  summaryContainer: {
    gap: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
});