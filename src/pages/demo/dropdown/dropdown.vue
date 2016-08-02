<template>
    <article class='demo-button' bh-layout-role="single-no-title">
        <section class="bh-mh-8 bh-mv-8">
            <header>
                <h2>下拉框</h2>
            </header>
            <bh-card class='bh-p-8 bh-mt-16'>
                <div class="bh-mv-8 bh-mb-16">
                    <h3 class='bh-mv-8'>简单数组绑定</h3>
                    <div class="bh-row">
                        <div class="bh-col-md-6">
                            <bh-dropdown v-ref:dd0 :source='[1,2,3,4,5,6]'></bh-dropdown>
                        </div>
                        <div class="bh-col-md-6">
                            <button class="bh-btn bh-btn-primary bh-btn-small" @click='selectOneSimple'>选择一项</button>
                        </div>
                    </div>
                    <h3 class='bh-mv-8'>对象列表绑定</h3>
                    <div class="bh-row">
                        <div class="bh-col-md-6">
                            <bh-dropdown v-ref:dd1 :source='words' display-member='slabel' :current.sync='dditem'></bh-dropdown>
                        </div>
                        <div class="bh-col-md-6">
                            <button class="bh-btn bh-btn-primary bh-btn-small" @click='getDropItem'>获取选择</button>
                            <button class="bh-btn bh-btn-primary bh-btn-small" @click='setNewData'>设置新数据</button>
                            <button class="bh-btn bh-btn-primary bh-btn-small" @click='selectOne'>选择一项</button>
                            <button class="bh-btn bh-btn-primary bh-btn-small" @click='resetDrop1'>重置</button>
                        </div>
                    </div>
                    <h3 class='bh-mv-8'>支持多选</h3>
                    <div class="bh-row">
                        <div class="bh-col-md-6">
                            <bh-dropdown v-ref:dd2 :source='words' display-member='slabel' :checkable='true' :checked-indexes='[1,3,5]'></bh-dropdown>
                        </div>
                        <div class="bh-col-md-6">
                            <button class="bh-btn bh-btn-primary bh-btn-small" @click='getCheckedItems'>获取多选列表</button>
                            <button class="bh-btn bh-btn-primary bh-btn-small" @click='checkOne'>选择一项</button>
                            <button class="bh-btn bh-btn-primary bh-btn-small" @click='resetDrop2'>重置</button>
                        </div>
                    </div>
                    <h3 class='bh-mv-8'>ajax获取数据</h3>
                    <div class="bh-row">
                        <div class="bh-col-md-6">
                            <bh-dropdown v-ref:dd3 root='a1' display-member='name' value-member='id' url='http://localhost:3000/mock/datatable.json'></bh-dropdown>
                        </div>
                    </div>
                </div>
            </bh-card>
        </section>
    </article>
</template>

<script>
    import BhCard from 'components/bh-card/bhCard';
    import BhDropdown from 'components/bh-dropdown/bhDropdown';

    var words = [
        {slabel: 'allow', value: 1}, {slabel: 'abc', value: 2}, {slabel: 'badf', value: 3},
        {slabel: 'best world', value: 4}, {slabel: 'car', value: 5}, {slabel: 'choice', value: 6}
    ];

    export default {
        data () {
            return {
                words: words,
                dditem: 3
            };
        },
        methods: {
            getDropItem () {
                console.log(this.$refs.dd1.getSelectedItem());
            },
            getCheckedItems () {
                console.log(this.$refs.dd2.getCheckedItems());
            },
            selectOne () {
                this.$refs.dd1.selectItem(2);
            },
            selectOneSimple () {
                this.$refs.dd0.selectItem(2);
            },
            checkOne () {
                this.$refs.dd2.checkItem(3);
            },
            setNewData () {
                this.words = [{slabel: 'new-label', value: 1}];
            },
            resetDrop1 () {
                this.$refs.dd1.reset();
            },
            resetDrop2 () {
                this.$refs.dd2.reset();
            }
        },
        components: {
            BhCard, BhDropdown
        }
    };
</script>

<style scoped>
    .demo-button {
        min-height: 500px;
    }
</style>
