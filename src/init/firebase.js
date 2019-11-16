import * as firebase from 'firebase';
// import firestore from 'firebase/firestore';

const settings = { timestampsInSnapshots: true };

const config = {
  apiKey: "AIzaSyBeKqtSlvbjUSWD3fVRTCU0XR0n3HrVN6o",
  authDomain: "iotbeta.firebaseapp.com",
  databaseURL: "https://iotbeta.firebaseio.com",
  projectId: "iotbeta",
  storageBucket: "iotbeta.appspot.com",
  messagingSenderId: "823475463988",
  appId: "1:823475463988:web:c313cc7a3c5faffc"
  };
firebase.initializeApp(config);

firebase.firestore().settings(settings);

export default firebase;