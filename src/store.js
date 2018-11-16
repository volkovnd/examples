import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default () => {
  return new Vuex.Store({
    state: () => ({
      user: {
        username: null,
        logged: false,
      },
      rows: [],
    }),
    mutations: {
      setUser(state, user) {
        state.user = user;
      },
      setRows(state, rows) {
        state.rows = rows;
      },
    },
    actions: {
      // For Vuex page
      async fetchRows({ commit }) {
        const { data } = await Vue.http.get('/api/public');
        commit('setRows', data);
      },

      // Action to login and store user's data in Vuex store
      async login({ commit }, username) {
        const { data } = await Vue.http.post('/api/login', {
          username: username,
        });

        if (data.token) {
          if (process.client) {
            const Cookies = require('js-cookie');
            Cookies.set('token', data.token, { path: '/' });
          }

          commit('setUser', data.user);
        }
      },

      // Simple action to logout current user
      async logout({ commit }) {
        if (process.client) {
          require('js-cookie').set('token', null, { path: '/' });
        }
        commit('setUser', {
          username: null,
          logged: false,
        });
      },

      /**
       * If user come to this application we check is already logged.
       * Result will be stored in Vuex to be used anywhere in Vue application.
       */
      async onHttpRequest({ commit }, { http }) {
        const { data } = await http.get('/api/profile');
        commit('setUser', data);
      },
    },
  });
};
