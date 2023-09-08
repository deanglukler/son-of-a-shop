export function getImgUrlAndDims(url: string) {
	function widthAndHeight() {
		const parts = url.split('_DIMENSIONS_');
		if (parts.length === 2) {
			const dimensions = parts[1].split('.');
			if (dimensions.length === 2) {
				const [widthStr, heightStr] = dimensions[0].split('x');
				const width = parseInt(widthStr, 10);
				const height = parseInt(heightStr, 10);
				if (!isNaN(width) && !isNaN(height)) {
					return { width, height };
				}
			}
		}
		throw new Error('could not parse height and width of img from url ' + url);
	}
	return {
		url,
		...widthAndHeight()
	};
}
