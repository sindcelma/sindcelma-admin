<template>
    <component :is="component" :sorteios="sorteios"></component>
</template>

<script lang="ts">

import { defineComponent } from "vue";
import LoadingView from '@/components/LoadingView.vue';
import SorteiosList from '@/pages/sorteios/SorteiosList.vue'
import request from "@/libs/request";

export default defineComponent({

    components:{ LoadingView, SorteiosList },

    created(){
        this.getList();
    },

    data() {
        return {
            component:'LoadingView',
            sorteios:[]
        }
    },


    methods:{
        async getList(){

            this.component = "LoadingView"
            
            let resp = await request
            .uri('sorteios/list_all')
            .post({})
            
            if(resp.code() != 200) return;

            this.sorteios = resp.message()

            this.component = "SorteiosList"
            
        }
    }

})

</script>