<script lang="ts">
	import { onAuthStateChanged } from 'firebase/auth';
	import { onMount } from 'svelte';
	import { initFiBase, auth, database } from '$lib/fiBase';
	import { userUid } from '$lib/stores';
	import _ from 'lodash';

	import { Timestamp, collection, doc, getDocs, setDoc } from 'firebase/firestore';
	import Button from '../../lib/components/Button.svelte';

	let adsData: any[] = [];
	onMount(async () => {
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

		const ads = await getDocs(collection(database, 'ads'));
		const nxtAdsData: any[] = [];
		ads.forEach((a) => {
			nxtAdsData.push({ id: a.id, ...a.data() });
		});
		adsData = [...nxtAdsData];
	});

	async function handleNewAdOnClick() {
		const ts = Timestamp.now();
		const newAd = { description: '', title: '', price: '', createdAt: ts, updatedAt: ts };
		const newAdRef = doc(collection(database, 'ads'));
		await setDoc(newAdRef, newAd);
		window.location.href = `/edit/${newAdRef.id}`;
	}
</script>

<h1>Admin</h1>

<h2>Ads</h2>
<ul>
	{#each adsData as ad}
		<li><a href={`edit/${ad.id}`}>{ad.title}</a></li>
	{/each}
</ul>

<Button onClick={handleNewAdOnClick}>New Ad</Button>
