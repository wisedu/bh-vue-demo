<template>
    <article class='demo-fileupload' bh-layout-role="single-no-title">
        <section class="bh-mh-8 bh-mv-8">
            <header>
                <h2>表格导入</h2>
            </header>
            <div class="bh-mv-8 bh-mb-16">
                <bh-card class='content bh-p-8'>
                    <div style='width: 400px; height: 400px'>
                        <excel-upload :options='options1'></excel-upload>
                        <excel-upload class='bh-mt-8' :options='options2'></excel-upload>
                        <excel-upload class='bh-mt-8' :options='options3'></excel-upload>
                    </div>
                </bh-card>
            </div>
        </section>
    </article>
</template>

<script>
    import BhCard from 'components/bh-card/bhCard';
    import ExcelUpload from 'components/bh-excel-upload/bhExcelUpload';

    export default {
        data: () => ({
            options1: {
                btnText: '导入Excel（成功）',
                // filetype: ['xls'],
                url: 'http://172.16.7.75:8000/bh-vue/excelimport/upload',
                beforeSubmit (e, data) {
                    data.formData = {a: 1, b: 2};
                },
                onFileUploaded (e, data) {
                    return data.result.code === '0';
                },
                doCheck (data) {
                    // 模拟检查成功响应
                    return new Promise(resolve => {
                        setTimeout(() => {
                            resolve({isSuccess: true, success: 10, total: 10});
                        }, 1000);
                    });
                },
                doImport (e, opt, downTplData, options) {
                    // 模拟导入成功响应
                    return new Promise(resolve => {
                        setTimeout(() => {
                            resolve({count: 10});
                        }, 1000);
                    });
                }
            },
            options2: {
                btnText: '导入Excel（上传失败）',
                url: 'http://172.16.7.75:8000/bh-vue/excelimport/404here',
                doCheck: function (data) {},
                downloadTmplFile (e, opt, downTplData, options) {
                    console.log('downloading template file...');
                }
            },
            options3: {
                btnText: '导入Excel（校验失败）',
                url: 'http://172.16.7.75:8000/bh-vue/excelimport/upload',
                doCheck: function (data) {
                    return Promise.resolve({isSuccess: false, success: 10, total: 20});
                },
                downloadErrorFile: function (e, opt, downTplData, options) {
                    console.log(e);
                },
                doImport (e, opt, downTplData, options) {
                    // 模拟导入成功响应
                    console.log('只导入正确的数据...');
                    return new Promise(resolve => {
                        setTimeout(() => {
                            resolve({count: 10});
                        }, 1000);
                    });
                }
            }
        }),
        components: {BhCard, ExcelUpload}
    };
</script>

<style scoped>
    .content {
        min-height: 400px;
    }
</style>
