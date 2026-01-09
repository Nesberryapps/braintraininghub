import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.nesberry.braintraining',
  appName: 'Brain Training Hub',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    hostname: 'app',
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    }
  }
};

export default config;
