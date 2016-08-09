<template>
    <article class='demo-stepwizard' bh-layout-role="single-no-title">
        <section class="bh-mh-8 bh-mv-8">
            <header>
                <h2>面板</h2>
            </header>
            <div class="bh-mv-8 bh-mb-16">
                <bh-panel title='用户信息' caption='个人隐私，请勿泄漏' tag='隐私'>
                    <div>
                        <p>个人信息面板内容</p>
                        <p>个人信息面板内容</p>
                        <p>个人信息面板内容</p>
                        <p>个人信息面板内容</p>
                    </div>
                </bh-panel>
                <bh-panel title='用户信息' caption='个人隐私，请勿泄漏' class='bh-mt-8' tag='隐私'>
                    <div>
                        <p>个人信息面板内容</p>
                        <p>个人信息面板内容</p>
                        <p>个人信息面板内容</p>
                        <p>个人信息面板内容</p>
                    </div>
                </bh-panel>
                <bh-panel title='用户信息' caption='个人隐私，请勿泄漏' class='bh-mt-8' tag='隐私'>
                    <div>
                        <p>个人信息面板内容</p>
                        <p>个人信息面板内容</p>
                        <p>个人信息面板内容</p>
                        <p>个人信息面板内容</p>
                    </div>
                </bh-panel>
            </div>
        </section>
    </article>
</template>

<script>
    export default {
        data () {
            return {
            };
        },
        methods: {}
    };
</script>

<style scoped>
    .content {
        min-height: 400px;
    }
</style>
