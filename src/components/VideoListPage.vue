<template>
    <div class="bundlePage" :style="visibleStyle" @click="fullClick">
        <div class='ab' :style="videoContainer">
          <video  id="vde" draggable="false" v-if="url"  style="position:relative" controls   loop  :width='videoWidth' :height="videoHeight"   >
			<source :src="url" type="video/mp4"/>
          </video>
        </div>
        <div :style="thumStyle" style="display:flex;flex-direction:row;align-items:center;background-color:rgba(0,0,0,0.1);overflow:hidden"> 
            <div :style="currentP">
                <Thumbnail :isSelected="currentIndex === index" :content = 'slide' v-for = "(slide,index) in videos" :key="index" :index="index" @select="selectItem"/>
            </div>  
        </div>
        <template v-for="(button,index) in buttons">
            <EButton :config = 'button' :key="index" @buttonAction="buttonHandler"/> 
        </template>
        <img draggable="false" class="bg" :src="bg">
    </div>
</template>

<script>
import _ from 'lodash'
import {resolveAssets,rw,rh} from '../utils/utils'
import EButton  from '../components/EButton'
import Thumbnail from './Thumbnail'
import fs  from 'fs'
const {app} = window.electron.remote
export default {
    props:['config',"visible",'from'],
    data(){
        return { 
            currentIndex:0,
            bg:null,
            basePath:'',
            buttons:[],
            url:null,
            slickOptions: {
                slidesToShow:5,
                // Any other options that can be got from plugin documentation
            },
            leftP:0
        }
    },
    watch:{
        visible(val){
            if(val){
                document.getElementById('vde') && document.getElementById('vde').play()
            }else{
                document.getElementById('vde') && document.getElementById('vde').pause()
            }
        }
    },
    mounted(){ 
        this.bg = resolveAssets(app,_.get(this.config,'config.bg'))
        let buttons = _.get(this.config,'config.buttons')
        this.buttons = buttons
        let folder = resolveAssets(app,_.get(this.config,'config.videos'))
        this.basePath = folder 
        this.url = this.basePath + '/'+this.videos[this.currentIndex]
    },
    computed:{
        currentP(){
           let  style="display:flex;flex-direction:row;align-items:center;" 
            const list =[]
            list.push('position:absolute')  
            list.push('top:0')
            list.push(`left:${rw(this.leftP)}`) 
            list.push(`z-index:2`)
             style = style+ list.join(';')
            return style
        },
      thumStyle(){
             let video = _.get(this.config,'config.video')
           if(!video){
               return ''
          }
           const list =[]
            list.push('position:absolute')
            list.push(`width:${rw(184*8)}`)
            list.push(`height:${rh(110)}`) 
            list.push(`left:${rw(185)}`)
            list.push(`bottom:${rh(55)}`)
            list.push(`z-index:1`)
            let style = list.join(';')
            return style
      },
      visibleStyle(){
          return this.visible ? '' : 'display:none'
      },
      videoContainer(){
          let video = _.get(this.config,'config.video')
          if(!video){
              return ''
          }
           const list =[]
            list.push('position:absolute')
            list.push(`width:${rw(video.width)}`)
            list.push(`height:${rh(video.height)}`)
            list.push(`left:${rw(video.x)}`)
            list.push(`top:${rh(video.y)}`)
            list.push(`z-index:${this.zIndex||1}`)
            let style = list.join(';')
            return style
      },
        videos(){
          if(this.config){
             let folder = resolveAssets(app,_.get(this.config,'config.videos'))
              let p = []
            try{
               let temp= fs.readdirSync(folder)  
               p = temp 
            }catch(e){
                console.log(e)
            }
            return p
          }else{
              return  []
          }
      },
      videoWidth(){
          let video = _.get(this.config,'config.video')
          if(!video){
              return ''
          }
          return `${rw(video.width)}px`
      },
      videoHeight(){
            let video = _.get(this.config,'config.video')
          if(!video){
              return ''
          }
          return `${rh(video.height)}px` 
      }
    },
    methods:{
       
        selectItem(index){ 
            if(this.currentIndex ===index) return 
            console.log(index)
            this.currentIndex = index
            this.url = this.basePath + '/'+this.videos[this.currentIndex]
            document.getElementById("vde").pause()
            document.getElementById("vde").src = this.url
            document.getElementById("vde").play()
        },
        buttonHandler(e){
            console.log(e.type)
           
             if(e.type=="routeTo"){
                this.$emit('routeTo',e.options.path)
            }
            if(e.type=="actionTo"){
                if(e.options.action == 'back'){

                    this.$emit('routeTo',this.from)
                }
            if(e.options.action=="left"){ 
                console.log('left')
                if(this.leftP == 0){
                    return 
                }else{
                     this.leftP = this.leftP + 184
                }
              
            }
            if(e.options.action === 'right'){
              
                if(this.videos.length<= 8 ) return;
                if(this.leftP <=(8- this.videos.length )*184 ){
                    return 
                }else{
                    this.leftP = this.leftP -184
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
        EButton,
        Thumbnail
    }
}
</script> 