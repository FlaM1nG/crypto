<template>
    <div :style="spinnerStyles">
      <img :src="imagePath" alt="Loading...">
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps, computed } from 'vue';
  import spinnerImage from '../assets/spinner.svg';
  
  const props = defineProps({
    imagePath: {
      type: String,
      default: spinnerImage,
    },
    size: {
      type: Number,
      default: 50,
    },
    speed: {
      type: Number,
      default: 2,
    },
    position: {
      type: String,
      default: 'absolute'
    }
  })

  const spinnerStyles = computed((): Record<string, string | number> => {
    return {
        animation: `rotate ${props.speed}s linear infinite`,
        index: 2,
        position: props.position,
        top: '50%',
        left: '50%',
        margin: `-${props.size / 2}px 0 0 -${props.size / 2}px`,
        width: `${props.size}px`,
        height: `${props.size}px`,
      };
});

  </script>