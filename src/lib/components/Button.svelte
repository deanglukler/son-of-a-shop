<script lang="ts">
	export let link: boolean = false;
	export let href: string = '';
	export let onClick: EventListener = () => {};
	export let ghost: boolean = false;
	export let text: boolean = false;
</script>

{#if link}
	<a {href} class={`button`} class:add-padding={!text}><slot /></a>
{:else}
	<button class={`button`} class:add-padding={!text} class:ghost on:click={onClick}>
		<slot /></button
	>
{/if}

<style lang="scss">
	.button {
		&:not(.ghost) {
			@apply bg-blue-300;

			&:hover {
				@apply bg-blue-200;
			}
		}
	}

	.add-padding {
		padding: 0 20px;
		line-height: 40px;
	}
</style>
