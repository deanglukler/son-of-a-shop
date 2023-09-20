<script lang="ts">
	import { database } from '$lib/fiBase';
	import { doc, getDoc } from 'firebase/firestore';
	import { onMount } from 'svelte';
	import { getUser, handleSignIn } from '../stores';
	import Button from './Button.svelte';

	let isAdmin = false;

	let isMounted = false;
	onMount(() => {
		isMounted = true;
	});

	$: {
		const isAdminCheck = async () => {
			console.log('isAdmin: Checking if isAdmin...');

			const user = $getUser();

			if (!user) {
				console.log('isAdmin false, no user');
				return false;
			}

			const docRef = doc(database, 'admins', user.uid);
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
				console.log('isAdmin: False, document for userUid: ' + user.uid + ' doesnt exist');
				return false;
			}
			return false; // for safety
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
	<h2>Not Authorized</h2>
	{#if !$getUser()}
		<Button onClick={$handleSignIn}>Sign In</Button>
	{/if}
{/if}
