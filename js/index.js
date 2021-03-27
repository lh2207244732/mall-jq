(function (w, d) {
    var pag = {
        init: function () {
            this.$cartCount = $('.cart-count')
            this.$cartBox = $('.cart-box')
            this.$cartContent = $('.cart-content')
            this.$categories = $('.categories')
            this.$parentCategories = $('.parent-categories')
            this.$childCategories = $('.child-categories')

            this.cartTimer = null
            this.categoriesTimer = null

            this.childCategoriesCache = {}

            this.handleCart()
            this.handleSearch()
            this.handleCategories()


            // this.hotProductList = d.querySelector('.hot .product-list')
            // this.floor = d.querySelector('.floor')
            // this.elevator = d.querySelector('#elevator')

            // this.searchTimer = null
            // this.categoriesTimer = null
            // this.isSearchLayerEmpty = true
            // this.parentCategoriesItem = null
            // this.parentCategoriesItem = null
            // this.lastActiveIndex = 0
            // this.floors = null
            // this.elevatorTimer = null
            // this.elevatorItems = null


            // this.handleCarousel()
            // this.handleHotProductList()
            // this.handleFloor()
            // this.handleElevator()

        },
        loadCartCount: function () {
            var _this = this
            utils.ajax({
                method: "get",
                url: '/carts/count',
                success: function (data) {
                    if (data.code == 0) {
                        _this.$cartCount.html(data.data)
                    }
                },
                error: function (status) {
                    console.log(status)
                }
            })
        },
        handleCart: function () {
            var _this = this
            this.loadCartCount()
            // 显示下拉购物车
            this.$cartBox.on('mouseenter', function () {
                if (_this.cartTimer) {
                    clearTimeout(_this.cartTimer)
                }
                _this.cartTimer = setTimeout(function () {
                    _this.$cartContent.show()
                    // 显示loading状态
                    _this.$cartContent.html('<div class="loader"></div>')
                    //发送ajax请求
                    utils.ajax({
                        method: 'get',
                        url: '/carts',
                        success: function (data) {
                            if (data.code == 0) {
                                _this.renderCart(data.data.cartList)
                            } else {
                                _this.$cartContent.html('<span class="empty-cart">获取购物车失败,请重试</span>')
                            }
                        },
                        error: function (status) {
                            _this.$cartContent.html('<span class="empty-cart">获取购物车失败,请重试</span>')
                        }
                    })
                }, 200)
            })
                // 隐藏下拉购物车
                .on('mouseleave', function () {
                    if (_this.cartTimer) {
                        clearTimeout(_this.cartTimer)
                    }
                    _this.$cartContent.hide()
                })
        },
        renderCart: function (list) {
            var len = list.length
            if (len > 0) {
                var html = ''
                html += '<span class="cart-tip">最近加入的宝贝</span>'
                html += '<ul>'
                for (var i = 0; i < len; i++) {
                    html += '<li class="cart-item clearfix">'
                    html += '   <a href="#" target="_blank">'
                    html += '       <img src="' + list[i].product.mainImage + '" alt="">'
                    html += '       <span class="text-ellipsis">' + list[i].product.name + '</span>'
                    html += '   </a>'
                    html += '   <span class="product-count">x ' + list[i].count + ' </span><span class="product-price">' + list[i].product.price + '</span>'
                    html += '</li>'
                }
                html += '</ul>'
                html += '<span class="line"></span>'
                html += '<a href="/cart.html" class="btn cart-btn">查看我的购物车</a>'
                this.$cartContent.html(html)
            } else {
                this.$cartContent.html('<span class="empty-cart">购物车中还没有商品,赶紧来购买吧!</span>')
            }
        },
        handleSearch: function () {
            $('.search-box').search({
                searchInputSelector: '.search-input',
                searchBtnSelector: '.search-btn',
                searchLayerSelector: '.search-layer',
                isAutocomplete: true,
                url: '/products/search'
            })
        },
        handleCategories: function () {
            var _this = this
            // 获取父级分类
            this.getParentCategoriesData()
            // 用事件代理的方式处理父级分类项目的切换
            this.$categories
                .on('mouseover', '.parent-categories-item', function () {
                    var $elem = $(this)
                    if (_this.categoriesTimer) {
                        clearTimeout(_this.categoriesTimer)
                    }
                    $elem.addClass('active').siblings().removeClass('active')
                    _this.categoriesTimer = setTimeout(function () {
                        _this.$childCategories.show()
                        var pid = $elem.data('id')
                        //判断缓存中是否有数据
                        if (_this.childCategoriesCache[pid]) {
                            _this.renderChildCategories(_this.childCategoriesCache[pid])
                        } else {
                            _this.getChildCategoriesData(pid)
                        }

                    }, 300)
                })
                .on('mouseleave', function () {
                    if (_this.categoriesTimer) {
                        clearTimeout(_this.categoriesTimer)
                    }
                    _this.$childCategories.hide().html('')
                    _this.$parentCategories.find('.parent-categories-item').removeClass('active')

                })
        },
        getParentCategoriesData: function () {
            var _this = this
            utils.ajax({
                method: 'get',
                url: '/categories/arrayCategories',
                success: function (data) {
                    if (data.code == 0) {
                        _this.renderParentCategories(data.data)
                    }
                },
                error: function (status) {
                    console.log('获取父级分类失败')
                }
            })
        },
        getChildCategoriesData: function (pid) {
            var _this = this
            this.$childCategories.html('<div class="loader"></div>')
            utils.ajax({
                method: 'get',
                url: '/categories/childArrayCategories',
                data: {
                    pid: pid
                },
                success: function (data) {
                    if (data.code == 0) {
                        _this.renderChildCategories(data.data)
                        //缓存数据
                        _this.childCategoriesCache[pid] = data.data
                    }
                },
                error: function (status) {
                    console.length('获取子分类失败')
                }
            })
        },
        renderParentCategories: function (list) {
            var len = list.length
            if (len > 0) {
                var html = '<ul>'
                for (var i = 0; i < len; i++) {
                    html += ' <li class="parent-categories-item" data-id="' + list[i]._id + '" data-index="' + i + '" >' + list[i].name + '</li>'
                }
                html += '</ul>'
                this.$parentCategories.html(html)
            }
        },
        renderChildCategories: function (list) {
            var len = list.length
            if (len > 0) {
                var html = '<ul>'
                for (var i = 0; i < len; i++) {
                    html += ` <li class="child-item">
                    <a href="#">
                        <img src="${list[i].icon}" alt="">
                        <p>${list[i].name}</p>
                    </a>
                </li>`
                }
                html += '</ul>'
                this.$childCategories.html(html)
            }
        },
        handleCarousel: function () {
            var _this = this
            utils.ajax({
                method: 'get',
                url: '/ads/positionAds',
                data: {
                    position: 1
                },
                success: function (data) {
                    if (data.code == 0) {
                        _this.renderCarousel(data.data)
                    }
                },
                error: function (status) {
                    console.log(status)
                }
            })
        },
        renderCarousel: function (list) {
            var imgs = list.map(function (item) {
                return item.image
            })
            new SlideCarousel({
                id: 'swiper',
                imgs: imgs,
                width: 862,
                height: 440,
                playInterval: 2000
            })
        },
        handleHotProductList: function () {
            var _this = this
            utils.ajax({
                method: 'get',
                url: '/products/hot',
                success: function (data) {
                    if (data.code == 0) {
                        _this.renderHotProductList(data.data)
                    }
                },
                error: function (status) {
                    console.log(status)
                }
            })
        },
        renderHotProductList: function (list) {
            var len = list.length
            var html = ''
            for (var i = 0; i < len; i++) {
                html += `        <li class="product-item col-1 col-gap">
                <a href="#">
                    <img width="180px" height="180px"
                        src="${list[i].mainImage}"
                        alt="">
                    <p class="product-name">
                    ${list[i].name}
                    </p>
                    <p class="product-price-paynum">
                        <span class="product-price">&yen; ${list[i].price}</span>
                        <span class="paynum">${list[i].payNums}人已经购买</span>
                    </p>
                </a>
            </li>`
            }
            this.hotProductList.innerHTML = html
        },
        handleFloor: function () {
            var _this = this
            utils.ajax({
                method: 'get',
                url: '/floors',
                success: function (data) {
                    if (data.code == 0) {
                        _this.renderFloor(data.data)
                    }
                },
                error: function (status) {
                    console.log(status)
                }
            })
        },
        renderFloor: function (list) {
            var len = list.length
            var html = ''
            var elevatorHtml = ''
            for (var i = 0; i < len; i++) {
                html += `<div class="floor-wrap">
                <div class="floor-title">
                    <a href="#">
                        <h2>F${list[i].num} ${list[i].title}</h2>
                    </a>
                </div>
                <ul class="product-list clearfix">`
                for (var j = 0, len2 = list[i].products.length; j < len2; j++) {
                    var product = list[i].products[j]
                    html += `<li class="product-item col-1 col-gap">
                    <a href="#">
                        <img width="180px" height="180px"
                            src="${product.mainImage}"
                            alt="">
                        <p class="product-name">
                        ${product.name}
                        </p>
                        <p class="product-price-paynum">
                            <span class="product-price">&yen; ${product.price}</span>
                            <span class="paynum">${product.payNums}人已经购买</span>
                        </p>
                    </a>
                </li>`
                }
                html += `</ul>
                </div>`
                // 根据楼层数生成电梯的代码
                elevatorHtml += `<a href="javascript:;" class="elevator-item">
                <span class="elevator-item-num">F${list[i].num}</span>
                <span class="elevator-item-text text-ellipsis" data-num="${i}">${list[i].title}</span>
            </a>`
            }
            elevatorHtml += `        <a href="javascript:;" class="backToTop">
            <span class="elevator-item-num"><i class="iconfont icon-jiantou"></i></span>
            <span class="elevator-item-text text-ellipsis" id="backToTop">顶部</span>
        </a>`
            this.floor.innerHTML = html
            this.elevator.innerHTML = elevatorHtml
            this.floors = d.querySelectorAll('.floor-wrap')
            this.elevatorItems = d.querySelectorAll('.elevator-item')
        },
        handleElevator: function () {
            var _this = this
            //点击电梯，到达指定楼层
            this.elevator.addEventListener('click', function (event) {
                var elem = event.target
                if (elem.id == 'backToTop') {
                    // 回到顶部
                    d.documentElement.scrollTop = 0
                } else if (elem.className == 'elevator-item-text text-ellipsis') {
                    //到达指定楼层
                    var num = elem.getAttribute('data-num')
                    if (!_this.floors) {
                        return
                    }
                    var floor = _this.floors[num]
                    d.documentElement.scrollTop = floor.offsetTop
                }
            }, false)
            // 楼层进入可视区，电梯的状态
            var betterSetElevator = function () {
                if (_this.elevatorTimer) {
                    clearTimeout(_this.elevatorTimer)
                }
                _this.elevatorTimer = setTimeout(function () {
                    _this.setElevator()
                }, 200)
            }
            w.addEventListener('scroll', betterSetElevator, false)
            w.addEventListener('resize', betterSetElevator, false)
            w.addEventListener('load', betterSetElevator, false)
        },
        setElevator: function () {
            if (!this.elevatorItems) {
                return
            }
            var num = this.getFloorNum()
            if (num == -1) {
                utils.hide(this.elevator)
            } else {
                utils.show(this.elevator)
                for (var i = 0, len = this.elevatorItems.length; i < len; i++) {
                    if (num == i) {
                        this.elevatorItems[i].className = 'elevator-item elevator-active'
                    } else {
                        this.elevatorItems[i].className = 'elevator-item'
                    }
                }
            }
        },
        getFloorNum: function () {
            // 设置一个默认的楼层号 顶部为-1层
            var num = -1
            if (!this.floors) {
                return num
            }
            for (var i = 0, len = this.floors.length; i < len; i++) {
                var floor = this.floors[i]
                num = i
                if (floor.offsetTop > d.documentElement.scrollTop + d.documentElement.clientHeight / 2) {
                    num = i - 1
                    break
                }
            }
            return num
        }
    }
    pag.init()
})(window, document);