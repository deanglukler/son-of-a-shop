<script lang="ts">
	import CenterSquareImg from '$lib/components/CenterSquareImg.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
	const ads = data.ads;
</script>

<div class="ad-grid">
	{#each ads as ad}
		<a href={`/ad/${ad.id}`}>
			<CenterSquareImg url={ad.imgs[0]?.url} />
			<div class="flex justify-between mt-2 text-lg">
				<h2 class="line-clamp-2">{ad.title}</h2>
				<p class="font-semibold">{ad.price}</p>
			</div>
		</a>
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
