import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.d3590b81c81449329e6d4fbda085725b',
  appName: 'oxia',
  webDir: 'dist',
  // For local development on emulator, comment out the server section
  // server: {
  //   url: "https://d3590b81-c814-4932-9e6d-4fbda085725b.lovableproject.com?forceHideBadge=true",
  //   cleartext: true
  // },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: "#ffffff",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#999999",
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: "launch_screen",
      useDialog: true,
    },
  },
};

export default config;