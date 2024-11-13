// オブジェクト
const socket = io.connect(); // クライアントからサーバーへの接続要求

// Blocklyの初期化
const workspace = Blockly.inject('blocklyDiv', { toolbox: document.getElementById('toolbox') });

// キャンバス
const canvas = document.querySelector('#canvas-2d');
const context = canvas.getContext('2d');

// キャンバスの初期化
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// コンテキストの初期化
// アンチエイリアスの抑止（画像がぼやけるのの防止）以下４行
context.mozImageSmoothingEnabled = false;
context.webkitImageSmoothingEnabled = false;
context.msImageSmoothingEnabled = false;
context.imageSmoothingEnabled = false;

let effect = [];
let counter = [];

let flag = false;
let ui;
let game;
let aElement;
let sleep;

function Home() {
    if (!flag) {
        aElement = document.createElement('img');
        aElement.src = './images/title.png';
        aElement.className = 'title animate__animated animate__bounceInDown';
        $('#elementDiv').append(aElement);

        aElement = document.createElement('div');
        aElement.className = 'parent';
        $('#elementDiv').append(aElement);

        $(aElement).css({ 'margin-top': '10vh' })

        aElement = document.createElement('div');
        aElement.textContent = 'スタート';
        aElement.className = 'option animate__animated animate__rubberBand';
        aElement.onclick = function() {
            // サーバーに'enter-the-room'を送信
            socket.emit('enter-the-room');

            gameChange(Load);
        };
        $('.parent').append(aElement);

        aElement = document.createElement('div');
        aElement.textContent = '遊び方';
        aElement.className = 'option animate__animated animate__rubberBand';
        aElement.onclick = function() {
            alert('未実装です。');
        };
        $('.parent').append(aElement);

        aElement = document.createElement('div');
        aElement.textContent = '囚人のジレンマとは？';
        aElement.className = 'option animate__animated animate__rubberBand';
        aElement.onclick = function() {
            alert('未実装です。');
        };
        $('.parent').append(aElement);

        flag = true;
    }
    for (let i = 0; i < effect.length; i++) {
        effect[i].render();
        effect[i].update();
    }
}

function Load() {
    if (!flag) {
        aElement = document.createElement('div');
        aElement.className = 'parent';
        $('#elementDiv').append(aElement);

        aElement = document.createElement('div');
        aElement.className = 'load animate__animated animate__bounceInDown';
        aElement.textContent = 'マッチング中です。たぶんマッチングしません...';
        $('.parent').append(aElement);

        flag = true;
    }
    for (let i = 0; i < effect.length; i++) {
        effect[i].render();
        effect[i].update();
    }
}

function Play() {
    if (!flag) {
        aElement = document.createElement('div');
        aElement.className = 'animation';
        $('#elementDiv').append(aElement);

        aElement = document.createElement('div');
        aElement.textContent = 'マッチングしました！';
        aElement.className = 'animation_text';
        $('.animation').append(aElement);

        aElement = document.createElement('div');
        aElement.textContent = 'パターンを作成しよう！';
        aElement.className = 'instruction animate__animated animate__rubberBand';
        $('#elementDiv').append(aElement);

        aElement = document.createElement('div');
        aElement.textContent = '決定！';
        aElement.className = 'confirm animate__animated animate__rubberBand';
        aElement.onclick = function() {
            // checkCodeからの返り値がtrueであればボタンを消去
            if (game.checkCode()) {
                aElement.remove();
            }
        };
        $('#elementDiv').append(aElement);

        $('#blocklyDiv').show();

        flag = true;
    }
}

function Result() {
    if (!flag) {
        aElement = document.createElement('div');
        aElement.className = 'parent';
        $('#elementDiv').append(aElement);

        $(aElement).css({ 'margin-top': '80vh' })

        aElement = document.createElement('div');
        aElement.textContent = '終わり';
        aElement.className = 'option animate__animated animate__rubberBand';
        aElement.onclick = function() {
            gameChange(Home);
        };
        $('.parent').append(aElement);

        aElement = document.createElement('div');
        aElement.textContent = 'もう一度遊ぶ！';
        aElement.className = 'option animate__animated animate__rubberBand';
        aElement.onclick = function() {
            // サーバーに'enter-the-room'を送信
            socket.emit('enter-the-room');

            gameChange(Load);
        };
        $('.parent').append(aElement);

        for (let i = 0; i < 8; i++) {
            const x = 80 + i * 60;
            const y = 300;
            let number = 0;

            if (String(game.myPoint)[i]) {
                number = Number(String(game.myPoint)[i]);
            }
            const duration = 500 - i * 50;
            counter.push(new Counter(x, y, number, duration));
        }

        for (let i = 0; i < 8; i++) {
            const x = (canvas.width / 2 + 80) + i * 60;
            const y = 300;
            let number = 0;
            if (String(game.oppoPoint)[i]) {
                number = Number(String(game.oppoPoint)[i]);
            }
            const duration = 500 - i * 50;
            counter.push(new Counter(x, y, number, duration));
        }

        sleep = 600;

        flag = true;
    }

    let str, x, y, w;

    context.save();

    str = 'あなたの懲役は...';
    x = 80;
    y = 150;
    context.fillStyle = 'white';
    context.font = '40px null';
    context.fillText(str, x, y);

    context.restore();

    context.save();

    str = '相手の懲役は...';
    x = canvas.width / 2 + 80;
    y = 150;
    context.fillStyle = 'white';
    context.font = '40px null';
    context.fillText(str, x, y);

    context.restore();

    context.save();
    context.fillStyle = 'white';
    context.font = '50px null';

    str = '年';
    x = (canvas.width / 2) - 100;
    y = 300;
    context.fillText(str, x, y);

    x = canvas.width - 100;
    context.fillText(str, x, y);

    context.restore();

    if ((sleep--) <= 0) {
        context.save();

        context.fillStyle = 'white';
        context.font = '80px null';

        str = 'どちらかが勝ちました！';

        if (game.myPoint > game.oppoPoint) {
            str = 'あなたの勝利！';
        }
        else if (game.myPoint < game.oppoPoint) {
            str = 'あなたの敗北！';
        }
        if (game.myPoint == game.oppoPoint) {
            str = '引き分け！';
        }

        w = context.measureText(str).width;
        x = canvas.width / 2 - w / 2;
        y = 450;

        context.fillText(str, x, y);

        context.restore();
    }

    for (let i = 0; i < counter.length; i++) {
        counter[i].render();
        counter[i].update();
    }

}

class Effect {
    constructor() {
        this.x = rand(0, canvas.width);
        this.y = rand(canvas.height, canvas.height + 100);
        this.angle = rand(0, 360);
        this.size = rand(10, 60);
        this.vy = rand(-4, -1);
        this.vangle = rand(128, 256);
    }

    render() {
        context.save();

        // タンクの座標値に移動
        context.translate(this.x, this.y);

        // 画像描画
        context.save();

        context.strokeStyle = 'white';

        context.rotate(this.angle);
        context.strokeRect(-this.size * 0.5, -this.size * 0.5, this.size, this.size);
        context.restore();

        context.restore();
    }

    update() {
        this.y += this.vy;
        this.angle += 1 / this.vangle;

        if (this.y <= -this.size) {
            this.y = canvas.height;
            this.x = rand(0, canvas.width);
        }
    }
}

class Counter {
    constructor(x, y, number, duration) {
        this.x = x;
        this.y = y;
        this.number = number;
        this.count = 0;
        this.duration = duration;
    }

    render() {
        context.save();

        context.fillStyle = 'white';
        context.font = '80px null';
        context.fillText(this.count, this.x, this.y);

        context.restore();
    }

    update() {
        if ((this.duration--) <= 0) {
            this.duration = 0;
            this.count = this.number;
        }
        else {
            if ((this.count++) >= 9) this.count = 0;
        }
    }
}

function gameAnimate(iTimeCurrent) {
    requestAnimationFrame(
        (iTimeCurrent) => {
            gameAnimate(iTimeCurrent);
        });

    // キャンバスのクリア
    context.clearRect(0, 0, canvas.width, canvas.height);

    ui();
}

function gameChange(f) {
    $('#blocklyDiv').hide();
    $('#elementDiv').empty();

    counter = [];
    flag = false;
    ui = f;
}

// ソケットの初期化
function initSocket(socket) {
    // 接続確立時の処理
    // ・サーバーとクライアントの接続が確立すると、
    // 　サーバーで、'connection'イベント
    // 　クライアントで、'connect'イベントが発生する
    socket.on(
        'connect',
        () => {
            console.log('connect : socket.id = %s', socket.id);
            // サーバーに'enter-the-game'を送信
            socket.emit('enter-the-game');
        });

    // サーバーからのイベントリスナー
    socket.on('start-the-game', (room) => {
        game = new Game(room, socket);
        gameChange(Play);
    });

    socket.on('receive-the-action', (data) => {
        if (data.socketId !== socket.id) {
            game.oppoAction = data.array;

            if (game.check && !game.myEnd) game.doCode();
        }
    });

    socket.on('end-the-action', (data) => {
        if (data.socketId == socket.id) {
            game.myEnd = true;
        }
        else {
            game.oppoEnd = true;
        }

        if (game.myEnd && game.oppoEnd) {
            // サーバーに'end-the-game'を送信
            socket.emit('end-the-game');
        }
    });

    socket.on('end-the-game', (result) => {
        if (result) game.result();
        else {
            alert('相手との通信が切断されました！！許せない！！');
            gameChange(Load);
        }
    });
}

// ページ読み込み後実行
$(window).on('load', function() {
    gameChange(Home);

    // キャンバスの描画開始
    gameAnimate(0);

    // ソケットの初期化
    initSocket(socket);

    // エフェクトの追加
    for (let i = 0; i < 64; i++) {
        effect.push(new Effect());
    }
});

// ページがunloadされる時（閉じる時、再読み込み時、別ページへ移動時）は、通信を切断する
$(window).on(
    'beforeunload',
    (event) => {
        socket.disconnect();
    });

const rand = function(min, max) {
    // 整数指定
    // return Math.floor(Math.random() * (max - min + 1)) + min;

    return Math.random() * (max - min + 1) + min;
};

// キャンバス内でのマウスの座標を取得
// canvas.addEventListener('mousemove', (e) => {
//     const w = window.innerHeight * (canvas.width / canvas.height);

//     if (window.innerWidth < w) {
//         const finalHeight = window.innerWidth * canvas.height / canvas.width
//         let margin = ((window.innerHeight - finalHeight) / 2) * (canvas.height / finalHeight);
//         screen.mouseX = e.clientX * (canvas.width / window.innerWidth);
//         screen.mouseY = e.clientY * (canvas.height / finalHeight) - margin;
//     }
//     else if (window.innerWidth > w) {
//         const finalWidth = window.innerHeight * canvas.width / canvas.height
//         let margin = ((window.innerWidth - finalWidth) / 2) * (canvas.width / finalWidth);
//         screen.mouseX = e.clientX * (canvas.width / finalWidth) - margin;
//         screen.mouseY = e.clientY * (canvas.height / window.innerHeight);
//     }
// });

// キャンバス内でのクリックの座標を取得
// canvas.addEventListener('click', (e) => {
//     const w = window.innerHeight * (canvas.width / canvas.height);

//     if (window.innerWidth < w) {
//         const finalHeight = window.innerWidth * canvas.height / canvas.width
//         let margin = ((window.innerHeight - finalHeight) / 2) * (canvas.height / finalHeight);
//         screen.clickX = e.clientX * (canvas.width / window.innerWidth);
//         screen.clickY = e.clientY * (canvas.height / finalHeight) - margin;
//     }
//     else if (window.innerWidth > w) {
//         const finalWidth = window.innerHeight * canvas.width / canvas.height
//         let margin = ((window.innerWidth - finalWidth) / 2) * (canvas.width / finalWidth);
//         screen.clickX = e.clientX * (canvas.width / finalWidth) - margin;
//         screen.clickY = e.clientY * (canvas.height / window.innerHeight);
//     }
// });
