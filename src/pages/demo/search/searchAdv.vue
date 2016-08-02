<template>
    <article class='demo-simple-search' bh-layout-role="single-no-title">
        <section class="bh-mh-8 bh-mv-8">
            <header>
                <h2>高级搜索-包含条件构造器</h2>
            </header>
            <div class="bh-mv-8 bh-mb-16">
                <bh-card class='content bh-p-8'>
                    <div>
                        <emap-search-adv model-url='http://res.wisedu.com/fe_components/mock/advencedQueryModel.json' model-name='TABLE' @search='search'></emap-search-adv>
                    </div>
                </bh-card>
            </div>
        </section>
    </article>
</template>

<script>
    import BhCard from 'components/bh-card/bhCard';
    import EmapSearchAdv from 'components/emap-search-adv/emapSearchAdv';

    export default {
        methods: {
            search (params) {
                console.log(params);
            }
        },
        components: {BhCard, EmapSearchAdv}
    };
</script>

<style scoped>
    .content {
        min-height: 400px;
    }
</style>
