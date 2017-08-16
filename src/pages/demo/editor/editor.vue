<template>
    <article bh-layout-role="single-no-title">
        <section class="bh-mh-8 bh-mv-8">
            <header>
                <h2>富文本编辑器</h2>
            </header>
            <div class="bh-row bh-mt-16">
                <div class="bh-col-md-7 bh-mv-8 bh-mb-16">
                    <emap-editor v-ref:ee :options='options'></emap-editor>
                </div>
                <div class="clearfix"></div>
                <div class="bh-col-md-7 bh-mv-8">
                    <button class='bh-btn bh-btn-default' @click='getContent'>获取输入内容</button>
                    <button class='bh-btn bh-btn-default' @click='setValue'>设置内容</button>
                    <button class='bh-btn bh-btn-default' @click='clear'>清空内容</button>
                    <button class='bh-btn bh-btn-default' @click='disable'>禁用</button>
                    <button class='bh-btn bh-btn-default' @click='enable'>启用</button>
                    <button class='bh-btn bh-btn-default' @click='isEmpty'>是否为空</button>
                </div>
            </div>
            <hr>
            <div>
                <button class="bh-btn bh-btn-default" @click="showPop">弹出编辑器</button>
                <bh-window v-ref:win>
                    <div slot='content'>
                        <emap-editor v-ref:we :options='options'></emap-editor>
                    </div>
                </bh-window>
            </div>
        </section>
    </article>
</template>

<script>
    import Sys from 'config/sysconf'
    import BhWindow from 'components/bh-window/bhWindow.vue';
    import EmapEditor from 'components/emap-editor/emapEditor.vue';

    export default {
        data () {
            return {
                options: {
                    contextPath: Sys.contextPath + 'mock/emap/major-model.json'
                }
            };
        },
        methods: {
            showPop () {
                this.$refs.win.open();
            },
            getContent () {
                console.log(this.$refs.ee.getValue());
            },
            setValue () {
                this.$refs.ee.setValue('<p>Hello World, Hello Dog !</p>');
            },
            clear () {
                this.$refs.ee.clear();
            },
            disable () {
                this.$refs.ee.disable();
            },
            enable () {
                this.$refs.ee.enable();
            },
            isEmpty () {
                alert(this.$refs.ee.isEmpty());
            }
        },
        components: {EmapEditor, BhWindow}
    };
</script>
