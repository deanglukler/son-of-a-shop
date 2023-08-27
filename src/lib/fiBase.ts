import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyBjcbP1dqUYevUsAsPnkR0774cL8pMymPw',
	authDomain: 'son-of-a-shop.firebaseapp.com',
	projectId: 'son-of-a-shop',
	storageBucket: 'son-of-a-shop.appspot.com',
	messagingSenderId: '551891163799',
	appId: '1:551891163799:web:a9835b15594d76b4f8e7d2',
	measurementId: 'G-HL25BG020B'
};

export let app: FirebaseApp;
export let auth: Auth;
export let database: Firestore;

let initialized = false;
export function initFiBase() {
	if (initialized) {
		return console.warn('attempt to init firebase, but its already initialized');
	}
	app = initializeApp(firebaseConfig);
	auth = getAuth(app);
	database = getFirestore(app);
	initialized = true;
}
