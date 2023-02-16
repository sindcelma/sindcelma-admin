<template>
    <component :is="component"></component>
</template>

<script lang="ts">

import { defineComponent } from "vue";
import LoadingView from '@/components/LoadingView.vue';

export default defineComponent({

    components:{ LoadingView },

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

        }
    }

})

</script>