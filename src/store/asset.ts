import { createStore } from 'vuex';
import { RouteLocationNormalized, useRoute } from 'vue-router';
import coins, { AssetHistoryData, MarketData } from '../services/coins';

interface CoinData {
  id: string;
  rank: string;
  symbol: string;
  name: string;
  supply: string;
  maxSupply: string;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  priceUsd: string;
  changePercent24Hr: string;
  vwap24Hr: string;
  explorer: string;
}

interface State {
  asset: CoinData,
  history: AssetHistoryData[];
  loading: boolean;
  markets: MarketData[];
}

const store = createStore<State>({
  state: {
    asset: {
      id: '',
      rank: '',
      symbol: '',
      name: '',
      supply: '',
      maxSupply: '',
      marketCapUsd: '',
      volumeUsd24Hr: '',
      priceUsd: '',
      changePercent24Hr: '',
      vwap24Hr: '',
      explorer: '',
    } as CoinData,
    history: [],
    loading: false,
    markets: [],
  },
  mutations: {
    SET_ASSET(state, data: CoinData) {
      state.asset = data;
    },
    SET_HISTORY(state, history: AssetHistoryData[]) {
      state.history = history;
    },
    SET_LOADING(state, isLoading: boolean) {
      state.loading = isLoading;
    },
    SET_MARKET(state, market: MarketData[]) {
      state.markets = market;
    },
  },
  actions: {
    async fetchAssetData({ commit, state }): Promise<void> {
      const route: RouteLocationNormalized = useRoute();
      // Obtener el parámetro "id" de la ruta
      const id = route.params.id as string;
      if (state.asset.id === id ) {
        // Is the same id (details)
        return;
      }
      commit('SET_LOADING', true);
      try {
        const [asset, history, markets] = await Promise.all([
            coins.getAsset(id), 
            coins.getAssetHistory(id),
            coins.getMarkets(id, 5),
          ]);
        commit('SET_ASSET', asset);
        commit('SET_HISTORY', history);
        commit('SET_MARKET', markets);
      } catch (error) {
        console.error(error);
      } finally {
        commit('SET_LOADING', false);
      }
    },
  },
});

export default store;