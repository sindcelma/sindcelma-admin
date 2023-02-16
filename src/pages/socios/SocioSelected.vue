import { defineProps, defineComponent } from 'vue';
<template>
    <div class="container">
        <div class="row">
            <div class="col-6 py-5">

                <div v-if="image != ''">
                    <img :src="image" class="img-thumbnail" style="width: 100px;"/>
                </div>

                <h1>{{ nome }} {{ sobrenome }}</h1>
                <h4><small>email:</small> <b>{{ email }}</b></h4>
                <h4><small>CPF:</small> <b>{{ cpf }}</b></h4>
                <h4><small>NP:</small> <b>{{ np }}</b></h4>
                <h4 :class="status == 2 ? 'text-warning' : (status == 3 ? 'text-success' : 'text-danger')"
                ><b>{{ status == 2 ? 'aguardando aprovação' : (status == 3 ? 'ativo' : 'bloqueado') }}</b></h4>
                <h4  style="font-size: 10px;"><b>{{ slug }}</b></h4>
                
                <div v-if="status == 2">
                    <button @click="mudar_status(3)" class="btn btn-success m-2">aprovar</button>
                    <button @click="mudar_status(1)" class="btn btn-danger m-2">reenviar imagens</button>
                </div>

                <div v-if="status == 3">
                    <button @click="mudar_status(4)" class="btn btn-danger m-2">bloquear</button>
                </div>

                <div v-if="status == 4">
                    <button @click="mudar_status(3)" class="btn btn-success m-2">desbloquear</button>
                </div>

            </div>
            <div class="col-6 py-4">
                <div class="row">
                    <div class="col">
                        <h5>Imagens Enviadas:</h5>
                    </div>
                </div>
                <div class="row">
                    <div class="col" v-for="image in images" :key="image">
                        <img :src="image.slug" style="height: 340px;"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

import { useRoute } from 'vue-router'
import {defineComponent} from 'vue'
import request from '@/libs/request'
import Config from '@/libs/config'

export default defineComponent({

    created(){
        const router = useRoute()
        this.id = Number(router.params.id)
        this.getSocio()
    },

    data() {
        return {
            nome:"",
            sobrenome:"",
            email:"",
            cpf:"",
            np:"",
            slug:"",
            id: 0,
            images:[],
            status: 0,
            image:''
        }
    },

    methods: {

        async getSocio(){
            
            let resp = await request
            .uri('user/socios/get_socio_por_id')
            .post({ id: this.id })

            let message    = resp.message()

            this.status    = message.status 
            this.nome      = message.nome 
            this.sobrenome = message.sobrenome
            this.cpf       = message.cpf
            this.np        = message.np
            this.slug      = message.slug
            this.email     = message.email
            this.images    = message.images
            
            this.image     = Config.file('images/fav/'+this.email+'.jpg')

        },

        async mudar_status(status:number){
            
            let resp = await request
            .uri('user/socios/mudar_status')
            .post({
                slug:this.slug,
                status:status
            })

            if(resp.code() == 200){
                this.status = status
            }

        }

    },

})

</script>