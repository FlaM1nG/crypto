<template>
  <table>
    <thead>
      <tr class="bg-gray-100 border-b-2 border-gray-400">
        <th>#</th>
        <th :class="{up: sortOrder === 1, down: sortOrder === -1}">
          <span 
            class="underline cursor-pointer" 
            @click="changeSortOrder">
            Ranking
          </span>
        </th>
        <th>Name</th>
        <th>Price</th>
        <th>Market Cap</th>
        <th>Volume(24h)</th>
        <td class="hidden sm:block">
          <input
            class="bg-gray-100 focus:outline-none border-b border-gray-400 py-2 px-4 block w-full appearance-none leading-normal"
            id="filter"
            placeholder="Search..."
            type="text"
            v-model="filter"
          />
        </td>
      </tr>
    </thead>
    <tbody>
      <tr 
        v-for="coin in filteredAssets"
        :key="coin.id"
        class="border-b border-gray-200 hover:bg-orange-100">
        <td><img :src="`https://static.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`" :alt="coin.name"></td>
        <td>{{ coin.rank }}</td>
        <td>
          <router-link
            class="hover:underline text-green-600" 
            :to="{name: 'coin-detail' , params: { id: coin.id }}">
              {{ coin.name }}
          </router-link>
          <small class="ml-1 text-gray-500">
            {{ coin.symbol }}
          </small>
        </td>
        <td>{{ formatPrice(coin.priceUsd) }}</td>
        <td>{{ formatPrice(coin.marketCapUsd) }}</td>
        <td :class="statusColour(coin.changePercent24Hr)">{{ getPercent(coin.changePercent24Hr) }}</td>
        <td class="hidden sm:block">
          <StdButton @custom-click="goToCoin(coin.id)">
            <span>Details</span>
          </StdButton>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">

import { defineProps, ref, computed } from 'vue';
import { CoinData } from '../services/coins';
import filters from '../utils/filter';
import router from '../router';
import StdButton from './StdButton.vue';

const props = defineProps({
  assets: {
    type: Array<CoinData>,
    required: false,
    default: () => [],
  },
  format: {
    type: String,
    required: false,
    default: 'Dollar'
  }
});

const filter = ref('');

const sortOrder = ref(1);

const filteredAssets = computed(() => {
  return props.assets.filter(a => 
  a.symbol.toLowerCase().includes(filter.value.toLowerCase()) ||
  a.name.toLowerCase().includes(filter.value.toLowerCase()) 
  )
  .sort((a,b) => {
    if (parseInt(a.rank) > parseInt(b.rank)){
      return sortOrder.value;
    }
    return sortOrder.value * -1;
  })
});

const formatPrice = computed(() => {
  return props.format === 'Dollar' ? getPriceDollar : getPriceEur;
});
const changeSortOrder = (): number => 
  sortOrder.value = sortOrder.value === 1 ? -1 : 1;


const getPriceDollar = (value: string) =>
  filters.formatDollar(value);

const getPriceEur = (value: string) =>
  filters.formatEur(value);

const getPercent = (value: string) =>
  filters.formatPercent(value);

const statusColour = (value: string): string => 
  value.includes('-') ? 'text-red-600' : 'text-green-600';

const goToCoin = (id: string) => router.push({name: 'coin-detail', params: { id }})

</script>

<style scoped>
.up::before {
  content: "👆";
}

.down::before {
  content: "👇";
}

td {
  padding: 20px 0px;
  font-size: 0.6rem;
  text-align: center;
}

th {
  padding: 5px;
  font-size: 0.6rem;
}

@media (min-width: 640px) {
  td,
  th {
    padding: 20px;
    font-size: 1rem;
  }

  th {
    padding: 12px;
  }
}
</style>
