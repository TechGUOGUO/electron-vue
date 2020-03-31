import {join} from 'path'
import fs from 'fs' 
import * as _ from 'lodash'
var parseString = require('xml2js').parseString;
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
   //console.log('===random',source,num)
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
       //console.log(n,item,temp)
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
       //console.log(te)
        let list = []

        let sort =_.find(te,f=>f==="order.json")
        if(sort){
          let sortcontent = fs.readFileSync(p+'/order.json').toString()
          let sortList = JSON.parse(sortcontent).list
         //console.log(sortList) 
            sortList.forEach(sf=>{
                te.forEach( f=>{
                    let fname = f.split('.')[0]
                    if(sf !== fname) return
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
            }) 
        }
        return list
    }catch(e){
       //console.log(e)
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
       //console.log(st)
        if(isFile){
            return st.isFile() ? path : ''
        }else{
            return st.isDirectory() ? path : ''
        }
    }catch(e){
        return ''
    }
}
export async function getXMLFile(app,filePath){
    if(!filePath) { 
        return  {
            'error':'parse error',
            'message': "path is undefined"
        }
    }
    const path = app ? join(app.getPath('appData'),app.getName(),filePath) : filePath
    const config = fs.readFileSync(path).toString()
   return new Promise((resolve ,reject) =>{
       parseString(config,(error ,res) =>{
           if(error) {
               reject({'error': 'parse error','message':'parse error'})
           }
           resolve(res)
       })
   })
      
}
export function getFile(app,filePath,ext){
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
        if(ext === 'xml'){
            result =parseString(config,)
        }else{
            result =JSON.parse(config)
        }
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
        let  te = fs.readdirSync(path)
        // list = list.filter(f=>f.indexOf('.json')<0)
        let list = []
        let sort = _.find(te,f=>f==='order.json')
        if(sort){
            let sortcontent = fs.readFileSync(path+'/order.json').toString()
            list = JSON.parse(sortcontent).list
        }
        return list
    }catch(e){
        return []
    }
}

export function getFolderContent(app,filePath){
    let path ;
    if(filePath.indexOf(":")>=0){
        path =filePath
    }else{
         path = app ? join(app.getPath('appData'),app.getName(),filePath): filePath
    }
   //console.log("!!!!",path)
    let result = null
    try{
        let te = fs.readdirSync(path) 
        let list = []
        let sort =_.find(te,f=>f==="order.json")
        if(sort){
          let sortcontent = fs.readFileSync(path+'/order.json').toString()
          let sortList = JSON.parse(sortcontent).list
          sortList.forEach(sf=>{
                te.forEach( f=>{
                    let fname = f.split('.')[0]
                    if(sf !== fname) return
                    if(f.indexOf('.mp4')>=0){
                        list.push({
                            url:path + '/'+ f,
                            name:f
                        })
                    }else if(f.indexOf('.pdf') >=0){
                        let item = _.find(list,item=>item.name== f.split('.')[0])
                        if(!item){
                            list.push({
                                url:path + '/'+ f,
                                name:f
                            })
                        }else{
                            item.url = item.url+'.pdf'
                            item.name= item.name+'.pdf'
                        }
                    }else {
                        if(!(_.find(list,item=> item.name.split('.')[0] == f))){
                            list.push({
                                url:path + '/'+ f,
                                name:f
                            })
                        }
                    }
                })
            })  
          result ={
              list:list
          } 
         //console.log(result)
        }else{
            te = te.sort((a,b)=> a.split('.')[0]  -b.split('.')[0])
            result = {
                list:te.map(f=>({name:f,url:path+'/'+f}))
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