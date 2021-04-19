function delay(ms) {
    return new Promise(function(resolve, reject) {
        setTimeout(function(){
            resolve();
        },ms);
    });
}
var clickContentFlag = true;
function clickContentTitle() {
    if(clickContentFlag) {
        clickContentFlag = false;
        $('.book-toc #toc').slideToggle(300, 'linear', function() {
            var title = $('.book-toc>p>span#toggle');
            if(title.hasClass('open')) {
                title.html("&#xf103;");
                title.removeClass('open');
            } else {
                title.html("&#xf102;");
                title.addClass('open');
            }
            clickContentFlag = true;
        });
    }
}
function makeToc() {
    var $toc = $("#toc");
    if($('#auto-toc-yn').val() && $toc.length == 0) {
        var titleLength = $('.tt_article_useless_p_margin h2,h3,h4').length - $('.another_category h4').length - $('h3.tit_list_type').length;
        var firstContent = $('.tt_article_useless_p_margin').children().eq(0);
        if(titleLength > 0 && firstContent.length > 0) {
            firstContent.before('<div class="book-toc"><p>목차<span id="toggle" style="padding-left:10px;">&#xf103;</span></p><ul id="toc"></ul></div>');
            $toc = $("#toc");
        }
    }
    if($toc.length > 0) {
        if($('#fold-toc-yn').val()) {
            $toc.css('display','none');
        }
        $toc.toc({content: ".tt_article_useless_p_margin", headings: "h2,h3,h4"});
        $('.book-toc p').append('<span id="toggle" style="padding-left:10px;">&#xf103;</span>');
        if($('.another_category').length > 0) {
            $toc.find('li:last').remove();
        }
        makeClipboardLink();
    }

    $('.book-toc p').off('click').on('click', function(){
        clickContentTitle();
    });

    $('.book-toc p').off('touchend').on('touchend', function(event){
        clickContentTitle();
    });
}

var floatingTocNew = $('.floating-toc-new');
var bookToc = $('.book-toc');
var contentMiddleYn = $('#content-middle-yn').val();
var animating = false;
var timer = 0;
var clickFloatingFlag = true;
function clickFloatingTitle() {
    if(clickFloatingFlag) {
        clickFloatingFlag = false;
        floatingTocNew.css('height','');
        $('.floating-toc-new #toc').css('display','');
        // 여유공간이 있을 경우
        if((contentMiddleYn && (window.innerWidth-$('.content-wrapper').outerWidth())/2 > 250)
          ||(!contentMiddleYn && window.innerWidth-$('.content-wrapper').outerWidth() > 250)) {
            $('#toc-body').slideToggle(300, 'linear', function() {
                var title = $('#toc-title>p>span#toggle');
                if(title.hasClass('close')) {
                    title.html("&#xf102;");
                    title.removeClass('close');
                } else {
                    title.html("&#xf103;");
                    title.addClass('close');
                }
                clickFloatingFlag = true;
            });
        // 여유공간이 없을 경우
        } else {
            var title = $('#toc-title>p>span#toggle');
            if(!title.hasClass('close')) {
                floatingTocNew.css('width','80%');
                floatingTocNew.css('max-width','250px');
            }
            $('#toc-body').slideToggle(300, 'linear', function() {
                if(title.hasClass('close')) {
                    title.html("&#xf102;");
                    title.removeClass('close');
                    floatingTocNew.css('width','50px');
                } else {
                    title.html("&#xf103;");
                    title.addClass('close');
                }
                clickFloatingFlag = true;
            });
        }
    }
}
function checkContentPosition() {
    var titleList = $('.tt_article_useless_p_margin').find('h2,h3,h4');
    var scrollY = window.scrollY + 50 + ($('#fixed-header').val()?($('header').length>0?$('header').height()+5:0):0);
    if(titleList.length > 1) {
        for(var i=0; i < titleList.length; i++) {
            var tocList = $('.floating-toc-new #toc').find('a');
            if(i < titleList.length-1) {
                if(titleList.eq(i).offset().top < scrollY && titleList.eq(i+1).offset().top > scrollY) {
                    tocList.removeAttr('class');
                    tocList.parent().removeAttr('class');
                    tocList.eq(i).addClass('floating-toc-title-ani');
                    tocList.eq(i).addClass('selected');
                    break;
                }
            } else {
                if(titleList.eq(i).offset().top < scrollY) {
                    tocList.removeAttr('class');
                    tocList.parent().removeAttr('class');
                    tocList.eq(i).addClass('floating-toc-title-ani');
                    tocList.eq(i).addClass('selected');
                    break;
                }
            }
        }
    }
}

function makeFloatingToc() {
    if(bookToc.length > 0) {
        var tocTitle = $('<div id="toc-title"><p>목차<span id="toggle" style="padding-left:5px;">&#xf102;</span></p></div>');
        floatingTocNew.append(tocTitle);
        var tocBody = $('<div id="toc-body""></div>').append(bookToc.find('#toc').clone());
        floatingTocNew.append(tocBody);

        $('#toc-title').off('click').on('click', function(){
            clickFloatingTitle();
        });

        $('#toc-title').off('touchend').on('touchend', function(){
            clickFloatingTitle();
        });

        //목차 항목 클릭
        $('#toc-body').find('a').off('click').on('click', function(){
            checkPosition();
        });
    }
}
function appendTocNew() {
    if(bookToc.length > 0) {
        if((contentMiddleYn && (window.innerWidth-$('.content-wrapper').outerWidth())/2 > 250)
          ||(!contentMiddleYn && window.innerWidth-$('.content-wrapper').outerWidth() > 250)) {
            if(window.scrollY > bookToc.outerHeight() + bookToc.offset().top - $('header').height()) {
                if(!animating) {
                    animating = true;
                    $('.floating-toc-new #toc').css('display','');
                    $('#toc-body').css('display','');
                    floatingTocNew.css('display','');
                    floatingTocNew.css('width','');
                    floatingTocNew.css('max-width','');
                    floatingTocNew.css('top','');
                    floatingTocNew.css('margin-right','');
                    var title = $('#toc-title>p>span#toggle');
                    if(title.hasClass('close')) {
                        title.html("&#xf102;");
                        title.removeClass('close');
                    }
                    floatingTocNew.animate({
                        'opacity': '1.0', 'height': ($('#toc-title').height()+$('#toc-body').height()+10)+'px'
                    }, 500);
                    if($('#fixed-header').val()) {
                        floatingTocNew.css('top',($('header').height()+15)+'px');
                    } else {
                        floatingTocNew.css('top','50px');
                    }
                }
            } else {
                if(animating) {
                    animating = false;
                    floatingTocNew.animate({
                        'opacity': '0.0', 'height': '1px'
                    }, 500);
                }
            }
        } else {
            var title = $('#toc-title>p>span#toggle');
            if(window.scrollY > bookToc.outerHeight() + bookToc.offset().top - $('header').height()) {
                if(!animating) {
                    animating = true;
                    floatingTocNew.css('display','');
                    if(!title.hasClass('close')) {
                        title.html("&#xf103;");
                        $('#toc-body').css('display','none');
                        floatingTocNew.css('width','50px');
                        floatingTocNew.css('height','20px');
                        floatingTocNew.css('margin-right','0px');
                        floatingTocNew.css('margin-left','0px');
                        floatingTocNew.css('opacity','0.9');
                        if($('#fixed-header').val()) {
                            floatingTocNew.css('top',($('header').height()+8)+'px');
                        } else {
                            floatingTocNew.css('top','50px');
                        }
                    }
                }
            } else {
                if(animating) {
                    animating = false;
                    floatingTocNew.css('display','none');
                    if(title.hasClass('close')) {
                        title.html("&#xf102;");
                        title.removeClass('close');
                        $('#toc-body').css('display','');
                    }
                }
            }
        }

        if(floatingTocNew.height() > floatingTocNew.find('#toc-title').height()) {
            checkContentPosition();
        }
    }
}

var safeFlag = true;
function appendToc() {
    var bookToc = $('.book-toc');
    var floatingToc = $('.floating-toc');

    // 목차 클릭
    var clickFlag = true;
    function clickTitle(type) {
        if(clickFlag) {
            clickFlag = false;
            if (floatingToc.hasClass('noclick')) {
                floatingToc.removeClass('noclick');
            } else {
                if(dragTimerId !== 0) {
                    clearTimeout(dragTimerId);
                    dragTimerId = 0;
                }
                floatingToc.css('transition', '');
                var title = $('#toc-title>p>span#toggle');
                if(title.hasClass('open')) {
                    $('#toc-title').css('padding', '10px 0 0 0');
                    floatingToc.css('padding', '0 10px 0');
                    floatingToc.css('border-radius', '0');
                    floatingToc.css('opacity', '0.9');
                    floatingToc.removeClass('floating-toc-header-ani');
                }

                setTimeout(function(){
                    $('#toc-body').slideToggle(300, 'linear', function() {
                        if(title.hasClass('close')) {
                            floatingToc.css('transition', '');
                            title.text("펼치기");
                            title.removeClass('close');
                            title.addClass('open');
                            floatingToc.css('padding', '0');
                            $('#toc-title').css('padding', '10px');
                            floatingToc.css('border-radius', '10px');
                            floatingToc.css('opacity', '0.7');
                            floatingToc.addClass('floating-toc-header-ani');
                            //목차 아이콘으로 표시
                            if(window.innerWidth < 768) {
                                tocTitle.find('p').css('display','none');
                                tocTitle.find('.floating-icon').css('display','block');
                            }
                        } else {
                            if(type === 'init') {
                                var floatingTocInnerWidth = floatingToc.innerWidth();
                                var windowWidth = $(window).innerWidth();
                                if(floatingToc.innerHeight() > $(window).innerHeight() || floatingTocInnerWidth > windowWidth) {
                                    floatingToc.css('display', 'none');
                                } else {
                                    if($('#floating-toc-position').val()) {
                                        floatingToc.css('left','');
                                        floatingToc.css('right','0');
                                    }
                                    floatingToc.css('opacity', '0.0');
                                    setTimeout(function() {
                                        if($('.content-wrapper').offset().left - 20 > floatingTocInnerWidth) {
                                            if($('#floating-toc-position').val()) {
                                                floatingToc.css('left', '');
                                                floatingToc.css('right', ($('.content-wrapper').offset().left - floatingTocInnerWidth - 20) + "px");
                                            } else {
                                                floatingToc.css('left', ($('.content-wrapper').offset().left - floatingTocInnerWidth - 20) + "px");
                                            }
                                            floatingToc.css('opacity', '0.9');
                                            floatingToc.css('transition', "0.7s linear");
                                            setTimeout(function() {
                                                floatingToc.css('transition', "");
                                            }, 800);
                                        } else {
                                            if($('.menu').css('display') == 'none') {
                                                floatingToc.css('right', "20px");
                                                floatingToc.css('left', "");
                                            } else {
                                                floatingToc.css('left', "20px");
                                                floatingToc.css('right', "");
                                            }
                                        }
                                    }, 500);
                                    smoothScroll();
                                }
                            }
                            title.text("접기");
                            title.removeClass('open');
                            title.addClass('close');
                            //목차 아이콘으로 표시
                            if(window.innerWidth < 768) {
                                tocTitle.find('p').css('display','block');
                                tocTitle.find('.floating-icon').css('display','none');
                            }
                        }
                    });
                },200);
            }
            setTimeout(function(){
                clickFlag = true;
            }, 500);
        }
    }

    function checkPosition() {
        var titleList = $('.tt_article_useless_p_margin').find('h2,h3,h4');
        var scrollY = window.scrollY + 50;
        if(titleList.length > 1) {
            for(var i=0; i < titleList.length; i++) {
                var tocList = $('.floating-toc #toc').find('a');
                if(i < titleList.length-1) {
                    if(titleList.eq(i).offset().top < scrollY && titleList.eq(i+1).offset().top > scrollY) {
                        tocList.removeAttr('class');
                        tocList.parent().removeAttr('class');
                        tocList.eq(i).addClass('floating-toc-title-ani');
                        tocList.eq(i).addClass('selected');
                        break;
                    }
                } else {
                    if(titleList.eq(i).offset().top < scrollY) {
                        tocList.removeAttr('class');
                        tocList.parent().removeAttr('class');
                        tocList.eq(i).addClass('floating-toc-title-ani');
                        tocList.eq(i).addClass('selected');
                        break;
                    }
                }
            }
        }
    }

    function checkValidation() {
        if(floatingToc.css('bottom').substr(0,1) == '-') {
            floatingToc.css('bottom','10px');
            floatingToc.css('top','');
        }
        if(floatingToc.css('right').substr(0,1) == '-') {
            floatingToc.css('right','10px');
            floatingToc.css('left','');
        }
        if(floatingToc.css('top').substr(0,1) == '-') {
            floatingToc.css('top','10px');
        }

        if(floatingToc.css('left').substr(0,1) == '-') {
            floatingToc.css('left','10px');
        }
        if(floatingToc.attr('style').indexOf('bottom:') > 0 && floatingToc.attr('style').indexOf('top:') > 0) {
            floatingToc.css('top','');
        }
        if(floatingToc.attr('style').indexOf('left:') > 0 && floatingToc.attr('style').indexOf('right:') > 0) {
            floatingToc.css('left','');
        }
    }

    function restoreBookToc() {
        floatingToc.find('.selected').removeAttr('class');
        bookToc.append(floatingToc.find('#toc'));
        bookToc.removeAttr('style');
        floatingToc.find('div').remove();
        floatingToc.removeAttr('style');
        floatingToc.css('display','none');
        $('#toc').find('a').removeClass('floating-toc-title-ani');
    }

    if(bookToc.length > 0 && window.scrollY > bookToc.offset().top + bookToc.innerHeight()) {
        if(floatingToc.height() === 0 && $('#toc-title').length === 0 && safeFlag) {
            safeFlag = false;
            floatingToc.css('display','block');
            var tocTitle = $('<div id="toc-title"><div class="floating-icon"></div><p>목차 <span id="toggle" class="open" style="color:#517135;">펼치기</span></p></div>');
            //목차 아이콘으로 표시
            if(window.innerWidth < 768) {
                tocTitle.find('p').css('display','none');
            } else {
                tocTitle.find('.floating-icon').css('display','none');
            }
            floatingToc.append(tocTitle);
            var tocBody = $('<div id="toc-body" style="display:none;"></div>').append(bookToc.find('#toc').clone());
            floatingToc.append(tocBody);
            floatingToc.find('#toc').css('display','');
            floatingToc.css('padding', '0');
            $('#toc-title').css('padding', '10px');
            var dragTimerId = 0;
            $.getScript("https://code.jquery.com/ui/1.12.1/jquery-ui.min.js", function() {
                $.getScript("https://cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.3/jquery.ui.touch-punch.min.js", function() {
                    floatingToc.draggable({
                        handle: "#toc-title",
                        start: function(event, ui) {
                            floatingToc.css('right', '');
                            floatingToc.css('bottom', '');
                            var self = this;
                            dragTimerId = setTimeout(function(){
                                var $self = $(self);
                                $self.addClass('noclick');
                            }, 250);
                        },
                        stop: function(event, ui) {
                            checkValidation();
                        }
                    });
                });
            });

            floatingToc.css('position', "fixed");
            floatingToc.css('top', "15px");

            $('#toc-title').off('click').on('click', function(){
                clickTitle();
            });

            $('#toc-title').off('touchend').on('touchend', function(event){
                clickTitle();
            });

            //목차 항목 클릭
            $('#toc-body').find('a').off('click').on('click', function(event){
                checkPosition();
            });
            $('#toc-body').find('a').off('touchstart').on('touchstart', function(event){
                floatingToc.draggable('disable');
            });
            $('#toc-body').find('a').off('touchend').on('touchend', function(event){
                setTimeout(function(){
                    floatingToc.draggable('enable');
                }, 200);
                checkPosition();
            });

            floatingToc.css('visibility', 'hidden');
            clickTitle('init');
            setTimeout(function(){
                if($('.content-wrapper').offset().left < $('.floating-toc').width() + 50) {
                    clickFlag = true;
                    clickTitle();
                }
            }, 500);
            setTimeout(function(){
                floatingToc.css('visibility', '');
                safeFlag = true;
            }, 1100);			
        } else {
            checkPosition();
            checkValidation();
        }
    } else {
        restoreBookToc();
    }
}

function copyTitleToClipboard(titleIndex) {
    var tocLink = $('#toc a');
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = tocLink.eq(titleIndex).prop('href');
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
    showToast("제목 링크가 복사되었습니다!");
}

function makeClipboardLink() {
    var tocLink = $('#toc a');
    tocLink.each(function(i, aLink) {
        var regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
        var titleId = decodeURIComponent(aLink.href.substr(aLink.href.indexOf('#')+1)).replace(regExp,"\\$&");
        var titleElem = $('#'+titleId);
        titleElem.append('<button style="width:25px;height:25px;margin-left:10px;font-size:0.8em;font-family:Font_Awesome_5_Free;color:#5a8634;" onclick="copyTitleToClipboard('+i+')">\uf0c1</button>');
    });
}

var repeatCnt = 0;
var smoothScrollTimer = 0;
var currentPosition = null;
function smoothScroll() {
    $('a:not(.lb-prev, .lb-next, .lb-close)').off().on('click', function () {
        var self = this;
        var aHref = $.attr(self, 'href');
        var windowTop = $(window).scrollTop();
        var offsetTop = 0;
        var moveFlag = false;
        var headerHeight = $('#fixed-header').val()?($('header').length>0?$('header').height()+5:0):0;
        
        if(typeof aHref !== 'undefined' && aHref.length > 1 && aHref.indexOf('#') > -1) {
            var regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
            offsetTop = $('#' + aHref.substr(1).replace(regExp,"\\$&")).offset().top;
            moveFlag = true;
        }

        if($(self).hasClass('move-top-btn')) {
            moveFlag = true;
        }

        if(currentPosition != (offsetTop - headerHeight)) {
            clearTimeout(smoothScrollTimer);
            smoothScrollTimer = 0;
        }

        if(moveFlag) {
            var distance = Math.abs(windowTop - offsetTop - headerHeight);
            var calcSpeed = 400*distance/2000;
            var speed = calcSpeed<300?300:(calcSpeed>800?800:calcSpeed);
            $('html, body').animate({
                scrollTop: offsetTop - headerHeight
            }, speed, 'swing');
            smoothScrollTimer = setTimeout(function() {
                if(repeatCnt < 3 && offsetTop != 0) {
                    $(self).click();
                    repeatCnt++;
                    currentPosition = offsetTop;
                } else {
                    repeatCnt = 0;
                    smoothScrollTimer = 0;
                    currentPosition = null;
                }
            }, speed);

            if(aHref.indexOf('#') > -1
              && ($(self).parent().parent().parent().prop('id') == 'toc-body'
              || $(self).parent().parent().parent().parent().parent().prop('id') == 'toc-body'
              || $(self).parent().parent().parent().parent().parent().parent().parent().prop('id') == 'toc-body')
              && ((contentMiddleYn && (window.innerWidth-$('.content-wrapper').outerWidth())/2 <= 250)
              ||(!contentMiddleYn && window.innerWidth-$('.content-wrapper').outerWidth() <= 250))) {
                clickFloatingTitle();
            }

            return false;
        }
    });
}

var msgTimer = 0;
function showToast(msg, slot) {
    clearToast();

    var toast = $('#toast');

    if(slot == 'top') {
        toast.css('top', '33px');
        toast.css('bottom', '');
    } else if(slot == 'bottom') {
        toast.css('top', '');
        toast.css('bottom', '-13px');
    } else {
        toast.css('top', '50%');
        toast.css('bottom', '');
    }

    toast.children().html(msg);
    setTimeout(function() {
        toast.fadeIn(500, function() {
            msgTimer = setTimeout(function() {
                toast.fadeOut(500);
            }, 1000);
        });
    }, 200);
}

function clearToast() {
    if(msgTimer != 0) {
        clearTimeout(msgTimer);
        msgTimer = 0;
    }
}

function progressBarVertical() {
    var scrollTop = $(window).scrollTop();
    var likeButton = $('.container_postbtn');
    var likeButtonPosition = likeButton.length>0?likeButton.offset().top:0;
    var currentPosition = likeButtonPosition==0?0:(likeButtonPosition>$(window).innerHeight()?(scrollTop/(likeButtonPosition-$(window).innerHeight())):1);
    var $pbv = $('.progress-bar-vertical');
    var adjustLeftOffset = (window.innerWidth > 768)?5:0;

    $pbv.css('height',((currentPosition>1?1:currentPosition)*100)+'%');
    $pbv.css('left',($('.content-wrapper').offset().left-adjustLeftOffset)+'px');
    $pbv.css('opacity',0.8-(0.5*(currentPosition>1?1:currentPosition)));
}

function progressBarHorizontal() {
    var scrollTop = $(window).scrollTop();
    var likeButton = $('.container_postbtn');
    var likeButtonPosition = likeButton.length>0?likeButton.offset().top:0;
    var currentPosition = likeButtonPosition==0?0:(likeButtonPosition>$(window).innerHeight()?(scrollTop/(likeButtonPosition-$(window).innerHeight())):1);
    var $pbh = $('.progress-bar-horizontal');

    $pbh.css('width',((currentPosition>1?1:currentPosition)*100)+'%');
    $pbh.css('opacity',0.8-(0.5*(currentPosition>1?1:currentPosition)));
}

function progressBarEtcVertical() {
    var scrollTop = $(window).scrollTop();
    var scrollHeight = $('body').prop('scrollHeight');
    var likeButton = $('.container_postbtn');
    var likeButtonPosition = likeButton.length>0?likeButton.offset().top:0;
    var adjustBottomPosition = (window.innerWidth > 768)?0:100; 
    var currentPosition = 1 - (scrollHeight-scrollTop-$(window).innerHeight()-adjustBottomPosition)/(scrollHeight-likeButtonPosition);
    var $pbev = $('.progress-bar-etc-vertical');
    var adjustLeftOffset = (window.innerWidth > 768)?0:5;

    $pbev.css('height',(likeButtonPosition>0?currentPosition*100:0)+'%');
    $pbev.css('left',($('.content-wrapper').innerWidth()+$('.content-wrapper').offset().left-adjustLeftOffset)+'px');
    $pbev.css('opacity',0.8-(0.5*currentPosition));
}

function progressBarEtcHorizontal() {
    var scrollTop = $(window).scrollTop();
    var scrollHeight = $('body').prop('scrollHeight');
    var likeButton = $('.container_postbtn');
    var likeButtonPosition = likeButton.length>0?likeButton.offset().top:0;
    var adjustBottomPosition = (window.innerWidth > 768)?0:100; 
    var currentPosition = 1 - (scrollHeight-scrollTop-$(window).innerHeight()-adjustBottomPosition)/(scrollHeight-likeButtonPosition);
    var $pbeh = $('.progress-bar-etc-horizontal');

    $pbeh.css('width',(likeButtonPosition>0?currentPosition*100:0)+'%');
    $pbeh.css('opacity',0.8-(0.5*currentPosition));
}

function foldReply(elem) {
    if(document.location.href.indexOf('#comment') < 0) {			
        var $elem = $(elem);
        var reply = $('div.comment-list>ul>li#'+$elem.attr('id')+'>ul>li');
        for(var i=0;i<reply.length-Number($('#fold-comment-num').val());i++) {
            reply.eq(i).css('display','none');
        }
        var pElem = $elem.find('p').eq(0);
        if(pElem.find('div').length > 0) {
            $elem.find('p').eq(0).find('div').remove();
        }
        var moreButton = '<div onclick="unfoldReply(this)" class="more-reply">'+ (reply.length-Number($('#fold-comment-num').val())) + '개 이전 댓글 보기' +'</div>';
        pElem.append(moreButton);
    }
}
function unfoldReply(elem) {
    var $elem = $(elem).parent().parent();
    var reply = $('div.comment-list>ul>li#'+$elem.attr('id')+'>ul>li');
    for(var i=0;i<reply.length-Number($('#fold-comment-num').val());i++) {
        reply.eq(i).css('display','block');
    }
    $elem.find('p').eq(0).find('div').remove();
}
function initFoldReply() {
    if($('#fold-comment-yn').val()) {
        var commentList = $('article').find('.inner').find('.comment-list>ul>li');
        if(commentList.length > 0) {
            for(var i=0;i<commentList.length;i++) {
                var reply = commentList.eq(i).find('ul>li');
                if(reply.length > Number($('#fold-comment-num').val())) {
                    foldReply(commentList[i]);
                }
            }
        }
    }
}

function commentAutoLink() {
    (function() {
        var autoLink,
                slice = [].slice;

        autoLink = function() {
            var callback, k, linkAttributes, option, options, pattern, v;
            options = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            pattern = /(^|[\s\n]|<[A-Za-z]*\/?>)((?:https?|ftp):\/\/[\-A-Z0-9+\u0026\u2019@#\/%?=()~_|!:,.;]*[\-A-Z0-9+\u0026@#\/%=~()_|])/gi;
            if (!(options.length > 0)) {
                return this.replace(pattern, "$1<a class='auto-link' href='$2'>$2</a>");
            }
            option = options[0];
            callback = option["callback"];
            linkAttributes = ((function() {
                var results;
                results = [];
                for (k in option) {
                    v = option[k];
                    if (k !== 'callback') {
                        results.push(" " + k + "='" + v + "'");
                    }
                }
                return results;
            })()).join('');
            return this.replace(pattern, function(match, space, url) {
                var link;
                link = (typeof callback === "function" ? callback(url) : void 0) || ("<a class='auto-link' href='" + url + "'" + linkAttributes + ">" + url + "</a>");
                return "" + space + link;
            });
        };

        String.prototype['autoLink'] = autoLink;

    }).call(this);

    var commentList = $('div.comment-list>ul>li>p');
    var replyList = $('div.comment-list>ul>li>ul>li>p');
    for(var i=0; i < commentList.length; i++) {
        commentList[i].innerHTML = commentList[i].innerHTML.autoLink({ target: "_blank" });
    }
    for(var j=0; j < replyList.length; j++) {
        replyList[j].innerHTML = replyList[j].innerHTML.autoLink({ target: "_blank" });
    }
}

var fontSize = 1;
function changeFontSize(type) {
    if(type === '') {
        $('article').removeAttr('style');
        fontSize = 1;
        return false;
    }
    if(type === '+') {
        if(fontSize < 5) {
            fontSize += 0.05;
        } else {
            fontSize = 5;
        }
    } else if(type === '-') {
        if(fontSize > 0.6) {
            fontSize -= 0.05;
        } else {
            fontSize = 0.6;
        }
    }
    $('article').attr('style', 'font-size: '+fontSize+'em !important');
    $('.change-font-btn').blur();
}
            
function commentControl(){
    $(document).on("click", ".comments .comment-list ul li .author-meta .control button", function(){
        if ( $(this).siblings(".link").is(":hidden") ){
            $(".comments .link").removeAttr("style");
            $(this).siblings(".link").show();
        } else {
            $(this).siblings(".link").hide();
        }
    });

    $(document).on("keyup", function(e){
        if ( e.keyCode == '27' ){
            $(".comment-list ul li .author-meta .control .link").removeAttr("style");
        }
    });
}

function removeDimmed(){
    $("#dimmed").remove();
    $('section').css('z-index','110');
}

function darkModeAfterTranslate(type) {
    delay(200).then(function() {        
        repeatCnt++;
        if(repeatCnt > 10) {
            repeatCnt = 0;
        } else if($('#toc font').length > 0 && $('#toc font').attr('style').indexOf('color: white') == -1) {
            darkMode(type);
            repeatCnt = 0;
        } else {
            darkModeAfterTranslate(type);
        }
    });
}
function doGTranslateCustom(param) {
    if(param == 'ko|ko' && localStorage.getItem('translate') == 'y') {
        localStorage.setItem('translate', 'n');
    } else {
        localStorage.setItem('translate', 'y');
    }
    doGTranslate(param);
    setTimeout(function(){
        if(window.innerWidth < 1080) {
            $('button.close').focus();
            $('button.close').click();
        }
        if(localStorage.getItem('dark-mode') == 'y' && localStorage.getItem('translate') == 'y') {
            darkModeAfterTranslate('+');
        }
    }, 500);
}

function makeBell() {
    if($('#make-bell-yn').val()) {
        if(location.href.indexOf('notice') < 0) {
            var bubbleTag = '<div class="like_bubble"><span class="bubble_image"></span><div class="inner">'+$('#make-bell').val()+'</div></div>';
            $(bubbleTag).insertBefore($('.container_postbtn').children().eq(0));
        }
    }
}

function toastAfterLike() {
    if($('#toast-after-like-yn').val()) {
        $('button.btn_post.uoc-icon').on('click',function(){
            setTimeout(function() {
                if($('button.btn_post.uoc-icon>div.like_on').length > 0) {
                    showToast($('#toast-after-like').val());
                }
            }, 500);
        });
    }
}

function common(){
    var $profile = $(".top-button .profile");
    var $menu = $(".top-button .menu");

    $profile.on("click", "button", function(){
        if ( $(this).siblings("nav").is(":hidden") ){
            $(this).siblings("nav").show();
        } else {
            $(this).siblings("nav").hide();
        }
    });

    $profile.on("mouseleave", function(){
        $(this).find("nav").hide();
    });

    if ( window.T && window.T.config.USER.name ){
        $profile.find(".login").hide();
        $profile.find(".logout").show();
    } else {
        $profile.find(".login").show();
        $profile.find(".logout").hide();
    }

    $profile.on("click", ".login", function(){
        document.location.href = 'https://www.tistory.com/auth/login?redirectUrl=' + encodeURIComponent(window.TistoryBlog.url);
    });
    $profile.on("click", ".logout", function(){
        document.location.href = 'https://www.tistory.com/auth/logout?redirectUrl=' + encodeURIComponent(window.TistoryBlog.url);
    });
    
    var updateFlag = true;
    $('.comment-content, span.count > span').bind('DOMSubtreeModified', function () { //.comment-content, span.count > span DOMNodeInserted DOMNodeRemoved DOMSubtreeModified
        if(updateFlag){
            updateFlag = false;
            setTimeout(function(){
                commentAutoLink();
                initFoldReply();
                if(localStorage.getItem('dark-mode') == 'y') {
                    darkMode('+');
                }
                updateFlag = true;
            }, 500);
        }
    });
    
    $menu.on("click", function(){
        if ( $("body").hasClass("mobile-menu") ){
            $("body").removeClass("mobile-menu");
            if ( $("#dimmed").length ) removeDimmed();
        } else {
            $("body").addClass("mobile-menu");
            $("body").append('<div id="dimmed"/>');
            $('section').css('z-index','');
            if ( !$(".sidebar .profile").length ){
                $(".sidebar").append('<div class="profile" /><button type="button" class="close">닫기</button>');
                $profile.find("ul").clone().appendTo(".sidebar .profile");
            }
            if(localStorage.getItem('dark-mode') == 'y') {
                darkMode('+');
            }
            fixedRecommendAds('init');
        }
    });

    $('.postbtn_like .wrap_btn.wrap_btn_etc button').on("click", function() {
        setTimeout(function() {
            if(localStorage.getItem('dark-mode') == 'y') {
                darkMode('+');
            }
        }, 200);
    });
    
    $(document).on("click", "#dimmed, .sidebar .close", function(){
        $("body").removeClass("mobile-menu");
        if ( $("#dimmed").length ) removeDimmed();
    });

    if(localStorage.getItem('dark-mode') == 'y') {
        darkMode('+');
        if(localStorage.getItem('translate') == 'y') {
            darkModeAfterTranslate('+');
        }
    }
}

function updateTagsAttr() {
    //이미지에 alt 태그 부여
    var $titleList = $('.content-title .inner h1, .tt_article_useless_p_margin h2, h3, h4');
    var titleListLength = $titleList.length - 2;
    var $images = $('.tt_article_useless_p_margin').find('img');
    var cnt = 0;
    var limitCnt = 0;
    var title, title1, title2, title3, title4;
    title1 = $titleList.eq(0).text();
    $images.each(function(idx, img) {
        var $img = $(img);
        if(!$img.attr('alt') || !$img.attr('title')) {
            var checkFlag = false;
            while(!checkFlag){
                if(cnt <= titleListLength) {
                    if(cnt === titleListLength || ($titleList.eq(cnt).offset().top < $img.offset().top && $titleList.eq(cnt+1).offset().top > $img.offset().top)) {
                        if($titleList.eq(cnt).prop('tagName') === 'H1') {
                            title = title1;
                        } else if($titleList.eq(cnt).prop('tagName') === 'H2') {
                            title = title1 + ' - ' + title2;
                        } else if($titleList.eq(cnt).prop('tagName') === 'H3') {
                            title = title1 + ' - ' + title2 + ' - ' + title3;
                        } else if($titleList.eq(cnt).prop('tagName') === 'H4') {
                            title = title1 + ' - ' + title2 + ' - ' + title3 + ' - ' + title4;
                        }
                        
                        if(!$img.attr('alt')) {
                            $img.attr('alt', title);
                        }
                        if(!$img.attr('title')) {
                            $img.attr('title', title);
                        }
                        checkFlag = true;
                    } else {
                        cnt++;
                        var titleTemp = $titleList.eq(cnt).text();
                        var buttonLoc = titleTemp.indexOf($titleList.eq(cnt).find('button').text());
                        if(buttonLoc > -1) {
                            titleTemp = titleTemp.substr(0, buttonLoc);
                        }
                        if($titleList.eq(cnt).prop('tagName') === 'H2') {
                            title2 = titleTemp;
                        } else if($titleList.eq(cnt).prop('tagName') === 'H3') {
                            title3 = titleTemp;
                        } else if($titleList.eq(cnt).prop('tagName') === 'H4') {
                            title4 = titleTemp;
                        }
                        checkFlag = false;
                    }
                }
                limitCnt++;
                if(limitCnt > 100) {
                    break;
                }
            }
        }
    });
    
    //모든 img 불러와서 alt 값 비어 있으면 블로그 제목 넣기
    var allImg = $('img');
    allImg.each(function(idx, img) {
        var $img = $(img);
        if(!$img.attr('alt')) {
            $img.attr('alt', $('#header .inner > h1 > a').text().trim());
        }
    });
       
    // script, style 태그에 type 속성 제거
    $('script').removeAttr('type');
    $('style').removeAttr('type');
}

//오프스크린 이미지 지연 로딩
function lazyLoading() {
    const imgs = document.querySelectorAll('img');
    if(imgs.length > 0){
        imgs.forEach(function(img){
            var $img = $(img);
            if($img.offset().top > window.getWindowCleintHeight()) {
                var width = $img.innerWidth();
                var height = $img.innerHeight();
                if(width > 1 && height > 1) {
                    $img.css('width',width+'px');
                    $img.css('height',height+'px');
                }
                $img.css('opacity','0.2');

                if(img.getAttribute('srcset') != null){
                    img.setAttribute('data-srcset', img.getAttribute('srcset'));
                    img.setAttribute('srcset', $('#blank-img').attr('src'));
                }
                if(img.getAttribute('src') != null){
                    img.setAttribute('data-src', img.getAttribute('src'));
                    img.setAttribute('src', $('#blank-img').attr('src'));
                }
                img.classList.add('lazyload');
            }
        });
    }

    [...document.querySelectorAll('img.lazyload')].forEach(async image => {
        await (function(element, options = {}){
            const intersectionObserverOptions = {
                rootMargin: '0px',
                threshold: 0.1,
                ...options,
            };

            return new Promise(resolve => {
                const observer = new IntersectionObserver(async entries => {
                    const [entry] = entries;

                    if (entry.isIntersecting) {
                        resolve();
                        observer.disconnect();
                    }
                }, intersectionObserverOptions);
                observer.observe(element);
            });
        })(image);

        if(image.getAttribute('src') != null){
            image.setAttribute('src', image.getAttribute('data-src'));
        }
        if(image.getAttribute('srcset') != null){
            image.setAttribute('srcset', image.getAttribute('data-srcset'));
        }
        $(image).animate({'opacity':'1.0'});
    });
}

function fixedRecommendAds(type) {
    var recommendAds = $('#recommend-ads').parent();
    var adsenseAd = $('aside .revenue_unit_wrap .adsense');
    var adfitAd = $('aside .revenue_unit_wrap .adfit');
    var blankLeftSide = (window.innerWidth - ($('.content-wrapper').width() + 20))/2 - $('aside #recommend-ads').outerWidth();
    var isHideSidebar = $('#hide-sidebar').val() && blankLeftSide > 0;
    if (type == undefined && (isHideSidebar || (window.innerWidth > 1079 && window.scrollY > $('aside').height() + 150 && window.innerHeight > 650))) {
        if(recommendAds.length > 0) {
            recommendAds.css('position', 'fixed');
            if(window.innerHeight > 820) {
                recommendAds.css('top', 'calc(' + $('header').height() + 'px - 85px)');
                recommendAds.css('transform', 'scale(0.8)');
            } else if(window.innerHeight > 730) {
                recommendAds.css('top', 'calc(' + $('header').height() + 'px - 130px)');
                recommendAds.css('transform', 'scale(0.7)');
            } else if(window.innerHeight > 650) {
                recommendAds.css('top', 'calc(' + $('header').height() + 'px - 180px)');
                recommendAds.css('transform', 'scale(0.6)');
            }
            if(isHideSidebar) {
                recommendAds.css('left', blankLeftSide/2 + 'px');
            }
        } else if(adsenseAd.length > 0) {
            adsenseAd.parent().css('position', 'fixed');
            adsenseAd.parent().css('top', 'calc(' + $('header').height() + 'px + 10px)');
            adsenseAd.css('box-shadow', '0 0 16px -4px #ddd');

        } else if(adfitAd.length > 0) {
            adfitAd.parent().css('position', 'fixed');
            adfitAd.parent().css('top', 'calc(' + $('header').height() + 'px + 10px)');
            adfitAd.css('box-shadow', '0 0 16px -4px #ddd');
        }
    } else {
        if(recommendAds.length > 0) {
            recommendAds.removeAttr('style');
        } else if(adsenseAd.length > 0) {
            adsenseAd.parent().removeAttr('style');
            adsenseAd.removeAttr('style');
        } else if(adfitAd.length > 0) {
            adfitAd.parent().removeAttr('style');
            adfitAd.removeAttr('style');    
        }
    }
}

var moveToTheTitleTimer = 0;
function moveToTheTitle() {
    if(location.href.indexOf('#') > -1) {
        var regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
        var titleId = decodeURIComponent(location.href.substr(location.href.indexOf('#')+1)).replace(regExp,"\\$&");
        var title = $(titleId.length>0?'#'+titleId:'');
        if(title.length > 0 && ['H2','H3','H4','LI'].indexOf(title.prop('tagName')) > -1) {
            scrollTo(0, title.offset().top - ($('#fixed-header').val()?($('header').length>0?$('header').height()+5:0):0));
            moveToTheTitleTimer = setTimeout(function() {
                if(repeatCnt < 3) {
                    moveToTheTitle();
                    repeatCnt++;
                } else {
                    moveToTheTitleTimer = 0;
                    repeatCnt = 0;
                }
            }, 200);
        }
    }
}

/* 배경음악 관련 로직 */	
var bgmSource = [];
var saveIndex = window.localStorage.getItem('current-bgm-index');
if(isNaN(Number(saveIndex))) saveIndex = '0';
var currentIndex = saveIndex?Number(saveIndex):Math.floor(Math.random()*bgmSource.length);
var currentVolume = Number(window.localStorage.getItem('current-bgm-volume'))||0.1;
var bgmPlaying = false;
var nextPlay = false;
var myBgm = null;
var currentBgm = null;

function bgmMute(type) {
    if(bgmSource.length > 0) {
        if(type == '+') {
            myBgm.muted = false;
        } else if(type == '-') {
            myBgm.muted = true;
        } else {
            if(browserCheck('ios')) {
                showToast('아이폰은 지원하지 않습니다.');
            } else {
                myBgm.muted = !myBgm.muted;
            }
        }
        if(myBgm.muted) {
            $('#bgm-mute').html('&#xf028;'); //not mute icon
        } else {
            $('#bgm-mute').html('&#xf6a9;'); //mute icon
        }
    }
    $('.bgm-btn').blur();
}

function getCurrentBgm() {
    if(bgmSource.length > 0) {
        if($('#bgm-autoplay-yn').val()) {
            if(!window.localStorage.getItem('current-bgm')) {
                window.localStorage.setItem('current-bgm', 'play');
                currentVolume = 0.1;
            }
        }

        if(window.localStorage.getItem('current-bgm') == 'stop' || window.localStorage.getItem('current-bgm') == null) {
            myBgm.pause();
            bgmPlaying = false;
            $('#bgm-status').html('&#xf04b;'); //play icon
        } else {
            if(myBgm.paused && !bgmPlaying){
                currentBgm.html(bgmSource.length>currentIndex?bgmSource[currentIndex].title:'재생 목록 없음');
                myBgm.src = bgmSource[currentIndex].src;
                bgmMute('-');			
                var promise = myBgm.play();
                if (promise !== undefined) {
                    promise.then(function(){
                        bgmPlaying = true;
                        var saveBgmTime = (Number(window.localStorage.getItem('current-bgm-time'))||0.0)-0.3;
                        myBgm.currentTime = (saveBgmTime>0)?saveBgmTime:0.0;
                        $('#bgm-status').html('&#xf04c;'); //pause icon
                    }).catch(function(error){
                        bgmPlaying = false;
                        $('#bgm-status').html('&#xf04b;'); //play icon
                    });
                }
            }

            if(browserCheck('ios')) {
                bgmVolume('+');
            }
        }
    }
}

function nextBgm(type) {
    myBgm.pause();
    bgmPlaying = false;
    nextPlay = true;
    currentIndex = currentIndex + (type=='+'?1:-1);
    currentIndex = (currentIndex<0?bgmSource.length-1:currentIndex)%bgmSource.length;
    window.localStorage.setItem('current-bgm-index', null);
    window.localStorage.setItem('current-bgm-time', null);
    window.localStorage.setItem('current-bgm', 'play');
    getCurrentBgm();
    $('.bgm-btn').blur();
}

function bgmVolume(type) {
    if(bgmSource.length > 0) {
        if(type == '+') {
            currentVolume += 0.1;
        } else {
            currentVolume -= 0.1;
        }
        if(!browserCheck('ios')) {
            myBgm.volume = currentVolume = currentVolume>1?1:(currentVolume<0?0:currentVolume);
            var volumeAsPercent =  Math.ceil(currentVolume*100) - Math.ceil(currentVolume*100)%10;
            showToast('볼륨: ' + volumeAsPercent + '%','bottom');
        } else {
            if(type == '+') {
                window.localStorage.setItem('current-bgm', 'play');
                bgmMute('+');
                myBgm.play();
            } else {
                window.localStorage.setItem('current-bgm', 'stop');
                bgmMute('-');
                myBgm.pause();
            }
        }
    }
    $('.bgm-btn').blur();
}

function toggleBgm() {
    if(window.localStorage.getItem('current-bgm') == 'stop' || window.localStorage.getItem('current-bgm') == null || $('#bgm-status').html() == '') {
        window.localStorage.setItem('current-bgm', 'play');
    } else {
        saveBgmStatus();
        window.localStorage.setItem('current-bgm', 'stop');
    }
    getCurrentBgm();
    $('.bgm-btn').blur();
}

function saveBgmStatus() {
    if(bgmSource.length > 0) {
        if(Date.now() - Number(window.localStorage.getItem('visit-time')) < 1000*60*60 || window.localStorage.getItem('visit-time') == null) {
            window.localStorage.setItem('current-bgm-index', currentIndex);
            window.localStorage.setItem('current-bgm-time', myBgm.currentTime);			
        } else {
            window.localStorage.setItem('current-bgm-index', Math.floor(Math.random()*bgmSource.length));
            window.localStorage.setItem('current-bgm-time', '0');				
        }
        window.localStorage.setItem('visit-time', Date.now());
        window.localStorage.setItem('current-bgm-volume', currentVolume);
    }
}

function bgmStartHandler(e) {
    if(bgmPlaying) {
        saveBgmStatus();
    } else {
        getCurrentBgm();
    }
}

function bgmEvents() {
    if($('#bgm-yn').val()) {
        $('#bgm').on('ended',function(e){nextBgm('+');});
        $(window).on("beforeunload",function(e){saveBgmStatus();});	
        $(window).on('click', bgmStartHandler);
        $(window).on('touchstart', bgmStartHandler);
        $(window).on('touchend', bgmStartHandler);

        for(var i=1;i<11;i++) {
            if($('#bgm-src-'+i).length > 0 && $('#bgm-src-'+i).val().length > 0) {
                var item = {
                    src: $('#bgm-src-'+i).val(),
                    title: $('#bgm-title-'+i).val()
                }
                bgmSource.push(item);
            }
        }

        if(currentIndex > bgmSource.length - 1) {
            currentIndex = 0;
        }

        myBgm = $('#bgm')[0];
        currentBgm = $('#current-bgm');
        
        myBgm.onplaying = function() {
            bgmPlaying = true;
            myBgm.volume = currentVolume = currentVolume>1||currentVolume<0?0.1:currentVolume;
            bgmMute('+');
            if(!currentBgm.hasClass('bgm-playing')) {
                currentBgm.addClass('bgm-playing');
            }
            $('#bgm-status').html('&#xf04c;'); //pause icon
        };

        myBgm.onpause = function() {
            bgmPlaying = false;
            if(currentBgm.hasClass('bgm-playing')) {
                currentBgm.removeClass('bgm-playing');
            }
            $('#bgm-status').html('&#xf04b;'); //play icon
        };

        if(myBgm.muted) {
            bgmMute('-');
        } else {
            bgmMute('+');
        }
        getCurrentBgm();
    } else {
        window.localStorage.removeItem('current-bgm-index');
        window.localStorage.removeItem('current-bgm-volume');
        window.localStorage.removeItem('current-bgm-time');
        window.localStorage.removeItem('visit-time');
    }
}

function darkMode(type) {
    if(type == '+') {
        localStorage.setItem('dark-mode','y');
        $('section,header,footer,textarea').addClass('dark-mode-background');
        $('a,h1,h2,h3,h4,p,span:not(#bgm-status,.bubble_image),input,textarea').addClass('dark-mode-color');
        
        $('#toc *').attr('style','color: #d6d6d6 !important');
        $('.sidebar h2').attr('style','color:#d6d6d6 !important;background:black !important');
        $('.floating-toc').addClass('dark-mode-floating-toc');
        $('.floating-toc-new').addClass('dark-mode-floating-toc');
        $('#blog-menu ul li a').attr('style','color: #d6d6d6 !important');
        $('.container_postbtn .btn_post .txt_like').attr('style','color: #d6d6d6 !important');
        $('.mobile-menu aside').attr('style','color:#d6d6d6 !important;background:black !important');
        $('.another_category h4').attr('style','color:#d6d6d6 !important');
        $('.container_postbtn .btn_menu_toolbar .txt_state').attr('style','color: #d6d6d6 !important');
        $('.top-button .menu button,.sidebar .close,.move-top-btn').addClass('dark-mode-background');
        $('#tistoryEtcLayer').addClass('dark-mode-background');
        $('#tistoryEtcLayer .bundle_post .btn_mark').addClass('dark-mode-color');
        $('.btn_menu_toolbar').attr('style','opacity:0.5');
        $('#wrapper div div.profile button').attr('style','opacity:0.5');
        $('ins,img').addClass('dark-mode-opacity');
        $('.sidebar .profile ul').addClass('dark-mode-background');
        $('.top-button .profile ul li a').addClass('dark-mode-background');
        $('.comment-list ul li .author-meta .control .link a').addClass('dark-mode-background');
    } else {
        localStorage.setItem('dark-mode','n');
        $('section,header,footer,textarea').removeClass('dark-mode-background');
        $('a,h1,h2,h3,h4,p,span:not(#bgm-status,.bubble_image),input,textarea').removeClass('dark-mode-color');
        
        $('#toc *').removeAttr('style');
        $('.sidebar h2').removeAttr('style');
        $('.floating-toc').removeClass('dark-mode-floating-toc');
        $('.floating-toc-new').removeClass('dark-mode-floating-toc');
        $('#blog-menu ul li a').removeAttr('style');
        $('.container_postbtn .btn_post .txt_like').removeAttr('style');
        $('aside').removeAttr('style');
        $('.another_category h4').removeAttr('style');
        $('.container_postbtn .btn_menu_toolbar .txt_state').removeAttr('style');
        $('.top-button .menu button,.sidebar .close,.move-top-btn').removeClass('dark-mode-background');
        $('#tistoryEtcLayer').removeClass('dark-mode-background');
        $('#tistoryEtcLayer .bundle_post .btn_mark').removeClass('dark-mode-color');
        $('.btn_menu_toolbar').removeAttr('style');
        $('#wrapper div div.profile button').removeAttr('style');
        $('ins,img').removeClass('dark-mode-opacity');
        $('.sidebar .profile ul').removeClass('dark-mode-background');
        $('.top-button .profile ul li a').removeClass('dark-mode-background');
        $('.comment-list ul li .author-meta .control .link a').removeClass('dark-mode-background');
    }
}

function stopScrollTimer() {
    if(moveToTheTitleTimer != 0) {
        clearTimeout(moveToTheTitleTimer);
        moveToTheTitleTimer = 0;
    }
    if(smoothScrollTimer != 0) {
        clearTimeout(smoothScrollTimer);
        smoothScrollTimer = 0;
    }
}

var $headerTitle = $('header .inner p a');
var headerTitleText = $('header .inner p a').text().trim();
var $header = $('header');
var headerPosition = $header.css('position');
var $topButton = $('.top-button');
var $contentTitle = $('article .inner .content-title');
var flagForMoveToTheTitle = true;
function fixedHeader() {
    if($('#fixed-header').val()){
        if(headerPosition != 'sticky') {
            $header.css('position', 'sticky');
            $header.css('top', '0');
            $header.css('left', '0');
            $header.css('z-index', '119');
            $topButton.css('position','fixed');
        }

        if(window.scrollY > 0) {
            $('#blog-menu').css('display','none');
            $header.css('height', ($headerTitle.height()+20)+'px');
            $header.css('background', '#fff');
            $header.css('opacity', '0.9');
            $header.css('transition', "0.3s linear");
            if($contentTitle.length > 0 && window.scrollY > $contentTitle.offset().top + $contentTitle.outerHeight()) {
                $headerTitle.html($('.content-title .inner .title-box h1').text());
                $headerTitle.attr('href', '#');
            } else {
                $headerTitle.html(headerTitleText);
                $headerTitle.attr('href', '/');
            }
            $('.progress-bar-horizontal').css('top', ($headerTitle.height()+20)+'px');
        } else {
            $('#blog-menu').css('display','');
            $header.css('height', '');
            $header.css('background', '');
            $headerTitle.html(headerTitleText);
            $header.css('border-bottom', '');
        }

        if($('.floating-toc').height() > 0) {
            $('.floating-toc').css('top', ($headerTitle.height()+20)+'px');
        }
        if($('.floating-toc-new').height() > 0) {
            $('.floating-toc-new').css('top', ($('header').height()+15)+'px');
        }
        if(location.href.indexOf('#') > -1 && flagForMoveToTheTitle) {
            flagForMoveToTheTitle = false;
            moveToTheTitle();
        }
    }
}

function selectMakeFloatingToc() {
    if($('#floating-toc-type').val() == 'new') {
        makeFloatingToc()
    }
}

function selectAppendToc() {
    if($('#floating-toc-type').val() == 'new') {
        appendTocNew();
    } else {
        appendToc();
    }
}

$(document).ready(function() {
    makeToc();
    selectMakeFloatingToc();
    commentControl();
    commentAutoLink();
    common();
    smoothScroll();
    initFoldReply();
    updateTagsAttr();
    lazyLoading();
    moveToTheTitle();
    makeBell();
    toastAfterLike();
    bgmEvents();
    
    $(window).on('scroll', function() {
        progressBarVertical();
        progressBarHorizontal();
        progressBarEtcVertical();
        progressBarEtcHorizontal();
        selectAppendToc();        
        fixedRecommendAds();
        stopScrollTimer();
        fixedHeader();
    });
});