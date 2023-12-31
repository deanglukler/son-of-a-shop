import type { Timestamp } from 'firebase-admin/firestore';

export type FullPath = string;
export type SavedImg = { fullPath?: FullPath; url: string; width: number; height: number };

export type AdParsed = {
	title: string;
	description: string;
	price: string;
	createdAtMilis: number;
	updatedAtMilis: number;
};

export type AdParsedWithId = AdParsed & { id: string };

export type PartialWithFiBaseTimestamps<T> = Partial<T> & {
	createdAt: Timestamp;
	updatedAt: Timestamp;
};

export type AdWithAllData = AdParsedWithId & {
	imgs: SavedImg[];
};
