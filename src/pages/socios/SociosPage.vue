<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-12">
                <div class="row">
                    <div class="col-3 py-2">
                        <select class="form-select" @change="getList" v-model="status">
                            <option value="3">Sócios Ativos</option>
                            <option value="2">Novos Sócios</option>
                            <option value="4">Sócios Bloqueados</option>
                        </select>
                    </div>
                    <div class="col-3 py-2">
                        <div class="mb-3">
                            <input v-model="nome" type="text" class="form-control" placeholder="nome">
                        </div>
                    </div>
                    <div class="col-2 py-2">
                        <div class="mb-3">
                            <input v-model="cpf" type="text" class="form-control" placeholder="CPF">
                        </div>
                    </div>
                    <div class="col-2 py-2">
                        <div class="mb-3">
                            <input v-model="np" type="text" class="form-control" placeholder="NP">
                        </div>
                    </div>
                    <div class="col-2 py-2">
                        <div class="mb-3" v-if="!buscou">
                            <button @click="buscar" type="button" class="btn btn-info">buscar</button>
                        </div>
                        <div class="mb-3" v-else>
                            <button @click="limpar" type="button" class="btn btn-warning">limpar</button>
                        </div>
                    </div>
                </div>
            </div>
            <component :is="component" :socios="socios" :key="key"></component>
        </div>
    </div>
</template>

<script lang="ts">

import { defineComponent } from "vue";
import LoadingView from '@/components/LoadingView.vue';
import request from "@/libs/request";
import ListSocios from "@/pages/socios/ListSocios.vue"

export default defineComponent({

    components:{ LoadingView, ListSocios },

    created(){
        this.getList();
    },

    data() {
        return {
            component:'LoadingView',
            pagina: 1,
            limite: 50,
            status: 3,
            socios: [],
            key:1,
            nome:'',
            cpf:'',
            np: '',
            buscou: false
        }
    },


    methods:{
        async getList(){
            
            this.component = "LoadingView"

            let obj = {
                pagina: this.pagina, 
                limite: this.limite, 
                status: this.status,
                nome: null,
                cpf: null,
                np: null
            } 

            if(this.nome.trim() != "")
                obj['nome'] = this.nome

            if(this.cpf.trim() != "")
                obj['cpf'] = this.cpf

            if(this.np.trim() != "")
                obj['np'] = this.np

            let response = await request
            .uri('user/socios/listar')
            .post(obj);

            this.socios = response.message()
            this.key++;
            this.component = "ListSocios"
            
        },

        buscar(){
            this.buscou = true
            this.getList()
        },

        limpar(){
            this.buscou = false
            this.nome = ""
            this.cpf = ""
            this.np = ""
            this.getList()
        }

    }

})

</script>