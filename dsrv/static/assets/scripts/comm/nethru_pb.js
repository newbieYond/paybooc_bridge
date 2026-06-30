var script = document.createElement('script');
try {
	if (window.location.host == 'app.paybooc.co.kr' || window.location.host == 'web.paybooc.co.kr' || window.location.host == 'cdn.paybooc.co.kr') {
		script.src = 'https://wc.paybooc.co.kr/static/nethru_npb.js';
	} else {
		script.src = 'https://dwc.paybooc.co.kr/static/nethru_npbd.js';	//dev - v2
	}
	script.async = true;
	document.head.appendChild(script);
}
catch (e) {
	//
}