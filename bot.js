const fs = require('fs');
const path = require('path');
const request = require('request');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');

const QQ = require('./lib/qq');
const Common = require('./lib/common');
const Aws = require('./lib/aws');

const configFile = fs.readFileSync(path.resolve(__dirname, './config.json'), 'utf8');
const config = JSON.parse(configFile);
const app = new Koa();

app.use(bodyParser());
app.use(async ctx => {
  const qqMessage = ctx.request.body;
  //console.log(ctx.request.body);
  if(qqMessage){
    ctx.body = 'Get message!';
    const messageContent = ctx.request.body.raw_message;
    const command = QQ.readCommand(messageContent);
    const messageType = ctx.request.body.message_type;
    const userId = ctx.request.body.user_id;
    let senderId = userId;
    //如果發送者為群，將senderId設為group_id
    if(ctx.request.body.group_id){
      senderId = ctx.request.body.group_id;
    }
    switch(command){
      case 'help':
      _getHelp(senderId, messageType);
      break;

      case 'info':
      _getInfo(senderId, messageType);
      break;

      case 'status':
      _checkStatus(senderId, messageType);
      break;

      case 'start':
      _startServer(senderId, messageType);
      break;

      case 'stop':
      _stopServer(senderId, messageType);
      break;

      case 'roll':
      _roll(senderId, messageType, messageContent);
      break;

      case 'choose':
      _choose(senderId, messageType, messageContent);
      break;
    }
  }else{
    ctx.body = 'Please provide QQ message.';
  }
});

console.log('Start at 2022 port.');
app.listen(2022);

function _getHelp(senderId, messageType){
  let content = '目前指令：';
  content += '\n /info 查看伺服器訊息';
  content += '\n /status 檢查伺服器狀態';
  content += '\n /start 啟動伺服器';
  content += '\n /stop 停止伺服器';
  content += '\n /roll (骰子數量)d(骰子面數) 擲骰功能。範例：1顆100面的骰子= 1d100';
  content += '\n /choose (選項) 睡鼠老師，幫我選擇！格式範例：選項1|選項2。建議小窗使用。';
  QQ.sendMessage(request, senderId, messageType, content).then((result) => {
    console.log(result);
  });
}

async function _checkStatus(senderId, messageType){
  const status = await Aws.checkStatus(request, config);

  let content = '僵毀伺服器目前狀態為（本狀態未必準確，問就是API傻逼）: ';

  if(status === 'running'){
    content += '正在運行✧◝(⁰▿⁰)◜✧';
  }else{
    content += '尚未啟動或正在啟動（¯﹃¯）';
  }
  QQ.sendMessage(request, senderId, messageType, content).then((result) => {
    console.log(result);
  });
}

async function _startServer(senderId, messageType){
  const startResult = await Aws.startServer(request, config);
  let content = '僵毀伺服器正在啟動。需時大約3-5分鐘左右！';
  QQ.sendMessage(request, senderId, messageType, content).then((result) => {
    console.log(result);
  });
}

async function _stopServer(senderId, messageType){
  const stopResult = await Aws.stopServer(request, config);
  let content = '僵毀伺服器正在關閉。晚安✧*｡٩(ˊᗜˋ*)و✧*｡ ';

  QQ.sendMessage(request, senderId, messageType, content).then((result) => {
    console.log(result);
  });
}

function _getInfo(senderId, messageType){
  const serverInfo = config['serverInfo'];
  const serverIp = serverInfo['serverIp'];
  const serverDomain = serverInfo['serverDomain'];
  const serverPort = serverInfo['serverPort'];

  let content = '伺服器資訊(手動更新)：';
  content += `\n伺服器位址：${serverDomain} / ${serverIp}`;
  content += `\n伺服器端口：${serverPort}`;

  QQ.sendMessage(request, senderId, messageType, content).then((result) => {
    console.log(result);
  });
}

function _roll(senderId, messageType, messageContent){
  const rollRegax = /(\/roll) ([0-9]+)d([0-9]+)/;
  const diceNumber = parseInt(rollRegax.exec(messageContent)[2]);
  const rollNumber = parseInt(rollRegax.exec(messageContent)[3]);
  const rollResult = Common.rollDice(diceNumber, rollNumber).toString();
  const content = diceNumber + 'd' + rollNumber + '擲骰結果：' + rollResult;
  QQ.sendMessage(request, senderId, messageType, content).then((result) => {
    console.log(result);
  }).catch((err) => {
    console.log(err);
  });
}

function _choose(senderId, messageType, messageContent){
  const chooseRegax = /^(\/choose) ([\s\S]*)$/;
  const optionsString = chooseRegax.exec(messageContent)[2];
  const options = optionsString.split('|');
  let content = '';
  if(options.length !== 0){
    const result = Common.choose(options);
    content = '隨機選擇結果：' + result;
  }else{
    content = '格式不符合！';
  }
  QQ.sendMessage(request, senderId, messageType, content).then((result) => {
    console.log(result);
  }).catch((err) => {
    console.log(err);
  });
}
