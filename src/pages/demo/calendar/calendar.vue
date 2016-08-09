<template>
    <article class='demo-button' bh-layout-role="single-no-title">
        <section class="bh-mh-8 bh-mv-8">
            <header>
                <h2>日历控件</h2>
            </header>
            <div class="bh-mv-8 bh-row">
                <div class="bh-col-md-6">
                    <calendar :events='events' @item-click='onClick'></calendar>
                </div>
                <div class="bh-col-md-6">
                    <h3>事件处理</h3>
                    <button class='bh-btn bh-btn-primary bh-btn-small bh-mt-8' @click='toAdd()'>新增</button>
                    <div class='events'>
                        <bh-card class='event-item' :class='{"current": isCurrent(event)}' v-for='event in events'>
                            <div>{{event.start + "~" + event.end}}</div>
                            <div>{{event.title}}</div>
                            <div>
                                <a :href="event.location">详情</a>
                                <a href='javascript:void(0)' @click.stop='del($index)'>删除</a>
                                <a href='javascript:void(0)' @click='modify($index)'>修改</a>
                            </div>
                        </bh-card>
                    </div>
                    <div class='event-detail'>
                        <form class='bh-form-vertical'>
                            <div class="bh-form-group">
                                <bh-datetime placeholder='开始时间' :options='{showTime: false}' :value.sync='editInfo.start | defaultDate "YYYY-MM-DD"'></bh-datetime>
                            </div>
                            <div class="bh-form-group">
                                <bh-datetime placeholder='结束时间' :options='{showTime: false}' :value.sync='editInfo.end | defaultDate "YYYY-MM-DD"'></bh-datetime>
                            </div>
                            <div class="bh-form-group">
                                <bh-input placeholder='事件标题' :value.sync='editInfo.title'></bh-input>
                            </div>
                            <div class="bh-form-group">
                                <bh-input placeholder='事件链接' :value.sync='editInfo.location'></bh-input>
                            </div>
                        </form>
                        <div class='bh-btn bh-btn-primary bh-btn-small bh-pull-right' @click='save'>保存</div>
                        <div class='bh-btn bh-btn-primary bh-btn-small bh-pull-right' @click='reset'>重置</div>
                    </div>
                </div>
            </div>
        </section>
    </article>
</template>

<script>

    var _id = 1000;

    export default {
        data () {
            return {
                isNew: true, // 新增还是编辑
                editInfo: {
                    start: '',
                    end: '',
                    title: '',
                    location: ''
                },
                currentEvents: [],
                events: [
                    {id: 1, start: '2016-07-20', end: '2016-07-20', title: '这是一个单日事件', location: 'http://github.com/kylestetz/CLNDR'},
                    {id: 2, start: '2016-07-05', end: '2016-07-08', title: '这个是多日事件', location: 'http://github.com/kylestetz/CLNDR'},
                    {id: 3, start: '2016-07-07', end: '2016-07-18', title: '新年好啊新年好啊！！', location: 'http://www.baidu.com'}
                ]
            };
        },
        methods: {
            isCurrent (item) {
                return $.inArray(item.id, this.currentEvents) > -1;
            },
            onClick (e) {
                this.currentEvents = $.map(e.events, (item) => item.id);
            },
            reset () {
                this.isNew = true;
                this.editInfo = {
                    start: '',
                    end: '',
                    title: '',
                    location: ''
                };
            },
            delRand () {
                var rand = Math.floor(this.events.length * Math.random());
                this.events.splice(rand, 1);
            },
            del (index) {
                this.events.splice(index, 1);
            },
            modify (index) {
                this.editInfo = $.extend({}, this.events[index]);
                this.isNew = false;
            },
            toAdd () {
                this.reset();
            },
            save () {
                if (this.isNew) {
                    this.events.push($.extend({id: _id++}, this.editInfo));
                } else {
                    var editInfo = this.editInfo;
                    var id = editInfo.id;
                    var events = this.events;
                    $.each(events, (i, item) => {
                        if (item.id === id) {
                            events.$set(i, $.extend({}, editInfo));
                            return false;
                        }
                    });
                }
                this.reset();
            }
        }
    };
</script>

<style scoped lang='less'>
    .event-item {
        width: 200px;
        display: inline-block;
        ptoAdding: 4px;
        margin: 4px;

        a {
            width: 100%;
        }

        &.current {
            background: #eee;
        }
    }

    .event-detail {
        ptoAdding: 8px;


    }
</style>
