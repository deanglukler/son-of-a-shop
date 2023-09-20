<script lang="ts">
	import _ from 'lodash';
	import { doc, getDoc, updateDoc } from 'firebase/firestore';
	import { database, initFiBase } from '$lib/fiBase';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import toast from '$lib/toast';
	import AdImages from './AdImages.svelte';
	import { activeInfo, documentTitleExtension } from '../../../lib/stores';

	let ad: null | any = null;

	$documentTitleExtension = 'Ad Editor';

	let isMounted = false;
	onMount(async () => {
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

	const debounceFormChange = _.debounce(async () => {
		if (!isMounted) return;
		$activeInfo = 'Saving, please wait...';
		const adDoc = doc(database, `ads/${$page.params.slug}`);
		try {
			await updateDoc(adDoc, ad);
			$activeInfo = 'Saved.';
		} catch (error) {
			console.error(error);
			toast.error('Error updating ad');
			$activeInfo = 'Error saving, will retry soon...';
			setTimeout(debounceFormChange, 1500);
		}
	}, 700);
</script>

{#if ad}
	<form on:input={debounceFormChange} class="max-w-md">
		<h3 class="heading-gray mb-3">Ad Details</h3>
		<div class="flex flex-col gap-3">
			<input
				name="title"
				type="text"
				bind:value={ad.title}
				placeholder="Title"
				class="hoverable-border rounded-sm p-2"
			/>
			<input
				name="price"
				type="text"
				bind:value={ad.price}
				placeholder="Price"
				class="hoverable-border rounded-sm p-2"
			/>
			<textarea
				name="description"
				placeholder="Description"
				bind:value={ad.description}
				class="hoverable-border rounded-sm h-40 p-2"
			/>
		</div>
	</form>
	<h3 class="heading-gray my-3">Images</h3>
	<AdImages folderName={ad.id} />
{/if}
