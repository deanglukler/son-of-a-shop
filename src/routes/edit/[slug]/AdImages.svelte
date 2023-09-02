<script lang="ts">
	import { onMount } from 'svelte';
	import { initFiBase, storage } from '$lib/fiBase';
	import { deleteObject, getDownloadURL, listAll, ref, uploadBytes } from 'firebase/storage';
	import _ from 'lodash';

	type FullPath = string;
	type SavedImg = { fullPath: FullPath; url: string };

	let savedImgs: SavedImg[] = [];
	let deleteQueue: FullPath[] = [];

	export let folderName: string;

	onMount(() => {
		initFiBase();
		updateImgs();
	});

	async function handleImageUploaderChange() {
		const fileInput = document.getElementById('image-uploader') as HTMLFormElement;
		if (!fileInput) {
			console.warn('FILE INPUT DOES NOT EXIST');
		}

		if (fileInput?.files?.[0]) {
			const file = fileInput?.files?.[0] as File;
			const name = file.name;
			const fileName = `junk/${folderName}/${name}`;
			const storageRef = ref(storage, fileName);
			const snapshot = await uploadBytes(storageRef, file);
			debounceUpdateImgs();
			fileInput.value = null;
		}
	}

	function updateImgs() {
		const folderStorageRef = ref(storage, `junk/${folderName}`);
		listAll(folderStorageRef).then(async (res) => {
			const nextUrls: SavedImg[] = [];
			for (const r of res.items) {
				const dlUrl = await getDownloadURL(r);
				nextUrls.push({ fullPath: r.fullPath, url: dlUrl });
				console.log(r.fullPath);
				if (_.includes(deleteQueue, r.fullPath)) {
					console.log('deleting ' + r.fullPath);
					await deleteObject(r);
					deleteQueue = deleteQueue.filter((x) => x === r.fullPath);
					updateImgs();
				}
			}
			savedImgs = nextUrls;
		});
	}

	const debounceUpdateImgs = _.debounce(updateImgs, 1500);

	function handleDeleteImgClick(fullPath: string) {
		deleteQueue = [...deleteQueue, fullPath];
		updateImgs();
	}
</script>

<h3>Image Uploader</h3>
<input
	on:change={handleImageUploaderChange}
	id="image-uploader"
	type="file"
	accept="image/jpg,image/png"
/>

{#each savedImgs as img}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div on:click={() => handleDeleteImgClick(img.fullPath)}>
		<img src={img.url} height="100" alt="wtf-is-up" />
	</div>
{/each}
