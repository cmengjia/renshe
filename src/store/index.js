import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

let store = new Vuex.Store()

store.registerModule('JCFE', {
    state: {
        isLoading: false
    },
    mutations: {
        updateLoadingStatus(state, payload) {
            state.isLoading = payload.isLoading
        }
    }
});

store.registerModule('MAIL', {
    state: {
        isfooterState: true
    },
    mutations: {
        footerState(state, payload) {
            state.isfooterState = payload.isfooterState
        }
    }
})

export default store;