<template>
    <article class='eform-page' bh-layout-role="single-no-title">
        <section class="bh-mh-8 bh-mv-8">
            <header>
                <h2>表单 - 基于EMAP</h2>
            </header>
            <div class="bh-row">
                <div class="bh-col-md-12 bh-mt-32">
                    <bh-button @click='edit' type='primary' class='bh-mb-16'>编辑</bh-button>
                    <bh-button @click='read' type='primary' class='bh-mb-16'>只读</bh-button>
                    <bh-button @click='validate' type='primary' class='bh-mb-16'>校验</bh-button>
                    <div class='clearfix'></div>
                    <emap-form class='bh-col-md-8' v-el:ef v-ref:ef :options='options' :container='container' @inited='formInited'></emap-form>
                </div>
            </div>
        </section>
    </article>
</template>

<script>
    import Sys from 'config/sysconf';
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
                    model: 't'
                }
            };
        },
        methods: {
            validate () {
                alert(this.$refs.ef.validate());
            },
            edit () {
                this.options.model = 't';
                this.options.readonly = false;
            },
            read () {
                this.options.model = 'v';
                this.options.readonly = true;
            },
            formInited () {
                var input = $(this.$els.ef).find('[data-name=schoolCode]');
                var label = input.parent().prev('label');
                label.css({
                    background: '#900',
                    color: '#fff'
                });
                input.next('i').removeClass('icon-edit').addClass('icon-lock');
                this.$refs.ef.disableItem(['schoolCode']);
                input.parent().jqxTooltip({content: label.html(), position: 'bottom'});
            }
        },
        beforeCompile () {
            this.container = this.$el;
        },
        components: {BhButton, EmapForm}
    };
</script>
