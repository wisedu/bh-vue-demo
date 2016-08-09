Vue.directive('bh-validate', {
    bind: function () {
        // 准备工作
        console.log('binded');
        console.log(this);
    },
    update: function (value) {
        // 值更新时的工作
        console.log('updated');
        console.log(this);
    },
    unbind: function () {
        // 清理工作
        console.log('updated');
    }
});
