<template>
    <article class='demo-button' bh-layout-role="single-no-title">
        <section class="bh-mh-8 bh-mv-8">
            <header>
                <h2>加载效果</h2>
            </header>
            <div class="bh-mv-8 bh-mb-16">
                <bh-card class='content bh-p-8'>
                    <div style='width: 400px; height: 400px'>
                        <bh-loading :model='loading.model' :open='loading.open' text='稍等一下哦'></bh-loading>
                    </div>
                    <div>
                        <button class="bh-btn bh-btn-primary bh-btn-small" @click='open'>打开</button>
                        <button class="bh-btn bh-btn-primary bh-btn-small" @click='close'>关闭</button>
                    </div>
                </bh-card>
            </div>
        </section>
    </article>
</template>

<script>
    export default {
        data () {
            return {
                loading: {
                    open: false
                }
            };
        },
        methods: {
            open () {
                this.loading.open = true;
            },
            close () {
                this.loading.open = false;
            }
        }
    };
</script>

<style scoped>
    .content {
        min-height: 400px;
    }
</style>
