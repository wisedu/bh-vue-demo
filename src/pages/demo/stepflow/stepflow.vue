<template>
    <article class='demo-stepwizard' bh-layout-role="single-no-title">
        <section class="bh-mh-8 bh-mv-8">
            <header>
                <h2>竖向步骤条</h2>
            </header>
            <div class="bh-mv-8 bh-mb-16">
                <bh-card class='content bh-p-8'>
                    <div>
                        <bh-step-flow v-ref:sf>
                            <bh-flow-node num='1' type='custom'>
                                <bh-button type='primary' @click='showAdd'>新增</bh-button>
                            </bh-flow-node>
                            <bh-flow-node num='5' title='新增用户' :auto-hide='true'>
                                <p>新增新增新增新增新增新增</p>
                                <p>新增新增新增新增新增新增新增</p>
                                <bh-button type='warning' @click.stop='hideAdd'>关闭</bh-button>
                            </bh-flow-node>
                            <bh-flow-node num='2' title='性别管理' caption='2015/12/26 09:00-10:00' tag='资料' :expanded='true'>
                                <p>这是2节点\节点\节点</p>
                                <p>这是2节点\节点\节点</p>
                                <p>这是2节点\节点\节点</p>
                                <p>这是2节点\节点\节点</p>
                                <p>这是2节点\节点\节点</p>
                            </bh-flow-node>
                            <bh-flow-node num='3' title='地址管理' caption='2015/12/26 09:00-10:00' tag='资料'>
                                这是3节点\节点\节点
                            </bh-flow-node>
                            <bh-flow-node num='4' title='订单管理' caption='2015/12/26 09:00-10:00' tag='资料'>
                                这是4节点\节点\节点
                            </bh-flow-node>
                        </bh-step-flow>
                    </div>
                </bh-card>
            </div>
        </section>
    </article>
</template>

<script>
    export default {
        methods: {
            showAdd () {
                this.$refs.sf.expand('5');
            },
            hideAdd () {
                this.$refs.sf.hide('5');
            }
        }
    };
</script>

<style scoped>
    .content {
        min-height: 400px;
    }
</style>
