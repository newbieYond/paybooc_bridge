// console 객체가 없을 경우
if (!window.console) {
	window.console = {
		log: function () {},
		dir: function () {},
	};
} else if (!window.console.dir) {
	window.console.dir = function () {};
}

(function () {
	const fullUrl = window.location.href;
	let pathOnly = new URL(fullUrl).pathname; // path만 추출
	let lastSegment = pathOnly.substring(pathOnly.lastIndexOf('/') + 1); // 마지막 슬래시 이후의 값만 추출
	if (lastSegment.endsWith('.html')) {
		lastSegment = lastSegment.slice(0, -5); // ".html" 문자열이 있으면 제거
	}
	var regexID = /^[PAD]\d{4}[A-Za-z][A-Za-z]\d{3}[NWRPO]$/;
	if (!regexID.test(lastSegment)) return;
	const htmlElement = document.documentElement;
	if (!htmlElement.hasAttribute('page_id')) {
		htmlElement.setAttribute('page_id', lastSegment);
	}
})();

let cdnUri = 'https://cdn.paybooc.co.kr';
let baseUri = 'https://app.paybooc.co.kr';
let webUri = 'https://web.paybooc.co.kr';
let bccardUri = 'https://www.bccard.com';
let deepUri = 'https://ui.vpay.co.kr/s/IqZm/785';
let openUri = 'https://open.paybooc.co.kr';

if (location.href.indexOf('dev') >= 0 || location.href.indexOf('local-app') >= 0) {
	cdnUri = 'https://dev-cdn.paybooc.co.kr';
	baseUri = 'https://dev-app.paybooc.co.kr';
	webUri = 'https://dev-web.paybooc.co.kr';
	bccardUri = 'https://isrnd3.bccard.com:30131';
	deepUri = 'https://ui-test.vpay.co.kr/s/Crya/297';
	openUri = 'https://dev-open.paybooc.co.kr:18443';
	// 추후 개발/운영 운영 시에는 if 처리 없이, 각 서버 별로 다른 값을 세팅할 예정입니다.
}

if (location.href.indexOf('localhost') >= 0 || location.href.indexOf('pybc.bcnuri.com') >= 0) {
	cdnUri = '';
}

function getBrowser() {
	var agents = [/(opr|opera)/gim, /(chrome)/gim, /(firefox)/gim, /(safari)/gim, /(msie[\s]+[\d]+)/gim, /(trident).*rv:(\d+)/gim];
	var agent = navigator.userAgent.toLocaleLowerCase();

	for (var ag in agents) {
		if (agent.match(agents[ag])) {
			return String(RegExp.$1 + RegExp.$2)
				.replace(/opr/, 'opera')
				.replace(/trident/, 'msie')
				.replace(/\s+/, '');
		}
	}
}

function mobileCheck() {
	let check = false;
	(function (a) {
		if (
			/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) ||
			/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
				a.substr(0, 4)
			)
		)
			check = true;
	})(navigator.userAgent || navigator.vendor || window.opera);
	return check;
}

function autoHypenPhone(str) {
	str = str.replace(/[^0-9]/g, '');
	var tmp = '';
	if (str.length < 4) {
		return str;
	} else if (str.length < 7) {
		tmp += str.substr(0, 3);
		tmp += '-';
		tmp += str.substr(3);
		return tmp;
	} else if (str.length < 11) {
		tmp += str.substr(0, 3);
		tmp += '-';
		tmp += str.substr(3, 3);
		tmp += '-';
		tmp += str.substr(6);
		return tmp;
	} else {
		tmp += str.substr(0, 3);
		tmp += '-';
		tmp += str.substr(3, 4);
		tmp += '-';
		tmp += str.substr(7);
		return tmp;
	}
	return str;
}
if (typeof jconfirm !== 'undefined') {
	jconfirm.defaults = {
		animation: 'opacity',
		closeAnimation: 'opacity',
		animationSpeed: 300,
		container: 'body',
		containerFluid: false,
		useBootstrap: false,
		boxWidth: '80%',
		backgroundDismiss: false,
		backgroundDismissAnimation: 'none',
	};
}

function addTopButton() {
	var btnTop = '<button type="button" class="btn-fixed-top">맨위로 이동</button>';
	$('body').append(btnTop);
}

function addBackButton() {
	var btnBack = '<button type="button" class="btn-fixed-back">뒤로 이동</button>';
	$('body').append(btnBack);
}

$(document).ready(function (e) {
	versionCheck();
	observPopInit();
	iOSversionCheck();
	//scrollTopBtnCtl();

	// addTopButton();
	// addBackButton();

	fnColorSchmeInit();
	fnCancelateLayer();

	// input focus 표시
	$('.forms-item')
		.on('focusin', function (e) {
			$(this).attr('data-state', 'is-focused');
			$('[data-focusout]').attr('data-focusout', true);
		})
		.on('focusout', function (e) {
			$(this).attr('data-state', '');
			$('[data-focusout]').attr('data-focusout', false);
		});

	$(document).on('focus', 'input', function () {
		if ($(this).prop('readonly') || $(this).attr('readonly')) {
			this.blur();
		}
	});

	// 약관 토글
	var $oldAgreement = null;
	$('.btn-toggle-agreement').on('click', function (e) {
		if ($oldAgreement !== null && !$(this).is($oldAgreement)) {
			var $toggleContent = $oldAgreement.closest('.checkbox-all').find('+ .list-agreement');
			$oldAgreement.attr('data-state', '');
			$toggleContent.attr('data-state', '');
		}

		var state = $(this).attr('data-state');

		var $toggleContent = $(this).closest('.checkbox-all').find('+ .list-agreement');
		if (state != 'is-open' || state === undefined) {
			$(this).attr('data-state', 'is-open');
			$toggleContent.attr('data-state', 'is-open');
		} else {
			$(this).attr('data-state', '');
			$toggleContent.attr('data-state', '');
		}

		$oldAgreement = $(this);
	});
	$('.btn-toggle-agreement').first().trigger('click');

	// 체크박스 전체 선택/해제
	var $checkAll = $('.checkbox-all input[type=checkbox]');
	$checkAll.on('click', function (e) {
		var $checkboxes = $('input[name=' + $(this).attr('data-target') + ']');
		if ($(this).is(':checked')) {
			$checkboxes.prop('checked', true);
		} else {
			$checkboxes.prop('checked', false);
		}
	});

	$checkAll.each(function (e) {
		var $localAll = $(this);
		var $checkboxes = $('input[name=' + $(this).attr('data-target') + ']');

		$checkboxes.on('click', function (e) {
			if ($checkboxes.filter(':checked').length == $checkboxes.length) {
				$localAll.prop('checked', true);
			} else {
				$localAll.prop('checked', false);
			}
		});
	});

	// notice, faq 아코디언
	var $toggleItems = $('.list-accordion dt > a');
	var $lastToggleItem = null;

	$toggleItems.off('click').on('click', function (e) {
		e.preventDefault();
		e.stopPropagation();

		var $this = $(this).closest('dt');
		if ($this.is($lastToggleItem) && $this.hasClass('is-opened')) {
			$this.removeClass('is-opened');
			return;
		}

		if ($lastToggleItem !== null) {
			$lastToggleItem.removeClass('is-opened');
		}

		$this.addClass('is-opened');
		$lastToggleItem = $this;
	});

	// main 아코디언
	var $toggleItems = $('.btn-toggle-main-accordion ');
	var $lastToggleItem = null;

	$toggleItems.off('click').on('click', function (e) {
		e.preventDefault();
		e.stopPropagation();

		var $this = $(this).closest('dt');
		if ($this.is($lastToggleItem) && $this.hasClass('is-opened')) {
			$this.removeClass('is-opened');
			return;
		}

		if ($lastToggleItem !== null) {
			$lastToggleItem.removeClass('is-opened');
		}

		$this.addClass('is-opened');
		$lastToggleItem = $this;
	});

	// common tab 있을경우 상단 패딩값 조정
	if ($('.common-tab').length) {
		$('.layout-contents').css('paddingTop', '143px');
	}

	// 2018-07-31 시작
	$('.layerpop').click(function (e) {
		if ($(e.target).hasClass('btn_pop_close')) return;
		e.preventDefault();
		var id = $(this).attr('href');
		var maskHeight = $(document).height();
		var maskWidth = $(window).width();
		$('#wrap').addClass('zindex');
		$('body').append('<div id="layermask"></div>');
		$('#layermask').css({ height: maskHeight, opacity: 0 });
		$('#layermask').fadeTo(400, 0.7);

		/*$('#layermask').on("click", function(){
        	 $(window).off('touchmove');
             $('.layerwrap_click').fadeOut(400);
             $('#layermask').fadeOut(400, function() {
            	 $(this).remove();
             });
         });
         
         $(".layerwrap_click").on("click", function(e){
        	 $(window).off('touchmove');
             $('.layerwrap_click').fadeOut(400);
             $('#layermask').fadeOut(400, function() {
            	 $(this).remove();
             });
         });*/

		$('.layerwrap_click .layerarea').on('click', function (e) {
			e.stopPropagation();
		});

		var winH = $(window).height();
		var winW = $(window).width();

		$(id).appendTo($('body'));
		$('body').css('position', 'relative');
		//var top = 110;
		var top = $(window).scrollTop() + (winH - $(id).height()) / 2;
		var left = $(window).scrollLeft() + (winW - $(id).width()) / 2;

		$(id).css({ top: top });
		$(id).css({ left: 0 });
		if ($(id).height() > winH) $(id).css({ top: $(window).scrollTop() });

		$(id).fadeIn(400);
		$(id).focus().attr('tabindex', '0');
	});

	$('.layerwrap_click .btn_pop_close, .layerwrap_click .btn_close, .layerwrap_click .btn.red,  .layerwrap_click .btn.white').click(function (e) {
		e.preventDefault();
		$(window).off('touchmove');
		$('.layerwrap_click').fadeOut(400);
		$('#layermask').fadeOut(400, function () {
			$(this).remove();
		});
	});

	$('.fnSelect').each(function () {
		$(this).wrap('<div class="m_select"></div>');
		$(this).parent().append('<div class="slt_text"></div>');
		$(this).parents('.m_select').find('.slt_text').text($(this).find('option:selected').text());
		$(this).css({ opacity: '0', 'z-index': '3' }).removeClass('fnSelect').parent().addClass($(this).attr('class'));
		$(this).change(function () {
			$(this).parents('.m_select').find('.slt_text').text($(this).find('option:selected').text());
		});
	});
	// 2018-07-31 끝

	// 고도화 cs
	$('.dss-btn-period-wrap .btn-period').on('click', function (e) {
		e.preventDefault();
		var $me = $(this);
		$('.period-cont').hide();
		$('.period-cont' + $me.data('tabCont')).show();
		$me.addClass('on').parent().siblings().find('.btn-period').removeClass('on');
	});
	$('.custom-period-cont input.period-date').on('click', function () {
		$(this).parent().find('.ico-cal').click();
	});

	$('.detail-search-sect .dss-btn-detail').on('click', function (e) {
		e.preventDefault();
		var $me = $(this);
		var $slideup_cont = $('.detail-search-sect .sect-cont');
		if ($me.hasClass('arr-up01')) {
			$me.removeClass('arr-up01').addClass('arr-down01');
			$slideup_cont.slideUp('fast');
		} else if ($me.hasClass('arr-down01')) {
			$me.removeClass('arr-down01').addClass('arr-up01');
			$slideup_cont.slideDown('fast');
		}
	});

	$('.notice-box-sect .btn-notice-box').on('click', function (e) {
		e.preventDefault();
		var $me = $(this);
		var $me_cont = $me.closest('.notice-box-sect');
		var $slideup_cont = $me_cont.find('.sect-cont');

		if ($me_cont.hasClass('bottom-type01')) {
			if ($me.hasClass('arr-up02')) {
				$me_cont.find('.temp-cont').remove();
				$me.removeClass('arr-up02').addClass('arr-down02');
				$slideup_cont.slideUp('fast');
			} else if ($me.hasClass('arr-down02')) {
				//var cur_scr_top = $(window, "html, body").scrollTop();
				//$(window, "html, body").scrollTop( cur_scr_top );	// 스크롤 고정

				/*
				 * var prev_css = $slideup_cont.attr("style");
				$slideup_cont.css({
					"position" : "absolute"
					, "visibility" : "hidden"
					, "display" : "block"
					, "width" : $me_cont.width()
				});
				
				var cont_height = $slideup_cont.outerHeight();
				$slideup_cont.attr("style", prev_css ? prev_css : "");
				
				var $temp_cont = "<div class='temp-cont'></div>";
				$me_cont.append($temp_cont);
				$temp_cont = $me_cont.find(".temp-cont");
				$temp_cont.css({
					"height" : cont_height
					,"width" : 1
				});
				
				$(window).animate({
					scrollTop : $("html, body").prop("scrollHeight") ? $("html, body").prop("scrollHeight") : $(window).prop("scrollHeight")
				}, 200);
				$("html, body").animate({
					scrollTop : $("html, body").prop("scrollHeight") ? $("html, body").prop("scrollHeight") : $(window).prop("scrollHeight")
				}, 200);
				
				$me.removeClass("arr-down02").addClass("arr-up02");
				$slideup_cont.slideDown('fast');
				
				setTimeout(function(){
					$temp_cont.remove();
				}, 200);
				*/

				$me.removeClass('arr-down02').addClass('arr-up02');
				$slideup_cont.slideDown('fast');

				setTimeout(function () {
					$(window).animate(
						{
							scrollTop: $('html, body').prop('scrollHeight') ? $('html, body').prop('scrollHeight') : $(window).prop('scrollHeight'),
						},
						200
					);
					$('html, body').animate(
						{
							scrollTop: $('html, body').prop('scrollHeight') ? $('html, body').prop('scrollHeight') : $(window).prop('scrollHeight'),
						},
						200
					);
				}, 200);
			}
		} else {
			if ($me.hasClass('arr-up02')) {
				$me.removeClass('arr-up02').addClass('arr-down02');
				$slideup_cont.slideUp('fast');
			} else if ($me.hasClass('arr-down02')) {
				$me.removeClass('arr-down02').addClass('arr-up02');
				$slideup_cont.slideDown('fast');
			}
		}
	});

	$('.usage-summary-sect .btn-summary').on('click', function (e) {
		e.preventDefault();
		var $me = $(this);
		var $slideup_cont = $('.usage-summary-sect .sect-cont');
		if ($me.hasClass('arr-up01')) {
			$me.removeClass('arr-up01').addClass('arr-down01');
			$slideup_cont.slideUp('fast');
		} else if ($me.hasClass('arr-down01')) {
			$me.removeClass('arr-down01').addClass('arr-up01');
			$slideup_cont.slideDown('fast');
		}
	});

	// 2018-10-01 시작
	$('.point-list-tab-wrap > a').on('click', function () {
		var $me = $(this);
		if ($me.hasClass('hide-el01-tab')) {
			$('.hide-el01').hide();
		} else {
			$('.hide-el01').show();
		}
	});
	// 2018-10-01 끝

	$(window, 'html, body').on('scroll', function () {
		var scroll_top = $(window, 'html, body').scrollTop();
		if (scroll_top > 55) {
			if ($('.btn-top-fixed:visible').length < 1) {
				$('.btn-top-fixed').show();
			}
		} else {
			if ($('.btn-top-fixed:visible').length > 0) {
				$('.btn-top-fixed').hide();
			}
		}
	});

	$('.btn-top-fixed').on('click', function (e) {
		e.preventDefault();
		$(window, 'html, body').scrollTop(0);
	});

	// 고도화 cs 끝

	$('.drop-cont .cont-top')
		.off()
		.on('click', function () {
			//$(this).toggleClass('close').closest('.drop-cont').find('.cont-body').slideToggle();

			var $me = $(this);
			var $me_cont = $me.closest('.drop-cont');
			var $slideup_cont = $me_cont.find('.cont-body');

			if ($me_cont.hasClass('bottom-type01')) {
				if (!$me.hasClass('close')) {
					$me.addClass('close');
					$slideup_cont.slideUp('fast');
				} else if ($me.hasClass('close')) {
					$me.removeClass('close');
					$slideup_cont.slideDown('fast');

					setTimeout(function () {
						$(window).animate(
							{
								scrollTop: $('html, body').prop('scrollHeight') ? $('html, body').prop('scrollHeight') : $(window).prop('scrollHeight'),
							},
							200
						);
						$('html, body').animate(
							{
								scrollTop: $('html, body').prop('scrollHeight') ? $('html, body').prop('scrollHeight') : $(window).prop('scrollHeight'),
							},
							200
						);
					}, 200);
				}
			} else if ($me_cont.hasClass('in-stamp-lpop')) {
				if (!$me.hasClass('close')) {
					$me.addClass('close');
					$slideup_cont.slideUp('fast');
				} else if ($me.hasClass('close')) {
					$me.removeClass('close');
					$slideup_cont.slideDown('fast');
					var $lpop_cont = $me.closest('.stamp-lpop-wrap');

					setTimeout(function () {
						$lpop_cont.animate(
							{
								scrollTop: $lpop_cont.prop('scrollHeight'),
							},
							200
						);
					}, 200);
				}
			} else if ($me_cont.hasClass('middle-type01')) {
				if (!$me.hasClass('close')) {
					$me.addClass('close');
					$slideup_cont.slideUp('fast');
				} else if ($me.hasClass('close')) {
					$me.removeClass('close');
					$slideup_cont.slideDown('fast');
				}
			} else {
				if (!$me.hasClass('close')) {
					$me.addClass('close');
					$slideup_cont.slideUp('fast');
				} else if ($me.hasClass('close')) {
					$me.removeClass('close');
					$slideup_cont.slideDown('fast');
					//$("html, body").animate({scrollTop : "2000"},200);
					setTimeout(function () {
						$('html, body').animate(
							{
								scrollTop: $('html, body').prop('scrollHeight') ? $('html, body').prop('scrollHeight') : $(window).prop('scrollHeight'),
							},
							200
						);
					}, 200);
				}
			}
		});
});

//고도화 cs

function fnTab01(tab_btn_cont, tab_btn, hide_cont, show_cont, click_tab_btn) {
	var $me = $(click_tab_btn);
	var me_idx = $(tab_btn_cont).find(tab_btn).index($me);
	$(tab_btn_cont)
		.find(tab_btn)
		.not(':eq(' + me_idx + ')')
		.removeClass('on')
		.removeAttr('title');
	$me.addClass('on').attr('title', '현재 선택된 탭');
	$(hide_cont).hide();
	$(hide_cont + show_cont).show();
}

// 고도화 cs 끝

function versionCheck() {
	var appVersion = 5.19;

	if (appVersion > 5.18) {
		$('.layout-status-bar').addClass('version02');
		$('.layout-status-bar .txt').text('결제에 혜택을 담다');
	} else {
		$('.layout-status-bar').addClass('version01');
	}
}

// ios 버전을 html class에 추가
function iOSversionCheck() {
	if (/iP(hone|od|ad)/.test(navigator.platform)) {
		var v = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
		var ver = [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
		var root = document.documentElement;
		root.classList.add(`ios-ver-${ver[0]}-${ver[1]}-${ver[2]}`);
	}
}

function fnOpenAlertLpop(msg) {
	var $mask = $('.lpop-mask'),
		$lpop_wrap = $('.alert-lpop-wrap'),
		$lpop_inner_wrap = $('.lpop-inner', $lpop_wrap),
		$lpop = $('.alert-lpop', $lpop_wrap),
		$text = $('<p class="lpop-text">' + msg + '</p>'),
		win_h = $(window).height(),
		lpop_h;

	$('.lpop-cont', $lpop_wrap).html($text);

	$('body').addClass('stop-scroll');

	$mask.show();
	$lpop_wrap.show();
	lpop_h = $lpop.outerHeight();

	if (win_h > lpop_h) {
		$lpop_inner_wrap.css({
			top: '50%',
			'margin-top': -1 * lpop_h * 0.5,
		});
		$lpop.css({
			opacity: 1,
		});
	}
}
function fnCloseAlertLpop() {
	var $mask = $('.lpop-mask'),
		$lpop_wrap = $('.alert-lpop-wrap'),
		$lpop_inner_wrap = $('.lpop-inner', $lpop_wrap),
		$lpop = $('.alert-lpop', $lpop_wrap);

	$('body').removeClass('stop-scroll');

	$mask.hide();
	$lpop_wrap.hide();

	$lpop_inner_wrap.css({
		top: 0,
		'margin-top': 0,
	});
	$lpop.css({
		opacity: 0,
	});
}

function fnThrottle(fn, delay) {
	let timer;
	return function () {
		if (!timer) {
			timer = setTimeout(() => {
				timer = null;
				fn.apply(this, arguments);
			}, delay);
		}
	};
}

function fnDebounce(fn, delay) {
	let timer;
	return function () {
		clearTimeout(timer);
		timer = setTimeout(() => {
			fn.apply(this, arguments);
		}, delay);
	};
}

//다이알로그 팝업 confirm custom
function dialogConfirmPopup(arg_option) {
	var option = {
		str: '확인',
		btn01_txt: '취소',
		btn02_txt: '확인',
		btn01_class: 'cancel',
		btn02_class: 'confirm',
		btn01_fn: dialogPopupAlertClose,
		btn02_fn: dialogPopupAlertClose,
		lpop_width: '',
		mask: '.lpop-mask',
	};
	$.extend(option, arg_option);
	var popDiv = '';
	popDiv += '<div class="lpop-dialog">';
	popDiv += '<p class="left">' + option.str + '</p>';
	popDiv += '<div class="btn right">';
	popDiv += '<button type="button" class="' + option.btn01_class + '">' + option.btn01_txt + '</button>';
	popDiv += '<button type="button" class="' + option.btn02_class + '">' + option.btn02_txt + '</button>';
	popDiv += '</div>';
	popDiv += '</div>';

	var $mask = $(option.mask);
	var $lpop = $(popDiv);

	if (option.lpop_width != '') {
		$lpop.width(option.lpop_width);
	}

	$lpop.find('.btn button').each(function (idx) {
		$(this).on('click', function () {
			eval('option.btn0' + (idx + 1) + '_fn();');
		});
	});

	$('body').addClass('stop-scroll');
	$mask.show();
	if ($('.fn-loading').length > 0) {
		$('.fn-loading').remove();
	}
	$lpop.appendTo('body');
}

function dialogPopupAlertClose(callback, mask) {
	if (!mask) {
		mask = '.lpop-mask';
	}

	var $mask = $(mask);
	var $lpop = $(event.target).parents('.lpop-dialog');
	$('body').removeClass('stop-scroll');
	$mask.hide();
	$lpop.remove();
	if (callback) {
		callback();
	}
}

//------------------------------------------------------
/* layer observer */
var obsv_BsPOP; // Bs popup 감시 할 Intersection Observer 전역.
var obsv_Targets = '.lpop--wrap2, .lpop--wrap, .select-lpop-wrap, .lp-money-get, .open-moneybox'; //  .lpop-mask 제외
var obsv_TargetDelay = false;

function observPopInit() {
	var targetElements = document.querySelectorAll(obsv_Targets);
	var elementsArray = Array.from(targetElements);
	obsv_BsPOP = new IntersectionObserver(function (entries) {
		obsv_BsPOP.els = {}; //레이어 id를 key로 가질 객체
		entries.forEach(function (entry) {
			let elementID = entry.target.id ? '#' + entry.target.id : '.' + entry.target.className; //레이어 ID or Class
			obsv_BsPOP.els[elementID] = false;

			if (entry.isIntersecting) {
				obsv_BsPOP.els[elementID] = true;
				//console.log(elementID + '요소가 화면에 보입니다.' + obsv_BsPOP.els);
				setTimeout(function () {
					obsv_TargetDelay = true;
				}, 1500);
			} else {
				obsv_BsPOP.els[elementID] = false;
				//console.log(elementID + '요소가 화면에서 사라졌습니다.' + obsv_BsPOP.els);
				obsv_TargetDelay = false;
			}
			//obsv_TargetDelay
		});
	});
	// 감시 대상 요소들 등록
	elementsArray.forEach(function (element) {
		obsv_BsPOP.observe(element);
	});
}

// 감시 중인 obsv_BsPOP를 조회, 보여지는 Bs레이어의 id값을 배열로 반환
function isBsVisible() {
	if (typeof obsv_BsPOP === 'object' && obsv_BsPOP.els !== undefined) {
		var obj = obsv_BsPOP.els;
		var keys = Object.keys(obj);
		var arrVisiblePop = keys.filter(function (key) {
			return obj[key];
		});
		//console.log(arrVisiblePop, arrVisiblePop.length);
		return arrVisiblePop;
	} else {
		return null;
	}
}

//------------------------------------------------------
/* bottom sheet */
function BsCtl(bsTarget, bsObj) {
	if (!new.target) {
		return new BsCtl(bsTarget, bsObj);
	}
	this.target = $(bsTarget);

	var triggerBtn;
	//	triggerBtn = bsObj?.callBtn?? window.event?.currentTarget ;
	if (bsObj && bsObj.callBtn !== undefined && bsObj.callBtn !== null) {
		triggerBtn = bsObj.callBtn;
	} else if (window.event && window.event.currentTarget !== undefined && window.event.currentTarget !== null) {
		triggerBtn = window.event.currentTarget;
	} else {
		triggerBtn = undefined;
	}

	triggerBtn = triggerBtn == undefined || triggerBtn.nodeName == '#document' ? undefined : triggerBtn;
	this.callBtn = triggerBtn !== undefined && $(triggerBtn);
	this.btnEditing = this.callBtn && this.callBtn.data().editing ? 'enabled' : undefined;
	//	this.closeCallback = bsObj?.closeCallback?? undefined;
	if (bsObj && bsObj.closeCallback !== undefined && bsObj.closeCallback !== null) {
		this.closeCallback = bsObj.closeCallback;
	} else {
		this.closeCallback = undefined;
	}

	//	this.customButtons = bsObj?.customButtons?? undefined;
	if (bsObj && bsObj.customButtons !== undefined && bsObj.customButtons !== null) {
		this.customButtons = bsObj.customButtons;
	} else {
		this.customButtons = undefined;
	}

	//	this.loadAfter = bsObj?.loadAfter?? undefined;
	if (bsObj && bsObj.loadAfter !== undefined && bsObj.loadAfter !== null) {
		this.loadAfter = bsObj.loadAfter;
	} else {
		this.loadAfter = undefined;
	}

	if (this.callBtn) {
		this.showEvent();
	}
}

BsCtl.prototype.showEvent = function () {
	this.callBtn.off('click').on(
		'click',
		function (e) {
			this.show();
		}.bind(this)
	);
};

BsCtl.prototype.show = function (e) {
	this.target.show();
	$('body').addClass('stop-scroll');

	!!this.target.find('.select-list .item-inner').length && this.itemClick();
	!!this.target.find('.btn-close').length && this.closePop();
	this.customButtons && this.customBtnClick();
	this.loadAfter && this.loadAfter();

	if (this.callBtn && this.callBtn.closest('.lpop--wrap2').length > 0) {
		this.parent = this.callBtn.closest('.lpop--wrap2');
		this.parent.hide();
	}
};

BsCtl.prototype.callbackCustom = function (obj, callback) {
	if (callback) {
		callback(obj);
	}
};

BsCtl.prototype.itemClick = function () {
	try {
		this.target
			.find('.item-inner')
			.off('click')
			.on(
				'click',
				function (e) {
					var $this = $(e.currentTarget);

					// .except 클래스가 있는 태그는 제거하기
					var cloneThis = $this.clone();
					cloneThis.find('.except').remove();
					if (cloneThis.find('.just-this').length > 0) {
						// .just-this 태그만 가져올 때
						cloneThis = cloneThis.find('.just-this');
					}
					var selectItem = cloneThis.html();
					$this.closest('li').siblings().find('a').removeClass('on');
					$this.addClass('on');
					this.callBtn.addClass('on');
					if (this.callBtn.find('.bs-value, span:first-child').length > 0) {
						this.callBtn.find('.bs-value, span:first-child').first().get(0).innerHTML = selectItem;
					} else {
						if (this.btnEditing == 'enabled') {
							this.callBtn.empty();
							this.callBtn.get(0).innerHTML = selectItem;
						}
					}
					this.hide();
					if(this.parent && !this.parent.hasClass('uixThrough')) {
						this.parent && this.parent.show();
					}
					return false;
				}.bind(this)
			);
	} catch {
		console.log('callBtn을 설정해주세요');
	}
};

BsCtl.prototype.customBtnClick = function () {
	var $this = this;
	this.customButtons.forEach(function (item) {
		$(item.el)
			.off('click')
			.on('click', function (e) {
				if (item.elCallback) {
					item.elCallback();
				}
				(item.popClose == undefined ? true : item.popClose) && $this.hide();
			});
	});
};

BsCtl.prototype.closePop = function (callback) {
	this.target
		.find('.btn-close')
		.off('click')
		.on(
			'click',
			function (e) {
				this.hide();
				if(this.parent && !this.parent.hasClass('uixThrough')) {
						this.parent && this.parent.show();
					}
				if (this.closeCallback) {
					this.closeCallback();
				}
				if (callback) {
					callback();
				}
			}.bind(this)
		);
};

BsCtl.prototype.hide = function () {
	this.target.hide();
	$('body').removeClass('stop-scroll');
};

BsCtl.prototype.remove = function () {
	this.target.remove();
	//this = null;
};

// 특정 dom 안에 동적으로 html 문서를 로드해서 삽입하는 함수 (container, url)
BsCtl.prototype.loadHtml = function (element, url, callback) {
	this.target.find(element).load(url, callback);
};

// 레이어 dimm 영역 클릭 시 닫기 버튼 호출
function fnCancelateLayer() {
	document.body.addEventListener('click', function (e) {
		if (isBsVisible() && isBsVisible().length === 1 && obsv_TargetDelay === true) {
			var layerEl = isBsVisible()[0];
			layerEl = layerEl.replace(/ /g, '.');
			if (e.target.matches(obsv_Targets) && $(layerEl + ' .btn-close').length > 0) {
				$(layerEl + ' .btn-close')[0].click();
			}
		} else {
			obsv_TargetDelay = false;
		}
	});
}

//------------------------------------------------------
/*
	1. 다이얼로그... : 
	트리거버튼 없이 show할 수 있다. 
	하단 버튼이 하나 이상고려 
	호출됐을때 z-index를 제일 높게 

	dlSeletor:선택한 알럿
	callBtn : 알럿을 트리거한 버튼 

*/

function DialogCtl(dlObj, btnCallback) {
	if (!new.target) {
		return new DialogCtl(dlObj, btnCallback);
	}
	this.target;
	this.dlObj = dlObj;

	if (typeof dlObj == 'object') {
		this.callBtn = dlObj.callBtn ? dlObj.callBtn : undefined;
		this.form = dlObj.form ? dlObj.form : undefined;
		this.customButtons = this.dlObj.customButtons ? this.dlObj.customButtons : undefined;
		if (this.callBtn) {
			this.callBtn = $(this.callBtn);
			this.showEvent();
		}
	} else if (typeof dlObj == 'string' && typeof btnCallback == 'function') {
		this.btnCallback = btnCallback;
	}
}

DialogCtl.prototype.show = function () {
	if (this.callBtn && window.event.currentTarget !== this.callBtn.get(0)) {
		console.log('onclick시 currentTarget과 callBtn의 element가 다르니 옵션에서 callBtn을 제거해 주세요');
		return;
	}
	//	console.log('diallogShow');
	this.makeUp();
	var maxZIndex = DialogCtl.getZIndex();
	this.target.css('z-index', ++maxZIndex).show();
	$('body').addClass('stop-scroll');

	if (isBsVisible() && isBsVisible().length > 0) {
		$('.lpop--wrap, .lpop--wrap2, .select-lpop-wrap, .lpop-mask').addClass('hide-dimm');
	}
	this.customButtons && this.customBtnClick(this.customButtons);
};

DialogCtl.prototype.makeUp = function () {
	if ($(document).find('.alert-wrap').length) {
		$(document).find('.alert-wrap').remove();
	}
	if (typeof dlObj !== 'object') {
		this.onlyText = this.dlObj;
	}

	var dialogOuter = this.createElement('alert-wrap');
	var dialog = this.createElement('lpop-dialog');
	var dialogBody = this.createElement('lpop-body');
	var dialogFooter = this.createElement('btn');
	var btnGroup;
	//	dialogBody.innerHTML = this.dlObj.form?.content?? this.onlyText ;
	if (this.dlObj && this.dlObj.form && this.dlObj.form.content) {
		dialogBody.innerHTML = this.dlObj.form.content;
	} else {
		dialogBody.innerHTML = this.onlyText;
	}

	dialog.append(dialogBody);
	dialog.append(dialogFooter);
	dialogOuter.append(dialog);

	if (this.form && this.form.button) {
		this.form.button.forEach(
			function (item) {
				var btnClass;
				//	btnClass = item.el?.replace('.', '');
				if (item.el) {
					btnClass = item.el.replace('.', '');
				} else {
					btnClass = undefined;
				}
				var btn = this.createElement(btnClass, 'button', item.btnText);
				if(item.attr && typeof item.attr === 'object') {
					Object.keys(item.attr).forEach(key => {
						btn.setAttribute(key, item.attr[key]);
					});
				}
				btn.text = item.btnText;
				dialogFooter.append(btn);
				btnGroup = this.form.button;
			}.bind(this)
		);
	} else {
		var onlyOnebtn = this.createElement('', 'button', '확인');
		dialogFooter.append(onlyOnebtn);
		btnGroup = [{ el: onlyOnebtn }];
	}
	if (isBsVisible() && isBsVisible().length > 0) {
		$(dialogOuter).addClass('on-layer');
	}
	this.target = $(dialogOuter);
	$('body').append(this.target);
	this.customBtnClick(btnGroup);
};

DialogCtl.prototype.createElement = function (className, tagName = 'div', txt) {
	var elem = document.createElement(tagName);
	$(elem).addClass(className);
	txt && $(elem).text(txt);
	return elem;
};

DialogCtl.prototype.showEvent = function () {
	this.callBtn.off('click').on(
		'click',
		function (e) {
			e.preventDefault();
			this.show();
		}.bind(this)
	);
};

DialogCtl.prototype.hide = function () {
	this.target.attr('style', '').hide();
	$('body').removeClass('stop-scroll');
	$('.lpop--wrap, .lpop--wrap2, .select-lpop-wrap, .lpop-mask').removeClass('hide-dimm');
	this.target.remove();
};

DialogCtl.prototype.customBtnClick = function(btnGroup){
	var $this = this;
	btnGroup.forEach(function(item){
		var elSelector = item.el; // 지역 변수로 분리
		if(typeof elSelector === 'string') {
			elSelector = elSelector.replace(/\t/g, ' ');
			elSelector = elSelector.replace(/ +/g, ' ');
			elSelector = elSelector.replace(/ /g, '.');
			if (elSelector.length > 0 && elSelector.slice(-1) === '.') {
				elSelector = elSelector.slice(0, -1) + '';
			}
		}
		$(elSelector).off('click').on('click', function(e){ // elSelector 사용
			e.preventDefault();
			if(item.elCallback){
				item.elCallback();
			} else if($this.btnCallback) {
				$this.btnCallback();
			}
			(item.dialogHide == undefined? true : item.dialogHide) && $this.hide(); 
		});
	})
}
DialogCtl.prototype.callbackCustom = function (obj, callback) {
	if (callback) {
		callback(obj);
	}
};

DialogCtl.prototype.loadHtml = function (element, url, callback) {
	this.target.find(element).load(url, callback);
};

DialogCtl.getZIndex = function () {
	return [...document.querySelectorAll('body > *, .event-reform > *')]
		.map(function (ele) {
			return parseInt(getComputedStyle(ele).zIndex, 10) || 0;
		})
		.reduce(function (prev, curr) {
			return curr > prev ? curr : prev;
		}, 0);
};

function copycont(cont) {
	cont = cont.replace(/\t/g, '');
	console.log(cont);
	var tempElem = document.createElement('textarea');
	tempElem.value = cont;
	document.body.appendChild(tempElem);
	tempElem.select();
	document.execCommand('copy');
	document.body.removeChild(tempElem);
}

// 토스트팝업
var toastPopupAlertEvent = toastPopup;
var toastPopupAlertEvt = toastPopup;
var toastPopupAlertEvt2 = toastPopup;
var toastPopupAlert = toastPopup;
var toastPopupAlert2 = toastPopup;
var toastPopupCustom = toastPopup;
function toastPopup(str, opt) {
	var viewTime = 2000;
	if(opt && opt.viewTime && typeof opt.viewTime === 'number') {
		viewTime = opt.viewTime;
	}
	if (opt && opt.addSelector) {
		var addSelector = opt.addSelector;
	} else {
		var addSelector = '';
	}

	$(`<div class="toast ${addSelector}"></div>`).appendTo('body');
	var toast = $('.toast');
	toast.html(str);
	toast
		.animate({ bottom: '20px', opacity: '1' }, 300)
		.delay(viewTime)
		.animate({ bottom: '30px', opacity: '0' }, 300, function () {
			toast.remove();
		});
}

// 아코디언 열기/닫기 (유의사항)
function AccCtl(opt) {
	this.option = opt || { clickScroll: true };
	$('.acc-wrap .acc-item').each(function (_, item) {
		$(item).find('.acc-cont').load($(item).data().loadHtml);
	});

	this.eventDefine();
}
AccCtl.prototype.eventDefine = function () {
	var opt = this.option;
	$('.acc-wrap .acc-header').on('click', function (e) {
		var parent = $(this).closest('.acc-item');
		if (parent.hasClass('no-toggle')) return;

		parent.toggleClass('active');
		var className = parent.hasClass('active') ? ['slideDown', 'addClass'] : ['slideUp', 'removeClass'];
		parent.find('.acc-cont')[className[0]]('fast', function () {
			$(this)[className[1]]('show');
		});

		if (opt.clickScroll) {
			$('html, body').animate(
				{
					scrollTop: parent.offset().top - ($('header').height() ? $('header').height() : 0),
				},
				500
			);
		}
	});
};

//약관 상세 관련 메소드
var fnTermsDetail = {
	layerClass: '.lpop--wrap2.terms-detail', //약관 상세 레이어 클래스

	//약관 상세 레이어 렌더링
	render: function () {
		let dom = `
            <div class="lpop--wrap2 full-lpop-wrap terms-detail" id="termsAgreeLpop">
                <div class="lpop-inner">
                    <section class="select-lpop">
                        <header class="lpop-header">
                            <h1 class="lpop-tit"></h1>
                            <button type="button" class="btn-close">닫기</button>
                        </header>
                        <div class="lpop-cont">
							<!-- load admin contents -->
                        </div>
                    </section>
                    <div class="btn-confirm-fn">
                        <button type="button" onclick="$(this).closest('.terms-detail').find('.btn-close').click();">확인</button>
                    </div>
                </div>
            </div>`;
		$(dom).appendTo('body');
		observPopInit(); //동적 생성한 layer를 observer 감시 개체에 추가 함.
		var instance = new BsCtl(this.layerClass, {
			//레이어 인스턴스 생성
			closeCallback: function () {
				instance.hide(); // 약관 닫을 때 레이어 DOM을 숨김
				setTimeout(function () {
					instance.remove(); // 레이어 DOM을 제거 (callback 이 있는 경우 실행 시간이 필요)
				}, 100);
			},
		});
		return instance;
	},

	//하위약관 탭 기능 활성화
	tabTerms: function () {
		var _this = $(this.layerClass);
		if (_this.length) {
			_this.each(function () {
				var _tabA = _this.find('a');
				_tabA.each(function () {
					var _tabLi = _this.find('li'),
						_contF = $(_this.find('li a').eq(0).attr('href'));
					var _tabIdx = 0;
					$(this).on('click', function (e) {
						e.preventDefault();
						var _thisId = $(this).attr('href'),
							_thisA = $(_thisId);
						_this.find('li').removeClass('on');
						$(this).parents('li').addClass('on');
						_thisA.css('display', 'block');
						_thisA.siblings('.tabCont').css('display', 'none');
						$('.lpop-cont').animate({ scrollTop: 0 }, 300);
					});
				});
			});
		}
	},

	// 정보활용 등급 툴팁 append
	tooltip: function () {
		console.log($(this.layerClass + ' .headItem').length);
		if ($(this.layerClass + ' .headItem').length > 0) return;
		let string = `
		<div class="headItem">
			<strong class="rateTit">BC카드 정보활용 등급</strong>
			<div class="tooltip">
				<button type="button" class="btnTooltip" onclick="$(this).next().toggleClass('show');">안내</button>
				<div class="tooltipCont">
					<p>사생활 침해 위험, 혜택, 명확성 등을 종합적으로 고려하여 동의 내용의 평가 등급을 제공합니다.</p>
					<button type="button" class="btnClose" onclick="$(this).parent().toggleClass('show');">닫기</button>
				</div>
			</div>
		</div>`;
		$(string).appendTo(this.layerClass + ' .rateView');
	},

	// 전체 확인용, init()
	termsScroll: function () {
		var that = this;
		var layer = this.layerClass;
		$(layer + ' .scrollDowns').on('click', function () {
			that.scrollDownBtn(layer);
		});
		$(layer + ' .lpop-cont').on(
			'scroll',
			fnThrottle(function () {
				that.scrollDown(layer);
			}, 200)
		);
		$(layer + ' .lpop-cont').on(
			'scroll',
			fnDebounce(function () {
				that.scrollDown(layer);
			}, 200)
		);
	},

	// 전체 확인용, '계속보기' 버튼 클릭 시
	scrollDownBtn: function (layer) {
		var t = document.querySelector(layer + ' .lpop-cont > *:first-child').getBoundingClientRect().top * -1;
		var pageHeight = $(window).height() - $(layer + ' .lpop-header').height();
		$(layer + ' .lpop-cont').animate({
			scrollTop: t + pageHeight * 0.98,
		});
	},

	// 전체 확인용, 스크롤에 따른 '계속보기' 활성,비활성화
	scrollDown: function (layer) {
		var t = document.querySelector(layer + ' .lpop-cont > *:first-child').getBoundingClientRect().top * -1;
		var pageHeight = $(window).height();
		var contHeight =
			$(layer + '  .lpop-cont')
				.css('padding-bottom')
				.replace('px', '') * 1;
		$(layer + ' .lpop-cont > *').each(function () {
			contHeight += $(this).outerHeight(true);
		});
		if (Math.ceil(t + pageHeight) >= contHeight) {
			$(layer + '  .scrollDownArea').hide();
		}
	},

	// 정보활용등급 render
	infGrdRender: function (code) {
		if (code == '01') {
			return `<div class="rateView">
			<div class="rateImg"><img src="${com.getCdnUri}/static/assets/images/comm/terms_rate_1.png" alt="BC카드 정보활용 안심 등급"></div>
		</div>`;
		} else if (code == '02') {
			return `<div class="rateView">
			<div class="rateImg"><img src="${com.getCdnUri}/static/assets/images/comm/terms_rate_2.png" alt="BC카드 정보활용 다소안심 등급"></div>
		</div>`;
		} else if (code == '03') {
			return `<div class="rateView">
			<div class="rateImg"><img src="${com.getCdnUri}/static/assets/images/comm/terms_rate_3.png" alt="BC카드 정보활용 보통 등급"></div>
		</div>`;
		} else if (code == '04') {
			return `<div class="rateView">
			<div class="rateImg"><img src="${com.getCdnUri}/static/assets/images/comm/terms_rate_4.png" alt="BC카드 정보활용 신중 등급"></div>
		</div>`;
		} else if (code == '05') {
			return `<div class="rateView">
			<div class="rateImg"><img src="${com.getCdnUri}/static/assets/images/comm/terms_rate_5.png" alt="BC카드 정보활용 주의 등급"></div>
		</div>`;
		}
	},

	// 통신사 약관 일 경우 실행
	isTelecomTerms: function () {
		$.getScript(cdnUri + '/static/assets/scripts/join/unified-telecom-terms.js', function () {
			if ($('#termsAgreeLpop .tab-menu1').length > 0) {
				$('#termsAgreeLpop .tab-menu1 .active').click();
			}
		});
	},
};

function fnTermsDetailView(stipNo, callback) {
	//stipNo: 약관코드, callback: 콜백
	var termsDetailLayer = fnTermsDetail.render();

	var $stip_titl = $('#termsAgreeLpop h1.lpop-tit');
	var $stip_cont = $('#termsAgreeLpop div.lpop-cont');

	if (!$(`link[href='${cdnUri}/static/assets/styles/comm/terms_base.css']`).length) {
		$(`<link href="${cdnUri}/static/assets/styles/comm/terms_base.css" rel="stylesheet">`).appendTo('head');
	}

	// $stip_titl.html(`${stipNo} 약관 타이틀 내용`);
	// $stip_cont.html(`${stipNo} 약관 상세 내용`);

	var error = function (qXHR, status, err) {
		DialogCtl('약관 조회에 실패하였습니다.').show();
	};
	var success = function (result) {
		console.log(result.data);
		if (result && result.code == '20000' && result.data.stipUrlAddr !== '') {
			console.log(result.data.stipUrlAddr);
			//	약관컨텐츠가 url 타입일 때
			$stip_titl.html(result.data.stipNm);

			if (result.data.stipGrdMgCd === undefined) {
				// 임시테스트 용
				result.data.stipGrdMgCd = '01'; // 테스트 후 00 등으로 세팅 필요
			}
			$(fnTermsDetail.infGrdRender(result.data.stipGrdMgCd)).appendTo($stip_cont);
			fnTermsDetail.tooltip(); //정보활용등급 툴팁

			$('<div class="terms-cont" id="terms-cont"></div>').appendTo($stip_cont);
			$('#terms-cont').load(result.data.stipUrlAddr + ' .layout-contents, .termsInner', function () {
				//약관 html 내 불러올 class가 여러개 일 때, 콤마로 구분해서 사용 가능
				$('#mPB_loading').remove();
				fnTermsDetail.isTelecomTerms();
				if (callback) callback();
			});
		} else if (result && result.code == '20000') {
			//	약관컨텐츠가 관리자 html 타입일 때
			$stip_titl.html(result.data.stipNm);

			if (result.data.stipGrdMgCd === undefined) {
				// 임시테스트 용
				result.data.stipGrdMgCd = '01'; // 테스트 후 00 등으로 세팅 필요
			}
			$(fnTermsDetail.infGrdRender(result.data.stipGrdMgCd)).appendTo($stip_cont);
			fnTermsDetail.tooltip(); //정보활용등급 툴팁

			const lawCont = com.decodeHtmlTerms(result.data.stipHtmlCtnt);
			const parser = new DOMParser();
			const termsCont = parser.parseFromString(lawCont, 'text/html');
			const termsInnerCont = termsCont.querySelector('.termsInner');
			let finTermsCont;
			if (termsInnerCont !== null) {
				finTermsCont = $('<div class="terms-cont" id="terms-cont"></div>').append(termsInnerCont);
			} else {
				finTermsCont = $('<div class="terms-cont" id="terms-cont">' + lawCont + '</div>');
			}

			finTermsCont.appendTo($stip_cont);

			// 약관 레이어가 보이는 상태면, #mPB_loading 을 제거
			$('#mPB_loading').remove();
			fnTermsDetail.isTelecomTerms();
			if (callback) callback();
		}
	};

	ajaxRequest(`${baseUri}/pybc/api/memb/memb-agri/memb-stip/stip-mgt/stip-last-ver?pybcStipNo=${stipNo}`, success, error, {}, 'GET', 'json', true);

	fnTermsDetail.tabTerms(); //하위약관 탭 기능 활성화 (탭 없으면 비 활성화)
	termsDetailLayer.show();
	// if(callback) callback();
}

// anchor 요소로 스크롤
function fnScrollToAnchor(el){
	setTimeout(function(){
		const target = document.querySelector(el);
		target.scrollIntoView({
			behavior: "smooth"
		});
	}, 100);
};

//스크롤 top
function scrollTopBtnCtl() {
	//scrollTop을 사용하지 않을 경우 body에 data-scroll-top="no" 추가
	if ($('body').get(0).dataset.scrollTop == 'no') return;

	var vh = window.innerHeight;
	var timer;
	var gap = 70;
	var elem = document.elementFromPoint(0, vh - gap);
	var fixedBool = false;

	if (elem) {
		var { position, bottom } = elem && getComputedStyle(elem);
		bottom = Number(bottom.replace('px', ''));
		fixedBool = (position == 'fixed' || position == 'sticky') && bottom == 0;
	}

	$('body').append(`<button type="button" class="top-btn" data-visible="false"><span class="blind">위로</span></button>`);
	var topBtn = $('.top-btn');
	!fixedBool && topBtn.addClass('no-fixed');

	$(window).on('scroll', function (e) {
		if (!timer) {
			timer = setTimeout(function () {
				timer = null;
				$(window).scrollTop() >= vh ? topBtn.attr('data-visible', 'true') : topBtn.attr('data-visible', 'false');
			}, 200);
		}
	});
	$('.top-btn').on('click', function (e) {
		e.preventDefault();
		//$('html, body').animate({ scrollTop: 0 }, 500);
		var b = isHeightExceedsViewport();
		window.scrollTo({
			top: 0,
			behavior: b ? 'instant' : 'smooth',
		});
	});
}

function isHeightExceedsViewport() {
	const bodyHeight = document.body.scrollHeight; // body의 전체 높이
	const viewportHeight = window.innerHeight; // 뷰포트 높이
	return bodyHeight > viewportHeight * 3;
}

//-------------------
function inputClearBtnEvent() {
	var inputSelector = $('input[type="text"], input[type="tel"], input[type="number"], input[type="email"], input[type="search"]');
	var clearTextTimeout;
	var first = false;

	$(inputSelector).on('input focus', function (e) {
		var inputTarget = $(e.currentTarget);
		if (inputTarget.parent('.input-parent').length == 0) {
			first = true;
			makeClearBtn(inputTarget.get(0));
			first = false;
		}
		inputTarget.val() !== '' ? inputTarget.siblings('.clear-btn').show() : inputTarget.siblings('.clear-btn').hide();
	});

	$(inputSelector).on('blur', function (e) {
		if (first) return;
		var inputTarget = $(e.currentTarget);
		clearTextTimeout = setTimeout(function () {
			inputTarget.siblings('.clear-btn').hide();
		}, 100);
	});

	$(document).on('click', '.clear-btn', function (e) {
		clearTimeout(clearTextTimeout);
		$(e.currentTarget).siblings('input').val('').focus();
	});
}

function makeClearBtn(inputItem) {
	if (
		$(inputItem).parent().find('.clearInputBtn').length > 0 ||
		$(inputItem).siblings('.btn-clear').length > 0 ||
		$(inputItem).siblings('.clear').length > 0 ||
		$(inputItem).prop('readonly') ||
		$(inputItem).prop('disabled') ||
		inputItem.offsetWidth < 170 ||
		window.getComputedStyle(inputItem).textAlign == 'right' ||
		$(inputItem).closest('.point-input-wrap').length > 0 ||
		(document.documentElement.getAttribute('page_id') && document.documentElement.getAttribute('page_id').indexOf('P0506') > -1) ||
		inputItem.dataset.clearBtn == 'no' // input에 data-clear-btn="no" 추가시
	)
		return;

	console.log('in');
	//var inputW = inputItem.offsetWidth;
	var inputW = (inputItem.offsetWidth / $(inputItem).parent().width()) * 100;
	var hasBlock = $(inputItem).outerHeight() != $(inputItem).outerHeight(true) && inputItem.offsetWidth >= $(window).innerWidth() - 24 * 2;

	$(inputItem).wrap('<span class="input-parent"></span>');
	var parent = $(inputItem)
		.parent('.input-parent')
		.css({ width: inputW + '%' }); // percent로 변환
	hasBlock && parent.addClass('type2');

	$(inputItem).css({ width: '100%' });
	var btnW = 24;
	var top = inputItem.offsetTop + $(inputItem).innerHeight() / 2 - btnW / 2 + 1;
	var left = inputItem.offsetLeft + inputItem.offsetWidth - btnW - 10;

	var etcElem = [...parent.siblings()].filter(function (item) {
		//조건 변경
		return window.getComputedStyle(item).position == 'absolute' && $(item).width() > 0 && $(item).width() <= inputItem.offsetWidth;
	});

	etcElem.forEach(function (item) {
		var etcLeftPos = Math.round(Number(window.getComputedStyle(item).left.replace('px', '')));
		left = left + btnW >= etcLeftPos && left <= etcLeftPos + item.clientWidth ? etcLeftPos - 30 : left;
	});
	//left = Math.round((left /($(inputItem).parent().width() )) * 100); //퍼센트로 변환
	var btnPos = $(inputItem).parent().width() - left - btnW + 10;
	parent.append(`<button type="button" class="clear-btn"><span class=blind>삭제</span></button>`);
	parent.find('.clear-btn').css({ top: `${top}px`, right: `${btnPos}px` });

	$(inputItem).focus();
}

$(window).on('load', function () {
	inputClearBtnEvent();
	setTimeout(scrollTopBtnCtl, 100);
});

//--------------------------------------------------
/*
	툴팁
	1. html 구조 
	예 ) <button type="button" class="btn tooltip-trigger" data-tooltip-cont="다시 분석 또는 계좌 변경 시 직접 입력한 “기타“ 카테고리는 모두 초기화 됩니다." data-tooltip-pos="bottom" >안내</button>
	data-tooltip-cont : 툴팁의 컨텐츠. 태그 가능 
	data-tooltip-pos : 툴팁 방향(top/bottom) bottom일 경우 생략 가능.

	2. javascript 
	예) new TooltipCtl(item, {addSelector : 'add', arrow : true, width:320});
	- item :  툴팁 버튼 트리거 
	- object 생략 가능. 추가적인 사항이 필요할 경우 사용 
	  addSelector : class 추가할 경우 
	  arrow : 툴팁 말꼬리가 필요한 경우 true / false가 default
	  width : width가 필요한 경우 

	  show() : 보여주기
	  hide() : 닫기
*/

function TooltipCtl(selector, obj) {
	if (!new.target) {
		return new TooltipCtl(selector, obj);
	}
	this.selector = selector ? $(selector) : $(window.event.currentTarget);
	if(this.selector.length === 0){
		return;
	}
	this.tootipInfoObj = {};
	this.tootipInfoObj.content = this.selector.data('tooltipCont') ? this.selector.data('tooltipCont') : obj.content;
	this.tootipInfoObj.position = this.selector.data('tooltipPos') ? this.selector.data('tooltipPos') : 'bottom';
	this.tootipInfoObj = obj ? { ...this.tootipInfoObj, ...obj } : this.tootipInfoObj;
	this.tootipInfoObj.container = this.tootipInfoObj.container ? this.tootipInfoObj.container : 'body';
	this.tootipInfoObj.arrow = this.tootipInfoObj.arrow ? this.tootipInfoObj.arrow : false;
	this.customId = this.tootipInfoObj.id;

	this.selector.on(
		'click',
		function (e) {
			e.preventDefault();
			this.show();
		}.bind(this)
	);
}

TooltipCtl.prototype.show = function () {
	this.makeup();
	//show
	$('.tooltip-container').show();

	//닫기
	// $(document).on('click', '.tooltip-close-btn', function(e){
	// 	var target = e.currentTarget;
	// 	target.closest('.tooltip-container').remove();
	// });
	$('.tooltip-close-btn').on('click', function (e) {
		var target = e.currentTarget;
		target.closest('.tooltip-container').remove();
	});
};

TooltipCtl.prototype.hide = function () {
	$('.tooltip-container').remove();
};

TooltipCtl.prototype.makeup = function () {
	if ($(document).find('.tooltip-container').length) {
		$(document).find('.tooltip-container').remove();
	}
	var wrapContainerGutter = this.selector.closest('.lpop--wrap2').length > 0 ? 30 : 20;
	var tooltipElem = `<div class="tooltip-container">
		<div class="tooltip-content"></div>
		<button type="button" class="tooltip-close-btn"><span class="blind">툴팁 닫기</span></button>
	</div>`;
	$(this.tootipInfoObj.container).append(tooltipElem);
	$('.tooltip-container .tooltip-content').html(this.tootipInfoObj.content);
	this.tootipInfoObj.addSelector && $('.tooltip-container').addClass(this.tootipInfoObj.addSelector);

	var position = this.getPos();
	var zIndex = this.getZIndex() + 1;
	if (this.tootipInfoObj && this.tootipInfoObj.blockGap) {
		var blockGap = this.tootipInfoObj.blockGap;
	} else {
		var blockGap = 0;
	}

	var tooltipW = this.tootipInfoObj.width ? (!isNaN(Number(this.tootipInfoObj.width)) ? this.tootipInfoObj.width + 'px' : this.tootipInfoObj.width) : `calc(100vw - ${wrapContainerGutter * 2}px)`;
	var randomId = this.customId ? this.customId : 'tooltip_' + Date.now();

	this.selector.attr('aria-describedby', randomId);
	this.tootipInfoObj.arrow && $('.tooltip-container').addClass('has-arr');

	$('.tooltip-container')
		.css({
			width: tooltipW,
			left: position.left + 'px',
			top: position.top + blockGap + 'px',
			zIndex: zIndex,
		})
		.attr('id', randomId);
	$('.tooltip-container')
		.get(0)
		.style.setProperty('--arrX', position.arrX + 'px');
	$('.tooltip-container').get(0).style.setProperty('--arrYtop', position.arrYtop);
	$('.tooltip-container').get(0).style.setProperty('--arrYbottom', position.arrYbottom);
	$('.tooltip-container').get(0).style.setProperty('--arrRotate', position.arrRotate);
};

TooltipCtl.prototype.getPosNew = function () {
	var targetEl = this.selector.get(0);
	var containerEl = $(this.tootipInfoObj.container).get(0);

	if (!targetEl || !containerEl) return { left: 0, top: 0 };

	// viewport 기준 rect
	var targetRect = targetEl.getBoundingClientRect();
	var containerRect = containerEl.getBoundingClientRect();

	// 스크롤 보정 (iOS 웹뷰 필수)
	var scrollX = window.pageXOffset || document.documentElement.scrollLeft;
	var scrollY = window.pageYOffset || document.documentElement.scrollTop;

	// container 기준 좌표
	var realX = targetRect.left - containerRect.left + scrollX;
	var realY = targetRect.top - containerRect.top + scrollY;

	var wrapContainerGutter = this.selector.closest('.lpop--wrap2').length > 0 ? 30 : 20;
	var gap = 10;
	var windowW = window.innerWidth;

	var tooltipW = this.tootipInfoObj.width
		? Number(this.tootipInfoObj.width)
		: windowW - wrapContainerGutter * 2;

	var left;
	if (realX - tooltipW / 2 + wrapContainerGutter > 0) {
		left =
			realX + tooltipW <= windowW - wrapContainerGutter
				? realX - tooltipW / 2
				: windowW - wrapContainerGutter - tooltipW;
	} else {
		left = wrapContainerGutter;
	}

	var top =
		this.tootipInfoObj.position === 'top'
			? realY - $('.tooltip-container').outerHeight() - gap
			: realY + targetRect.height + gap;

	var arrX = targetRect.left + targetRect.width / 2 - left;

	return {
		left: left,
		top: top,
		arrX: arrX,
		arrYtop: this.tootipInfoObj.position === 'top' ? 'none' : '-18px',
		arrYbottom: this.tootipInfoObj.position === 'top' ? '-18px' : 'none',
		arrRotate: this.tootipInfoObj.position === 'top' ? 'rotate(180deg)' : 'rotate(0deg)',
	};
};

TooltipCtl.prototype.getPos = function () {
	var itemCoord = this.getCoord(this.selector);
	var containerCoord = this.getCoord($(this.tootipInfoObj.container));
	var realCoord = {
		x: itemCoord.x - containerCoord.x,
		y: itemCoord.y - containerCoord.y,
	};
	var wrapContainerGutter = this.selector.closest('.lpop--wrap2').length > 0 ? 30 : 20;
	var gap = 10;
	var windowW = $(window).innerWidth();

	var tooltipW = this.tootipInfoObj.width ? this.tootipInfoObj.width : windowW - wrapContainerGutter * 2;
	var left;
	if (this.tootipInfoObj.width && realCoord.x - tooltipW / 2 + wrapContainerGutter > 0) {
		left = left + this.tootipInfoObj.width <= windowW - wrapContainerGutter * 2 ? realCoord.x - tooltipW / 2 + wrapContainerGutter : windowW - wrapContainerGutter - tooltipW;
	} else {
		left = wrapContainerGutter;
	}
	var top = this.tootipInfoObj.position == 'top' ? realCoord.y - $('.tooltip-container').outerHeight() - gap : realCoord.y + this.selector.outerHeight() + gap;
	var arrX = itemCoord.x - left;
	var arrYtop = this.tootipInfoObj.position == 'top' ? 'none' : '-18px';
	var arrYbottom = this.tootipInfoObj.position == 'top' ? '-18px' : 'none';
	var arrRotate = this.tootipInfoObj.position == 'top' ? 'rotate(180deg)' : 'rotate(0deg)';
	return {
		left: left,
		top: top,
		arrX: arrX,
		arrYtop: arrYtop,
		arrYbottom: arrYbottom,
		arrRotate: arrRotate,
	};
};

TooltipCtl.prototype.getCoord = function (item) {
	const rect = item.get(0).getBoundingClientRect();
	const vv = window.visualViewport;
	const offsetX = vv ? vv.offsetLeft : 0;
	const offsetY = vv ? vv.offsetTop : 0;
	return {
		x: rect.left + offsetX,
		y: rect.top + offsetY
	};
	/*
	var target = item.get(0);
	var offsetX = 0;
	var offsetY = 0;
	if (target && target.offsetParent !== undefined) {
		do {
			offsetX += target.offsetLeft;
			offsetY += target.offsetTop;
		} while ((target = target.offsetParent));
	}
	return { x: offsetX, y: offsetY };
	*/
};

TooltipCtl.prototype.getZIndex = function () {
	return [...$('body').children()]
		.map(function (item) {
			return parseInt(getComputedStyle(item).zIndex, 10) || 0;
		})
		.reduce(function (prev, curr) {
			return curr > prev ? curr : prev;
		}, 0);
};

// 스켈레톤 객체 및 메소드
var pskUI = {
	emoji: /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g,
};

// 개발 로드 후 스켈레톤 제거
pskUI.remove = function (obj) {
	if (obj) {
		var pskItems = obj;
	} else {
		var pskWrap = document.querySelector('.psk-wrap');
		var pskItems = pskWrap.querySelectorAll(':scope > div');
		pskWrap.setAttribute('psk-status', 'complete');
		pskUI.children = pskItems;
	}
	pskItems.forEach((e) => e.remove());
};

// 페이지 리로드 없이 다시 스켈레톤 사용 할 경우 실행
pskUI.reload = function (userChild, scrollOpt) {
	if (typeof userChild == 'string') {
		var div = document.createElement('div');
		div.innerHTML = userChild.trim();
		pskUI.children = div.querySelectorAll(':scope > div');
	}
	pskUI.children.forEach((e) => document.querySelector('.psk-wrap').appendChild(e));
	document.querySelector('.psk-wrap').setAttribute('psk-status', '');
	if (!scrollOpt) {
		window.scrollTo({ top: 0 });
	}
};

// dom 요소를 지정해서 블럭 UI로 덮어버리기
pskUI.init = function (obj) {
	for (var i = 0; i < obj.length; i++) {
		obj[i].classList.add('psk-el');
	}
};

// dom 요소를 지정해서 텍스트에 흘러가는 로딩 효과 주기
pskUI.update = function (obj) {
	for (var i = 0; i < obj.length; i++) {
		obj[i].classList.add('psk-update');

		if (obj[i].textContent.search(this.emoji) >= 0) {
			var str = obj[i].innerHTML;
			obj[i].innerHTML = str.replaceAll(this.emoji, `<span class="emoji">$&</span>`);
		}
	}
};
pskUI.complete = function (obj) {
	var updateEls = obj ? obj : document.querySelectorAll('.psk-el, .psk-update');
	for (var i = 0; i < updateEls.length; i++) {
		updateEls[i].classList.remove('psk-el', 'psk-update');

		updateEls[i].innerHTML = updateEls[i].innerHTML
			.split('<span class="emoji">')
			.map((item) => {
				return item.search(this.emoji) > -1 ? item.replace('</span>', '') : item;
			})
			.join('');
	}
};

// 카카오톡 공유하기
/* ------------------------------------------------------------------------------------

	사용예시 :   @html  
				<button onclick="fnShareKakao(option_ex)">카카오톡 공유하기</button>

				-----------------------------------------------------------------------

				@script 
				var option_ex = {
					shareUrl : 'https://paybooc.co.kr/app/paybooc/Loan.do',
					shareImg : '/mobile/front/inc/images/common/header/logo_bc_paybooc.png',
					shareTitle : '페이북 홈',
					shareDescription : '부자되는 습관 페이북',
					shareBtnTitle : '대출보기'
				}
				
--------------------------------------------------------------------------------------- */

function fnShareKakao(arg_option) {
	//카카오 모듈 로딩
	// if(typeof Kakao !== "undefined" && Kakao.isInitialized() === false){
	// 	Kakao.init('d725448d024b24979468a3e534af908b');
	// }

	var option = {
		shareUrl: 'https://paybooc.co.kr/app/paybooc/Main.do', // 공유주소
		shareImg: `${com.getCdnUri}/static/assets/images/comm/appmove/app_logo_176.png`, //공유이미지
		shareTitle: '제목', //제목
		shareDescription: '설명', //설명글
		shareBtnTitle: '버튼', //버튼제목
	};
	$.extend(option, arg_option);

	// var resourceDomain = location.protocol + "//" + location.host;
	// let shareUrlAlcard = option.shareUrl;

	let shareUrlKakaoImage = '';
	if (option.shareImg.indexOf('cdn.paybooc.co.kr') > -1) {
		shareUrlKakaoImage = option.shareImg;
	} else {
		shareUrlKakaoImage = cdnUri + option.shareImg;
	}
	console.log(option);

	share.sendKakao({
		title: option.shareTitle,
		desc: option.shareDescription,
		imgUrl: option.shareImg,
		mWebUrl: option.shareUrl,
		webUrl: option.shareUrl,
		btns: [
			{
				title: option.shareBtnTitle,
			},
		],
	});

	// try {
	// 	Kakao.Link.sendDefault({
	// 		objectType : 'feed',
	// 		content : {
	// 			title : option.shareTitle,
	// 			description : option.shareDescription,
	// 			imageUrl : shareUrlKakaoImage,
	// 			link : {
	// 				mobileWebUrl : shareUrlAlcard,
	// 				webUrl : shareUrlAlcard
	// 			}
	// 		},
	// 		buttons:[{
	// 			title : option.shareBtnTitle,
	// 			link : {
	// 				mobileWebUrl : shareUrlAlcard,
	// 				webUrl : shareUrlAlcard
	// 			}
	// 		}],
	// 		installTalk:true
	// 	});
	// 	console.log('success');
	// } catch (e) {
	// 	console.error(e);
	// }
}

//dark mode img src replace
function fnColorSchmeInit() {
	if (!document.body.classList.contains('dp-mode')) return; // body.dp-mode 아니면 return
	var imgs = document.querySelectorAll('img');
	if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
		// dark mode
		imgs.forEach((img, idx) => {
			const regex = /^([\w\-]+-\d+-)l(\.png)$/;
			let src = img.src.split('/').pop();
			if (regex.test(src)) {
				const newSrc = src.replace(regex, '$1d$2');
				img.src = img.src.replace(src, newSrc);
			}
		});
	} else {
		// light mode
		imgs.forEach((img) => {
			const regex = /^([\w\-]+-\d+-)d(\.png)$/;
			let src = img.src.split('/').pop();
			if (regex.test(src)) {
				const newSrc = src.replace(regex, '$1l$2');
				img.src = img.src.replace(src, newSrc);
			}
		});
	}
}
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
	fnColorSchmeInit();
});

// init at time
function initAtTime(input, callback, reload) {
	// 객체의 키 중 누락된 값을 기본값으로 설정
	const { year = 2024, month = 1, day = 1, hour = 0, min = 0 } = input;
	const inputTime = new Date(year, month - 1, day, hour, min);
	let currentTime = new Date();

	if (fnGetPram('setEventTestDate')) {
		currentTime = new Date(fnGetPram('setEventTestDate'));
	}

	if (currentTime > inputTime) {
		callback();
	} else {
		const timeDifference = inputTime - currentTime;
		if (reload === true) {
			setTimeout(callback, timeDifference);
		}
	}
}
// 사용 예시
// initAtTime({ year: 2024, month: 11, day: 28, hour: 15, min: 30 }, () => {
// 	console.log("입력된 시간이 되었습니다! 콜백이 실행됩니다.");
// });

// 실험실
function collectLinksAndButtons() {
	let excludeStrings = ['#', 'appWebViewBack();', "window.location = 'app://menu=back_main';", 'appWebViewClose();', 'gobacktoApp()', 'javascript:gobacktoApp();', 'fnCloseSelect(this);', 'backtoAppMn();', 'closeDetailPopup();', 'history.back();'];
	const allLinks = [];
	const elements = document.querySelectorAll('a, button');
	elements.forEach((element) => {
		let textContent = element.textContent.trim();
		let href = element.getAttribute('href');
		let onclick = element.getAttribute('onclick');
		if (href && !href.includes('void') && href !== '#') {
			allLinks.push(`${textContent} : ${href}`);
		}
		if (onclick) {
			let exclude = excludeStrings.some((str) => onclick.includes(str));
			if (!exclude) {
				allLinks.push(`${textContent} : ${onclick}`);
			}
		}
	});
	console.log(allLinks);
	return allLinks;
}

// 딥링크 웹/앱 공통 사용
function fnDeepBtnEvent(address, id, option) {
	if (com.isInApp() === false) {
		//웹
		window.open(address, '_blank');
	} else {
		// 앱
		com.goNext(id, { option }, '', 'new');
	}
}

// component insert
function componentStaticInit(componentUrl, props = {}, callback = null) {
	const scriptElement = document.currentScript;
	const isAsync = props.async === true; // 기본값 false (동기)

	function loadSync(url) {
		const xhr = new XMLHttpRequest();
		xhr.open('GET', url, false);
		xhr.send(null);
		return xhr.responseText;
	}

	function loadAsync(url, callback) {
		fetch(url)
			.then((response) => response.text())
			.then((script) => callback(script))
			.catch((error) => console.error(`Error loading ${url}:`, error));
	}

	function processComponent(scriptCode, isAsyncMode) {
		try {
			const module = new Function('props', scriptCode);
			const html = module(props);

			if (isAsyncMode) {
				scriptElement.insertAdjacentHTML('beforebegin', html);
			} else {
				document.write(html);
			}
			scriptElement.remove();
			if (callback) callback();
		} catch (err) {
			console.error('Component loading failed:', err);
		}
	}

	if (isAsync) {
		loadAsync(componentUrl, (scriptCode) => processComponent(scriptCode, true));
	} else {
		processComponent(loadSync(componentUrl), false);
	}
}

// 스크롤 시 페이드업
function observeFadeUpItems(selector = 'fnFadeUpItem', bottomOffset = -120, activeClass = 'init', delayIncrement = 0.1) {
	const items = document.querySelectorAll('.' + selector);
	const rootMarginBase = '0px 0px 0px 0px';
	const rootMarginValue = `${rootMarginBase.split(' ')[0]} ${rootMarginBase.split(' ')[1]} ${bottomOffset}px ${rootMarginBase.split(' ')[3]}`;
	const observer = new IntersectionObserver((entries, observerInstance) => {
		const intersectingEntries = entries.filter(entry => entry.isIntersecting && !entry.target.classList.contains(activeClass));
		if (intersectingEntries.length > 0) {
			intersectingEntries.forEach((entry, index) => {
				const delay = index * delayIncrement;
				entry.target.style.animationDelay = `${delay}s`;
				entry.target.classList.add(activeClass);
				observerInstance.unobserve(entry.target);
				entry.target.addEventListener('animationend', () => {
					entry.target.style.animationDelay = '';
				}, { once: true });
			});
		}
	}, {
		root: null,
		rootMargin: rootMarginValue,
		threshold: 0
	});
	items.forEach(item => observer.observe(item));
}

// 버튼 로딩 중
function fnLoadingInButton(obj) {
	let target;
	if (!obj) { return; }
	if (obj instanceof HTMLElement) {
		target = obj;
	} else if (typeof obj === 'string') {
		target = document.querySelector(obj);
	}
	const html = `<span class="loading-in-button"><span class="dot"></span><span class="dot"></span><span class="dot"></span></span>`;
	target.insertAdjacentHTML('beforeend', html);
}

// 실험실 -----------------------------------------------
// 아래 내용은 운영기 반영 안함! 주의

// 동일한 내용을 source의 class들을 가져와서 채워넣기
async function fillElementsFromUrl(source) {
	// source 객체 = url (string), classname (array), callback (function), cloneScripts (boolen);
	try {
		const response = await fetch(source.url);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const html = await response.text();
		const parser = new DOMParser();
		const doc = parser.parseFromString(html, 'text/html');
		source.classname.forEach((selector, index) => {
			const sourceElements = doc.querySelectorAll(selector);
			const targetElements = document.querySelectorAll(selector);
			if (sourceElements.length === targetElements.length) {
				for (let i = 0; i < sourceElements.length; i++) {
					const currentElement = targetElements[i];
					currentElement.innerHTML = sourceElements[i].innerHTML;
					const scripts = currentElement.querySelectorAll('script');
					scripts.forEach((oldScript) => {
						const newScript = document.createElement('script');
						Array.from(oldScript.attributes).forEach((attr) => {
							newScript.setAttribute(attr.name, attr.value);
						});
						if (oldScript.innerHTML) {
							newScript.innerHTML = oldScript.innerHTML;
						}
						oldScript.parentNode.replaceChild(newScript, oldScript);
					});
				}
			} else {
				console.error(`Error: Number of elements with class '${selector}' does not match in source and target.`);
			}
			// 마지막 요소일 때 callback
			if (index === source.classname.length - 1 && source.callback && typeof source.callback === 'function') {
				source.callback();
			}
		});

		if(!source.cloneScripts) return;

		const sourceScripts = doc.querySelectorAll('body > script');
		sourceScripts.forEach((oldScript) => {
			const newScript = document.createElement('script');
			Array.from(oldScript.attributes).forEach((attr) => {
				newScript.setAttribute(attr.name, attr.value);
			});
			if (oldScript.innerHTML) {
				newScript.innerHTML = oldScript.innerHTML;
			}
			document.body.appendChild(newScript);
		});
	} catch (error) {
		console.error('Error fetching or processing URL:', error);
	}
}

// 클립보드 이미지를 페이지에 만들어 넣기
window.addEventListener('paste', function (e) {
	return;
	var item = Array.from(e.clipboardData.items).find((x) => /^image\//.test(x.type));
	if (!item) {
		console.log('not image type');
		return;
	}
	var blob = item.getAsFile();
	const imgSrc = URL.createObjectURL(blob),
		imgPos = 'center top',
		imgSize = '100% auto',
		imgOpc = '0.3',
		imgGray = false;
	overlayImage(imgSrc, imgPos, imgSize, imgOpc, imgGray);
	console.log('1px 아래로 : ↓,  1px 위로 : ↑\n10px 아래로 : Shift + ↓,  10px 위로 : Shift + ↑\n100px 아래로 : Ctrl + ↓,  100px 위로 : Ctrl + ↑');

	//add short cut for move image
	document.addEventListener('keydown', (event) => {
		const overlay = document.querySelector('.custom-overlay');
		if (!overlay) return;
		let currentY = parseInt(getComputedStyle(overlay).backgroundPositionY, 10) || 0;
		let increment = 0;
		// 기본 이동 거리 설정
		if (event.key === 'ArrowUp') increment = -1;
		if (event.key === 'ArrowDown') increment = 1;
		// Shift 키 조합
		if (event.shiftKey) increment *= 10;
		// Ctrl(CtrlKey) 또는 Command(MetaKey) 키 조합
		if (event.ctrlKey || event.metaKey) increment *= 100;
		if (increment !== 0) {
			overlay.style.backgroundPositionY = `${currentY + increment}px`;
			event.preventDefault(); // 기본 동작 방지
		}
	});
});

// Function to overlay the image on the page
function overlayImage(base64Image, bgPosition, bgSize, opacity, grayscale) {
	const overlay = document.createElement('div');
	const body = document.body;
	const html = document.documentElement;
	const bodyHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
	const filter = grayscale ? 'filter: grayscale(1);' : '';
	const overlayStyle = `background-image: url(${base64Image}); background-size: ${bgSize}; background-position: ${bgPosition}; background-repeat: no-repeat; height: ${bodyHeight}px; opacity: ${opacity}; ${filter} position: absolute; top: 0; left: 0; width: 100%; min-height: 100vh; pointer-events: none; z-index: 9999;`;

	// Remove any existing overlay
	document.querySelectorAll('body > .custom-overlay').forEach((el) => el.remove());
	overlay.setAttribute('style', overlayStyle);
	overlay.classList.add('custom-overlay');
	document.body.appendChild(overlay);
}
