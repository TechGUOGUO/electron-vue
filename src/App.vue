<template>
  <div id="app">
    <template v-for=" page  in pages">
      <SimplePage 
        v-if="page.type=='pic_button'" 
        :from="from"
        :visible = "currentPage==page.name" 
        :config = "page"  
        @routeTo= "routeTo" 
        :key= "page.name">
      </SimplePage>
       <ModePage 
        v-if="page.type=='pic_button_3'" 
        :from="from"
        :visible = "currentPage==page.name" 
        :config = "page"  
        @routeTo= "routeTo" 
        :pageParam = "currentPage === page.name ? currentPageParams : null "
        :key= "page.name">
      </ModePage>
      <PDFPage 
        :from="from"
        v-if="page.type=='pdf' && currentPage===page.name" 
        :visible = "currentPage===page.name" 
        :key= "page.name" 
        :config= "page" 
        :pageParam= "currentPage===page.name ? currentPageParams : null "
        @routeTo= "routeTo">
      </PDFPage>
       <FlipBookPage 
        :from="from"
        v-if="page.type=='book'&&currentPage===page.name" 
        :visible = "true" 
        :key= "page.name" 
        :config= "page" 
        :pageParam= "currentPage===page.name ? currentPageParams : null "
        @routeTo= "routeTo">
      </FlipBookPage>
       <TurnBookPage 
        :from="from"
        v-if="page.type=='turnbook'&&currentPage===page.name" 
        :visible = "true" 
        :key= "page.name" 
        :config= "page" 
        :pageParam= "currentPage===page.name ? currentPageParams : null "
        @routeTo= "routeTo">
      </TurnBookPage>
      <VideoPage 
       v-if="page.type=='video' && currentPage === page.name" 
       :from="from"
        :visible = "true" 
        :key= "page.name" 
        :config= "page" 
        :pageParam= "currentPage == page.name ? currentPageParams : null"
        @routeTo= "routeTo">
      </VideoPage>
       <VideoListPage
        v-if="page.type=='video_list'" 
        :from="from"
        :visible = "currentPage===page.name" 
        :key= "page.name" 
        :config= "page" 
        :pageParam= "currentPageParams"
        @routeTo= "routeTo">  
      </VideoListPage>
      <Pic3DPage
       v-if="page.type=='pic_3d'" 
        :from="from"
        :visible = "currentPage===page.name" 
        :key= "page.name" 
        :config= "page" 
        :pageParam= "currentPageParams"
        @routeTo= "routeTo">  
      </Pic3DPage>
       <PicPage
        v-if="page.type=='pic'" 
        :from="from"
        :visible = "currentPage===page.name" 
        :key= "page.name" 
        :config= "page" 
        :pageParam= "currentPageParams"
        @routeTo= "routeTo">  
      </PicPage>
       <PicPageWName
        v-if="page.type=='picn'" 
        :from="from"
        :visible = "currentPage===page.name" 
        :key= "page.name" 
        :config= "page" 
        :pageParam= "currentPageParams"
        @routeTo= "routeTo">  
      </PicPageWName>
      <BtnListPage 
        v-if="page.type=='pic_buttons'" 
        :from="from"
        :visible = "currentPage==page.name" 
        :config = "page"  
        @routeTo= "routeTo" 
        :key= "page.name">
      </BtnListPage> 
      <ItemPagerListPage 
        v-if="page.type=='pager_buttons'" 
        :from="from"
        :visible = "currentPage==page.name" 
        :config = "page"  
        @routeTo= "routeTo" 
        :key= "page.name">
      </ItemPagerListPage> 
       <ItemPagerListPage2 
        v-if="page.type=='pager_buttons2'" 
        :from="from"
        :visible = "currentPage==page.name" 
        :config = "page"  
        @routeTo= "routeTo" 
        :key= "page.name">
      </ItemPagerListPage2> 
      <ProjectListPage 
        v-if="page.type=='project-item-list'" 
        :from="from"
        :visible = "currentPage==page.name" 
        :config = "page"  
        @routeTo= "routeTo" 
        :pageParam= "currentPageParams"
        :key= "page.name">
      </ProjectListPage> 
      <ProjectPage 
         v-if="page.type=='project'" 
        :from="from"
        :visible = "currentPage==page.name" 
        :config = "page"  
        @routeTo= "routeTo" 
          :pageParam= "currentPageParams"
        :key= "page.name">
      </ProjectPage> 
      <AudioPage 
        v-if="page.type=='play'" 
        :from="from"
        :visible = "currentPage==page.name" 
        :config = "page"  
        @routeTo= "routeTo" 
        :key= "page.name"
        :pageParam="currentPageParams">
      </AudioPage> 
       <ExamPage 
        v-if="page.type=='exam'" 
        :from="from"
        :visible = "currentPage==page.name" 
        :config = "page"  
        @routeTo= "routeTo" 
        :key= "page.name"
        :pageParam="currentPageParams">
      </ExamPage> 
      <ResultPage 
        v-if="page.type=='result'" 
        :from="from"
        :visible = "currentPage==page.name" 
        :config = "page"  
        @routeTo= "routeTo" 
        :key= "page.name"
        :param="currentPageParams">
      </ResultPage> 
      <DownloadPage 
        v-if="page.type=='download'" 
        :from="from"
        :visible = "currentPage==page.name" 
        :config = "page"  
        @routeTo= "routeTo" 
        :key= "page.name">
      </DownloadPage> 
    </template>
  </div>
</template>

<script>
import SimplePage  from './components/SimplePage'
import PDFPage from './components/PDFPage'
import {getConfig,setRem} from './utils/utils'
import VideoPage  from './components/VideoPage'
import VideoListPage from './components/VideoListPage'
import Pic3DPage  from './components/Pic3DPage'
import PicPage from './components/PicPage'
import PicPageWName from './components/PicPageWName'
import BtnListPage from './components/BtnListPage'
import AudioPage from './components/AudioPage'
import ExamPage from './components/ExamPage'
import ResultPage from './components/ResultPage'
import DownloadPage from './components/DownloadPage'
import ItemPagerListPage  from './components/ItemPagerListPage'
import ItemPagerListPage2  from './components/ItemPagerListPage2'
import ProjectListPage from './components/ProjectListPage'
import ProjectPage from './components/ProjectPage'
import ModePage from './components/Mode'
import FlipBookPage from './components/FlipBookPage'
import TurnBookPage from './components/TurnBookPage'
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
        this.currentPageParams ={}
      }else{
        this.from = this.currentPage;
        this.currentPage = options.path;
        this.currentPageParams = options.param

        console.log(this.currentPage,this.currentPageParams)
      }
      console.log("routeTo",options)
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
    PDFPage,
    VideoPage,
    Pic3DPage,
    PicPage,
    VideoListPage,
    BtnListPage,
    AudioPage,
    ExamPage,
    ResultPage,
    DownloadPage,
    ItemPagerListPage,
    ItemPagerListPage2,
    ProjectListPage,
    ProjectPage,
    PicPageWName,
    ModePage,
    FlipBookPage,
    TurnBookPage
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
  .flexcenter{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
</style>
