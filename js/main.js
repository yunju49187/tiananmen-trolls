$.fancybox.defaults.animationEffect = "fade";
var $body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body');
// $.fancybox.defaults.hash = false;
$.extend({
    'goAnchor': function(to, time) {
        $obj = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body');
        $($obj).animate({
            scrollTop: to
        }, time);
    }
});



// var tag = document.createElement('script');
// tag.src = "https://www.youtube.com/player_api";
// var firstScriptTag = document.getElementsByTagName('script')[0];
// firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// var player=null;
// function onYouTubeIframeAPIReady() {
//     player = new YT.Player('player', {
//         videoId: 'VuXhEE11J4w',
//         playerVars: { 
//             // fs:0,
//             iv_load_policy:3,
//             disablekb:1,
//             // controls:0,
//             autoplay:1,
//             modestbranding:1,
//             playsinline:1,
//             rel:0,
//             showinfo:0
//         },
//         events: {
//             'onReady': onPlayerReady,
//             'onStateChange': onPlayerStateChange
//         }
//     });
// }

// function onPlayerReady(event){
//     event.target.mute();
//     event.target.playVideo();
//     resizeFun();
//     $body.animate({scrollTop: 0}, 100); 
// }
// var done = false;
// function onPlayerStateChange(event) {
//     if (event.data == YT.PlayerState.ENDED && !done) {
//         stopVideo();
//         done = true;
//     }
// }

function stopVideo() {
    $("#player video").get(0).pause();
    $(".videoBox").hide();
    $("body").attr("style","")
}


$(".vid,.videoBox .bg,.closeVideoBtn").on("click",function(e){
    if(player!=null){
        stopVideo();
    }
})
var instance=null,$grid=null,userData={},loadN=9,scrollMorePost=false,ham_active=false;
userData.loadList=[];
$(document).ready(function() {
    window.onbeforeunload = function () {
        window.scrollTo(0, 0);
    }
    $("#player video").on("ended",function(e){
        stopVideo()
    })
    $(".tabs").each(function(e){
        $(".tab:eq(0)",this).show();
    })
    $(".choose_tab .label").on("click",function(e){
        var _in=$(this).index();
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
        $(this).parent(".choose_tab").siblings(".tab").hide();
        $(this).parent(".choose_tab").siblings(".tab").eq(_in).show();
    })
    $("#go_to").on("click",function(e){
        $.goAnchor($("#sect").offset().top, 1000);
    })

    $(window).on("resize",resizeFun);
    resizeFun();
    $(window).on("scroll",scrollFun);
    scrollFun();

    $(".menuH li:not(.mobile) a, .menu li a").on("click",function(e){
        var goMC=$(this).attr("href");
        $.goAnchor($(goMC).offset().top, 1000);
        $(".menuH").removeClass('active');
        $(".hamburger").removeClass('is-active');
        ham_active=false;        
        return false;
    })
    $('.fancy').on('click', function() {
        var openMC="."+$(this).attr("d-open");
        instance=$.fancybox.open($(openMC), {
            touch: false,
            infobar: false
        });
    });
    $(".btn.next").on("click",function(e){
        instance.next();
    })
    $(".hamburger").on("click",function(e){
        if(ham_active){
            $(".menuH").removeClass('active');
            $(".hamburger").removeClass('is-active');
            ham_active=false;
        }else{
            $(".menuH").addClass('active');
            $(".hamburger").addClass('is-active');
            ham_active=true;
        }
    })

    $.ajax({
        url:"json/data.json",
        type: 'GET',
        dataType:"json"       
    }).done(function(msg){
        userData["post"]=msg["data"];
        userData["loadList"]=$.extend(true,[],msg["data"]);
        shuffleArrayFun(userData["loadList"]);
        setPostFun(userData["loadList"]);
    }).fail(function(msg){
        console.log(msg);
    })

    $grid = $('.posts').masonry({
        itemSelector:".box",
        percentPosition: true,
        gutter:20
    })

});
function resizeFun(e){
    var sw=$(window).width(),sh=$(window).height(),vw=16,vh=9,minH=780;
    if(sh<minH){
        $("#coverstory,#sect").css({height:minH});
    }else{
       $("#coverstory,#sect").css({height:sh}); 
    }
    
    $("#player").css({height:sh});
}
function scrollFun(e){
    var st=$(window).scrollTop(),sh=$(window).height(),restH=$("body").height()-st-sh;
    if(st>200){
        $("header").addClass('backg');
    }else{
        $("header").removeClass('backg');
    }
    // console.log(scrollMorePost)
    if(scrollMorePost){
        // console.log("a",restH,sh*1.5);
        if(restH<(sh*0.5)){
            if(userData.loadList.length!=0){
                setPostFun(userData.loadList);
            }
        }
    }
}
function setPostFun(posts){
    if(posts.length<loadN){
        loadN=posts.length
    }
    for(var i=0;i<loadN;i++){
        var mc=$('<a class="box" data-fancybox="images" data-caption="" href=""><img src="" width="100%"></a>');
        $("img",mc).attr("src","pic_more/"+posts[i]["img"]);
        $(mc).attr({"data-caption":posts[i]["caption"],"href":"pic_more/"+posts[i]["img"]});
        $grid.append(mc).masonry("appended",mc);
    }
    userData.loadList.splice(0, loadN);
    // console.log(userData.loadList.length);
    if(userData.loadList.length<=0){
        scrollMorePost=false;
    }else{
        scrollMorePost=true;
    }
    $grid.imagesLoaded(function(){
        $grid.masonry();
    });
}


function shuffleArrayFun(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}