<script>
	import '$lib/tailwind.css';
	import '$lib/global.css';
	import { activeInfo, documentTitleExtension, getUser, handleSignOut } from '$lib/stores';
	import Button from '$lib/components/Button.svelte';
	import Auth from './Auth.svelte';
</script>

<svelte:head>
	<title>Son of a shop</title>
	<meta
		name="description"
		content="Discover Rare Automotive Parts and Hidden Treasures on 'Son of a Shop' - Your Go-To Marketplace for Mechanics and DIY Enthusiasts. Find what you never thought you could, connecting buyers to trusted sellers in seconds. Start your lucky search today!"
	/>
</svelte:head>

<Auth />

<header class="py-12 px-10 flex justify-between">
	<div class="relative">
		<h1 class="text-2xl font-semibold">
			Son of a Shop{$documentTitleExtension && ` | ${$documentTitleExtension}`}
		</h1>
		<p class="absolute left-0 top-8 text-lg text-neutral-600">{$activeInfo}</p>
	</div>
	{#if $getUser()}
		<Button ghost onClick={$handleSignOut}>Sign Out</Button>
	{/if}
</header>

<main class="px-10">
	<slot />
</main>
