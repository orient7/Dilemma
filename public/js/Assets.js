// 描画に関する設定クラス
class Assets {
    constructor(vw, vh) {
        this.vw = vw;
        this.vh = vh;

        // 描画カラー
        this.lineColor = 'white';

        // エフェクトの描画
        this.effectSize = {
            min: this.vw,
            max: this.vw * 6,
        };

        this.effectSpeed = {
            min: this.vh * -0.8,
            max: this.vh * -0.2,
        };

        this.effectLineWidth = this.vw * 0.08;

        // リザルトの描画
        this.resultMyText = {
            fontsize: this.vw * 3.5,
            x: this.vw * 5,
            y: this.vh * 20,
        };

        this.resultOppoText = {
            fontsize: this.vw * 3.5,
            x: this.vw * 55,
            y: this.vh * 20,
        };
        
        this.resultNumFontSize = this.vw * 6;
        
        this.resultMyNum = {
            x: this.vw * 5,
            y: this.vh * 45,
        };

        this.resultOppoNum = {
            x: this.vw * 55,
            y: this.vh * 45,
        };
        
        this.resultUnitFontSize = this.vw * 3.5;
        
        this.resultMyUnit = {
            x: this.vw * 44,
            y: this.vh * 45,
        };
        
        this.resultOppoUnit = {
            x: this.vw * 94,
            y: this.vh * 45,
        };
        
        this.resultText = {
            fontsize: this.vw * 6,
            y: this.vh * 70,
        };

        this.resultNumBetween = this.vw * 4.8;
    }
}
