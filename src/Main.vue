<template>
    <div id='app_root'>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    mounted(){
        window.electron.ipcRenderer.on('editor', (event ) => {
           //console.log(event) // Prints 'whoooooooh!'
            this.$router.push('/editor')
        })
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