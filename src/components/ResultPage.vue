<template>
    <div class="bundlePage" :style="visibleStyle" @click="fullClick"> 
        <template v-for="(button,index) in buttons">
            <EButton :config = 'button' :key="index" @buttonAction="buttonHandler"/> 
        </template>

            <!-- {{result.course}} -->
            <div :style="'font-size:45px;position:absolute;top:'+rh(418)+';left:'+rw(1014)+';color:white;z-index:100'">{{result && result.score}}</div>
           <div :style="'font-size:45px;position:absolute;top:'+rh(550)+';left:'+rw(685)+';color:white;z-index:100'"> {{result &&result.right}}</div>
           <div :style="'font-size:45px;position:absolute;top:'+rh(550)+';left:'+rw(1259)+';color:white;z-index:100'"> {{result &&result.wrong}}</div>

        <img draggable="false" class="bg" :src="bg">
    </div>
</template>

<script>
import _ from 'lodash'
import {resolveAssets,rw,rh} from '../utils/utils'
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
            },
            rh:rh,
            rw:rw
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
                if(e.options.action == 'review'){
                    this.$emit('routeTo',{path:'exam',param:this.result})
                }else{
                    this.$emit('routeTo',e.options.action === 'back' ?this.from : '')
                }
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