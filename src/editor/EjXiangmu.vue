<template>
     <div style="padding-left:40px" v-if="ii" :key="refresh">
        <div style="display:flex;flex-direction:column">
            <div style="line-height:30px"> 项目列表</div>

            <div v-for="(v,index) in list" :key="index" style="margin:10px;display:flex;flex-direction:row;padding-left:30px">
                <div>{{v}}</div>
                <!-- <input  style="flex:1;margin-left:20px" type="text" :value="`${base}/${v}`" /> -->
                <input type="button" value="删除"  @click="delFile(`${base}/${v}`,false)"/>
                <input type="button" value="编辑"  @click = 'edit(v)' />
            </div>
            <div style="margin:10px;display:flex;flex-direction:row">
                <input placeholder="输入项目名称" :value="newxm" @input="inputchange" type="text" style="width:200px"/>
                <input value="添加" type="button" @click="doadd" />
            </div>
            <input value="返回" type="button" style="width:200px" @click="returnabck" />
        </div>
      
    </div>
</template>
<script>

import {getContentFolder}  from '../utils/utils'
const {app} = window.electron.remote

export default {
    props:['currentRoute','xmlist'],
    data(){
        return {
            newxm:"",
            ii:true,
            refresh:1,
            
        }
    },
    mounted(){
    },
    // watch:{
    //     currentRoute(val){
    //         if(val=="视频点播"){

    //         }
    //     }
    // },
    methods:{
        returnabck(){
            this.$emit('returnback')
        },
        edit(v){
            console.log(v)
            this.$emit('xm',v)
        },
       delFile(path, isFile){
            let res = window.electron.ipcRenderer.sendSync('delFile',path,isFile);
            if(res=="success"){
               this.refresh = this.refresh +1
              this.refre() 
            }
        },
        inputchange(e){
            console.log(e.target.value)
            this.newxm = e.target.value
        },
        refre(){
            this.refresh = this.refresh + 1
            console.log(this.refresh)
            this.ii =false;
            this.$nextTick(()=>{
                this.ii = true
            })
        },
        selectFile(path,isFile){
           let res = window.electron.ipcRenderer.sendSync('selectFile',path,isFile); 
           console.log(res)
            if(res == 'success'){
                console.log('=====refresh')
                this.refresh = this.refresh +1
              this.refre()
            }
        },
        doadd(){
            if(this.newxm == '') return 
            let res  = window.electron.ipcRenderer.sendSync('addFolder',`${this.base}/${this.newxm}`,false);
            if(res == 'success'){
                  console.log('=====refresh')
                this.refresh = this.refresh +1
              this.refre()
            }
        }
    },
     computed:{
         base(){
             console.log( `重要项目/${this.xmlist}`)
             return `重要项目/${this.xmlist}`
         },
         list(){
            if(this.currentRoute == '重要项目' && this.ii){
                return getContentFolder(app,this.base)
            }else{
                return []
            }
         },
       
    },
}
</script>