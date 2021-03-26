; (function ($) {
    var cache = {
        data: {

        },
        addData: function (keyword, value) {
            this.data[keyword] = value
        },
        getData: function (keyword) {
            return this.data[keyword]
        }
    }
    function Search($elem, options) {
        this.$elem = $elem
        this.$searchBtn = $elem.find(options.searchBtnSelector)
        this.$searchInput = $elem.find(options.searchInputSelector)
        this.$searchLayer = $elem.find(options.searchLayerSelector)
        this.$isAutocomplete = options.isAutocomplete
        this.url = options.url

        this.searchTimer = null
        this.isSearchLayerEmpty = true
        this.jqXHR = null

        this.init()
        if (this.$isAutocomplete) {
            this.autocomplete()
        }
    }
    Search.prototype = {
        constructor: Search,
        init: function () {
            // 点击提交搜索
            this.$searchBtn.on('click', $.proxy(this.submitSearch, this))
        },
        submitSearch: function () {
            var keyword = this.$searchInput.val()
            window.location.href = './list.html?keyword=' + keyword
        },
        autocomplete: function () {
            //自动提示
            this.$searchInput
                .on('input', function () {
                    if (this.searchTimer) {
                        clearTimeout(this.searchTimer)
                    }
                    this.searchTimer = setTimeout(function () {
                        this.getSearchData()
                    }.bind(this), 200)
                }.bind(this))
                // 获取焦点显示
                .on('focus', function () {
                    if (!this.isSearchLayerEmpty) {
                        this.$searchLayer.show()
                    }
                }.bind(this))
                //阻止输入框冒泡到document
                .on('click', function (event) {
                    event.stopPropagation()
                })
            //点击其他地方隐藏提示框
            $(document).on('click', function () {
                this.$searchLayer.hide()
            }.bind(this))
            //用事件代理处理动态提示层的提交
            var _this = this
            this.$searchLayer.on('click', '.search-item', function () {
                var keyword = $(this).html()
                _this.$searchInput.val(keyword)
                _this.submitSearch()
            })
        },
        getSearchData: function () {
            var keyword = this.$searchInput.val()
            var _this = this
            if (!keyword) {
                this.appendSearchLayerHTML('')
                return
            }
            if (cache.getData(keyword)) {
                // 如果搜索的内容存在，则直接渲染
                _this.renderSearchLayer(cache.getData(keyword))
                return
            }
            //终止上一次没有完成的请求
            if (this.jqXHR) {
                this.jqXHR.abort()
            }
            this.jqXHR = utils.ajax({
                method: "get",
                url: this.url,
                data: {
                    keyword: keyword
                },
                success: function (data) {
                    if (data.code == 0) {
                        //缓存搜索的数据到内存中
                        cache.addData(keyword, data.data)
                        _this.renderSearchLayer(data.data)
                    }
                },
                error: function (status) {
                    console.log('获取出错啦')
                },
                complete: function () {
                    _this.jqXHR = null
                }
            })
        },
        renderSearchLayer: function (list) {
            var len = list.length
            var html = ''
            if (len > 0) {
                for (var i = 0; i < len; i++) {
                    html += '<li class="search-item">' + list[i].name + '</li>'
                }
            }
            this.appendSearchLayerHTML(html)
        },
        appendSearchLayerHTML: function (html) {
            if (html) {
                this.$searchLayer.show()
                this.$searchLayer.html(html)
                this.isSearchLayerEmpty = false
            } else {
                this.$searchLayer.hide()
                this.$searchLayer.html(html)
                this.isSearchLayerEmpty = true
            }
        }

    }
    Search.DEFAULTS = {
        isAutocomplete: false,
        url: ''
    }
    $.fn.extend({
        search: function (options) {
            return this.each(function () {
                var $elem = $(this)
                var search = $elem.data('search')
                if (!search) {
                    options = $.extend({}, Search.DEFAULTS, options)
                    search = new Search($elem, options)
                    $elem.data('search', search)
                }
            })
        }
    })
})(jQuery)