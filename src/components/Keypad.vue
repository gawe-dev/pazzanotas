<script setup lang="ts">
import { App } from '../App'
import { ref } from 'vue'

const { context } = defineProps<{context:App}>()

let puedeBorrar = ref(false)
</script>
<template>
  <section class="position-fixed d-flex justify-content-center align-items-center p-1 gap-1">
    <span
      class="btn btn-outline-dark bg-dark shadow p-0 px-1 fs-1"
      @click="context.keypad.export"
    >🔼</span>
    <span
      class="btn btn-outline-dark bg-dark shadow p-0 px-1 fs-1"
      @click="context.keypad.addNote()"
      @auxclick="puedeBorrar = !puedeBorrar"
    >📜</span>
    <input type="file" hidden id="inputArchivo" @change="context.keypad.onchange">
    <span
    class="btn btn-outline-dark bg-dark shadow p-0 px-1 fs-1"
    @click="context.keypad.importar"
    >🔽</span>
    <span
      class="btn btn-outline-dark bg-dark shadow p-0 px-1 fs-1"
      :hidden="!puedeBorrar"
      @click="context.keypad.notes.splice(0)"
      @auxclick="context.keypad.images.splice(0)"
    >❌</span>
  </section>
</template>
<style scoped>
.position-fixed{
  bottom: 0;
  left: 0;
  transform: translate(calc(50vw - 50%));
}
</style>
