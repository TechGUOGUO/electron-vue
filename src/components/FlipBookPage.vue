<template>
    <div class="bundlePage" :style="visibleStyle" @click="fullClick">  
         <webview  id='webview2' ref="pdfviewer2" class="full" style="z-index:1;width:100%;height:100%"
          :src = 'viewUrl'   disablewebsecurity="true"   ></webview> 
        <template v-for="(button,index) in buttons">
            <EButton :zIndex="2" :config = 'button' :key="index" @buttonAction="buttonHandler"/> 
        </template>
        <img draggable="false" class="bg" :src="bg">
    </div>
</template>

<script>
import _ from 'lodash'
import {resolveAssets,resolvePlugins} from '../utils/utils'
import EButton  from '../components/EButton'
const {app} = window.electron.remote
export default {
    props:["config","visible","pageParam","from"],
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
      url(){ 
         //console.log(this.pageParam)
          if(typeof this.pageParam === 'string' && this.pageParam){
              return this.pageParam.indexOf(':')>=0 ? this.pageParam : resolveAssets(app,this.pageParam)
          }else{
              return ""
          }
      },
    viewUrl(){ 
        if(this.url  && this.url.indexOf('pdf')<=0){
            return this.url ? `${resolvePlugins(app,'pdfjs-flipbook/web/viewer.html')}?file=${this.url}.pdf` : ''
        }else{

            return this.url ? `${resolvePlugins(app,'pdfjs-flipbook/web/viewer.html')}?file=${this.url}` : ''
        }
    }
    },
    methods:{
        buttonHandler(e){
            if(e.type=="routeTo"){
                this.$emit('routeTo',e.options.path)
            }
            if(e.type=="actionTo"){
                if(e.options.action === 'pre'){
                    const webview = document.getElementById('webview2')
                    webview.send('pre')
                    return 
                }
                if(e.options.action === 'next'){
                    const webview = document.getElementById('webview2')
                    webview.send('next')
                    return 
                }
                  if(e.options.action === 'top'){
                    const webview = document.getElementById('webview2')
                    webview.send('top')
                    return 
                }
                if(e.options.action === 'back'){
                     const webview = document.getElementById('webview2')
                    webview.send('top')
                }
                let params = e.options.action ==='back' ? this.from : ''
                this.$emit('routeTo',params)
            
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
        // pdf
    }
}
</script>
<style >
webview{
      height: 100%;
  width: 100%
}
</style>
