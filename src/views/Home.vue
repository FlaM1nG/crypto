<template>
  <div class="container mx-auto px-5 sm:px-20 py-10 flex justify-between">
      <div class="mr-4">
        <StdButton :is-disabled="currentPage === 1 || loading" @custom-click="fetchPreviousPage">
          <slot>Back</slot>
        </StdButton>
      </div>
      <div class="flex justify-center">
        <dropdown :items="coinsFormat" :selected="selectedFormat" @custom-click="changeFormat" />
      </div>
      <div>
        <StdButton @custom-click="fetchNextPage">
          <slot>Next</slot>
        </StdButton>
      </div>
  </div>
  <div class="flex justify-center">
    <Spinner v-if="loading" />
    <Table v-else :assets="coinData" :format="selectedFormat" />
    <div v-if="error">Failed to load data</div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import Table from '../components/Table.vue';
import Spinner from '../components/Spinner.vue';
import StdButton from '../components/StdButton.vue';
import store from '../store/assets';
import Dropdown, { Option } from '../components/Dropdown.vue'

const selectedFormat = ref('Dollar');
const coinsFormat: Option[] = reactive([
    {
        label: 'Eur',
        value: 'formatEur'

    },
    {
        label: 'Dollar',
        value: 'formatDollar'
    }
]);

onMounted(() => {
  store.dispatch('fetchCoinData');
});

const loading = computed(() => store.state.loading);
const error = computed(() => store.state.error);
const coinData = computed(() => store.state.coinData);
const currentPage = computed(() => store.state.currentPage);

const changeFormat = (item: Option) => selectedFormat.value = item.label;

const fetchNextPage = () => {
  store.dispatch('fetchNextPage');
};

const fetchPreviousPage = () => {
  store.dispatch('fetchPreviousPage');
};
</script>