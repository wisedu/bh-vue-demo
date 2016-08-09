<template>
    <article class='demo-button' bh-layout-role="single-no-title">
        <section class="bh-mh-8 bh-mv-8">
            <header>
                <h2>模态对话框</h2>
            </header>
            <div class="bh-mv-8 bh-mb-16">
                <bh-card class='content bh-p-8'>
                    <bh-window :is-open.sync='dlg.show' :btns='dlg.btns' title='三体' :options='dlg.options' @close='dlgClosed'
                    @open='onOpen'>
                        <div slot='content'>
                            <bh-datatable
                            width='400'
                            height='400'
                            pager-mode='default' root='a1' :show-header='true' v-ref:dt1 :columns='columns' :pageable='true' :selected-rows.sync='selectedRows' :checked-rows.sync='checkedRows' :checkable='true' url='/mock/datatable.json' :query-params='queryParams' :operations='operations' @edit='edit' @del='del' :callbacks='callbacks' @row-select='rowSelect'></bh-datatable>
                        </div>
                    </bh-window>

                    <div>
                        <button class="bh-btn bh-btn-primary bh-btn-small" @click='open'>打开(包含按钮)</button>
                        <button class="bh-btn bh-btn-primary bh-btn-small" @click='close'>关闭</button>
                    </div>
                    <div class='bh-mv-8'>
                        <button class="bh-btn bh-btn-primary bh-btn-small" @click='open2'>打开(不包含按钮)</button>
                        <button class="bh-btn bh-btn-primary bh-btn-small" @click='close2'>关闭</button>
                    </div>
                </bh-card>
            </div>
        </section>
    </article>
</template>

<script>
    export default {
        data () {
            return {
                selectedRows: [],
                checkedRows: [],
                columns: [
                    {text: 'Name', dataField: 'name', width: 300},
                    {text: 'Beverage Type', dataField: 'type', width: 300},
                    {text: 'Calories', dataField: 'calories', width: 180, cellsRenderer  (row, column, value, rowData) {
                        return value + 'g';
                    }},
                    {text: 'Total Fat', dataField: 'totalfat', width: 120},
                    {text: 'Protein', dataField: 'protein'}
                ],
                queryParams: {
                    keyword: 'aaa'
                },
                operations: {
                    title: '操作',
                    width: 100,
                    items: [{
                        title: '编辑',
                        name: 'edit',
                        type: 'link'
                    }, {
                        title: '删除',
                        name: 'del',
                        type: 'link'
                    }]
                },
                callbacks: {
                    downloadComplete (data) {
                        console.log('download complete:', data);
                    }
                },
                remoteAddr: '',
                dlg: {
                    show: false,
                    btns: [{
                        className: 'bh-btn-primary',
                        text: '确定',
                        callback () {
                            console.log('ok');
                        }
                    }, {
                        className: 'bh-btn-default',
                        text: '取消',
                        callback () {
                            console.log('cancel');
                        }
                    }],
                    options: {
                        width: 500
                        // minHeight: 400
                    }
                }
            };
        },
        methods: {
            open () {
                this.remoteAddr = 'http://www.baidu.com';
                this.dlg.btns = [{
                    className: 'bh-btn-primary',
                    text: '确定',
                    callback () {
                        console.log('ok');
                    }
                }, {
                    className: 'bh-btn-default',
                    text: '取消',
                    callback () {
                        console.log('cancel');
                    }
                }];

                this.dlg.show = true;
            },
            close () {
                this.dlg.show = false;
            },
            onOpen () {
                this.$refs.dt1.setChecked([]);
            },
            open2 () {
                this.remoteAddr = 'http://www.baidu.com';
                this.dlg.btns = [];
                this.dlg.show = true;
            },
            close2 () {
                this.dlg.show = false;
            },
            dlgClosed () {
                this.remoteAddr = '';
                this.dlg.options.width = 600;
            },
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
        }
    };
</script>

<style scoped>
    .content {
        min-height: 400px;
    }
</style>
