import type { User } from 'firebase/auth';
import { writable } from 'svelte/store';

export const getUser = writable<() => User | null>(() => {
	return null;
});

export const handleSignIn = writable<() => void>(() => {
	throw new Error('handleSignIn not initialized');
});
export const handleSignOut = writable<() => void>(() => {
	throw new Error('handleSignOut not initialized');
});

export const documentTitleExtension = writable<string>('');

export const activeInfo = writable<string>('');
