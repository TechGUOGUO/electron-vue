<template>
    <div v-if="visible" :style="imageStyle" @mousedown="clickHandler" @mouseleave="leaveHandler" @mouseup="upHandler">
        <img draggable="false" v-if="!isPressDown" width="100%" height="100%" :src="normalUrl" > 
        <img draggable="false" v-if="isPressDown" width ='100%' height="100%" :src="pressedUrl" >
    </div>
</template>
<script>
import {resolveAssets,rw,rh} from '../utils/utils'
import _ from 'lodash'
const {app} = window.electron.remote
export default {
    props:['config','zIndex','currentIndex','totalPage',"pageName"],
    data(){
        return {
            isPressDown:false,
            visible:true
        } 
    },
    mounted(){
        if(this.config.visible){
                if(this.config.visible == 'pageNext'){
                    if(this.currentIndex == this.totalPage){
                        this.visible = false
                    }else{
                        this.visible = true
                    }
                     console.log("currentIndex",this.pageName,this.currentIndex,this.visible)
                    return 
                }
                if(this.config.visible == 'pagePre'){
                    if(this.currentIndex == 1){
                        this.visible =false
                    }else{
                        this.visible =true
                    }
                     console.log("currentIndex",this.pageName,this.currentIndex,this.visible)
                    return 
                }
                if(this.config.visible.type=="大于等于"){
                    this.visible =  this.currentIndex>=this.config.visible.value
                    return 
                }
                if(this.config.visible.type=="小于等于"){
                    this.visible= this.currentIndex<=this.config.visible.value
                    return 
                }
            }
    },
    watch:{
        totalPage(val){
           console.log("wathc@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",val)
             if(this.config.visible == 'pageNext'){
                    if(this.currentIndex == this.totalPage){
                        this.visible = false
                    }else{
                        this.visible = true
                    }
                    //console.log("currentIndex",this.pageName,val,this.visible)
                    return 
                }
                if(this.config.visible == 'pagePre'){
                    if(this.currentIndex == 1){
                        this.visible =false
                    }else{
                        this.visible =true
                    }
                     //console.log("currentIndex",this.pageName,val,this.visible)
                    return 
                }
            if(this.config.visible){
                if(this.config.visible.type=="大于等于"){
                   //console.log(val, this.config.visible.value)
                    this.visible =  val>=this.config.visible.value
                }
                if(this.config.visible.type=="小于等于"){
                      //console.log(val, this.config.visible.value)
                    this.visible= val<=this.config.visible.value
                }
            }
 
        },
        currentIndex(val){
              console.log("watcg@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",val)
          //console.log(val)
             if(this.config.visible == 'pageNext'){
                    if(this.currentIndex == this.totalPage){
                        this.visible = false
                    }else{
                        this.visible = true
                    }
                    //console.log("currentIndex",this.pageName,val,this.visible)
                    return 
                }
                if(this.config.visible == 'pagePre'){
                    if(this.currentIndex == 1){
                        this.visible =false
                    }else{
                        this.visible =true
                    }
                     //console.log("currentIndex",this.pageName,val,this.visible)
                    return 
                }
            if(this.config.visible){
                if(this.config.visible.type=="大于等于"){
                   //console.log(val, this.config.visible.value)
                    this.visible =  val>=this.config.visible.value
                }
                if(this.config.visible.type=="小于等于"){
                      //console.log(val, this.config.visible.value)
                    this.visible= val<=this.config.visible.value
                }
            }

        }

    },
    computed:{
        normalUrl(){
            return resolveAssets(app,_.get(this.config,'normal'))
        },
        pressedUrl(){
            return resolveAssets(app,_.get(this.config,'pressed'))
        },
        imageStyle(){
            const list =[]
            list.push('position:absolute')
            list.push(`width:${rw(this.config.width)}`)
            list.push(`height:${rh(this.config.height)}`)
            if(this.config.x || this.config.x == 0){
                list.push(`left:${rw(this.config.x)}`)
            }else{
                list.push(`right:20px`)   
            } 
            if(this.config.y || this.config.y == 0) {
                
                list.push(`top:${rh(this.config.y)}`)
             }else{
                 list.push(`bottom:20px`)

             } 
            list.push(`z-index:${this.zIndex||1}`)
            let style = list.join(';')
           //console.log(style)
            return style
        }
    },
    methods:{
        upHandler(){
            if(this.isPressDown ==true){
                this.$emit('buttonAction',{
                    type: this.config.to ? 'routeTo' : 'actionTo',
                    options:{
                        path:this.config.to,
                        param: this.config.toParams,
                        action:this.config.action
                    }
                })
            }
            this.isPressDown =false;
         },
        leaveHandler(){
            this.isPressDown =false 
        },
        clickHandler(){
            this.isPressDown = true
        }
    }

}
</script>
