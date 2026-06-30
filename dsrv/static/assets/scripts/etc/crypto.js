function onCryptoBack() {
	callCryptoBridge('Navi', 'closeWebView', {});
}

function onBack() {
	onCryptoBack();
}

function onBackPressed() {
	onCryptoBack();
}

var commIfScript = {
	onBackPressed: function () { onCryptoBack(); }
};

function callCryptoBridge(category, api, param) {
	var message = {
		callback: '',
		category: category,
		api: api,
		params: JSON.stringify(param || {})
	};
	var payload = JSON.stringify(message);

	if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.payboocBridge) {
		window.webkit.messageHandlers.payboocBridge.postMessage(payload);
		return;
	}

	if (window.payboocBridge && typeof window.payboocBridge.postMessage === 'function') {
		window.payboocBridge.postMessage(payload);
		return;
	}

	if (window.history.length > 1) {
		window.history.back();
	} else {
		window.close();
	}
}

document.addEventListener('click', function (event) {
	var backButton = event.target.closest('.renew01-header .btn-back, .renew01-header .btn-close, .renew21--header .btn-back');

	if (!backButton) {
		return;
	}

	event.preventDefault();
	event.stopImmediatePropagation();
	onCryptoBack();
}, true);

function uiCheckMotion(){
	const checkEl = document.querySelector('.face-area .done');
	// 1. 애니메이션을 초기화 (속성을 비움)
	checkEl.style.animation = 'none';

	// 2. 브라우저가 초기화를 인식하도록 리플로우(Reflow) 발생시킴
	void checkEl.offsetWidth; 

	// 3. 애니메이션을 실행 (1초 동안 실행)
	checkEl.style.animation = 'doneMotion 1s ease-in-out';
}
