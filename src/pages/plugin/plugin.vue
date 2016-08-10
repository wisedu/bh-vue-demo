<template>
    <div>
        <component :is='app' @widget-active='widgetActive'></component>
    </div>
</template>

<script>
    import router from 'src/router';

    var _ = Vue.util;

    var _cachedApp = [];

    var _loadScript = (url, callback) => {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.onreadystatechange = function () {
            if (this.readyState === 'complete') {
                callback();
            }
        };

        script.onload = function () {
            callback();
        };

        script.src = url;
        head.appendChild(script);
    };

    var _loadWidget = (vm, widgetName) => {
        var dfd = $.Deferred();

        // 已经加载过的app，可以直接使用
        if (_cachedApp.indexOf(widgetName) > -1) {
            vm.app = widgetName;
            dfd.resolve();
            return dfd.promise();
        }

        var widgetUrl = '/widgets/' + widgetName + '.js';
        _loadScript(widgetUrl, () => {
            // console.log(widgetName + ' loaded');
            vm.app = widgetName;
            _cachedApp.push(widgetName);
            dfd.resolve();
        });

        return dfd.promise();
    };

    export default {
        data () {
            return {
                app: null
            };
        },
        methods: {
            widgetActive (routes) {
                console.log(this.$router);
                var matched = this.$router._currentTransition.to.matched;

                var len = matched.length;
                var segments = [];
                for (var i = 0; i < len; i++) {
                    segments.push({
                        path: matched[i].handler.path,
                        handler: matched[i].handler
                    });
                }

                for (var path in routes) {
                    var handler = routes[path];
                    router.addSubRouter(path, handler, _.extend([], segments));
                }
            }
        },
        route: {
            data (transition) {
                var name = 'app' + transition.to.params.id;
                _loadWidget(this, name).done(() => {
                    transition.next();
                });
            }
        }
    };
</script>
