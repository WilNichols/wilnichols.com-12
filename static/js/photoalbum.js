$(document).ready(function() {
    function launchIntoFullscreen(element) {
        $('body').addClass('fullscreen');
        if(element.requestFullscreen) {
            element.requestFullscreen();
        } else if(element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if(element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if(element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }
    function exitFullscreen() {
        if(document.exitFullscreen) {
            document.exitFullscreen();
        } else if(document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if(document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }                                                        
    $(document).bind('webkitfullscreenchange mozfullscreenchange fullscreenchange', function(e) {
        var state = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
        var event = state ? 'FullscreenOn' : 'FullscreenOff';
        if (event = 'FullscreenOff' && event != 'FullscreenOn') {
            $('body.fullscreen').removeClass('fullscreen');
        }
    });
    $('.fullscreen-exit, body.fullscreen .front.exit-fullscreen').click(function() {
         exitFullscreen();
         console.log('lol');
    });
    function album(keys) {
        var hash = window.location.href.split('#')[1] || '';
        var start = $('.photoalbum li:nth-of-type(1)');
        var photos = $('.photoalbum li').length;
        var currentphoto = '1';
        if (hash <= photos && hash > 0 && hash != '')  {
            start = $('.photoalbum li:nth-of-type(' + hash + ')');
            currentphoto = hash;
        }
        function updatetext() {
            $('.counter p').text(currentphoto + '/' + photos);
        }
       function pagenext(container) {
            container.addClass('front').removeClass('next');
            container.prev().removeClass('front').addClass('prev');
            container.next().addClass('next').removeClass('dblnext');
            container.nextAll().eq(1).addClass('dblnext');
            container.prevAll().eq(1).removeClass('prev').addClass('dblprev');
            container.prevAll().eq(2).removeClass('dblprev');
       }
       function pageback(container) {
            container.addClass('front').removeClass('prev');
            container.next().removeClass('front').addClass('next');
            container.prev().addClass('prev').removeClass('dblprev');
            container.prevAll().eq(1).addClass('dblprev');
            container.nextAll().eq(1).removeClass('next').addClass('dblnext');
            container.nextAll().eq(2).removeClass('dblnext');
       }
       function checkposition() {
           if ($(".photoalbum li:first-of-type").hasClass('front')) {
                $(".button-prev").hide();
            } else {
                $(".button-prev").show();
            } 
            if ($(".photoalbum li:last-of-type").hasClass('front')) {
                $(".button-next").hide();
            } else {
                $(".button-next").show();
            }
       }
        updatetext();
        start.addClass('front');
        start.next().addClass('next');
        start.nextAll().eq(1).addClass('dblnext');
        start.prev().addClass('prev');
        start.prevAll().eq(1).addClass('dblprev');
        
        window.onkeydown = function(keys) {
            var container = $(this).parent('.photoalbum li');
           if (event.keyCode == 37) {
               $(".photoalbum li.prev a").click();
           }
           if (event.keyCode == 39) {
               $(".photoalbum li.next a").click();
           }
        }   
        $(".photoalbum li").each(function(index) {
            //set id
            var index = $(this).index() + 1;
            $(this).attr('id', index);
            $(this).children().attr('href', '#' + index);
            $(this).find('img').attr('alt', 'Photo ' + index);
        })
        $(".photoalbum li a").click(function(container) {  
            var hash = $(this).attr('href');
            history.pushState(null, null, hash);
            currentphoto = hash.substr(1);
            var container = $(this).parent('.photoalbum li');
            if (container.hasClass('next')) {
                pagenext(container);
            } else if (container.hasClass('prev')) {
                pageback(container);
            } else if (container.hasClass('front')) {
                if ($('body').hasClass('fullscreen')) {
                    exitFullscreen();
                } else {
                    launchIntoFullscreen(document.documentElement)
                }
            }
            updatetext();
            checkposition();
            return false;
        });   
        $(".button-next").click(function() {
            $('.photoalbum li.next a').click();
        })
        $(".button-prev").click(function() {
            $('.photoalbum li.prev a').click();
        })
        checkposition();
    }
    function photopreload() {
        var loader ="<i class='loader' />";
        // prog. enhancement; only hide images before load IF js is enabled
        $('.photocontainer a').append(loader);
        $('.photocontainer a').addClass('preloader');
        $('#imageloader').imagesLoaded().progress(function(instance, image) {
            var url = image.img.src;
            filename = url.split("/").pop();
            var img = $("img[src$='" + filename + "']");
            $(img).parent().removeClass('preloader');
            //remove loader 
            $(img).next().remove();
            $(img).addClass("fade-in");
        }).done( function( instance ) {
            console.log( 'all are done!');
        });
    }
    
    photopreload();
    album();
});