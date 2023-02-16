<script lang="ts">
import { defineComponent } from 'vue'
import request from './libs/request'

export default defineComponent({

    data(){
        return {
            files:""
        }
    },

    async mounted() {

        const response = await request.uri('user/login').post({
            email:"master@admin",
            senha:"123456",
            type:"Admin",
            rememberme:true
        });

        if(response){
            console.log(response.code());
            console.log(response.message());
            request.setSession(response.message().session)
            request.saveCookie("rememberme_tk_admin", response.message().remembermetk)
        }

        const response2 = await request.uri('test/api').post({
            ola:"mundo"
        });
        if(response2){
            console.log(response2.code());
            console.log(response2.message());
        }

    },

    methods: {
        onUpload(e:Event){
            let file = (<HTMLInputElement>e.target).files[0];
            request.uploadFile('images/cct', file)
        }
    }
})
</script>

<template>

    <input type="file" v-on:change="onUpload">
    <!-- <RouterView /> -->
</template>

