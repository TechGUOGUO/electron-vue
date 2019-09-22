<template>
    <div class="bundlePage" :style="visibleStyle" @click="fullClick"> 
        <div :style="courseStyle">{{course}}</div>
        <template v-for="(button,index) in buttons">
            <EButton :config = 'button' :key="index" @buttonAction="buttonHandler"/> 
        </template>

        <div :style="contentStyle">
            <div style="padding-top:15px" v-for="(question,index) in curQuestions" v-bind:key="index" >           
                <span style="font-weight:600">{{question.title}}</span>
                <div :style="optionStyle"  v-for="option in question.options" v-bind:key="option.NO" @click="tapHandler(index,option.NO)"  >
                    {{option.NO}}.{{option.text}}
                </div>

                
            </div>
        </div>

        <img draggable="false" class="bg" :src="bg">

    </div>
</template>

<script>
import _ from 'lodash'
import {resolveAssets,getFile,rw,rh} from '../utils/utils'
import EButton  from '../components/EButton'
const {app} = window.electron.remote
 
export default {
    props:['config',"visible",'from',"pageParam"],
    data(){
        return {
            bg:null,
            buttons:[],
            course:null,
            questions:[],

            pageSize:null,
            curPage:1,
            pages:null,
            curQuestions:[],
            count:null,
            result:[]
        }
    },
    mounted(){
        console.log(this.config)
        this.bg = resolveAssets(app,_.get(this.config,'config.bg'))
        let buttons = _.get(this.config,'config.buttons')
        this.buttons = buttons

        let pageSize = _.get(this.config,'config.content.pageSize')
        this.pageSize = pageSize

    },
     watch:{
        pageParam(val){
            if(typeof(val)!="string"){
                return
            }
            let file = getFile(app, val)
            console.log(file)
            if(file.error){
                this.course = ''
                this.questions=[]
                this.curQuestions=[]
            }else{
                this.course = file.course
                this.questions = file.questions
                this.count = this.questions.length
                this.pages = Math.ceil(this.count/this.pageSize)

                if(this.count<this.pageSize){
                    this.curQuestions = this.questions
                }else{
                    this.curQuestions = this.questions.slice(0,this.pageSize)
                }
            }
            
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

                    if(e.options.action == 'pre' && this.curPage > 1){
                        this.curPage = this.curPage - 1
                    }else if(e.options.action == 'next' && this.curPage < this.pages){
                        this.curPage = this.curPage + 1
                    }

                    let start = (this.curPage-1)*this.pageSize
                    let end = this.curPage * this.pageSize
                    this.curQuestions = this.questions.slice(start,end)
                }

             }
        },
        fullClick(){
            let c = _.get(this.config,'config.bgclick')
            if(c && c.to){
                this.$emit('routeTo',c.to)
            }
        },
        tapHandler(index,NO){
            
            console.log(index,NO)
            this.questions[index].selectedNO = NO
            console.log(this.questions)

        },
        computeScore(){
            let result = {
                course:this.course,
                score:0,
                right:0,
                wrong:0
            }

            for(let i=0;i<this.questions.length;i++){
                let question = this.questions[i]
                let selected = _.get(question,'selectedNO')
                let answer = _.get(question,'answer')
                if(selected == answer){
                    result.score = result.score + question.score
                    result.right = result.right + 1
                }
            }
            result.wrong = this.questions.length - result.right
            console.log(result)

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
