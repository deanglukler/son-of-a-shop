import { getDownloadURL } from 'firebase-admin/storage';
import type { AdParsed, PartialWithFiBaseTimestamps, SavedImg } from '../../../lib/types';
import { database, storage } from '../../../lib/fiBaseAdmin';
import { safelyParseAd } from '../../../lib/safelyParseAd';
import { getImgUrlAndDims } from '../../../lib/getImgUrlAndDims';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ params }) {
	const db = database;
	const slug = params.slug;
	const adRef = db.collection('ads').doc(slug);
	const doc = await adRef.get();
	let ad = null;
	if (!doc.exists) {
		console.log('Cant load document.  No such document! slug: ' + slug);
	} else {
		ad = safelyParseAd(doc.data() as PartialWithFiBaseTimestamps<AdParsed>);
	}

	const adImgs: SavedImg[] = [];
	const [files] = await storage.getFiles({ prefix: `junk/${slug}` });

	for (const file of files) {
		try {
			const dlUrl = await getDownloadURL(file);

			adImgs.push({
				fullPath: file.name,
				...getImgUrlAndDims(dlUrl)
			});
		} catch (error) {
			console.log('there was an error getting download url for file ' + file.baseUrl);
		}
	}

	return {
		ad,
		adImgs
	};
}
