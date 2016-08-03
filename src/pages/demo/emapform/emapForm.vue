<template>
    <article class='eform-page' bh-layout-role="single-no-title">
        <section class="bh-mh-8 bh-mv-8">
            <header>
                <h2>表单 - 基于EMAP</h2>
            </header>
            <div class="bh-row">
                <div class="bh-col-md-12 bh-mt-32">
                    <bh-button @click='validate' type='primary' class='bh-mb-16'>校验</bh-button>
                    <emap-form v-ref:ef :options='options' :container='container'></emap-form>
                </div>
            </div>
        </section>
    </article>
</template>

<script>
    import Sys from 'config/sysconf'
    import BhButton from 'components/bh-button/bhButton';
    import EmapForm from 'components/emap-form/emapForm.vue';

    export default {
        data () {
            return {
                container: null,
                options: {
                    pagePath: Sys.contextPath + 'mock/emap/school.json',
                    modelName: '编辑学校信息',
                    readonly: false,
                    model: 'v'
                }
            };
        },
        methods: {
            validate () {
                alert(this.$refs.ef.validate());
            }
        },
        beforeCompile () {
            this.container = this.$el;
        },
        components: {BhButton, EmapForm}
    };
</script>
