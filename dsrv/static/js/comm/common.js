/***************************************************************************************************
 @Filename   : common.js
 @CreateDate : 2023.12.21
 @Author     : 홍윤택
 @Desc       : 페이북 재구축 프로젝트
***************************************************************************************************/

//var payboocCdnUri = document.querySelector("#payboocCdnUri").getAttribute("data-contextPath");

//Object 함수로 처리한다.
var com = {};
com.agent = navigator.userAgent.toLowerCase();

/*********************************************************************
* application 데이터 셋팅
*********************************************************************/
/*
com.getCdnUri  = (PROPS?.CDN_URI) ? PROPS.CDN_URI : window.location.origin + "/ui";
com.getProfile = (PROPS?.SPRING_PROFILE) ? PROPS.SPRING_PROFILE : "dev";
com.getBaseUrl = (PROPS?.BASE_URL) ? PROPS.BASE_URL : "https://dev-app.paybooc.co.kr";
*/
com.getCdnUri  = (typeof PROPS !== "undefined" && PROPS.hasOwnProperty("CDN_URI") === true) ? PROPS.CDN_URI : window.location.origin + "";
com.getProfile = (typeof PROPS !== "undefined" && PROPS.hasOwnProperty("SPRING_PROFILE") === true) ? PROPS.SPRING_PROFILE : "dev";
com.getBaseUrl = (typeof PROPS !== "undefined" && PROPS.hasOwnProperty("BASE_URL") === true) ? PROPS.BASE_URL : "https://dev-app.paybooc.co.kr";
com.getSubUrl  = (typeof PROPS !== "undefined" && PROPS.hasOwnProperty("SUB_URL") === true) ? PROPS.SUB_URL : "https://dev-app.paybooc.co.kr";

com.getCustomAgent = function(){
	let agentInfo = {};
	if ( com.isInApp() === true ) {
		let match = navigator.userAgent.match(/\(.*?\)/g);
		let strAgent = match.pop();
		strAgent = strAgent.replace('(', '').replace(')', '');
		let spAgent = strAgent.split(';');
		
		agentInfo['osType'] = spAgent[0]; //OS종류
		agentInfo['osVersion'] = spAgent[1]; //OS버전
		agentInfo['appVersion'] = spAgent[2]; //APP버전
		agentInfo['model'] = spAgent[3]; //ahepdauf
		agentInfo['company'] = spAgent[4]; //wpwhtk
		agentInfo['mcc'] = spAgent[5]; //MCC
	}
	
	return agentInfo;
}

com.getAppVersion = function () {
	if ( com.isInApp() === true ) {
		return com.extractVersion(/paybooc\/(.*)\(/, 1);
	} else {
		return '';
	}
}

com.extractVersion = function(expr, pos) {
	var match = com.agent.match(expr);
	return match && match.length >= pos && parseInt(match[pos], 10);
}

/******************************************************************************
* 로컬스토리지 저장
******************************************************************************/
com.setLocalStorage = function (key, value) {
	var today = com.getUtcDateToKR().format('yyyyMMddHHmmss');
	var item = {
		timestamp : today
		, data    : value
	};
	
	localStorage.setItem(key, JSON.stringify(item));
}

/******************************************************************************
* 로컬스토리지 가져오기
******************************************************************************/
com.getLocalStorage = function (key, pattern, amount) {
	var now             = com.getUtcDateToKR();
	var returnVal       = JSON.parse(localStorage.getItem(key));
	if ( this.isNull(returnVal) === true ) {
		return '';
	}
	
	if ( com.isNull(pattern) === true ) {
		var toDate = new Date();
		pattern = toDate.format('yyyyMMdd');
		amount  = 0;
	}
	
	if ( pattern.length > 1) {
		if ( pattern.length < 8 ) {
			return '';
		} else {
			now = pattern.parseDate('yyyyMMddHHmmss');
		}
	}
	
	//As-Is 에서 저장한 데이터는 그대로 전달한다.
	if ( returnVal.hasOwnProperty('timestamp') == false ) {
		returnVal = localStorage.getItem(key);
		com.setLocalStorage(key, returnVal);
		return returnVal;
	} else {
		var returnTimestamp = returnVal.timestamp.parseDate('yyyyMMddHHmmss');
		var calTimestamp    = returnTimestamp.dateAdd2(pattern, amount);
		if ( now <= calTimestamp ) {
			return returnVal.data;
		} else {
			com.clearLocalStorage(key);
			return '';
		}
	}
}

/******************************************************************************
* 로컬스토리지 삭제
******************************************************************************/
com.clearLocalStorage = function (key) {
	localStorage.removeItem(key);
}

/******************************************************************************
* 한국시간조회
******************************************************************************/
com.getUtcDateToKR = function () {
	var now = new Date();
	var KR_TIME_DIFF = 9 * 60 * 60 * 1000;
	var utc   = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
	var today = new Date(utc + KR_TIME_DIFF);
	return today;
}


/*********************************************************************
* null 체크
*********************************************************************/
com.isNull = function (obj) {
	if (obj == null || typeof obj == "undefined" || obj === "") {
		return true;
	}
	return false;
}

/*********************************************************************
* 빈 문자열 체크
*********************************************************************/
com.isEmpty = function (text) {
	if (this.isNull(text)) {
		return true;
	} else {
		text = String(text);
	}

	return text.length == 0 || /^\s*$/.test(text);
}

com.isEmptyObj = function (obj) {
	if (obj.constructor === Object && Object.keys(obj).length === 0) {
		return true;
	}
	return false;
}

/*********************************************************************
* 띄어쓰기를 포함하여 null 체크
*********************************************************************/
com.isNullOrEmpty = function (obj) {
	if (this.isNull(obj)) {
		return true;
	} else {
		if (this.getType(obj) == 'string') {
			if (obj.length < 1) {
				return true;
			}
		}
	}
	return false;
}

/*********************************************************************
* 띄어쓰기를 미포함하여 null 체크
*********************************************************************/
com.isNullOrBlank = function (obj) {
	if (this.isNull(obj)) {
		return true;
	} else {
		if (this.getType(obj) == 'string') {
			if (obj.trim().length < 1) {
				return true;
			}
		}
	}
	return false;
}

/*********************************************************************
* 길이 체크를하여 리턴
*********************************************************************/
com.isLength = function (obj) {
	if (!this.isNull(obj) && obj.length > -1) {
		return true;
	}
	return false;
}

/*********************************************************************
* undefined 체크
*********************************************************************/
com.isUndefined = function (obj) {
	return (obj == undefined);
}

/*********************************************************************
* 배열 여부 체크
*********************************************************************/
com.isArray = function (obj) {
	if (!this.isNull(obj) && this.getType(obj) == "object" && !this.isUndefined(obj.length)) {
		return true;
	} else {
		return false;
	}
}

/*********************************************************************
* 숫자여부 체크
*********************************************************************/
com.isNumber = function (str) {
	if (this.isNull(str)) {
		return false;
	}
	return (/^[0-9]+$/).test(str) ? true : false;
}

/*********************************************************************
* 이름 2글자 이상 입력 체크
*********************************************************************/
com.isCheckName = function (str) {
	if (this.isNull(str)) {
		return false;
	}
	str = String(str);
	return [...str.replace(/\s+/g, '')].length > 1;
}

/*********************************************************************
* 이메일여부 체크
*********************************************************************/
com.isEmail = function (str) {
	if (this.isNull(str)) {
		return false;
	}
	str = String(str);
	return (/^[_0-9a-zA-Z-]([-_\.]?[_0-9a-zA-Z-])*@[0-9a-zA-Z]([\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,4}$/i).test(str);
}

/*********************************************************************
* 전화번호여부 체크
*********************************************************************/
com.isPhone = function (str, formatChar) {
	if (this.isNull(str)) {
		return false;
	}
	let arg = formatChar ? formatChar : "";
	return eval("(/^(02|013[0-9]{1}|050[0-9]{1}|0[3-9]{1}[0-9]{1})" + arg + "[1-9]{1}[0-9]{2,3}" + arg + "[0-9]{4}$/).test(str)");
}

/*********************************************************************
* 휴대폰번호여부 체크
*********************************************************************/
com.isMobile = function (str, formatChar) {
	if (this.isNull(str)) {
		return false;
	}
	let arg = formatChar ? formatChar : "";
	return eval("(/^01[016789]" + arg + "[1-9]{1}[0-9]{2,3}" + arg + "[0-9]{4}$/).test(str)");
}

/*********************************************************************
* 생년월일여부 체크
*********************************************************************/
com.isBrithDate = function (str) {
	if (this.isNull(str)) {
		return false;
	}
	str = String(str);
	return (/([0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[1,2][0-9]|3[0,1]))/).test(str);
}

/*********************************************************************
* 사업자번호여부 체크
*********************************************************************/
com.isBizNo = function (str, formatChar) {
	if (this.isNull(str)) {
		return false;
	}
	let arg = formatChar ? formatChar : "";
	let bizNo = eval("str.match(/^[0-9]{3}" + arg + "[0-9]{2}" + arg + "[0-9]{5}$/)");
	if (this.isNull(bizNo)) {
		return false;
	} else {
		bizNo = this.isNull(bizNo.toString()) ? bizNo.toString() : this.getNumber(bizNo);
	}
	if ('0000000000' == bizNo || '4444444444' == bizNo || '8888888888' == bizNo) {
		return false;
	}
	let a = parseInt(bizNo.substring(0, 1), 10);
	let b = parseInt(bizNo.substring(1, 2), 10);
	let c = parseInt(bizNo.substring(2, 3), 10);
	let d = parseInt(bizNo.substring(3, 4), 10);
	let e = parseInt(bizNo.substring(4, 5), 10);
	let f = parseInt(bizNo.substring(5, 6), 10);
	let g = parseInt(bizNo.substring(6, 7), 10);
	let h = parseInt(bizNo.substring(7, 8), 10);
	let i = parseInt(bizNo.substring(8, 9), 10);
	let j = parseInt(bizNo.substring(9, 10), 10);
	let sum = 0;
	sum += a * 1 % 10;
	sum += b * 3 % 10;
	sum += c * 7 % 10;
	sum += d * 1 % 10;
	sum += e * 3 % 10;
	sum += f * 7 % 10;
	sum += g * 1 % 10;
	sum += h * 3 % 10;
	sum += i * 5 % 10 + Math.floor(i * 5 / 10);
	sum += j * 1 % 10;
	return (sum % 10 == 0) ? true : false;
}

/*********************************************************************
* 법인번호여부 체크
*********************************************************************/
com.isCorpNo = function (str, formatChar) {
	if (this.isNull(str)) {
		return false;
	}
	let arg = formatChar ? formatChar : "";
	let corpNo = eval("str.match(/^[0-9]{6}" + arg + "[0-9]{7}$/)");
	if (this.isNull(corpNo)) {
		return false;
	} else {

		corpNo = this.isNull(corpNo.toString()) ? corpNo.toString() : this.getNumber(corpNo);
	}
	if ('0000000000000' == corpNo) {
		return false;
	}
	return true;
}

/*********************************************************************
* 안드로이드 여부
*********************************************************************/
com.isAndroid = function () {
	return this.agent.match(/android/i) == null ? false : true;
} 

/*********************************************************************
* iOS 여부
*********************************************************************/
com.isIos = function () {
	return this.agent.match(/iphone|ipad|ipod/i) == null ? false : true;
}

/*********************************************************************
* inApp 여부체크
*********************************************************************/
com.isInApp = function () {
	return this.agent.match(/paybooc/i) == null ? false : true;
}

com.isMobileCheck = () => {
	let check = false;
	(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
	return check;
}

/*********************************************************************
* 비밀번호에 생년월일이 포함되었는지 체크
*********************************************************************/
com.checkValidBirth = function (password, yyMMdd) {
	let isPass = true;

	if (this.isNull(password) || this.isNull(yyMMdd)) {
		return false;
	}
	password = String(password);
	yyMMdd = String(yyMMdd);

	if (password.indexOf(yyMMdd) !== -1) {
		isPass = false;
	}

	return isPass;
}

/*********************************************************************
* 비밀번호 연속으로 3자리가 동일한지 체크
*********************************************************************/
com.checkValidDupli = function (password) {
	let isPass = true;

	if (this.isNull(password)) {
		return false;
	}
	password = String(password);
	for (var i = 0; i < password.length - 2; i++) {
		if (password.charAt(i) === password.charAt(i + 1)) {
			if (password.charAt(i) === password.charAt(i + 2)) {
				isPass = false;
				break;
			}
		}
	}

	return isPass;
}

/*********************************************************************
* 비밀번호 연속으로 3자리가 늘어나는지 체크
*********************************************************************/
com.checkValidConse = function (password) {
	let isPass = true;

	if (this.isNull(password)) {
		return false;
	}
	password = String(password);
	for (var i = 0; i < password.length - 2; i++) {
		var num1 = parseInt(password.charAt(i));
		var num2 = parseInt(password.charAt(i + 1));
		var num3 = parseInt(password.charAt(i + 2));

		// 연속성(+)
		if (num3 - num2 == 1 && num2 - num1 == 1) {
			isPass = false;
		}

		// 연속성(-)
		if (num1 - num2 == 1 && num2 - num3 == 1) {
			isPass = false;
		}
	}

	return isPass;
}

/*********************************************************************
* 비밀번호에 휴대폰번호가 포함되었는지 체크
*********************************************************************/
com.checkValidPhone = function (password, last4) {
	let isPass = true;

	if (this.isNull(password)) {
		return false;
	}
	password = String(password);
	last4 = String(last4);
	if (password.indexOf(last4) !== -1) {
		isPass = false;
	}

	return isPass;
}

/*********************************************************************
* nvl 기능
*********************************************************************/
com.getNvl = function (obj, def) {
	return this.isNull(obj) ? def : obj;
}

/*********************************************************************
* object 타입을 리턴
*********************************************************************/
com.getType = function (obj) {
	if (this.isNull(obj)) {
		return 'null';
	}
	return (typeof obj).toLowerCase();
}


/*********************************************************************
* 문자열의 숫자만 추출하여 리턴
*********************************************************************/
com.getNumber = function (str) {
	if (this.isNull(str)) {
		return '';
	}
	str = str.toString().replace(/[^0-9]/g, "").trim();
	return str;
}

/*********************************************************************
* 천단위 콤마 넣기
*********************************************************************/
com.setComma = function (num) {
	let parts = String(num).split(".");
	return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
}

/*********************************************************************
* 공백 삭제
*********************************************************************/
com.getRemoveSpace = function (str) {
	return str.replace(/(\s*)/g, '');
}

/*********************************************************************
* Object의 index에 해당하는 값을 리턴
*********************************************************************/
com.getObject = function (obj, idx) {
	if (this.isLength(obj)) {
		if (obj.type == 'select-one' || obj.type == 'select-multiple') {
			return obj;
		}
		return obj[idx];
	} else {
		return obj;
	}
}

/*********************************************************************
* object size value 계산
*********************************************************************/
com.getObjectSize = function (obj) {
	let size = 0;
	for (let key in obj) {
		if (obj.hasOwnProperty(key)) { size++; }
	}
	return size;
}

/*********************************************************************
* 금액 포맷을 적용하여 리턴
*********************************************************************/
com.getMoneyFormat = function (str, def) {
	if (this.isNull(str)) {
		return def;
	}
	str = str.toString().replace(/[,]/g, "").trim();
	if (!isNaN(str) && str.length > 0) {
		while ((/(-?[0-9]+)([0-9]{3})/).test(str)) {
			str = str.replace((/(-?[0-9]+)([0-9]{3})/), "$1,$2");
		}
	}
	return str;
}

/*********************************************************************
* 배열에서 값에 의한 위치 반환.
*********************************************************************/
com.getIndexByVal = function (arr, val) {
	let idx = -1;
	if (this.isArray(arr)) {
		for (let ii = 0; ii < arr.length; ++ii) {
			if (arr[ii] == val) {
				idx = ii;
				break;
			}
		}
	} else if (arr == val) {
		idx = 0;
	}
	return idx;
}

/*********************************************************************
* strValue에 포함된 문자를 제거.
*********************************************************************/
com.getRemoveMark = function (str, markList) {
	for (let ii = 0; ii < markList.length; ++ii) {
		str = str.replace(eval("/" + markList.charAt(ii) + "/g"), "");
	}
	return str;
}

/*********************************************************************
* strValue에 포함된 문자를 제거.
*********************************************************************/
com.getStringByte = function (text) {
	if (this.isNull(text)) {
		return 0;
	} else {
		text = String(text);
	}

	let len = 0;

	for (let i = 0; i < text.length; i++) {
		if (escape(text.charAt(i)).length >= 4) len += 2;
		else if (escape(text.charAt(i)).length === '%A7') len += 2;
		else if (escape(text.charAt(i)).length !== '%0D') len++;
	}

	return len;
}

/*********************************************************************
* 문자열을 Byte로 Cut하여 리턴.
* nByte째 문자가 1Byte이상이면 그 이전 문자열까지 반환.
*********************************************************************/
com.getByteCutString = function (str, nByte, strMark, isChkEnt) {
	if (this.isNull(str)) {
		return "";
	}

	let onechar;
	let cnt = 0;
	isChkEnt = (isChkEnt == null) ? false : isChkEnt;

	for (let ii = 0; ii < str.length; ++ii) {
		onechar = escape(str.charAt(ii));

		if (onechar.length > 4) {
			cnt += 2;
		} else {
			if (isChkEnt) {
				if (onechar != '%0A') {
					++cnt;
				}
			} else {
				++cnt;
			}
		}

		if (nByte < cnt) {
			strMark = (this.isNull(strMark)) ? "" : strMark;
			return str.substring(0, ii) + strMark;
		}
	}
	return str;
}

/*********************************************************************
* 특수문자 제거
* el : input id를 넣는다.
*********************************************************************/
com.checkXss = function (el) {
	let valid = "&%*+;!()<>\"\'";
	let temp;
	let temp_str = "";

	for (let i = 0; i < el.value.length; i++) {
		temp = "" + el.value.substring(i, i + 1);
		if (valid.indexOf(temp) != "-1") {
			el.value = temp_str;
			alert("특수문자는 사용에 제한이 됩니다.");
			el.select();
			return false;
		} else {
			temp_str = temp_str + temp;
		}
	}
	return true;
}

com.defenseXSS = function (word) {
	let regex = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9| |]+$/;
	if ( !regex.test(word) ) {
		alert('특수문자는 입력할 수 없습니다.');
		return false;
	}
	return true;
}

/*********************************************************************
* JSON 리스트 합계
*********************************************************************/
com.getJsonTotal = function (list) {
	let total = {};
	$.each(list, function (idx, row) {
		for (let key in row) {
			if ($.isNumeric(row[key])) {
				let data = parseInt(row[key]);
				if (!total.hasOwnProperty(key)) {
					total[key] = data;
				} else {
					total[key] += data;
				}
			}
		}
	});
	return total;
}

/*********************************************************************
* 배열에서 타겟 키값의 합계를 구한다.
*********************************************************************/
com.getArraySumAmt = function (list, target) {
	if (list != null && Array.isArray(list)) {
		if (list.length > 0) {
			return list.reduce((a, b) => { return a + Number(com.getNvl(b[target], 0)); }, 0);
		}
	}

	return 0;
}

/*********************************************************************
* 배열에서 타겟 키값의 합계를 구한다.
*********************************************************************/
com.getDecodeHtmlTag = function (source) {
	if (this.isNull(source)) {
		source = '';
	}
	return source
		.replace(/&amp;/g, '&')
		.replace(/&quot;/g, '"')
		.replace(/&#34;/g, '"')
		.replace(/&#39;/g, '\'')
		.replace(/&lt;/g, '<')
		.replace(/&#60;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&#62;/g, '>')
		.replace(/&middot;/g, '·')
		.replace(/&#40;/g, '(')
		.replace(/&#41;/g, ')')
		.replace(/&#47;/g, '/')
		.replace(/&#x2F;/g, '/')
		.replace(/_img_/g, 'img')
		.replace(/_src_/g, 'src')
		.replace(/_onload_/g, 'onload')
		.replace(/_onmouseover_/g, 'onmouseover')
		.replace(/_alert_/g, 'alert')
		.replace(/_location_/g, 'location')
		.replace(/_function_/g, 'function')
		.replace(/_window_/g, 'window')
		.replace(/_confirm_/g, 'confirm')
		.replace(/_script_/g, 'script');
}

com.decodeAllHtml = function (s) {
	if (this.isNull(s)) {
		return '';
	}
	s = s.replace(/&lt;/g, '<');
	s = s.replace(/&#60;/g, '<');
	s = s.replace(/&gt;/g, '>');
	s = s.replace(/&#62;/g, '>');
	s = s.replace(/&#39;/g, '\'');
	s = s.replace(/&#x27;/g, '\'');
	s = s.replace(/&quot;/g, '"');
	s = s.replace(/&#34;/g, '"');
	s = s.replace(/&#40;/g, '(');
	s = s.replace(/&#41;/g, ')');
	s = s.replace(/&#47;/g, '/');
	s = s.replace(/&#x2F;/g, '/');
	s = s.replace(/&amp;/g, '&');
	return s;
}

com.encodeAllHtml = function (s) {
	if (this.isNull(s)) {
		return '';
	}
	s = s.replace(/</gmi , '&lt;');
	s = s.replace(/>/gmi , '&gt;');
	s = s.replace(/\'/gmi, '&#39;');
	s = s.replace(/\"/gmi , '&quot;');
	s = s.replace(/\(/gmi , '&#40;');
	s = s.replace(/\)/gmi , '&#41;');
	s = s.replace(/\// , '&#47;');
	return s;
}

com.decodeHtmlEvent = (obj) => {
	let allowedTag = ['class'];
	let nodeToAllowedTag = {
		div      : []
		, table  : ['summary']
		, col    : ['style']
		, th     : ['scope', 'style']
		, strong : ['style']
	};
	return com.decodeTargetHtml(obj, allowedTag, nodeToAllowedTag);
}
com.decodeHtmlTerms = (obj) => {
	let allowedTag = ['class'];
	let nodeToAllowedTag = {
		div     : []
		, table : ['summary']
		, col   : ['style']
		, th    : ['scope', 'style', 'rowspan', 'colspan']
		, td    : ['style', 'rowspan', 'colspan']
		, a		: ['onclick', 'href', 'target']
	};
	return com.decodeTargetHtml(obj, allowedTag, nodeToAllowedTag);
}
com.decodeHtmlBanner = (obj) => {
	let allowedTag = ['class'];
	let nodeToAllowedTag = {
		div     : []
		, table : ['summary']
		, col   : ['style']
		, th    : ['scope', 'style']
	};
	return com.decodeTargetHtml(obj, allowedTag, nodeToAllowedTag);
}
com.decodeHtmlNoti = (obj) => {
	let allowedTag = ['class'];
	let nodeToAllowedTag = {
		div     : []
		, table : ['summary']
		, col   : ['style']
		, th    : ['scope', 'style']
		, img	: ['src', 'style', 'alt']
		, a	: ['onclick', 'href', 'target']
	};
	return com.decodeTargetHtml(obj, allowedTag, nodeToAllowedTag);
}

com.decodeTargetHtml = function (obj, allowedTag, nodeToAllowedTag) {
	var targetTag = document.createElement('div');
	targetTag.innerHTML = com.decodeAllHtml(obj);
	//let targetTag = document.querySelector(obj);
	
	let nodeNm = '';
	let allowedList = new Array();
	
	targetTag.querySelectorAll('*').forEach(el => {
		nodeNm = el.nodeName.toLowerCase();
		allowedList = [...allowedTag];
		if ( nodeToAllowedTag[nodeNm] ) {
			allowedList.push(...nodeToAllowedTag[nodeNm]);
		}
		allowedList = allowedList.filter((item, pos) => allowedList.indexOf(item) === pos);
		
		Array.from(el.attributes).forEach(attr => {
			if ( allowedList.includes(attr.name) === false ) {
				console.log("nodeNm : " + nodeNm + ", attrName : " + attr.name);
				el.removeAttribute(attr.name);
			}
		});
		
		/*
		if ( Object.keys(nodeToAllowedTag).includes('script') == true ) {
			el.outerHTML = com.encodeAllHtml(el.outerHTML);
		}
		*/
		if ( nodeNm == 'script' ) {
			el.outerHTML = com.encodeAllHtml(el.outerHTML);
		}
	});
	
	return targetTag.innerHTML;
}

/*********************************************************************
* 현재 hostname을 가져온다
*********************************************************************/
com.getHttpHostName = function () {
	return location.hostname;
}

/*********************************************************************
* 날짜 가져오기
*********************************************************************/
com.getDate = function (pattern, amount) {
	let date = new Date();
	if (pattern && amount) {
		date = date.dateAdd2(pattern, amount);
	}
	return date.format('yyyyMMdd');
}

/*********************************************************************
* 월 증가 및 감소
*********************************************************************/
com.getAddMonth = function (year, month, incM) {
	month = parseInt(month) - 1;
	var date = new Date(year, month, 1);
	date.setMonth(date.getMonth() + incM);
	return date.format('yyyyMMdd');
}

com.getDayOfWeek = function (date) {
	let dayOfWeek;
	if ( com.isNull(date) ) {
		dayOfWeek = new Date().getDay();
	} else {
		if ( date.length !== 8 ) {
			alert("날짜형식이 다릅니다. yyyyMMdd 형태로 전달 하세요.");
			return false;
		}
		let fmDate = com.getFormatDate(date, '-');
		dayOfWeek = new Date(fmDate).getDay();
	}
	//일:0, 월:1, 화:2, 수:3, 목:4, 금:5, 토:6
	return dayOfWeek;
}

/*********************************************************************
* 두 날짜의 차이를 '일'수로 반환한다
*********************************************************************/
com.getDiffOfDate = function (from, to) {
	from = String(from);
	to = String(to);

	if (from.length !== 8 || to.length !== 8) return 0;

	var beginDate = new Date(from.substr(0, 4), parseInt(from.substr(4, 2)) - 1, from.substr(6, 2));
	var endDate = new Date(to.substr(0, 4), parseInt(to.substr(4, 2)) - 1, to.substr(6, 2));

	var diffDate = parseInt((endDate.getTime() - beginDate.getTime()) / (1000 * 60 * 60 * 24));

	return diffDate;
}

/*********************************************************************
* 날짜 포맷을 적용하여 리턴
* default 포맷 : '-'
*********************************************************************/
com.getFormatDate = function (str, format, yType) {
	let tmp = '';
	if (this.isNull(str)) {
		return '';
	}

	if (this.isNull(format)) {
		format = '-';
	}

	str = this.getNumber(str);
	if (str.length < 5) {
		tmp += str;
	} else if (str.length < 7) {
		tmp += str.substr(0, 4);
		tmp += format;
		tmp += str.substr(4);
	} else {
		if (yType == 'yy') {
			tmp += str.substr(2, 2);
		} else {
			tmp += str.substr(0, 4);
		}
		tmp += format;
		tmp += str.substr(4, 2);
		tmp += format;
		tmp += str.substr(6, 2);
	}
	return tmp;
}

/*********************************************************************
* 시간 포맷을 적용하여 리턴
* default 포맷 : ':'
*********************************************************************/
com.getFormatTime = function (str, format) {
	let tmp = '';
	if (this.isNull(str)) {
		return '';
	}

	if (this.isNull(format)) {
		format = ':';
	}

	str = this.getNumber(str);
	if (str.length < 3) {
		tmp += str;
	} else if (str.length < 5) {
		tmp += str.substr(0, 2);
		tmp += format;
		tmp += str.substr(2);
	} else {
		tmp += str.substr(0, 2);
		tmp += format;
		tmp += str.substr(2, 2);
		tmp += format;
		tmp += str.substr(4, 2);
	}

	return tmp;
}

/*********************************************************************
* 카드 포맷을 적용하여 리턴 ('-')
*********************************************************************/
com.getFormatCardNo = function (str) {
	let tmp = '';
	if (this.isNull(str)) {
		return '';
	}

	str = this.getNumber(str);
	if (str.length < 5) {
		tmp += str;
	} else if (str.length < 9) {
		tmp += str.substr(0, 4);
		tmp += '-';
		tmp += str.substr(4);
	} else if (str.length < 13) {
		tmp += str.substr(0, 4);
		tmp += '-';
		tmp += str.substr(4, 4);
		tmp += '-';
		tmp += str.substr(8);
	} else {
		tmp += str.substr(0, 4);
		tmp += '-';
		tmp += str.substr(4, 4);
		tmp += '-';
		tmp += str.substr(8, 4);
		tmp += '-';
		tmp += str.substr(12, 4);
	}
	return tmp;
}

/*********************************************************************
* 사업자번호 포맷을 적용하여 리턴 ('-')
*********************************************************************/
com.getFormatBizNo = function (str) {
	let tmp = '';
	if (this.isNull(str)) {
		return '';
	}
	str = this.getNumber(str);
	if (str.length == 10) {
		tmp += str.substr(0, 3);
		tmp += '-';
		tmp += str.substr(3, 2);
		tmp += '-';
		tmp += str.substr(5, 5);
	} else {
		tmp += str;
	}

	return tmp;
}

/*********************************************************************
* 법인번호 포맷을 적용하여 리턴 ('-')
*********************************************************************/
com.getFormatCorpNo = function (str) {
	let tmp = '';
	if (this.isNull(str)) {
		return '';
	}
	str = this.getNumber(str);
	if (str.length == 13) {
		tmp += str.substr(0, 6);
		tmp += '-';
		tmp += str.substr(6, 7);
	} else {
		tmp += str;
	}

	return tmp;
}

/*********************************************************************
* 휴대폰번호 포맷을 적용하여 리턴 ('-')
*********************************************************************/
com.getFormatMobile = function (str) {
	let tmp = '';
	if (this.isNull(str)) {
		return '';
	}
	str = this.getNumber(str);
	if (str.length == 11) {
		tmp += str.substr(0, 3);
		tmp += '-';
		tmp += str.substr(3, 4);
		tmp += '-';
		tmp += str.substr(7, 4);
	} else {
		tmp += str;
	}

	return tmp;
}

/*********************************************************************
* 전화번호 포맷을 적용하여 리턴 ('-')
*********************************************************************/
com.getFormatPhone = function (str) {
	let tmp = '';
	if (this.isNull(str)) {
		return '';
	}
	str = this.getNumber(str);
	if (str.length == 10) {
		if ((/^02.{0}/).test(str)) {
			tmp += str.substr(0, 2);
			tmp += '-';
			tmp += str.substr(2, 4);
		} else {
			tmp += str.substr(0, 3);
			tmp += '-';
			tmp += str.substr(3, 3);
		}
		tmp += '-';
		tmp += str.substr(6, 4);
	} else if (str.length == 9) {
		if ((/^02.{0}/).test(str)) {
			tmp += str.substr(0, 2);
			tmp += '-';
			tmp += str.substr(2, 3);
			tmp += '-';
			tmp += str.substr(5, 4);
		}
	} else if (str.length == 11) {
		tmp += this.getFormatMobile(str);
	}

	return tmp;
}

/*********************************************************************
* 주민번호 포맷을 적용하여 리턴 ('-')
*********************************************************************/
com.getFormatJumin = function (str) {
	let tmp = '';
	if (this.isNull(str)) {
		return '';
	}
	str = this.getNumber(str);
	if (str.length == 13) {
		tmp += str.substr(0, 6);
		tmp += '-';
		tmp += str.substr(6);
	} else {
		tmp += str;
	}

	return tmp;
}

/*********************************************************************
* MDNO 포맷을 적용하여 리턴 ('-')
*********************************************************************/
com.getFormatMdNo = function (str) {
	let tmp = '';
	if (this.isNull(str)) {
		return '';
	}
	str = this.getNumber(str);
	if (str.length == 16) {
		tmp += str.substr(0, 6);
		tmp += '-';
		tmp += str.substr(6, 5);
		tmp += '-';
		tmp += str.substr(11, 5);
	} else {
		tmp += str;
	}

	return tmp;
}

/*********************************************************************
* 만기일 문구 구하기
*********************************************************************/
com.getExpirationDate = function (str) {
	if (this.isNull(str) || isNaN(str)) {
		return '';
	}

	let expirationDate = parseInt(str);
	let tmp = '';

	if (expirationDate == 0) {
		tmp += '만기당일';
	} else if ( expirationDate > 0 ) {
		if (expirationDate <= 30) {
			tmp += '만기까지 ' + expirationDate + '일';
		} else if (expirationDate <= 364) {
			tmp += '만기까지 약 ' + Math.round(expirationDate / 30) + '개월';
		} else {
			tmp += '만기까지 약 ' + Math.round(expirationDate / 365) + '년';
		}
	} else {
		expirationDate = Math.abs(expirationDate);
		
		if(expirationDate <= 30){
			tmp += "만기 후 " + expirationDate + "일";
		}else if(expirationDate <= 364){
			tmp += "만기 후 약 " + Math.round(expirationDate / 30) + "개월";
		}else{
			tmp += "만기 후 약 " + Math.round(expirationDate / 365) + "년";
		}
	}
	
	return tmp;
}

/*********************************************************************
* 승인요청방식코드명 구하기
*********************************************************************/
com.getAuReqMthdNm = function (auReqMthdCd) {
	let auReqMthdNm = '';

	if (auReqMthdCd === '00') {
		auReqMthdNm = '일시불';
	} else {
		auReqMthdNm = parseInt(auReqMthdCd) + '개월';
	}
	return auReqMthdNm;
}

/*********************************************************************
* 현재 서버종류 구하기(test/real)
*********************************************************************/
com.getCurrServerType = function () {
	let hostName = this.getHttpHostName();
	if ((hostName.indexOf('dev-app.paybooc.co.kr') !== -1) || (hostName.indexOf('localhost') !== -1) || (hostName.indexOf('local-app.paybooc.co.kr') !== -1)) {
		return 'test';
	} else {
		return 'real';
	}
}

/*********************************************************************
* jsonstring을 json객체로 만든다.
* As-Is VP(결제 거래에서 사용됨)
*********************************************************************/
com.getDataToJsonObj = function (data) {
	let jsonObj = {};

	if (this.isEmpty(data)) {
		return jsonObj;
	} else {
		data = String(data);
	}

	data = data.replace(/^\s*|\s*$/g, '');

	try {
		jsonObj = JSON.parse(data);
	} catch (e) {
		jsonObj = {};
	}
	return jsonObj;
}

/*********************************************************************
* 내외국인구분코드 구하기
* 생년월일 + 주민번호7번째자리
* 내국인 : 0, 외국인 : 1
*********************************************************************/
com.getNationTpcd = function (birthDate) {
	if (this.isNull(birthDate)) {
		return '';
	}
	birthDate = String(birthDate);
	if (birthDate.length !== 7) {
		return '';
	}

	if (!com.isBrithDate(birthDate.substr(0, 6))) {
		return '';
	}

	let code = birthDate.substr(6, 1);
	if (/5|6|7|8/.test(code)) {
		return '1';
	} else {
		return '0';
	}
}

/*********************************************************************
* 성별코드 구하기
* 생년월일 + 주민번호7번째자리
* 남자 : 1, 여자 : 2
*********************************************************************/
com.getGenderTpcd = function (birthDate) {
	if (this.isNull(birthDate)) {
		return '';
	}
	birthDate = String(birthDate);
	if (birthDate.length !== 7) {
		return '';
	}

	if (!com.isBrithDate(birthDate.substr(0, 6))) {
		return '';
	}

	let code = birthDate.substr(6, 1);
	if (/1|3|5|7/.test(code)) {
		return '1';
	} else {
		return '2';
	}
}

/*********************************************************************
* 생년월일(yyyyMMdd) 구하기
* 생년월일 + 주민번호7번째자리
*********************************************************************/
com.getBirthyyyyMMdd = function (birthDate) {
	if (this.isNull(birthDate)) {
		return '';
	}
	birthDate = String(birthDate);
	if (birthDate.length !== 7) {
		return '';
	}

	let yyMMdd = birthDate.substr(0, 6);
	let code = birthDate.substr(6, 1);
	let preValue = '';
	let yyyyMMdd = '';

	if (!com.isBrithDate(yyMMdd)) {
		return '';
	}

	if (/1|2|5|6/.test(code)) {
		preValue = '19';
	} else if (/3|4|7|8/.test(code)) {
		preValue = '20';
	} else if (/9|0|/.test(code)) {
		preValue = '18';
	}
	yyyyMMdd = preValue + yyMMdd;

	return yyyyMMdd;
}

/*********************************************************************
* 생년월일(yyMMdd)+주민번호뒷1자리 구하기
*********************************************************************/
com.getBirthyyMMddG = function (yyyyMMdd, gndrCd, ntvFrgnCd) {
	if (this.isNull(yyyyMMdd) || this.isNull(gndrCd) || this.isNull(ntvFrgnCd)) {
		return '';
	}

	yyyyMMdd = String(yyyyMMdd);
	gndrCd = String(gndrCd);
	ntvFrgnCd = String(ntvFrgnCd);

	let prefixYear = yyyyMMdd.substring(0, 2);
	let firstValue = '';

	if (prefixYear === '19') {
		if (gndrCd === 'M' || gndrCd === '1') {
			if (ntvFrgnCd === '0') firstValue = '1';
			else firstValue = '5';
		} else {
			if (ntvFrgnCd === '0') firstValue = '2';
			else firstValue = '6';
		}

	} else if (prefixYear === '20') {
		if (gndrCd === 'M' || gndrCd === '1') {
			if (ntvFrgnCd === '0') firstValue = '3';
			else firstValue = '7';
		} else {
			if (ntvFrgnCd === '0') firstValue = '4';
			else firstValue = '8';
		}

	} else if (prefixYear === '18') {
		if (gndrCd === 'M' || gndrCd === '1') firstValue = '9';
		else firstValue = '0';
	}

	return yyyyMMdd.substring(2) + firstValue;
}

/*********************************************************************
* 만나이 구하기
*********************************************************************/
com.getAge = function (birthDate) {
	let dt = new Date();
	let today = dt.format('yyyyMMdd');
	let age = today.substring(0, 4) - birthDate.substring(0, 4);
	let toDay = parseInt(today.substring(4, 8));
	let birthDay = parseInt(birthDate.substring(4, 8));
	if (toDay < birthDay) {
		age--;
	}
	return age;
}

/*********************************************************************
* input에 숫자만 입력할수 있도록 한다.
*********************************************************************/
com.inputOnlyNum = function (obj) {
	$(obj).keyup(function (e) { //숫자만 입력되도록
		if (e.keyCode != 37 && e.keyCode != 38 && e.keyCode != 39 && e.keyCode != 40) { //방향키 제외
			$(obj).val($(obj).val().replace(/[^0-9]/g, ""));
		}
	});
	$(obj).focusout(function () { //포커스 나갔을 때 글자 남는 버그 수정
		$(obj).val($(obj).val().replace(/[^0-9]/g, ""));
	});
}

/*********************************************************************
* 컨트롤키를 막는다.
*********************************************************************/
com.inputProtectKey = function () {
	if (event.srcElement) {
		if (event.srcElement.nodeName !== 'INPUT' && event.srcElement.nodeName !== 'TEXTAREA') {
			// INPUT나 TextArea에서 입력가능하게 함.
			// Backspace
			if (event.keyCode === 8) {
				event.keyCode = 0;
				return false;
			}
		}
	}
	// Ctrl 키 막기
	if (event.ctrlKey === true) {
		//event.keyCode = 0;
		alert("컨트롤키는 사용하실 수 없습니다.");
		return false;
	}
}

/*********************************************************************
* 한글입력을 막는다
*********************************************************************/
com.inputDontHangul = function (value) {
	if (this.isNull(value)) {
		return value;
	} else {
		value = String(value);
	}
	return value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '');
}

/*********************************************************************
* 특수기호 입력 못하게함
*********************************************************************/
com.inputDontSymbol = function (value) {
	if (this.isNull(value)) {
		return value;
	} else {
		value = String(value);
	}
	return value.replace(/[~`!$%^&*\(\)+\=\\\|\{\}\]\];:\'\"<>,\/?]/g, '');
}

com.getMinus = function (num, isMinus) {
	if(isMinus){
		num *= -1;
	}
	return com.getMoneyFormat(num, 0);
}

com.checkNullOrEmpty = function(obj, message, focusObj) {
	if(this.isNull(obj)) {
		alert("HTMLFormElement is undefined.");
		return true;
	}

	if (message == null || typeof message == "undefined") {
		alert("message값을 입력하세요.");
		return true;
	}

	var p = obj.type;
	if(p == 'select-one' || p == 'select-multiple') {
		if (this.isNullOrEmpty(obj.value) || obj.selectedIndex == -1) {
			alert(message);
			this.btcFocus(this.getNvl(focusObj, obj));
			return true;
		}
		return false;
	}

	var isLen = this.isLength(obj);
	var c = obj;
	if (isLen) {
		c = obj[0];
		p = c.type;
	}
	if (p == "radio" || p == "checkbox") {
		var length = isLen ? obj.length : 1;
		for(var ii=0; ii<length; ++ii) {
			if(this.getObject(obj, ii).checked) {
				return false;
			}
		}
		alert(message);
		this.btcFocus(this.getNvl(focusObj, c));
		return true;
	}
	if(isNullOrEmpty(c.val())) {
		alert(message);
		this.btcFocus(this.getNvl(focusObj, c));
		return true;
	}
	return false;
}

com.btcFocus = function (obj) {
	$(obj).eq(0).focus();
}

/*********************************************************************
* string prototype 함수 추가
*********************************************************************/
String.prototype.numberChar = function () {
	return this.replace(/[^\-0-9]/g, "");
};

String.prototype.parseMoney = function () {
	try {
		var s = this;
		while ((/(-?[0-9]+)([0-9]{3})/).test(s)) {
			s = s.replace((/(-?[0-9]+)([0-9]{3})/), "$1,$2");
		}
		return s;
	}catch(e){
		return this;
	}
};

String.prototype.dateFormat = function (pattern, toPattern) {
	var reo = Date.formatRegExp(pattern);
	var reg = reo.regExp;
	if (!reg.test(this)) {
		return this;
	}
	var fmt = reo.format;
	var fma = fmt.split(',');
	var res = '';
	var chp = '';
	var buf = '';
	for (var ii = 0; ii < toPattern.length; ++ii) {
		var ch1 = toPattern.charAt(ii);
		var ch2 = toPattern.charAt(ii + 1);
		if (ch1 == 'y' || ch1 == 'M' || ch1 == 'd' || ch1 == 'H' || ch1 == 'h' || ch1 == 'm' || ch1 == 's') {
			if (chp != ch1) {
				buf = '';
			}
			buf += ch1;
			chp = ch1;
			if (ch2 != ch1) {
				if (buf.charAt(0) == 'y' || buf.charAt(0) == 'M' || buf.charAt(0) == 'd' || buf.charAt(0) == 'H' || buf.charAt(0) == 'h' || buf.charAt(0) == 'm' || buf.charAt(0) == 's') {
					for (var jj = 0; jj < fma.length; ++jj) {
						if (buf == fma[jj]) {
							res += '$' + jj;
						}
					}
				} else {
					res += buf;
				}
			}
		} else {
			res += ch1;
		}
	}
	return this.replace(reg, res);
};

String.prototype.parseDate = function (pattern) {
	var index = -1;
	var year;
	var month;
	var day;
	var hour = 0;
	var min = 0;
	var sec = 0;
	var ms = 0;
	var p = pattern || Date.InPattern;
	if ((index = p.indexOf("yyyy")) == -1) {
		index = p.indexOf("yy");
		year = "20" + this.substr(index, 2);
	} else {
		year = this.substr(index, 4);
	}
	if ((index = p.indexOf("MM")) != -1) {
		month = this.substr(index, 2);
	} else {
		month = 1;
	}
	if ((index = p.indexOf("dd")) != -1) {
		day = this.substr(index, 2);
	} else {
		day = 1;
	}
	if ((index = p.indexOf("HH")) != -1) {
		hour = this.substr(index, 2);
	}
	if ((index = p.indexOf("mm")) != -1) {
		min = this.substr(index, 2);
	}
	if ((index = p.indexOf("ss")) != -1) {
		sec = this.substr(index, 2);
	}
	return new Date(year, month - 1, day, hour, min, sec, 0);
};

String.prototype.replaceAll = function (schWord, replaceWord) {
	var target = this;
	return target.replace(new RegExp(schWord, 'g'), replaceWord);
};


/*********************************************************************
* date prototype 함수 추가
*********************************************************************/
Date.prototype.dateAdd = function (years, months, dates, hours, minutes, seconds) {
	let d = new Date(this);
	if (years > 0 || years < 0) {
		d.setFullYear(d.getFullYear() + years);
	}
	if (months > 0 || months < 0) {
		d.setMonth(d.getMonth() + months);
		if (d.getDate() < this.getDate()) {
			d.setDate(0);
		}
	}
	if (dates > 0 || dates < 0) {
		d.setDate(d.getDate() + dates);
	}
	if (hours > 0 || hours < 0) {
		d.setHours(d.getHours() + hours);
	}
	if (minutes > 0 || minutes < 0) {
		d.setMinutes(d.getMinutes() + minutes);
	}
	if (seconds > 0 || seconds < 0) {
		d.setSeconds(d.getSeconds() + seconds);
	}
	return d;
};


Date.prototype.dateAdd2 = function (pattern, amount) {
	if (pattern == 'y') {
		return this.dateAdd(amount);
	} else if (pattern == 'M') {
		return this.dateAdd(0, amount);
	} else if (pattern == 'd') {
		return this.dateAdd(0, 0, amount);
	} else if (pattern == 'h') {
		return this.dateAdd(0, 0, 0, amount);
	} else if (pattern == 'm') {
		return this.dateAdd(0, 0, 0, 0, amount);
	} else if (pattern == 's') {
		return this.dateAdd(0, 0, 0, 0, 0, amount);
	}
	return this.dateAdd(0, 0, amount);
};


Date.prototype.format = function (pattern) {
	var year = this.getFullYear();
	var month = this.getMonth() + 1;
	var dday = this.getDate();
	var hour24 = this.getHours();
	var hour12 = (hour24 > 12) ? (hour24 - 12) : hour24;
	var min = this.getMinutes();
	var sec = this.getSeconds();
	var yyyy = "" + year;
	var yy = yyyy.substr(2);
	var MM = (("" + month).length == 1) ? "0" + month : "" + month;
	var dd = (("" + dday).length == 1) ? "0" + dday : "" + dday;
	var HH = (("" + hour24).length == 1) ? "0" + hour24 : "" + hour24;
	var hh = (("" + hour12).length == 1) ? "0" + hour12 : "" + hour12;
	var mm = (("" + min).length == 1) ? "0" + min : "" + min;
	var ss = (("" + sec).length == 1) ? "0" + sec : "" + sec;
	var p = pattern || Date.InPattern;
	p = p.replace(/yyyy/g, yyyy);
	p = p.replace(/yy/g, yy);
	p = p.replace(/MM/g, MM);
	p = p.replace(/dd/g, dd);
	p = p.replace(/HH/g, HH);
	p = p.replace(/hh/g, hh);
	p = p.replace(/mm/g, mm);
	p = p.replace(/ss/g, ss);
	return p;
};

/**
 * 날짜 차이를 구한다.
 * @param {*} pattern 
 * @param {*} date 
 * @returns 
 */
Date.prototype.dateDiff = function (pattern, date) {
	var fy = date.getFullYear() - this.getFullYear();
	if (pattern == 'y') {
		return fy;
	}
	if (pattern == 'M') {
		return (fy * 12) + (date.getMonth() - this.getMonth());
	}
	var fn = date - this;
	if (pattern == 'h') {
		return parseInt(fn / (1000 * 60 * 60), 10);
	}
	if (pattern == 'm') {
		return parseInt(fn / (1000 * 60), 10);
	}
	if (pattern == 's') {
		return parseInt(fn / (1000), 10);
	}

	return parseInt(fn / (1000 * 60 * 60 * 24), 10);
};

/**
 * 날짜 차이를 구한다.
 * @param {*} pattern 
 * @param {*} dstr 
 * @param {*} dpattern 
 * @returns 
 */
Date.prototype.dateDiff2 = function (pattern, dstr, dpattern) {
	return this.dateDiff(pattern, dstr.parseDate(dpattern));
};

/*********************************************************************
* 화면처리 기능
*********************************************************************/
var appWebViewClose = () => {
	onBackHistory();
};

/*********************************************************************
* 현재 url 파라미터를 가져온다.
*********************************************************************/
var fnGetPram = (name) => {
	if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
	return decodeURIComponent(name[1]);
};


/*********************************************************************
* ajax 거래후 오류체크를 하는 함수 (업무에서 정상콜백에서 호출하여 처리)
*********************************************************************/
com.alertMessage = (result) => {
	let message   = '현재 통신량이 많아 업무처리가 지연되고 있습니다.<br>잠시 후 다시 사용하여 주십시오.';
	let isSuccess = true;
	
	if ( com.isEmptyObj(result) == true ) {
		isSuccess = false;
		com.errAlert(message, null, null, function(){ isSuccess = false; }, '확인');
	} else if ( result.code == '20000' ) {
		if ( com.isNull(result.res_code) == false && result.res_code.substring(3,4) != 'S' ) {
			isSuccess = false;
			if ( com.isNull(result.res_message) == false ) {
				message = result.res_message;
			}
			com.errAlert(message, '확인이 필요합니다', result.res_code, function(){ isSuccess = false; }, '확인');
		}
	} else if ( result.code != '20000' ) {
		isSuccess = false;
		if ( com.isNull(result.res_message) == false ) {
			message = result.res_message;
		}
		com.errAlert(message, '확인이 필요합니다', result.res_code, function(){ isSuccess = false; }, '확인');
	}
	
	return isSuccess;
}

/*********************************************************************
* 공통에러 얼럿
*********************************************************************/
com.errAlert = function (msg, title, errCd, confirmCallback, confirmBtnTxt) {
	msg = com.decodeAllHtml(msg);
	msg = msg.replace(/\n/g,"<br/>");
	title = com.decodeAllHtml(title);
	title = title.replace(/\n/g,"<br/>");
	let content = `<div class="error-header"><p class=title>${title}</p><span class="error-code">${errCd}</span></div><p>${msg}</p>`;
	let btnTxt = com.isNull(confirmBtnTxt) ? '확인' : confirmBtnTxt;
	if ( com.isNull(title) === true && com.isNull(errCd) === true ) {
		content = `<p>${msg}</p>`;
	}
	new DialogCtl({
		form:{
			content:content
			, button:[
				{el : '.submit', btnText : btnTxt, elCallback : confirmCallback}
			]
		}
	}).show();
}

/*********************************************************************
* 공통에러 컨펌
*********************************************************************/
com.errConfirm = function (msg, title, errCd, confirmCallback, cancelCallback, confirmBtnTxt, cancelBtnTxt) {
	let content = `<div class="error-header"><p class=title>${title}</p><span class="error-code">${errCd}</span></div><p>${msg}</p>`;
	let _confirmBtnTxt = com.isNull(confirmBtnTxt) ? '확인' : confirmBtnTxt;
	let _cancelBtnTxt = com.isNull(cancelBtnTxt) ? '취소' : cancelBtnTxt;
	if ( com.isNull(title) === true && com.isNull(errCd) === true ) {
		content = `<p>${msg}</p>`;
	}
	new DialogCtl({
		form:{
			content:content 
			, button:[
				{el : '.cancel', btnText : _cancelBtnTxt, elCallback : cancelCallback},
				{el : '.submit', btnText : _confirmBtnTxt, elCallback : confirmCallback}
			]
		}
	}).show();
}

/*********************************************************************
* 공통에러 레이어팝업
*********************************************************************/
com.errLayer = function (msg, title, callFn, btnTxt) {
	let _msg	= com.isNull(msg) ? '예상보다 오래 기다리시는데.. <br>무언가 문제가 있는것같아요.' : msg;
	let _title  = com.isNull(title) ? '한번만 더 시도해주세요' : title;
	let _btnTxt = com.isNull(btnTxt) ? '확인' : btnTxt;
	let errLayer = $("#com_errLayer");
	let tag = 
			`<div class="lpop--wrap2 error-lpop" id="com_errLayer">
				<div class="lpop-inner">
					<section class="select-lpop">
						<header class="lpop-header">
							<h1 class="lpop-tit">${_title}</h1>
							<button type="button" class="btn-close" id="errLayerClose">닫기</button>
						</header>
						<div class="lpop-cont">
							<p class="msg">${_msg}</p>
						</div>
						<div class="lpop-foot">
							<button type="button" class="btn--submit" id="errLayerSubmit">${_btnTxt}</button>
						</div>
					</section>
				</div>
			</div>`;
			
	$('body').append(tag);
	$(function(){
		BsCtl('#com_errLayer').show();

		$('#errLayerClose, #errLayerSubmit').click(function(e){
			if (e.target.id == 'errLayerSubmit' && com.getType(callFn) == 'function') {
				callFn();
			}
			BsCtl('#com_errLayer').hide();
			$('#com_errLayer').remove();
		});

	});
}

/*********************************************************************
* static 안의 html을 가져올 경우 cdn서버를 강제로 추가한다.
*********************************************************************/
com.innerHTML = async (obj, uri) => {
	const response = await fetch(uri);
	const html = await response.text();
	//document.querySelector(obj).innerHTML = html.replace(/(\/static\/)/gi, com.getCdnUri + '/static/');
	$(obj).html(html.replace(/(\/static\/)/gi, com.getCdnUri + '/static/'));
}

com.load = async (obj, subObj, uri, callback) => {
	$(obj).load(uri + ' ' + subObj, function(){
		let loadData = document.querySelector(obj);
		let loadData2 = loadData.innerHTML;
		loadData2 = loadData2.replace(/(\/static\/)/gi, com.getCdnUri + '/static/');
		loadData.innerHTML = loadData2;
		
		if (com.getType(callback) == 'function') {
			callback();
		}
	});
}

/*********************************************************************
* 메뉴정보찾기
*********************************************************************/
com.getMenuInfo = async (opt, search) => {
	let menuInfo = new Set();
	if ( typeof menu_list === "undefined" ) {
		let host = com.getHttpHostName();
		let url = '';
		if ( host.indexOf('local') >= 0 || host.indexOf('dev') >= 0 ) {
			url = 'https://dev-cdn.paybooc.co.kr/cbf/pybcmenu/menu_final.json';
		} else {
			url = 'https://cdn.paybooc.co.kr/cbf/pybcmenu/menu_final.json';
		}
		let menuList = [];
		await fetch(url, {
			cache : 'no-cache'
		})
		.then((result) => result.json())
		.then((json) => {
			menuList = json;
		});
		if ( opt == '1' ) {
			menuInfo = menuList.find(({scrnId}) => scrnId === search);
		} else {
			menuInfo = menuList.find(({menuLinkUrlAddr}) => menuLinkUrlAddr === search);
		}
	} else {
		while ( menu_list.length < 1 ) {
			await new Promise(resolve => setTimeout(resolve, 50));
		}
		
		if ( opt == '1' ) {
			menuInfo = menu_list.find(({scrnId}) => scrnId === search);
		} else {
			menuInfo = menu_list.find(({menuLinkUrlAddr}) => menuLinkUrlAddr === search);
		}
	}
	
	
	return menuInfo;
}

com.iframeLoad = async (menuId, e, param) => {
	let menuInfo = new Object();
	let baseUri   = 'https://app.paybooc.co.kr';
	if ( location.href.indexOf("dev") >= 0 || location.href.indexOf("local") >= 0 ) {
		baseUri   = 'https://dev-app.paybooc.co.kr';
	}
	if ( com.isInApp() === true ) {
		await com.asyncMenuInfo(menuId).then((res) => { menuInfo = res; });
	} else {
		menuInfo = await com.getMenuInfo('1', menuId);
	}
	let params = '';
	if ( param ) {
		params = com.toQueryString(param);
	}
	let menuLinkUrlAddr = menuInfo.menuLinkUrlAddr.trim();
	menuLinkUrlAddr = baseUri + menuLinkUrlAddr;
	if ( params != '' ) {
		menuLinkUrlAddr = menuLinkUrlAddr + '?' + params
	}
	$(e).attr('src', menuLinkUrlAddr);
	return true;
}

com.asyncMenuInfo = async (menuId) => {
	return new Promise( (resolve, reject) => {
		scheme.callNativeBridge('getMenuInfo', {menuId : menuId}, function(res){
			res = (typeof res == 'string') ? JSON.parse(res) : res;
			let data;
			if ( res.resultCode == 'success' ) {
				data = JSON.parse(res.params);
			}
			resolve(data);
		}, 'Y', 'Y');
	});
}

com.getFlowControl = async (actionId) => {
	return new Promise( (resolve, reject) => {
		scheme.callNativeBridge('startNetFunnel', {serviceId : 'service_2', actionId : actionId}, function(res){
			res = (typeof res == 'string') ? JSON.parse(res) : res;
			if ( res.resultCode != 'success' ) {
				resolve('');
			} else {
				let data = JSON.parse(res.params)
				resolve(data.netfunnel_key);
			}
		}, 'Y', 'Y');
	});
}


/*********************************************************************
* 화면이동
* menuId : 메뉴ID
* param : 전달 파라미터
* isHistory : 히스토리여부 false만 체크
* naviOpt : 이동화면 처리구분
  - default or '' : 동일 웹뷰 내 화면이동
  - new : 새웹뷰생성
  - browser : 새웹뷰생성
  - outlink : 외부 브라우저
* close : Y인경우 현재 웹류를 닫고 새웹뷰 생성
* openUrl : menuId가 없는 외부화면 전체url
* viewType : naviOpt 가 browser 인경우 웹뷰타입(full:전체, bottom:바텀, subFooter:하단네비, browser:하단네비)
*********************************************************************/
com.mainMenuList =  [
					'P0201PG001N'   //홈
					, 'P0601PG001W' //혜택
					, 'P0721PG006W' //더부자
					, 'P0801PG001R' //금융 - 탭 1
					, 'P0802PG001R' //금융 - 탭 2
					, 'P0803PG001R' //금융 - 탭 3
					, 'P0804PG001R' //금융 - 탭 4
					, 'P0805PG001R' //금융 - 탭 5
					, 'P0204PG001N' //전체(더보기)
					, 'P0205PG001N' //검색 - 진입
					, 'P0302PG001N' //결제 카드 관리
					, 'P0301PG008N' //기프트카드 > 카드 추가하기 > 기프트카드
					, 'P0309PG001N' //해외 결제
					, 'P0909PG001N' //카드 사용 등록
					, 'P0304PG003N' //(QR)결제 > 스캔
					, 'P0006PG001N' //더보기 > 설정
					, 'P0006PG006N' //설정 > 앱 잠금 결제 인증 > 비밀번호
					, 'P0006PG009N' //앱 잠금 결제 인증 > QR결제 설정
					, 'P0006PG010N' //앱 잠금 결제 인증 > 인증센터
					, 'P1206PG001N' //디지털 ARS 설정
					, 'P0317PG001N' //오픈앱 이용내역
					, 'P0201PG005N' //
					, 'P0725PG001W'
					, 'P0009PG001N'
					, 'P0006PG017N'
					];
com.goNext = async (menuId, param, isHistory, naviOpt, close, openUrl, viewType) => {
	
	isHistory    = (isHistory === false) ? false : true;
	naviOpt      = (com.isNull(naviOpt)) ? 'default' : naviOpt;
	close        = (com.isNull(close)) ? 'N' : close;
	openUrl      = (com.isNull(openUrl)) ? '' : openUrl;
	viewType     = (com.isNull(viewType)) ? 'full' : viewType;
	viewType     = (viewType == 'subFooter') ? 'browser' : viewType;
	
	let page_id  = document.querySelector('html').getAttribute('page_id');
	let queryStringParam = '';
	if ( com.isNull(param) === false ) {
		if ( com.getType(param) == 'string' ) {
			queryStringParam = param;
		} else {
			queryStringParam = com.toQueryString(param);
		}
	}
	
	if ( com.isInApp() === true ) {
		//scheme.callNativeBridge('showLoading', {});
		
		let pageInfo = new Object();
		let menuInfo = new Object();
		let menuLinkUrlAddr = '';
		let menuScrnTypCd   = '';
		let pgeOpenYn       = '';
		let liqtCtrlYn      = '';
		let actId           = '';
		let stepPgeYn       = '';
		let moveBridge      = '';
		let bridgeParam     = new Object();
		let beMenuLinkUrlAddr = '';
		let beLiqtCtrlYn      = '';
		
		switch (naviOpt) {
			case 'browser' :
				//scheme.callNativeBridge('hideLoading', {});
				if ( close == 'Y' ) {
					moveBridge = "closeAndAction";
					let closeParam = new Object();
					closeParam['url'] = openUrl;
					closeParam['params'] = '';
					closeParam['menuId'] = '';
					bridgeParam = new Object();
					bridgeParam['type']  = 'open';
					bridgeParam['param'] = closeParam;
					scheme.callNativeBridge('closeAndAction', bridgeParam);
				} else {
					scheme.callNativeBridge('openWebPopup', {type: viewType, menuId: menuId, params: queryStringParam, url: openUrl});
				}
				
				//scheme.callNativeBridge('openWebPopup', {type: viewType, menuId: menuId, params: queryStringParam, url: openUrl});
				break;
			case 'outlink' :
				//scheme.callNativeBridge('hideLoading', {});
				scheme.callNativeBridge('openBrowser', {url: openUrl});
				break;
			case 'default' :
			case 'new'     :
				if ( com.isNull(openUrl) === false ) {
					if ( naviOpt == 'default' ){
						moveBridge = 'loadUrl';
					} else {
						moveBridge = 'openWebView';
					}
					bridgeParam['menuId'] = '';
					bridgeParam['url'] = openUrl;
					
					if ( close == 'Y' && moveBridge != 'openNative' ) {
						moveBridge = "closeAndAction";
						let closeParam = new Object();
						closeParam['menuId'] = (bridgeParam.menuId) ? bridgeParam.menuId : '';
						closeParam['url']    = (bridgeParam.url)    ? bridgeParam.url    : '';
						closeParam['params'] = (bridgeParam.params) ? bridgeParam.params : '';
						bridgeParam = new Object();
						bridgeParam['type']  = 'open';
						bridgeParam['param'] = closeParam;
					}
				} else {
					await com.asyncMenuInfo(page_id).then((res) => { pageInfo = res; });
					await com.asyncMenuInfo(menuId).then((res) => { menuInfo = res; });
					if ( menuInfo === undefined ) {
						//scheme.callNativeBridge('hideLoading', {});
						scheme.callNativeBridge('clearHttpETag');
						com.errAlert('메뉴정보를 확인해 주세요.', null, null, function(){ return false; }, '확인');
						return false;
					}
					
					menuScrnTypCd   = menuInfo.menuScrnTypCd;
					menuLinkUrlAddr = menuInfo.menuLinkUrlAddr;
					menuLinkUrlAddr = menuLinkUrlAddr.trim();
					pgeOpenYn       = (menuInfo.pgeOpenYn === undefined) ? 'N' : menuInfo.pgeOpenYn;
					liqtCtrlYn      = (menuInfo.liqtCtrlYn === undefined) ? 'N' : menuInfo.liqtCtrlYn;
					actId           = (menuInfo.actId === undefined) ? '' : menuInfo.actId;
					stepPgeYn       = (pageInfo === undefined) ? 'N' : pageInfo.stepPgeYn; //현재 페이지가 스텝인지 판단
					beMenuLinkUrlAddr = (pageInfo === undefined) ? '' : pageInfo.menuLinkUrlAddr;
					beLiqtCtrlYn      = (pageInfo === undefined) ? 'N' : pageInfo.liqtCtrlYn;
					
					bridgeParam['menuId'] = menuId;
					
					if ( menuId.startsWith('D') === true ) {
						scheme.callNativeBridge('openBrowser', {url: menuLinkUrlAddr + ((com.isNull(queryStringParam)) ? '' : '?'+queryStringParam)});
						return false;
					}
					
					if ( liqtCtrlYn == 'Y' ) {
						let netfunnel_key = '';
						let chkYn = 'Y';
						let begin = new Date().getSeconds();
						await com.getFlowControl(actId).then((res) => {
							netfunnel_key = res;
						});
						if ( netfunnel_key == undefined || netfunnel_key == '' ) {
							//scheme.callNativeBridge('hideLoading', {});
							return false; 
						}
						let end = new Date().getSeconds(); // 측정 종료
						let time = end - begin;
						time = time + 30;
						/*
						if ( menuScrnTypCd == 'R' ) {
							await ajaxRequest('/ui/netfunnel/verify'
											, function(data) {
												chkYn = data.chkYn;
											}
											, function(data) {
												console.log('유량제어 거래오류.');
												chkYn = 'N';
											}
											, {netfunnel_key : netfunnel_key, waitTime : time}
											, 'GET'
											, 'json');
							if ( chkYn == 'N' ) {
								com.errAlert('유량제어 오류로 화면에 진입할 수 없습니다.', null, null, function(){ return false; }, '확인');
								return false;
							}
							
							if ( com.isNull(queryStringParam) ) {
								queryStringParam = 'netfunnelChkYn=Y&netfunnel_key=' + netfunnel_key;
							} else {
								queryStringParam = queryStringParam + '&netfunnelChkYn=Y&netfunnel_key=' + netfunnel_key;
							}
							
						} else {
							if ( com.isNull(queryStringParam) ) {
								queryStringParam = 'netfunnel_key=' + netfunnel_key;
							} else {
								queryStringParam = queryStringParam + '&netfunnel_key=' + netfunnel_key;
							}
						}
						*/
						if ( com.isNull(queryStringParam) ) {
							queryStringParam = 'netfunnel_key=' + netfunnel_key;
						} else {
							queryStringParam = queryStringParam + '&netfunnel_key=' + netfunnel_key;
						}
					} else {
						if ( beLiqtCtrlYn == 'Y' && beMenuLinkUrlAddr == menuLinkUrlAddr ) {
							let netfunnel_key = fnGetPram('netfunnel_key') || '';
							if ( com.isNull(queryStringParam) ) {
								queryStringParam = 'netfunnel_key=' + netfunnel_key;
							} else {
								queryStringParam = queryStringParam + '&netfunnel_key=' + netfunnel_key;
							}
						}
					}
					
					//메인메뉴인경우 웹뷰닫고 이동
					if ( com.mainMenuList.indexOf(menuId) >= 0 ) {
						menuScrnTypCd = 'N';
					}
					
					if ( menuScrnTypCd == 'R' ) {
						if ( pgeOpenYn == 'Y' ) {
							moveBridge = 'openWebView';
						} else {
							moveBridge = 'loadUrl';
						}
						//scheme.callNativeBridge('hideLoading', {});
					} else if ( menuScrnTypCd == 'N' ) {
						 moveBridge = 'openNative';
						if ( com.isNull(queryStringParam) == false ) {
							bridgeParam['params'] = com.toObject(queryStringParam);
						}
						 //scheme.callNativeBridge('hideLoading', {});
					} else if ( menuScrnTypCd == 'P' ) {
						/*
						if ( stepPgeYn == 'Y' || isHistory === false || menuId == page_id ) {
							//window.history.replaceState(null, null, menuLinkUrlAddr + ((com.isNull(queryStringParam)) ? '' : '?'+queryStringParam));
							window.history.pushState(null, null, menuLinkUrlAddr + ((com.isNull(queryStringParam)) ? '' : '?'+queryStringParam));
						}
						*/
						/*
						if ( menuLinkUrlAddr.startsWith('http') === false ) {
							let hostName = com.getHttpHostName();
							if ((hostName.indexOf('dev') !== -1) || (hostName.indexOf('local') !== -1)) {
								menuLinkUrlAddr = 'https://dev-cdn.paybooc.co.kr' + menuLinkUrlAddr
							} else {
								menuLinkUrlAddr = 'https://cdn.paybooc.co.kr' + menuLinkUrlAddr
							}
						}
						*/
						if ( naviOpt == 'default' ){
							moveBridge = 'loadUrl';
						} else {
							moveBridge = 'openWebView';
						}
						//bridgeParam['menuId'] = '';
						//bridgeParam['url'] = menuLinkUrlAddr;
						//scheme.callNativeBridge('hideLoading', {});
					} else {
						if ( menuId.endsWith('W') ) {
							scheme.callNativeBridge('showLoading', {});
						}
						
						if ( naviOpt == 'default' ){
							if ( stepPgeYn == 'Y' || isHistory === false || menuId == page_id ) {
								window.history.replaceState(null, null, menuLinkUrlAddr + ((com.isNull(queryStringParam)) ? '' : '?'+queryStringParam));
							}
							moveBridge = 'loadUrl';
						} else {
							moveBridge = 'openWebView';
						}
						//bridgeParam['params'] = encodeURIComponent(queryStringParam);
					}
					bridgeParam['params'] = queryStringParam;
					
					//웹류닫고 이동은 이후에 처리
					if ( close == 'Y' && moveBridge != 'openNative' ) {
						moveBridge = "closeAndAction";
						let closeParam = new Object();
						closeParam['menuId'] = (bridgeParam.menuId) ? bridgeParam.menuId : '';
						closeParam['url']    = (bridgeParam.url)    ? bridgeParam.url    : '';
						closeParam['params'] = (bridgeParam.params) ? bridgeParam.params : '';
						bridgeParam = new Object();
						bridgeParam['type']  = 'open';
						bridgeParam['param'] = closeParam;
					}
				}
				scheme.callNativeBridge(moveBridge, bridgeParam);
				break;
		}
		
	} else { //PC
		let pageInfo = await com.getMenuInfo('1', page_id);
		let menuInfo = new Object();
		let menuLinkUrlAddr = openUrl;
		let menuScrnTypCd   = '';
		let pgeOpenYn       = '';
		let stepPgeYn       = '';
		let url             = '';
		
		showLoadingbar();
		
		if ( com.isNull(menuId) === false ) {
			menuInfo = await com.getMenuInfo('1', menuId);
			
			if ( menuInfo === undefined ) {
				com.errAlert('메뉴정보를 확인해 주세요.', null, null, function(){ return false; }, '확인');
				return false;
			}
			
			menuScrnTypCd   = menuInfo.menuScrnTypCd;
			menuLinkUrlAddr = menuInfo.menuLinkUrlAddr;
			pgeOpenYn       = (menuInfo.pgeOpenYn === undefined) ? 'N' : menuInfo.pgeOpenYn;
		}
		stepPgeYn = (pageInfo === undefined) ? 'N' : pageInfo.stepPgeYn; //현재 페이지가 스텝인지 판단
		pageTypCd = (pageInfo === undefined) ? 'W' : pageInfo.menuScrnTypCd;
		
		url = menuLinkUrlAddr + ((com.isNull(queryStringParam)) ? '' : '?'+queryStringParam);
		
		switch (naviOpt) {
			case 'browser' :
				setTimeout(() => window.open(url));
				hideLoadingbar();
				break;
			case 'outlink' :
				setTimeout(() => window.open(url));
				hideLoadingbar();
				break;
			case 'default' :
			case 'new'     :
				if ( pageTypCd == 'P' ) {
					let hostName = com.getHttpHostName();
					if ((hostName.indexOf('dev') !== -1) || (hostName.indexOf('local') !== -1)) {
						url = 'https://dev-app.paybooc.co.kr' + url
					} else {
						url = 'https://app.paybooc.co.kr' + url
					}
				}
				if ( menuScrnTypCd == 'R' ) {
					if ( pgeOpenYn == 'Y' ) {
						setTimeout(() => window.open(url));
						hideLoadingbar();
					} else {
						window.location.href = url;
						hideLoadingbar();
					}
				} else if ( menuScrnTypCd == 'P' ) {
					if ( url.startsWith('http') === false ) {
						let hostName = com.getHttpHostName();
						if ((hostName.indexOf('dev') !== -1) || (hostName.indexOf('local') !== -1)) {
							url = 'https://dev-cdn.paybooc.co.kr' + url
						} else {
							url = 'https://cdn.paybooc.co.kr' + url
						}
					}
					if ( naviOpt == 'default' ) {
						window.location.href = url;
						hideLoadingbar();
					} else {
						setTimeout(() => window.open(url));
						hideLoadingbar();
					}
				} else {
					if ( naviOpt == 'default' ) {
						if ( stepPgeYn == 'Y' || isHistory === false || menuId == page_id ) {
							window.history.replaceState(null, null, url);
						}
						window.location.href = url;
						hideLoadingbar();
					} else {
						setTimeout(() => window.open(url));
						hideLoadingbar();
					}
				}
				break;
		}
	}
}

/*********************************************************************
* query string to object 변환
*********************************************************************/
com.toObject = (params) => {
	let obj = {};
	let param = new URLSearchParams(params);
	
	new Set ([...param.keys()]).forEach(key => {
		obj[key] = param.getAll(key).length > 1 ? param.getAll(key) : param.get(key);
	});
	
	return obj;
};

/*********************************************************************
* object to query string 변환
*********************************************************************/
com.toQueryString = (params, prefix) => {
	const query = Object.keys(params).map((i) => {
		let key = i;
		let value = params[key];
		
		if ( !value && (value === null || value === undefined || isNaN(value)) ) {
			value = '';
		}
		
		let idx = 0;
		switch(params.constructor) {
			case Array :
				key = `${prefix}[]`;
				idx++;
				break;
			case Object : 
				key = (prefix ? `${prefix}[${key}]` : key);
				break;
		}
		
		if ( typeof value === 'object' ) {
			return com.toQueryString(value, key);
		}
		
		return `${key}=${encodeURIComponent(value)}`;
	});
	return query.join('&');
};

com.goNextPost = function (frm, menuId, isHistory) {
	let form;
	
	if ( document.querySelector('#'+frm) ) {
		form = document.querySelector('#'+frm);
	} else {
		form = document.querySelector('form[name="'+frm+'"]');
	}
	let formData = new URLSearchParams(new FormData(form)).toString();
	
	com.goNext(menuId, formData, isHistory, '', 'N', '', '');
	
}

/*********************************************************************
* 하드웨어 백버튼
*********************************************************************/
var onBackEvent = () => {
	
	if ( window.onBackPressed ) {
		onBackPressed();
		return false;
	}
	
	onBackHistory();
	
};

var appEventListener = (param) => {
	if ( param.event == 'back' ) {
		if ( com.isInApp() == true ) {
			scheme.callNativeBridge('hideLoading', {});
		}
		
		if ( window.onBackPressed ) {
			onBackPressed();
			return false;
		}
		//뒤로가기 시 레이러가 띄워져 있다면 레이어만 닫는다.
		if(isBsVisible() && isBsVisible().length === 1 && obsv_TargetDelay === true) {
			var layerEl = isBsVisible()[0];
			layerEl = layerEl.replace(/ /g, '.');
			if ( $(layerEl + ' .btn-close')[0] ) {
				$(layerEl + ' .btn-close')[0].click();
			} else {
				obsv_TargetDelay = false;
				onBackHistory();
			}
		} else {
			obsv_TargetDelay = false;
			
			onBackHistory();
		}
	} else if ( param.event == 'refresh' ) {
		if ( com.isInApp() == true ) {
			scheme.callNativeBridge('hideLoading', {});
		}
		if ( window.onAppRefresh ) {
			onAppRefresh();
			return false;
		}
	} else if ( param.event == 'resume' ) {
		if ( window.onAppResume ) {
			onAppResume();
			return false;
		}
	} else if ( param.event == 'pause' ) {
		if ( window.onAppPause ) {
			onAppPause();
			return false;
		}
	}
}
var onCloseWebViewEvent = () => {
	if (com.isInApp() === true) {
		scheme.callNativeBridge('closeWebView', {});
	} else {
		window.close();
	}
}

/*********************************************************************
* 히스토리체크후 뒤로가기
*********************************************************************/
var onBackHistory = () => {
	if ( com.isInApp() === true ) {
		historyBack(-1, function () {
			scheme.callNativeBridge('closeWebView', {});
		});
	} else {
		historyBack(-1, function () {
			window.close();
		});
	}
	
}

var historyBack = (count, fallback) => {
	var hasHistory = false;
	const isNewTab = (window.opener != null);
	const browser = com.getBrowserInfo().browserName;
	if(isNewTab && com.isIos() && com.isInApp() == false && browser == 'safari' && window.history.length == 2) {
		count = -2;
	}
	window.history.go(count);
	window.addEventListener("beforeunload", function (e) {
		hasHistory = true;
	});
	setTimeout(function () {
		if (!hasHistory) fallback();
	}, 200);
};

/*********************************************************************
* 메인화면으로 이동한다.
*********************************************************************/
com.backMain = (moveOtp, mainMenuId, subMenuId) => {
	moveOtp    = (com.isNull(moveOtp)) ? 'M' : moveOtp.toUpperCase();
	mainMenuId = (com.isNull(mainMenuId)) ? '' : mainMenuId;
	subMenuId  = (com.isNull(subMenuId)) ? '' : subMenuId;
	let bridgeParam = {};
	if ( moveOtp == 'M' ) {
		mainMenuId = (com.isNull(mainMenuId)) ? 'P0201PG001N' : mainMenuId;
		bridgeParam['menuId'] = mainMenuId;
	} else {
		bridgeParam['menuId'] = subMenuId;
		if ( com.isNull(subMenuId) === true ) {
			moveOtp    = 'M';
			mainMenuId = 'P0201PG001N';
			bridgeParam['menuId'] = mainMenuId;
		}
	}
	
	switch(moveOtp) {
		case 'M' :
			scheme.callNativeBridge('openNative', bridgeParam);
			break;
		case 'S' :
			scheme.callNativeBridge('openNative', bridgeParam);
			break;
	}
}

com.toCamel = (s) => {
	return s.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
}

/*********************************************************************
* 스토어로 이동한다.
*********************************************************************/
com.goStore = () => {
	let storeUrl = '';
	if(com.isIos()) storeUrl = 'https://apps.apple.com/kr/app/페이북-isp/id369125087';
	else storeUrl = 'https://play.google.com/store/apps/details?id=kvp.jjy.MispAndroid320';
	
	com.goNext('', {}, '', 'outlink', 'N', storeUrl);
}

/*********************************************************************
* 배너 스크립트 생성
* type : 1(paybooc), 2(myd)
*********************************************************************/
com.getBannerScript = (type, data) => {
	type = (com.isNull(type))  ? '1' : type;
	
	let contents      = data;
	let bnrPsitDvCd   = ''; //페이북
	let linkTypCd     = ''; //페이북
	let scrnId        = '';
	let linkUrl       = '';
	let bnrParmVal    = '';
	let landingScript = '';
	let bnrLinkDvVal  = ''; //마데
	
	if ( type == '1' ) {
		bnrPsitDvCd = contents.bnrPsitDvCd; //페이북
		linkTypCd   = contents.linkTypCd; //페이북
		scrnId      = contents.scrnId; //메뉴ID
		linkUrl     = contents.bnrLinkUrlAddr; //url
		bnrParmVal  = contents.bnrParmVal; //스크립트
		
		if ( bnrPsitDvCd == '1' ) { //화면ID
			landingScript = `javascript:com.bannerLink('${bnrPsitDvCd}', '${scrnId}', '${bnrParmVal}')`;
		} else if ( bnrPsitDvCd == '2' ) { //url
			landingScript = `javascript:com.bannerLink('${bnrPsitDvCd}', '${linkTypCd}', '${linkUrl}')`;
		} else { //스크립트 직접입력
			let spFn = bnrParmVal.split('|');
			let fnNm = spFn[0];
			landingScript = `javascript:${fnNm}(`;
			if ( spFn.length > 1 ) {
				for ( let i=1; i < spFn.length; i++ ) {
					landingScript += `'${spFn[i]}'`;
					if ( i+1 < spFn.length ) {
						landingScript += `, `;
					}
				}
			}
			landingScript += ');';
		}
	} else {
		bnrLinkDvVal = contents.bnrLinkDvVal; //10:native, 20:sub, 30:browser, 40:outlink, 50:detail, 60:스크립트실행
		linkUrl = com.decodeAllHtml(contents.bnrLinkUrlAddr);
		if ( bnrLinkDvVal == '60' ) {
			let spFn = linkUrl.split('|');
			let fnNm = spFn[0];
			landingScript = `javascript:${fnNm}(`;
			if ( spFn.length > 1 ) {
				for ( let i=1; i < spFn.length; i++ ) {
					landingScript += `'${spFn[i]}'`;
					if ( i+1 < spFn.length ) {
						landingScript += `, `;
					}
				}
			}
			landingScript += ');';
		} else {
			landingScript = `javascript:com.mydBannerLink('${bnrLinkDvVal}', '${linkUrl}')`;
		}
	}
	
	return landingScript;
}

/*********************************************************************
* 배너 화면이동처리
* bnrPsitDvCd : 랜딩위치선택 - 1:화면ID선택(내부인앱화면이동)
*                           2:url입력
*                           3:스크립트 직접입력
* opt1 : 랜딩 1 - 화면ID
*        랜딩 2 - 01:native, 02, sub, 03:browser, 04:outlink
*        랜딩 3 - 스크립트
* opt2 : 랜딩 1 - 파라미터
*        랜딩 2 - url
*********************************************************************/
com.bannerLink = async (bnrPsitDvCd, opt1, opt2) => {
	let target = '';
	let viewType = '';
	let landingScript = '';
	switch ( bnrPsitDvCd ) {
		case '1' :
			com.goNext(opt1, opt2, '', 'new');
			break;
		case '2' :
			if ( opt1 == '02' ) {
				target   = 'browser';
				viewType = 'full';
			} else if ( opt1 == '03' ) {
				target   = 'browser';
				viewType = 'browser';
			} else if ( opt1 == '04' ) {
				target = 'outlink';
			}
			com.goNext('', '', '', target, 'N', opt2, viewType);
			break;
		case '3' :
			let spFn = opt1.split('|');
			let fnNm = spFn[0];
			landingScript = `${fnNm}(`;
			if ( spFn.length > 1 ) {
				for ( let i=1; i < spFn.length; i++ ) {
					landingScript += `'${spFn[i]}'`;
					if ( i+1 < spFn.length ) {
						landingScript += `, `;
					}
				}
			}
			landingScript += ');';
			let newFn = new Function(landingScript);
			newFn.call();
			break;
	}
}

/*********************************************************************
* MYD 배너 화면이동처리
* opt1 : 10:native, 20:sub, 30:browser, 40:outlink, 50:detail, 60:스크립트실행
* opt2 : url or script
*********************************************************************/
com.mydBannerLink = async (opt1, opt2) => {
	let url;
	let param  = new Object();
	let pageInfo = new Object();
	switch(opt1) {
		case '20' :
			url      = new URL(opt2);
			param    = com.toObject(url.search);
			pageInfo = await com.getMenuInfo('2', url.pathname);
			
			if ( pageInfo === undefined ) {
				com.goNext('', '', '', 'new', 'N', opt2, '');
			} else {
				com.goNext(pageInfo.scrnId, param, '', 'new', 'N', '', '');
			}
			break;
		case '30' :
			com.goNext('', '', '', 'browser', 'N', opt2, 'browser');
			break;
		case '40' : //외부링크 호출
			com.goNext('', '', '', 'outlink', 'N', opt2, '');
			break;
		case '50' : // ???
			break;
		case '60' : //스크립트 실행
			let spFn = opt2.split('|');
			let fnNm = spFn[0];
			let landingScript = `${fnNm}(`;
			if ( spFn.length > 1 ) {
				for ( let i=1; i < spFn.length; i++ ) {
					landingScript += `'${spFn[i]}'`;
					if ( i+1 < spFn.length ) {
						landingScript += `, `;
					}
				}
			}
			landingScript += ');';
			
			let newFn = new Function(landingScript);
			newFn.call();
			break;
		default : //외부링크 호출
			com.goNext('', '', '', 'outlink', 'N', opt2, '');
			break;
	};
}

/**************************************************************************
* broadcast 이벤트 실행
**************************************************************************/
var sendBroadcastEvent = (channelName, eventName, data) => {
	if(typeof BroadcastChannel == undefined) return;
	var channel = new BroadcastChannel(channelName);
	channel.postMessage({event: eventName, data: data});
	channel.close();
};

/*********************************************************************************************************************
* indexedDB
*********************************************************************************************************************/
var idb;
var dbNm    = 'paybooc_indexed';
var storeNm = 'payboocStorage';

/******************************************************************************
* indexedDB 생성 / 열기
******************************************************************************/
var openIDB = () => {
	return new Promise((resolve, reject) => {
		let indexed = window.indexedDB.open(dbNm);

		indexed.onsuccess = (e) => {
			console.log('indexedDB onsuccess success!!');
			resolve(e.target.result);
		};
		
		indexed.onerror = (e) => {
			console.log('indexedDB onerror!! => ' + e.target.errorCode);
			reject(e.target.errorCode);
		};
	
		indexed.onupgradeneeded = (e) => {
			console.log('indexedDB onupgradeneeded!!');
			idb = e.target.result;
			let objectStore = idb.createObjectStore(storeNm, {keyPath : 'key'});
			objectStore.createIndex('val', 'val', {unique : false});
			objectStore.createIndex('timestamp', 'timestamp', {unique : false});
		};
	});
};

/******************************************************************************
* transaction 생성
******************************************************************************/
var getObjectStore = async (mode) => {
	if ( !idb ) {
		idb = await openIDB();
	}
	let transaction = idb.transaction(storeNm, mode);
	transaction.oncomplete = () => {
		console.log('transaction oncomplete!!');
	};
	transaction.onerror = () => {
		console.log('transaction onerror!!');
	};
	return transaction.objectStore(storeNm);
	
};

/******************************************************************************
* 데이터 추가
******************************************************************************/
var setIndexedStorage = async (key, value) => {
	let objectStore = await getObjectStore('readwrite');
	let today = com.getUtcDateToKR().format('yyyyMMddHHmmss');
	let item = {
		'key' : key
		, 'val' : JSON.stringify(value)
		, 'timestamp' : today
	};
	let req = objectStore.put(item);
	return new Promise((resolve, reject) => {
		req.onsuccess = (e) => {
			console.log('저장되었습니다.');
			resolve();
		};
		req.onerror = (e) => {
			console.log('setIndexedStorage onerror');
			reject();
		};
	});
};

/******************************************************************************
* 데이터 읽기
******************************************************************************/
var getIndexedStorage = async (key, pattern, amount) => { 
	var now = com.getUtcDateToKR();
	let objectStore = await getObjectStore('readwrite');
	let req = objectStore.get(key);
	return new Promise((resolve, reject) => {
		req.onsuccess = (e) => {
			if ( e.target.result == undefined ) {
				resolve('');
				return false;
			}
			let returnVal = JSON.parse(e.target.result.val);
			if ( com.isNull(returnVal) === true ) {
				resolve('');
				return false;
			}
			if ( com.isNull(pattern) === true ) {
				var toDate = new Date();
				pattern = toDate.format('yyyyMMdd');
				amount  = 0;
			}
			if ( pattern.length > 1) {
				if ( pattern.length < 8 ) {
					resolve('');
					return false;
				} else {
					now = pattern.parseDate('yyyyMMddHHmmss');
				}
			}
			
			var returnTimestamp = e.target.result.timestamp.parseDate('yyyyMMddHHmmss');
			var calTimestamp    = returnTimestamp.dateAdd2(pattern, amount);
			if ( now <= calTimestamp ) {
				resolve(returnVal);
				return false;
			} else {
				//데이터삭제
				delIndexedStorage(key);
				resolve('');
			}
		};
		
		req.onerror = () => {
			console.log('getIndexedStorage onerror');
			resolve('');
		}
	});
};

/******************************************************************************
* 데이터 삭제
******************************************************************************/
var delIndexedStorage = async (key) => {
	let objectStore = await getObjectStore('readwrite');
	req = objectStore.delete(key);
	return new Promise((resolve, reject) => {
		req.onsuccess = (e) => {
			console.log('delIndexedStorage onsuccess');
			resolve();
		};
		req.onerror = () => {
			console.log('delIndexedStorage onerror');
			reject();
		}
	});
};

var formTagCreate = (opt) => {
	let form = document.createElement('form'); // 폼 태그 생성
	if ( com.isNull(opt) === false ) {
		for (const [key, value] of Object.entries(opt)) {
			form.setAttribute(key, value);
		}
	}
	$('body').append(form);
}

/**
 * Share(공유하기)
 */
const share = function() {
	return {
		/**
		 * getShareUrl : 공유하기 url 가져오기
		 * 		- menuId(String, *Required) : 메뉴아이디
		 * 		- param(String | Object) : 파라미터
		 * 		- shareType(String, Default : 'kakao') : 공유하기 매체 타입
		 * 			- kakao
		 * 			- clipboard
		 */
		getShareUrl: function(menuId, param, shareType) {
			shareType = shareType || 'kakao';
			shareType = shareType.toLowerCase();
			let queryStringParam = '';
			if(!com.isNull(param)) {
				if(com.getType(param) == 'string') queryStringParam = param; 
				else queryStringParam = com.toQueryString(param);
			}
			
			let retVal = '';
			if(shareType == 'kakao' || shareType == 'clipboard') retVal = `${PROPS.DEFERRED_OPENAPP_URL}?landingId=${menuId}`;
			
			if(!com.isNull(queryStringParam)) retVal += `&${queryStringParam}`;
			
			return retVal;
		},
		initKakao: function() {
			let kakaoLoadTurn = 0;
			return new Promise((resolve, reject) => {
				var kakaoLoad = setInterval(function() {
					if(typeof Kakao !== "undefined") {
						try {
							if(!Kakao.isInitialized()) Kakao.init('c24ca3f2d1b74d69661385dc1af6fda9');
							resolve();
						} catch(e) {
							if(e.message && e.message == 'Kakao.init: Already initialized') resolve();
							else reject();
						} finally {
							clearInterval(kakaoLoad);
						}
					} else if(kakaoLoadTurn > 10) {
						clearInterval(kakaoLoad);
						reject();
					} else {
						kakaoLoadTurn++;
					}
				},200);
			});
		},
		/**
		 * 		
		 * function spec
		 *	- obj
		 *		- objType(String, default: feed): 카카오톡 공유 타입
		 *		- title(String): 카카오톡 공유 시 표출할 제목
		 *		- desc(String): 카카오톡 공유 시 표출할 내용
		 *		- imgUrl(String): 카카오톡 공유 시 표출할 이미지
		 *		- mWebUrl(String, *required): 공유 게시물 클릭 시 이동할 화면ID
		 *		- webUrl(String): 공유 게시물 클릭 시 이동할 화면ID
		 *			-> 미입력시 mWebUrl값으로 세팅
		 *		- btns(Array): 카카오톡 공유 메세지에 노출할 버튼 정보
		 *			- mWebUrl(String): 버튼 클릭 시 이동할 URL
		 *				-> 미입력시 obj['mWebUrl']값으로 세팅
		 *			- webUrl(String): 버튼 클릭 시 이동할 URL
		 *				-> 미입력시 obj['webUrl']값으로 세팅
		 *		- installTalk(Boolean, default: true): 카카오톡 미설치 시 설치 자동 진행
		 */
		sendKakao: function(obj) {
			//Kakao Script Load			
			if($('#kakao_script').length == 0) {
				let script = document.createElement('script');
				$(script).attr('id', 'kakao_script');
				$(script).attr('src', 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js');
				$(script).attr('integrity', 'sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4')
				$(script).attr('crossorigin', 'anonymous');
				$(script).attr('async');
				document.head.appendChild(script);
			}
			let alertMsg = '';
			if(!Object.keys(obj)) alertMsg = '카카오톡에 공유할 데이터가 존재하지 않습니다.';
			else if(com.isNull(obj['title'])) alertMsg = '필수 값(title)이 존재하지 않습니다.';
			else if(com.isNull(obj['mWebUrl'])) alertMsg = '필수 값(mWebUrl)이 존재하지 않습니다.';
			
			//web url이 없을 경우 mWeb url로 똑같이 세팅해준다.
			if(obj['imgUrl'] && obj['imgUrl'].startsWith('/static')) {
				obj['imgUrl'] = PROPS.CDN_URI + obj['imgUrl']; 
			}
			
			obj['mWebUrl'] = obj['mWebUrl'];
			obj['webUrl'] = obj['webUrl'] || obj['mWebUrl'];
			obj['btns'] = obj['btns'] || [];
			
			let btns = [];
			for(let btn of obj['btns']) {
				if(com.isNull(btn.title)) {
					alertMsg = '버튼 명이 존재하지 않습니다.';
					break;
				}
				let tmpBtn = {
					title: btn['title'],
					link: {
						mobileWebUrl: btn['mWebUrl'] || obj['mWebUrl'],
						webUrl: btn['webUrl'] || obj['webUrl']
					}
				};
				btns.push(tmpBtn);
			}
			
			if(alertMsg != '') {
				alert(alertMsg);
				return;
			}
			let installTalk = obj['installTalk'] || true;
			//ios인 경우 asis에서는 해당 페이지를 유지하고 있어 강제로 false로 고정
			if(com.isIos()) installTalk = false;
			
			this.initKakao().then(() => {
				try {
					Kakao.Share.sendDefault({
						objectType : obj['objType'] || 'feed',
						content: {
							title : obj['title'],
							description: obj['desc'] || '',
							imageUrl: obj['imgUrl'] || '',
							link: {
								mobileWebUrl : obj['mWebUrl'],
								webUrl: obj['webUrl']
							}
						},
						buttons: btns,
						installTalk: installTalk
					})
				} catch(e) {
					alert('카카오톡 공유하기 도중 에러가 발생하였습니다.\n잠시 후 다시 시도해 주세요.');
				}
			}).catch(() => {
				alert('카카오와 연결이 원활하지 않습니다.\n잠시 후 다시 시도해 주세요.');
			})
		},
		/**
		 * function spec
		 *	- url(String) : clipboard에 저장할 url
		 *	- shp(String, default: 'square') : 토스트 팝업 모양
		 *	- toastMsg(String, default: '링크가 복사되었습니다.<br/>원하는 곳에 붙여 넣으세요.') : 토스트 메세지 
		 */
		 copyCont: function(url, shp, toastMsg) {
 			if(com.isNull(url)) {
 				alert('필수 값(url)이 존재하지않습니다.');
 				return;
 			}
			
 			//default is square
 			let shape = shp || 'square';
			let msg = toastMsg || '링크가 복사되었습니다.<br/>원하는 곳에 붙여 넣으세요.';
 			let content = url.replace(/\t/g, '');
 			navigator.clipboard.writeText(content).then(() => {
 				toastPopupAlertEvt(msg, shape);
 			}).catch(() => {
 				let tempElem = document.createElement('textarea');
 				tempElem.value = content;		
 				document.body.appendChild(tempElem);
 				tempElem.select();
 				if(document.execCommand('copy')) {
					if(com.isIos()) {
	 					//IOS에서 클립보드 복사를 위해서 영역을 잡아줘야함.
	 					let range = document.createRange();
	 					range.selectNodeContents(tempElem);
	 					let selection = window.getSelection();
	 					selection.removeAllRanges();
	 		            selection.addRange(range);
	 		            tempElem.setSelectionRange(0, 999999);
		 				toastPopupAlertEvt(msg, shape);
	 				}
				} else {
					alert('잠시 후 다시 시도해주세요.');
				}
 				document.body.removeChild(tempElem);
			});
 		},
		/**
		 * function spec
		 *	- url(String) : 공유 url
		 */
		more: function(url) {
			const sharaObject = {
				url : url
			}
			
			if(navigator.share) {
				navigator.share(sharaObject);
			} else {
                if(com.isInApp()){
                    scheme.callNativeBridge('shareExternal', {type:'link', value: url});
                }else{
				    alert("알 수 없는 오류가 발생하였습니다.\n다시 시도하여 주세요.");
                }
			}
 		},
	}
}();

//머니박스 콜백함수 공통으로 처리
function openMarketingPushNotificationPopup() {
	scheme.callNativeBridge('openBottomBox', {menuId : 'P0007LR005W', params : '', url : ''});
}

function openMoneyMoaPage() {
	com.goNext('P0604PG001R', {}, '', 'new', 'N', '');
}

function openShowTrendViewBridge(bridgeId, param) {
	scheme.callNativeBridge(bridgeId, param);
}

function openBenefitPage() {
	com.goNext('P0601PG001W', {}, '', 'new', 'N', '');
}

/******************************************************************************
* 로그인여부 체크
******************************************************************************/
com.isLogin = async () => {
	let isLoginYn = true;
	await ajaxRequest(com.getBaseUrl + '/pybc/api/membauth/login/inq-login'
		, function(res) { // success
			var data = (res['data'] || {});
			if (data['valid']) {
				console.log('로그인 성공.');
				isLoginYn = true;
			} else {
				console.log('로그인 실패.');
				isLoginYn = false;
			}
		}
		, function(res) { // fail
			console.log('로그인체크 API 실패.');
			isLoginYn = false;
		}
		, {}
		, 'GET'
		, 'json'
		, false
		, false);
	
	return isLoginYn;
}

//브라우저정보
com.getBrowserInfo = () => {
	const userAgent = navigator.userAgent;
	let browserName = "";
	let browserVersion = "";
 
	if (userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Edge") === -1 && userAgent.indexOf("OPR") === -1) {
		browserName = "chrome";
		browserVersion = userAgent.match(/Chrome\/(\d+\.\d+\.\d+\.\d+)/)[1];
	} else if (userAgent.indexOf("Firefox") > -1) {
		browserName = "firefox";
		browserVersion = userAgent.match(/Firefox\/(\d+\.\d+)/)[1];
	} else if (userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") === -1) {
		browserName = "safari";
		browserVersion = userAgent.match(/Version\/(\d+\.\d+)/)[1];
	} else if (userAgent.indexOf("iOS") > -1 && userAgent.indexOf("Chrome") === -1) {
		browserName = "safari";
		browserVersion = userAgent.match(/\(iOS\;(.*)\)/)[1].split(';')[0];
	} else if (userAgent.indexOf("Edge") > -1) {
		browserName = "edge";
		browserVersion = userAgent.match(/Edge\/(\d+\.\d+)/)[1];
	} else if (userAgent.indexOf("OPR") > -1) {
		browserName = "opera";
		browserVersion = userAgent.match(/OPR\/(\d+\.\d+)/)[1];
	} else if (userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("Trident") > -1) {
		browserName = "ie";
		browserVersion = userAgent.match(/(MSIE \d+\.\d+|rv:\d+\.\d+)/)[1];
	}
	return { browserName, browserVersion };
}

com.asyncBridgeCall = async (bridge, param) => {
	return new Promise( (resolve, reject) => {
		scheme.callNativeBridge(bridge, param, function(res){
			resolve(res);
		}, 'Y');
	});
}

com.requestSSO = async (url) => {
	let ssoToken = '';
	await com.asyncBridgeCall('requestSSO', {}).then((res) => {
		res = (typeof res == 'string') ? JSON.parse(res) : res;
		if ( res.ownPrfTkn ) {
			ssoToken = res.ownPrfTkn;
		}
	});
	
	let openURL = new URL(url);
	
	if ( com.isNull(openURL.search) == true ) {
		url = url + '?ownPrfTkn=' + ssoToken;
	} else {
		url = url + '&ownPrfTkn=' + ssoToken;
	}
	com.goNext('', {}, '', 'outlink', 'N', url);
}



//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
//데이터 암호화 START
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
com.randomId = (size) => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

com.clientPublicKey = 
`-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsqu0vms9+DRJz5MLEvrF
Jbq2FZG5xbtnSKQ2LzIP/EJc1lidZaYHN6d8ajsNPgzc6G/kjn9/vGAVCXVIm0uj
BjbZMgoqT+5e3EgsZ9YwBubTe+jV9xQ+KCSvu7Zzm6ftRLmE37ilk8bcIB4pFoFC
R/x5ViOLeyM9zT2AF1D1j9fwqzAp5ckoSjHDX7gvXPS/5WBsdvJHK/Kf0pJnlLXN
fen1viri+Gv8ep8zgHSfzdIEMIQHLeNtcFZGnkUQ2m3Nq8VAix3ZxN4T79O0NlnX
JrQq7PpknJfZfepuBi1xn//4VwSEteVgE7D+bSmPSiBdlPAnnsugUrpABK82kbgk
GQIDAQAB
-----END PUBLIC KEY-----`;

com.clientPrivateKey = 
`-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCyq7S+az34NEnP
kwsS+sUlurYVkbnFu2dIpDYvMg/8QlzWWJ1lpgc3p3xqOw0+DNzob+SOf3+8YBUJ
dUibS6MGNtkyCipP7l7cSCxn1jAG5tN76NX3FD4oJK+7tnObp+1EuYTfuKWTxtwg
HikWgUJH/HlWI4t7Iz3NPYAXUPWP1/CrMCnlyShKMcNfuC9c9L/lYGx28kcr8p/S
kmeUtc196fW+KuL4a/x6nzOAdJ/N0gQwhAct421wVkaeRRDabc2rxUCLHdnE3hPv
07Q2WdcmtCrs+mScl9l96m4GLXGf//hXBIS15WATsP5tKY9KIF2U8Ceey6BSukAE
rzaRuCQZAgMBAAECggEAIUUW8XRPxEWcTvI/GCgpCNcFK+wITzkPyPeG/W/RiTQk
TGeQ24o4gtUFtlRLqXfEtOWNBjnYo8+yayHzRLOnZjNVa1t4OI0XDebEmgtIwyg9
Ti/zk8ApuNjn/kjBq0TwSiFPjEc6UdOwTqy/Euk72eK6B1+0C9hqnCqtDOpu53tL
N6ocwI6954uDp/zeLefDX9S9GbGSnk4wJm8+YOgYbTtoTWd68uC2wLuaybToS2i6
D05O0xqrmM5PdGmUDnKo6IRXuWOj1bP+c8JGH7UyQA++cL8Rmcai46uzCh8w+kOk
MUl/02CaKXz06rxjCIMUx7EWUABeyEMYOAB8nDPxnwKBgQDVl2RkB527Va6HMDeJ
/YatHmzK0nhZdfF9JyXIA6q8x58YdFx4YO/BrGoW2IfWZ3BnuDHUGSXIs+a7pGmF
QqlF4/AdO+9GtoOPz8e13WUvGiIhqLu9jXHWabU4vznr4lYyU8OoVEXbwlgXcSXy
BFI2i8yiQlCZFOl51wBMi0YxywKBgQDWJVY6DHTxPoikogd3J0YwZ/Ea5PUvstHl
E6y2uQGOMXHhyr03xBnnrtP227mZ89UtafmmgGXbytFbHGgwr5f8zOS1by+jvI4Y
xF67SwJly+WMRZZM1nuo+Uf/50czLzu8iEdZ3zJL1W4fg9Zu935Y/PQci3zOMKz3
PjWT0wR1KwKBgHP7QE09AX6POTU5jn8ExxPMeKDuBuH1NIuULWTd8OGPuClsTiYj
5S0StYzwSVq4UoZPs+cLPMQuRDVSQuZU21wTOPh26ihIxUnbNwPfU6lvFGeYm1GD
s/QM9JX66LXY8ptjdtQ55rE9Z95a15MCm6343caiIefuPhWmFQh7fENfAoGBALWT
KP7Fay7W2CPII05b5b7Lk3s7Yc5U8HYtbYftbK01rZtHPZOYWmLBMYciHci1IC+G
qSENw9BOs59ugcWuTdATp2VT5nAOQ+oqLyzd2CWacoOyyVNTlbzbybnpT8zNovgk
EWPZxZrZWKuuLNcgUWiA6zd86pEmYrKtc95o0WHLAoGBAIC0DLQKY80+Wnd4U5yu
nvU7rEL9BIHlgMfNdj4zxX4u5zW1oMLUA/ejDNKzVF63SkN2kxg6NboHJiWzryFB
XruGNK/RH6LkeH5elzvLyaz+5NIUTXsoTeNygtdAP4LA6NbH5NzeHpjaiZDDkRvX
cHA5rscYOKbUGRqHlHqkVuKs
-----END PRIVATE KEY-----`;

/******************************************************************************
* 암호화
******************************************************************************/
com.encrypt = async (data) => {
	if ( document.querySelector('#crypto_script') == null ) {
		const e   = 'script';
		//const opt = {id : 'crypto_script', type : 'text/javascript', src : 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js'};
		const opt = {id : 'crypto_script', type : 'text/javascript', src : com.getCdnUri + '/static/js/crypto-js.min.js'};
		com.scriptCreate(e, opt);
		while ( typeof CryptoJS == 'undefined' ) {
			await new Promise(resolve => setTimeout(resolve, 50));
		}
	}
	
	if ( document.querySelector('#jsencrypt_script') == null ) {
		const e   = 'script';
		//const opt = {id : 'jsencrypt_script', type : 'text/javascript', src : `https://cdnjs.cloudflare.com/ajax/libs/jsencrypt/3.0.0/jsencrypt.min.js`};
		const opt = {id : 'jsencrypt_script', type : 'text/javascript', src : com.getCdnUri + '/static/js/jsencrypt.min.js'};
		com.scriptCreate(e, opt);
		while ( typeof JSEncrypt == 'undefined' ) {
			await new Promise(resolve => setTimeout(resolve, 50));
		}
	}
	
	let pkInfo   = new Object();
	let sessInfo = new Object();
	await com.keyInq('1', '').then((res) => pkInfo = res); //공개키조회
	let randomKey = com.randomId(14);
	let challenge = com.encryptKey(pkInfo.key, randomKey); //랜덤키 암호화
	await com.keyInq('2', challenge).then((res) => sessInfo = res); //세션키조회
	
	let decSessKey   = com.decryptKey(com.clientPrivateKey, sessInfo.key);       //세션키복호화
	let decChallenge = com.decryptKey(com.clientPrivateKey, sessInfo.challenge); //시도값복호화
	
	console.log("----------randomKey : ", randomKey, "----------decChallenge : ", decChallenge);
	if ( randomKey != decChallenge ) {
		com.errAlert('키정보가 잘못 되었습니다.', null, null, function(){ return false; }, '확인');
		return false;
	}
	
	let returnData = new Object();
	returnData['sessKey'] = sessInfo.key;
	returnData['sessKeyFB'] = sessInfo.sesskeyFB;
	returnData['iv'] = sessInfo.iv;
	
	if ( com.getType(data) == 'string' ) {
		returnData['encData'] = com.encryptData(data, decSessKey, sessInfo.iv);
	} else {
		Object.keys(data).map((i) => {
			let k = i;
			let v = data[k];
			returnData[k] = com.encryptData(v, decSessKey, sessInfo.iv);
		});
	}
	return returnData;
}

com.keyInq = async (opt, challenge) => {
	return new Promise( (resolve, reject) =>{
		let url = '';
		let param = new Object();
		let returnInfo = new Object();
		let type = 'GET';
		if ( opt == '1' ) {
			if ( document.getElementById('_pubKey') != null ) {
				console.log("---------------------------keyInq 01---------------------------");
				let _pubKey = document.getElementById('_pubKey').value;
				returnInfo['key'] = _pubKey;
				resolve(returnInfo);
			}
			console.log("---------------------------keyInq 02---------------------------");
			url = '/pybc/api/membauth/key/req-img_enc_pbkey';
		} else {
			url = '/pybc/api/membauth/key/req-img_enc_sess_key';
			param['challenge'] = challenge;
			type = 'POST';
		}
		ajaxRequest(com.getSubUrl + url
			, function(res) {
				if ( opt == '1' ) {
					returnInfo['key'] = res.pbkey;
					com.scriptCreate('input', {id : '_pubKey', value : res.pbkey, type : 'hidden'});
				} else {
					returnInfo['key'] = res.sesskey;
					returnInfo['sesskeyFB'] = res.sesskeyFB;
					returnInfo['challenge'] = res.challenge;
					returnInfo['iv']  = res.iv;
				}
			}
			, function(res) {
				console.log('-------------------------------------------------------ERROR : ', res);
				if ( opt == '1' ) {
					returnInfo['key'] = '';
				} else {
					returnInfo['key'] = '';
					returnInfo['sesskeyFB'] = '';
					returnInfo['challenge'] = '';
					returnInfo['iv']  = '';
				}
			}
			, param
			, type
			, 'json'
			, false
			, false);
		
		resolve(returnInfo);
	});
}

/******************************************************************************
* 암호화데이터 생성
******************************************************************************/
com.encryptData = (data, privateKey, initialVector) => {
	const key = CryptoJS.enc.Hex.parse(privateKey);
	const iv  = CryptoJS.enc.Hex.parse(initialVector);
	
	const cipher = CryptoJS.AES.encrypt(data, key, {
		iv : iv
		, mode : CryptoJS.mode.CBC
		, padding : CryptoJS.pad.Pkcs7
	});
	return cipher.ciphertext.toString(CryptoJS.enc.Base64);
}

/******************************************************************************
* key복호화
******************************************************************************/
com.decryptKey = (key, data) => {
	const decrypt = new JSEncrypt();
	decrypt.setPrivateKey(key);
	return decrypt.decrypt(data);
}
/******************************************************************************
* key암호화
******************************************************************************/
com.encryptKey = (key, data) => {
	const encrypt = new JSEncrypt();
	encrypt.setPublicKey(key);
	return encrypt.encrypt(data);
}

/******************************************************************************
* 스크립트생성
******************************************************************************/
com.scriptCreate = (e, opt) => {
	let tag = document.createElement(e);
	if ( com.isEmptyObj(opt) === false ) {
		for (const [key, value] of Object.entries(opt)) {
			tag.setAttribute(key, value);
		}
	}
	document.body.appendChild(tag)
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
//데이터 암호화 END
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
