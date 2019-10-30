<template>
    <div class="bundlePage" :style="visibleStyle" @click="fullClick"> 
        <template v-for="(button,index) in buttons">
            <EButton :config = 'button' :key="index" @buttonAction="buttonHandler"/> 
        </template>
        <img draggable="false" class="bg" :src="bg">

        <div :style="contentStyle">
            <div :style="labelStyle" v-for="(label,index) in curLabels" v-bind:key="index" @click="tapHandler(index)">           
                <img draggable="false" width ='20px' height="20px" src="../assets/icon.png" >
                <span style="margin-left:10px">{{label.name.split('.')[0]}}</span>
            </div>
        </div>
    </div>
</template>

<script>
import _ from 'lodash'
import {resolveAssets,rw,rh,getFile} from '../utils/utils'
import EButton  from '../components/EButton'
const {app} = window.electron.remote

export default {
    props:['config',"visible",'from'],
    data(){
        return {
            bg:null,
            buttons:[],

            labels:[],
            pageSize:null,
            curPage:1,
            pages:null,
            curLabels:[],
            count:null,
            column:null
        }
    },
    mounted(){
        console.log(this.config)
        this.bg = resolveAssets(app,_.get(this.config,'config.bg'))
        let buttons = _.get(this.config,'config.buttons')
        this.buttons = buttons

        let labels = getFile(app, _.get(this.config,'config.content.items'))
        this.labels = labels.list
        console.log('====labels',labels)
        this.count = labels.list.length
        
        let row = _.get(this.config,'config.content.row')
        let column = _.get(this.config,'config.content.column')
        this.column = column
        this.pageSize = row*column
        this.pages = Math.ceil(this.count/this.pageSize)

        if(this.count<this.pageSize){
            this.curLabels = this.labels
        }else{
            this.curLabels = this.labels.slice(0,this.pageSize)
        }

         
    },


    computed:{
        visibleStyle(){
            return this.visible ? '' : 'display:none'
        },
      
        contentStyle(){ 
            let list = []
            list.push('position:absolute')
            list.push(`display:${_.get(this.config,'config.content.layout')}`)
            list.push('flex-wrap:wrap')
            list.push('align-content:space-between')
            list.push(`width:${rw(_.get(this.config,'config.content.width'))}`)
            // list.push(`height:${rh(this.config.height)}`)
            list.push(`left:${rw(_.get(this.config,'config.content.x'))}`)
            list.push(`top:${rh(_.get(this.config,'config.content.y'))}`)
            list.push(`z-index:${this.zIndex||1}`)
            let style = list.join(';')
            return style    
        },
 

        labelStyle(){
            let list = []
            list.push('display:flex')
            list.push(`color:${_.get(this.config,'config.content.item.color')}`)
            list.push(`font-size:${rw(_.get(this.config,'config.content.item.fontSize'))}`)
            list.push(`font-weight:${_.get(this.config,'config.content.item.fontWeight')}`)
            list.push(`justify-content:flex-start`)
            list.push('align-items:center')
            list.push(`width:${rw(_.get(this.config,'config.content.item.w'))}`)
            list.push(`height:${rh(_.get(this.config,'config.content.item.h'))}`)
            list.push(`z-index:${this.zIndex||1}`)
            let style = list.join(';')
            return style    
        }


    },
    methods:{
        buttonHandler(e){
 
            if(e.type=="actionTo"){

                if(e.options.action == 'pre' && this.curPage > 1){
                    this.curPage = this.curPage - 1
                }else if(e.options.action == 'next' && this.curPage < this.pages){
                    this.curPage = this.curPage + 1
                }

                if(this.curPage==1){
                    
                    if(this.curPage==this.pages){
                        //都不显示
                    }else{
                        //只显示下一页
                    }
                }else if(this.curPage==this.pages){
                    //只显示上一页
                    
                }else{
                    //都显示
                }

                let start = (this.curPage-1)*this.pageSize
                let end = this.curPage * this.pageSize
                this.curLabels = this.labels.slice(start,end)

             }
        },

        fullClick(){
            let c = _.get(this.config,'config.bgclick')
            if(c && c.to){
                this.$emit('routeTo',c.to)
            }
        },

        tapHandler(index){ 
            let rindex = (this.curPage-1)*this.pageSize +index 
            this.$emit('routeTo',{path:_.get(this.config,'config.content.to'),param:{index:rindex,songs:this.labels}})
             
        }

    },
    components:{
        EButton
    }
}
</script>
