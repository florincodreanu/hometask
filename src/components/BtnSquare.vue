<template>
    <div v-bind:class="[isPressed ?'btnSquarePressed': 'btnSquareRaised']"
         style="display: flex;align-items: center;justify-content: center;user-select: none;display: inline-block;" @click="clicked">
        <i v-bind:class="['icon', icon]" style="color:#00A86B;"></i><span style="font-family: 'Nunito Sans', sans-serif;">{{label}}</span>
    </div>
</template>

<script>
    export default {
        name: "BtnSquare",
        data(){
            return{
                isPressed:false
            }
        },
        methods:{
            clicked(){
                const vueInst=this;
                // eslint-disable-next-line no-console
                console.log('clicked')
                vueInst.isPressed=true;
                setTimeout(function(){vueInst.isPressed=false;}, 100);
            }
        }
    }
</script>

<style scoped>
    .btnSquareRaised{
        min-width:25px;min-height:25px;
        cursor: pointer;
        padding: 5px;
        border-radius: 5px;
        color:#4c4b4e;
        font-size: 1em;
        font-weight: bolder;
        background: linear-gradient(145deg, #ffffff, #dadbde);
        box-shadow: 28px 28px 41px #f0f1f5,
        -28px -28px 41px #f4f5f9;
    }

    .btnSquarePressed{
        min-width:25px;min-height:25px;
        cursor: pointer;
        padding: 5px;
        border-radius: 5px;
        background-color: #f2f3f7;
        color:#929699;
        font-size: 0.9em;
        font-weight: bold;
        box-shadow: inset 2px 2px 2px #bebebe,
        1px 0px 0px #ffffff;
    }
</style>
