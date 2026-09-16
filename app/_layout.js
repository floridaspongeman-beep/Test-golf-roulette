import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';

export default function Layout() {
  useEffect(() => {
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      // Remove the old PWA service worker and its caches. A stale cached JS
      // chunk can make Expo Router appear as a blank white screen.
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => registration.unregister());
      });

      if (typeof caches !== 'undefined') {
        caches.keys().then(keys => {
          keys.forEach(key => caches.delete(key));
        });
      }
    }
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}
