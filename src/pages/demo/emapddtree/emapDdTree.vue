<template>
    <article class='eform-page' bh-layout-role='single-no-title'>
        <section class='bh-mh-8 bh-mv-8'>
            <header>
                <h2>下拉树 - 基于EMAP</h2>
            </header>
            <h3 class='bh-mt-16'>异步树</h3>
            <div class='bh-row'>
                <div class='bh-col-md-12 bh-mt-8'>
                    <emap-dd-tree v-ref:ddt1 :options='options1'></emap-dd-tree>
                    <button class='bh-btn-primary' @click='getValue'>获取选择项</button>
                </div>
            </div>
            <h3 class='bh-mt-16'>同步树</h3>
            <div class='bh-row'>
                <div class='bh-col-md-12 bh-mt-8'>
                    <emap-dd-tree v-ref:ddt2 :options='options2'></emap-dd-tree>
                    <button class='bh-btn-primary' @click='setValue'>设置选择项</button>
                </div>
            </div>
        </section>
    </article>
</template>

<script>
    import Sys from 'config/sysconf';

    export default {
        data () {
            return {
                options1: {
                    // checkboxes:true,
                    url: Sys.contextPath + 'mock/emap/ddtree.json',
                    params: {}
                },
                options2: {
                    checkboxes: true,
                    datas: [{
                        'id': '1',
                        'name': '党群组织',
                        'pId': '0'
                    }, {
                        'id': '000010',
                        'name': '党群组织/工会',
                        'pId': '1'
                    }, {
                        'id': '000012',
                        'name': '党群组织/宣传',
                        'pId': '1'
                    }]
                }
            };
        },
        methods: {
            getValue () {
                console.log(this.$refs.ddt1.getValue());
            },
            setValue () {
                this.$refs.ddt2.setValue(['000010', '党群组织/工会']);
            }
        }
    };
</script>
