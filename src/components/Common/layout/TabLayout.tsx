import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Footer, { FooterTabItem } from './Footer';
import Header from './Header';

interface TabLayoutProps {
  children: React.ReactNode;
  tabs: FooterTabItem[];
  activeTab: string;
  onTabPress: (tabId: string) => void;
  headerTitle?: string;
  showBackButton?: boolean;
  showNotifications?: boolean;
  showProfile?: boolean;
  notificationCount?: number;
  onNotificationsPress?: () => void;
  onProfilePress?: () => void;
  headerBackgroundColor?: string;
  headerTextColor?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  footerBackgroundColor?: string;
  footerActiveColor?: string;
  footerInactiveColor?: string;
  scrollable?: boolean;
  style?: any;
  contentContainerStyle?: any;
}

const TabLayout: React.FC<TabLayoutProps> = ({
  children,
  tabs,
  activeTab,
  onTabPress,
  headerTitle,
  showBackButton = false,
  showNotifications = false,
  showProfile = false,
  notificationCount = 0,
  onNotificationsPress,
  onProfilePress,
  headerBackgroundColor,
  headerTextColor,
  showHeader = true,
  showFooter = true,
  footerBackgroundColor,
  footerActiveColor,
  footerInactiveColor,
  scrollable = true,
  style,
  contentContainerStyle,
}) => {
  const Content = () => (
    <View style={[styles.content, contentContainerStyle]}>
      {scrollable ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        children
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, style]} edges={['left', 'right']}>
      {showHeader && (
        <Header
          title={headerTitle}
          showBackButton={showBackButton}
          showNotifications={showNotifications}
          showProfile={showProfile}
          notificationCount={notificationCount}
          onNotificationsPress={onNotificationsPress}
          onProfilePress={onProfilePress}
          backgroundColor={headerBackgroundColor}
          textColor={headerTextColor}
        />
      )}

      <Content />

      {showFooter && (
        <Footer
          tabs={tabs}
          activeTab={activeTab}
          onTabPress={onTabPress}
          backgroundColor={footerBackgroundColor}
          activeColor={footerActiveColor}
          inactiveColor={footerInactiveColor}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // gray-50
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});

export default TabLayout;