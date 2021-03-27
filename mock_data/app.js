var express = require('express');
var Mock = require('mockjs');

var app = express()

//处理跨域
app.use((req, res, next) => {
    res.append("Access-Control-Allow-Origin", "*");
    res.append("Access-Control-Allow-Credentials", true);
    res.append("Access-Control-Allow-Methods", "GET, POST, PUT,DELETE");
    res.append("Access-Control-Allow-Headers", "Content-Type, X-Requested-With,X-File-Name");
    next();
})

//获取购物车数量接口
app.get('/carts/count', function (req, res) {
    res.json(Mock.mock({
        "code": 0,
        "data|1-100": 100
    }))
})
//获取购物车数据接口
app.get('/carts', function (req, res) {
    res.json(Mock.mock({
        "code": 0,
        "data": {
            "allChecked": '@boolean',
            "totalCartPrice |1-9999": 1,
            "_id": "@id",
            "cartList|0-10": [
                {
                    "count|1-10": 1,
                    "totalPrice": 9999,
                    "checked": '@boolean',
                    "_id": "@id",
                    "product": {
                        "_id": "@id",
                        "name": "@cword(3, 120)",
                        "mainImage": "@image('200x200',@color())",
                        "price|1-9999": 1,
                        "stock|1-9999": 1
                    },
                    "attr": "颜色:白色;"
                }
            ]
        }
    }))
})
//搜索框数据接口
app.get('/products/search', function (req, res) {
    res.json(Mock.mock({
        "code": 0,
        "data|0-10": [
            {
                "_id": "@string('lower',24)",
                "name": "@cword(3, 120)",
            }
        ]
    }))
})
//获取父级分类的接口
app.get('/categories/arrayCategories', function (req, res) {
    res.json(Mock.mock({
        "code": 0,
        "data|10": [
            {
                "level": 1,
                "isShow": "1",
                "isFloor": "0",
                "order": 0,
                "_id": "@string('lower',24)",
                "name": "@cword(4)",
                "mobileName": "@cword(4)",
                "icon": "@image('200x200',@color())"
            }
        ]
    }))
})
//获取子数据分类接口
app.get('/categories/childArrayCategories', function (req, res) {
    res.json(Mock.mock({
        "code": 0,
        "data|1-15": [
            {
                "level": 2,
                "isShow": "1",
                "isFloor": "0",
                "order": 0,
                "_id": "@string('lower',24)",
                "name": "@cword(4)",
                "mobileName": "@cword(4)",
                "icon": "@image('200x200',@color())"
            }
        ]
    }))
})
//轮播图数据接口
app.get('/ads/positionAds', function (req, res) {
    res.json(Mock.mock({
        "code": 0,
        "data|3-7": [
            {
                "position": "1",
                "order": 0,
                "isShow": "1",
                "_id": "@string('lower',24)",
                "name": "@word(4)",
                "imageUrl": "@image('862x440',@color())",
                "link": "http://mall.kuazhu.com/detail.html?productId=5ea68e9e5dbe7a0023712b03"
            },
        ]
    }))
})
//热销商品数据接口
app.get('/products/hot', function (req, res) {
    res.json(Mock.mock({
        "code": 0,
        "data|4": [
            {
                "order": 0,
                "isShow": "1",
                "isHot": "1",
                "payNums|1-9999": 0,
                "_id": "@string('lower',24)",
                "name": "@cword(3, 120)",
                "mainImage": "@image('200x200',@color())",
                "price|1-9999": 1
            }
        ]
    }))
})
//楼层数据的接口
app.get('/floors', function (req, res) {
    res.json(Mock.mock({
        "code": 0,
        "data|4": [
            {
                "title": "@cword(4)",
                "id": "@string('lower',24)",
                "products|10": [
                    {
                        "status": "1",
                        "order": 0,
                        "isShow": "1",
                        "isHot": "1",
                        "payNums|1-9999": 0,
                        "_id": "@string('lower',24)",
                        "name": "@cword(3, 120)",
                        "mainImage": "@image('200x200',@color())",
                        "price|1-9999": 1,
                        "stock|1-9999": 1,
                    }
                ],
                "order": 0,
                "num|+1": 1
            }
        ]
    }))
})

app.listen('3000', function () {
    console.log('server is running on http://127.0.0.1:3000');
})