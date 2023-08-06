<template>
  <div class="flex-col container mx-auto px-5 sm:px-20 py-20 flex justify-center">
    <div class="flex justify-center">
      <Spinner v-if="loading"/>
    </div>
    <div v-if="!loading" class="flex-col">
        <div class="flex flex-col sm:flex-row justify-around items-center">
          <div class="flex flex-col items-center">
            <img 
                :src="`https://static.coincap.io/assets/icons/${asset.symbol.toLowerCase()}@2x.png`"  
                class="w-20 h-20 mr-5"
                :alt="asset.name"
            />
            <h1 class="text-5xl">
              {{ asset.name }}
              <small class="sm:mr-2 text-gray-500">{{ asset.symbol }}</small>
            </h1>
          </div>
          <div class="my-10 flex flex-col">
            <ul>
              <li class="flex justify-between">
                <b class="text-gray-600 mr-10 uppercase">Ranking</b>
                <span>#{{ asset.rank }}</span>
              </li>
              <li class="flex justify-between">
                <b class="text-gray-600 mr-10 uppercase">Precio actual</b>
                <span>{{ getPriceDollar(asset.priceUsd) }}</span>
              </li>
              <li class="flex justify-between">
                <b class="text-gray-600 mr-10 uppercase">Precio más bajo</b>
                <span>{{ minPrice }}</span>
              </li>
              <li class="flex justify-between">
                <b class="text-gray-600 mr-10 uppercase">Precio más alto</b>
                <span>{{ maxPrice }}</span>
              </li>
              <li class="flex justify-between">
                <b class="text-gray-600 mr-10 uppercase">Precio Promedio</b>
                <span> {{ avgPrice }}</span>
              </li>
              <li class="flex justify-between">
                <b class="text-gray-600 mr-10 uppercase">Variación 24hs</b>
                <span :class="statusColour(asset.changePercent24Hr)">{{ getPercent(asset.changePercent24Hr) }}</span>
              </li>
            </ul>
          </div>
  
          <div class="my-10 sm:mt-0 flex flex-col justify-center text-center">
            <button
              @click="toggleConverter"
              class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              {{ fromUsd ? `USD a ${asset.symbol}` : `${asset.symbol} a USD`}}
            </button>
          
            <div class="flex flex-row my-5">
              <label class="w-full" for="convertValue">
                <input
                  id="convertValue"
                  type="number"
                  v-model="convertValue"
                  :placeholder="`Value to ${fromUsd ? 'USD' : asset.symbol}`"
                  class="text-center bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
                />
              </label>
            </div>
            <span class="text-xl"> {{ convertResult }} {{ fromUsd ? `${asset.symbol}` : 'USD'}}
            </span>
          </div>
        </div>
        <line-chart
          class="my-10"
          :colors="['orange']"
          :min="minPrice"
          :max="maxPrice"
          :data="chartData"
        />
      </div>
      <h3 class="text-xl my-10">Best Exchange Offers</h3>
      <table>
        <tr v-for="market in markets" :key="market.exchangeId" class="border-b">
          <td>
            <b>{{ market.exchangeId }}</b>
          </td>
          <td>{{ getPriceDollar(market.priceUsd) }}</td>
          <td>{{ market.baseSymbol }} / {{ market.quoteSymbol }}</td>
          <td>
            <StdButton v-if="!market.url" :is-loading="market.isLoading || false" @custom-click="getWebSite(market)">
              <slot>Get Link</slot>
            </StdButton>
            <a v-else class="hover:underline text-green-600" target="_blanck"> {{ market.url }}</a>
          </td>
        </tr>
      </table>
      <Notification v-if="showNotificationComputed" :notification-message="notificationMessage" :notification-type="notificacionType" :show-notification="showNotificationComputed"/>
    </div>
  </template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import coins, { MarketData }  from '../services/coins';
import { RouteLocationNormalized, useRoute } from 'vue-router';
import filters from '../utils/filter';
import Spinner from '../components/Spinner.vue';
import Notification from '../components/Notification.vue';
import StdButton from '../components/StdButton.vue';
import store from '../store/asset';

const route: RouteLocationNormalized = useRoute();

const convertValue = ref(1);

const fromUsd = ref(true);

const showNotification = ref(false);

const notificacionType = ref('');

const notificationMessage = ref('');

watch(
  () => route.path,
  async (_newValue, _oldValue) => {
  store.dispatch('fetchAssetData');
  }
);

onMounted(async () => {
 store.dispatch('fetchAssetData');
});

const asset = computed(() => store.state.asset);
const history = computed(() => store.state.history);
const loading = computed(() => store.state.loading);
const markets = computed(() => store.state.markets);

const showNotificationComputed = computed(() => {
  return showNotification.value;
});

const convertResult = computed(() => {
  if(!convertValue.value) {
    return 0
  }

  const result = fromUsd 
    ? convertValue.value / parseFloat(asset.value.priceUsd)
    : convertValue.value * parseFloat(asset.value.priceUsd)

    return result.toFixed(4);
});

// Function convert to Dollar

// const getPriceDollar = computed(() => (value: number) =>
//   filters.formatDollar(value)
// );

// Function convert to Eur

// const getPriceEur = computed(() => (value: string) =>
//   filters.formatEur(value)
// );

const chartData = computed(() => {
  return history.value?.map(h => [new Date(h.date).toLocaleString('es-ES'), parseFloat(h.priceUsd).toFixed(2)])
});

const minPrice = computed(() => {
  if (history.value?.length ?? 0 > 0) {
    return filters.formatDollar(Math.min(...(history.value?.map((h: any) => parseFloat(h.priceUsd))) ?? []));
  }     
  return 0;
});

const maxPrice = computed(() => {
  if (history.value?.length ?? 0 > 0) {
    return filters.formatDollar(Math.max(...(history.value?.map((h: any) => parseFloat(h.priceUsd))) ?? []));
  }
  return 0;
});

const avgPrice = computed(() => {
  if ((history.value ?? []).length > 0) {
    return filters.formatDollar((history.value?.reduce((a, b) => a + parseFloat(b.priceUsd), 0) ?? 0) / (history.value?.length ?? 1));
  }
  return 0;
});

const toggleConverter = (): void => {
  fromUsd.value = !fromUsd.value;
}

const getPriceEur = (value: string): string =>
  filters.formatEur(value);

const getPriceDollar = (value: string): string =>
  filters.formatDollar(value);

const getPercent = (value: string): string =>
  filters.formatPercent(value);

const statusColour = (value: string): string => 
  value.includes('-') ? 'text-red-600' : 'text-green-600';

const hide = () => {
    showNotification.value = false;
  };

const generateExchangeLink = async (exchangeId: string): Promise<string | undefined> => {
  try {
    const response = await coins.getExchange(exchangeId);
    if (response && typeof response === 'object' && 'exchangeUrl' in response) {
      return response.exchangeUrl as string;
    }
  } catch (error) {
    console.error(error);
  }
};

const generateNotification = (type: string, message: string): void => {
  showNotification.value = true;
  notificacionType.value = type;
  notificationMessage.value = message;
  setTimeout(() => { hide() }, 3000);
};

const getWebSite = async (market: MarketData): Promise<void> => {
  market.isLoading = true;
  const exchangeUrl = await generateExchangeLink(market.exchangeId);
  if (exchangeUrl) {
    market.url = exchangeUrl;
    generateNotification('success', 'El enlace se ha generado correctamente');
  } else {
    generateNotification('error', 'El enlace no se ha generado, se ha producido un error');
  }
  market.isLoading = false;
};

</script>

  <style scoped>
td {
  padding: 10px;
  text-align: center;
}
</style>
