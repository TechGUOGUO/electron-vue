<template>
    <div class="bundlePage" :style="visibleStyle" @click="fullClick"> 
        <template v-for="(button,index) in buttons">
            <EButton :config = 'button' :key="index" @buttonAction="buttonHandler"/> 
        </template>
        
        <div v-if="title" :style="titleStyle">{{title}}</div>
        <img draggable="false" class="bg" :src="bg">

        <div :style="contentStyle">
            <div :style="labelStyle" v-for="(label,index) in labels" v-bind:key="index" @click="tapHandler(index)">           
                <img draggable="false" width ='224'  height="220" style="width:224px;height:220px"  :src="label.icon" />
                <span style="margin-top:-50px;text-shadow: 0.1em 0.1em 0.1em #333;font-weight:bold">{{label.name.split('.')[0]}}</span>
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
        console.log(this.config)
        this.bg = resolveAssets(app,_.get(this.config,'config.bg'))
        let buttons = _.get(this.config,'config.buttons')
        this.buttons = buttons

        // let labels;
        // let contentType = _.get(this.config,'config.content.contentType')
        // if(contentType === 'readdir'){
        //     labels = getFolderContent(app,_.get(this.config,'config.content.items'))
        // }else{
        //     labels = getFile(app, _.get(this.config,'config.content.items'))
        // }
        // if(labels.error){
        //     console.error(labels)
        //     return 
        // }
        // this.labels = labels.list
        // console.log('====labels',labels)
        // this.count = labels.list.length
        
        // let row = _.get(this.config,'config.content.row')
        // let column = _.get(this.config,'config.content.column')
        // this.column = column
        // this.pageSize = row*column
        // this.pages = Math.ceil(this.count/this.pageSize)

        // if(this.count<this.pageSize){
        //     this.curLabels = this.labels
        // }else{
        //     this.curLabels = this.labels.slice(0,this.pageSize)
        // }

        //  this.icon = resolveAssets(app,_.get(this.config,'config.content.item.icon'))
 
       this.setData(this.pageParam)
    },
    watch:{
        pageParam(val){
            if(!val) return 
            if(val.pageName!=="project") return 
            console.log("!!!!!!!!!!!!!!!,",val)
            this.setData(val)
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
            list.push('display:flex;flex-direction:column;')
            list.push(`color:${_.get(this.config,'config.content.item.color')}`)
            list.push(`font-size:${rw(_.get(this.config,'config.content.item.fontSize'))}`)
            list.push(`font-weight:${_.get(this.config,'config.content.item.fontWeight')}`)
            list.push(`justify-content:flex-start`)
            list.push('align-items:center')
            list.push(`width: 33%`)
            list.push(`height:${rh(_.get(this.config,'config.content.item.h'))}`)
            list.push(`z-index:${this.zIndex||1}`)
            let style = list.join(';')
            return style    
        },
      

    },
    methods:{

        
        setData(params){
              console.log("setData+++++++++++++++++++++++++++++++++", params)
            if(!params || !params.list){
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
            console.log('===========================path',path)
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
             this.title = path.pname + "|"+ path.name;
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
             console.log('labels',labels.list)
            if(labels.error){
                console.error(labels)
                return 
            }
            let t = []
            labels.list.forEach(f=>{
                console.log(f.name)
                if(f.url.indexOf('.')<0){
                    t.push({
                        name:f.name,
                        icon: this.getIcon('pic'),
                        url: f.url,
                        type:'folder'
                    })
                }else{
                    let ext = f.url.split('.')[1]
                    if(['mp4','mov'].indexOf(ext.toLowerCase())>=0){
                        t.push({
                            name: f.name,
                            icon:this.getIcon('mp4'),
                            url:f.url,
                            type:'video'
                        })
                    }
                    if(['pdf'].indexOf(ext.toLowerCase())>=0){
                        t.push({
                            name:f.name,
                            icon: this.getIcon('pdf'),
                            url:f.url,
                            type: 'pdf'
                        })
                    }
                }
            })

            this.labels = t ;
            // [
            //     {
            //         name:'效果图',
            //         icon: this.getIcon('效果图'),
            //         url: _.find(labels.list,f=>f.name.indexOf('效果图')>=0).url
            //     },
            //      {
            //         name:'简介',
            //         icon: this.getIcon('简介'),
            //         url: _.find(labels.list,f=>f.name.indexOf('简介')>=0).url
            //     },
            //      {
            //         name:'宣传片',
            //         icon: this.getIcon('宣传片'),
            //         url: _.find(labels.list,f=>f.name.indexOf('宣传片')>=0).url
            //     }
            // ] 
            
            this.count = labels.list.length
            
            let row = _.get(this.config,'config.content.row')
            let column = _.get(this.config,'config.content.column')
            this.column = column
            this.pageSize = row*column
            this.pages = Math.ceil(this.count/this.pageSize)
            this.curLabels = this.labels

        },

        getIcon(name){
            if(name=='pdf'){
                return resolveAssets(app,'./按钮/简介按钮.png') 
            }
            if(name=="pic"){ 
                return resolveAssets(app,'./按钮/效果图按钮.png') 
            }
              if(name=='mp4'){
                return resolveAssets(app,'./按钮/宣传片按钮.png') 
            }
            return ''
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
            // let rindex = (this.curPage-1)*this.pageSize +index 

            console.log("==================================tap",index)
            let item = this.labels[index]
            if(item.type ==='folder') { //  效果图
                let list = getFolderContent(null,item.url).list
               this.$emit('routeTo',{
                    path:'pics',
                    param:{
                        pageName:'pics',
                        index:0,
                        pics:list
                    }

                })
            } 
            if(item.type=='pdf') { // 简介
                this.$emit('routeTo',{
                    pageName:'playVideo',
                    path:'pdf',
                    param:item.url
                })
            }
            //this.$emit('routeTo',{path:_.get(this.config,'config.content.to'),param:{index:rindex,list:this.labels}})
            if(item.type=='video') { //宣传片
                this.$emit('routeTo',{
                    path:'playVideo',
                    param:{
                        pageName:'playVideo',
                        index:0,list:[{name:item.name,url:item.url}]}
                })
            }
             
        }

    },
    components:{
        EButton
    }
}
</script>
