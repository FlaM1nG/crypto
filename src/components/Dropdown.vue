<template>
<div class="group relative">
  <StdButton @custom-click="toggleDropdown">
        <slot>{{ props.selected }}</slot>
  </StdButton>
  <nav tabindex="0" 
      class="border-2 bg-white invisible border-gray-800 rounded w-60 
      absolute left-0 top-full transition-all opacity-0 group-focus-within:visible group-focus-within:opacity-100 
      group-focus-within:translate-y-1"
      >
      <ul class="py-1">
          <li v-for="item in props.items"
          :key="item.value"
          @click="itemClicked(item)">
              <div :class="{ 'bg-gray-100': selectedItem === item.label }" class="block px-4 py-2 hover:bg-gray-100" >
                {{ item.label }}
              </div>
          </li>
      </ul>
  </nav>
</div>
</template>
  
<script setup lang="ts">
import { toRef, ref, defineProps, defineEmits } from 'vue';
import StdButton from '../components/StdButton.vue';

export type Option = {
  value: number | string;
  label: string;
};

const props = defineProps({
items: {
    type: Array<Option>,
    default: () => [],
},
selected: {
    type: String,
    default: 'Dollar',
},
});

const isOpen = ref(false);
const selectedItem = toRef(props, 'selected');

const emit = defineEmits(['custom-click']);

const itemClicked = (item: Option): void => {
  onClick(item);
  isOpen.value = false;
};

const onClick = (item: Option): void => {
  emit('custom-click', item);
};

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

</script>