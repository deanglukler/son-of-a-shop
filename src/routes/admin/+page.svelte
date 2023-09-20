<script lang="ts">
	import { onMount } from 'svelte';
	import { database, storage } from '$lib/fiBase';
	import _ from 'lodash';

	import { Timestamp, collection, doc, getDocs, setDoc } from 'firebase/firestore';
	import Button from '$lib/components/Button.svelte';
	import CenterSquareImg from '$lib/components/CenterSquareImg.svelte';
	import type { AdParsedWithId } from '$lib/types';
	import { safelyParseAd } from '$lib/safelyParseAd';
	import { getDownloadURL, listAll, ref } from 'firebase/storage';

	type AdParsedWithIdAndImg = AdParsedWithId & { imgUrl: string };

	let adsData: AdParsedWithIdAndImg[] = [];
	onMount(async () => {
		const ads = await getDocs(collection(database, 'ads'));
		const nxtAdsData: AdParsedWithId[] = [];

		ads.forEach(async (a) => {
			const data = safelyParseAd(a.data());
			nxtAdsData.push({ id: a.id, ...data });
		});

		const imgUrls: Promise<string>[] = nxtAdsData.map(async (a) => {
			const imgsListRef = ref(storage, '/junk/' + a.id);
			return listAll(imgsListRef).then((imgsList) => {
				let imgUrl = '';

				for (let x of imgsList.items) {
					if (imgUrl === '') {
						return getDownloadURL(x);
					}
				}
				throw new Error('There was probably an ad without an image or something..');
			});
		});

		const urls = await Promise.all(imgUrls);

		const nxtAdsDataWithImg = nxtAdsData.map((a, i) => {
			return { ...a, imgUrl: urls[i] };
		});
		adsData = [...nxtAdsDataWithImg];
	});

	async function handleNewAdOnClick() {
		const ts = Timestamp.now();
		const newAd = { description: '', title: '', price: '', createdAt: ts, updatedAt: ts };
		const newAdRef = doc(collection(database, 'ads'));
		await setDoc(newAdRef, newAd);
		window.location.href = `/edit/${newAdRef.id}`;
	}
</script>

<div class="mb-10">
	<h2 class="heading-gray mb-3">Ads</h2>
	<div class="ad-grid">
		{#each adsData as ad}
			<a href={`edit/${ad.id}`}
				><div>
					<CenterSquareImg url={ad.imgUrl} size={'250px'} />
					<h3 class="text-lg text-neutral-700 mt-3">{ad.title}</h3>
				</div></a
			>
		{/each}
	</div>
</div>

<Button onClick={handleNewAdOnClick}>New Ad</Button>

<style lang="scss">
	.ad-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, 250px);
		row-gap: 40px;
		column-gap: 25px;
		& a {
			display: inline-block;
		}
	}
</style>
