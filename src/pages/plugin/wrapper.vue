<template>
    <div class='wrapper'>
        <div class='bh-mv-16 applist'>
            <bh-card v-for='app in appList' class='app bh-p-16 bh-m-8'>
                <div class='bh-mb-8'>{{app.name}}</div>
                <a v-link='"/wrapper/plugin/" + app.id'>打开应用</a>
            </bh-card>
        </div>
        <router-view class='bh-p-8'></router-view>
    </div>
</template>

<script>
    import BhCard from 'components/bh-card/bhCard';

    export default {
        data () {
            return {
                appList: [{
                    name: '应用1',
                    id: 'hello'
                }, {
                    name: '应用2',
                    id: '2'
                }]
            };
        },
        components: {BhCard}
    };
</script>

<style scoped lang='less'>
    .applist {
        min-height: 10px;
        .app {
            min-height: 80px;
            display: inline-block;
        }
    }
</style>
