<template>
     <div style="padding-left:40px" v-if="ii" :key="refresh">
        <div style="display:flex;flex-direction:column">
            <div style="line-height:30px">瀚华金融简介</div>
            <div style="margin:10px;display:flex;flex-direction:row;padding-left:30px">
                <div >pdf</div>
                <input style="flex:1;margin-left:20px" type="text" :value="jiaanjiepdf" />
                 <input type="button" value="选择"  @click="selectFile(s_jiaanjiepdf,true)"/>
            </div>
            <div style="margin:10px;display:flex;flex-direction:row;padding-left:30px">
                <div>电子书</div>
                <input type="text" :value="jianjiebook" style="margin-left:20px;flex:1"/>
                <input type="button" value="选择"  @click="selectFile(s_jianjiebook,false)"/>
            </div>
            <div style="line-height:30px">瀚华宣传画册</div>
            <div style="margin:10px;display:flex;flex-direction:row;padding-left:30px">
                <div >pdf</div>
                <input style="flex:1;margin-left:20px" type="text" :value="huacepdf" /> 
                  <input type="button" value="选择"  @click="selectFile(s_huacepdf,true)"/>
            </div>
            <div style="margin:10px;display:flex;flex-direction:row;padding-left:30px">
                <div>电子书</div>
                <input type="text" :value="huacebook" style="margin-left:20px;flex:1"/>
                <input type="button" value="选择"  @click="selectFile(s_huacebook,false)"/>
            </div>
                <div style="line-height:30px">瀚华宣传片</div>
            <div style="margin:10px;display:flex;flex-direction:row;padding-left:30px">
                <div >MP4</div>
                <input style="flex:1;margin-left:20px" type="text" :value="xuanchuapian" />
                 <input type="button" value="选择"  @click="selectFile(s_xuanchuapian,true)"/>
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
            ii:true,
            refresh:1,
            s_jiaanjiepdf: "瀚华简介/瀚华金融简介.pdf",
            s_jianjiebook: "瀚华简介/瀚华金融简介",
            s_huacepdf: "瀚华简介/瀚华宣传画册.pdf",
            s_huacebook: "瀚华简介/瀚华宣传画册",
            s_xuanchuapian: "瀚华简介/瀚华宣传片.mp4"
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
        jiaanjiepdf(){
            console.log('----')
            
            if(this.currentRoute === '瀚华简介' && this.ii){
                return checkFilePath(app,'瀚华简介/瀚华金融简介.pdf',true)
            }else{
                return ''
            }
        },
        jianjiebook(){
            if(this.currentRoute === '瀚华简介' && this.ii){
                return checkFilePath(app,'瀚华简介/瀚华金融简介',false)
            }else{
                return ''
            }
        },
        huacepdf(){
            if(this.currentRoute === '瀚华简介' && this.ii){
                return checkFilePath(app,'瀚华简介/瀚华宣传画册.pdf',true)
            }else{
                return ''
            }
        },
        huacebook(){
            if(this.currentRoute === '瀚华简介' && this.ii){
                return checkFilePath(app,'瀚华简介/瀚华宣传画册',false)
            }else{
                return ''
            }
        },
          xuanchuapian(){
            if(this.currentRoute === '瀚华简介' && this.ii){
                return checkFilePath(app,'瀚华简介/瀚华宣传片.mp4',true)
            }else{
                return ''
            }
        }
    },
}
</script>