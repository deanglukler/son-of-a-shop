import { writable } from 'svelte/store';

export const userUid = writable<string>('');
