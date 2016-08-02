<template>
    <article class='demo-stepwizard' bh-layout-role="single-no-title">
        <section class="bh-mh-8 bh-mv-8">
            <header>
                <h2>步骤向导</h2>
            </header>
            <div class="bh-mv-8 bh-mb-16">
                <bh-card class='content bh-p-8'>
                    <div class='bh-mb-16'>
                        <bh-button @click='getCurrent'>获取当前</bh-button>
                        <bh-button @click='prev'>前一步</bh-button>
                        <bh-button @click='next'>后一步</bh-button>
                        <bh-button @click='finish'>完成</bh-button>
                        <bh-button @click='getFinished'>查看已完成</bh-button>
                        <bh-button @click='isLast'>当前是否为最后一步</bh-button>
                    </div>
                    <div>
                        <bh-step-wizard v-ref:sw :items='items' :current.sync='current' @change='stepChange' :finished='finished'></bh-step-wizard>
                    </div>
                    <div class='clearfix'></div>
                    <div>
                        <div id="step1" class="bh-hide">
                            步骤向导-1-内容
                        </div>
                        <div id="step2" class="bh-hide">
                            步骤向导-2-内容
                        </div>
                        <div id="step3" class="bh-hide">
                            步骤向导-3-内容
                        </div>
                        <div id="step4" class="bh-hide">
                            步骤向导-4-内容
                        </div>
                        <div id="step5" class="bh-hide">
                            步骤向导-5-内容
                        </div>
                        <div id="step6" class="bh-hide">
                            步骤向导-6-内容
                        </div>
                    </div>
                </bh-card>
            </div>
        </section>
    </article>
</template>

<script>
    import BhCard from 'components/bh-card/bhCard';
    import BhButton from 'components/bh-button/bhButton';
    import BhStepWizard from 'components/bh-step-wizard/bhStepWizard';

    export default {
        data () {
            return {
                current: 'step2',
                finished: ['step1'],
                items: [
                    {stepId: "step1", title: "步骤向导-1"},
                    {stepId: "step2", title: "步骤向导-2"},
                    {stepId: "step3", title: "步骤向导-3"},
                    {stepId: "step4", title: "步骤向导-4"},
                    {stepId: "step5", title: "步骤向导-5"},
                    {stepId: "step6", title: "步骤向导-6"}
                ]
            };
        },
        methods: {
            stepChange (step) {
                console.log('current : ' + step.stepId);
            },
            getCurrent () {
                alert(this.current);
            },
            prev () {
                this.$refs.sw.prev();
            },
            next () {
                this.$refs.sw.next();
            },
            finish () {
                this.$refs.sw.finish();
            },
            getFinished () {
                alert(this.finished);
            },
            isLast () {
                alert(this.$refs.sw.isLast());
            }
        },
        components: {BhButton, BhCard, BhStepWizard}
    };
</script>

<style scoped>
    .content {
        min-height: 400px;
    }
</style>
