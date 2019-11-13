<template>
    <div id = 'eidtor'>
        <Leftcontent :currentRoute = "currentRoute" @toContent = "toContent"/>
        <div style="flex:1">
            <div style="line-height:80px;font-size:30px;border-bottom:1px solid rgba(0,0,0,0.4);padding-left:40px"> {{rootPath}}</div>
            <Jianjie :currentRoute="currentRoute" v-if='!isXm &&  currentRoute=="瀚华简介"'></Jianjie>
            <Zhounian :currentRoute = 'currentRoute' v-if="!isXm && currentRoute =='十五周年'"></Zhounian>
            <Shipin :currentRoute = 'currentRoute' v-if="!isXm && currentRoute =='视频点播'"> </Shipin>
            <Xiangm :currentRoute = 'currentRoute' v-if="!isXm && !isXmList && currentRoute =='重要项目'" @xm="editlist"></Xiangm>
            <EjXiangmu :currentRoute = 'currentRoute' :xmlist = 'xmlistParent' v-if="!isXm && isXmList&&currentRoute =='重要项目'" @xm="editxm" @returnback="returnToxm" > </EjXiangmu>
            <Xcontent :currentRoute = 'currentRoute' :xm="xiangmu" :xmlist = 'xmlistParent' v-if="isXm && currentRoute =='重要项目'" @returnback="returnback"></Xcontent>
        </div>
     </div>
</template>
<script>
import Leftcontent from './editor/leftContent'
import Jianjie from './editor/Jianjie'
import Zhounian from './editor/Zhounian'
import Shipin from './editor/Shipin'
import Xiangm from './editor/Xiangm'
import Xcontent from './editor/Xcontent'
import EjXiangmu from './editor/EjXiangmu'
// import {checkFilePath}  from './utils/utils'
export default {
    data(){
        return {
            currentRoute: '瀚华简介', 
            isXm:false,
            isXmList:false,
            xmlistParent:'',
            xiangmu: ''
        }
    },
    computed:{
        rootPath(){
            if(!this.isXmList && !this.isXm){
                return this.currentRoute
            }
            if(this.isXmList){
                return `${this.currentRoute}/${this.xmlistParent}`
            }
            if(this.isXm){
                 return `${this.currentRoute}/${this.xmlistParent}/${this.xiangmu}` 
            
            }
            return ''
        }
    },
    watch:{
        currentRoute(){
            this.isXm =false
            this.isXmList =false;
        }
    },
    components:{
        Leftcontent,
        Jianjie,
        Zhounian,
        Shipin,
        Xiangm,
        Xcontent,
        EjXiangmu
    },
    methods:{
        returnback(){
            this.isXm =false
            this.isXmList =true
        },
        editlist(v){
            console.log(v)
            this.isXm =false;
            this.isXmList = true;
            this.xmlistParent = v;
        },
        editxm(v){
            this.isXm = true;
            this.isXmList =false;
            this.xiangmu = v;
        },
        returnToxm(){
            this.isXmList =false;
            this.isXm = false;
        },
        toContent(r){
            this.currentRoute = r;
            console.log(r) 

        }
    }
}
</script>
<style>
#eidtor{
    display: flex;
    flex-direction: row;
    height: 100wh;
}
</style>