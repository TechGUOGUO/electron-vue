<template>
    <div class="bundlePage" :style="visibleStyle" > 
       <Carousel autoplay loop arrow='always' :autoplay-speed='speed' trigger='click'  @on-click='fullClick'
       :style='ss'>
           <CarouselItem v-for = '(pic,index) in pics' :key='index' >
                <div  >
                    <img :src="pic.pic|realpath" :style="st" draggable="false">
                </div>
           </CarouselItem>
       </Carousel > 
        <template v-for="(button,index) in buttons">
            <EButton v-if='show'  :config = 'button' :key="index" @buttonAction="buttonHandler" :z-index="10001"/> 
        </template>
        <!-- <webview id="foo" v-if='show' :src="curl" style="position:absolute;top:0;left:0;right:0;bottom:0;z-index=1000"></webview> -->
        <img :src='curl'  v-if='show' @click.stop='show=false' style="position:absolute;top:0;left:0;width:100%;height:100%;z-index:1000">
        <img draggable="false" class="bg" :src="bg">
    </div>
</template>

<script>
import _ from 'lodash'
import {resolveAssets,rw,rh,getXMLFile} from '../utils/utils'
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
            curl:'',
            speed:5000
        }
    },
   async mounted(){
        console.log('====')
        this.bg = resolveAssets(app,_.get(this.config,'config.bg'))
        // let json = resolveAssets(app,_.get(this.config,'config.content.items'))
        let  xml= await getXMLFile(app, _.get(this.config,'config.content.items'))
        let buttons = _.get(this.config,'config.buttons')
        console.log(xml) 
        this.speed = parseInt(xml.data.$.time)*1000
        this.pics = xml.data.node.map(item =>{
            return {pic: item.$.pic,url:item.node[0].$.pic}
        })
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
      ss(){
          return `z-index:100;position:absolute;left:${rw(-10)};top:${rh(699)};width:100%;height:${rh(502)}`
      },
      st(){
          return `height:${rh(502)};width:${rw(872)}`
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
            console.log('-----')
            console.log(url)
            this.curl = resolveAssets(app,'content/'+url);
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
        fullClick(index){ 
            const url = this.pics[index].url
            this.curl = resolveAssets(app,'content/'+url);
            this.show = true
        },
      

    },
    components:{
        EButton
    }
}
</script>