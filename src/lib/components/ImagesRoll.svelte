<script lang="ts">
	import _ from 'lodash';
	import ArrowBackOutline from '../icons/ArrowBackOutline.svelte';
	import ArrowForwardOutline from '../icons/ArrowForwardOutline.svelte';
	import CenterSquareImg from './CenterSquareImg.svelte';

	export let imgs: string[] = [];

	let featuredImgIdx = 0;

	function handleNextClick() {
		featuredImgIdx = (featuredImgIdx + 1) % imgs.length;
	}
	function handlePreviousClick() {
		featuredImgIdx = (featuredImgIdx + imgs.length - 1) % imgs.length;
	}
</script>

<div class="relative img-container overflow-hidden">
	<div
		class="img-blur fullsize"
		style:background-image={`url(${imgs[featuredImgIdx] || 'no images in array'})`}
	/>
	<div class="img-gradient-bg fullsize" />
	<div
		class="img-img fullsize"
		style:background-image={`url(${imgs[featuredImgIdx] || 'no images in array'})`}
	/>
	{#if imgs.length > 1}
		<button
			class="bg-white border-2 w-10 h-10 rounded-sm opacity-80 absolute left-2 top-1/2 cursor-pointer"
			on:click={handlePreviousClick}
		>
			<ArrowBackOutline />
		</button>
		<button
			class="bg-white border-2 w-10 h-10 rounded-sm opacity-80 absolute right-2 top-1/2 cursor-pointer"
			on:click={handleNextClick}
		>
			<ArrowForwardOutline />
		</button>
	{/if}
</div>

<div class="w-fit mx-auto">
	<div class="flex flex-wrap gap-2 mt-2 mx-auto">
		{#each imgs as i}
			<div class="w-14 sm:w-20">
				<CenterSquareImg url={i} />
			</div>
		{/each}
	</div>
</div>

<style lang="scss">
	.img-container {
		width: 100%;
		padding-top: 100%;
	}
	.fullsize {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
	}
	.img-img {
		background-size: contain;
		background-repeat: no-repeat;
		background-position: center;
	}
	.img-blur {
		opacity: 0.4;
		filter: blur(15px);
	}
	.img-gradient-bg {
		background: linear-gradient(to top, transparent 80%, rgba(255, 255, 255, 1)),
			linear-gradient(to right, transparent 80%, rgba(255, 255, 255, 1)),
			linear-gradient(to bottom, transparent 80%, rgba(255, 255, 255, 1)),
			linear-gradient(to left, transparent 80%, rgba(255, 255, 255, 1));
	}
</style>
