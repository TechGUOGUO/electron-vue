<template>
    <div class="bundlePage" :style="visibleStyle" @click="fullClick"> 
        <template v-for="(button,index) in buttons">
            <EButton :config = 'button' :key="index" @buttonAction="buttonHandler"/> 
        </template>
        <img draggable="false" class="bg" :src="bg">

        <div :style="contentStyle">
            <div :style="labelStyle" v-for="(label,index) in curLabels" v-bind:key="index" @click="tapHandler(index)">           
                <img draggable="false" width ='224px'  height="220px" :src="icon" >
                <span style="margin-top:-50px; text-shadow: 0.1em 0.1em 0.1em #333;font-weight:bold">{{label.name.split('.')[0]}}</span>
            </div>
        </div>
    </div>
</template>

<script>
import _ from 'lodash'
import {resolveAssets,rw,rh,getFile,getFolderContent} from '../utils/utils'
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
            column:null,
            icon:null
        }
    },
    mounted(){
        this.bg = resolveAssets(app,_.get(this.config,'config.bg'))
        let buttons = _.get(this.config,'config.buttons')
        this.buttons = buttons

        let labels;
        let contentType = _.get(this.config,'config.content.contentType')
        if(contentType === 'readdir'){
            labels = getFolderContent(app,_.get(this.config,'config.content.items'))
        }else{
            labels = getFile(app, _.get(this.config,'config.content.items'))
        }
        if(labels.error){
            console.error(labels)
            return 
        }
        this.labels = labels.list
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

         this.icon = resolveAssets(app,_.get(this.config,'config.content.item.icon'))
 
       
    },


    computed:{
        visibleStyle(){
            return this.visible ? '' : 'display:none'
        },
      
        contentStyle(){ 
            let list = []
            list.push('position:absolute')
            list.push(`display:${_.get(this.config,'config.content.layout')}`)
            list.push('flex-wrap:nowrap')
            list.push('align-content:space-around')
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
            list.push('display:flex;flex-direction:column;flex:1')
            list.push(`color:${_.get(this.config,'config.content.item.color')}`)
            list.push(`font-size:${rw(_.get(this.config,'config.content.item.fontSize'))}`)
            list.push(`font-weight:${_.get(this.config,'config.content.item.fontWeight')}`)
            list.push(`justify-content:flex-start`)
            list.push('align-items:center')
           // list.push(`width:${rw(_.get(this.config,'config.content.item.w'))}`)
            list.push(`height:${rh(_.get(this.config,'config.content.item.h'))}`)
            list.push(`z-index:${this.zIndex||1}`)
            let style = list.join(';')
            return style    
        },
      

    },
    // watch:{
    //     visible(val,old){
    //         if(old ==false && val == true){
    //             this.curPage = 1
    //              let start = (this.curPage-1)*this.pageSize
    //             let end = this.curPage * this.pageSize
    //             this.curLabels = this.labels.slice(start,end)
 
    //         }
    //     }
    // },

    methods:{
        buttonHandler(e){
            console.log("=============",e.type)
           
            if(e.type=="routeTo"){
              if(e.options.path === 'main'){
                     this.curPage = 1
                    let start = (this.curPage-1)*this.pageSize
                    let end = this.curPage * this.pageSize
                    this.curLabels = this.labels.slice(start,end)
                }
                this.$emit('routeTo',e.options.path)
            }
            
            if(e.type=="actionTo"){
                if(e.options.action === 'back'){
                     this.curPage = 1
                    let start = (this.curPage-1)*this.pageSize
                    let end = this.curPage * this.pageSize
                    this.curLabels = this.labels.slice(start,end)

                    let params = e.options.action ==='back' ? this.from : ''
                    this.$emit('routeTo',params)
                    return 
                }
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

            console.log("==================================tap",index)
            this.$emit('routeTo',{path:_.get(this.config,'config.content.to'),param:{pageName:_.get(this.config,'config.content.to'),index:rindex,list:this.labels}})
             
        }

    },
    components:{
        EButton
    }
}
</script>
