var baseUrl = 'http://127.0.0.1:3000'
var utils = {
    ajax: function (options) {
        options.url = baseUrl + options.url
        return $.ajax(options)
    },
    //判断元素是否在可视区
    isVisibility: function ($elem) {
        var $win = $(window)
        return ($elem.offset().top < $win.scrollTop() + $win.height() && $elem.offset().top + $elem.height() > $win.scrollTop())
    },
    //防抖处理
    debounce: function (fn, delay) {
        var timer = 0;
        //返回一个函数
        return function () {
            if (timer) {
                //每次事件被触发时,清除之前的旧定时器
                clearTimeout(timer);
            }
            //开启一个新的定时器从新开始等待
            timer = setTimeout(fn, delay)
        }
    },
    //预加载图片
    loadImage: function (imgSrc, success) {
        var image = new Image()
        image.onload = function () {
            typeof success === 'function' && success()
        }
        image.src = imgSrc
    }
}