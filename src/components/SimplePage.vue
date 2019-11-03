<template>
    <div class="bundlePage" :style="visibleStyle" @click="fullClick"> 
        <template v-for="(button,index) in buttons">
            <EButton :config = 'button' :key="index" @buttonAction="buttonHandler"/> 
        </template>
        <img v-if="qr" draggable="false" :style="qrimg" :src="qrcodeimg">
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
    props:['config',"visible",'from'],
    data(){
        return {
            bg:null,
            buttons:[],
            qr:null,
             qrcodeimg:null
        }
    },
    mounted(){
        console.log(this.config)
        this.bg = resolveAssets(app,_.get(this.config,'config.bg'))
        let buttons = _.get(this.config,'config.buttons')
        this.buttons = buttons
        this.qr = _.get(this.config,'config.qr')
        if(this.qr){
                QRCode.toDataURL(this.qr.url, (err, url) =>{
                                console.log(url)
                   this.qrcodeimg = url 
                })
        }
    },
    computed:{
      visibleStyle(){
          return this.visible ? '' : 'display:none'
      },
      qrimg(){
          if(!this.qr) return ''
            let list = []
            list.push('position:absolute')
          
            list.push(`left:${rw(_.get(this.config,'config.qr.x'))}`)
            list.push(`top:${rh(_.get(this.config,'config.qr.y'))}`)
            list.push(`width:${rw(_.get(this.config,'config.qr.width'))}`)
            list.push(`height:${rh(_.get(this.config,'config.qr.height'))}`)
            list.push('z-index:1')
            let style = list.join(';')
            console.log(style)
            return style    
      }
    },
    methods:{
        buttonHandler(e){
            if(e.type=="routeTo"){
                this.$emit('routeTo',{path:e.options.path,param:e.options.param})
            }
            if(e.type=="actionTo"){
                if(e.options.action === 'exit'){
                    window.electron.remote.app.quit()
                    return 
                }
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
        EButton
    }
}
</script>