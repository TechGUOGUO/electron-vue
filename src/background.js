'use strict'

import { app, dialog, BrowserWindow ,globalShortcut, ipcMain } from 'electron'
import {
  createProtocol,
  installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib'
import {resolve,join,basename} from 'path'
import fs, { unlink } from 'fs'
import { resolveAssets } from './utils/utils'
const isDevelopment = process.env.NODE_ENV !== 'production'
let staticFolder="";
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win


//static folder

if(isDevelopment){
  staticFolder =  join(app.getAppPath(),'../assets_config')
}else{
  staticFolder = join(app.getAppPath(),'../../assets_config')
}
// app.setName('清镇法条');
// app.setName('gaokao')
app.setName('瀚华软件book版')
app.setPath('appData',staticFolder)


// let ppfp ="" 
// ppfp= process.arch=='x64'? require('path').join(staticFolder,'plugins/dll','/pepflashplayer64_30_0_0_113.dll'):require('path').join(staticFolder,'plugins/dll','/pepflashplayer32_30_0_0_113.dll')
 
  
// //console.log(app.getPath('pepperFlashSystemPlugin'))
// console.log(ppfp)
// app.commandLine.appendSwitch('ppapi-flash-path',ppfp); 
// app.commandLine.appendSwitch('ppapi-flash-version', '30.0.0.113');

// // Scheme must be registered before the app is ready
// protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: { secure: true, standard: true } }])
// //trustManager.add(resolve(staticFolder,'瀚华软件'))
function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({ width: 1920, height: 1080, frame:false,fullscreen: isDevelopment ? false :true , webPreferences: {
    nodeIntegration: true,
    webSecurity:false,

    // plugins:true,
    webviewTag:true
  } })

  if (process.env.WEBPACK_DEV_SERVER_URL) { 
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    
   if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
    // win.loadURL('app://E:\\projects\\guoyingxu\\electron-vue\\assets_config\\plugins\\pdf-book\\index.html')

  }

  win.on('closed', () => {
    win = null
  })
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
  if (win === null) {
    createWindow()
  }
}) 
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    // Devtools extensions are broken in Electron 6.0.0 and greater
    // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
    // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
    // If you are not using Windows 10 dark mode, you may uncomment these lines
    // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
    // try {
    //   await installVueDevtools()
    // } catch (e) {
    //   console.error('Vue Devtools failed to install:', e.toString())
    // }

  }
  
  createWindow()

  globalShortcut.register('CommandOrControl+E', () => {
    win.webContents.send('editor')
  })


  ipcMain.on('delFile',(event,arg1,arg2)=>{
    let d =dialog.showMessageBoxSync({
      title:'删除',
      message:`您确认要删除${arg1}?`,
      buttons:['取消','确定']
    })
    console.log(d)
    if(d == 1){
      let p1 = resolvePath(arg1)
      if(arg2)
        fs.unlinkSync(p1)
      else
      delDir(p1)
        // fs.rmdirSync(p1,{recursive :true})
      
    }
    event.returnValue = 'success'
  })
  ipcMain.on('delAllfile',(event,arg1)=>{
    let d =dialog.showMessageBoxSync({
      title:'删除',
      message:`您确认要删除${arg1}?`,
      buttons:['取消','确定']
    })
    if(d == 1){
      let p1 = resolvePath(arg1)
      delDir(p1)
      if(fs.existsSync(p1+'.pdf')){
        fs.unlinkSync(p1+'.pdf')
      }
        // fs.rmdirSync(p1,{recursive :true})
      
    }
    event.returnValue = 'success'
  })
  ipcMain.on('addFolder',(event,arg1,arg2)=>{
    try{
      fs.mkdirSync(resolvePath(arg1))
    }catch(e){
      console.log(e)
      event.returnValue = 'fail'
      return
    }
    event.returnValue = 'success'
  })
  
  ipcMain.on('addFile',(event,arg1,arg2)=>{
    let properties  = arg2 ? ['openFile'] : ['openDirectory']
    let path = dialog.showOpenDialogSync(win, {
      properties:properties
    })
    if(path == undefined){
      event.returnValue ="cancel"
    }else{
      if(arg2){
        let src = path[0]
        try{
          let filename= basename(src);
          let dist = join(resolvePath(arg1),filename)
           fs.copyFileSync(src, dist);
        }catch(e){
          console.log(e)
          dialog.showMessageBoxSync(win,{
            title:"错误",
            message :'该文件在另外的程序中打开，读取错误，请关闭占用的程序'
          })
          event.returnValue = 'faild'
        }
      }else{
        console.log(path)
        let folder = path[0]
        try{
          let distfolder = resolvePath(arg1);
          try{
            let s = fs.statSync(distfolder)
            if(s.isFile()){
              fs.mkdirSync(distfolder)
            }
          }catch(e){
            fs.mkdirSync(distfolder)
          }
          let files = fs.readdirSync(folder);
          console.log(files)
          files.forEach(name=>{
            if(name.indexOf('.')>=0)
            fs.copyFileSync(join(folder,name),join(resolvePath(arg1),name))
          })
        }catch(e){
          console.log(e)
          dialog.showMessageBoxSync(win,{
            title:"错误",
            message :'该文件在另外的程序中打开，读取错误，请关闭占用的程序'
          })
          event.returnValue = 'faild' 
        }
      }

    }
    event.returnValue = 'success'
  })
  ipcMain.on('relaunch',()=>{
    console.log('-----relaunch')
    dialog.showMessageBoxSync(win,{
      title:'提示',
      message:'请重新启动应用，是当前编辑生效'
    })
    app.quit()
  })
  ipcMain.on('selectFile',(event,arg1,arg2)=>{
    console.log(arg1,arg2)
    let properties  = arg2 ? ['openFile'] : ['openDirectory']
    let path = dialog.showOpenDialogSync(win, {
      properties:properties
    })
    if(path == undefined){
      event.returnValue ="cancel"
    }else{
      if(arg2){
        let src = path[0]
        try{
          let res =  fs.copyFileSync(src, resolvePath(arg1));
        }catch(e){
          dialog.showMessageBoxSync(win,{
            title:"错误",
            message :'该文件在另外的程序中打开，读取错误，请关闭占用的程序'
          })
          event.returnValue = 'faild'
        }
      }else{
        console.log(path)
        let folder = path[0]
        try{
          let distfolder = resolvePath(arg1);
          try{
            let s = fs.statSync(distfolder)
            if(s.isFile()){
              fs.mkdirSync(distfolder)
            }
          }catch(e){
            fs.mkdirSync(distfolder)
          }
          let files = fs.readdirSync(folder);
          console.log(files)
          files.forEach(name=>{
            fs.copyFileSync(join(folder,name),join(resolvePath(arg1),name))
          })
        }catch(e){
          console.log(e)
          dialog.showMessageBoxSync(win,{
            title:"错误",
            message :'该文件在另外的程序中打开，读取错误，请关闭占用的程序'
          })
          event.returnValue = 'faild' 
        }
      }

    }
    event.returnValue = 'success'
  }) 
})
function delDir(path){
  let files = [];
  if(fs.existsSync(path)){
      files = fs.readdirSync(path);
      files.forEach((file, index) => {
          let curPath = path + "/" + file;
          if(fs.statSync(curPath).isDirectory()){
              delDir(curPath); //递归删除文件夹
          } else {
              fs.unlinkSync(curPath); //删除文件
          }
      });
      fs.rmdirSync(path);
  }
} 
function resolvePath(path){
  if(path.indexOf(':')>=0){
    return path
  }else{
    return join(staticFolder,app.getName(),'content',path)
  }
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
