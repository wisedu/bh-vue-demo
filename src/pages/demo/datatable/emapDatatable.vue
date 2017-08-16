<template>
    <article bh-layout-role="single">
        <h2>表格控件</h2>
        <section>
            <bh-button @click='init' class='bh-mv-16'>初始化</bh-button>
            <!-- <bh-button @click='importFile' class='bh-mv-16'>导入</bh-button> -->
            <bh-button @click='getFirstRow' class='bh-mv-16'>获取第一行数据</bh-button>
            <bh-button @click='getCheckedRow' class='bh-mv-16'>获取复选数据</bh-button>
            <emap-datatable v-ref:dt1 :options='options' @edit='edit' @del='del'></emap-datatable>
        </section>
    </article>
</template>

<script>
    import Sys from 'config/sysconf';
    import EmapDatatable from 'components/emap-datatable/emapDatatable.vue';
    import EmapForm from 'components/emap-form/emapForm.vue';
    import BhButton from 'components/bh-button/bhButton.vue';
    export default {
        data () {
            return {
                options: {
                    // pagePath: 'http://localhost:3000/mock/emap/major-model.json',
                    pagePath: Sys.contextPath + 'mock/emap/campus-meta.json',
                    // method: 'post',
                    checkable: true,
                    url: 'mock/emap/campus-data.json',
                    action: 'feedback_list',
                    selectionMode: 'singleRow',
                    lazyInit: true,
                    params: {
                        a: ''
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
            init () {
                this.$refs.dt1.init();
            },
            getFirstRow () {
                console.log(this.$refs.dt1.getDataByRow(0));
            },
            getCheckedRow () {
                console.log(this.$refs.dt1.checkedRecords());
            },
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
            },
            importFile () {
                // let host = 'http://172.20.6.12:8080';

                $.emapImport({
                    adapter: 'EMAP_IMPORT_DIRECT',
                    uploadUrl: '/xsxx/file/uploadTempFile.do',
                    rownumUrl: '/xsxx/sys/emapcomponent/imexport/importRownum.do', // 导入行号请求 url
                    fileImportUrl: '/xsxx/sys/emapcomponent/imexport/import.do', // 导入文件请求 url
                    tplUrl: 'ccc.do' // 下载模板请求 url，view直接下载
                });
            }
        },
        components: {EmapDatatable, EmapForm, BhButton}
    };
</script>
