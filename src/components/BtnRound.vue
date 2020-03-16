<template>
    <div v-bind:class="{ btnRoundRaised:!isPressed, btnRoundPressed:isPressed }" style="margin-left: 10px;" @click="clicked">
        <i v-bind:class="['icon', icon]"
           v-bind:style="{ color: color}"
        ></i>
    </div>
</template>

<script>
    export default {
        name: "BtnRound",
        props: ['icon','color'],
        data(){
            return{
                isPressed:false
            }
        },
        methods:{
            clicked(){
                const vueInst=this;
                vueInst.isPressed=true;
                setTimeout(function(){vueInst.isPressed=false;}, 100);
            }
        }
    }
</script>

<style scoped>
    .btnRoundRaised{
        width:25px;height:25px;
        display: flex;
        cursor: pointer;
        align-items: center;
        justify-content: center;
        border-radius: 23px;
        background: linear-gradient(145deg, #ffffff, #dadbde);
        box-shadow: 28px 28px 41px #f0f1f5,
        -28px -28px 41px #f4f5f9;
    }

    .btnRoundPressed{
        width:25px;height:25px;
        display: flex;
        cursor: pointer;
        align-items: center;
        justify-content: center;
        border-radius: 23px;
        box-shadow: inset 2px 2px 2px #bebebe,
        1px 0px 0px #ffffff;
    }
</style>
