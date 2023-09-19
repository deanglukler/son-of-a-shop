<script lang="ts">
	export let size: string;
	export let url: string;
	export let radius: string | null = null;
</script>

<div
	class="ad-img rounded-sm"
	style:border-radius={radius}
	style:background-image={`url("${url}")`}
	style:background-position="center"
	style:background-size="cover"
	style:width={size}
	style:height={size}
	style:margin="0 auto"
/>
