<template>
    <article class='demo-button' bh-layout-role="single-no-title">
        <section class="bh-mh-8 bh-mv-8">
            <header>
                <h2>卡片/面板</h2>
            </header>
            <div class="bh-mv-8 bh-mb-16">
                <bh-card :level='1'>
                    <p>一级卡片</p>
                </bh-card>
                <bh-card :level='2' id='card2'>
                    <p>二级卡片</p>
                </bh-card>
                <bh-card :level='3' id='card3'>
                    <p>三级卡片</p>
                </bh-card>
                <bh-card :level='4' id='card4'>
                    <p>四级卡片</p>
                </bh-card>
            </div>
        </section>
    </article>
</template>

<script>
    import BhCard from 'components/bh-card/bhCard';

    export default {
        components: {BhCard}
    };
</script>

<style scoped>
    .bh-card {
        width: 400px;
        height: 200px;
        margin: 8px;
        float: left;
    }
    p {
        margin-top: 5px;
        font-size: 16px;
        text-indent: 10px;
    }
    #card2 {
        margin-left: -100px;
        margin-top: 50px;
    }
    #card3 {
        margin-left: -200px;
        margin-top: 100px;
    }
    #card4 {
        margin-left: -300px;
        margin-top: 200px;
    }
</style>
