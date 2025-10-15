module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: ['./assets/fonts/'],
  dependencies: {
    // Add any additional dependencies here
  },
  commands: [
    {
      name: 'set-icon',
      description: 'Set the app icon',
      func: async () => {
        const { setIcon } = require('@bam.tech/react-native-make');
        await setIcon({
          iconPath: './assets/appIcon.png',
          platforms: { ios: true, android: true },
          ios: {
            iconPath: './assets/appIcon.png',
          },
          android: {
            iconPath: './assets/appIcon.png',
          },
        });
      },
    },
  ],
};
