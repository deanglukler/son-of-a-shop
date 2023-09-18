<script lang="ts">
	import _ from 'lodash';
	import AdminOnly from '$lib/components/AdminOnly.svelte';
	import { doc, getDoc, updateDoc } from 'firebase/firestore';
	import { database, initFiBase } from '$lib/fiBase';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import toast from '$lib/toast';
	import AdImages from './AdImages.svelte';

	let ad: null | any = null;

	let isMounted = false;
	onMount(async () => {
		const asdf = page;
		initFiBase();
		const slug = $page.params.slug;
		const adDoc = doc(database, `ads/${slug}`);
		const adSnapshot = await getDoc(adDoc);
		if (adSnapshot.exists()) {
			ad = { ...adSnapshot.data(), id: adDoc.id };
		} else {
			ad = null;
			toast.error('Ad does not exist');
		}
		isMounted = true;
	});
	const debounceFormChange = _.debounce(() => {
		if (!isMounted) return;
		const adDoc = doc(database, `ads/${$page.params.slug}`);
		updateDoc(adDoc, ad).catch((e) => {
			console.error(e);
			toast.error('Error updating ad');
		});
	}, 1000);
</script>

<AdminOnly>
	{#if ad}
		<form on:change={debounceFormChange} class="max-w-md">
			<h3 class="heading-grey mb-3">Ad Details</h3>
			<div class="flex flex-col gap-3">
				<input
					name="title"
					type="text"
					bind:value={ad.title}
					placeholder="Title"
					class="border p-2"
				/>
				<textarea
					name="description"
					placeholder="Description"
					bind:value={ad.description}
					class="border h-40 p-2"
				/>
			</div>
		</form>
		<h3 class="heading-grey my-3">Images</h3>
		<AdImages folderName={ad.id} />
	{/if}
</AdminOnly>
