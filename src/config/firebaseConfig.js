import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
// eslint-disable-next-line import/extensions
import config from './myConfig';

const firebaseConfig = {
  apiKey: 'AIzaSyBgWB_v1TeSCMOSAOsb0PaZ5ZMjSBedf-0',
  authDomain: 'rm2000app.firebaseapp.com',
  databaseURL: 'https://rm2000app.firebaseio.com',
  projectId: 'rm2000app',
  storageBucket: 'rm2000app.appspot.com',
  messagingSenderId: '182856118453',
  appId: '1:182856118453:web:6b421ccbc1d1b6a7b4cefc',
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();
console.dir(auth);

if (config.firestoreEmulator) {
  db.useEmulator('localhost', 8080);
  console.log('Firestore Emulator is being used');
}

if (config.authEmulator) {
  console.log('1');
  auth.useEmulator('http://localhost:9099');
  console.log('Auth Emulator is being used');
}

const firebaseProducts = {
  db,
  auth
};

export default firebaseProducts;
