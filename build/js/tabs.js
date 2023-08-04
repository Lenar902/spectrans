const tabButtons = document.querySelectorAll('.tab__nav-button');
const tabBlocks = document.querySelectorAll('.tab__block');

tabButtons.forEach(function(item) {	
	item.addEventListener('click', function () {
		const currentButton = item; 
		const blockIdSelector = currentButton.getAttribute('data-tab');
		const currentBlock = document.querySelector(blockIdSelector);
	
		tabButtons.forEach(function(item) {
			item.classList.remove('active');
		});

		tabBlocks.forEach(function(item) {
			item.classList.remove('active');
		});
	
		currentButton.classList.add('active');	
		currentBlock.classList.add('active');
	});
});

if (window.matchMedia("(max-width: 850px)").matches) {
	tabBlocks.forEach(function(item) {
		item.classList.add('active');
	});
}
