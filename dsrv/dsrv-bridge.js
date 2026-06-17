// PURPOSE: dsrv 웹뷰 공통 네이티브 브릿지 호출/콜백 모듈 (iOS·Android 분기 통합)

// 네이티브 → 웹 콜백 레지스트리. callback 이름으로 등록된 핸들러를 보관한다.
var bridgeCallbacks = {};

// 네이티브 → 웹 콜백 진입점. 네이티브가 이 함수명으로 결과를 전달한다.
// result: { callback, resultCode, params }
function appBridgeCallbackListener(result) {
    var handler = bridgeCallbacks[result.callback];
    if (typeof handler === 'function') {
        handler(result);
    }
}

// 네이티브 브릿지 호출 공통 함수 — iOS/Android 플랫폼을 자동 분기한다.
// category: 브릿지 카테고리(예: "Navi")
// api: 브릿지 이름(예: "closeWebView")
// params: 파라미터 객체(생략 시 빈 객체)
// callback: 응답 콜백 함수명(문자열). 넘기면 window[callback]을 레지스트리에 등록한다.
function callNativeBridge(category, api, params, callback) {
    var callbackName = callback || '';
    // 콜백명이 있으면 전역 함수를 레지스트리에 등록
    if (callbackName) {
        bridgeCallbacks[callbackName] = window[callbackName];
    }

    var message = {
        "callback": callbackName,
        "category": category,
        "api": api,
        "params": JSON.stringify(params || {})
    };
    var payload = JSON.stringify(message);

    // iOS 감지: webkit messageHandlers 3단계 체크
    if (window.webkit
        && window.webkit.messageHandlers
        && window.webkit.messageHandlers.payboocBridge) {
        window.webkit.messageHandlers.payboocBridge.postMessage(payload); // iOS
        return;
    }

    // Android 감지: payboocBridge 객체 존재 확인
    if (window.payboocBridge && typeof window.payboocBridge.postMessage === 'function') {
        window.payboocBridge.postMessage(payload); // Android
        return;
    }

    // 둘 다 없음 → 웹 환경 또는 미지원
    console.warn('지원하지 않는 네이티브 브릿지 환경입니다.');
}
