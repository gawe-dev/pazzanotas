<script setup lang="ts">
import {
  onMounted
} from 'vue'

import { App } from '../App'

const { context } = defineProps<{context:App}>()
  
onMounted(() => {
  document.addEventListener('contextmenu', function (evt) { evt.preventDefault(); }, false)
  let board:any = document.getElementById('board')
  scroll(board.clientWidth/2-innerWidth/2, board.clientHeight/2-innerWidth/2)
})

</script>

<template>
  <section id="board"
    @paste="context.board.onPaste"
    @keydown="context.board.onKeyDown"
    contenteditable="true"
    :style="{
      'height':context.board.maxHeight + 'px',
      'width':context.board.maxWidth + 'px'
    }"
  >
  </section>
</template>
<style scoped>
#board{
  caret-color: transparent;
  outline: none;
  cursor: default;
}
</style>
