const electron = require('electron')
const path = require('path')
const remote = electron.remote
const ipc = electron.ipcRenderer


// select the closeBtn value from add.html to work with
const closeBtn = document.getElementById('closeBtn')

closeBtn.addEventListener('click', function(event) {
    var window = remote.getCurrentWindow();
    window.close()
})


// select the updateBtn from add.html to work with
const updateBtn = document.getElementById('updateBtn')
updateBtn.addEventListener('click', function() {
    ipc.send('update-notify-value', document.getElementById('notifyVal').value)

    var window = remote.getCurrentWindow();
    window.close()
})