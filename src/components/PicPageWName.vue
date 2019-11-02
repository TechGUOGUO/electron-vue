<template>
    <div class="bundlePage" :style="visibleStyle" @click="fullClick"> 
        <div :style="rectStyle" class="flexcenter">
            <img :src="currentUrl" width="100%" >
        </div>
        <template v-for="(button,index) in buttons">
            <EButton :config = 'button' :key="index" @buttonAction="buttonHandler"/> 
        </template>
        <div :style="titleStyle">{{title}}</div>
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
            pics:[],
        }
    },
    mounted(){
        this.bg = resolveAssets(app,_.get(this.config,'config.bg'))
        let buttons = _.get(this.config,'config.buttons')
        this.buttons = buttons 
    },
    watch:{
       pageParam(val){
           if(val&& val.pageName == 'pics') {
              this.currentIndex = val.index;
              this.pics = val.pics
           }
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
      titleStyle(){
          let list = []
          let titleconfig = _.get(this.config,'config.title')
        list.push('position:absolute;z-index:1;text-align:center')
        list.push(`color:${titleconfig.color}`)
        list.push(`font-size:${rw(titleconfig.fontSize)}`)
        list.push('text-align:center');
        list.push(`left:${rw(titleconfig.x)}`)
        list.push(`top:${rh(titleconfig.y)}`)
        list.push(`width:${rw(titleconfig.width)}`)
        list.push(`line-height:${rw(titleconfig.height)}`)
          let style = list.join(';')
          return style
      },
        currentUrl(){
            console.log(this.pics,this.currentIndex)
            if(this.pics && this.currentIndex >=0 && this.pics.length > this.currentIndex) {
                return this.pics[this.currentIndex].url || ''
            }
            return ''
        },
        title(){
             if(this.pics && this.currentIndex >=0 && this.pics.length > this.currentIndex) {
                 console.log("=================ttttttttttttttttttttttttttttttt",this.pics[this.currentIndex])
                 let n =  this.pics[this.currentIndex].name
                 if(!n) return '' 
                
               return n.split('.')[0]
            }
            return ''
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