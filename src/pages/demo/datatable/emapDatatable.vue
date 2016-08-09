<template>
    <article bh-layout-role="single">
        <h2>表格控件</h2>
        <section>
            <emap-datatable v-ref:dt1 :options='options' @edit='edit' @del='del'></emap-datatable>
        </section>
    </article>
</template>

<script>
    import Sys from 'config/sysconf'
    export default {
        data () {
            return {
                options: {
                    // pagePath: 'http://localhost:3000/mock/emap/major-model.json',
                    pagePath: Sys.contextPath + 'mock/emap/campus-meta.json',
                    method: 'GET',
                    action: 'feedback_list',
                    selectionMode: 'singleRow',
                    params: {
                        a: 111,
                        b: 233
                    },
                    customColumns: [
                        {
                            type: 'tpl',
                            colField: "submitTime",
                            column: {
                                cellsRenderer: function(row, column, value, rowData) {
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
                },
                formOpts: {
                    pagePath: Sys.contextPath + 'mock/emap/school.json',
                    modelName: '编辑学校信息'
                },
                formContainer: ''
            };
        },
        methods: {
            edit (row) {
                var vm = this;
                console.log('edit', row);
                var eform = '<emap-form :container="formContainer" offset-top=0 :options="formOpts"></emap-form>';
                $.bhPaperPileDialog.show({
                    title: '[demo]编辑数据',
                    content: eform,
                    footer: '<div class="text-center">' +
                            '<a class="bh-btn bh-btn-primary data-edit-save" href="javascript:void(0)">保存</a>' +
                            '<a class="bh-btn bh-btn-default data-edit-cancel" href="javascript:void(0)">取消</a>' +
                            '</div>',
                    ready ($header, $section, $footer, $aside) {
                        vm.formContainer = $section;
                        vm.$compile($section[0]); // 重新扫描

                        $('.data-edit-save', $footer).on('click', () => {

                            console.log('save form: ', $section.emapForm('getValue'));
                        });

                        $('.data-edit-cancel', $footer).on('click', () => {
                            $.bhPaperPileDialog.hide();
                        });
                    }
                });
            },
            del (row) {
                console.log('del', row);
                BH_UTILS.bhDialogDanger({
                    title: '删除',
                    content: '确认删除?',
                    callback () {
                        $.bhTip({
                            state: 'danger',
                            content: '删除失败'
                        });
                    }
                });
            }
        }
    };
</script>
