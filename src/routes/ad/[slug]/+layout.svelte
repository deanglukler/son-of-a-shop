<script>
	/** @type {import('./$types').LayoutData} */
	export let data;
</script>

<svelte:head>
	<title>{data.ad?.title} - Son of a shop</title>
	<meta name="description" content={data.ad?.description} />
</svelte:head>

<main>
	<slot />
</main>
