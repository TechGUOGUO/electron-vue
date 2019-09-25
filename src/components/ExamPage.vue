<template>
    <div class="bundlePage" :style="visibleStyle" @click="fullClick"> 
        <div :style="courseStyle">{{course}}</div>
        <template v-for="(button,index) in buttons">
            <EButton :config = 'button' :key="index" @buttonAction="buttonHandler"/> 
        </template>

        <div :style="contentStyle" v-if="currentQuestion">
            <div style="padding-top:15px"    v-bind:key="index" >           
                <span style="font-weight:600">{{currentQuestion.title}}</span>
                <div :style="optionStyle+';'+(this.selected == 'A' ? 'color:red' : '')"    @click="tapHandler('A')"  >
                  A. {{currentQuestion.optiona}}
                </div> 
                 <div :style="optionStyle+';'+(this.selected == 'B' ? 'color:red' : '')"   @click="tapHandler('B')"  >
                  B. {{currentQuestion.optionb}}
                </div> 
                 <div :style="optionStyle+';'+(this.selected == 'C' ? 'color:red' : '')"    @click="tapHandler('C')"  >
                   C. {{currentQuestion.optionc}}
                </div> 
                 <div :style="optionStyle+';'+(this.selected == 'D' ? 'color:red' : '')"  @click="tapHandler('D')"  >
                   D. {{currentQuestion.optiond}}
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
            selected:''
        }
    },
    mounted(){ 
        this.bg = resolveAssets(app,_.get(this.config,'config.bg'))
        let buttons = _.get(this.config,'config.buttons')
        this.buttons = buttons
        let qs = getFile(app, _.get(this.config,'config.content.items'))
        this.questions = qs.list; 
        this.course = this.pageParam == "2" ? '文科' :'理科'
        this.curQuestions =randomArray(this.questions,5)
        this.count = 0
        this.pages = this.curQuestions.length 
        this.currentQuestion = this.curQuestions[this.count]
        console.log(this.curQuestions, this.count,this.currentQuestion)       
    },
     watch:{
         count(val){
             this.currentQuestion  = this.curQuestions[val]
             console(this.currentQuestion)
         },
        pageParam(val){ 
            console.log("================val")
           let qs = getFile(app, _.get(this.config,'config.content.items'))
            this.questions = qs.list; 
            this.course =  val == 2 ? '文科' :'理科'
            this.count = 0
            this.curQuestions =randomArray(this.questions)
            this.pages = this.curQuestions.length
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
            console.log(style)
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
            list.push(`wight:${rh(_.get(this.config,'config.content.width'))}`)
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
            this.selected = sa
            this.answers[this.count] = sa
        },
        computeScore(){
            let result = {
                course:this.course,
                score:0,
                right:0,
                wrong:0,
                qusetions: [...this.curQuestions],
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
        EButton
    }
}
</script>

<style>

    .selected{
        color:red;
    }

</style>
