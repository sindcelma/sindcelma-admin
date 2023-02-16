<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-12">
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Título</th>
                            <th scope="col">data do sorteio</th>
                            <th scope="col">status</th>
                            <th scope="col">#</th>
                        </tr>
                    </thead>
                    <tbody class="table-group-divider">
                        <tr v-for="sorteio in sorteios" :key="sorteio">
                            <th scope="row">{{ sorteio.sorteio_id }}</th>
                            <td>{{ sorteio.titulo }}</td>
                            <td>{{ sorteio.data }}</td>
                            <td>{{ sorteio.ativo == 1 ? 'Ativo' : (sorteio.ativo == 0 ? 'rascunho' : 'finalizado') }}</td>
                            <td><button @click="onClick(sorteio.sorteio_id)" class="btn btn-sm btn-success">+</button></td>
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
    sorteios:{
        type: Array,
        required: true
    }
})

</script>

<script lang='ts'>
export default defineComponent({
    methods: {
        onClick(id:number){
            router.push('/sorteios/'+id)
        },
    },
})
</script>