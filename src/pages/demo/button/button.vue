<template>
    <article class='demo-button' bh-layout-role="single-no-title">
        <section class="bh-mh-8 bh-mv-8">
            <header>
                <h2>输入框组</h2>
            </header>
            <bh-card class='bh-p-8 bh-mt-16'>
                <div class="bh-mv-8 bh-mb-16">
                    <h3 class='bh-mb-8'>Input</h3>
                    <div class="bh-row">
                        <div class="bh-col-md-6">
                            <bh-input :value.sync='inputObj.inputVal' placeholder='请输入问题' :disabled='inputDisabled'></bh-input>
                            <div>{{inputObj.inputVal}}</div>
                        </div>
                        <div class="bh-col-md-3">
                            <bh-button icon='pifu' icon-dir='right' type='primary' @click='getInput'>获取输入</bh-button>
                            <bh-button type="primary" @click='disableInput'>禁用</bh-button>
                            <bh-button type="primary" @click='enableInput'>启用</bh-button>
                        </div>
                    </div>
                    <div class="bh-row bh-mt-8">
                        <div class="bh-col-md-6">
                            <bh-input :value.sync='inputVal2' placeholder='自动完成，请输入字母"a"' :source='candidates'></bh-input>
                        </div>
                        <div class="bh-col-md-1">
                            <bh-button type="primary" @click='getInput2'>获取输入</bh-button>
                        </div>
                    </div>
                </div>
                <div class="bh-mv-8 bh-mb-16">
                    <h3 class='bh-mb-8'>Search</h3>
                    <div class="bh-row bh-mt-8">
                        <div class="bh-col-md-6">
                            <bh-search @search='search' :value.sync='inputVal4' placeholder='随便输入，长度小于10' :maxlength='maxlength' :source='candidates'></bh-search>
                        </div>
                        <div class="bh-col-md-1">
                            <bh-button type="primary" @click='getInput4'>获取输入</bh-button>
                        </div>
                    </div>
                </div>
                <div class="bh-mv-8 bh-mb-16">
                    <h3 class='bh-mb-8'>Textarea</h3>
                    <div class="bh-row bh-mt-8">
                        <div class="bh-col-md-6">
                            <bh-textarea placeholder='输点东东' :value.sync='inputVal3' :source='candidates' :disabled='taDisabled'></bh-textarea>
                        </div>
                        <div class="bh-col-md-1">
                            <bh-button type="primary" @click='getInput3'>获取输入</bh-button>
                            <bh-button class="bh-btn bh-btn-primary bh-btn-small bh-mt-8" @click='clearInput3'>清空</bh-button>
                            <bh-button class="bh-btn bh-btn-primary bh-btn-small bh-mt-8" @click='disableTa'>禁用</bh-button>
                            <bh-button class="bh-btn bh-btn-primary bh-btn-small bh-mt-8" @click='enableTa'>启用</bh-button>
                        </div>
                    </div>
                </div>
            </bh-card>
            <div class="clearfix"></div>
            <bh-card class='bh-p-8 bh-mt-16'>
                <div class="bh-row">
                    <div class="bh-col-md-3">
                        <div class="bh-mv-8 bh-mb-16">
                            <h3 class='bh-mb-8'>Checkbox</h3>
                            <bh-checkbox @change='change' w=20 h=20>是否开启</bh-checkbox>
                            <div class="bh-mb-8"></div>
                            <bh-checkbox :disabled='isdisabled'>无法操作</bh-checkbox>
                            <div class="bh-mb-8"></div>
                            <template v-for='item in checklist'>
                                <bh-checkbox :ischeck.sync='item.auth'>{{item.name}}</bh-checkbox>
                            </template>
                            <bh-button class="bh-btn bh-btn-primary bh-btn-small bh-mt-8" @click='allowCheck'>允许操作</bh-button>
                            <bh-button class="bh-btn bh-btn-danger bh-btn-small bh-mt-8" @click='disallowCheck'>禁止操作</bh-button>
                        </div>
                    </div>
                    <div class="bh-col-md-3">
                        <div class="bh-mv-8 bh-mb-16">
                            <h3 class="bh-mb-8">Checklist</h3>
                            <bh-checklist v-ref:chklist1 display-member='name' @change='checklistChange' :source='fruits' dir='h'></bh-checklist>
                            <bh-button class="bh-btn bh-btn-primary bh-btn-small bh-mt-8" @click='showChecklist'>获取选择</bh-button>
                        </div>
                    </div>
                    <div class="bh-col-md-3">
                        <div class="bh-mv-8 bh-mb-16">
                            <h3 class="bh-mb-8">Radio</h3>
                            <bh-radio :items='fruits' :value.sync='selVal' dir='v' @change='radioChange'></bh-radio>
                            <bh-button class="bh-btn bh-btn-primary bh-btn-small bh-mt-8" @click='showSelVal'>获取选择</bh-button>
                            <bh-button class="bh-btn bh-btn-primary bh-btn-small bh-mt-8" @click='allowAll'>允许所有</bh-button>
                            <bh-button class="bh-btn bh-btn-danger bh-btn-small bh-mt-8" @click='disallowAll'>禁止所有</bh-button>
                        </div>
                    </div>
                    <div class="bh-col-md-2">
                        <div class="bh-mv-8 bh-mb-16">
                            <h3 class='bh-mb-8'>Switch</h3>
                            <bh-switch :disabled='disableSwitch' :toggled.sync='isOn' @toggle='showSwitch' on-text='default on' off-text='default off'></bh-switch><br>
                            <bh-switch class='bh-mt-8' theme='danger' on-text='danger on' off-text='danger off'></bh-switch><br>
                            <bh-button class="bh-btn bh-btn-primary bh-btn-small bh-mt-8" @click='showSwitch'>获取选择</bh-button>
                            <bh-button class="bh-btn bh-btn-primary bh-btn-small bh-mt-8" @click='allowSwitch'>允许操作</bh-button>
                            <bh-button class="bh-btn bh-btn-danger bh-btn-small bh-mt-8" @click='disallowSwitch'>禁止操作</bh-button>
                        </div>
                    </div>
                    <div class="bh-col-md-1">
                        <div class="bh-mv-8 bh-mb-24">
                            <h3 class='bh-mb-8'>Toggle</h3>
                            <bh-toggle :toggled='toggled' on-text='开启' off-text='关闭' @toggle='toggle'></bh-toggle>
                        </div>
                    </div>
                </div>
            </bh-card>
            <bh-card class='bh-p-8 bh-mt-16'>
                <div class="bh-mv-8 bh-mb-16">
                    <h3 class='bh-mb-8'>DateTime</h3>
                    <div class="bh-row">
                        <div class="bh-col-md-6">
                            <bh-datetime v-ref:dt1 :value.sync='dtval' :disabled='dateDisabled' :options='dtoptions'></bh-datetime>
                        </div>
                        <div class="bh-col-md-5">
                            <bh-button type="primary" @click='getDate'>获取选择</bh-button>
                            <bh-button type="primary" @click='resetDate'>重置</bh-button>
                            <bh-button type="primary" @click='disableDate'>禁用</bh-button>
                            <bh-button type="primary" @click='enableDate'>启用</bh-button>
                            <bh-button type="primary" @click='setMinDate'>设置min date</bh-button>
                        </div>
                    </div>
                </div>
                <div class="bh-mv-8 bh-mb-16">
                    <h3 class='bh-mb-8'>FileUpload // TODO</h3>
                    <div class="bh-row">
                        <div class="bh-col-md-6">
                            <bh-fileupload></bh-fileupload>
                        </div>
                    </div>
                </div>
            </bh-card>
        </section>
    </article>
</template>

<script>
    var candidates = ['aaaa', 'abcd', 'alfgh', 'allow', 'basdf', 'boosdf'];

    var words = [{name: 'allow', sid: 1}, {name: 'abc', sid: 2}, {name: 'badf', sid: 3}, {name: 'best world', sid: 4}, {name: 'car', sid: 5}, {name: 'choice', sid: 6}];

    export default {
        data () {
            return {
                inputObj: {
                    inputVal: ''
                },
                candidates: candidates,
                inputDisabled: false,
                toggled: false,
                isallow: false,
                isdisabled: true,
                checklist: [{name: 1, value: 1, auth: false}, {name: 2, value: 2, auth: true}],
                fruits: [{
                    name: 'apple',
                    value: 'a1',
                    disabled: false
                }, {
                    name: 'orange',
                    value: 'o1',
                    disabled: true
                }, {
                    name: 'peach',
                    value: 'o2',
                    disabled: false
                }],
                selVal: 'o2',
                taDisabled: false,
                disableSwitch: true,
                dateDisabled: true,
                isOn: true,
                inputVal: '默认文字',
                inputVal2: '',
                inputVal3: '',
                inputVal4: '',
                words: words,
                maxlength: 10,
                dditem: 3,
                dtval: '1986-01-02 12:00',
                dtoptions: {
                    // min: new Date() // min设置会过滤默认设置的值
                    // culture: 'zh-CN',
                    // dateFormat: 'yyyy-MM-dd ',
                    // timeFormat: 'yyyy-MM-dd hh:mm',
                    // showTime: false,
                    // min: undefined,
                    // max: undefined
                }
            };
        },
        methods: {
            disableInput () {
                this.inputDisabled = true;
            },
            enableInput () {
                this.inputDisabled = false;
            },
            disableTa () {
                this.taDisabled = true;
            },
            enableTa () {
                this.taDisabled = false;
            },
            toggle (val) {
                console.log('now status: ' + val);
            },
            change (val) {
                console.log('checked: ' + val);
            },
            checklistChange (data) {
                console.log(data);
            },
            allowCheck () {
                this.isdisabled = false;
            },
            showChecklist () {
                console.log(this.$refs.chklist1.getChecked());
            },
            disableDate () {
                this.dateDisabled = true;
            },
            enableDate () {
                this.dateDisabled = false;
            },
            disallowCheck (val) {
                this.isdisabled = true;
            },
            showSelVal () {
                console.log('selected: ' + this.selVal);
            },
            allowAll () {
                this.fruits.forEach((item) => {
                    item.disabled = false;
                });
            },
            disallowAll () {
                this.fruits.forEach((item) => {
                    item.disabled = true;
                });
            },
            radioChange (val) {
                console.log('change: ' + val);
            },
            allowSwitch () {
                this.disableSwitch = false;
            },
            disallowSwitch () {
                this.disableSwitch = true;
            },
            showSwitch () {
                console.log('switch: ' + this.isOn);
            },
            getInput () {
                console.log(this.inputObj.inputVal);
            },
            getInput2 () {
                console.log(this.inputVal2);
            },
            search (val) {
                console.log('search ' + val);
            },
            getInput3 () {
                console.log(this.inputVal3);
            },
            getInput4 () {
                console.log(this.inputVal4);
            },
            clearInput3 () {
                this.inputVal3 = '';
            },
            getDropItem () {
                console.log(this.dditem);
            },
            resetDrop () {
                this.dditem = words[0];
            },
            getDate () {
                console.log(this.dtval);
            },
            resetDate () {
                this.dtval = new Date();
            },
            setMinDate () {
                this.$refs.dt1.setMinDate(new Date());
            }
        },
        ready () {
        }
    };
</script>

<style scoped>
    .demo-button {
        min-height: 500px;
    }
</style>
