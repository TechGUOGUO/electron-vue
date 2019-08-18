<template>
    <div class="bundlePage" :style="visibleStyle" @click="fullClick">
        <div class='ab' :style="videoContainer">
          <video draggable="false" v-if="url"  style="position:relative" controls autoplay loop  :width='videoWidth' :height="videoHeight" id="myVideo1"  >
			<source :src="playUrl" type="video/mp4"/>
         </video>
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
const {app} = window.electron.remote
export default {
    props:['config',"visible",'from'],
    data(){
        return {
            bg:null,
            buttons:[],
            url:null,
          
        }
    },
    mounted(){
        console.log("======",this.config)
        this.bg = resolveAssets(app,_.get(this.config,'config.bg'))
        let buttons = _.get(this.config,'config.buttons')
        this.buttons = buttons
        this.url = _.get(this.config,'config.video.url')
    },
    computed:{
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
      playUrl(){
          return resolveAssets(app,this.url)
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
        buttonHandler(e){
             if(e.type=="routeTo"){
                this.$emit('routeTo',e.options.path)
            }
            if(e.type=="actionTo"){
                if(e.options.action == 'back'){

                    this.$emit('routeTo',this.from)
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