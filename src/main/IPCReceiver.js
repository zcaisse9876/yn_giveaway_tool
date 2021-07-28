const { ipcMain, dialog } = require('electron');
const crypto = require('crypto');
const fs = require('fs');

const ipcLog = (info) => {
  const spacer = "-".repeat(10);
  const divider = `${spacer} IPCMain - ${new Date().toLocaleTimeString()} ${spacer}`;
  console.log(divider);
  console.log(info);
  console.log(divider);
};

class IPCReceiver {
  constructor(win) {
    this.win = win;
    ipcMain.on('import-data', (event, args) => { this.getPathFromUser(); });
    ipcMain.on('read-data', (event, args) => { this.readFileUTF8(args); });
    ipcMain.on('random-int', (event, args) => { this.generateRandomInt(args.min, args.max); })
  }

  getPathFromUser(event, args) {
    dialog.showOpenDialog({ properties: ['openFile'] })
      .then(res => {
        ipcLog(JSON.stringify({ data: res }));
        this.win.webContents.send('import-data', { data: res });
      })
      .catch(err => {
        ipcLog(JSON.stringify({ err }));
        this.win.webContents.send('import-data', { err });
      });
  }

  readFileUTF8(path) {
    fs.readFile(path, { encoding: "utf8" }, (err, data) => {
      if (err) {
        ipcLog(JSON.stringify({ err }));
        this.win.webContents.send('read-data', { err });
      } else {
        ipcLog(JSON.stringify({ data }));
        this.win.webContents.send('read-data', { data });
      }
    });
  }

  generateRandomInt(min, max) {
    const n = crypto.randomInt(min, max + 1);
    ipcLog(`Generated Crypto Random Number: ${n}`);
    this.win.webContents.send('random-int',  n);
  }
}

module.exports = IPCReceiver;