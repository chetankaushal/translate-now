import type { ExpoConfig } from 'expo/config';

/**
 * Native config. `expo prebuild` turns this into ios/ and android/ directories.
 * Those dirs are gitignored — CI regenerates them, so they never drift.
 */
const config: ExpoConfig = {
  name: 'Translate Now',
  slug: 'translate-now',
  scheme: 'translatenow',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'dark',

  ios: {
    bundleIdentifier: 'com.movil.translatenow',
    supportsTablet: true,
    buildNumber: '1',
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },

  android: {
    package: 'com.movil.translatenow',
    versionCode: 1,
  },

  plugins: [
    'expo-router',
    'expo-localization',
    [
      'expo-build-properties',
      {
        ios: {
          // See README "Min OS" — iOS 18 is your stated floor.
          deploymentTarget: '18.0',
        },
        android: {
          compileSdkVersion: 36,
          targetSdkVersion: 36,
          // minSdk 24 == Android 7.0. See README for why this is NOT 35.
          minSdkVersion: 24,
        },
      },
    ],
  ],

  experiments: {
    typedRoutes: true,
  },
};

export default config;
