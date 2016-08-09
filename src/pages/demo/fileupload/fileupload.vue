<template>
    <article class='demo-fileupload' bh-layout-role="single-no-title">
        <section class="bh-mh-8 bh-mv-8">
            <header>
                <h2>文件上传</h2>
            </header>
            <div class="bh-mv-8 bh-mb-16">
                <bh-card class='content bh-p-8'>
                    <div style='width: 400px; height: 400px'>
                        <emap-fileupload ftype='png'></emap-fileupload>
                    </div>
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
