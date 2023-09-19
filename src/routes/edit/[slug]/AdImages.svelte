<script lang="ts">
	import { onMount } from 'svelte';
	import { initFiBase, storage } from '$lib/fiBase';
	import {
		deleteObject,
		getDownloadURL,
		listAll,
		ref,
		uploadBytes,
		type StorageReference
	} from 'firebase/storage';
	import _ from 'lodash';
	import type { FullPath } from '$lib/types';
	import Compressor from 'compressorjs';
	import CenterSquareImg from '../../../lib/components/CenterSquareImg.svelte';
	import CloseCircleOutline from '../../../lib/icons/CloseCircleOutline.svelte';
	import toast from '../../../lib/toast';

	const fallbackImg =
		'data:image/png;base64,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';

	type EditAdImg = {
		fullPath: FullPath;
		downloadUrl: string | null;
		storageRef: StorageReference;
		status: 'UPLOADING' | 'DELETING' | 'ACTIVE' | 'LOADING';
	};

	let editAdImgs: { [key: FullPath]: EditAdImg } = {};

	export let folderName: string;

	onMount(() => {
		initFiBase();

		async function getActiveImgs() {
			const storageRef = ref(storage, `/junk/${folderName}`);
			try {
				const imgList = await listAll(storageRef);
				const dlUrlsPromises: Promise<string>[] = [];
				imgList.items.forEach((imgRef) => {
					const downloadUrl = getDownloadURL(imgRef);
					dlUrlsPromises.push(downloadUrl);
				});
				const downloadUrls = await Promise.all(dlUrlsPromises);
				imgList.items.forEach((imgRef, i) => {
					editAdImgs[imgRef.fullPath] = {
						fullPath: imgRef.fullPath,
						downloadUrl: fallbackImg,
						status: 'LOADING',
						storageRef: imgRef
					};
					const img = new Image();
					img.onload = () => {
						editAdImgs[imgRef.fullPath].downloadUrl = img.src;
						editAdImgs[imgRef.fullPath].status = 'ACTIVE';
						editAdImgs = editAdImgs;
					};
					img.src = downloadUrls[i];
				});
				editAdImgs = editAdImgs;
			} catch (error) {
				console.error(error);
				toast.error('Error fetching ad images');
			}
		}
		getActiveImgs();
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

	let uploadQueue: File[] = [];

	async function processUpload(file: File) {
		const compressedFile = await compressImg(file);
		const { width, height } = await getImageDimensions(compressedFile);
		const name = renameImageWithDimensions(file.name, width, height);
		const fullPath = `junk/${folderName}/${name}` as FullPath;

		if (editAdImgs[fullPath]) {
			console.warn('Attempting to upload duplicate: ' + fullPath);
			return Promise.reject('cannot upload duplicate image fullPath');
		}

		const storageRef = ref(storage, fullPath);

		editAdImgs[fullPath] = { fullPath, downloadUrl: null, status: 'UPLOADING', storageRef };

		try {
			const uploadResult = await uploadBytes(storageRef, compressedFile);
			const downloadUrl = await getDownloadURL(uploadResult.ref);
			editAdImgs[fullPath] = {
				...editAdImgs[fullPath],
				downloadUrl: fallbackImg,
				status: 'LOADING',
				storageRef
			};

			const img = new Image();
			img.onload = () => {
				editAdImgs[fullPath].downloadUrl = img.src;
				editAdImgs[fullPath].status = 'ACTIVE';
				editAdImgs = editAdImgs;
			};
			img.src = downloadUrl;

			return uploadResult;
		} catch (error) {
			delete editAdImgs[fullPath];
			editAdImgs = editAdImgs;
			console.error(error);
			return Promise.reject(error);
		}
	}

	function processUploadQueue() {
		uploadsInProgress = true;
		const uploadPromises = [];
		while (uploadQueue.length) {
			const file = uploadQueue.shift() as File;
			uploadPromises.push(processUpload(file));
		}
		uploadQueue = uploadQueue;
		Promise.all(uploadPromises)
			.catch((err) => {
				console.error('Error uploading batch, first error only (there may be more)');
				console.error(err);
				toast.error('Something went wrong uploading images');
			})
			.finally(() => {
				uploadsInProgress = false;
			});
	}

	let uploadsInProgress = false;
	async function handleImageUploaderChange() {
		const input = document.getElementById('image-uploader') as HTMLFormElement;
		const fileList = input.files as FileList;

		if (fileList.length > 15) {
			throw new Error('Max file uploads is 15');
		}

		if (fileList.length === 0) {
			return console.warn('no files in file input');
		}

		for (let i = 0; i <= fileList.length; i++) {
			const file = fileList.item(i);
			if (file) {
				uploadQueue.push(file);
			}
		}
		input.value = null;
		uploadQueue = uploadQueue;

		processUploadQueue();
	}

	async function handleDeleteImgClick(adImg: EditAdImg) {
		editAdImgs[adImg.fullPath].status = 'DELETING';
		editAdImgs = editAdImgs;
		try {
			await deleteObject(adImg.storageRef);
			delete editAdImgs[adImg.fullPath];
			editAdImgs = editAdImgs;
		} catch (error) {
			console.error(error);
			toast.error('Error deleting, try again.');
			editAdImgs[adImg.fullPath].status = 'ACTIVE';
		}
	}
</script>

<div class="mb-3">
	<label
		class="imgs-file-input relative p-5 min-w-fit inline-block hoverable-border rounded-sm cursor-pointer"
		class:border-neutral-200={uploadsInProgress}
	>
		{#if !uploadsInProgress}
			<span class="left-0">Select Images...</span>
		{:else}
			<span class="left-0 text-neutral-300">Working</span>
		{/if}
		<input
			on:change={handleImageUploaderChange}
			id="image-uploader"
			type="file"
			accept="image/jpg,image/png"
			class="opacity-0 w-0 absolute"
			multiple
			disabled={uploadsInProgress}
		/>
	</label>
</div>

<div class="ad-imgs max-w-md">
	{#each _.values(editAdImgs) as adImg}
		{#if adImg.status === 'UPLOADING'}
			<CenterSquareImg url={fallbackImg} size="130px" />
		{:else if adImg.status === 'DELETING'}
			<div class="ad-img" style:opacity="0.6">
				<CenterSquareImg url={adImg.downloadUrl || 'something is wrong'} size="130px" />
			</div>
		{:else}
			<div class="relative ad-img">
				<button
					class="backdrop-blur-sm bg-opacity-50 bg-neutral-50 rounded-full w-8 h-8 absolute top-1 right-1 ad-img-delete"
					on:click={() => handleDeleteImgClick(adImg)}><CloseCircleOutline /></button
				>
				<CenterSquareImg url={adImg.downloadUrl || 'something is wrong'} size="130px" />
			</div>
		{/if}
	{/each}
</div>

<style lang="scss">
	.ad-imgs {
		display: grid;
		grid-template-columns: repeat(auto-fill, 130px);
		gap: 10px;
	}

	.ad-img {
		& .ad-img-delete {
			opacity: 0;
			transition: all ease-in-out 50ms;
		}

		&:hover {
			& .ad-img-delete {
				opacity: 1;
			}
		}
	}

	.imgs-file-input {
		& input {
			opacity: 0;
		}
	}
</style>
