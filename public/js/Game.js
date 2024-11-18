class Game {
    constructor(room, socket) {
        this.socket = socket;
        this.room = room;
        this.code = null;
        this.myAction = [];
        this.oppoAction = [];
        this.testAction = [];
        this.check = false;
        this.test = false;
        this.flag = true;
        this.currentTurn = 0;
        this.myEnd = false;
        this.oppoEnd = false;
        this.myPoint = 0;
        this.oppoPoint = 0;
        this.exeNum = 10000;

        function getRandomBoolean() {
            return Math.random() < 0.5;
        }

        for (let i = 0; i < 10000; i++) {
            this.testAction[i] = getRandomBoolean();
        }
    }

    send(action) {
        if (this.flag) {
            this.myAction[this.currentTurn] = action;
        }
        else {
            this.myAction[this.currentTurn] = 'SKIP';
        }
        this.currentTurn++;
    }

    refer(pastTurn, ifOppoAction) {
        let targetAction;

        if (this.test) targetAction = this.testAction;
        else targetAction = this.oppoAction;

        if (targetAction[this.currentTurn - pastTurn] == ifOppoAction) {
            return true;
        }
        else if (targetAction[this.currentTurn - pastTurn] == !ifOppoAction) {
            return false;
        }
        else { // if (targetAction[currentTurn - pastTurn] == undefined) {
            return undefined;
        }
    }

    testCode() {
        this.test = true;

        //プログラムを実行
        try {
            eval(this.code);
        }
        catch (error) {
            console.log(error);

            return false;
        }

        if (!this.myAction.length) return false;

        const result = !this.myAction.includes('SKIP');

        this.currentTurn = 0;
        this.myAction = [];

        return result;
    }

    doCode() {
        this.test = false;

        //プログラムを実行
        try {
            while (this.myAction.length < this.exeNum) {
                eval(this.code);
            }
        }
        catch (error) {
            console.error(error);

            return false;
        }

        this.checkArray();
    }

    checkCode() {
        //ブロックからプログラム（文字列）を作成
        this.code = Blockly.JavaScript.workspaceToCode(workspace);;

        if (this.code) {
            if (this.testCode()) {
                this.check = true;

                return true;
            }
            else {
                alert('このコードではエラーが発生します');
                return false;
            }
        }
        else {
            alert('コードを作成してください。');
            return false;
        }
    }

    checkArray() {
        while(this.myAction.length > this.exeNum){
            this.myAction.pop();
        }
        
        this.socket.emit('send-the-action', {
            socketId: this.socket.id,
            room: this.room,
            array: this.myAction,
        });

        if (this.myAction.includes('SKIP')) {
            this.myAction = [];
            this.currentTurn = 0;
        }
        else {
            this.socket.emit('end-the-action', {
                socketId: this.socket.id,
                room: this.room,
            });
        }
    }

    result() {
        this.myPoint = 0;
        this.oppoPoint = 0;

        for (let i = 0; i < this.exeNum; i++) {
            const myAction = this.myAction[i];
            const oppoAction = this.oppoAction[i];

            // 両方とも黙秘した場合、両方に2ポイント
            if (myAction && oppoAction) {
                this.myPoint += 2;
                this.oppoPoint += 2;
            }

            // 片方のみ自白した場合、黙秘した方に10ポイント
            else if (myAction && !oppoAction) {
                this.myPoint += 10;
            }
            else if (!myAction && oppoAction) {
                this.oppoPoint += 10;
            }

            // 両方とも自白した場合、両方に5ポイント
            else if (!myAction && !oppoAction) {
                this.myPoint += 5;
                this.oppoPoint += 5;
            }
        }

        gameChange(Result);
    }
}
