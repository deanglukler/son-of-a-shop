<script lang="ts">
	export let link: boolean = false;
	export let href: string = '';
	export let onClick: EventListener = () => {};
</script>

{#if link}
	<a {href} class="button-style"><slot /></a>
{:else}
	<button class="button-style" on:click={onClick}><slot /></button>
{/if}

<style lang="scss">
	.button-style {
		line-height: 40px;
		padding: 0 20px;
		display: inline-block;
		font: center;
		@apply bg-blue-300;

		&:hover {
			@apply bg-blue-200;
		}
	}
</style>
