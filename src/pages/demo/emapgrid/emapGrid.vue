<template>
    <article bh-layout-role="single-no-title">
        <section class="bh-mh-8 bh-mv-8">
            <header>
                <h2>高级表格控件</h2>
            </header>
            <div class="bh-row">
                <div class="bh-col-md-12 bh-mt-32">
                    <emap-grid :options='options'></emap-grid>
                </div>
            </div>
        </section>
    </article>
</template>

<script>
    import Sys from 'config/sysconf';
    import EmapGrid from 'components/emap-grid/emapGrid.vue';

    var getCustomColumns = () => {
        var customColumns = [{
            colIndex: 0,
            showCheckAll: true,
            type: 'checkbox',
            width: 50
        }, {
            colField: 'status',
            type: 'tpl',
            column: {
                cellsRenderer (row, column, value, rowData) {
                    return value ? '正常' : '异常';
                }
            },
            width: 50
        }];

        return customColumns;
    };

    export default {
        data () {
            return {
                options: {
                    pagePath: Sys.contextPath + 'mock/emap/campus-meta.json',
                    method: 'GET',
                    action: 'feedback_list',
                    selectionMode: 'singleRow',
                    // lazyInit: true,
                    params: {
                        a: 111,
                        b: 233
                    },
                    customColumns: [
                        {
                            type: 'tpl',
                            colField: 'submitTime',
                            column: {
                                cellsRenderer (row, column, value, rowData) {
                                    return new Date(rowData.submitTime).toLocaleString();
                                }
                            }
                        }
                    ],
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
                    }
                }
            };
        },
        components: {EmapGrid}
    };
</script>
