const electron = require('electron')
const path = require('path')
const remote = electron.remote
const axios = require('axios')
const ipc = electron.ipcRenderer
const BrowserWindow = electron.remote.BrowserWindow

const notfiyBtn = document.getElementById('notifyBtn')
const notifier = require('electron-notifications')
var price = document.getElementById('price')
var targetPrice = document.getElementById('targetPrice')
// consoleTxtArea is a text area that will hold our console output
var consoleTxtArea = document.getElementById('console')
var targetPriceVal

function getBTC() {
    console.log('calling rest api to get price');
    axios.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC&tsyms=USD')
    .then(res => {
        const cryptos = res.data.BTC.USD
        price.innerHTML = '$' + cryptos.toLocaleString('en')

        var d = new Date();
        var msg = "\n" + d.toLocaleString() + " - refreshed value from min-api";
        //console.log('fetch price %d - targetPriceVale %d', res.data.BTC.USD, targetPriceVal)
        
        consoleTxtArea.innerHTML = consoleTxtArea.innerHTML += msg;
        consoleTxtArea.scrollTop = consoleTxtArea.scrollHeight;

        if (targetPrice.innerHTML != '' && targetPriceVal < res.data.BTC.USD) {
            var d = new Date();
            var msg = "\n" + d.toLocaleString() + " - firing notification";
            consoleTxtArea.innerHTML = consoleTxtArea.innerHTML += msg;
            consoleTxtArea.scrollTop = consoleTxtArea.scrollHeight;

            // fire notification
            // Full Options
            notifier.notify('Target Exceeded', {
                message: 'Bitcoin exceeded target price.',
                buttons: ['Dismiss'],
            });
            
        } else {
            var d = new Date();
            var msg = "\n" + d.toLocaleString() + " - not firing notification - targetPriceVal: " + targetPriceVal;
            consoleTxtArea.innerHTML = consoleTxtArea.innerHTML += msg;
            consoleTxtArea.scrollTop = consoleTxtArea.scrollHeight;
        }
    })
}

getBTC()

// this will set the h1 price value every 30 seconds
var intervalId;
intervalId = setInterval(getBTC, 15000);


notfiyBtn.addEventListener('click', function(event) {
    const modalPath = path.join('file://', __dirname, 'add.html')
    let win = new BrowserWindow({ frame: false, transparent: false, alwaysOnTop: true, width: 600, height: 300})
    win.on('close', function() { win = null })
    win.loadURL(modalPath)
    win.show()
})

// set the refresh rate for the BTC
refreshBtn.addEventListener('click', function(event) {
    var refreshRate = document.getElementById('refreshVal').value * 1000;
    if (intervalId) {
        clearInterval(intervalId);
    }
    intervalId = setInterval(getBTC, refreshRate);
    var d = new Date();
    var msg = "\n" + d.toLocaleString() + " - set refresh rate to " 
        + document.getElementById('refreshVal').value + " from index.html";
    consoleTxtArea.innerHTML = consoleTxtArea.innerHTML += msg;
})

// this gets here from main.js, who gets it from add.js
// sets targetPriceVal
ipc.on('targetPriceVal', function (event, arg) {
    targetPriceVal = Number(arg)
    targetPrice.innerHTML = '$'+targetPriceVal.toLocaleString('en')

    var d = new Date();
    var msg = "\n" + d.toLocaleString() + " - set notification value to " 
        + targetPriceVal.toLocaleString('en') + " from add.html";
    consoleTxtArea.innerHTML = consoleTxtArea.innerHTML += msg;
})

//
// close the notification when they click on dismiss
//
notification.on('buttonClicked', (text, buttonIndex, options) => {
    if (text === 'Snooze') {
      // Snooze!
    } else if(buttonIndex === 1) {
      //open options.url
    }
    notification.close()
  })