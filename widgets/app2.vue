<template>
    <div id='widget-app2'>
        <p>{{title}}</p>
        <div>{{msg}}</div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                title: 'APP TWO',
                msg: 'hello app 2'
            };
        }
    };
</script>

<style scoped>
    #widget-app2 {
        padding: 8px;
        background-color: #eee;
    }
</style>
