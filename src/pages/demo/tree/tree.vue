<template>
    <article class='demo-button' bh-layout-role="single-no-title">
        <section class="bh-mh-8 bh-mv-8">
            <header>
                <h2>树形控件</h2>
            </header>
            <div class="bh-mv-8 bh-mb-16">
                <div class="bh-row content bh-p-8">
                    <div class="bh-col-md-3">
                        <bh-card>
                            <bh-tree :source='treeData' @select='select1' :selected-item.sync='selItem'></bh-tree>
                            <div class='bh-m-8'>{{tip1}}</div>
                            <button class="bh-btn bh-btn-primary" @click='getSel'>获取当前项</button>
                        </bh-card>
                    </div>
                    <div class="bh-col-md-3">
                        <bh-card>
                            <bh-tree v-ref:tree2 :source='treeData' :options='chkOpt' @check-change='check1' :checked-items.sync='chks'></bh-tree>
                            <div class='bh-m-8'>{{tip2}}</div>
                            <button class="bh-btn bh-btn-primary" @click='getChk'>获取选中列表</button>
                            <button class="bh-btn bh-btn-primary" @click='checkAll'>全选</button>
                            <button class="bh-btn bh-btn-primary" @click='uncheckAll'>反选</button>
                        </bh-card>
                    </div>
                    <div class="bh-col-md-3">
                        <bh-card>
                            <bh-tree v-ref:tree3 :source='treeData' :selected-item.sync='selItem'></bh-tree>
                            <button class="bh-btn bh-btn-primary" @click='addItem'>添加子元素</button>
                            <button class="bh-btn bh-btn-primary" @click='removeItem'>删除当前元素</button>
                        </bh-card>
                    </div>
                    <div class="bh-col-md-3">
                        <bh-card>
                            <bh-tree v-ref:tree4 :source='stu' :fields='fields2'></bh-tree>
                        </bh-card>
                    </div>
                    <div class="bh-col-md-3">
                        <bh-card>
                            <bh-tree :source='userData' :fields='fields' :selected-item.sync='selItem'></bh-tree>
                            <div class='bh-m-8'>自定义数据格式</div>
                            <pre>
                                <code>
        fields: {
            id: 'sid',
            label: 'name',
            pid: 'pid',
            value: 'value'
        }
                                </code>
                            </pre>
                            <button class="bh-btn bh-btn-primary" @click='getSel'>获取当前项</button>
                        </bh-card>
                    </div>
                </div>
            </div>
        </section>
    </article>
</template>

<script>
    import store from 'vx/store';
    import {fetchTreeData} from 'vx/action';
    import {treeData} from 'vx/getters';

    export default {
        data () {
            return {
                tip1: '',
                tip2: '22',
                tip3: '',
                tip4: '',
                chkOpt: {
                    checkboxes: true,
                    hasThreeStates: true
                },
                stu: [{'id': '100', 'label': '学工', 'parentId': '0', 'leaf': false, 'expanded': true, 'selected': false}, {'id': '1000', 'label': '公共服务', 'parentId': '100', 'leaf': true, 'expanded': false, 'selected': true, 'description': '公共服务'}, {'id': '3000', 'label': '科研服务', 'parentId': '100', 'leaf': true, 'expanded': false, 'selected': false, 'description': '科研服务'}, {'id': '2000', 'label': '迎新服务', 'parentId': '100', 'leaf': true, 'expanded': false, 'selected': false, 'description': '迎新服务'}],
                userData: [{
                    sid: 1,
                    pid: 0,
                    icon: 'resources/img/icon/tree/folder.png',
                    name: 'aaaa',
                    expanded: true,
                    selected: false
                }, {
                    sid: 2,
                    pid: 1,
                    icon: 'resources/img/icon/tree/folder.png',
                    name: 'bbbb',
                    expanded: true,
                    selected: false,
                    children: [
                        {
                            sid: 23,
                            pid: 2,
                            icon: 'resources/img/icon/tree/folder.png',
                            name: '2323232323',
                            selected: true
                        }
                    ]
                }, {
                    sid: 3,
                    pid: 2,
                    icon: 'resources/img/icon/tree/folder.png',
                    name: 'cccc',
                    selected: true
                }, {
                    sid: 4,
                    pid: 0,
                    icon: 'resources/img/icon/tree/folder.png',
                    name: 'dddd',
                    value: 'd4',
                    selected: false
                }],
                fields: {
                    id: 'sid',
                    label: 'name',
                    pid: 'pid',
                    value: 'value',
                    selected: 'selected',
                    expanded: 'expanded'
                },
                fields2: {
                    id: 'id',
                    label: 'label',
                    pid: 'parentId',
                    selected: 'selected',
                    expanded: 'expanded'
                },
                selItem: null,
                chks: []
            };
        },
        methods: {
            select1 (item) {
                this.tip1 = item.label + ' selected';
            },
            check1 ({item, checked}) {
                this.tip2 = item.label + ' ' + checked;
            },
            getSel () {
                console.log(this.selItem);
            },
            getChk () {
                console.log(this.chks.map((item) => item.label).join(','));
            },
            checkAll () {
                this.$refs.tree2.checkAll();
            },
            uncheckAll () {
                this.$refs.tree2.uncheckAll();
            },
            getAll () {
                this.$refs.tree2.getAll();
            },
            addItem () {
                this.$refs.tree3.addChild({
                    label: 'nodeNew',
                    icon: 'resources/img/icon/tree/notesIcon.png'
                }, this.selItem);
            },
            removeItem () {
                this.$refs.tree3.remove(this.selItem);
            },
            removeChks () {
                this.$refs.tree3.remove(this.chks);
            }
        },
        store: store,
        ready () {
            this.fetchTreeData();
        },
        vuex: {
            actions: {
                fetchTreeData: fetchTreeData
            },
            getters: {
                treeData: treeData
            }
        }
    };
</script>

<style scoped>
    .content {
        min-height: 400px;
    }
    .bh-card {
        padding: 8px 0;
    }
</style>
