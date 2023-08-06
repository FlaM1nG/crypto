<template>
   <header class="shadow w-screen">
        <nav>
            <nav class="flex items-center justify-between bg-green-400 p-6">
                <router-link :to="{name: 'home'}">
                    <div class="flex items-center flex-shrink-0 text-white mr-6">
                            <Icon class="mr-4"/>
                        <span class="font-semibold text-xl tracking-tight ">Crypto</span>
                    </div>
                </router-link>
                <div class="hidden sm:block w-full flex-grow lg:flex lg:items-center lg:wauto">
                    <div class="flex items-center text-sm lg:flex-grow">
                        <router-link 
                            v-for="l in props.links"
                            :key="l.title"
                            :to="l.to"
                            class="block lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4" >
                        {{ l.title }}
                        </router-link>
                    </div>
                </div>
            </nav>
        </nav>
    </header> 
</template>

<script setup lang="ts">
import Icon from './Icon.vue';
import { LinksData } from '../App.vue'

const props = defineProps({
  links: {
    type: Array<LinksData>,
    required: false,
    default: () => [],
  },
});

</script>
