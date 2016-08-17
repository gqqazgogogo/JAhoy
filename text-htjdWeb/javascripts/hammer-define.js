/**
 * Created by GSY on 16/8/17.
 */

var hammerMask = document.getElementById('hammer-mask');
var hammerBg = document.getElementById('hammer-bg');
var hammerBox = document.getElementById('hammer-box');
var hammerPage = document.getElementById('hammer-page');
var imgBig = document.getElementById('image-big');
var hammerImgs = [];
var ticking = false;
var transform = {scale: 1, lastScale: 1, top: 0, left: 0, lastTop:0, lastLeft:0};

//hammer init
var mc = new Hammer.Manager(hammerBox);
mc.add(new Hammer.Pan({ threshold: 0, pointers: 0 }));
//    mc.add(new Hammer.Swipe()).recognizeWith(mc.get('pan'));
mc.add(new Hammer.Pinch({ threshold: 0 }));
mc.add(new Hammer.Tap({ event: 'doubletap', taps: 2 }));

//hammer 监听
mc.on('pan panend', function(ev) {
    transform.top = transform.lastTop + ev.deltaY;
    transform.left = transform.lastLeft + ev.deltaX;
    if(ev.type == 'panend') {
        if(Math.abs(transform.top) > shiftHeight) {
            if(transform.top > 0) {
                transform.top = shiftHeight;
            } else {
                transform.top = -shiftHeight;
            }
        }
        if(Math.abs(transform.left) > shiftWidth) {
            if(transform.left > 0) {
                transform.left = shiftWidth;
            } else {
                transform.left = -shiftWidth;
            }
        }
        transform.lastTop = transform.top;
        transform.lastLeft = transform.left;
        if(transform.scale <= 1) {
            transform.lastLeft = 0;
            transform.lastTop = 0;
        }
    }
    requestElementUpdate();
});
//    mc.on('swipe', function(ev) {
//      if(ev.deltaX < 0 && (currentIndex < imgNumIndex)) {
//        //next
//        nextImg();
//      }  else if (ev.deltaX > 0 && (currentIndex > 0)){
//        //last
//        lastImg();
//      }
//
//    });
var shiftWidth = 0;
var shiftHeight = 0;
mc.on('pinchstart pinchmove pinchend',function (ev) {
    //pinch scale
    if(ev.type == 'pinchstart') {
        shiftWidth = 0;
        shiftHeight = 0;
    } else if(ev.type == 'pinchmove') {
        transform.scale = transform.lastScale * ev.scale;
        if(transform.scale > 1) {
            shiftWidth = (transform.scale-1)/2*imgBig.offsetWidth;
            shiftHeight = (transform.scale-1)/2*imgBig.offsetHeight;
        }

        requestElementUpdate();

    } else if (ev.type == 'pinchend') {

        transform.scale = transform.lastScale * ev.scale;
        if(transform.scale > 0.7 && transform.scale < 1.3) {
            transform.scale = 1;
            transform.top = 0;
            transform.left = 0;
        }
        transform.lastScale = transform.scale;

    }
});
mc.on('doubletap', function(ev) {
    if(transform.scale < 3 && transform.scale >= 1) {
        transform.scale = 3;
        transform.lastScale = 3;
        shiftWidth = (transform.scale-1)/2*imgBig.offsetWidth;
        shiftHeight = (transform.scale-1)/2*imgBig.offsetHeight;
    } else if(transform.scale < 1 || transform.scale >= 3) {
        transform.scale = 1;
        transform.lastScale = 1;
        transform.lastLeft = 0;
        transform.lastTop = 0;
        transform.left = 0;
        transform.top = 0;
        shiftWidth = 0;
        shiftHeight = 0;
    }
    requestElementUpdate();
});
//hammer 监听结束

//hammer animation
function updateElementTransform() {
    var value = [
        'translate('+transform.left+'px,'+transform.top+'px)',
        'scale(' + transform.scale + ', ' + transform.scale + ')'
    ];

    value = value.join(" ");
    imgBig.style.webkitTransform = value;
    imgBig.style.transform = value;
    ticking = false;
}

function requestElementUpdate() {
    if(!ticking) {
        reqAnimationFrame(updateElementTransform);
        ticking = true;
    }
}

var reqAnimationFrame = (function () {
    return window[Hammer.prefixed(window, 'requestAnimationFrame')] || function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

var currentIndex = 0;
var imgNumIndex = 0;

function lastImg() {
    if(currentIndex > 0) {
        currentIndex--;
        imgBig.src = hammerImgs[currentIndex];
        hammerPage.innerHTML = (currentIndex+1)+"/"+(imgNumIndex+1);
    }
}
function nextImg() {
    if(currentIndex < imgNumIndex) {
        currentIndex++;
        imgBig.src = hammerImgs[currentIndex];
        hammerPage.innerHTML = (currentIndex+1)+"/"+(imgNumIndex+1);
    }
}

window.showHammer = function(images,index) {
    hammerImgs = images;
    currentIndex = index;
    changecss('.blur-tag','-webkit-filter','blur(30px)');
    document.body.style.overflow = "hidden";
    imgBig.src = hammerImgs[index];
    imgNumIndex = hammerImgs.length - 1;
    hammerMask.style.height = document.children[0].offsetHeight;
    hammerMask.style.display = "block";
    hammerBg.style.display = "block";
    hammerPage.innerHTML = (currentIndex+1)+"/"+(imgNumIndex+1);
}
function hideHammer(e) {
    if(e.target.nodeName == "IMG" | e.target.nodeName == "SPAN") {
        return;
    }
    changecss('.blur-tag','-webkit-filter','none');
    document.body.style.overflow = "auto";
    hammerMask.style.display = "none";
    hammerBg.style.display = "none";
}

function changecss(theClass, element, value) {
    var cssRules;
    if (document.all) {
        cssRules = 'rules';
    } else if (document.getElementById) {
        cssRules = 'cssRules';
    }
    for (var S = 0; S < document.styleSheets.length; S++) {
        for (var R = 0; R < document.styleSheets[S][cssRules].length; R++) {
            if (document.styleSheets[S][cssRules][R].selectorText == theClass) {
                document.styleSheets[S][cssRules][R].style[element] = value;
                return ;
            }
        }
    }
}