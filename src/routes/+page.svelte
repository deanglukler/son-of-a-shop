<script lang="ts">
	import CenterSquareImg from '$lib/components/CenterSquareImg.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
	const ads = data.ads;
</script>

<div class="ad-grid">
	{#each ads as ad}
		<div>
			<CenterSquareImg url={ad.imgs[0]?.url} />
			<h2 class="font-semibold text-lg mt-2 mb-1">{ad.title}</h2>
			<p>{ad.description}</p>
		</div>
	{/each}
</div>

<style>
	.ad-grid {
		display: grid;
		column-gap: 15px;
		row-gap: 25px;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	}
</style>
