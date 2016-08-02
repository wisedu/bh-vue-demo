<template>
    <article class='demo-simple-search' bh-layout-role="single-no-title">
        <section class="bh-mh-8 bh-mv-8">
            <header>
                <h2>普通多条件搜索</h2>
            </header>
            <div class="bh-mv-8 bh-mb-16">
                <bh-card class='content bh-p-8'>
                    <div>
                        <emap-search model-url='http://res.wisedu.com/fe_components/mock/advencedQueryModel.json' model-name="TABLE" @search='search'></emap-search>
                    </div>
                </bh-card>
            </div>
        </section>
    </article>
</template>

<script>
    import BhCard from 'components/bh-card/bhCard';
    import EmapSearch from 'components/emap-search/emapSearch';

    export default {
        methods: {
            search (params) {
                console.log(params);
            }
        },
        components: {BhCard, EmapSearch}
    };
</script>

<style scoped>
    .content {
        min-height: 400px;
    }
</style>
