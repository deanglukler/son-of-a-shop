<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	const ads = data.ads;

	const IMG_SIZE = 250;
	const CARD_WIDTH = `repeat(auto-fill, ${IMG_SIZE}px)`;
</script>

<div class="ad-grid" style:grid-template-columns={CARD_WIDTH}>
	{#each ads as ad}
		<div>
			<div
				class="ad-img"
				style:background={`url("${ad.imgs[0]?.url}")`}
				style:background-position="center"
				style:background-size="cover"
				style:width={IMG_SIZE + 'px'}
				style:height={IMG_SIZE + 'px'}
				style:margin="0 auto"
			/>
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
