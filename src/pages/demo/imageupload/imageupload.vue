<template>
    <article class='demo-fileupload' bh-layout-role="single-no-title">
        <section class="bh-mh-8 bh-mv-8">
            <header>
                <h2>图片上传（多张）</h2>
            </header>
            <div class="bh-mv-8 bh-mb-16">
                <bh-card class='content bh-p-8'>
                    <emap-imageupload ftype='png'></emap-imageupload>
                </bh-card>
            </div>
        </section>
    </article>
</template>

<script>
    export default {
    };
</script>

<style scoped>
    .content {
        min-height: 400px;
    }
</style>
