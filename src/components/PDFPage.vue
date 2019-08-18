<template>
    <div class="bundlePage" :style="visibleStyle" @click="fullClick">  
         <webview  ref="pdfviewer" class="full" style="z-index:1;width:100%;height:100%"
          :src = 'viewUrl'   disablewebsecurity ="true"
         ></webview> 
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
          return resolveAssets(app,this.pageParam)
      },
    viewUrl(){ 
        return `${resolvePlugins(app,'pdfjs/web/viewer.html')}?file=${this.url}`
    }
    },
    methods:{
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
