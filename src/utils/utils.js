import {join} from 'path'
import fs from 'fs' 
let screenWidth=800;
let screenHeight=600;
export function getConfig(app){
    const path =join(app.getPath('appData'),app.getName(),'config.json')
    let result = null
    try{
        const config = fs.readFileSync(path).toString()
        result =JSON.parse(config)
    }catch(e){
        result = {
            'error':'parse error',
            'message': e.toString()
        }
    }
    return result
}
export function resolveAssets(app,path){
    if(path){

        const path2 =join(app.getPath('appData'),app.getName(),path)
        return "file://"+path2
    }else{
        return null
    }
}
export function resolveFolder(app,path){
    if(path){

        const path2 =join(app.getPath('appData'),app.getName(),path)
        return path2
    }else{
        return null
    }
}
export function resolvePlugins(app,path){
    if(path){
        return join(app.getPath('appData'),'plugins',path)
    }else{
        return null
    }
}
export function setRem(width,height){
    screenWidth = width;
    screenHeight = height;
}
export function rw(num){
    return Math.floor(num * document.getElementById('app').clientWidth / screenWidth)+'px'
}
export function rh(num){
    return Math.floor(num *  document.getElementById('app').clientHeight/ screenHeight)+'px'
}

export function getFile(app,filePath){
    const path =join(app.getPath('appData'),app.getName(),filePath)
    let result = null
    try{
        const config = fs.readFileSync(path).toString()
        result =JSON.parse(config)
    }catch(e){
        result = {
            'error':'parse error',
            'message': e.toString()
        }
    }
    return result
}

 