<template>
    <div class="bundlePage" :style="visibleStyle" @click="fullClick"> 
        <div :style="rectStyle" class="flexcenter">
            <img :src="currentUrl" width="100%" >
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
    props:['config',"visible",'from','pageParam'],
    data(){
        return {
            bg:null,
            buttons:[],
            currentIndex:-1,
            pics:[]
        }
    },
    mounted(){
        this.bg = resolveAssets(app,_.get(this.config,'config.bg'))
        let buttons = _.get(this.config,'config.buttons')
        this.buttons = buttons 
    },
    watch:{
       pageParam(val){
           this.currentIndex = val.index;
           this.pics = val.pics
       }
    },
    computed:{
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
            console.log(this.pics,this.currentIndex)
            return this.pics[this.currentIndex] || ''
        }
    },
    methods:{
        buttonHandler(e){
            if(e.type=="routeTo"){
                this.currentIndex = 0
                this.$emit('routeTo',e.options.path)
            }
            if(e.type=="actionTo"){ 
                if(e.options.action == 'back'){

                    this.$emit('routeTo',this.from )
                }

                 if(e.options.action== 'next'){
                    if(this.currentIndex  == this.pics.length -1){
                        this.currentIndex =0
                    }else{

                        this.currentIndex = this.currentIndex +1
                    }
                }
                 if(e.options.action== 'pre'){
                    if(this.currentIndex  == 0){
                        this.currentIndex =this.pics.length -1
                    }else{

                        this.currentIndex = this.currentIndex -1
                    }
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