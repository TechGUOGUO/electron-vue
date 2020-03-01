<template>
    <div id = 'leftcontent'>
        <div class="menu-title">内容列表</div>
        <div>
            <div class="menu-item" :style="currentRoute == '瀚华简介' ? 'background:rgba(0,0,0,0.1)': ' '" @click="routeTo('瀚华简介')">瀚华简介</div>
            <div class="menu-item" :style="currentRoute == '十五周年' ? 'background:rgba(0,0,0,0.1)': ' '" @click="routeTo('十五周年')">十五周年</div>
            <div class="menu-item" :style="currentRoute == '视频点播' ? 'background:rgba(0,0,0,0.1)': ' '" @click="routeTo('视频点播')">视频点播</div>
            <div class="menu-item" :style="currentRoute == '重要项目' ? 'background:rgba(0,0,0,0.1)': ' '" @click="routeTo('重要项目')">重要项目</div>
        </div>
        <div style="margin-left:100px;margin-top:100px">
            <input type="button" value="保存" @click="save" />
        </div>
    </div>   
</template>
<script>

export default {
  props:['currentRoute'] ,  
  methods:{
      routeTo(str){
         //console.log('---str')
          this.$emit('toContent',str)
      },
      save(){
          window.electron.ipcRenderer.send('relaunch')
      }
  }
}
</script>
<style>
    #leftcontent{
        width:300px;
        border:1px solid rgba(0,0,0,0.4);
        height: 100vh;
    }
    .menu-item{
        line-height: 50px;
        font-size:20px;
        text-align: center;
        border:1px solid rgba(0,0,0,0.1)
    }
    .menu-title{
        line-height: 80px;
        font-size:30px;
    }
</style>