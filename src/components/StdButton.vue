<template>
    <Spinner v-if="props.isLoading" :size="20" position="relative"/>
    <button 
        v-if="!props.isLoading"
        :disabled="props.isDisabled"
        :class="[{'cursor-not-allowed': props.isDisabled}, bgColorText ? bgColorText : 'bg-transparent']" 
        class="bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-2 border border-green-500 hover:border-transparent rounded"
        @click="buttonClick"
        >
    <slot v-if="!props.isLoading"></slot>
    </button>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import Spinner from '../components/Spinner.vue';

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false,
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
  bgColorText: {
    type: String,
    default: 'bg-green-500',
  },
});

const emit = defineEmits(['custom-click'])

const buttonClick = () => {
    emit('custom-click')
  }

</script>