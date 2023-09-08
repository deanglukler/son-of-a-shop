<script lang="ts">
	import { onMount } from 'svelte';
	import { initFiBase, storage } from '$lib/fiBase';
	import { deleteObject, getDownloadURL, listAll, ref, uploadBytes } from 'firebase/storage';
	import _ from 'lodash';
	import type { SavedImg, FullPath } from '$lib/types';
	import Compressor from 'compressorjs';
	import { getImgUrlAndDims } from '../../../lib/getImgUrlAndDims';

	let savedImgs: SavedImg[] = [];
	let deleteQueue: FullPath[] = [];

	export let folderName: string;

	onMount(() => {
		initFiBase();
		updateImgs();
	});

	function compressImg(file: File) {
		return new Promise<File>((res, rej) => {
			new Compressor(file, {
				quality: 0.6,
				width: 700,

				success(result) {
					res(result as File);
				},
				error(err) {
					rej(err);
				}
			});
		});
	}

	function getImageDimensions(imgFile: File) {
		return new Promise<{ width: number; height: number }>((res) => {
			const img = new Image();
			img.src = URL.createObjectURL(imgFile);

			img.onload = function () {
				const width = img.width;
				const height = img.height;
				res({ width, height });
			};
		});
	}

	function renameImageWithDimensions(
		originalFileName: string,
		width: number,
		height: number
	): string {
		const fileExtension = originalFileName.split('.').pop() || '';
		const fileNameWithoutExtension = originalFileName.replace(`.${fileExtension}`, '');
		const newFileName = `${fileNameWithoutExtension}_DIMENSIONS_${width}x${height}.${fileExtension}`;

		return newFileName;
	}

	async function handleImageUploaderChange() {
		const fileInput = document.getElementById('image-uploader') as HTMLFormElement;
		if (!fileInput) {
			console.warn('FILE INPUT DOES NOT EXIST');
		}

		if (fileInput?.files?.[0]) {
			const file = fileInput?.files?.[0] as File;
			const compressedFile = await compressImg(file);
			const { width, height } = await getImageDimensions(compressedFile);
			const name = renameImageWithDimensions(file.name, width, height);
			const fileName = `junk/${folderName}/${name}`;
			const storageRef = ref(storage, fileName);
			const snapshot = await uploadBytes(storageRef, compressedFile);
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
				nextUrls.push({ fullPath: r.fullPath, ...getImgUrlAndDims(dlUrl) });
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

	function handleDeleteImgClick(fullPath: string | undefined) {
		if (!fullPath) {
			throw new Error('cannot delete image if no full path is given');
		}
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
		<img src={img.url} width={150} height={150 * (img.height / img.width)} alt="wtf-is-up" />
	</div>
{/each}
