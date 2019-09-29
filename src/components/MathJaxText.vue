<template>
  <div  style="display:flex;flex-direction:row;justify-content:flex-start;align-items:center">
    <div v-if="opt" style="width:50px">{{opt}}.</div>
    <div style="flex:1" ref="out"></div>
  </div>
</template>
<script> 
export default {
  props:['opt','txl','useMathjax'],
  mounted(){
     let out = this.$refs.out
    if(this.useMathjax == true){
      const MathJax = window.MathJax;
      out.innerHTML = '';
      MathJax.texReset();
      var options = MathJax.getMetricsFor(out); 
        options.display=false;
      MathJax.tex2chtmlPromise(this.txl, options).then(function (node) {
        out.appendChild(node);
        MathJax.startup.document.clear();
        MathJax.startup.document.updateDocument();
      }).catch(function (err) {
        //
        //  If there was an error, put the message into the output instead
        //
        out.appendChild(document.createElement('pre')).appendChild(document.createTextNode(err.message));
      }).then(function () {
        //
        //  Error or not, re-enable the display and render buttons
        //
      // button.disabled = display.disabled = false;
      }); 
   
    }else{
      out.innerHTML = this.txl;
    }
  },
  watch:{
    txl(val){
       let out = this.$refs.out
    if(this.useMathjax == true){
      const MathJax = window.MathJax;
      out.innerHTML = '';
      MathJax.texReset();
      var options = MathJax.getMetricsFor(out); 
     options.display=false;
      MathJax.tex2chtmlPromise(val, options).then(function (node) {
        out.appendChild(node);
        MathJax.startup.document.clear();
        MathJax.startup.document.updateDocument();
      }).catch(function (err) {
        //
        //  If there was an error, put the message into the output instead
        //
        out.appendChild(document.createElement('pre')).appendChild(document.createTextNode(err.message));
      }).then(function () {
        //
        //  Error or not, re-enable the display and render buttons
        //
      // button.disabled = display.disabled = false;
      }); 
   
    }else{
      out.innerHTML = val;
    }
    }
  }
}
</script>
