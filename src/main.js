import Vue from 'vue';
import App from './App';
import router from './router';

var VueRouter = require('vue-router');
Vue.use(VueRouter);

var resetWinSize = () => {
    BH_UTILS.setContentMinHeight($('main'), 'noHeader', 44);
    $('body').niceScroll();
};

$(window).resize(resetWinSize);

router.beforeEach((transition) => {
    // $('#cloudIframe').remove();
    $.bhPaperPileDialog.hide();
    $('.jqx-window').each(function () {
        $(this).jqxWindow('destroy');
    });
    transition.next();
    // var data = UserService.getLoginUserSync();
    // if ('success' == data.result) {
    //     transition.next();
    // } else {
    //     transition.abort();
    //     Util.redirectLogin();
    // }
});

router.afterEach((transition) => {
    resetWinSize();
});

router.start(App, '#app');
