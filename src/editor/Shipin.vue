<template>
     <div style="padding-left:40px" v-if="ii" :key="refresh">
        <div style="display:flex;flex-direction:column">
            <div style="line-height:30px">视频列表</div>

            <div v-for="(v,index) in vList" :key="index" style="margin:10px;display:flex;flex-direction:row;padding-left:30px">
                <div>{{v}}</div>
                <input style="flex:1;margin-left:20px" type="text" :value="`${base}/${v}`" />
                <input type="button" value="选择"  @click="selectFile(`${base}/${v}`,true)"/>
                <input type="button" value="删除" @click="delFile(`${base}/${v}`,true)" />
            </div>
            <input type="button" value="添加" style="width:200px" @click="addFile(base,true)"/>
        </div>
      
    </div>
</template>
<script>

import {getContentFolder}  from '../utils/utils'
const {app} = window.electron.remote

export default {
    props:['currentRoute'],
    data(){
        return {
            ii:true,
            refresh:1,
            base:'视频点播'
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

        refre(){
            this.refresh = this.refresh + 1
            console.log(this.refresh)
            this.ii =false;
            this.$nextTick(()=>{
                this.ii = true
            })
        },
        delFile(path, isFile){
            let res = window.electron.ipcRenderer.sendSync('delFile',path,isFile);
            if(res=="success"){
                  this.refresh = this.refresh +1
              this.refre() 
            }
        },
        addFile(path,isFile){
            let res = window.electron.ipcRenderer.sendSync('addFile',path,isFile);
            if(res=='success'){
                this.refresh = this.refresh +1
                this.refre()
            }
        },
        selectFile(path,isFile){
           let res = window.electron.ipcRenderer.sendSync('selectFile',path,isFile); 
           console.log(res)
            if(res == 'success'){
                console.log('=====refresh')
                this.refresh = this.refresh +1
              this.refre()
            }
        }
    },
     computed:{
         
         vList(){
            if(this.currentRoute == '视频点播' && this.ii){
                return getContentFolder(app,'视频点播')
            }else{
                return []
            }
         },
       
    },
}
</script>