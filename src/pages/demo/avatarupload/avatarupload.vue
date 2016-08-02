<template>
    <article class='demo-fileupload' bh-layout-role="single-no-title">
        <section class="bh-mh-8 bh-mv-8">
            <header>
                <h2>头像裁剪上传</h2>
            </header>
            <div class="bh-mv-8 bh-mb-16">
                <bh-card class='content bh-p-8'>
                    <emap-avatarupload ftype='png'></emap-avatarupload>
                </bh-card>
            </div>
        </section>
    </article>
</template>

<script>
    import BhCard from 'components/bh-card/bhCard';
    import EmapAvatarupload from 'components/emap-avatarupload/emapAvatarupload';

    export default {
        components: {BhCard, EmapAvatarupload}
    };
</script>

<style scoped>
    .content {
        min-height: 400px;
    }
</style>
