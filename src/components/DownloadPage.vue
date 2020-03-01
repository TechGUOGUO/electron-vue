<template>
    <div class="bundlePage" :style="visibleStyle" @click="fullClick"> 
        <template v-for="(button,index) in buttons">
            <EButton :config = 'button' :key="index" @buttonAction="buttonHandler"/> 
        </template>
        <img draggable="false" class="bg" :src="bg">

        <div :style="contentStyle">
            <div :style="labelStyle" v-for="(label,index) in curLabels" v-bind:key="index" >           
                
                <span style="margin-left:10px">{{label.name}}</span>

                <img draggable="false" style="margin-right:20px" width ='40px' height="40px" src="../assets/下载.png" @click="downloadHandler(label.name,label.url)">
                
            </div>
        </div>
        <div v-if="mask" @click="hidemask" style="position:absolute;top:0;left:0;right:0;z-index:1000;right:0;bottom:0;background:rgba(0,0,0,0.4)">
             <img v-if="qr" draggable="false" style="widt:300px;height:300px;margin:300px;auto;" :src="qrcodeimg">
        </div>
    </div>
</template>

<script>
import _ from 'lodash'

import * as  QRCode  from 'qrcode'
import {resolveAssets,rw,rh,getFile} from '../utils/utils'
import EButton  from '../components/EButton'
const {app} = window.electron.remote

export default {
    props:['config',"visible",'from'],
    data(){
        return {
            bg:null,
            buttons:[],

            labels:[],
            pageSize:16,
            curPage:1,
            pages:null,
            curLabels:[],
            count:null,
            mask:false,
            qr:null,
            qrcodeimg:''
            
        }
    },
    mounted(){
       //console.log(this.config)
        this.bg = resolveAssets(app,_.get(this.config,'config.bg'))
        let buttons = _.get(this.config,'config.buttons')
        this.buttons = buttons

        let labels = getFile(app, _.get(this.config,'config.content.items'))
        this.labels = labels.list
        this.count = labels.list.length
        
        this.pageSize = _.get(this.config,'config.content.pageSize')
        this.pages = Math.floor(this.count/this.pageSize) + (this.count%this.pageSize == 0 ? 0 :1)
       //console.log(this.pages)
        if(this.count<this.pageSize){
            this.curLabels = this.labels
        }else{
            this.curLabels = this.labels.slice(0,this.pageSize)
        }
       //console.log('====curlables',this.curLabels.length)
         
    },


    computed:{
        visibleStyle(){
            return this.visible ? '' : 'display:none'
        },
      
        contentStyle(){ 
            let list = []
            list.push('position:absolute')
            list.push(`display:${_.get(this.config,'config.content.layout')}`)
            list.push('flex-wrap:wrap') 
            list.push('align-content:space-between')
            list.push(`justify-content:space-between`)
            list.push(`font-weight:bold`)
            list.push(`width:${rw(_.get(this.config,'config.content.width'))}`)
            // list.push(`height:${rh(this.config.height)}`)
            list.push(`left:${rw(_.get(this.config,'config.content.x'))}`)
            list.push(`top:${rh(_.get(this.config,'config.content.y'))}`)
            list.push(`z-index:${this.zIndex||1}`)
            let style = list.join(';')
           //console.log(style)
            return style    
        },
 

        labelStyle(){
            let list = []
            list.push('display:flex')
            list.push(`color:${_.get(this.config,'config.content.item.color')}`)
            list.push(`font-size:${rw(_.get(this.config,'config.content.item.fontSize'))}`)
            list.push(`justify-content:space-between`)
            list.push('align-items:center') 
            list.push(`margin-bottom:${rh(13)}`)
            list.push(`width:${rw(_.get(this.config,'config.content.item.width'))}`)
            list.push(`height:${rh(_.get(this.config,'config.content.item.height'))}`)
            list.push(`z-index:${this.zIndex||1}`)
            let style = list.join(';')
           //console.log(style)
            return style    
        }


    },

    methods:{
        showQrcode(index){
           console.log(index)
        },
        buttonHandler(e){
 
            if(e.type=="routeTo"){
              
                this.$emit('routeTo',e.options.path)
                
            }

            if(e.type=="actionTo"){

                if(e.options.action==='back'){
                      this.curPage = 1;
                         this.curLabels = this.labels.slice(0,this.pageSize)
                    this.$emit('routeTo',this.from)
                }else{
                   //console.log(e.options.action === 'next',this.curPage,this.pages)
                    if(e.options.action == 'pre' && this.curPage > 1){
                       //console.log('pre')
                        this.curPage = this.curPage - 1
                    }else if(e.options.action == 'next' && this.curPage < this.pages){
                       //console.log('next')
                        this.curPage = this.curPage + 1
                    }
                   //console.log(this.curPage)
                    let start = (this.curPage-1)*this.pageSize
                    let end = this.curPage * this.pageSize
                    this.curLabels = this.labels.slice(start,end)
                   //console.log('=====================pre',this.curLabels)
                }

            }
        },

        fullClick(){
            let c = _.get(this.config,'config.bgclick')
            if(c && c.to){
                this.$emit('routeTo',c.to)
            }
        },

        downloadHandler(name,url){
            this.mask = true 
             QRCode.toDataURL(`http://www.guoyingxu.com/download/music?name=${encodeURI(name)}&url=${encodeURI(url)}`, (err, eurl) =>{
                   this.qrcodeimg =eurl 
                   this.qr = true
                })
        },
        hidemask(){
            this.mask =false
            this.qr = null
        }

    },
    components:{
        EButton
    }
}
</script>
