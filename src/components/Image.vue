<script setup lang="ts">
import { App } from '../App'

const { context } = defineProps<{context:App}>()
</script>

<template>
  <section class="position-absolute user-select-none p-1 bg-light bg-opacity-25"
    v-for="image in context.keypad.images"
    :style="{
      left:image.left + 'px', 
      top:image.top + 'px',
      'z-index': image.zIndex
    }"
    @auxclick="image.pinned = !image.pinned"
    @mousedown="context.keypad.imageActive = image; context.keypad.fixZindex()"
    >
    <div v-if="!image.pinned" class="d-flex justify-content-between">
      <div class="d-flex">
        <span class="btn fs-5 p-0" @mousedown="$event.button == 0 ? image.moving = true:false">👌</span>
        <span class="btn fs-5 p-0" @click="image.width += 50">➕</span>
        <span class="btn fs-5 p-0" @click="image.width -= 50">➖</span>
      </div>
      <span class="btn fs-6 p-0" @click="image.delete(context.keypad.images)">❌</span>
    </div>
    <img :src="image.base64" :width="image.width"/>
  </section>
</template>