var scheme = {};
var nativeCallbackInfo = { eventId: 1, isAddListener: false, apiCallInfo: {} };

/******************************************************************************
* 공통네이티브콜
******************************************************************************/
scheme.callNativeBridge = function (bridge, param, callbackFn, callbackOpt1, callbackOpt2, category) {
	//앱스킴 여부확인
	scheme.native(scheme.set(bridge, param, callbackFn, callbackOpt1, callbackOpt2, category));
}

/******************************************************************************
* 데이터셋팅
******************************************************************************/
scheme.set = function (bridge, param, callbackFn, callbackOpt1, callbackOpt2, paramCategory) {
	let key         = {};
	let returnParam = {};
	let category    = 'Comm';
	callbackOpt1    = (com.isNull(callbackOpt1))  ? 'N' : callbackOpt1;
	callbackOpt2    = (com.isNull(callbackOpt2))  ? 'N' : callbackOpt2;
	paramCategory   = (com.isNull(paramCategory)) ? '' : paramCategory;
	
	returnParam['api'] = bridge;

	if (!com.isNull(param) && !com.isEmptyObj(param)) {
		returnParam['params'] = JSON.stringify(param);
	}
	
	if ( paramCategory == '' ) {
		if ( _schemeList.hasOwnProperty(bridge) === true && _schemeList[bridge].hasOwnProperty('category') === true ) {
			if ( com.isNull(_schemeList[bridge]['category']) === false ) {
				category = _schemeList[bridge]['category'];
			}
		}
	} else {
		category = paramCategory;
	}
	

	returnParam['category'] = category;
	
	let defaultCallback = `nativeCallback-${nativeCallbackInfo.eventId++}`;
	let callbackInfo = new Object();
	
	//콜백이 없는 경우 빈값 셋팅
	if ( com.isNull(callbackFn) ) {
		returnParam['callback']  = '';
		callbackInfo['callback'] = '';
		callbackInfo['defaultCallback'] = defaultCallback;
		
		nativeCallbackInfo.apiCallInfo[defaultCallback] = callbackInfo;
	} else {
		callbackInfo['callbackOpt1'] = callbackOpt1;
		callbackInfo['callbackOpt2'] = callbackOpt2;
		callbackInfo['callback'] = callbackFn;
		
		if ( callbackFn.name ) {
			returnParam['callback'] = callbackFn.name;
			callbackInfo['defaultCallback'] = callbackFn.name;
			
			nativeCallbackInfo.apiCallInfo[callbackFn.name] = callbackInfo;
		} else {
			returnParam['callback'] = defaultCallback;
			callbackInfo['defaultCallback'] = defaultCallback;
			
			nativeCallbackInfo.apiCallInfo[defaultCallback] = callbackInfo;
		}
		
	}

	return returnParam;
}

/******************************************************************************
* 네이티브 브릿지 호출
******************************************************************************/
scheme.native = function (param) {
	//app이 아닌경우 테스트를 위해 true 리턴
	if ( com.isInApp() === false ) {
		if (param.api == 'checkPermission') {
			if ( com.isNull(param['callback']) === false ) {
				if ( param.params != undefined ) {
					let data = JSON.parse(param.params);
					let returnVal = (data.status == 'Y') ? true : false;
					new Function(nativeCallbackInfo.apiCallInfo['callback'](returnVal));
				} else {
					new Function(nativeCallbackInfo.apiCallInfo['callback'](true));
				}
			}
		} else {
			if ( com.isNull(param['callback']) === false ) {
				new Function(nativeCallbackInfo.apiCallInfo['callback'](true));
			}
		}
	} else {
		if (com.isAndroid()) {
			window.payboocBridge.postMessage(JSON.stringify(param));
		} else {
			window.webkit.messageHandlers.payboocBridge.postMessage(JSON.stringify(param));
		}
	}
}

/******************************************************************************
* 네이티브 콜백함수
******************************************************************************/
var appBridgeCallbackListener = (result) => {
	result = (typeof result == 'string') ? JSON.parse(result) : result;
	/*
	if (com.isAndroid() == false) {
		alert('result => ' + JSON.stringify(result));
	}
	*/
	if ( com.isNull(result.callback) === false && result.callback === nativeCallbackInfo.apiCallInfo[result.callback]['defaultCallback'] ) {
		let response;
		let isCallback = true;
		if ( nativeCallbackInfo.apiCallInfo[result.callback]['callbackOpt2'] == 'Y' ) {
			response = result;
		} else {
			if ( result.params != undefined ) {
				response = JSON.parse(result.params);
			}
		}
		
		//N이면 정상인경우만 콜백
		if ( nativeCallbackInfo.apiCallInfo[result.callback]['callbackOpt1'] == 'N' ) {
			if ( result.resultCode != 'success' ) {
				isCallback = false;
			}
		}
		
		if ( isCallback ) {
			new Function(nativeCallbackInfo.apiCallInfo[result.callback]['callback'](response));
		}
	}
}


/******************************************************************************
* 앱스킴 목록(As-Is -> To-Be 변경관리)
******************************************************************************/
var _schemeList = {
	//-----------------------------------------------------------------------------------------------//
	// Navi
	//-----------------------------------------------------------------------------------------------//
	webviewReady : {
		scheme         : 'webviewReady'
		, category     : 'Navi'
		, explanation  : '브릿지 사용여부 설정'
		, beScheme     : '신규'
		, requestParam : ''
		, responeParam : ''
	}
	, getMenuInfo : {
		scheme         : 'getMenuInfo'
		, category     : 'Navi'
		, explanation  : '메뉴 정보 얻기'
		, beScheme     : ''
		, requestParam : {'menuId':'pageBridge'} //메뉴ID
		, responeParam : {'menuId' : 'pageBridge'    //메뉴ID
						, 'menuNm' : '개발화면목록'  //메뉴명
						, 'menuUrl' : '/ui/app/pageBridge' //url
						, 'menuGun' : 'W' //페이지타입(R:react, W:web)
						, 'depth' : '1'}
	}
	, getMenuInfoAll : {
		scheme         : 'getMenuInfoAll'
		, category     : 'Navi'
		, explanation  : '메뉴 정보 얻기'
		, beScheme     : ''
		, requestParam : ''
		, responeParam : {'list' : ''}
	}
	, setStackHistory : {
		scheme         : 'setStackHistory'
		, category     : 'Navi'
		, explanation  : '히스토리 저장'
		, beScheme     : ''
		, requestParam : {'menuId':'pageBridge'} //메뉴ID
		, responeParam : ''
	}
	, getStackHistoryLast : {
		scheme         : 'getStackHistoryLast'
		, category     : 'Navi'
		, explanation  : '히스토리 가져오기'
		, beScheme     : ''
		, requestParam : ''
		, responeParam : {'menuId':'pageBridge'} //메뉴ID
	}
	, delStackHistory : {
		scheme         : 'delStackHistory'
		, category     : 'Navi'
		, explanation  : '히스토리 삭제'
		, beScheme     : ''
		, requestParam : {'menuId':'pageBridge'} //메뉴ID
		, responeParam : ''
	}
	, openWebView : {
		scheme         : 'openWebView'
		, category     : 'Navi'
		, explanation  : '새로운 웹뷰 열기'
		, beScheme     : ''
		, requestParam : {'menuId':'pageBridge'   //메뉴ID
						, 'params':''//전달 파라미터
						, 'url' : ''} 
		, responeParam : ''
	}
	, closeWebView : {
		scheme         : 'closeWebView'
		, category     : 'Navi'
		, explanation  : '웹뷰 닫기'
		, beScheme     : ''
		, requestParam : ''
		, responeParam : ''
	}
	, openWebPopup : {
		scheme         : 'openWebPopup'
		, category     : 'Navi'
		, explanation  : '웹뷰 열기(popup)'
		, beScheme     : ''
		, requestParam : {'type':'bottom'      //full:전체, bottom:바텀, browser:하단네비
						, 'menuId':'pageBridge'  //메뉴ID
						, 'params':''//전달할 파라미터(Url Enc)
						, 'url' : ''}
		, responeParam : ''
	}
	, closeWebPopup : {
		scheme         : 'closeWebPopup'
		, category     : 'Navi'
		, explanation  : '웹뷰 닫기(popup)'
		, beScheme     : ''
		, requestParam : {'type':'home'      //home:메인(홈), benefit:혜택, fin:금융, menu:더보기
						, 'params':''} //전달할 파라미터(Url Enc)
		, responeParam : ''
	}
	, openMoneyBox : {
		scheme         : 'openMoneyBox'
		, category     : 'Navi'
		, explanation  : '머니박스오픈'
		, beScheme     : ''
		, requestParam : {'menuId' : '', 'params' : '', 'url' : ''}
		, responeParam : ''
	}
	, closeMoneyBox : {
		scheme         : 'closeMoneyBox'
		, category     : 'Navi'
		, explanation  : '머니박스닫기'
		, beScheme     : ''
		, requestParam : ''
		, responeParam : ''
	}
	, openBottomBox : {
		scheme         : 'openBottomBox'
		, category     : 'Navi'
		, explanation  : '머니박스 형태의 하단 팝업 열기'
		, beScheme     : ''
		, requestParam : {'menuId' : ''
						, 'params' : ''
						, 'url' : ''}
		, responeParam : ''
	}
	, closeBottomBox : {
		scheme         : 'closeBottomBox'
		, category     : 'Navi'
		, explanation  : '머니박스 형태의 하단 팝업 닫기'
		, beScheme     : ''
		, requestParam : {'script' : ''} //실행할 script정보
		, responeParam : ''
	}
	, loadUrl : {
		scheme         : 'loadUrl'
		, category     : 'Navi'
		, explanation  : 'location.href 기능'
		, beScheme     : ''
		, requestParam : {'menuId': '', 'params':'', 'url':''}
		, responeParam : ''
	}
	, openNative : {
		scheme         : 'openNative'
		, category     : 'Navi'
		, explanation  : '네이티브이동'
		, beScheme     : ''
		, requestParam : {'menuId':'', 'params' : ''}
		, responeParam : ''
	}
	, closeApp : {
		scheme         : 'closeApp'
		, category     : 'Navi'
		, explanation  : '앱종료(페이북 로그인이나 OAuth 프로세스의 경우 wapUrl 호출 후 앱 종료)'
		, beScheme     : ''
		, requestParam : ''
		, responeParam : ''
	}
	, restartApp : {
		scheme         : 'restartApp'
		, category     : 'Navi'
		, explanation  : '앱재시작'
		, beScheme     : 'app://comm=restartApp'
		, requestParam : ''
		, responeParam : ''
	}
	, cleanDataAndRestartApp : {
		scheme         : 'cleanDataAndRestartApp'
		, category     : 'Navi'
		, explanation  : '로컬데이터 삭제 후 앱 재시작'
		, beScheme     : ''
		, requestParam : ''
		, responeParam : ''
	}
	, closeAndAction : {
		scheme         : 'closeAndAction'
		, category     : 'Navi'
		, explanation  : '화면닫고 동작하기'
		, beScheme     : ''
		, requestParam : {'type' : '' //open : 현재화면 닫고 새로운 웹뷰열기, callScript : 화면닫고 스크립트실행
						, 'script' : ''//실행스크립트
						, 'param' : ''} //menuId, url, params
		, responeParam : ''
	}
	, closeCardLayer : {
		scheme         : 'closeCardLayer'
		, category     : 'Navi'
		, explanation  : '카드레이어 웹뷰 닫기'
		, beScheme     : ''
		, requestParam : ''
		, responeParam : ''
	}
	//-----------------------------------------------------------------------------------------------//
	// Storage
	//-----------------------------------------------------------------------------------------------//
	, setNativeStorage : {
		scheme         : 'setNativeStorage'
		, category     : 'Storage'
		, explanation  : '네이티브 데이터 저장하기'
		, beScheme     : ''
		, requestParam : {'key' : 'testKey'      //저장키
						, 'value' : 'testData'  //저장값
						, 'expireTs':''} //만료날짜 
		, responeParam : ''
	}
	, getNativeStorage : {
		scheme         : 'getNativeStorage'
		, category     : 'Storage'
		, explanation  : '네이티브 저장소 가져오기'
		, beScheme     : ''
		, requestParam : {'key' : 'testKey'}
		, responeParam : {'value' : 'testData'}
	}
	, removeNativeStorage : {
		scheme         : 'removeNativeStorage'
		, category     : 'Storage'
		, explanation  : '네이티브 저장소 삭제하기'
		, beScheme     : ''
		, requestParam : {'key' : 'testKey'}
		, responeParam : ''
	}
	, clearHttpETag : {
		scheme         : 'clearHttpETag'
		, category     : 'Storage'
		, explanation  : '메뉴ETag 초기화'
		, beScheme     : ''
		, requestParam : ''
		, responeParam : ''
	}
	, saveRecentMenuStorage : {
		scheme         : 'saveRecentMenuStorage'
		, category     : 'Storage'
		, explanation  : '최근 메뉴 추가'
		, beScheme     : ''
		, requestParam : {'seemMenuNo' : ''}
		, responeParam : ''
	}
	//-----------------------------------------------------------------------------------------------//
	// ExternalApp
	//-----------------------------------------------------------------------------------------------//
	, openBrowser : {
		scheme         : 'openBrowser'
		, category     : 'ExternalApp'
		, explanation  : '외부 브라우저 열기'
		, beScheme     : ''
		, requestParam : {'url' : 'www.naver.com'} //외부 URL(Url Enc)
		, responeParam : ''
	}
	, callExternalApp : {
		scheme         : 'callExternalApp'
		, category     : 'ExternalApp'
		, explanation  : '외부 앱 호출'
		, beScheme     : 'comm=callExternalApp'
		, requestParam : {'scheme':''       //호출 앱 스킴
						, 'marketUrl':''} //마켓 URL(패키지명, URL Enc)
		, responeParam : ''
	}
	, openAppSetting : {
		scheme         : 'openAppSetting'
		, category     : 'ExternalApp'
		, explanation  : 'os 앱 권한 화면 열기'
		, beScheme     : 'comm=appSetting'
		, requestParam : ''
		, responeParam : ''
	}
	, reviewAppStore : {
		scheme         : 'reviewAppStore'
		, category     : 'ExternalApp'
		, explanation  : '앱 스토어 리뷰 요청'
		, beScheme     : 'comm=requestReview'
		, requestParam : ''
		, responeParam : ''
	}
	, openContact : {
		scheme         : 'openContact'
		, category     : 'ExternalApp'
		, explanation  : '연락처 열기'
		, beScheme     : 'comm=openContact'
		, requestParam : ''
		, responeParam : {'list' : ''}
	}
	, shareExternal : {
		scheme         : 'shareExternal'
		, category     : 'ExternalApp'
		, explanation  : '링크 or 텍스트 공유'
		, beScheme     : 'comm=shareExternal'
		, requestParam : {'type': '' //link - OS선택팝업, text : 클립보드복사
						, 'value' : '' //link인경우 url인코딩된 대상값, text인경우 단순 텍스트
						, 'tiast' : '' //빈값인경우 디폴트메세지
						}
		, responeParam : ''
	}
	//-----------------------------------------------------------------------------------------------//
	// Auth
	//-----------------------------------------------------------------------------------------------//
	, refreshJwtToken : {
		scheme         : 'refreshJwtToken'
		, category     : 'Auth'
		, explanation  : 'JWT 토큰 갱신'
		, beScheme     : ''
		, requestParam : ''
		, responeParam : ''
	}
	, requestAuth : {
		scheme         : 'requestAuth'
		, category     : 'Auth'
		, explanation  : '본인인증(회원인증 api에 따라 통압가능여부 확인중)'
		, beScheme     : 'comm=login|comm=bioLogin|login=callFpnt'
		, requestParam : {'type' : '' //detault - 비밀번호/생체인증 선택 가능한 화면 노출, bio - 생체인증 only(생체인증 미등록 시 등록 후 인증 진행)
						, 'menuId' : '' //메뉴ID
						}
		, responeParam : {'ownPrfTkn' : '' //본인인증토큰(FIDO인 경우 SessionID)
						, 'pybcPrfMhdCd' : '' //페이북인증방법코드(04:APP인증(PIN), 05:APP인증(생체인증)))
						}
	}
	, requestAuthExt : {
		scheme         : 'requestAuthExt'
		, category     : 'Auth'
		, explanation  : '본인인증(sms, 카드인증, ARS, 카카오인증서)'
		, beScheme     : ''
		, requestParam : {'type' : '' //sms - sms본인인증, card - 카드인증, ars - ARS인증, kakao - 카카오인증서
						, 'menuId' : '' //메뉴ID
						}
		, responeParam : ''
	}
	, requestSSO : {
		scheme         : 'requestSSO'
		, category     : 'Auth'
		, explanation  : 'SSO Login 요청'
		, beScheme     : ''
		, requestParam : ''
		, responeParam : {'ownPrfTkn' : ''} //인증토큰
	}
	//-----------------------------------------------------------------------------------------------//
	// Cert
	//-----------------------------------------------------------------------------------------------//
	, requestPubCert : {
		scheme         : 'requestPubCert'
		, category     : 'Cert'
		, explanation  : '공동인증서 인증'
		, beScheme     : 'comm=mydataPubCert | pay=reqPbau'
		, requestParam : {'plainText':''} //원문
		, responeParam : {'signData':''} //서명데이터값
	}
	, removeIspVcSerial : {
		scheme         : 'removeIspVcSerial'
		, category     : 'Cert'
		, explanation  : 'ISP 인증서 삭제'
		, beScheme     : 'join=delIspVcSerial'
		, requestParam : {'vcSerialCount':''      //지울 인증서 수
						, 'vcSerial#':''}    //인증서 시리얼코드, #은 1부터 시작하여 vcSerialCount수까지
		, responeParam : ''
	}
	, getIspVcSerial : {
		scheme         : 'getIspVcSerial'
		, category     : 'Cert'
		, explanation  : 'ISP 인증서 목록 조회'
		, beScheme     : 'join=getIspVcSerial'
		, requestParam : ''
		, responeParam : {'vcSerialList' : ''} //인증서목록
	}
	, requestFinCert : {
		scheme         : 'requestFinCert'
		, category     : 'Cert'
		, explanation  : '금융인증서 인증'
		, beScheme     : 'menu=resultFinCert'
		, requestParam : {'seqNo':''      //인증 시퀀스 번호
						, 'prevUrl':''  //이전 화면 URL
						, 'next':''}    //다음 화면 URL
		, responeParam : {'token' : ''}
	}
	//-----------------------------------------------------------------------------------------------//
	// Security
	//-----------------------------------------------------------------------------------------------//
	, chkDevice : {
		scheme         : 'chkDevice'
		, category     : 'Security'
		, explanation  : '디바이스 보안성 체크'
		, beScheme     : 'comm=chkDevice'
		, requestParam : {'msg' : '' //오류메세지
						, 'dvcDstnNo' : '' //검증할 기기값(iOS의경우 UUID)
						, 'mpNo' : '' //검증할 휴대폰 번호
						}
		, responeParam : ''
	}
	, startAntiCapture : {
		scheme         : 'startAntiCapture'
		, category     : 'Security'
		, explanation  : '캡처 방지 시작'
		, beScheme     : 'menu=startNoCapture'
		, requestParam : ''
		, responeParam : ''
	}
	, stopAntiCapture : {
		scheme         : 'stopAntiCapture'
		, category     : 'Security'
		, explanation  : '캡처 방지 종료'
		, beScheme     : 'menu=endNoCapture'
		, requestParam : ''
		, responeParam : ''
	}
	//-----------------------------------------------------------------------------------------------//
	// Comm
	//-----------------------------------------------------------------------------------------------//
	, openPdfViewer : {
		scheme         : 'openPdfViewer'
		, category     : 'Comm'
		, explanation  : 'pdf viewer 열기'
		, beScheme     : 'comm=pdfView'
		, requestParam : {'url':''      //대상 파일 url
						, 'title':''} //상단 타이틀
		, responeParam : ''
	}
	, openError : {
		scheme         : 'openError'
		, category     : 'Comm'
		, explanation  : '에러 팝업'
		, beScheme     : ''
		, requestParam : {'title' : '' //상단 타이틀
						, 'message' : '' //내용
						, 'code' : '' //에러코드
						, 'returnUrl' : '' //확인 버튼 시 이동할 url
						}
		, responeParam : ''
	}
	, showLoading : {
		scheme         : 'showLoading'
		, category     : 'Comm'
		, explanation  : '로딩 on'
		, beScheme     : ''
		, requestParam : ''
		, responeParam : ''
	}
	, hideLoading : {
		scheme         : 'hideLoading'
		, category     : 'Comm'
		, explanation  : '로딩 off'
		, beScheme     : ''
		, requestParam : ''
		, responeParam : ''
	}
	, showToastMessage : {
		scheme         : 'showToastMessage'
		, category     : 'Comm'
		, explanation  : '토스트 메세지 표시'
		, beScheme     : ''
		, requestParam : {'title' : '' //상단 타이틀
						, 'message' : '' //내용
						, 'iconType' : '' //메세지 앞에 표현할 아이콘 이름
						}
		, responeParam : ''
	}
	, encrypt : {
		scheme         : 'encrypt'
		, category     : 'Comm'
		, explanation  : '암호화'
		, beScheme     : ''
		, requestParam : {'plainText':'abcdefg'} //평문
		, responeParam : {'encData':''}   //암호화된 베이스64 문자열
	}
	, decrypt : {
		scheme         : 'decrypt'
		, category     : 'Comm'
		, explanation  : '복호화'
		, beScheme     : ''
		, requestParam : {'encData':''}   //암호화된 베이스64 문자열
		, responeParam : {'plainText':''} //평문
	}
	, setRefreshAsset : {
		scheme         : 'setRefreshAsset'
		, category     : 'Comm'
		, explanation  : '더부자 탭 페이지 리로드 스크립트(refreshAppTechLst()) 호출'
		, beScheme     : 'comm=setRefreshAsset'
		, requestParam : ''
		, responeParam : ''
	}
	, setAssetColor : {
		scheme         : 'setAssetColor'
		, category     : 'Comm'
		, explanation  : '페이북 홈 the부자 버튼 색상설정'
		, beScheme     : 'comm=setAssetColor'
		, requestParam : {'color' : ''} //설정할 색상 스트링( red/green/yellow )
		, responeParam : ''
	}
	, setMainCard : {
		scheme         : 'setMainCard'
		, category     : 'Comm'
		, explanation  : '대표 카드 설정'
		, beScheme     : 'menu=setFstCard'
		, requestParam : {'vcSerial' : '', 'token' : '' }//ISP카드, 페이북카드
		, responeParam : ''
	}
	, getCardList : {
		scheme         : 'getCardList'
		, category     : 'Comm'
		, explanation  : '카드 목록 가져오기'
		, beScheme     : ''
		, requestParam : ''
		, responeParam : {'list':''}
	}
	, ispCardIssue : {
		scheme         : 'ispCardIssue'
		, category     : 'Comm'
		, explanation  : 'ISP 카드 발급 진행(카드정보 입력창으로 이동)'
		, beScheme     : 'comm=setRefreshAsset'
		, requestParam : ''
		, responeParam : ''
	}
	, idCardOCR : {
		scheme         : 'idCardOCR'
		, category     : 'Comm'
		, explanation  : '신분증 인증, 카메라 뷰를 열고 찍은 이미지 전달'
		, beScheme     : 'comm=idCardOCR'
		, requestParam : ''
		, responeParam : {'imageStr' : ''} //urlEncode 된 이미지 스트링
	}
	, fileDownload : {
		scheme         : 'fileDownload'
		, category     : 'Comm'
		, explanation  : '파일다운로드(iOS only)'
		, beScheme     : 'comm=fileDownload'
		, requestParam : {'url' : ''}
		, responeParam : ''
	}
	, saveFile : {
		scheme         : 'saveFile'
		, category     : 'Comm'
		, explanation  : '영수증이미지저장'
		, beScheme     : 'app://comm=reqImageDownload'
		, requestParam : {'imageStr' : ''} //urlEncode 된 이미지 스트링
		, responeParam : ''
	}
	, startInAppPay : {
		scheme         : 'startInAppPay'
		, category     : 'Comm'
		, explanation  : '인앱결제 시작'
		, beScheme     : 'ispmobile://payFrom=pbShop&tid=xxxx'
		, requestParam : {'channel' : '' //결제시작채널
						, 'tid' : ''} //거래id
		, responeParam : ''
	}
	, startMPM : {
		scheme         : 'startMPM'
		, category     : 'Comm'
		, explanation  : 'MPM 시작'
		, beScheme     : 'app://menu=startMPM'
		, requestParam : {'forwardUrl' : '' //완료 후 이동 Url
						, 'cancelUrl' : '' //취소 후 이동 Url
						, 'token' : ''} //결제할 카드의 토큰값
		, responeParam : ''
	}
	, startCPM : {
		scheme         : 'startCPM'
		, category     : 'Comm'
		, explanation  : 'CPM 시작'
		, beScheme     : 'app://menu=startCPM'
		, requestParam : {'forwardUrl' : '' //완료 후 이동 Url
						, 'cancelUrl' : '' //취소 후 이동 Url
						, 'token' : ''} //결제할 카드의 토큰값
		, responeParam : ''
	}
	, setOverseaQR : {
		scheme         : 'setOverseaQR'
		, category     : 'Comm'
		, explanation  : '해외QR설정'
		, beScheme     : 'app://comm=abQrSetVal'
		, requestParam : {'value' : ''} //해외QR 설정 값("C": 중국, "N": 중국 외, "M": 말레이시아 머니, "": Off)
		, responeParam : ''
	}
	, getOverseaQR : {
		scheme         : 'getOverseaQR'
		, category     : 'Comm'
		, explanation  : '해외QR조회'
		, beScheme     : ''
		, requestParam : ''
		, responeParam : {'value':''} //해외QR 설정 값("C": 중국, "N": 중국 외, "M": 말레이시아 머니, "": Off)
	}
	, startNetFunnel : {
		scheme         : 'startNetFunnel'
		, category     : 'Comm'
		, explanation  : '유량제어 시작 요청'
		, beScheme     : ''
		, requestParam : ''
		, responeParam : ''
	}
	, getEmergencyMenuList : {
		scheme         : 'getEmergencyMenuList'
		, category     : 'Comm'
		, explanation  : '긴급공지 메뉴 리스트 조회'
		, beScheme     : ''
		, requestParam : ''
		, responeParam : {'list' : ''}
	}
	, issueOpenPayReg : {
		scheme         : 'issueOpenPayReg'
		, category     : 'Comm'
		, explanation  : '오픈페이 직접카드등록 처리화면 이동'
		, beScheme     : ''
		, requestParam : ''
		, responeParam : ''
	}
	, showKeypad : {
		scheme         : 'showKeypad'
		, category     : 'Comm'
		, explanation  : '키패드노출'
		, beScheme     : ''
		, requestParam : ''
		, responeParam : ''
	}
	, openPageAfterLogin : {
		scheme         : 'openPageAfterLogin'
		, category     : 'Comm'
		, explanation  : 'DeepLink, Push, 이벤트 페이지에서 로그인 후 관련 페이지 열기'
		, beScheme     : ''
		, requestParam : {
						'menuId' : ''
						, 'params' : ''
						, 'url' : ''
						}
		, responeParam : ''
	}
	, startApp : {
		scheme         : 'startApp'
		, category     : 'Comm'
		, explanation  : '앱구동'
		, beScheme     : ''
		, requestParam : ''
		, responeParam : ''
	}
	, startPay : {
		scheme         : 'startPay'
		, category     : 'Comm'
		, explanation  : '결제하기 버튼 후 앱구동'
		, beScheme     : ''
		, requestParam : ''
		, responeParam : ''
	}
	//-----------------------------------------------------------------------------------------------//
	// Push
	//-----------------------------------------------------------------------------------------------//
	, getPushUnreadCount : {
		scheme         : 'getPushUnreadCount'
		, category     : 'Push'
		, explanation  : '읽지 않은 메시지 갯수'
		, beScheme     : 'AS-IS는 네이티브 화면'
		, requestParam : ''
		, responeParam : {'count':'11'} //푸시 알림 갯수
	}
	, getPushList : {
		scheme         : 'getPushList'
		, category     : 'Push'
		, explanation  : '푸시 목록 요청'
		, beScheme     : 'AS-IS는 네이티브 화면'
		, requestParam : {'pageNum' : '', 'lastId' : ''} //요청하는 페이지 번호. 한페이지당 100건. (Default: 1). 1:1~100, //2페이지부터 사용. 1페이지는 "0".  1page가 1000~901 이였다면. 2페이지는 (page:2, lastId:901)으로 요청.
		, responeParam : {'list' : ''}
	}
	, deletePushItem : {
		scheme         : 'deletePushItem'
		, category     : 'Push'
		, explanation  : '푸시 한건 삭제'
		, beScheme     : 'AS-IS는 네이티브 화면'
		, requestParam : {'itemId' : ''} //삭제할 푸시 아이템 구분값
		, responeParam : ''
	}
	, deletePushAll : {
		scheme         : 'deletePushAll'
		, category     : 'Push'
		, explanation  : '푸시 전체 삭제'
		, beScheme     : 'AS-IS는 네이티브 화면'
		, requestParam : ''
		, responeParam : ''
	}
	, setPushItemRead : {
		scheme         : 'setPushItemRead'
		, category     : 'Push'
		, explanation  : '푸시읽음처리'
		, beScheme     : 'AS-IS는 네이티브 화면'
		, requestParam : {'itemId' : ''} //읽음처리할 푸시 아이템 구분값
		, responeParam : ''
	}
	, setPushItemClick : {
		scheme         : 'setPushItemClick'
		, category     : 'Push'
		, explanation  : '푸시 클릭 처리'
		, beScheme     : ''
		, requestParam : {'itemId' : ''} //읽음처리할 푸시 아이템 구분값
		, responeParam : ''
	}
	, setPushItemReadAll : {
		scheme         : 'setPushItemReadAll'
		, category     : 'Push'
		, explanation  : '푸시 전체 읽음 처리'
		, beScheme     : ''
		, requestParam : ''
		, responeParam : ''
	}
	//-----------------------------------------------------------------------------------------------//
	// Permission
	//-----------------------------------------------------------------------------------------------/
	, checkPermission : {
		scheme         : 'checkPermission'
		, category     : 'Permission'
		, explanation  : '권한 확인'
		, beScheme     : 'menu=trackingPermission | comm=osPushYn'
		, requestParam : {'type' : '' //확인할 권한(권한리스트는 권한요청과 동일)
									//tracking - 앱추적(iOS only), location - GPS, osPush - 푸시권한, canera - 카메라
						}
		, responeParam : {'status' : '' } //상태값 allow : 승인, denied : 거부, restricted : 사용권한 없음, notDetermined : 권한미요청상태(default)
	}
	, requestPermission : {
		scheme         : 'requestPermission'
		, category     : 'Permission'
		, explanation  : '권한 요청'
		, beScheme     : 'menu=trackingPermission | menu=locationPermission'
		, requestParam : {'type' : '' //확인할 권한(권한리스트는 권한요청과 동일)
									//tracking - 앱추적(iOS only), location - GPS, osPush - 푸시권한
						}
		, responeParam : ''
	}
	//-----------------------------------------------------------------------------------------------//
	// AD
	//-----------------------------------------------------------------------------------------------//
	, getAdid : {
		scheme         : 'getAdid'
		, category     : 'AD'
		, explanation  : '앱의 adid, idfa 조회'
		, beScheme     : 'comm=getAdid'
		, requestParam : ''
		, responeParam : {'adid' : '', 'idfa' : ''} //앱의 adid, idfa 요청
										//각 값을 얻기에 실패한 경우, 빈칸으로 리턴
										//iOS의 경우 얻기 실패한 경우 00000000-0000-0000-0000-000000000000 로 리턴
	}
	, showOfferwall : {
		scheme         : 'showOfferwall'
		, category     : 'AD'
		, explanation  : '오퍼월 실행'
		, beScheme     : 'comm=showOfferwall'
		, requestParam : {'tabSlug':'', 'tagSlug':'', 'adID':''}
		, responeParam : ''
	}
	, showTapjoy : {
		scheme         : 'showTapjoy'
		, category     : 'AD'
		, explanation  : '탭조이 SDK광고 오퍼월 시작'
		, beScheme     : 'comm=tabjoy'
		, requestParam : {'token' : ''}
		, responeParam : ''
	}
	, showAdPopcorn : {
		scheme         : 'showAdPopcorn'
		, category     : 'AD'
		, explanation  : '애드팝콘 리워드 비디오/전면 광고 시작'
		, beScheme     : 'comm=adPopcorn'
		, requestParam : {'type' : ''}
		, responeParam : {'callbackCode' : ''}
	}
	, getAvailableReward : {
		scheme         : 'getAvailableReward'
		, category     : 'AD'
		, explanation  : '오퍼월 적립가능금액 조회'
		, beScheme     : 'comm=availableReward'
		, requestParam : ''
		, responeParam : {'points' : ''} //적립가능금액
	}
	, startTouchAd : {
		scheme         : 'startTouchAd'
		, category     : 'AD'
		, explanation  : '터치애드 SDK 호출'
		, beScheme     : 'comm=touchAd'
		, requestParam : {'type' : ''} //MoneyMenu, BannerMenu, MainMenu
		, responeParam : ''
	}
	, showTrendView : {
		scheme         : 'showTrendView'
		, category     : 'AD'
		, explanation  : '트랜드뷰 실행'
		, beScheme     : 'comm=showTrendView'
		, requestParam : {'token' : ''}
		, responeParam : ''
	}
	, showVoteAcm : {
		scheme         : 'showVoteAcm'
		, category     : 'AD'
		, explanation  : '투표적립 실행'
		, requestParam : {'snsData' : ''}
		, responeParam : ''
	}
	, startEnliple : {
		scheme         : 'startEnliple'
		, category     : 'AD'
		, explanation  : '엔라이플 SDK 호출'
		, beScheme     : 'comm=enliple'
		, requestParam : {'type' : '' //동작 정의(as is 기준 moveInquiryPage, movePPZPage, isShowADView)
						, 'memNo':''
						, 'targetId' : ''
						}
		, responeParam : {'targetId' : '', 'point' : ''}
	}
	, initAdfitSDK : {
		scheme         : 'initAdfitSDK'
		, category     : 'AD'
		, explanation  : 'Adfit SDK 초기화'
		, requestParam : ''
		, responeParam : ''
	}
};