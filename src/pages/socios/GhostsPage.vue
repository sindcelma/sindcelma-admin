<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-12">
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Nome</th>
                            <th scope="col">Sobrenome</th>
                            <th scope="col">CPF</th>
                            <th scope="col">STS</th>
                            <th scope="col">#</th>
                        </tr>
                    </thead>
                    <tbody class="table-group-divider">
                        <tr v-for="socio,k in list" :key="k">
                            <th scope="row" v-if="loaded">{{ socio.id }}</th>
                            <td v-if="loaded">{{ socio.nome }}</td>
                            <td v-if="loaded">{{ socio.sobrenome }}</td>
                            <td v-if="loaded">{{ socio.cpf }}</td>
                            <td v-if="loaded">{{ socio.status }}</td>
                            <td v-if="loaded"><button @click="onClick(socio.id)" class="btn btn-sm btn-success">+</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import router from '@/router'
import { defineComponent } from 'vue'
import request from '@/libs/request';
</script>

<script lang="ts">

export default defineComponent({
    data() {
        return {
            loaded:false,
            list:[{
                id:0,
                nome:'',
                sobrenome:'',
                status:0,
                cpf:''
            }]
        }
    },
    
    async created() {
        let response = await request
            .uri('user/socios/ghosts')
            .post({})
        const list:[] = response.message()
        if(list.length > 0){
            this.list = list
            this.loaded = true
        }
        
    },

    methods: {
        onClick(id:number){
            router.push('/socios/'+id)
        }
    },
})
</script>