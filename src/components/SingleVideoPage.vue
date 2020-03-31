<template>
    <div id="abcd" class="bundlePage" :style="visibleStyle" >
         <div :style="titleStyle">{{playName}}</div>
        <div class='ab' :style="videoContainer">
          <video draggable="false" ref='video' v-if="url"  style="position:relative" controls autoplay :width='videoWidth' :height="videoHeight" id="myVideo1"  >
			<source :src="playUrl" type="video/mp4"/>
         </video>
        </div>
        <template v-for="(button,index) in buttons">
            <EButton :config = 'button' :key="index" @buttonAction="buttonHandler"/> 
        </template>
        <img draggable="false" class="bg" :src="bg">
    </div>
</template>

<script>
import _ from 'lodash'
import {resolveAssets,rw,rh,getFile} from '../utils/utils'
import EButton  from '../components/EButton'
const {app} = window.electron.remote
export default {
    props:['config',"visible",'from','pageParam'],
    data(){
        return {
            bg:null,
            buttons:[],
            url:null,
            base:'',
            list:{}
        }
    },
    mounted(){
       console.log("======",this.config)
        this.bg = resolveAssets(app,_.get(this.config,'config.bg'))
        let buttons = _.get(this.config,'config.buttons')
        this.buttons = buttons
        console.log(_.get(this.config,'config.video.config'))
        this.list = getFile(app,_.get(this.config,'config.video.config'))
        console.log(this.list)
       console.log(this.pageParam) 

        this.url =resolveAssets(app,'content/video/'+ this.list[this.pageParam.key] ) 
     
       
    },
    watch:{
        pageParam(val){
           //console.log("vvvvvvvvv",val)
              this.url =resolveAssets(app,'content/video/'+ this.list[val.key] ) 
      
        },
        url(val,old){
            if(val && !old){
                const that = this
                this.$nextTick(()=>{
                    console.log(this.$refs.video)
                    this.$refs.video.onended  = function(){
                        setTimeout(()=>{

                            that.$emit('routeTo',that.from)
                        },2000)
                }
                })
            }
        }
    },
    computed:{
      visibleStyle(){
          return this.visible ? '' : 'display:none'
      },
        titleStyle(){
            let list = []
            list.push('position:absolute')
            list.push(`color:${_.get(this.config,'config.title.color')}`)
            list.push(`font-size:${_.get(this.config,'config.title.fontSize')}`)
            list.push(`font-weight:${_.get(this.config,'config.title.fontWeight')}`)

            list.push(`left:${rw(_.get(this.config,'config.title.x'))}`)
            list.push(`top:${rh(_.get(this.config,'config.title.y'))}`)
             list.push(`width:100%`)
            
            list.push('text-align:left')
            list.push(`height:${rh(_.get(this.config,'config.title.height'))}`)
            
            list.push(`line-height:${rh(_.get(this.config,'config.title.height'))}`)
          //  list.push(`text-align:center`)
            list.push(`z-index:${this.zIndex||1}`)
            let style = list.join(';')
           //console.log(style)
            return style    
        },
      videoContainer(){
          let video = _.get(this.config,'config.video')
          if(!video){
              return ''
          }
           const list =[]
            list.push('position:absolute')
            list.push(`width:${rw(video.width)}`)
            list.push(`height:${rh(video.height)}`)
            list.push(`left:${rw(video.x)}`)
            list.push(`top:${rh(video.y)}`)
            list.push(`z-index:${this.zIndex||1}`)
            let style = list.join(';')
            return style
      },
      playName(){
          let name = this.pageParam && this.pageParam.list &&  this.pageParam.list[this.pageParam.index].name
          if(name){
              return name.split('.')[0]
          }else{
              return '' 

          }
      },
      playUrl(){
          return `${this.url}`
      },
      videoWidth(){
          let video = _.get(this.config,'config.video')
          if(!video){
              return ''
          }
          return `${rw(video.width)}px`
      },
      videoHeight(){
           let video = _.get(this.config,'config.video')
          if(!video){
              return ''
          }
          return `${rh(video.height)}px` 
      }
    },
    methods:{
         invokeFieldOrMethod :function(element, method) 
{
  var usablePrefixMethod;
  ["webkit", "moz", "ms", "o", ""].forEach(function(prefix) {
      if (usablePrefixMethod) return;
      if (prefix === "") {
          // 无前缀，方法首字母小写
          method = method.slice(0,1).toLowerCase() + method.slice(1);   
      }
      var typePrefixMethod = typeof element[prefix + method];
      if (typePrefixMethod + "" !== "undefined") {
          if (typePrefixMethod === "function") {
              usablePrefixMethod = element[prefix + method]();
          } else {
              usablePrefixMethod = element[prefix + method];
          }
      }
  });
 
      return usablePrefixMethod;
},
 
//進入全屏
 launchFullscreen(element) 
  {
   //此方法不可以在異步任務中執行，否則火狐無法全屏
    if(element.requestFullscreen) {
      element.requestFullscreen();
    } else if(element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if(element.msRequestFullscreen){ 
      element.msRequestFullscreen();  
    } else if(element.oRequestFullscreen){
       element.oRequestFullscreen();
   }
   else if(element.webkitRequestFullscreen)
    {
      element.webkitRequestFullScreen();
    }else{
 
    //    var docHtml  = document.documentElement;
    //    var docBody  = document.body;
    //    var videobox  = document.getElementById('videobox');
    //    var  cssText = 'width:100%;height:100%;overflow:hidden;';
    //    docHtml.style.cssText = cssText;
    //    docBody.style.cssText = cssText;
    //    videobox.style.cssText = cssText+';'+'margin:0px;padding:0px;';
       document.IsFullScreen = true;
 
     }
  }, 
  exitFullscreen()
  {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if(document.oRequestFullscreen){
           document.oCancelFullScreen();
       }else if (document.webkitExitFullscreen){
        document.webkitExitFullscreen();
      }else{
       var docHtml  = document.documentElement;
       var docBody  = document.body;
       var videobox  = document.getElementById('videobox');
       docHtml.style.cssText = "";
       docBody.style.cssText = "";
       videobox.style.cssText = "";
       document.IsFullScreen = false;
   }
 },
 full(){
this.launchFullscreen(document.getElementById('myVideo1')); 
//    window.setTimeout(function exit(){
// //檢查瀏覽器是否處於全屏
// if(invokeFieldOrMethod(document,'FullScreen') || invokeFieldOrMethod(document,'IsFullScreen') || document.IsFullScreen)
// {
//     exitFullscreen();
// }
//   },5*1000);
// },false)
 } 
   ,
        buttonHandler(e){
             if(e.type=="routeTo"){
                this.$emit('routeTo',e.options.path)
            }
            if(e.type=="actionTo"){
                if(e.options.action == 'back'){

                    this.$emit('routeTo',this.from)
                }
               
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
        EButton
    }
}
</script>