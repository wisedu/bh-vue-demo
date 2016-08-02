<template>
    <article class='demo-button' bh-layout-role="single-no-title">
        <section class="bh-mh-8 bh-mv-8">
            <header>
                <h2>工具提示</h2>
            </header>
            <div class="bh-mv-8 bh-mb-16">
                <bh-card class='content bh-p-8'>
                    <div class='box' v-bh-tooltip='{content: "自动关闭"}'>默认行为</div>
                    <div class='box' v-bh-tooltip='{content: "点击我才能关闭", autoHide: false}'>点击才能关闭</div>
                    <div class='box' v-bh-tooltip='{content: "方向向上", position: "top"}'>向上</div>
                    <div class='box' v-bh-tooltip='{content: "方向向左", position: "left"}'>向左</div>
                    <div class='box' v-bh-tooltip='{content: "方向向右", position: "right"}'>向右</div>
                </bh-card>
            </div>
        </section>
    </article>
</template>

<script>
    import BhCard from 'components/bh-card/bhCard';

    export default {
        components: {BhCard}
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
