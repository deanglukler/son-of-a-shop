<script lang="ts">
	export let size: string | null = null;
	export let url: string;
	export let radius: string | null = null;
</script>

{#if size}
	<div
		class="rounded-sm"
		style:border-radius={radius}
		style:background-image={`url("${url}")`}
		style:background-position="center"
		style:background-size="cover"
		style:width={size}
		style:height={size}
		style:margin="0 auto"
	/>
{:else}
	<div class="img-container">
		<div
			class="img rounded-sm"
			style:border-radius={radius}
			style:background-image={`url("${url}")`}
			style:background-position="center"
			style:background-size="cover"
			style:margin="0 auto"
		/>
	</div>
{/if}

<style>
	.img-container {
		position: relative;
		width: 100%;
		padding-top: 100%;

		& .img {
			position: absolute;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
		}
	}
</style>
