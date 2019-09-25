<template>
    <div class="bundlePage" :style="visibleStyle" @click="fullClick"> 
        <template v-for="(button,index) in buttons">
            <EButton :config = 'button' :key="index" @buttonAction="buttonHandler"/> 
        </template>

        <div style="position:absolute;top:50px;left:50px;color:white;z-index:100">
            {{result.course}}
            {{result.score}}
            {{result.right}}
            {{result.wrong}}
        </div>

        <img draggable="false" class="bg" :src="bg">
    </div>
</template>

<script>
import _ from 'lodash'
import {resolveAssets} from '../utils/utils'
import EButton  from '../components/EButton'
const {app} = window.electron.remote
 
export default {
    props:['config',"visible",'from','param'],
    data(){
        return {
            bg:null,
            buttons:[], 
            result:{
                course:'',
                score:0,
                right:0,
                wrong:0
            }
        }
    },
    mounted(){
        console.log(this.config)
        this.bg = resolveAssets(app,_.get(this.config,'config.bg'))
        let buttons = _.get(this.config,'config.buttons')
        this.buttons = buttons


    },
    computed:{
      visibleStyle(){
          return this.visible ? '' : 'display:none'
      },
 

    },

    watch:{
       param(val){
           this.result = val; 
           console.log(this.result)
       }
    },

    methods:{
        buttonHandler(e){
            if(e.type=="routeTo"){
                if(e.options.param){
                    this.$emit('routeTo',{path:e.options.path,param:e.options.param})
                }else{
                    this.$emit('routeTo',e.options.path)
                }

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
        EButton
    }
}
</script>