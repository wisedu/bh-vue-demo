module.exports = {
    props: ['contextPath'],
    data () {
        return {
            routes: {
                // '/a': {
                //     component: A
                // }
            } // 如果widget中有路由配置需要在此指定，用于远程动态加载路由！！
        };
    },
    methods: {
        l (path) {
            return (this.contextPath + path).replace(/\/\//g, '/');
        }
    },
    activate (done) {
        this.$dispatch('widget-active', this.routes);
        done();
    }
};
