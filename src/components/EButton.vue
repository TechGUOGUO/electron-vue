<template>
    <div :style="imageStyle" @mousedown="clickHandler" @mouseleave="leaveHandler" @mouseup="upHandler">
        <img draggable="false" v-if="!isPressDown" width="100%" height="100%" :src="normalUrl" > 
        <img draggable="false" v-if="isPressDown" width ='100%' height="100%" :src="pressedUrl" >
    </div>
</template>
<script>
import {resolveAssets,rw,rh} from '../utils/utils'
import _ from 'lodash'
const {app} = window.electron.remote
export default {
    props:['config','zIndex'],
    data(){
        return {
            isPressDown:false,
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
            list.push(`left:${rw(this.config.x)}`)
            list.push(`top:${rh(this.config.y)}`)
            list.push(`z-index:${this.zIndex||1}`)
            let style = list.join(';')
            console.log(style)
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
