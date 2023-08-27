<script lang="ts">
	import { initFiBase, app, database, auth } from '$lib/fiBase';
	import { userUid } from '$lib/stores';
	import {
		GoogleAuthProvider,
		getRedirectResult,
		onAuthStateChanged,
		signInWithRedirect,
		signOut
	} from 'firebase/auth';
	import { doc, getDoc } from 'firebase/firestore';
	import { onMount } from 'svelte';
	import toast from '../../lib/toast';

	let handleSignIn = () => {};
	let handleSignOut = () => {};

	let isMounted = false;
	onMount(async () => {
		initFiBase();

		handleSignIn = () => signInWithRedirect(auth, new GoogleAuthProvider());
		handleSignOut = () =>
			signOut(auth).catch((error) => {
				toast.error('Sign out failed.  Try again.');
			});

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
				const uid = user.uid;
				$userUid = uid;
			} else {
				$userUid = '';
			}
		});

		isMounted = true;
	});

	let isAdmin = false;
	$: {
		const isAdminCheck = async () => {
			console.log('isAdmin: Checking if isAdmin...');
			if ($userUid) {
				const docRef = doc(database, 'admins', $userUid);
				const docSnap = await getDoc(docRef);
				if (docSnap.exists()) {
					const d = docSnap.data();
					if (d.isAdmin) {
						console.log('isAdmin: True');
						return true;
					} else {
						console.log('isAdmin: False, user exist in database but property isAdmin: false');
						return false;
					}
				} else {
					console.log('isAdmin: False, document for userUid: ' + $userUid + ' doesnt exist');
					return false;
				}
			} else {
				console.log('isAdmin: False, no $userUid');
				return false;
			}
			return false;
		};
		const updateIsAdmin = async () => {
			isAdmin = await isAdminCheck();
		};
		if (isMounted) {
			updateIsAdmin();
		}
	}
</script>

{#if isAdmin}
	<slot />
{:else}
	<h2>not authorized</h2>
{/if}

{#if $userUid}
	<button on:click={handleSignOut}>sign out</button>
{:else}
	<button on:click={handleSignIn}>Sign in</button>
{/if}

<h3>{$userUid}</h3>
