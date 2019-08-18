<template>
  <div id="app">
    <template v-for=" page  in pages">
      <SimplePage 
        v-if="page.type=='pic_button'" 
        :visible = "currentPage==page.name" 
        :config = "page"  
        @routeTo= "routeTo" 
        :key= "page.name">
      </SimplePage>
      <PDFPage 
      :from="from"
        v-if="page.type=='pdf'" 
        :visible = "currentPage===page.name" 
        :key= "page.name" 
        :config= "page" 
        :pageParam= "currentPageParams"
        @routeTo= "routeTo">
      </PDFPage>
    </template>
  </div>
</template>

<script>
import SimplePage  from './components/SimplePage'
import PDFPage from './components/PDFPage'
import {getConfig,setRem} from './utils/utils'
const {app} = window.electron.remote
const config = getConfig(app)
export default {
  name: 'app',
  data(){
    return {
      pages:[],
      currentPage:'',
      currentPageParams:null,
      from:null
    }
  },
  methods:{
    routeTo(options){
      if(typeof options === 'string'){
        this.from = this.currentPage;
        this.currentPage = options
      }else{
        this.from = this.currentPage;
        this.currentPage = options.path;
        this.currentPageParams = options.param
      }
      console.log(options)
    }
  },
  mounted(){  
    console.log(config)
    this.pages = config.pages;
    console.log(this.pages)
    setRem(config.screenWidth,config.screenHeight)
    this.currentPage = config.entry;
  },
  components: {
    SimplePage,
    PDFPage
  }

}
</script>

<style>
body{
  padding: 0;
  margin:0;
  overflow: hidden;
  user-select: none;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  position: relative;
  height:100vh;
  width:100vw;
  background: black;
  overflow: hidden;
}
.ab{
  position: absolute;
}
.bundlePage{
    position: absolute;
    top:0;
    left: 0;
    width: 100%;
    height: 100%;
}
.bg{
    position:absolute;
    top:0;
    left:0;
    width: 100%;
    height: 100%;
    z-index: 0;
}
.full{
      position: absolute;
      top:0;
      left: 0;
      bottom: 0;
      right: 0;
  }
</style>
