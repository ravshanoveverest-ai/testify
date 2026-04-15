import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.testify.app',
  appName: 'Testify',
  webDir: 'public',
  server: {
    url: 'https://testifyuz.netlify.app',
    cleartext: true
  }
};

export default config;