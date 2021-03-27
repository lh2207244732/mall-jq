; (function ($) {
    function Carousel($elem, options) {
        //1.罗列属性
        this.$elem = $elem
        this.width = options.width
        this.height = options.height
        this.imgs = options.imgs
        this.len = this.imgs.length
        this.activeIndex = 0
        this.now = 0
        this.playInterval = options.playInterval
        this.type = options.type
        this.loadingImageUrl = options.loadingImageUrl

        this.$carouselImgs = null
        this.$leftArrow = null
        this.$rightArrow = null
        this.$btns = null
        this.$carouselImgsChildren = null
        this.$bntsChildren = null
        //2.初始化
        this.init()

        //3.绑定事件
        this.bindEvent()
        //4.处理自动切换
        if (this.playInterval) {
            this.autoPlay()
        }
    }
    Carousel.prototype = {
        constructor: Carousel,
        init: function () {
            this.$elem.addClass('carousel-wrap').css({
                width: this.width,
                height: this.height
            })

            this.$carouselImgs = $('<ul></ul>').addClass('carousel-imgs')
            this.$btns = $('<ul></ul>').addClass('btns')

            for (var i = 0; i < this.len; i++) {
                var $carouselItem = $('<li></li>').addClass('carousel-item')
                var $btn = $('<li></li>').html(i + 1)
                var $img = $('<img>').attr('src', this.loadingImageUrl).attr('data-src', this.imgs[i])
                $carouselItem.append($img)

                this.$carouselImgs.append($carouselItem)
                this.$btns.append($btn)
            }

            this.$leftArrow = $('<span></span>').addClass('left-arrow arrow').html('&lt;')
            this.$rightArrow = $('<span></span>').addClass('right-arrow arrow').html('&gt;')

            this.$elem.append(this.$carouselImgs)
            this.$elem.append(this.$leftArrow)
            this.$elem.append(this.$rightArrow)
            this.$elem.append(this.$btns)
            this.$carouselImgsChildren = this.$carouselImgs.find('li')
            this.$bntsChildren = this.$btns.find('li')

            this.$bntsChildren.eq(this.activeIndex).addClass('active')

            if (this.type == 'fade') {
                this.tab = this.fade
                this.$elem.addClass('fade')
                this.$carouselImgsChildren.eq(this.activeIndex).show()
            } else if (this.type == 'slide') {
                this.tab = this.slide
                this.$elem.addClass('slide')
                this.$carouselImgsChildren.eq(this.activeIndex).css({ left: 0 })
            }
            //图片懒加载事件监听
            var _this = this
            this.$elem.on('show', function (ev, index) {
                var $img = _this.$carouselImgsChildren.eq(index).find('img')
                var imgSrc = $img.data('src')

                var image = new Image()
                image.onload = function () {
                    $img.attr('src', imgSrc)
                }
                image.src = imgSrc
            })
            //触发图片加载事件,显示默认的图片
            this.$elem.trigger('show', this.activeIndex)
        },
        bindEvent: function () {
            var _this = this
            this.$rightArrow.on('click', function () {
                this.now++
                this.setCorrectIndex()
                this.tab()
            }.bind(this))

            this.$leftArrow.on('click', function () {
                this.now--
                this.setCorrectIndex()
                this.tab()
            }.bind(this))

            //用事件代理的方式实现底部指示按钮的点击事件处理
            this.$btns.on('click', 'li', function () {
                var index = $(this).index()
                if (index == _this.activeIndex) {
                    return
                }
                _this.now = index
                _this.tab()
            })
        },
        fade: function () {

            this.$carouselImgsChildren.eq(this.activeIndex).fadeOut()
            this.$carouselImgsChildren.eq(this.now).fadeIn()
            //加载图片
            this.$elem.trigger('show', this.now)
            this.$bntsChildren.eq(this.activeIndex).removeClass('active')
            this.$bntsChildren.eq(this.now).addClass('active')
            this.activeIndex = this.now
        },
        slide: function () {
            //1.确定滑动的方向
            var direction = 1 // 规定 1是右滑 -1左滑
            if (this.activeIndex == this.len - 1 && this.now == 0) {//最后一张右滑到第一张
                direction = 1
            } else if (this.activeIndex == 0 && this.now == this.len - 1) {//第一张左滑到最后一张
                direction = -1
            } else if (this.now > this.activeIndex) {
                direction = 1
            } else {
                direction = -1
            }
            //2 把将要显示的移动到容器的左边或者右边
            this.$carouselImgsChildren.eq(this.now).css({ left: direction * this.width })
            //3 把当前的移动出容器
            this.$carouselImgsChildren.eq(this.activeIndex).animate({ left: -direction * this.width })
            //4 把将要显示的显示出来
            this.$carouselImgsChildren.eq(this.now).animate({ left: 0 })
            //加载图片
            this.$elem.trigger('show', this.now)

            this.$bntsChildren.eq(this.activeIndex).removeClass('active')
            this.$bntsChildren.eq(this.now).addClass('active')
            this.activeIndex = this.now
        },
        setCorrectIndex: function () {
            if (this.now >= this.len) {
                this.now = 0
            }
            if (this.now < 0) {
                this.now = this.len - 1
            }
        },
        autoPlay: function () {
            var timer = 0
            timer = setInterval(function () {
                this.$rightArrow.trigger('click')
            }.bind(this), this.playInterval)

            this.$elem.on('mouseenter', function () {
                clearInterval(timer)
            })
            this.$elem.on('mouseleave', function () {
                timer = setInterval(function () {
                    this.$rightArrow.trigger('click')
                }.bind(this), this.playInterval)
            }.bind(this))
        }
    }
    Carousel.DEFAULTS = {
        imgs: [],
        width: 862,
        height: 400,
        playInterval: 5000,
        type: 'fade',
        loadingImageUrl: './images/loading.gif'
    }
    $.fn.extend({
        carousel: function (options) {
            return this.each(function () {
                var $elem = $(this)
                //单例模式创建轮播图对象
                var carousel = $elem.data('carousel')
                if (!carousel) {
                    options = $.extend({}, Carousel.DEFAULTS, options)
                    carousel = new Carousel($elem, options)
                    $elem.data('carousel', carousel)
                }
            })
        }
    })
})(jQuery)