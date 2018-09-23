"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const ws_1 = require("ws");
const path = require("path");
const app = express();
//处理静态资源
app.use('/', express.static(path.join(__dirname, '..', 'client')));
app.get('/api/stock', (req, res) => {
    let result = stocks;
    let params = req.query;
    if (params.name) {
        result = result.filter(stock => {
            stock.name.indexOf(params.name) !== -1;
        });
        console.log(result);
    }
    res.json(result);
});
app.get('/api/stock/:id', (req, res) => {
    res.json(stocks.find(stock => stock.id == req.params.id));
});
const sever = app.listen(8000, "localhost", () => {
    console.log('sever is started at localhost:8000');
});
//存放所有连接的客户端
const subscriptions = new Set();
// 建立websocket 客户端
const wsServer = new ws_1.Server({ port: 8085 });
wsServer.on("connection", websocket => {
    subscriptions.add(websocket);
});
var messageCount = 0;
//每隔两秒 检测ws客户端是否连接 如果是的 消息数量加一显示 这一步模拟有消息传入
setInterval(() => {
    subscriptions.forEach(ws => {
        if (ws.readyState === 1) {
            ws.send(JSON.stringify({ messageCount: messageCount++ }));
        }
        else {
            subscriptions.delete(ws);
        }
    });
}, 2300);
class Stock {
    constructor(id, name, price, rating, desc, categories) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.rating = rating;
        this.desc = desc;
        this.categories = categories;
    }
}
exports.Stock = Stock;
const stocks = [
    new Stock(1, "Telstra", 1.20, 4, "Australia largest telecom company", ["IT",]),
    new Stock(2, "Vodaphone", 5.45, 5, "Australia second largest telecom company", ["Finance"]),
    new Stock(3, "HUAWEI", 4.23, 3, "China largest telecom company", ["Marketing"]),
    new Stock(4, "Lenovo", 6.66, 2, "China largest PC company", ["Telecom", "No.1"]),
    new Stock(5, "Intel", 7.45, 1, "America largest chips company", ["Telecom", "No.1"]),
    new Stock(6, "A2", 20.23, 2, "Australia largest dairy company", ["Telecom", "No.1"]),
    new Stock(7, "ANZ", 89.2, 3, "Australia largest Bank company", ["Telecom", "No.1"])
];
