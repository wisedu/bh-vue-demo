<template>
    <article class='demo-button' bh-layout-role="single-no-title">
        <section class="bh-mh-8 bh-mv-8">
            <header>
                <h2>工具提示</h2>
            </header>
            <div class="bh-mv-8 bh-mb-16">
                <bh-card class='content bh-p-8'>
                    <div v-el:tt1 class='box'>默认行为</div>
                    <div class='box box1'>手动关闭</div>
                    <div class='box box2'>向上</div>
                    <div class='box box3'>向左</div>
                    <div class='box box4'>向右</div>
                    <div class='box box5'>向下</div>
                </bh-card>
            </div>
            <bh-tooltip :target='target'>
                <p>
                    这是提示内容
                </p>
                <a href="#">
                    支持html格式
                </a>
            </bh-tooltip>
            <bh-tooltip target='.box1' :auto-hide='false' :show-footer='true'>
                我不会自动关闭@@
            </bh-tooltip>
            <bh-tooltip target='.box2' position='top'>
                方向向上
            </bh-tooltip>
            <bh-tooltip target='.box3' position='left'>
                方向向左
            </bh-tooltip>
            <bh-tooltip target='.box4' position='right'>
                方向向右
            </bh-tooltip>
            <bh-tooltip target='.box5' position='bottom'>
                方向向下
            </bh-tooltip>
        </section>
    </article>
</template>

<script>
    import BhCard from 'components/bh-card/bhCard';
    import BhTooltip from 'components/bh-tooltip/bhTooltip';

    export default {
        data () {
            return {
                target: null
            };
        },
        ready () {
            this.target = this.$els.tt1;
        },
        components: {BhCard, BhTooltip}
    };
</script>

<style scoped>
    .content {
        min-height: 400px;
    }
    .box {
        display: inline-block;
        padding: 10px;
        margin: 50px auto;
        border: 1px solid gray;
    }
</style>
