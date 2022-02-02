const fs = require('fs');
const path = require("path");
const random = require('random');

const Common = {
    rollDice(diceNum, rollNum){
        const diceResults = [];
        for(let i = 0; i < diceNum; i++){
            const diceResult = random.int(1, rollNum);
            diceResults.push(diceResult);
        }
        return diceResults;
    },
    choose(options){
        const index = random.int(0, options.length -1);
        const result = options[index];
        return result;
    },
    _shuffle(arr){
        var i = arr.length, t, j;
        while (i) {
            j = Math.floor(Math.random() * i--);
            t = arr[i];
            arr[i] = arr[j];
            arr[j] = t;
      }
    },
}
module.exports = Common;
