import Vue from 'vue';

Vue.directive('bh-tooltip', function (val) {
    var el = $(this.el);
    // {content: this.expression, autoHide: autoHide, position:direction}
    el.jqxTooltip(val);
});

// Vue.directive('bh-tooltip', {
//     params: ['tooltipAutoHide', 'tooltipDir'],
//     bind: function() {
//         // 准备工作
//         var el = $(this.el);
//         var autoHide = this.params['tooltipAutoHide'];
//         var direction = this.params['tooltipDir'];
//         autoHide = (autoHide === 'false' ? false : true);
//         el.jqxTooltip({content: this.expression, autoHide: autoHide, position:direction});
//     },
//     update: function (value) {
//         // 值更新时的工作
//     },
//     unbind: function() {
//         // 清理工作
//     }
// });
