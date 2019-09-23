<template>
    <div class="bundlePage" :style="visibleStyle" @click="fullClick"> 
        <div :style="titleStyle">{{playName}}</div>

        <audio :src="playUrl" autoplay="" controls="" :style="audioStyle" id="audio">     </audio>

        <template v-for="(button,index) in buttons">
            <EButton :config = 'button' :key="index" @buttonAction="buttonHandler"/> 
        </template>

        <img draggable="false" :style="img2DStyle" :src="qrcodeimg"> 

        <img draggable="false" class="bg" :src="bg">
    </div>
</template>

<script>
import _ from 'lodash'
import {resolveAssets,rw,rh} from '../utils/utils'
import EButton  from '../components/EButton'
import * as  QRCode  from 'qrcode'
const {app} = window.electron.remote
export default {
    props:['config',"visible",'from','pageParam'],
    data(){
        return {
            bg:null,
            buttons:[],
            songName:null,
            currentIndex:-1, 
            isPaused:false, 
            songs:[],
            qrcodeimg:null
        }
    },
    mounted(){
        console.log(this.config)
        this.bg = resolveAssets(app,_.get(this.config,'config.bg'))
        let buttons = _.get(this.config,'config.buttons')
        this.buttons = buttons
        
    },
    computed:{
        visibleStyle(){
            return this.visible ? '' : 'display:none'
        },
        
        playUrl(){
            if(this.currentIndex>-1){
                let song = this.songs[this.currentIndex] 
                let path = resolveAssets(app,'./content/'+song.name);
              
                return path
            }else{
                return ''
            }
            
        },

        playName(){
            if(this.currentIndex>-1){
                let song = this.songs[this.currentIndex]
                return song.lname
            }else{
                return ''
            }
        },

        titleStyle(){
            let list = []
            list.push('position:absolute')

            list.push(`color:${_.get(this.config,'config.title.color')}`)
            list.push(`font-size:${_.get(this.config,'config.title.fontSize')}`)
            list.push(`font-weight:${_.get(this.config,'config.title.fontWeight')}`)

            list.push(`left:0`)
            list.push(`top:${rh(_.get(this.config,'config.title.y'))}`)
            list.push(`width:100%`)
            list.push(`height:${rh(_.get(this.config,'config.title.height'))}`)
            list.push(`text-align:center`)
            list.push(`z-index:${this.zIndex||1}`)
            let style = list.join(';')
            console.log(style)
            return style    
        },

        audioStyle(){
            let list = []
            list.push('position:absolute')
            list.push('outline:none')
            list.push(`left:${rw(_.get(this.config,'config.audio.x'))}`)
            list.push(`top:${rh(_.get(this.config,'config.audio.y'))}`)
            list.push(`width:${rw(_.get(this.config,'config.audio.width'))}`)
            //list.push(`height:${rh(_.get(this.config,'config.audio.height'))}`)
            //list.push(`margin:auto`)
            list.push('z-index:1')
            let style = list.join(';')
            console.log(style)
            return style    
        },

        img2DStyle(){
            let list = []
            list.push('position:absolute')

            list.push(`left:${rw(_.get(this.config,'config.img2D.x'))}`)
            list.push(`top:${rh(_.get(this.config,'config.img2D.y'))}`)
            list.push(`width:${rw(_.get(this.config,'config.img2D.width'))}`)
            list.push(`height:${rh(_.get(this.config,'config.img2D.height'))}`)

            list.push('z-index:1')
            let style = list.join(';')
            console.log(style)
            return style    
        }


    },
    watch:{
       pageParam(val){
           this.currentIndex = val.index;
           this.songs = val.songs
       },
       currentIndex(val){
           let song = this.songs[val] 
           if(song){ 
               QRCode.toDataURL(`http://www.guoyingxu.com/download/music?name=${song.name}&url=${song.url}`, (err, url) =>{
                   console.log(url)
               this.qrcodeimg = url 
            })
           }
       }
    },

    methods:{
        buttonHandler(e){
            console.log("AudioPage",e)
          
            if(e.type=="actionTo"){ 
                if(e.options.action == 'back'){
                    this.$emit('routeTo',this.from )
                }

                if(e.options.action== 'next'){
                    if(this.currentIndex  == this.songs.length -1){
                        this.currentIndex =0
                    }else{

                        this.currentIndex = this.currentIndex +1
                    }
                    this.isPaused = false
                } else if(e.options.action== 'pre'){
                    if(this.currentIndex  == 0){
                        this.currentIndex =this.songs.length -1
                    }else{

                        this.currentIndex = this.currentIndex -1
                    }
                    this.isPaused = false
                }else{
                    let audio = document.getElementById('audio')
                    this.isPaused = !this.isPaused
                    if(this.isPaused){
                        audio.pause()
                    }else{
                        audio.play()
                    }
                 }
            }
        },
        fullClick(){
            let c = _.get(this.config,'config.bgclick')
            if(c && c.to){
                this.$emit('routeTo',c.to)
            }
        }

    },
    components:{
        EButton
    }
}
</script>

