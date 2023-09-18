<script>
	import '$lib/tailwind.css';
	import '$lib/global.css';
</script>

<svelte:head>
	<title>Son of a shop</title>
	<meta
		name="description"
		content="Discover Rare Automotive Parts and Hidden Treasures on 'Son of a Shop' - Your Go-To Marketplace for Mechanics and DIY Enthusiasts. Find what you never thought you could, connecting buyers to trusted sellers in seconds. Start your lucky search today!"
	/>
</svelte:head>

<header class="py-12 px-10">
	<h1 class="text-2xl font-semibold">Son of a Shop</h1>
</header>

<main class="px-10">
	<slot />
</main>
