<template>
    <div class="bundlePage" :style="visibleStyle" @click="fullClick"> 
        <template v-for="(button,index) in buttons">
            <EButton :config = 'button' :key="index" @buttonAction="buttonHandler"/> 
        </template>
        <div v-if="title" :style="titleStyle">{{title}}</div>
        <img draggable="false" class="bg" :src="bg">
        <div :style="contentStyle">
            <div :style="labelStyle" v-for="(label,index) in curLabels" v-bind:key="index" @click="tapHandler(index)">           
                <img draggable="false" width ='224px'  height="220px" :src="icon" >
                <span style="margin-top:-50px;text-stroke:1px #f0f0f0;text-shadow: 0.1em 0.1em 0.05em #333">{{label.name.split('.')[0]}}</span>
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
    props:['config',"visible",'from',"pageParam"],
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
            icon:null,
            title:""
        }
    },
    mounted(){
        this.bg = resolveAssets(app,_.get(this.config,'config.bg'))
        let buttons = _.get(this.config,'config.buttons')
        this.buttons = buttons
        if(this.pageParam && this.pageParam.pageName === 'showProject'){
            this.setData(this.pageParam)
        }
         this.icon = resolveAssets(app,_.get(this.config,'config.content.item.icon'))
    },
    watch:{ 
        pageParam(val){
            if(val && val.pageName == 'showProject'){
                console.log(val)

                this.setData(val) 
            }
       } 
    },

    computed:{
        visibleStyle(){
            return this.visible ? '' : 'display:none'
        },
        titleStyle(){
            let list = []
            list.push('position:absolute');
            list.push('z-index:1'); 
            list.push('color:white;background:red;padding-left:10px;padding-right:10px; padding-top:3px;padding-bottom:3px;line-height:30px ')
            list.push(`left:${rw(_.get(this.config,'config.content.title.x'))}`)
            list.push(`top:${rh(_.get(this.config,'config.content.title.y'))}`)
            list.push(`fontSize:${rw(_.get(this.config,"config.content.title.fontSize"))}`)
            let style = list.join(';')
            return style
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
    methods:{
        setData(params){

            if(!params){
                this.labels = [];
                this.count = 0;
                this.row =1
                this.column = 1;
                this.pageSize = 1
                this.pages =1
                this.curLabels = []
                return 
            }

            let index = params.index;
            let list = params.list;

            let path = list[index];
             if(!path){
                this.labels = [];
                this.count = 0;
                this.row =1
                this.column = 1;
                this.pageSize = 1
                this.pages =1
                this.curLabels = []
                return 
             }
             let labels;
             let autoGetData = _.get(this.config,'config.content.autoGetData')
             if(!autoGetData){
                 this.labels = [];
                this.count = 0;
                this.row =1
                this.column = 1;
                this.pageSize = 1
                this.pages =1
                this.curLabels = []
                 return 
             }
             labels = getFolderContent(null, path.url)
             
            if(labels.error){
                console.error(labels)
                return 
            }
            this.title = path.name
            this.labels = labels.list
            this.labels.forEach(element => {
                element.pname= path.name
            });
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
        buttonHandler(e){
            if(e.type=="routeTo"){
                this.$emit('routeTo',e.options.path)
            }
            
            if(e.type=="actionTo"){
                if(e.options.action === 'back'){

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
            this.$emit('routeTo',{path:_.get(this.config,'config.content.to'),param:{pageName:_.get(this.config,'config.content.to'),index:rindex,list:this.labels}})
             
        }

    },
    components:{
        EButton
    }
}
</script>
