import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Footer from '../Common/Footer';
import Header from '../Common/Header';

/**
 * AppLayout component for consistent app layout with header and footer
 * @param {ReactNode} children - Content to render
 * @param {string} title - Header title
 * @param {number} notifications - Number of notifications
 * @param {boolean} showNotificationAlert - Whether to show notification alert
 * @param {Object} headerProps - Additional props for header
 * @param {Object} footerProps - Additional props for footer
 * @param {Object} contentStyle - Additional style for content container
 */
export default function AppLayout({
  children,
  title,
  notifications,
  showNotificationAlert,
  headerProps,
  footerProps,
  contentStyle,
}) {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      <Header
        title={title}
        notifications={notifications}
        showNotificationAlert={showNotificationAlert}
        {...headerProps}
      />
      
      <View style={[styles.content, contentStyle]}>
        {children}
      </View>
      
      <Footer {...footerProps} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
  },
});