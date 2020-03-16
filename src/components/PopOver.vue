<template>
    <div v-click-outside="hide" style="z-index: 1000;">
        <div @click="clicked">
            <slot name="reference"></slot>
        </div>

        <div  v-if="isVisible" class="app_popover">
            <i class="icon ion-ios-close" style="font-size:2rem; font-weight:bolder;position: absolute;top:-5px;right:5px; color: #ee7e05;" @click="isVisible=false"></i>
            <div style="margin-top:10px;padding: 2px;">
                <slot name="header"></slot>
            </div>
            <div style="padding: 2px;">
                <slot name="content"></slot>
            </div>
        </div>
    </div>
</template>

<script>
    import ClickOutside from 'vue-click-outside';

    export default {
        name: "PopOver",
        components: {
            // eslint-disable-next-line vue/no-unused-components
            ClickOutside
        },
        props:['propsIsVisible'],
        data(){
            return {
                isVisible:false
            }
        },
        methods:{
            clicked(){
                // eslint-disable-next-line no-console
                this.isVisible=true;
            },
            hide(){
                this.isVisible=false;
            }
        },
        watch: {
            propsIsVisible: function (newValue) {
                this.isVisible = newValue;
                }
            },
        directives: {
            ClickOutside
        }
    }
</script>

<style scoped>
    .app_popover{
        position: absolute;
        top:40px;
        min-width:25px;min-height:25px;
        cursor: pointer;
        padding: 5px;
        border-radius: 5px;
        background: #f2f3f7;
        box-shadow: 8px 8px 16px #8a8b8d,
        -8px -8px 16px #ffffff;
    }
</style>
