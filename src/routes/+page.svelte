<script>
	/** @type {import('./$types').PageData} */
	export let data;
	const ads = data.ads;
</script>

<svelte:head>
	<title>Son of a shop</title>
	<meta
		name="description"
		content="Discover Rare Automotive Parts and Hidden Treasures on 'Son of a Shop' - Your Go-To Marketplace for Mechanics and DIY Enthusiasts. Find what you never thought you could, connecting buyers to trusted sellers in seconds. Start your lucky search today!"
	/>
</svelte:head>

<h1>home page</h1>
{#each ads as ad}
	<h2>{ad.title}</h2>
	<p>{ad.description}</p>
	<a href={`/ad/${ad.id}`}>Go to ad</a>
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
