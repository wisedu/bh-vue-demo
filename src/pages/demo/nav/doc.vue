<template>
<div v-pre>
    <bh-card class='bh-p-8'>
        <h3>标签</h3>
        <code>
<pre v-pre>
&lt;bh-nav :source='navMenus' @trigger='navClick'&gt;&lt;/bh-nav&gt;
</pre>
        </code>
        <h3>数据格式(navMenus)</h3>
        <code>
<pre>
[
    {id: 1, name: '首页应用', icon: 'iconfont icon-home', type: 'link', url: '/nav', active: true},
    {id: 2, name: '云端中心', icon: 'iconfont icon-cloud', expand: false, children: [
        {id: 21, name: '收到的消息', type: 'link', url: '/nav/cloud/receive'},
        {id: 22, name: '发出的消息', type: 'link', url: '/nav/cloud/send'},
        {id: 23, name: '收藏的消息', type: 'link', url: '/nav/cloud/favorite'},
    ]},
    {id: 3, name: '运营数据中心', icon: 'icon-moon', expand: false, children: [
        {id: 31, name: '收到的消息', type: 'link', url: '/nav/data/receive'},
        {id: 32, name: '发出的消息', type: 'link', url: '/nav/data/send'},
        {id: 33, name: '收藏的消息', type: 'link', url: '/nav/data/favorite'},
    ]},
    {id: 4, name: '打印模板', icon: 'iconfont icon-print', type: 'trigger', url: '/nav/print'},
    {id: 5, name: '权限管理', icon: 'iconfont icon-lock', type: 'trigger', url: '/nav/permission'},
    {id: 6, name: '用户角色', icon: 'icon-user', type: 'trigger', url: '/nav/user'},
    {id: 7, name: '帮助与支持', icon: 'icon-question-sign', type: 'trigger', url: '/nav/help'},
    {id: 8, name: '消息', icon: 'icon-envelope', type: 'link', url: '/nav/msg'}
]
</pre>
        </code>
    </bh-card>
</div>
</template>

<script>
    export default {
    };
</script>
