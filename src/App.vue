<script setup lang="ts">
import { provide, reactive } from 'vue';
import {App} from './App.ts'

import BoardComponent from './components/Board.vue'
import KeypadComponent from './components/Keypad.vue'
import ImageComponent from './components/Image.vue'
import NoteComponent from './components/Note.vue'

const appInstance = reactive(new App())
provide('AppInstance', appInstance)
</script>

<template>
  <section
    @mousemove="appInstance.onMouseMove"
    @mouseleave="appInstance.onMouseLeave"
    @mousedown="appInstance.onMouseDown"
    @mouseup="appInstance.onMouseUp"
  >
    <BoardComponent :context="appInstance"/>
    <KeypadComponent :context="appInstance"/>
    <ImageComponent :context="appInstance"/>
    <NoteComponent :context="appInstance"/>
  </section>
</template>