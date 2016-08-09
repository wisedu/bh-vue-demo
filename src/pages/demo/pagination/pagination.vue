<template>
    <article class='demo-button' bh-layout-role="single-no-title">
        <section class="bh-mh-8 bh-mv-8">
            <header>
                <h2>分页工具</h2>
            </header>
            <div class="bh-mv-8 bh-mb-16">
                <bh-card class='content bh-p-8'>
                    <button class='bh-btn bh-btn-primary' @click='setTotal'>设置Total</button>
                    <bh-pagination :pagenum.sync='pager.pagenum' :pagesize='20' mode='advanced' :total-size.sync='pager.total' @page-change='gotoPage'></bh-pagination>
                </bh-card>
                <bh-card class='content bh-p-8'>
                    <div>Simple</div>
                    <bh-pagination :pagenum.sync='pager.pagenum' :pagesize='20' mode='simple' :total-size.sync='pager.total' @page-change='gotoPage'></bh-pagination>
                </bh-card>
            </div>
        </section>
    </article>
</template>

<script>
    export default {
        data () {
            return {
                pager: {
                    pagenum: 0,
                    total: 99
                }
            };
        },
        methods: {
            gotoPage (pagenum, pagesize, total) {
                console.log('go to page:' + pagenum + ', pagesize:' + pagesize + ', total:' + total);
            },
            setTotal () {
                this.pager.total = 100;
            }
        }
    };
</script>

<style scoped>
    .content {
        min-height: 100px;
    }
    .box {
        display: inline-block;
        padding: 10px;
        margin: 50px auto;
        border: 1px solid gray;
    }
</style>
