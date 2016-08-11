<template>
    <article class='demo-stepwizard' bh-layout-role="single-no-title">
        <section class="bh-mh-8 bh-mv-8">
            <header>
                <h2>气泡弹窗</h2>
            </header>
            <div class="bh-mv-8 bh-mb-16">
                <div>
                    <bh-button class='btn-open'>打开</bh-button>
                </div>
                <bh-popover v-ref:bp1 title='用户信息' position='bottom' selector='.btn-open'>
                    <div>
                        <p>个人信息面板内容</p>
                        <p>个人信息面板内容</p>
                        <p>个人信息面板内容</p>
                        <p>个人信息面板内容</p>
                    </div>
                </bh-popover>
            </div>
        </section>
    </article>
</template>

<script>
    import BhButton from 'components/bh-button/bhButton';
    import BhPopover from 'components/bh-popover/bhPopover';

    export default {
        data () {
            return {
            };
        },
        methods: {
            open () {
                this.$refs.bp1.open();
            }
        },
        components: {BhButton, BhPopover}
    };
</script>

<style scoped>
    .content {
        min-height: 400px;
    }
</style>
