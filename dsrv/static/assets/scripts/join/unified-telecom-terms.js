function fnWebViewBack(){
    window.location='app://menu=back_main&target=main';
}


// 약관
function fnOpenTermsView(terms_url) {
    var $termsContainer = $('.terms-area');

    //  기존 iframe 완전 제거 (잔상 방지 핵심)
    $termsContainer.find('.terms-frame').remove();

    //  새 iframe 생성 (항상 새 레이어)
    var $iframe = $('<iframe>', {
        class: 'terms-frame',
        src: terms_url + '?t=' + new Date().getTime(), // 캐싱 방어
        width: '100%',
        height: '100%',
        frameborder: '0'
    });
    $termsContainer.append($iframe);

    //  iframe 로드 후 부모로 포커스 되돌림 (두번 클릭 방지 핵심)
    $iframe.on('load', function () {
        setTimeout(function () {
            if (document.activeElement) {
                document.activeElement.blur();
            }
            document.body.setAttribute('tabindex', '-1');
            document.body.focus();
        }, 50);
    });
}


// 닫기버튼
$(document).on('click touchend', '.terms-detail .btn-close', function () {
    var $frame = $('.terms-area .terms-frame');
    if ($frame.length) {
        //  iframe 포커스 제거
        if (document.activeElement) {
            document.activeElement.blur();
        }

        //  먼저 blank 처리 (iOS 레이어)
        $frame.attr('src', 'about:blank');

        //  약간 딜레이 후 제거 (렌더 안정화)
        setTimeout(function () {
            $frame.remove();
        }, 50);
    }
});

// 텝메뉴
$(document).ready(function(){
    $('.tab-menu1 .active').click();

    $('.tab-menu1 a').on('click',function(){
        var name = $(this).attr('daps-name');
        var target = $(".tab-menu2[daps-name='" + name + "']");
        $(".tab-menu2").hide();
        if(target.length > 0){
            $(".tab-menu2[daps-name='" + name + "']").show();
            $(".tab-menu2[daps-name='" + name + "'] a").eq(0).click();
        }
        $(this).addClass('active').siblings('a').removeClass('active');
    });

    $('.tab-menu2 a').on('click',function(){
        $(this).addClass('active').siblings('a').removeClass('active');
    });
});