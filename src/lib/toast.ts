import Toastify from 'toastify-js';

function error(text: string) {
	Toastify({
		text,
		duration: 3000,
		close: true,
		gravity: 'top', // `top` or `bottom`
		position: 'left', // `left`, `center` or `right`
		stopOnFocus: true, // Prevents dismissing of toast on hover
		style: {
			background: 'tomato'
		}
	}).showToast();
}

export default {
	error
};
