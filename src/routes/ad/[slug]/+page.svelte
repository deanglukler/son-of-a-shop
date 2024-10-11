<script>
	import ImagesRoll from '$lib/components/ImagesRoll.svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	const ad = data.ad;
	const savedImgs = data.adImgs;
	const imgsUrls = savedImgs.map((x) => x.url);
</script>

{#if ad}
	<div class="flex flex-wrap">
		<div class="w-full md:w-[65%] md:pr-6">
			<ImagesRoll imgs={imgsUrls} />
		</div>
		<div class="mt-12 md:mt-0 md:border-l-2 md:pl-6 w-full md:w-[35%]">
			<h1 class="text-2xl font-bold mb-6">{ad.title}</h1>
			<p>{ad.description}</p>
		</div>
	</div>
{/if}
