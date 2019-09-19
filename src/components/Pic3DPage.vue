<template>
    <div class="bundlePage" :style="visibleStyle" @click="fullClick"> 
          
        <template v-for="(button,index) in buttons">
            <EButton :config = 'button' :key="index" @buttonAction="buttonHandler"/> 
        </template>
        <img draggable="false" class="bg" :src="bg">
        <div style="position:relative;top:20%">
            <carousel-3d v-if="pics.length>0" :width="cwidth" :height="cheight" :perspective="15"> 
                <slide v-for="(pic,index) in pics" :index="index" :key="index" >
                    <template slot-scope="{ index, isCurrent  }">
                        <!-- <img :data-index="index" :class="{ current: isCurrent, onLeft: (leftIndex >= 0), onRight: (rightIndex >= 0) }" :src="slide.src"> -->
                         <img :src="pic" height="100%" width="100%" @click="clickhandler(isCurrent,index)">
                    </template>
                   
                </slide>
            </carousel-3d>
        </div>
    </div>
</template>

<script>
import _ from 'lodash'
import {resolveAssets,rw,rh,resolveFolder} from '../utils/utils'
import EButton  from '../components/EButton'
import fs from 'fs'
import { join } from 'path';
import {Carousel3d,Slide} from './Carousel3d'
const {app} = window.electron.remote
export default {
    props:['config',"visible",'from'],
    data(){
        return {
            bg:null,
            buttons:[]
        }
    },
    mounted(){
        this.bg = resolveAssets(app,_.get(this.config,'config.bg'))
        let buttons = _.get(this.config,'config.buttons')
        this.buttons = buttons 
    },
    computed:{
      visibleStyle(){
          return this.visible ? '' : 'display:none'
      },
      pics(){
          if(this.config){
              let folder = resolveFolder(app,_.get(this.config,'config.pic'))
              let p = []
            try{
               let temp= fs.readdirSync(folder)  
               p = temp.map(pi=> "file://"+ join(folder,pi))
            }catch(e){
                console.log(e)
            }
            return p
          }else{
              return  []
          }
      },
      itemStyle(){
          let list = []
           let rect = _.get(this.config,'config.rect')
          if(rect){
                list.push(`background:gray`)
                console.log(rw(rect.width),rh(rect.height))
            list.push(`width:${rw(rect.width)/1.5}`)
            list.push(`height:${rh(rect.height)/1.5}`)
            return list.join(';')
          }else{
              return ''
          }
      },
      cwidth(){
          let rect = _.get(this.config,'config.rect')
          if(rect){
              console.log(rw(rect.width))
              return rw(rect.width)

          }
          return 0
      },
       cheight(){
          let rect = _.get(this.config,'config.rect')
          if(rect){
              console.log(rect)
              return rh(rect.height)
          }
          return 0
      }
    },
    methods:{
        clickhandler(isCurrent,index){
            console.log('cloclk',isCurrent)
            let rect = _.get(this.config,'config.rect')
          if(rect){
              if(isCurrent){

                  this.$emit('routeTo',{path:rect.to,param:{index:index,pics:this.pics}})
              }
          }
        },
        buttonHandler(e){
            if(e.type=="routeTo"){
                this.$emit('routeTo',e.options.path)
            }
            if(e.type=="actionTo"){
                
                this.$emit('routeTo',e.options.action === 'back' ?this.from : '')
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
        'carousel-3d':Carousel3d,
        'slide':Slide
    }
}
</script>