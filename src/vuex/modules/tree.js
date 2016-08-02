import {
    TREE_DATA
} from '../mutation-types';

// initial state
const state = {
    all: []
};

// mutations
const mutations = {
    [TREE_DATA] (state, data) {
        state.all = data;
    }
};

export default {
    state,
    mutations
};
