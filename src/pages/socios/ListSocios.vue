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
                            <th scope="col">NP</th>
                            <th scope="col">#</th>
                        </tr>
                    </thead>
                    <tbody class="table-group-divider">
                        <tr v-for="socio in socios" :key="socio">
                            <th scope="row">{{ socio.id }}</th>
                            <td>{{ socio.nome }}</td>
                            <td>{{ socio.sobrenome }}</td>
                            <td>{{ socio.cpf }}</td>
                            <td>{{ socio.np }}</td>
                            <td><button @click="onClick(socio.id)" class="btn btn-sm btn-success">+</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import router from '@/router'
import { defineProps, defineComponent } from 'vue'

defineProps({
    socios:{
        type: Array,
        required: true
    }
})

</script>

<script lang='ts'>
export default defineComponent({
    methods: {
        onClick(id:number){
            router.push('/socios/'+id)
        }
    },
})
</script>