function Carousel(options) {
    //1.罗列属性
    this.wrap = document.getElementById(options.id)
    this.width = options.width
    this.height = options.height
    this.imgs = options.imgs
    this.len = this.imgs.length
    this.activeIndex = 0
    this.now = 0
    this.playInterval = options.playInterval

    this.carouselImgs = null
    this.leftArrow = null
    this.rightArrow = null
    this.btns = null

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
        this.wrap.className = 'carousel-wrap fade'
        this.wrap.style.width = this.width + 'px'
        this.wrap.style.height = this.height + 'px'

        this.carouselImgs = document.createElement('ul')
        this.carouselImgs.className = 'carousel-imgs'

        this.btns = document.createElement('ul')
        this.btns.className = 'btns'

        for (var i = 0; i < this.len; i++) {
            var carouselItem = document.createElement('li')
            var btn = document.createElement('li')
            btn.innerHTML = i + 1
            //动态添加属性,为了事件代理时可以获取到下标
            btn.index = i
            if (this.activeIndex == i) {
                carouselItem.className = 'carousel-item show'
                btn.className = 'active'
            } else {
                carouselItem.className = 'carousel-item'
            }

            var img = document.createElement('img')
            img.src = this.imgs[i]

            carouselItem.appendChild(img)

            this.carouselImgs.appendChild(carouselItem)
            this.btns.appendChild(btn)
        }

        this.leftArrow = document.createElement('span')
        this.leftArrow.className = 'left-arrow arrow'
        this.leftArrow.innerHTML = '&lt;'
        this.rightArrow = document.createElement('span')
        this.rightArrow.className = 'right-arrow arrow'
        this.rightArrow.innerHTML = '&gt;'

        this.wrap.appendChild(this.carouselImgs)
        this.wrap.appendChild(this.leftArrow)
        this.wrap.appendChild(this.rightArrow)
        this.wrap.appendChild(this.btns)

    },
    bindEvent: function () {
        this.rightArrow.onclick = function () {
            this.now++
            this.setCorrectIndex()
            this.tab()
        }.bind(this)

        this.leftArrow.onclick = function () {
            this.now--
            this.setCorrectIndex()
            this.tab()
        }.bind(this)
        //用事件代理的方式实现底部指示按钮的点击事件处理
        this.btns.onclick = function (ev) {
            if (ev.target.tagName == 'LI') {
                if (ev.target.index != this.activeIndex) {
                    this.now = ev.target.index
                    this.tab()
                }
            }
        }.bind(this)

    },
    tab: function () {
        var carouselImgsChildren = this.carouselImgs.children
        var bntsChildren = this.btns.children

        carouselImgsChildren[this.activeIndex].className = 'carousel-item'
        carouselImgsChildren[this.now].className = 'carousel-item show'

        bntsChildren[this.activeIndex].className = ''
        bntsChildren[this.now].className = 'active'

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
        timer = setInterval(this.rightArrow.onclick, this.playInterval)

        this.wrap.onmouseenter = function () {
            clearInterval(timer)
        }

        this.wrap.onmouseleave = function () {
            timer = setInterval(this.rightArrow.onclick, this.playInterval)
        }.bind(this)
    }
}

function SlideCarousel(options) {
    Carousel.call(this, options)
}
SlideCarousel.prototype = Object.create(Carousel.prototype)

Object.defineProperty(SlideCarousel.prototype, 'constructor', {
    value: SlideCarousel
})

SlideCarousel.prototype.init = function () {
    //调用一次父类的init方法
    Carousel.prototype.init.call(this)
    this.wrap.className = 'carousel-wrap slide'
}

SlideCarousel.prototype.tab = function () {
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
    //2.根据滑动的方向做滑动的准备
    var carouselImgsChildren = this.carouselImgs.children
    var bntsChildren = this.btns.children
    var hideClassName = 'carousel-item hide-left'
    var moveClassName = 'carousel-imgs move-right'
    if (direction == -1) {
        hideClassName = 'carousel-item hide-right'
        moveClassName = 'carousel-imgs move-left'
    }
    for (var i = 0; i < this.len; i++) {
        //除了当前显示的其他的全部隐藏
        if (i != this.activeIndex) {
            carouselImgsChildren[i].className = hideClassName
        }
        //把即将显示的层级调高
        if (i == this.now) {
            carouselImgsChildren[i].style.zIndex = 99
        } else {
            carouselImgsChildren[i].style.zIndex = 0
        }
    }
    //3.执行滑动
    this.carouselImgs.className = moveClassName

    //4.滑动结束后为下一次滑动准备
    this.carouselImgs.addEventListener('animationend', function () {

        this.carouselImgs.className = 'carousel-imgs'

        carouselImgsChildren[this.activeIndex].className = 'carousel-item'
        carouselImgsChildren[this.now].className = 'carousel-item show'

        bntsChildren[this.activeIndex].className = ''
        bntsChildren[this.now].className = 'active'

        this.activeIndex = this.now
    }.bind(this), false)

}