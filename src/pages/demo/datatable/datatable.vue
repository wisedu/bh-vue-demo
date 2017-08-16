<template>
    <article bh-layout-role="single-no-title">
        <section class="bh-mh-8 bh-mv-8">
            <header>
                <h2>表格控件</h2>
            </header>
            <div class="bh-row">
                <div class="bh-col-md-3 bh-mv-8">
                    <bh-search :value.sync='queryParams.keyword' @search='search'></bh-search>
                </div>
                <div class="bh-col-md-12 bh-mv-8">
                    <button class='bh-btn bh-btn-primary' @click='getChecked'>获取选中行(checkbox选中)</button>
                    <button class='bh-btn bh-btn-primary' @click='getCurrent'>获取选中行(鼠标点击)</button>
                </div>
                <div class="bh-col-md-12 bh-mv-8 bh-mb-16">
                    <bh-datatable :options='options' v-ref:dt1 :pageable='false' :selected-rows.sync='selectedRows' :checked-rows.sync='checkedRows' url='./mock/datatable.json' :query-params='queryParams' @edit='edit' @del='del' :callbacks='callbacks' @row-select='rowSelect'></bh-datatable>
                </div>
            </div>
        </section>
    </article>
</template>

<script>
    import BhSearch from 'components/bh-search/bhSearch';
    import BhDatatable from 'components/bh-datatable/bhDatatable';

    export default {
        data () {
            return {
                selectedRows: [],
                checkedRows: [],
                options: {
                    root: 'a1',
                    checkable: true,
                    // showHeader: false, // 此处参数会覆盖标签上的 :show-header='true'
                    columns: [
                        {text: 'Name', dataField: 'name', width: 300},
                        {text: 'Beverage Type', dataField: 'type', width: 300},
                        {text: 'Calories', dataField: 'calories', width: 180, cellsRenderer: function (row, column, value, rowData) {
                            return value + 'g';
                        }},
                        {text: 'Total Fat', dataField: 'totalfat', width: 120},
                        {text: 'Protein', dataField: 'protein'}
                    ],
                    // operations: {
                    //     title: '操作',
                    //     width: 100,
                    //     items: [{
                    //         title: '编辑',
                    //         name: 'edit',
                    //         type: 'link'
                    //     }, {
                    //         title: '删除',
                    //         name: 'del',
                    //         type: 'link'
                    //     }]
                    // },
                    // rowDetails: true,
                    // initRowDetails: function(id, dataRow, element, rowInfo) {
                    //     element.append('<p>测试detail</p>');
                    // }
                },
                queryParams: {
                    keyword: 'aaa'
                },
                callbacks: {
                    downloadComplete (data) {
                        console.log('download complete:', data);
                    }
                }
            };
        },
        methods: {
            rowSelect (rows) {
                console.log(rows);
            },
            edit (row) {
                console.log('edit row:', row);
            },
            del (row) {
                console.log('delete row:', row);
            },
            getCurrent () {
                console.log(this.selectedRows);
            },
            getChecked () {
                console.log(this.checkedRows);
            },
            search () {
                this.$refs.dt1.render();
            }
        },
        components: {BhDatatable, BhSearch}
    };
</script>
