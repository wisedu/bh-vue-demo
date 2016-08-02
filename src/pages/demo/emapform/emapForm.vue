<template>
    <article class='eform-page' bh-layout-role="single-no-title">
        <section class="bh-mh-8 bh-mv-8">
            <header>
                <h2>表单 - 基于EMAP</h2>
            </header>
            <div class="bh-row">
                <div class="bh-col-md-12 bh-mt-32">
                    <button @click='validate'>校验</button>
                    <emap-form v-ref:ef :options='options' :container='container'></emap-form>
                </div>
            </div>
        </section>
    </article>
</template>

<script>
    import EmapForm from 'components/emap-form/emapForm.vue';

    export default {
        data () {
            return {
                container: null,
                options: {
                    pagePath: 'http://res.wisedu.com/fe_components/mock/page_model.json',
                    modelName: 'FORM_GROUP',
                    readonly: true,
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
        components: {EmapForm}
    };
</script>
