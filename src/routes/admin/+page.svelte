<script lang="ts">
	import {
		GoogleAuthProvider,
		getRedirectResult,
		onAuthStateChanged,
		signInWithRedirect,
		signOut
	} from 'firebase/auth';
	import { onMount } from 'svelte';
	import { initFiBase, auth } from '$lib/fiBase';
	import { userUid } from '$lib/stores';

	import 'toastify-js/src/toastify.css';

	onMount(() => {
		initFiBase();

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
	});
</script>

<h1>Admin</h1>
