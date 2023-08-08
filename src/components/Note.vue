<script setup lang="ts">
import { App } from '../App'

const { context } = defineProps<{ context: App }>()
</script>

<template>
  <section class="position-absolute d-flex flex-column" v-for="note in context.keypad.notes"
    :style="{
      'left': note.left + 'px',
      'top': note.top + 'px',
      'z-index': note.zIndex,
      'box-shadow': '0 0 .75rem ' + note.bgcolor,
      'background-color': note.bgcolor,
    }"
    @auxclick="note.pinned = !note.pinned"
    @mousedown="context.keypad.noteActive = note;
      context.keypad.fixZindex()"
  >
    <div class="d-flex justify-content-between bg-dark bg-opacity-50" v-if="!note.pinned">
      <span class="btn fs-5 p-0" @mousedown="$event.button==0 ? note.moving = true : false">👌</span>
      <span class="btn fs-5 p-0" @click="note.changeColor(context.user)">🎨</span>
      <span class="btn fs-5 p-0" @click="note.delete(context.keypad.notes)">❌</span>
    </div>
    <textarea class="resize-none border-0 bg-light bg-opacity-25 text-white"
      :style="{
        fontWeight: note.textWeight,
        fontSize: note.textSize + 'px',
        width: note.width + 'px',
        height: note.height + 'px',
        lineHeight: note.textSize + 3 + 'px',
      }"
      :class="
        note.textAlignament == 0 ? 'text-start':
        note.textAlignament == 1 ? 'text-center':
        note.textAlignament == 2 ? 'text-end':
        ''
      "
      v-model="note.text"></textarea>
    <div v-if="!note.pinned" class="d-flex justify-content-between align-items-end bg-dark bg-opacity-50">
      <span class="btn fs-5 text-light p-0 ps-1"
        @click="note.changeTextSize(context.user)"
      ><sub>A</sub>A</span>
      <span class="btn fs-5 text-light p-0 fw-bolder"
        @click="note.changeTextWeight(context.user)"
      >B</span>
      <span class="btn fs-5 p-0"
        @click="note.changeTextAlignament(context.user)"
      >
        <span v-if="note.textAlignament == 0">
          ⏮️
        </span>
        <span v-if="note.textAlignament == 1">
          ⏸️
        </span>
        <span v-if="note.textAlignament == 2">
          ⏭️
        </span>
      </span>
      <span class="btn fs-5 p-0" @mousedown="$event.button==0?note.resizing = true : false">↘️</span>
    </div>
  </section>
</template>