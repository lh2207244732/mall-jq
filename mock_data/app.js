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

app.listen('3000', function () {
    console.log('server is running on http://127.0.0.1:3000');
})