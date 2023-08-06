<template>
  <main>
    <Header :links="link"/>
    <router-view />
  </main>
</template>

<script setup lang="ts">
import Header from './components/Header.vue';

export type LinksData = {
  title: string,
  to: any
}

const link = [
  {
    title: 'BTC',
    to: { name: 'coin-detail', params: { id: 'bitcoin' } }
  },
];

</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
