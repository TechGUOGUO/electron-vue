'use strict'

import { app,Menu,shell, dialog, BrowserWindow ,globalShortcut, ipcMain } from 'electron'
import {
  createProtocol,
  installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib'
import {resolve,join,basename,dirname} from 'path'
import fs, { unlink, exists, existsSync } from 'fs'
import { resolveAssets } from './utils/utils'
import * as _ from 'lodash'
import request from 'request'
const isDevelopment = process.env.NODE_ENV !== 'production'
let staticFolder="";

let isAuto = false
//static folder
const template = [
  {
    label: '设置',
    submenu: [
      {label:'退出程序',
    click:() => {
      quit()
    }},
       { label:  '自动',
        click: () => {
          isAuto  =true
          autoPlay()

        }

      },
      {
        label:'取消自动',
        click:() => {
          isAuto =false;
        }
      }
    ]
  },
]
function quit(){
 app.quit()
}
const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(null)
if(isDevelopment){
  staticFolder =  join(app.getAppPath(),'../assets_config')
}else{
  staticFolder = join(app.getAppPath(),'../../assets_config')
} 
app.setPath('appData',staticFolder)

const windows  = [];
let mainWin 
let configUrlStr = fs.readFileSync(staticFolder+'/configurl.json').toString()
const configUrljosn = JSON.parse(configUrlStr.replace(/\s/g,''))
let configUrl =  configUrljosn.path

let config ;
let currentIndex = -1 
console.log(configUrl)
function getConfig(cb){
  request({
    url:configUrl
  },(err,res,body) => {
    console.log(body)
    config = JSON.parse(body)
    cb()
  })
}

let timer = null;

const runner = []
let currentWindow;
// const baseweb = 'http://www.hongyiyingxiao.com/bst'
// const baseweb = 'http://localhost:3000/index'
function autoPlay() {
  setTimeout(() => {
    if(isAuto){
      currentWindow && hideWindow(currentWindow.id)
      next()
      autoPlay()
    }
  },parseInt(config.play.time))
}
const path = require('path')
const renderProcessApi = path.join(__dirname, './inject.js')
function createWindow () {
  // let cstr = fs.readFileSync(staticFolder+'/config.json').toString()
  // config = JSON.parse(cstr.replace(/\s/g,'')) 
  app.setName(config.title.name) 
  mainWin = new BrowserWindow({ width: 1920, height: 1080, 
    // frame:false,
    title: config.title.name,
    fullscreen:   true  ,
    webPreferences: {
     nodeIntegration: true,
      webSecurity:false, 
      // plugins:true,
      webviewTag:true,
      preload:renderProcessApi
  } })

  mainWin.loadURL(config.baseUrl) 
  resetTimer()

  mainWin.on('closed', () => {
    mainWin = null
    app.quit()
  })

ipcMain.on('mousemove',(event) => { 
  console.log('----stop')
  if(isAuto){ 
    currentWindow && hideWindow(currentWindow.id)
  }
  isAuto =false
  resetTimer()
})
function resetTimer() { 
  if(timer) {
    clearTimeout(timer) 
  } 
  timer = setTimeout(()=>{ 
    isAuto =true
    autoPlay()
  },parseInt(config.play.waitTime || 10000))
}
ipcMain.on('start',   (event, someArgument) => {
 showWindow(someArgument) 
})
ipcMain.on('hideWindow',(event,id) =>{
  hideWindow(id)
})
  let list = config.menu 
  
  list.forEach(item => {
    // if(item.showAuto == 'true') { 
      if(item.data && item.data.length>0  ){
        item.data.forEach(dataitem  => {
          windows.push(dataitem)
          if(dataitem.showAuto == 'true') {
            runner.push({id:dataitem.id,isWindow:false})
            runner.push({id:dataitem.id,isWindow:true})
          }
        }) 
      }else{
        if(item.showAuto == 'true'){
          runner.push({id:item.id,isWindow:false})
        }
        windows.push({
          "id": item.id,
          "name": item.name,
          "type": item.type,
          "showAuto":item.showAuto, 
          "applicationName" : item.applicationName,
          "url": item.url,
          "bat":item.bat
        })
      }
    // }
  })
  for(let i = 0; i< windows.length;i ++ ){
    // Create the browser window.
    windows[i].win = new BrowserWindow({ width: 1920, height: 1080, 
      // frame:false,
      show:false,
      title: windows[i].name,
      fullscreen:   true  ,
      webPreferences: {
      nodeIntegration: true,
      webSecurity:false, 
      // plugins:true, 
      preload:renderProcessApi,
      webviewTag:true
    } })
    windows[i].win.loadURL(windows[i].url)
    
    windows[i].win.on('closed', () => {
      windows[i].win = null
    })
  }
  
}
// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWin === null) {
    createWindow()
  }
}) 
function pre(){
  if(currentIndex < 0 ) {
    currentIndex = 0 
  }else{
    if(runner[currentIndex].isWindow)
    currentWindow && hideWindow(currentWindow.id)
    currentIndex= currentIndex == 0 ?  runner.length -1  : currentIndex -1
  } 
  if(runner[currentIndex].isWindow){
    showWindow(runner[currentIndex].id)
  }else {
    sendMessage(runner[currentIndex].id) 
  }
  return 

}
function next(){
  if(currentIndex < 0 ) {
    currentIndex = 0 
  }else{
    if(runner[currentIndex].isWindow)
    currentWindow && hideWindow(currentWindow.id)
    currentIndex = currentIndex == runner.length -1 ?  0 : currentIndex +1
  } 
  console.log(currentIndex)
  if(runner[currentIndex].isWindow){
    showWindow(runner[currentIndex].id)
  }else {
    sendMessage(runner[currentIndex].id) 
  }
  return 
}  
  
function sendMessage(id) { 
  console.log('active',id)
  mainWin.webContents.send('active', id)
  mainWin.moveTop()
  currentWindow = null
}
function showWindow(id) {
  console.log('showwindow',id)
  let w  = _.find(windows,item => item.id == id)
  if(w) {
    activeWindow(w)
    currentWindow = w
  }else{
    console.log('===error')

  }
}

function hideWindow(id) {
  let w  = _.find(windows,item => item.id == id)
  if(!w) return 
  if(w.type == 'url') {
    w.win && w.win.hide()
  }
}
function activeWindow(w){
  console.log(w)
  if(!w) return 
  if(w.type == 'url') {
    if(w.win){
      w.win.show()
      w.win.moveTop()
    } else {
      w.win = new BrowserWindow({ width: 1920, height: 1080, 
        // frame:false,
        show:false,
        title: w.name,
        fullscreen: true  ,
        webPreferences: {
        nodeIntegration: true,
        webSecurity:false, 
        // plugins:true,
        webviewTag:true
      } }) 
      w.win.loadURL(w.url)
      w.win.on('closed', () => {
        w.win = null
      })
    }
  }else {
    if(w.type == 'application') {
      const exec = require('child_process').execFile   

      const pro = exec(resolve(w.url).replace(/_/g,' '),(a,b,c) =>{
        console.log(a,b,c)
      } ) 
      if(w.bat){
        const spawn = require('child_process').spawn
        spawn('cmd.exe',[resolve(w.bat).replace(/_/g,' ')])
      }
      // w.pro = pro.pid
      // console.log(pro.pid)
      // const spawn = require('child_process').spawn; 
      // const bat = spawn('kill', ['-9',w.pro]);
    }
  }
}

app.on('ready', async () => {
  getConfig(createWindow)
  // createWindow()  
  globalShortcut.register('CommandOrControl+H', () => {
    if(!isFocused()) return 
     if(currentWindow) {
       hideWindow(currentWindow.id)
     }
     isAuto =false
  })
   globalShortcut.register('F11', () => {
      if(!isFocused()) return 
      console.log(mainWin.isFullScreen())
      if(mainWin.isFullScreen()){
       
         Menu.setApplicationMenu(menu)
        mainWin.setFullScreen(false) 
      }else{
        Menu.setApplicationMenu(null)
        mainWin.setFullScreen(true) 
      }
    })
    globalShortcut.register('F5', () => {
      if(!isFocused()) return 
      if(currentWindow) {
        currentWindow.win.reload()
      }else{
        mainWin.reload()
      }
    })
    globalShortcut.register("CommandOrControl+=", () => {
      if(!isFocused()) return 
      if(currentWindow) {
        let level = currentWindow.win.webContents.getZoomLevel()
        level += 0.1
        currentWindow.win.webContents.setZoomLevel(level)
      }else{
        let level2 = mainWin.webContents.getZoomLevel()
        level2 += 0.1
        mainWin.webContents.setZoomLevel(level2)
      }
    })
    globalShortcut.register('CommandOrControl+-', () => {
      if(!isFocused()) return 
      if(currentWindow) {
        let level = currentWindow.win.webContents.getZoomLevel()
        level = level >0.5 ? level- 0.1 : 0.5
        currentWindow.win.webContents.setZoomLevel(level)
      }else{
        let level2 = mainWin.webContents.getZoomLevel()
        level2 = level2 >0.5 ? level2- 0.1 : 0.5
        mainWin.webContents.setZoomLevel(level2)
      }
    })

    globalShortcut.register("Up", () => {
      if(isFocused()) {
        pre()
      }
    })
    globalShortcut.register("Left", () => {
      if(isFocused()) {
        pre()
      }
    })
    globalShortcut.register("Down", () => {
      if(isFocused()) {
        next()
      }
    })
    globalShortcut.register("Right", () => {
      if(isFocused()) {
        next()
      }
    })
})
function isFocused() {
 let list = BrowserWindow.getAllWindows()
  for(let i = 0;i<list.length;i++) {
    if(list[i].isFocused()) {
      return true 
    }
  }
  return false
}
// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
