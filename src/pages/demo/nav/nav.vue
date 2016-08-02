<template>
    <article bh-layout-role="single-no-title">
        <section class="bh-mh-8 bh-mv-8">
            <header>
                <h2>导航菜单</h2>
                <a class='bh-tag bh-tag-primary bh-mt-8' v-link.literal="/nav">Demo</a>
                <a class='bh-tag bh-tag-info bh-mt-8' v-link.literal="/nav/doc">说明</a>
            </header>
            <router-view class='bh-mt-8'></router-view>
        </section>
    </article>
</template>

<script>
    export default {};
</script>
