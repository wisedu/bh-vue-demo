import Vue from 'vue';
import Vuex from 'vuex';
import menus from './modules/menus';
import tree from './modules/tree';

Vue.use(Vuex);
Vue.config.debug = true;

// const state = {
//     staffs: ['First One'],
//     menus: [],
//     treeData: []
// }

// const mutations = {
//     STAFF_LIST (state, staffs) {
//         state.staffs = staffs
//     },
//     MENU_LIST (state, menus) {
//         state.menus = menus
//     },
//     TREE_DATA (state, data) {
//         state.treeData = data
//     }
// }

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
    modules: {
        menus,
        tree
    },
    strict: debug
});
