<template>
    <article bh-layout-role="single">
        <h3 class='bh-mv-8 bh-mh-8'>404，请检查路由配置</h3>
    </article>
</template>

<script>
    export default {
        components: {},
        methods: {
        },
        route: {
            data (transition) {
                console.log(transition);
            }
        }
    };
</script>

<style>
</style>
