<template>
    <div class="bundlePage" :style="visibleStyle" @click="fullClick"> 
       <Carousel autoplay loop arrow='always' :autoplay-speed='5000' trigger='click'>
           <CarouselItem v-for = '(pic,index) in pics' :key='index'>
                <div @click="toUrl(pic.url)">
                    <img :src="pic.pic|realpath" :style="st" draggable="false">
                </div>
           </CarouselItem>
       </Carousel > 
        <template v-for="(button,index) in buttons">
            <EButton v-if='show' :config = 'button' :key="index" @buttonAction="buttonHandler" :z-index="10001"/> 
        </template>
        <webview id="foo" v-if='show' :src="curl" style="position:absolute;top:0;left:0;right:0;bottom:0;z-index=1000"></webview>
        
        <!-- <img draggable="false" class="bg" :src="bg"> -->
    </div>
</template>

<script>
import _ from 'lodash'
import {resolveAssets,rw,rh,getFile} from '../utils/utils'
import EButton  from '../components/EButton'
const {app} = window.electron.remote
export default {
    props:['config',"visible",'from','pageParam'],
    data(){
        return {
            bg:null,
            buttons:[],
            currentIndex:-1,
            pics:[],
            show:false,
            curl:''
        }
    },
    mounted(){
        console.log('====')
        this.bg = resolveAssets(app,_.get(this.config,'config.bg'))
        // let json = resolveAssets(app,_.get(this.config,'config.content.items'))
        let pics = getFile(app, _.get(this.config,'config.content.items'))
        let buttons = _.get(this.config,'config.buttons')
        console.log(pics)

        this.pics = pics.list 
        console.log(resolveAssets(app,this.pics[0].pic))
        this.buttons = buttons 
        console.log(this.pics)
    },
    watch:{
       pageParam(val){
           if(val&& val.pageName == 'pics') {
              this.currentIndex = val.index;
              this.pics = val.pics
           }
       }
    },
    filters:{
        realpath(val){
            return resolveAssets(app,'./content/'+val)
        }
    },
    computed:{
      st(){
          return `height:${window.innerHeight};width:${window.innerWidth}`
      },
      visibleStyle(){
          return this.visible ? '' : 'display:none'
      },
      rectStyle(){
           let list = []
           let rect = _.get(this.config,'config.rect')
          if(rect){
            list.push('position:absolute')
            list.push(`top:${rh(rect.y)}`)
            list.push(`left:${rw(rect.x)}`)
            list.push(`width:${rw(rect.width)}`)
            list.push(`height:${rh(rect.height)}`)
            list.push(`z-index:1`) 
            return list.join(';')
          }else{
              return ''
          }
      },
        currentUrl(){
           //console.log(this.pics,this.currentIndex)
            return this.pics[this.currentIndex] || ''
        }
    },
    methods:{
        toUrl(url){
            this.curl = url;
            this.show = true
        },
        buttonHandler(e){
            
            if(e.type=="actionTo"){ 
                if(e.options.action == 'bb'){
                    this.show = false
                    this.url = ''
                    
                }

                 
            }
        },
        fullClick(){
            let c = _.get(this.config,'config.bgclick')
            if(c && c.to){
                this.$emit('routeTo',c.to)
            }
        },
      

    },
    components:{
        EButton
    }
}
</script>