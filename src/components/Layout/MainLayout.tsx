import { StatusBar } from 'expo-status-bar';
import React, { ReactNode } from 'react';
import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNotifications } from '../../context/Common/NotificationsContext';
import { useUser } from '../../context/UserContext';
import Footer from '../Common/layout/Footer';
import Header from '../Common/layout/Header';

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  scrollable?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  headerProps?: object;
  footerProps?: object;
  safeAreaEdges?: ('top' | 'right' | 'bottom' | 'left')[];
}

/**
 * MainLayout component - primary layout for authenticated screens
 */
export default function MainLayout({
  children,
  title,
  showHeader = true,
  showFooter = true,
  scrollable = true,
  contentStyle,
  headerProps,
  footerProps,
  safeAreaEdges = ['top'],
}: MainLayoutProps) {
  const { userData } = useUser();
  const { unreadCount, notificationSettings } = useNotifications();
  
  const Content = scrollable ? ScrollView : View;
  const contentProps = scrollable ? { contentContainerStyle: styles.scrollContent } : {};
  
  return (
    <SafeAreaView style={styles.container} edges={safeAreaEdges}>
      <StatusBar style="light" />
      
      {showHeader && (
        <Header
          title={title}
          notifications={unreadCount}
          showNotificationAlert={userData.showNotificationAlert && notificationSettings.pushEnabled}
          {...headerProps}
        />
      )}
      
      <Content
        style={[styles.content, contentStyle]}
        {...contentProps}
      >
        {children}
      </Content>
      
      {showFooter && <Footer {...footerProps} />}
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
  scrollContent: {
    padding: 16,
  },
});