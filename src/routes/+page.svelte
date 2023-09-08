<script>
	import { getImgUrlAndDims } from '$lib/getImgUrlAndDims';

	/** @type {import('./$types').PageData} */
	export let data;
	const ads = data.ads;
</script>

<h1>home page</h1>
{#each ads as ad}
	<h3>{ad.title}</h3>
	<p>{ad.description}</p>
	<div class="img-grid">
		{#each ad.imgs as img}
			<img
				src={img.url}
				width={150}
				height={150 * (img.height / img.width)}
				alt={`${ad.title} as seen in real life`}
			/>
		{/each}
	</div>
{/each}

<style>
	.img-grid {
		display: grid;
		grid-template-columns: repeat(3, 150px);
		grid-gap: 10px;
	}
</style>
