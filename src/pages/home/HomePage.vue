<template>
    <component :is="component"></component>
</template>

<script lang="ts">

import { defineComponent } from "vue";
import LoadingView from '@/components/LoadingView.vue';
import HomeMain from '@/pages/home/HomeMain.vue'

export default defineComponent({

    components:{ LoadingView, HomeMain },

    created(){
        this.init();
    },

    data() {
        return {
            component:'LoadingView'
        }
    },


    methods:{
        async init(){
            this.component = 'HomeMain'
        }
    }

})

</script>