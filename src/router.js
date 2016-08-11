import Vue from 'vue';

var VueRouter = require('vue-router');
Vue.use(VueRouter);

/* eslint-disable no-new */
var router = new VueRouter();

router.map({
    '/': {
        component: (resolve) => {
            require(['pages/demo/button/button'], resolve);
        }
    },
    '/card': {
        component: (resolve) => {
            require(['pages/demo/card/card'], resolve);
        }
    },
    '/panel': {
        component: (resolve) => {
            require(['pages/demo/panel/panel'], resolve);
        }
    },
    '/dropdown': {
        component: (resolve) => {
            require(['pages/demo/dropdown/dropdown'], resolve);
        }
    },
    '/choose': {
        component: (resolve) => {
            require(['pages/demo/choose/choose'], resolve);
        }
    },
    '/stepwizard': {
        component: (resolve) => {
            require(['pages/demo/stepwizard/stepwizard'], resolve);
        }
    },
    '/stepflow': {
        component: (resolve) => {
            require(['pages/demo/stepflow/stepflow'], resolve);
        }
    },
    '/datatable': {
        component: (resolve) => {
            require(['pages/demo/datatable/datatable'], resolve);
        }
    },
    '/calendar': {
        component: (resolve) => {
            require(['pages/demo/calendar/calendar'], resolve);
        }
    },
    '/fileupload': {
        component: (resolve) => {
            require(['pages/demo/fileupload/fileupload'], resolve);
        }
    },
    '/imageupload': {
        component: (resolve) => {
            require(['pages/demo/imageupload/imageupload'], resolve);
        }
    },
    '/avatarupload': {
        component: (resolve) => {
            require(['pages/demo/avatarupload/avatarupload'], resolve);
        }
    },
    '/emap-datatable': {
        component: (resolve) => {
            require(['pages/demo/datatable/emapDatatable'], resolve);
        }
    },
    '/emap-card': {
        component: (resolve) => {
            require(['pages/demo/emapcard/emapCard'], resolve);
        }
    },
    '/emap-grid': {
        component: (resolve) => {
            require(['pages/demo/emapgrid/emapGrid'], resolve);
        }
    },
    '/emap-search': {
        component: (resolve) => {
            require(['pages/demo/search/search'], resolve);
        }
    },
    '/emap-search-adv': {
        component: (resolve) => {
            require(['pages/demo/search/searchAdv'], resolve);
        }
    },
    '/emap-form': {
        component: (resolve) => {
            require(['pages/demo/emapform/emapForm'], resolve);
        }
    },
    '/emap-dd-table': {
        component: (resolve) => {
            require(['pages/demo/emapddtable/emapDdTable'], resolve);
        }
    },
    '/emap-dd-tree': {
        component: (resolve) => {
            require(['pages/demo/emapddtree/emapDdTree'], resolve);
        }
    },
    '/emap-linkage': {
        component: (resolve) => {
            require(['pages/demo/emaplinkage/emapLinkage'], resolve);
        }
    },
    '/loading': {
        component: (resolve) => {
            require(['pages/demo/loading/loading'], resolve);
        }
    },
    '/popover': {
        component: (resolve) => {
            require(['pages/demo/popover/popover'], resolve);
        }
    },
    '/tooltip': {
        component: (resolve) => {
            require(['pages/demo/tooltip/tooltip'], resolve);
        }
    },
    '/window': {
        component: (resolve) => {
            require(['pages/demo/window/window'], resolve);
        }
    },
    '/tree': {
        component: (resolve) => {
            require(['pages/demo/tree/tree'], resolve);
        }
    },
    '/tab': {
        component: (resolve) => {
            require(['pages/demo/tabs/tabs'], resolve);
        }
    },
    '/pagination': {
        component: (resolve) => {
            require(['pages/demo/pagination/pagination'], resolve);
        }
    },
    '/editor': {
        component: (resolve) => {
            require(['pages/demo/editor/editor'], resolve);
        }
    },
    '/nav': {
        component: (resolve) => {
            require(['pages/demo/nav/nav'], resolve);
        },
        subRoutes: {
            '/': {
                component: (resolve) => {
                    require(['pages/demo/nav/demo'], resolve);
                },
                subRoutes: {
                    '/': {
                        component: {
                            template: '<p>云端中心-收到的消息</p>'
                        }
                    },
                    '/cloud/receive': {
                        component: {
                            template: '<p>云端中心-收到的消息</p>'
                        }
                    },
                    '/cloud/send': {
                        component: {
                            template: '<p>云端中心-发出的消息</p>'
                        }
                    },
                    '/cloud/favorite': {
                        component: {
                            template: '<p>云端中心-收藏的消息</p>'
                        }
                    },
                    '/data/receive': {
                        component: {
                            template: '<p>运营数据中心-收到的消息</p>'
                        }
                    },
                    '/data/send': {
                        component: {
                            template: '<p>运营数据中心-发出的消息</p>'
                        }
                    },
                    '/data/favorite': {
                        component: {
                            template: '<p>运营数据中心-收藏的消息</p>'
                        }
                    },
                    '/print': {
                        component: {
                            template: '<p>打印模板</p>'
                        }
                    },
                    '/msg': {
                        component: {
                            template: '<p>消息页面</p>'
                        }
                    }
                }
            },
            '/source': {
                component: {
                    template: require('pages/demo/nav/source.html')
                }
            },
            '/doc': {
                component: (resolve) => {
                    require(['pages/demo/nav/doc'], resolve);
                }
            }
        }
    }
});

export default router;
