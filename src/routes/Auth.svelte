<script lang="ts">
	import { onMount } from 'svelte';
	import { getUser, handleSignIn, handleSignOut } from '$lib/stores';
	import {
		GoogleAuthProvider,
		getRedirectResult,
		onAuthStateChanged,
		signInWithRedirect,
		signOut
	} from 'firebase/auth';
	import { auth, initFiBase } from '$lib/fiBase';
	import toast from '../lib/toast';

	onMount(() => {
		initFiBase();

		$handleSignIn = () => signInWithRedirect(auth, new GoogleAuthProvider());
		$handleSignOut = () => {
			signOut(auth)
				.then(() => {
					$getUser = () => {
						return null;
					};
				})
				.catch((error) => {
					console.error(error);
					toast.error('Sign out failed.  Try again.');
				});
		};

		getRedirectResult(auth).catch((error) => {
			toast.error('Error in getRedirectResult');
			// Handle Errors here.
			const errorCode = error.code;
			const errorMessage = error.message;
			// The email of the user's account used.
			const email = error.customData?.email;
			// The AuthCredential type that was used.
			const credential = GoogleAuthProvider.credentialFromError(error);
			// ...
			throw error;
		});

		onAuthStateChanged(auth, (user) => {
			if (user) {
				// User is signed in, see docs for a list of available properties
				// https://firebase.google.com/docs/reference/js/auth.user
				$getUser = () => {
					return user;
				};
			} else {
				$getUser = () => {
					return null;
				};
			}
		});
	});
</script>
