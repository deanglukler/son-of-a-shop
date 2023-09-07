import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, cert, type ServiceAccount, type FirebaseError } from 'firebase-admin/app';
import serviceAccount from '../../private-ignore/son-of-a-shop-firebase-adminsdk-8s02y-10edc2b8d8.json';
import { getStorage } from 'firebase-admin/storage';

try {
	initializeApp({
		credential: cert(serviceAccount as ServiceAccount)
	});
} catch (err) {
	if ((err as FirebaseError).code === 'app/duplicate-app') {
		console.log('firestore app/duplicate-app error, ignoring...');
	} else {
		throw err;
	}
}

export const database = getFirestore();
export const storage = getStorage().bucket('gs://son-of-a-shop.appspot.com');
