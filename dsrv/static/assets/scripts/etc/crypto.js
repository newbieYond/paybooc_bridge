function uiCheckMotion(){
	const checkEl = document.querySelector('.face-area .done');
	// 1. 애니메이션을 초기화 (속성을 비움)
	checkEl.style.animation = 'none';

	// 2. 브라우저가 초기화를 인식하도록 리플로우(Reflow) 발생시킴
	void checkEl.offsetWidth; 

	// 3. 애니메이션을 실행 (1초 동안 실행)
	checkEl.style.animation = 'doneMotion 1s ease-in-out';
}