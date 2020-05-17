<template>
    <div id='app_root'>
    </div>
</template>

<script>
export default {
    mounted(){
      window.electron.ipcRenderer.on('editor', (event ) => {
        console.log(event) // Prints 'whoooooooh!'
        this.$router.push('/editor')
      })
    }
}
</script> 
