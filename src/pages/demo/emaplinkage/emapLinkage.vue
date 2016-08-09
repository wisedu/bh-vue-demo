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
    export default {
        data () {
            return {
                options: {
                    data: [],
                    storeId: 'image',
                    contextPath: '/mock',
                    defaultAvatar: '../u20.png',
                    ratio: 1,
                    width: 100,
                    type: ['jpg', 'png', 'gif'],
                    size: 5120
                }
            };
        }
    };
</script>
