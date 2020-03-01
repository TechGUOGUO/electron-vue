<template>
    <div class="bundlePage" :style="visibleStyle" @click="fullClick">  
        <template v-for="(button,index) in buttons">
            <EButton :zIndex="2" :config = 'button' :key="index" @buttonAction="buttonHandler"/> 
        </template>


        <div class="flipbook-viewport">
            <div class="container">
                <div class="flipbook">
                    <div class="page " v-for="pic in pages" :key= "pic.name">
                        <img :src="pic.url" draggable="false"/>
                    </div>
                    <!-- <div class="page" style="background-image:url(pages/1.jpg)"></div>
                    <div class="double" style="background-image:url(pages/2.jpg)"></div>
                    <div class="double" style="background-image:url(pages/3.jpg)"></div>
                    <div class="double" style="background-image:url(pages/4.jpg)"></div>
                    <div class="double" style="background-image:url(pages/5.jpg)"></div>
                    <div class="double" style="background-image:url(pages/6.jpg)"></div>
                    <div class="page" style="background-image:url(pages/7.jpg)"></div> -->
                </div>
            </div>
        </div>



        <img draggable="false" class="bg" :src="bg">
    </div>
</template>

<script>
import _ from 'lodash'
import {resolveAssets,resolvePlugins, getFolderContent} from '../utils/utils'
import EButton  from '../components/EButton'
const {app} = window.electron.remote
const $  = window.$
export default {
    props:["config","visible","pageParam","from"],
    data(){
        return {
            bg:null, 
            buttons:[] ,
            param: null, 
        }
    },
    destroyed(){
       //console.log('==========================desptry')
    },
    mounted(){
        this.bg = resolveAssets(app,_.get(this.config,'config.bg'))
        let buttons = _.get(this.config,'config.buttons')
        this.buttons = buttons
       //console.log('------mounted',window.Modernizr.csstransforms)
        // setTimeout(()=>{
        //     window.yepnope({
        //     test : window.Modernizr.csstransforms,
        //     yep: ['../../lib/turn.min.js'],
        //     nope: ['../../lib/turn.html4.min.js'],
        //     both: ['../../lib/scissor.min.js', 'css/double-page.css'],
        //     complete: this.loadApp
        // }) 
        // },200)
        this.loadApp()
    },
    computed:{
      visibleStyle(){
          return this.visible ? '' : 'display:none'
      },
      pages(){
           if(typeof this.pageParam === 'string' && this.pageParam){
              let p  = this.pageParam.replace('.pdf','')
              let content = getFolderContent(app,p,true);
            //   console.log('!!!!!!!!!!!!!',content )
              if(!content.error){
                  return  content.list
              }else{
                  return []
              }
          }else{
              return []
          }
      },
      url(){ 
         //console.log(this.pageParam)
          if(typeof this.pageParam === 'string' && this.pageParam){
              let p  = this.pageParam.replace('.pdf','')
            //   this.pages = getFolderContent(app,p);
            //  //console.log(this.pages);
              return p.indexOf(':')>=0 ? this.pageParam : resolveAssets(app,this.pageParam)
          }else{
              return ""
          }
      },
    viewUrl(){ 
        if(this.url  && this.url.indexOf('pdf')<=0){
            return this.url ? `${resolvePlugins(app,'pdfjs-flipbook/web/viewer.html')}?file=${this.url}.pdf` : ''
        }else{

            return this.url ? `${resolvePlugins(app,'pdfjs-flipbook/web/viewer.html')}?file=${this.url}` : ''
        }
    }
    },
    methods:{
         loadApp() {
console.log('==============loadapp')
	var flipbook = $('.flipbook'); 
	if (flipbook.width()==0 || flipbook.height()==0) {
		setTimeout(this.loadApp, 10);
		return;
	}

	$('.flipbook .double').scissor();

	// Create the flipbook

	$('.flipbook').turn({
			// Elevation

			elevation: 50,
			
			// Enable gradients

			gradients: true,
			
			// Auto center this flipbook

            autoCenter: true,
            cornerSize: 500,
            duration :1200,
            turnCorners: 'bl,br',

    });
     // $('.flipbook').turn('page',1);
},
        buttonHandler(e){
            if(e.type=="routeTo"){
                this.$emit('routeTo',e.options.path)
            }
            if(e.type=="actionTo"){
                if(e.options.action === 'pre'){
                    $('.flipbook').turn('previous');
                    return 
                }
                if(e.options.action === 'next'){
                   $('.flipbook').turn('next'); 
                   return 
                }
                //   if(e.options.action === 'top'){
                //     const webview = document.getElementById('webview2')
                //     webview.send('top')
                //     return 
                // }
                // if(e.options.action === 'back'){
                //      const webview = document.getElementById('webview2')
                //     webview.send('top')
                // }
                let params = e.options.action ==='back' ? this.from : ''
                this.$emit('routeTo',params)
            
            }
            
        },
        fullClick(){
            let c = _.get(this.config,'config.bgclick')
            if(c && c.to){
                this.$emit('routeTo',c.to)
            }
        }

    },
    components:{
        EButton,
        // pdf
    }
}
</script>
<style >
webview{
      height: 100%;
  width: 100%
}
/* Basic sample */

body{
	overflow:hidden;
	background-color:#fcfcfc;
	margin:0;
	padding:0;
}

.flipbook-viewport{
	overflow:hidden;
	width:100%;
	height:100%;
    position: absolute;
    z-index: 1;
}

.flipbook-viewport .container{
	position:absolute;
	top:0;
	left:0;
	margin:auto;
}

.flipbook-viewport .flipbook{
	width:1920px;
	height:1080px;
	left:0;
	top:0;
}

.flipbook-viewport .page{
	width:960px;
	height:1080px;
	background-color:white;
	background-repeat:no-repeat;
	background-size:100% 100%;
}

.flipbook .page{
	-webkit-box-shadow:0 0 20px rgba(0,0,0,0.2);
	-moz-box-shadow:0 0 20px rgba(0,0,0,0.2);
	-ms-box-shadow:0 0 20px rgba(0,0,0,0.2);
	-o-box-shadow:0 0 20px rgba(0,0,0,0.2);
	box-shadow:0 0 20px rgba(0,0,0,0.2);
}

.flipbook-viewport .page img{
	-webkit-touch-callout: none;
	-webkit-user-select: none;
	-khtml-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
	margin:0;
}

.flipbook-viewport .shadow{
	-webkit-transition: -webkit-box-shadow 0.5s;
	-moz-transition: -moz-box-shadow 0.5s;
	-o-transition: -webkit-box-shadow 0.5s;
	-ms-transition: -ms-box-shadow 0.5s;

	-webkit-box-shadow:0 0 20px #ccc;
	-moz-box-shadow:0 0 20px #ccc;
	-o-box-shadow:0 0 20px #ccc;
	-ms-box-shadow:0 0 20px #ccc;
	box-shadow:0 0 20px #ccc;
}

.flipbook-viewport .double{
	width:1920px;
	height:1080px;
	background-size:100% 100%;
}

</style>
