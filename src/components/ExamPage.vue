<template>
    <div class="bundlePage" :style="visibleStyle" @click="fullClick"> 
        <div :style="courseStyle">{{course}}</div>
        <template v-for="(button,index) in buttons">
            <EButton :currentIndex='count' :config = 'button' :key="index" @buttonAction="buttonHandler"/> 
        </template>

        <div :style="contentStyle" v-if="currentQuestion">
            <div style="padding-top:15px"  >           
                <div style="font-weight:600;padding-bottom:50px">
                <MathJaxText :txl="currentQuestion.title" :useMathjax = "course=='理科'"></MathJaxText>
                    </div>
                <div :style="optionStyle+';'+(this.selected == 'A' ? 'color:red' : '') +';'+(!this.clickenable&&this.rr=='A' ? 'color:rgb(78,255,0)':'')"    @click="tapHandler('A')"  >
                  <!-- A. {{currentQuestion.optiona}} -->
                <MathJaxText opt="A" :txl="currentQuestion.optiona" :useMathjax = "course=='理科'"></MathJaxText>
                </div> 
                 <div :style="optionStyle+';'+(this.selected == 'B' ? 'color:red' : '') +';'+(!this.clickenable&&this.rr=='B' ? 'color:rgb(78,255,0)':'')"   @click="tapHandler('B')"  >
                    <MathJaxText opt="B" :txl="currentQuestion.optionb" :useMathjax = "course=='理科'"></MathJaxText>
                </div> 
                 <div :style="optionStyle+';'+(this.selected == 'C' ? 'color:red' : '') +';'+(!this.clickenable&&this.rr=='C' ? 'color:rgb(78,255,0)':'')"    @click="tapHandler('C')"  >
                <MathJaxText opt="C" :txl="currentQuestion.optionc" :useMathjax = "course=='理科'"></MathJaxText>
                </div> 
                 <div :style="optionStyle+';'+(this.selected == 'D' ? 'color:red' : '') +';'+(!this.clickenable&&this.rr=='D' ? 'color:rgb(78,255,0)':'')"  @click="tapHandler('D')"  >
                <MathJaxText opt="D" :txl="currentQuestion.optiond" :useMathjax = "course=='理科'"></MathJaxText>
                </div> 
            </div>
        </div>

        <img draggable="false" class="bg" :src="bg">

    </div>
</template>

<script>
import _ from 'lodash'
import {resolveAssets,getFile,rw,rh,randomArray} from '../utils/utils'
import EButton  from '../components/EButton'
import MathJaxText from './MathJaxText'
const {app} = window.electron.remote
 
export default {
    props:['config',"visible",'from',"pageParam"],
    data(){
        return {
            answers:[],
            questions:[],
            bg:null,
            buttons:[],
            course:null,
            pageSize:1,
            pages:null,
            curQuestions:[],
            count:0,
            result:[],
            currentQuestion:null,
            selected:'',
            clickenable :true,
            rr:''
        }
    },
    mounted(){ 
       //console.log('mountend')
        this.bg = resolveAssets(app,_.get(this.config,'config.bg'))
        let buttons = _.get(this.config,'config.buttons')
        this.buttons = buttons
        if(this.pageParam && this.pageParam.list){
            this.curQuestions = this.pageParam.questions
            this.answers = this.pageParam.answers
            this.clickenable = false;
            this.count = 0
            this.selected = this.answers[this.count]
            
        }else{ 
            let qs = getFile(app, _.get(this.config,'config.content.items'))
            this.questions = qs.list; 
            this.curQuestions =randomArray(this.questions,5,this.pageSize && this.pageSize.type)
            this.clickenable =true
            this.count = 0
            this.answers = []
            this.selected = '' 
        }
        this.course = this.pageParam &&  this.pageParam.type == "2" ? '文科' :'理科'
        this.pages = this.curQuestions.length 
        this.currentQuestion = this.curQuestions[this.count]
 
        this.rr =this.currentQuestion && this.currentQuestion.answers

    },
     watch:{
        count(val){
             this.currentQuestion  = this.curQuestions[val] 
             if(!this.clickenable){
                 this.selected = this.answers[val]
             }
        },
        pageParam(val){ 
           //console.log('-----------------------------------------------------pageparam',val)
            if(val &&val.list){
                this.curQuestions = val.list
                this.count = 0
                this.answers = val.answers
                this.clickenable =false
                 this.selected = this.answers[this.count]
            }else{

                this.clickenable =true
                let qs = getFile(app, _.get(this.config,'config.content.items'))
                this.questions = qs.list; 
                this.curQuestions =randomArray(this.questions,5,val&&val.type)
                this.answers = []
                this.count = 0
                 this.selected = ''
            }
            this.course =val && val.type == "2" ? '文科' :'理科'
            this.pages = this.curQuestions.length 
            this.currentQuestion = this.curQuestions[this.count]
            this.rr = this.currentQuestion && this.currentQuestion.answer
        }
    },

    computed:{ 
        visibleStyle(){
            return this.visible ? '' : 'display:none'
        },
        courseStyle(){
            let list = []
            list.push('position:absolute')
            list.push(`color:${_.get(this.config,'config.title.color')}`)
            list.push(`font-size:${rw(_.get(this.config,'config.title.fontSize'))}`)
            list.push(`font-weight:${_.get(this.config,'config.title.fontWeight')}`)
            list.push(`left:${rw(_.get(this.config,'config.title.x'))}`)
            list.push(`top:${rh(_.get(this.config,'config.title.y'))}`)
            // list.push(`width:${rw(_.get(this.config,'config.img2D.width'))}`)
            // list.push(`height:${rh(_.get(this.config,'config.img2D.height'))}`)
            list.push('z-index:1')
            let style = list.join(';')
           //console.log(style)
            return style    
        },

        contentStyle(){
            let list = []
            list.push('position:absolute')
            list.push('text-align:left')

            list.push(`color:${_.get(this.config,'config.content.color')}`)
            list.push(`font-size:${rw(_.get(this.config,'config.content.fontSize'))}`)

            list.push(`left:${rw(_.get(this.config,'config.content.x'))}`)
            list.push(`top:${rh(_.get(this.config,'config.content.y'))}`)
            list.push(`width:${rh(_.get(this.config,'config.content.width'))}`)
            list.push(`height:${rh(_.get(this.config,'config.content.height'))}`)

            list.push(`z-index:${this.zIndex||1}`)
            let style = list.join(';')
            //console.log(style)
            return style    
        },

        optionStyle(){
            let list = [] 
            list.push(`margin:${rw(_.get(this.config,'config.content.margin'))}`) 
            let style = list.join(';')
            //console.log(style)
            return style    
        }

    },
    methods:{
        buttonHandler(e){
            
            if(e.type=="routeTo"){

                let result = this.computeScore()
                this.$emit('routeTo',{path:e.options.path,param:result})
                this.selected = ""
            }

            if(e.type=="actionTo"){

                if(e.options.action==='back'){
                    this.$emit('routeTo',this.from)
                }else{

                    if(e.options.action == 'pre' && this.count > 0){
                        this.count = this.count - 1
                        this.selected = this.answers[this.count]
                    }else if(e.options.action == 'next' && this.count < this.pages-1){
                        this.count = this.count + 1
                        this.selected = ''
                    }

                    // let start = (this.curPage-1)*this.pageSize
                    // let end = this.curPage * this.pageSize
                    // this.curQuestions = this.questions.slice(start,end)
                }

             }
        },
        fullClick(){
            let c = _.get(this.config,'config.bgclick')
            if(c && c.to){
                this.$emit('routeTo',c.to)
            }
        },
        tapHandler(sa){
            if(this.clickenable){
                this.selected = sa
               this.answers[this.count] = sa
            }
        },
        computeScore(){
            let result = {
                course:this.course,
                type:    this.course ==  '文科'  ? '2':'3',
                score:0,
                right:0,
                wrong:0,
                list: [...this.curQuestions],
                answers: [...this.answers]
            }

            for(let i=0;i<this.curQuestions.length;i++){
                let question = this.curQuestions[i]

                let selected = this.answers[i]
                let answer = _.get(question,'answer')
                if(selected == answer){
                    result.score = result.score + 20
                    result.right = result.right + 1
                }
            }
            result.wrong = this.curQuestions.length - result.right

            return result

        }



    },

   

    components:{
        EButton,
        MathJaxText
    }
}
</script>

<style>

    .selected{
        color:red;
    }

</style>
