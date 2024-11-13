const silent = {
    init: function() {
        this.appendDummyInput('NAME')
            .appendField('黙秘する');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setOutput(true, 'Action');
        this.setTooltip('あなたはこのブロックにより、黙秘を選択することができます。');
        this.setHelpUrl('');
        this.setColour(60);
    }
};
Blockly.common.defineBlocks({ silent: silent });

javascript.javascriptGenerator.forBlock['silent'] = function() {
    const code = "this.send(true);\n";
    return code;
};


const confess = {
    init: function() {
        this.appendDummyInput('NAME')
            .appendField('自白する');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setOutput(true, 'Action');
        this.setTooltip('あなたはこのブロックにより、自白を選択することができます。');
        this.setHelpUrl('');
        this.setColour(225);
    }
};
Blockly.common.defineBlocks({ confess: confess });

javascript.javascriptGenerator.forBlock['confess'] = function() {
    const code = "this.send(false);\n";
    return code;
};

const oppo_silent = {
    init: function() {
        this.appendDummyInput('opponent')
            .appendField('相手が "黙秘"');
        this.setOutput(true, 'Boolean');
        this.setTooltip('相手が黙秘したときの行動を選択できます。');
        this.setHelpUrl('');
        this.setColour(60);
    }
};
Blockly.common.defineBlocks({ oppo_silent: oppo_silent });
javascript.javascriptGenerator.forBlock['oppo_silent'] = function() {
    const code = "true\n";
    return [code, javascript.Order.NONE];
};

const oppo_confess = {
    init: function() {
        this.appendDummyInput('opponent')
            .appendField('相手が "自白"');
        this.setOutput(true, 'Boolean');
        this.setTooltip('相手が自白したときの行動を選択できます。');
        this.setHelpUrl('');
        this.setColour(225);
    }
};
Blockly.common.defineBlocks({ oppo_confess: oppo_confess });

javascript.javascriptGenerator.forBlock['oppo_confess'] = function() {
    const code = "false\n";
    return [code, javascript.Order.NONE];
};

const refer_oppo = {
    init: function() {
        this.appendValueInput('pastTurn')
            .setCheck('Number');
        this.appendValueInput('ifOppoAction')
            .appendField('ターン前、相手が')
            .setCheck('Boolean');
        this.appendDummyInput('NAME')
            .appendField('のとき');
        this.appendStatementInput('insideCode')
            .appendField('実行');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip('相手の行動を参照して、自分の行動を選択できます。');
        this.setHelpUrl('');
        this.setColour(285);
    }
};
Blockly.common.defineBlocks({ refer_oppo: refer_oppo });

javascript.javascriptGenerator.forBlock['refer_oppo'] = function(block) {
    const pastTurn = Blockly.JavaScript.valueToCode(block, 'pastTurn', Blockly.JavaScript.ORDER_ATOMIC);
    const ifOppoAction = Blockly.JavaScript.valueToCode(block, 'ifOppoAction', Blockly.JavaScript.ORDER_ATOMIC);
    const insideCode = Blockly.JavaScript.statementToCode(block, 'insideCode');

    const code = `if(this.refer(${pastTurn}, ${ifOppoAction})){ ${insideCode} }\nelse if(this.refer(${pastTurn}, ${ifOppoAction}) == undefined){\nthis.flag = false;\n${insideCode}\nthis.flag = true;\n}\n`;
    return code;
};

Blockly.Blocks['math_number'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldNumber(1, 1, 10, 1), 'NUM');
    this.setTooltip('数値を入力します。');
    this.setOutput(true, 'Number');
    this.setColour(210);
  }
};
