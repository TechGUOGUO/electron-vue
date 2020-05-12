
if (require('electron').remote) {
  console.log('------',document.body)
  setTimeout(() => {
    let timer;
    const wait = 5000;
    let timeout, args, context, timestamp, result
    document.body.addEventListener("click",require('lodash').debounce(()=>{
     
          require('electron').ipcRenderer.send('mousemove') 
     
    },300,{'maxWait':500}))
  },1000) 
} 