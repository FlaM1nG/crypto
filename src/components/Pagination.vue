<template>
  <div class="pagination">
    <button :disabled="currentPage === 1" @click="goToPreviousPage">Previous</button>
    <span>{{ currentPage }}</span>
    <button :disabled="currentPage === totalPages" @click="goToNextPage">Next</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const currentPage = ref(1);
const totalPages = ref(10); // Replace with the total number of pages in your app

const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

</script>

<style>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
}

button {
  padding: 0.5rem 1rem;
  margin: 0 0.5rem;
}
</style>