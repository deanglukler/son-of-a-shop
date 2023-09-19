<script lang="ts">
	import CenterSquareImg from '$lib/components/CenterSquareImg.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
	const ads = data.ads;

	const IMG_SIZE = 250;
	const CARD_WIDTH = `repeat(auto-fill, ${IMG_SIZE}px)`;
</script>

<div class="ad-grid" style:grid-template-columns={CARD_WIDTH}>
	{#each ads as ad}
		<div>
			<CenterSquareImg size={IMG_SIZE + 'px'} url={ad.imgs[0]?.url} />
			<h2 class="font-semibold text-lg mt-2 mb-1">{ad.title}</h2>
			<p>{ad.description}</p>
		</div>
	{/each}
</div>

<style>
	.ad-grid {
		display: grid;
		grid-auto-rows: 350px;
		grid-gap: 16px;
	}
</style>
