<template>
    <article class='linkage-page' bh-layout-role="single-no-title">
        <section class="bh-mh-8 bh-mv-8">
            <header>
                <h2>级联下拉列表</h2>
            </header>
            <div class="bh-row">
                <div class="bh-col-md-12 bh-mt-32">
                    <emap-linkage :options='options'></emap-linkage>
                </div>
            </div>
        </section>
    </article>
</template>

<script>
    import EmapLinkage from 'components/emap-linkage/emapLinkage.vue';

    export default {
        data () {
            return {
                options: {

                }
            };
        },
        components: {EmapLinkage}
    };
</script>
