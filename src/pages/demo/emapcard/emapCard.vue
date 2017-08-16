<template>
    <article bh-layout-role="single-no-title">
        <section class="bh-mh-8 bh-mv-8">
            <header>
                <h2>卡片列表控件</h2>
            </header>
            <div class="bh-row bh-mt-16">
                <div class="bh-col-md-12 bh-mv-8 bh-mb-16">
                    <emap-card :options='options'></emap-card>
                </div>
            </div>
        </section>
    </article>
</template>

<script>
    import Sys from 'config/sysconf'
    import EmapCard from 'components/emap-card/emapCard.vue';

    export default {
        data () {
            return {
                options: {
                    pagePath: Sys.contextPath + 'mock/emap/major-model.json',
                    url: 'http://172.16.7.75:8000/bh-vue/grid/data',
                    action: 'TABLE',
                    template: require('./cardTpl.html')
                }
            };
        },
        components: {EmapCard}
    };
</script>
