<template>
    <article class='demo-simple-search' bh-layout-role="single-no-title">
        <section class="bh-mh-8 bh-mv-8">
            <header>
                <h2>普通多条件搜索</h2>
            </header>
            <div class="bh-mv-8 bh-mb-16">
                <bh-card class='content bh-p-8'>
                    <div>
                        <emap-search :model-url='url' model-name="模型1" @search='search'></emap-search>
                    </div>
                </bh-card>
            </div>
        </section>
    </article>
</template>

<script>
    import Sys from 'config/sysconf';

    export default {
        data () {
            return {
                url: Sys.contextPath + 'mock/emap/queryModel.json'
            };
        },
        methods: {
            search (params) {
                console.log(params);
            }
        }
    };
</script>

<style scoped>
    .content {
        min-height: 400px;
    }
</style>
