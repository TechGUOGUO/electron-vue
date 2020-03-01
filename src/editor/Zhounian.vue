<template>
     <div style="padding-left:40px" v-if="ii" :key="refresh">
        <div style="display:flex;flex-direction:column">
            <div v-for="(v,index) in  list" :key = 'index'>
                <div>
                    <div style="line-height:30px">{{v.name}}</div>
                    <input type="button" value="删除" @click="delAllFile(`${base}/${v.name}`)">
                </div>
                <div v-if="v.type=='video'" style="margin:10px;display:flex;flex-direction:row;padding-left:30px">
                        <div>MP4</div>
                      
                    <input style="flex:1;margin-left:20px" type="text" :value="`${base}/${v.name}`" />
                    <input type="button" value="选择"  @click="selectFile(`${base}/${v.name}`,true)"/>
                </div>
                 <div v-if="v.type=='pdf'" style="margin:10px;display:flex;flex-direction:column;padding-left:30px">
                    <div style="display:flex;flex-direction:row ;margin-bottom:20px">
                            <div>pdf</div>
                        <input style="flex:1;margin-left:20px" type="text" :value="`${base}/${v.name}.pdf`" />
                        <input type="button" value="选择"  @click="selectFile(`${base}/${v.name}.pdf`,true)"/>
                    </div>
                    <div style="display:flex;flex-direction:row">
                        <div>电子书</div>
                        <input type="text" :value="`${base}/${v.name}`" style="margin-left:20px;flex:1"/>
                        <input type="button" value="选择"  @click="selectFile(`${base}/${v.name}`,false)"/>

                    </div>
                </div>
                <div v-if="v.type=='pic'" style="margin:10px;display:flex;flex-direction:row;padding-left:30px">
                    <div>图片列表</div>
                    <input type="text" :value="`${base}/${v.name}`" style="margin-left:20px;flex:1"/>
                    <input type="button" value="选择"  @click="selectFile(`${base}/${v.name}`,false)"/>
                </div>
            </div>
          
            <input style="margin-top:20px;margin-left:20px;width:500px;border:1px solid red;line-height:30px;padding-left:20px"   placeholder = "输入要创建的内容名称" type="text" :value="inputValue"   @input = 'inputchange' />
             <div> 
                 <input type="button" value="添加视频" style="width:200px;margin:20px"  @click="addVideo"/>
                 <input type="button" value="添加PDF" style="width:200px;margin:20px"  @click='addPdf' />
                 <input type="button" value="添加效果图" style="width:200px;margin:20px" @click="addPic" />
             </div> 
        </div>
      
    </div>
</template>
<script>

import {checkContent}  from '../utils/utils'
const {app} = window.electron.remote
export default {
    props:['currentRoute'],
    data(){
        return {
            ii:true,
            refresh:1,     
            inputValue:'',
            list:[]
        }
    },
    mounted(){
        this.list = checkContent(app,this.base)
    },
    watch:{
        xm(val){
           //console.log(val)
           this.list = checkContent(app,this.base
           )
        },
        ii(val){
            if(val)
            this.list = checkContent(app,this.base)
        }
    },
    methods:{
        addVideo(){
            if(this.inputValue == ''){
                alert('输入要创建的内容名称')
                return 
            }

            this.list.push({
                type:'video',
                name:this.inputValue + '.mp4'
            })
        },
        addPdf(){
             if(this.inputValue == ''){
                alert('输入要创建的内容名称')
                return 
            }
            this.list.push({
                type:'pdf',
                name:this.inputValue 
            })
        },
        addPic(){
            if(this.inputValue == ''){
                alert('输入要创建的内容名称')
                return 
            }
            this.list.push({
                type:'pic',
                name:this.inputValue
            })
        },
        inputchange(e){
            this.inputValue = e.target.value
        },
        refre(){
            this.refresh = this.refresh + 1
           //console.log(this.refresh)
            this.ii =false;
            this.$nextTick(()=>{
                this.ii = true
            })
        },
        returnVoid(){
            this.$emit('returnback')
        },
        delAllFile(path){
            let res = window.electron.ipcRenderer.sendSync('delAllfile',path); 
           //console.log(res)
            if(res == 'success'){
             //console.log('=====refresh')
              this.refresh = this.refresh +1
              this.inputValue = ''
              this.refre()
            }
        },
        selectFile(path,isFile){
           let res = window.electron.ipcRenderer.sendSync('selectFile',path,isFile); 
          //console.log(res)
            if(res == 'success'){
             //console.log('=====refresh')
              this.refresh = this.refresh +1
              this.inputValue = ''
              this.refre()
            }
        }
    },
     computed:{
         base(){
             return `十五周年`
         }
       
    },
}
</script>