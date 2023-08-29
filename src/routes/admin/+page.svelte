<script lang="ts">
	import {
		GoogleAuthProvider,
		getRedirectResult,
		onAuthStateChanged,
		signInWithRedirect,
		signOut
	} from 'firebase/auth';
	import { onMount } from 'svelte';
	import { initFiBase, auth, storage } from '$lib/fiBase';
	import { userUid } from '$lib/stores';
	import { deleteObject, getDownloadURL, listAll, ref, uploadBytes } from 'firebase/storage';
	import _ from 'lodash';

	import 'toastify-js/src/toastify.css';

	const folderName = Date.now();

	async function handleImageUploaderChange() {
		const fileInput = document.getElementById('image-uploader');
		if (fileInput?.files?.[0]) {
			const file = fileInput?.files?.[0] as File;
			const name = file.name;
			const fileName = `junk/${folderName}/${name}`;
			const storageRef = ref(storage, fileName);
			const snapshot = await uploadBytes(storageRef, file);
			fileInput.value = null;
		}
	}

	type FullPath = string;
	type SavedImg = { fullPath: FullPath; url: string };
	let savedImgs: SavedImg[] = [];
	let deleteQueue: FullPath[] = [];

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

		setInterval(() => {
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
					}
				}
				savedImgs = nextUrls;
			});
		}, 4000);
	});

	function handleDeleteImgClick(fullPath: string) {
		deleteQueue = [...deleteQueue, fullPath];
		console.log(deleteQueue);
	}
</script>

<h1>Admin</h1>

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
