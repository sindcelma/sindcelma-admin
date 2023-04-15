<template>
    <div class="container-fluid border">
        <div class="row">
            <div class="col-12" v-if="image != ''">
                <img :src="image" alt=""/>
            </div>
            <div class="col">
                <UploadFile text="Fazer upload" dir="images/cct" @onUploaded="uploaded"/>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import UploadFile from '@/components/UploadFile.vue';
import request from '@/libs/request';
import { defineComponent } from 'vue';

export default defineComponent({

    data(){
        return {
            image:""
        }
    },

    components: { UploadFile },
    methods:{

        uploaded(img:string){
            this.image = img
        },

        async error(){
            await request.uri('test/401').get()
        }
    }
})

</script>