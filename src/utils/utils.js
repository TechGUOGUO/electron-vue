import {join} from 'path'
import fs from 'fs' 
import * as _ from 'lodash'
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

export function randomArray(source,num,type){
    console.log('===random',source,num)
    if(source.length <= num){
        return [...source]
    }
    let temp = [...source];
    temp = temp.filter(it=>it.bankId==type)
    let res = [];
    let n = num;
    while(n>0){
        let r  = Math.floor(Math.random()*temp.length);
        let item = _.slice(temp,r,r+1)[0];
        console.log(n,item,temp)
        res.push(item)
        n--;
    }
    return res
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

 