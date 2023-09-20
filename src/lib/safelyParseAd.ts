import type { AdParsed, PartialWithFiBaseTimestamps } from './types';

export function safelyParseAd(firestoreAd: PartialWithFiBaseTimestamps<AdParsed> | any): AdParsed {
	return {
		title: firestoreAd.title || '',
		description: firestoreAd.description || '',
		price: firestoreAd.price || '',
		createdAtMilis: firestoreAd.createdAt.toMillis(),
		updatedAtMilis: firestoreAd.updatedAt.toMillis()
	};
}
