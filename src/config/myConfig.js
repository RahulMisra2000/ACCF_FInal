const config = {
  firestoreEmulator: false, // https://firebase.google.com/docs/emulator-suite/install_and_configure
  // After installing and configuring, do firebase emulators:start to start the emulators
  authEmulator: false,
  loggedInUserCanOnlySeeCustomersThatHeCreated: true
};

export default config;
