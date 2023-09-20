import { getDownloadURL } from 'firebase-admin/storage';
import { database, storage } from '../lib/fiBaseAdmin';
import type { AdParsed, AdWithAllData, PartialWithFiBaseTimestamps } from '../lib/types';
import { safelyParseAd } from '$lib/safelyParseAd';
import { getImgUrlAndDims } from '../lib/getImgUrlAndDims';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const db = database;
	const adsRef = db.collection('ads');
	const ads = await adsRef.get();

	const bucket = storage;
	const [imgsFiles] = await bucket.getFiles({ prefix: 'junk' });
	const dlUrlPromises = imgsFiles.map((img) => getDownloadURL(img));
	const dlUrls = await Promise.all(dlUrlPromises);

	const adsWithAllData: AdWithAllData[] = [];
	ads.forEach((ad) => {
		const parsedAd = safelyParseAd(ad.data() as PartialWithFiBaseTimestamps<AdParsed>);
		adsWithAllData.push({
			...parsedAd,
			imgs: dlUrls.filter((url) => url.includes(ad.id)).map((url) => getImgUrlAndDims(url)),
			id: ad.id
		});
	});

	return {
		ads: adsWithAllData
	};
}
