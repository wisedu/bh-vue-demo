<template>
    <div class="bh-mv-8 bh-row">
        <div class="bh-col-md-2">
            <div style='width: 400px;'>
                <bh-nav :source='navMenus' @trigger='navClick'></bh-nav>
            </div>
        </div>
        <div class="bh-col-md-10">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    import BhCard from 'components/bh-card/bhCard';
    import BhNav from 'components/bh-nav/bhNav';

    export default {
        data () {
            return {
                // 包含层级关系的数据源
                navMenus: [
                    {id: 1, name: '首页应用', icon: 'iconfont icon-home', action: 'link', url: '/nav', active: true},
                    {id: 8, name: '消息', icon: 'icon-envelope', action: 'link', url: '/nav/msg'},
                    {id: 2, name: '云端中心', icon: 'iconfont icon-cloud', expand: false, children: [
                        {id: 21, name: '收到的消息', action: 'link', url: '/nav/cloud/receive', children: [
                            {id: 211, name: '消息1', action: 'trigger'},
                            {id: 212, name: '消息2', action: 'trigger'}
                        ]},
                        {id: 22, name: '发出的消息', action: 'link', url: '/nav/cloud/send'},
                        {id: 23, name: '收藏的消息', action: 'link', url: '/nav/cloud/favorite'}
                    ]},
                    {id: 3, name: '运营数据中心', icon: 'icon-moon', expand: false, children: [
                        {id: 31, name: '收到的消息', action: 'link', url: '/nav/data/receive'},
                        {id: 32, name: '发出的消息', action: 'link', url: '/nav/data/send'},
                        {id: 33, name: '收藏的消息', action: 'link', url: '/nav/data/favorite'}
                    ]},
                    {id: 4, name: '打印模板', icon: 'iconfont icon-print', action: 'trigger'},
                    {id: 5, name: '权限管理', icon: 'iconfont icon-lock', action: 'trigger'},
                    {id: 6, name: '用户角色', icon: 'icon-user', action: 'trigger'},
                    {id: 7, name: '帮助与支持', icon: 'icon-question-sign', action: 'trigger'}
                ],
                // 平铺关系的数据源
                flatMenus: [
                    {id: 1, name: '首页应用', icon: 'iconfont icon-home', action: 'link', url: '/nav', active: true},
                    {id: 2, name: '云端中心', icon: 'iconfont icon-cloud', expand: false},
                    {id: 21, name: '收到的消息', parentId: 2},
                    {id: 211, name: '消息1', action: 'trigger', parentId: 21},
                    {id: 212, name: '消息2', action: 'trigger', parentId: 21},
                    {id: 22, name: '发出的消息', action: 'link', url: '/nav/cloud/send', parentId: 2},
                    {id: 23, name: '收藏的消息', action: 'link', url: '/nav/cloud/favorite', parentId: 2},
                    {id: 3, name: '运营数据中心', icon: 'icon-moon', expand: false},
                    {id: 31, name: '收到的消息', action: 'link', url: '/nav/data/receive', parentId: 3},
                    {id: 32, name: '发出的消息', action: 'link', url: '/nav/data/send', parentId: 3},
                    {id: 33, name: '收藏的消息', action: 'link', url: '/nav/data/favorite', parentId: 3},
                    {id: 4, name: '打印模板', icon: 'iconfont icon-print', action: 'trigger'},
                    {id: 5, name: '权限管理', icon: 'iconfont icon-lock', action: 'trigger'},
                    {id: 6, name: '用户角色', icon: 'icon-user', action: 'trigger'},
                    {id: 7, name: '帮助与支持', icon: 'icon-question-sign', action: 'trigger'},
                    {id: 8, name: '消息', icon: 'icon-envelope', action: 'link', url: '/nav/msg'}
                ]
            };
        },
        methods: {
            navClick (item) {
                console.log(item.name + ' selected!');
            }
        },
        components: {BhCard, BhNav}
    };
</script>
