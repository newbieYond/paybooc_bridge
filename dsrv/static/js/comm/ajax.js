
/******************************************************************************
* ajax 전역변수
******************************************************************************/
var ajaxCount   = 0;
var comTranList = []; /*공통 거래 Array*/
var comHeader   = {}; /*공통 헤더*/
var tranIdx     = 1;
var tokenFlag   = true;
var baseUrl     = (typeof PROPS !== "undefined") ? PROPS.BASE_URL : 'https://dev-app.paybooc.co.kr'; //TODO 운영URL 변경예정

async function getToken() {
	return new Promise(function(resolve, reject) {
		let cookieValue = document.cookie.match('(^|;)?' + 'Authorization' + '=([^;]*)(;|$)');
		let token = cookieValue ? cookieValue[2] : '';
		resolve(token);
	});
}

async function tokenTran() {
	return new Promise(function(resolve, reject) {
		scheme.callNativeBridge('refreshJwtToken', {}, function(res) {
			res = (typeof res == 'string') ? JSON.parse(res) : res;
			
			let isSuccess = true;
			if ( res.resultCode != 'success' ) {
				isSuccess = false;
			}
			/*
			else {
				let data = JSON.parse(res.params)
				resolve(data.netfunnel_key);
			}
			*/
			resolve(isSuccess);
		}, 'Y', 'Y');
	});
}

/********************************************************************************************************
* 토큰재발급
********************************************************************************************************/
async function refreshToken(callFn) {
	await tokenTran().then((res) => {
		if ( !res ) {
			//alert('일시적인 오류 입니다.');
			comTranList = [];
			if (com.getType(callFn) == 'function') {
				callFn();
			}
			return false;
		}
	});
	
	tokenFlag = true;
	doAllAjax();
}

/******************************************************************************
* 화면에서 호출될 ajax 거래 함수
******************************************************************************/
async function ajaxRequest(url, successFn, errorFn, param, type, dataType, isAsync, isLoading, etcOpt) {
	comHeader = {};
	let page_id = com.isNull(document.querySelector('html').getAttribute('page_id')) ? "" : document.querySelector('html').getAttribute('page_id');
	
	comHeader['PAGE-ID'] = page_id;
	
	var tranId = `tran-${tranIdx++}`;
	
	comTranList.push({url:url, successFn:successFn, errorFn:errorFn, param:param, type:type, dataType:dataType, tranId:tranId, isAsync:isAsync, isLoading:isLoading, ajaxOption:'01', etcOpt : etcOpt});
	if ( tokenFlag ) {
		doAjax(url, successFn, errorFn, param, type, dataType, isAsync, isLoading, tranId, etcOpt).then(function(data){
			//successFn(data);
			console.log('-----ajaxRequest success-----');
		}).catch(function(e){
			console.log('-----ajaxRequest error-----' + JSON.stringify(e));
			decAjaxCount();
			if (ajaxCount == 0) {
				hideLoadingbar();
			}
		});
	}
}

/******************************************************************************
* 토큰재발급 후 전체거래실행
******************************************************************************/
async function doAllAjax() {
	let ajaxList = new Array();
	comTranList.map((obj) => { ajaxList.push(obj); });
	ajaxList.map(async (tranList, idx) => {
		let option = tranList.ajaxOption;
		switch (option) {
			case '01' :
				await doAjax(tranList.url, tranList.successFn, tranList.errorFn, tranList.param, tranList.type, tranList.dataType, tranList.isAsync, tranList.isLoading, tranList.tranId, tranList.etcOpt).then(function(data){
					console.log('-----doAllAjax success-----' + idx);
				}).catch(function(e){
					console.log('-----doAllAjax error-----' + JSON.stringify(e));
					decAjaxCount();
					if (ajaxCount == 0) {
						hideLoadingbar();
					}
				});
				break;
			case '02' :
				await doMultipartAjax(tranList.url, tranList.successFn, tranList.errorFn, tranList.form, tranList.tranId).then(function(data){
					console.log('-----doAllAjax success-----' + idx);
				}).catch(function(e){
					console.log('-----doAllAjax error-----' + JSON.stringify(e));
					decAjaxCount();
					if (ajaxCount == 0) {
						hideLoadingbar();
					}
				});
				break;
		}
	});
	
	//거래중 들어온 데이터가 있을 경우 다시 호출
	/*
	if ( comTranList.length > 0 ) {
		doAllAjax();
	}
	*/
}


/******************************************************************************
* 페이북 ajax거래 실행
******************************************************************************/
async function doAjax(url, successFn, errorFn, param, type, dataType, isAsync, isLoading, tranId, etcOpt) {
	let _param   = param;
	let _type    = type;
	let _url     = url;
	let _isAsync = false;
	if (typeof isAsync === 'boolean'){
		_isAsync = isAsync;
	}
	let _isLoading = true;
    if (typeof isLoading === 'boolean') {
		_isLoading = isLoading;
    }
	
	//앱이 아닌 경우 쿠키값을 헤더에 셋팅
	if ( com.isInApp() === false && com.getProfile == 'local' ) {
		let token = '';
		await getToken().then((res) => {
			token = res;
		});
		if ( token != '' ) {
			comHeader['Authorization'] = token;
		}
	}
	
	
	if ( typeof _param === "string" ) {
		_param = com.toObject(param);
	}
	
	if (typeof _param === "object" && (_type.toLowerCase() == "post" || _type.toLowerCase() == "put" || _type.toLowerCase() == "delete")) {
		comHeader['Content-Type'] = "application/json";
		_param = JSON.stringify(_param); // 추가
	}
	
	if ( _url.startsWith('http') === false ) {
		_url = baseUrl + url;
	}
	let tranTimeout = 30000;
	if ( etcOpt && etcOpt.timeout ) {
		tranTimeout = etcOpt.timeout;
	}
	
	return $.ajax({
		url         : _url
		, type      : _type
		, dataType  : dataType
		, data      : _param
		, async     : _isAsync
		, cache     : false
		, timeout   : tranTimeout
		, xhrFields : {
			withCredentials: true
		}
		, headers : {
			...comHeader
		}
		
		, beforeSend : function (xmlHttpRequest) {
			if ( _isLoading && ajaxCount == 0 ) {
				showLoadingbar();
			}
			incAjaxCount();
		}
	}).done((data, textStatus, jqXHR) => {
		if ( com.isNull(data.res_code) === false && (data.res_code === "BBBE006" || data.res_code === "BBBBJ32" || data.res_code.substr(3) === "E006") ) {
			if ( com.isInApp() === true ) {
				tokenFlag = false;
				refreshToken(errorFn);
			} else {
				deleteTranList(tranId);
				tokenFlag = true;
				decAjaxCount();
				if (com.getType(successFn) == 'function') {
					successFn(data, textStatus, jqXHR);
				}
			}
		} else {
			deleteTranList(tranId);
			tokenFlag = true;
			decAjaxCount();
			if (com.getType(successFn) == 'function') {
				successFn(data, textStatus, jqXHR);
			}
		}
		
	}).fail((jqXHR, textStatus) => {
		if ( textStatus == 'timeout' ) {
			com.errAlert("TIMEOUT ERROR 지정한 시간이 지나서 요청을 처리하지 못했습니다.", '오류', textStatus, function(){
				if (com.getType(errorFn) == 'function') {
					errorFn(jqXHR, textStatus);
				}
			}, '확인');
		} else if ( textStatus == 'parsererror' ) {
			com.errAlert("PARSER ERROR 파서에러가 발생하였습니다.", '오류', textStatus, function(){
				if (com.getType(errorFn) == 'function') {
					errorFn(jqXHR, textStatus);
				}
			}, '확인');
		} else {
			if ( jqXHR.status == 401 ) {
				if ( com.isInApp() === true ) {
					tokenFlag = false;
					refreshToken(errorFn);
				} else {
					tokenFlag = true;
					deleteTranList(tranId);
					if (com.getType(errorFn) == 'function') {
						errorFn(jqXHR, textStatus);
					}
				}
			} else if ( jqXHR.status == 599 ) { //서비스점검중 화면이동
				//g.t 전달받아 오류페이지로 이동시킨다
				comTranList = [];
				com.goNext('P0002PG007P', {}, false, 'new', 'Y', '', '');
			} else if ( jqXHR.status == 403 || jqXHR.status == 502 ) { //얼럿 후 앱 재실행
				//g.t 전달받아 오류페이지로 이동시킨다
				comTranList = [];
				if ( _url.indexOf('/pybc/api/membauth/login/inq-login') > -1 || _url.indexOf('/pybc/api/card/card-issu/card-issu/pybc-card-ocr-chck/intn-ocr-prcs-koi') > -1 || _url.indexOf('/pybc/api/card/card-mgt/cstmr-rflf/pybc-cstmr-rflf/req-idcard-koiware-ocr-chk')> -1|| _url.indexOf('/pybc/api/card/loan/loan/cdt-loan-ocr-prcs/cdt-loan-ocr-prcs')> -1|| _url.indexOf('/pybc/api/card/loan/loan/card-loan/ocr-info-koi')> -1) {
					if (com.getType(errorFn) == 'function') {
						errorFn(jqXHR, textStatus);
					}
				} else {
					com.errAlert("일시적인 오류로 서비스에 접속할 수 없습니다. 앱을 재실행 해주세요.", '엑세스 권한이 없습니다', jqXHR.status, function(){
						if ( com.isInApp() === true ) {
							scheme.callNativeBridge('restartApp', {});
						} else {
							if (com.getType(errorFn) == 'function') {
								errorFn(jqXHR, textStatus);
							}
						}
					}, '확인');
				}
			} else {
				let status = jqXHR.status;
				let errMsg = '';
				
				switch(status) {
					//case 0 : errMsg = '네트워크 오류가 발생하였습니다.'; break;
					case 400 : errMsg = '요청에 문제가 있어 서버에서 인식할 수 없습니다.'; break;
					case 404 : errMsg = '요청한 URL을 찾을 수 없습니다.'; break;
					case 406 : 
					case 409 : 
					case 500 : errMsg = '서버 처리 중에 문제가 발생하였습니다.'; break;
					default  : errMsg = status + ' 코드에러가 발생하였습니다.'; break;
				}
				if ( status == 405 || status == 0 ) {
					tokenFlag = true;
					deleteTranList(tranId);
					if (com.getType(errorFn) == 'function') {
						errorFn(jqXHR, textStatus);
					}
				} else {
					com.errAlert(errMsg, '오류', status, function(){
						tokenFlag = true;
						deleteTranList(tranId);
						if (com.getType(errorFn) == 'function') {
							errorFn(jqXHR, textStatus);
						}
					}, '확인');
				}
			}
		}
	}).always((jqXHR, textStatus) => {					
		decAjaxCount();
		if (_isLoading && ajaxCount == 0) {
			hideLoadingbar();
		}
	});
}

/******************************************************************************
* array삭제
******************************************************************************/
function deleteTranList(tranId) {
	for ( let i in comTranList ) {
	    let tranObj = comTranList[i];
	    if (tranObj.tranId == tranId) {
	        comTranList.splice(i,1);
	    }
	}
}

/******************************************************************************
* 로딩바 노출
******************************************************************************/
function showLoadingbar() {
	var obj = $("#mPB_loading");
	if (obj.length == 0) {
		obj = `<div class="renew_loading" id="mPB_loading"><div class="renew_loading_img"><span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="dot"></span></div></div>`;
		$(obj).appendTo('body');
	}	
	$(obj).show();
}

/******************************************************************************
* 로딩바 제거
******************************************************************************/
function hideLoadingbar() {
	var obj = $("#mPB_loading");
	obj.hide();
}

/***** ajax count 증가 *****/
function incAjaxCount() {
	if (ajaxCount < 0) ajaxCount = 0;

	ajaxCount++;
}


/***** ajax count 감소 *****/
function decAjaxCount() {
	ajaxCount--;

	if (ajaxCount < 0) ajaxCount = 0;
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

/******************************************************************************
* mulipart ajax
******************************************************************************/
async function multipartAjaxRequest(url, successFn, errorFn, form) {
	let page_id = com.isNull(document.querySelector('html').getAttribute('page_id')) ? "" : document.querySelector('html').getAttribute('page_id');
	comHeader = {};
	comHeader['PAGE-ID'] = page_id;
	
	var tranId = `tran-${tranIdx++}`;
	
	comTranList.push({url:url, successFn:successFn, errorFn:errorFn, form:form, tranId:tranId, ajaxOption:'02'});
	
	if ( tokenFlag ) {
		doMultipartAjax(url, successFn, errorFn, form, tranId).then(function(data){
			//successFn(data);
			console.log('-----multipartAjaxRequest success-----');
		}).catch(function(e){
			console.log('-----multipartAjaxRequest error-----' + JSON.stringify(e));
			decAjaxCount();
			if (ajaxCount == 0) {
				hideLoadingbar();
			}
		});
	}
}

/******************************************************************************
* 페이북 ajax거래 실행
******************************************************************************/
async function doMultipartAjax(url, successFn, errorFn, form, tranId) {
	let formData = new FormData(form[0]);
	let _url     = url;
	
	if ( _url.startsWith('http') === false ) {
		_url = baseUrl + url;
	}
	
	if ( com.isInApp() === false ) {
		let token = '';
		await getToken().then((res) => {
			token = res;
		});
		if ( token != '' ) {
			comHeader['Authorization'] = token;
		}
	}
	
	return $.ajax({
		url           : _url
		, type        : 'POST'
		, dataType    : 'json'
		, enctype     : "multipart/form-data"
        , contentType : false
        , processData : false
		, data      : formData
		, async     : false
		, headers : {
			...comHeader
		}
		
		, beforeSend : function (xmlHttpRequest) {
			if ( ajaxCount == 0 ) {
				showLoadingbar();
			}
			incAjaxCount();
		}
	}).done((data, textStatus, jqXHR) => {
		deleteTranList(tranId);
		tokenFlag = true;
		decAjaxCount();
		if (com.getType(successFn) == 'function') {
			successFn(data, textStatus, jqXHR);
		}
		
	}).fail((jqXHR, textStatus) => {
		if ( jqXHR.status == 401 ) {
			//토큰이 유효하지 않은경우 재발급
			tokenFlag = false;
			
			refreshToken(errorFn);
		} else {
			tokenFlag = true;
			deleteTranList(tranId);
			if (com.getType(errorFn) == 'function') {
				errorFn(jqXHR, textStatus);
			}
		}
	}).always((jqXHR, textStatus) => {					
		decAjaxCount();
		if (ajaxCount == 0) {
			hideLoadingbar();
		}
	});
}

/*********************************************************************************************
* 인포맥스 ajax
*********************************************************************************************/
async function doInfomaxAjax(url, successFn, errorFn, param, isLoading, isAsync) {
	let _param   = param;
	let _isLoading = true;
	if (typeof isLoading === 'boolean') {
		_isLoading = isLoading;
    }
    let _isAsync = false;
	if (typeof isAsync === 'boolean'){
		_isAsync = isAsync;
	}
	comHeader['Content-Type'] = "application/json";
	_param = JSON.stringify(_param); // 추가
	
	return $.ajax({
		url         : url
		, type      : 'POST'
		, dataType  : 'json'
		, data      : _param
		, async     : _isAsync
		, headers : {
			...comHeader
		}
		, beforeSend : function (xmlHttpRequest) {
			if ( _isLoading && ajaxCount == 0 ) {
				showLoadingbar();
			}
			incAjaxCount();
		}
	}).done((data, textStatus, jqXHR) => {
		decAjaxCount();
		if (com.getType(successFn) == 'function') {
			successFn(data, textStatus, jqXHR);
		}
	}).fail((jqXHR, textStatus) => {
		if (com.getType(errorFn) == 'function') {
			errorFn(jqXHR, textStatus);
		}
	}).always((jqXHR, textStatus) => {					
		decAjaxCount();
		if ( _isLoading && ajaxCount == 0 ) {
			hideLoadingbar();
		}
	});
}

/*********************************************************************************************
* header없는 거래
*********************************************************************************************/
async function callAjax(url, successFn, errorFn, param, type, dataType) {
	let _param   = param;
	let _type    = type;
	let _url     = url;
	if ( typeof _param === "string" ) {
		_param = com.toObject(param);
	}
	
	if (typeof _param === "object" && (_type.toLowerCase() == "post" || _type.toLowerCase() == "put" || _type.toLowerCase() == "delete")) {
		_param = JSON.stringify(_param); // 추가
	}
	
	return $.ajax({
		url         : _url
		, type      : _type
		, dataType  : dataType
		, data      : _param
		, timeout   : 30000
		, beforeSend : function (xmlHttpRequest) {
			if ( ajaxCount == 0 ) {
				showLoadingbar();
			}
		}
	}).done((data, textStatus, jqXHR) => {
		decAjaxCount();
		if (com.getType(successFn) == 'function') {
			successFn(data, textStatus, jqXHR);
		}
	}).fail((jqXHR, textStatus) => {
		if (com.getType(errorFn) == 'function') {
			errorFn(jqXHR, textStatus);
		}
	}).always((jqXHR, textStatus) => {					
		decAjaxCount();
		if (ajaxCount == 0) {
			hideLoadingbar();
		}
	});
}
