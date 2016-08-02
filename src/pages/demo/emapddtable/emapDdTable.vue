<template>
    <article class='eform-page' bh-layout-role="single-no-title">
        <section class="bh-mh-8 bh-mv-8">
            <header>
                <h2>下拉表格 - 基于EMAP</h2>
            </header>
            <div class="bh-row">
                <div class="bh-col-md-12 bh-mt-32">
                    <emap-dd-table v-ref:ddt :options='options'></emap-dd-table>
                    <button class="bh-btn bh-btn-primary" @click='getVal'>获取值</button>
                </div>
            </div>
        </section>
    </article>
</template>

<script>
    import EmapDdTable from 'components/emap-dd-table/emapDdTable.vue';

    export default {
        data () {
            return {
                options: {
                    url: 'http://localhost:3000/mock/emap/code.json'
                }
            };
        },
        methods: {
            getVal () {
                console.log(this.$refs.ddt.getValue());
            }
        },
        components: {EmapDdTable}
    };
</script>
