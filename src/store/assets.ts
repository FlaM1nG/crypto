import { createStore, ActionContext } from 'vuex';
import coins, { CoinData } from '../services/coins';
import { Router } from 'vue-router';

interface State {
  coinData: CoinData[];
  loading: boolean;
  error: unknown;
  currentPage: number;
  limit: number;
  interval: number;
}

const store = createStore<State>({
  state: {
    coinData: [],
    loading: false,
    error: null,
    currentPage: 1,
    limit: 20,
    interval: 0, // Initialize the interval property to null
  },
  mutations: {
    SET_COIN_DATA(state, data: CoinData[]) {
      state.coinData = data;
    },
    SET_LOADING(state, isLoading: boolean) {
      state.loading = isLoading;
    },
    SET_ERROR(state, error: unknown) {
      state.error = error;
    },
    SET_CURRENT_PAGE(state, page: number) {
      state.currentPage = page;
    },
    SET_COIN_LIMIT(state, limit: number) {
      state.limit = limit;
    },
    SET_INTERVAL(state, interval: number) {
      state.interval = interval;
    },
    CLEAR_INTERVAL(state) {
      clearInterval(state.interval! as number);
      state.interval = 0;
    },
  },
  actions: {
    async fetchCoinData({ commit, state }) {
      if (state.coinData.length && state.limit === state.currentPage * 20) {
        // currentPage hasn't changed and limit is the same, no need to make a new request
        return;
      }

      commit('SET_COIN_LIMIT', state.currentPage * 20);
      commit('SET_LOADING', true);
      const interval = setInterval(async () => {
        try {
          const data = await coins.getAssets(state.currentPage * 20);
          commit('SET_COIN_DATA', data);
          commit('SET_ERROR', null);
        } catch (error) {
          console.error(error);
          commit('SET_ERROR', error);
        } finally {
          commit('SET_LOADING', false);
        }
      }, 2000); // Execute each 2sec

      // Save the reference to the interval in the store state
      commit('SET_INTERVAL', interval);

    },
    async fetchNextPage({ commit, state, dispatch }: ActionContext<State, State>) {
      if (state.coinData.length < state.currentPage * 20) {
        return;
      }
      commit('SET_CURRENT_PAGE', state.currentPage + 1);
      await dispatch('fetchCoinData');
    },
    async fetchPreviousPage({ commit, state, dispatch }: ActionContext<State, State>) {
      if (state.currentPage > 1) {
        commit('SET_CURRENT_PAGE', state.currentPage - 1);
        await dispatch('fetchCoinData');
      }
    },
  },
});

// Get router instance
let router: Router | null = null;

export function setRouter(r: Router) {
  router = r;
  // Clear the interval before leaving the current path
  router?.beforeEach((to: unknown, from: unknown, next: any) => {
    const interval = store.state.interval;
    if (interval) {
      clearInterval(interval);
      store.commit('CLEAR_INTERVAL');
    }
    next();
  });
}

export default store;