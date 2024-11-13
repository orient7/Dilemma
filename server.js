'use strict';

// モジュール
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

// オブジェクト
const app = express();
const server = http.Server(app);
const io = socketIO(server);

// 定数
const PORT = process.env.PORT || 1337;

// 部屋の情報を管理するオブジェクト
const rooms = {};

// 接続時の処理
// ・サーバーとクライアントの接続が確立すると、
// 　サーバー側で、'connection'イベント
// 　クライアント側で、'connect'イベントが発生する
io.on(
    'connection',
    (socket) => {
        console.log('connection : socket.id = %s', socket.id);

        // クライアントからのイベントリスナー
        socket.on('enter-the-room', (data) => {
            // 空いている部屋を探すか、新しい部屋を作成する
            const room = findAvailableRoom() || createRoom();

            // 部屋に参加させる
            socket.join(room);

            // 部屋の状態を更新
            rooms[room].players.push(socket.id);

            // 部屋が満員になった場合、ゲーム開始などの処理を行う
            if (rooms[room].players.length === 2) {
                // ゲーム開始のイベントを送信
                io.to(room).emit('start-the-game', room);

                console.log(rooms);
            }
        });

        socket.on('send-the-action', (data) => {
            // 相手に自分の行動を送信
            io.to(data.room).emit('receive-the-action', data);
        });

        socket.on('end-the-action', (data) => {
            // 行動の終了を送信
            io.to(data.room).emit('end-the-action', data);
        });

        socket.on('end-the-game', (data) => {
            // 部屋から退出したユーザーを削除し、部屋の状態を更新
            const room = findRoomBySocketId(socket.id);
            if (room) {
                rooms[room].players = rooms[room].players.filter(id => id !== socket.id);

                // ゲーム終了のイベントを送信
                io.to(room).emit('end-the-game', true);
            }
        });

        // 切断時の処理の指定
        // ・クライアントが切断したら、サーバー側では'disconnect'イベントが発生する
        socket.on('disconnect',
            () => {
                console.log('disconnect : socket.id = %s', socket.id);
                // 部屋から退出したユーザーを削除し、部屋の状態を更新
                const room = findRoomBySocketId(socket.id);
                if (room) {
                    rooms[room].players = rooms[room].players.filter(id => id !== socket.id);

                    // ゲーム終了のイベントを送信
                    io.to(room).emit('end-the-game', false);
                }
            });
    });

// 空いている部屋を探す関数
function findAvailableRoom() {
    for (const roomId in rooms) {
        if (rooms[roomId].players.length < 2) {
            return roomId;
        }
    }
    return null;
}

// 新しい部屋を作成する関数
function createRoom() {
    const roomId = generateRoomId();
    rooms[roomId] = {
        players: []
    };
    return roomId;
}

// Socket IDから部屋を探す関数
function findRoomBySocketId(socketId) {
    for (const roomId in rooms) {
        if (rooms[roomId].players.includes(socketId)) {
            return roomId;
        }
    }
    return null;
}

// ランダムな部屋IDを生成する関数
function generateRoomId() {
    return Math.random().toString(36).substring(2, 9);
}

// 公開フォルダの指定
app.use(express.static(__dirname + '/public'));

// サーバーの起動
server.listen(
    PORT,
    () => {
        console.log('Server on port %d', PORT);
    });
