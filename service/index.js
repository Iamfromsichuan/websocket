const {
    resolve
} = require('path');

const socketIO = require('socket.io');

const express = require('express');
const http = require('http');

const app = express();
const serve = http.createServer(app);

const io = socketIO(serve);

serve.listen(3000, () => {
    console.log('开启成功');
})

app.get('/', (req, res) => {
    res.redirect('http://localhost:8080/')
});
/** 这两个是会话信息 */
const singleMapper = {};
const moreMapper = {};
// 这个是客户信息
const customer = {

};

const SESSION_TYPE = {
    more: 0,
    single: 1,
}

const ACTION_TYPE = {
    in: 0, // 进
    out: 1, // 出
    writing: 2, // 正在写入
    content: 3, // 发送正式内容
}

// const pojo = {
//     // 自己的id
//     id: '',
//     // 本次发送的信息内容
//     msg: '',
//     // 聊天方的id
//     sideId: '',
//     // 动作类型
//     type: '',
//     // 会话类型
//     sessionType: '',
//     moreId: '',
// }

// 每一个对象，可以和多个对象聊天

io.on('connection', (socket) => {
    socket.on('login', data => {
        customer[data.id] = {
            ...data,
            socketId: socket.id,
        };
        io.emit('uerlist', JSON.stringify(customer));
    })

    socket.on('serve', dt => {
        const data = JSON.parse(dt);
        console.log(data);
        console.log(customer);
        // id是客户端随机生成id
        // socketId 是socket的id
        // sideId 是被连接端的id
        const {
            id = 0
        } = data;
        if (id) {
            // 如果是 点对点 聊天
            if (data.sessionType === SESSION_TYPE.single) {
                if (!singleMapper[id]) {
                    singleMapper[id] = {
                        ...data,
                        socketId: socket.id,
                    }
                }
                let socketId;
                try {
                    socketId = singleMapper[data.sideId].socketId;
                } catch (error) {
                    socketId = customer[data.key].socketId;
                    console.log('error', socketId);
                }
                io.sockets.sockets[socketId]
                    .emit("client", JSON.stringify(singleMapper[id]));
            } else if (data.sessionType === SESSION_TYPE.more) {
                const {
                    moreId
                } = data;
                if (!moreMapper[moreId]) {
                    moreMapper[moreId] = [];
                    moreMapper[moreId].push({
                        ...data,
                        id: socket.id,
                        moreId,
                    })
                }
                try {
                    moreMapper[moreId].filter(mr => {
                        io.sockets.sockets[mr.id]
                            .emit("client", JSON.stringify(mr));
                    })

                } catch (error) {
                    console.log(error);
                }
            }

        }
    });

    socket.on('disconnect', data => {
        console.log('disconnect');
        console.log(data);
    })

})


console.log(resolve);