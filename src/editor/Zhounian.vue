<template>
<div style="padding-left:40px" v-if="ii" :key="refresh">
        <div style="display:flex;flex-direction:column">
            <div style="margin:10px;display:flex;flex-direction:row;padding-left:30px">
                <div >pdf</div>
                <input style="flex:1;margin-left:20px" type="text" :value="znpdf" />
                 <input type="button" value="选择"  @click="selectFile(s_znpdf,true)"/>
            </div>
            <div style="margin:10px;display:flex;flex-direction:row;padding-left:30px">
                <div>电子书</div>
                <input type="text" :value="znbook" style="margin-left:20px;flex:1"/>
                <input type="button" value="选择"  @click="selectFile(s_znbook,false)"/>
            </div>
            
            
        </div>
      
    </div>
</template>
<script>

import {checkFilePath}  from '../utils/utils'
const {app} = window.electron.remote
export default {
      props:['currentRoute'],
    data(){
        return {
            refresh:0,
            ii:true,
            s_znpdf: "15周年.pdf",
            s_znbook: "15周年",
        }
    },
     methods:{
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
        }
    },
    computed:{
          znpdf(){
            console.log('----')
            
            if(this.currentRoute === '十五周年' && this.ii){
                return checkFilePath(app,this.s_znpdf,true)
            }else{
                return ''
            }
        },
        znbook(){
            if(this.currentRoute === '十五周年' && this.ii){
                return checkFilePath(app,this.s_znbook,false)
            }else{
                return ''
            }
        },
    }
}
</script>

<style>

</style>