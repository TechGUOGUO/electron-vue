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
export function checkContent(app,path){
    let p= ""
    if(path.indexOf(':')>=0){
        p = path
    }else{
        p = join(app.getPath('appData'),app.getName(),'content',path)
    }
    try{
        let te= fs.readdirSync(p)
        console.log(te)
        let list = []
        te.forEach(f=>{
            if(f.indexOf('.mp4')>=0){
                list.push({
                    type:'video',
                    name:f
                })
            }else if(f.indexOf('.pdf') >=0){
                let item = _.find(list,item=>item.name== f.split('.')[0])
                if(!item){
                    list.push({
                        type:'pdf',
                        name:f.split('.')[0]
                    })
                }else{
                    item.type="pdf"
                }
            }else {
                if(!(_.find(list,item=> item.name.split('.')[0] == f))){
                    list.push({
                        type:'pic',
                        name:f
                    })
                }
            }
        })
        console.log(list)
        return list
    }catch(e){
        console.log(e)
        return []
    }
}
export function checkFilePath(app,path,isFile){
    let p = ""
    if(path.indexOf(":")>=0 || !app){
        p = path;
    }else{
        p = join(app.getPath('appData'),app.getName(),'content',path)
    }
    try{
        let st = fs.statSync(p)
        console.log(st)
        if(isFile){
            return st.isFile() ? path : ''
        }else{
            return st.isDirectory() ? path : ''
        }
    }catch(e){
        return ''
    }
}
export function getFile(app,filePath){
    if(!filePath) { 
        return  {
            'error':'parse error',
            'message': "path is undefined"
        }
    }
    
    const path = app ? join(app.getPath('appData'),app.getName(),filePath) : filePath
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
export function getContentFolder(app,filePath){
    let path;
    if(filePath.indexOf(":")>=0){
        path = filePath
    }else{
        path = join(app.getPath('appData'),app.getName(),'content',filePath)
    }
    try{
        let  list = fs.readdirSync(path)
        list = list.filter(f=>f.indexOf('.json')<0)
        return list
    }catch(e){
        return []
    }
}

export function getFolderContent(app,filePath,issort){
    let path ;
    if(filePath.indexOf(":")>=0){
        path =filePath
    }else{
         path = app ? join(app.getPath('appData'),app.getName(),filePath): filePath
    }
    let result = null
    try{
        let list1 = fs.readdirSync(path) 
        console.log('list1')
        let list= []
        list1.forEach(f=>{
            console.log(f,list)
            if(f.indexOf('.')>=0){
                list.push(f);
            }else{
                if(list1.indexOf(f+'.pdf')<0){
                    list.push(f)
                }
            }
        })

        console.log(issort)
        if(issort ){
            list.sort((a,b)=>  parseInt(a.split('.')[0])-parseInt(b.split('.')[0]))
        }
         console.log(list)
        let sort =_.find(list,f=>f==="order.json")
        if(sort){
          let sortcontent = fs.readFileSync(path+'/order.json').toString()
          let sortList = JSON.parse(sortcontent).list
          console.log(sortList) 
          let sorted = sortList.map( fname =>{
              return {name:fname,url:path+'/'+fname}
          })

          let rest = list.filter(f=> sortList.indexOf(f)<0 && f!='order.json')
          console.log(rest)
          let restsort = rest.map(f=>({name:f,url:path+'/'+f}))
          console.log(restsort)
          result ={
              list:[...sorted,...restsort]
          } 
          console.log(result)
        }else{

            result = {
                list:list.map(f=>({name:f,url:path+'/'+f}))
            }
        }
    }catch(e){
        result = {
            'error': 'parse error',
            "message": e.toString()
        }
    }
    return result
}