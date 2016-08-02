<template>
    <article class='demo-button' bh-layout-role="single-no-title">
        <section class="bh-mh-8 bh-mv-8">
            <header>
                <h2>左右列表1</h2>
                <summary class='bh-mt-8'>封装成vue组件</summary>
            </header>
            <div class="bh-mv-8 bh-mb-16">
                <bh-choose
                    v-ref:choose1
                    left-width='70%'
                    right-width='30%'
                    :left-params='{username:222}'
                    :right-params='{username:111}'
                    left-source-url='/mock/datatable.json' :leftcells-renderer='leftcellsRenderer'
                    :rightcells-renderer='leftcellsRenderer'
                    :right-cols='rightCols'
                    @left-ready='leftReady'>
                </bh-choose>
            </div>
            <div class="bh-btn bh-btn-primary bh-mb-16" @click='getChecked'>获取选择项</div>
            <div class="bh-btn bh-btn-primary bh-mb-16" @click='reload'>重新加载</div>
            <div class="bh-btn bh-btn-primary bh-mb-16" @click='addOne'>新增一项</div>
            <header>
                <h2>左右列表2</h2>
                <summary class='bh-mt-8'>不用封装成vue组件，直接参考bh_choose实现</summary>
            </header>
            <div class="bh-mv-8 bh-mb-16">
                <bh-card :level='1' class='card'>
                    <button class='bh-btn bh-btn-primary' @click='show'>选择器1(本地数据)</button>
                    <button class='bh-btn bh-btn-primary' @click='showRemote'>选择器2(远程数据)</button>
                </bh-card>
            </div>
            <bh-window v-ref:win1 :options='{width: 1100, height: 500}' @open='onOpen'>
                <div slot='content'>
                    <bh-choose
                        v-ref:choose3
                        width='800'
                        left-width='50%'
                        right-width='50%'
                        :left-params='{username:222}'
                        :right-params='{username:111}'
                        left-source-url='/mock/datatable.json' :leftcells-renderer='leftcellsRenderer'
                        :rightcells-renderer='leftcellsRenderer'
                        :right-cols='rightCols'
                        @left-ready='leftReady'>
                    </bh-choose>
                </div>
            </bh-window>
        </section>
    </article>
</template>

<script>
    import BhCard from 'components/bh-card/bhCard';
    import BhWindow from 'components/bh-window/bhWindow';
    import BhChoose from 'components/bh-choose/bhChoose';

    export default {
        data () {
            return {
                _instance: null,
                _instance2: null,
                leftcellsRenderer (row, column, value, rowData) {
                    var html = '<div>';
                    html += '<div row="' + row + '" class="bh-col-md-2"></div>';
                    html += '<div class="bh-col-md-8">' + rowData.name + '</div>';
                    html += '<div class="bh-col-md-2">' + rowData.calories + '</div>';
                    html += '</div>';
                    return html;
                },
                rightCols: [{text: 'Name', dataField: 'name', width: 300}]
            };
        },
        ready () {
            this._instance = $.bh_choose({
                leftLocalData: [{
                    'id': '1',
                    'name': 'Hot Chocolate',
                    'type': 'Chocolate Beverage',
                    'calories': '370',
                    'totalfat': '16g',
                    'protein': '14g'
                }, {
                    'id': 2,
                    'name': 'Peppermint Hot Chocolate',
                    'type': 'Chocolate Beverage',
                    'calories': '440',
                    'totalfat': '16g',
                    'protein': '13g'
                }, {
                    'id': '3',
                    'name': 'Salted Caramel Hot Chocolate',
                    'type': 'Chocolate Beverage',
                    'calories': '450',
                    'totalfat': '16g',
                    'protein': '13g'
                }, {
                    'id': '4',
                    'name': 'White Hot Chocolate',
                    'type': 'Chocolate Beverage',
                    'calories': '420',
                    'totalfat': '16g',
                    'protein': '12g'
                }],
                rightLocalData: [{
                    'id': '1',
                    'name': 'Hot Chocolate',
                    'type': 'Chocolate Beverage',
                    'calories': '370',
                    'totalfat': '16g',
                    'protein': '14g'
                }, {
                    'id': 2,
                    'name': 'Peppermint Hot Chocolate',
                    'type': 'Chocolate Beverage',
                    'calories': '440',
                    'totalfat': '16g',
                    'protein': '13g'
                }, {
                    'id': '3',
                    'name': 'Salted Caramel Hot Chocolate',
                    'type': 'Chocolate Beverage',
                    'calories': '450',
                    'totalfat': '16g',
                    'protein': '13g'
                }, {
                    'id': '4',
                    'name': 'White Hot Chocolate',
                    'type': 'Chocolate Beverage',
                    'calories': '420',
                    'totalfat': '16g',
                    'protein': '12g'
                }],
                localSearchField: 'name',
                id: 'id',
                type: 'post',
                multiSelect: true,
                showOrder: false,
                title: '添加应用',
                showSelectedTip: true,
                placeholder: '输入关键字搜索',
                callback (records) {
                    console.log(records);
                    return true;
                },
                rightcellsRenderer (row, column, value, rowData) {
                    var html = '<div>';
                    html += '<div row="' + row + '" class="bh-col-md-2"></div>';
                    html += '<div class="bh-col-md-8">' + rowData.name + '</div>';
                    html += '<div class="bh-col-md-2">' + rowData.calories + '</div>';
                    html += '</div>';
                    return html;
                },
                leftcellsRenderer (row, column, value, rowData) {
                    var html = '<div>';
                    html += '<div row="' + row + '" class="bh-col-md-2"></div>';
                    html += '<div class="bh-col-md-8">' + rowData.name + '</div>';
                    html += '<div class="bh-col-md-2">' + rowData.calories + '</div>';
                    html += '</div>';
                    return html;
                }
            });
            this._instance2 = $.bh_choose({
                leftSourceUrl: '',
                leftSourceAction: '',
                leftLocalData: null,
                rightSourceUrl: '',
                rightSourceAction: '',
                rightLocalData: null,
                localSearchField: '',
                id: '',
                type: 'post',
                multiSelect: true,
                showOrder: false,
                title: '添加应用',
                showSelectedTip: true,
                placeholder: '输入关键字搜索',
                maxSelect: null,
                callback () {},
                rightcellsRenderer (row, column, value, rowData) {
                    var html = '<div>';
                    html += '<div row="' + row + '" class="bh-col-md-2"></div>';
                    html += '<div class="bh-col-md-8">' + rowData.name + '</div>';
                    html += '<div class="bh-col-md-2">' + rowData.calories + '</div>';
                    html += '</div>';
                    return html;
                },
                leftcellsRenderer (row, column, value, rowData) {
                    var html = '<div>';
                    html += '<div row="' + row + '" class="bh-col-md-2"></div>';
                    html += '<div class="bh-col-md-8">' + rowData.name + '</div>';
                    html += '<div class="bh-col-md-2">' + rowData.calories + '</div>';
                    html += '</div>';
                    return html;
                }
            });
        },
        methods: {
            onOpen () {
                this.$refs.choose3.reload();
            },
            leftReady () {
                // alert(11)
            },
            getChecked () {
                console.log(this.$refs.choose1.getChecked());
            },
            reload () {
                this.$refs.choose1.reload();
            },
            addOne () {
                this.$refs.choose1.addAndCheck({
                    name: 'newItem---1',
                    id: '11111',
                    calories: '250'
                });
            },
            show () {
                this.$refs.win1.open();
                // this._instance.show();
            },
            showRemote () {
                this._instance2.show();
            }
        },
        components: {BhCard, BhChoose, BhWindow}
    };
</script>

<style scoped>
    .card {
        min-height: 400px;
    }
</style>
