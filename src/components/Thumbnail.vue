<template>
    <div :style="imageStyle" @click="clickHandler">
        <div class="thetext">
            <div style="margin:auto">{{content.split('.')[0]}}</div>
        </div>
        <img class="bg" draggable="false" v-if="!isSelected" width="100%" height="100%" src="../assets/自动生成按钮.png" >  
        <img class="bg"  draggable="false" v-if="isSelected" width ='100%' height="100%" src="../assets/自动生成按钮-1.png" > 
    </div>
</template>
<script>
import {rw,rh} from '../utils/utils'
// import _ from 'lodash'
// const {app} = window.electron.remote
export default {
    props:['content','index','isSelected'],
  
    computed:{
        // normalUrl(){
        //     return resolveAssets(app,_.get(this.config,'normal'))
        // },
        // pressedUrl(){
        //     return resolveAssets(app,_.get(this.config,'pressed'))
        // },
        imageStyle(){
            const list =[]
            list.push('position:relative')
            list.push(`width:${rw(184)}`)
            list.push(`height:${rh(110)}`)
            list.push(`display:flex`)
            list.push('flex-direction:row')
            list.push('justify-content:center')
           // list.push(`left:${rw(this.config.x)}`)
            //list.push(`top:${rh(this.config.y)}`)
           // list.push(`z-index:${this.zIndex||1}`)
            let style = list.join(';')
            console.log(style)
            return style
        }
    },

    methods:{
      
        clickHandler(){
            this.$emit('select',this.index) 
        }
         
    }

}
</script>
<style >
.thetext{
    position: absolute;
    top:0;
    width:80%;
    margin:auto;
    height: 100%; 
    display: flex;
    flex-direction: row;
    justify-items: center;
    align-items: center;
    text-align: center;
    font-size: 20;
    word-wrap: wrap;
}
</style>
