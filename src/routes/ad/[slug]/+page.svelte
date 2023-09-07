<script>
	/** @type {import('./$types').PageData} */
	export let data;

	let ad = data.ad;
	let savedImgs = data.adImgs;
</script>

{#if ad}
	<h1>{ad.title}</h1>
	<p>{ad.description}</p>
	{#each savedImgs as img}
		<img src={img.url} style:height={'100px'} alt={`${ad.title} image`} />
	{/each}
{/if}
