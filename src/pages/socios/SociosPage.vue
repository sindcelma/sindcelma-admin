<template>
    <div style="position:absolute; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); z-index: 99999998;" v-if="showDownloadArea">
        <button @click="showDownloadArea = false" type="button" class="btn-close p-2 m-2 rounded bg-danger" aria-label="Close" style="float:right; color:white"></button>
        <div class="container p-4">
            <div class="row">
                <div class="col-12 bg-white">
                    <div class="row">
                        <div class="col-12 p-4 text-center" v-if="generating">
                            <div class="spinner-border" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                            <h5>gerando arquivo</h5>
                        </div>
                        <div class="col-12 p-4 text-center" v-else>
                            <div v-if="errorFile != ''">
                                <p class="text-danger">{{ errorFile }}</p>
                            </div>
                            <div v-else>
                                <btn @click="download" type="button" class="p-3 btn btn-success" target="_blank" >↓ download</btn>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
    <div class="container-fluid">
        <div class="row">
            <div class="col-12">
                <div class="row">
                    <div class="col-3 py-2">
                        <select class="form-select" @change="reload" v-model="status">
                            <option value="3">Sócios Ativos</option>
                            <option value="2">Novos Sócios</option>
                            <option value="4">Sócios Bloqueados</option>
                            <option value="1">Sócios sem imagens</option>
                        </select>
                        <div class="py-2">
                            <button @click="gerar_relatorio" type="button" class="btn btn-success">.csv</button>
                        </div>
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
            <div class="col-12" v-if="!loading && showbtn">
                <button @click="loadMore" class="btn btn-danger" type="button">carregar mais...</button>
            </div>
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
            showbtn:true,
            loading:true,
            component:'LoadingView',
            pagina: 1,
            limite: 10,
            status: 3,
            socios: [],
            key:1,
            nome:'',
            cpf:'',
            np: '',
            buscou: false,
            linkFile:'',
            generating:false,
            showDownloadArea:false,
            errorFile:''
        }
    },


    methods:{

        async download(){
            await request.uri(this.linkFile, true, true).post({})
            console.log(this.linkFile);
            
        },

        async gerar_relatorio(){

            this.showDownloadArea = true
            this.generating = true

            let statusAll = ['', 'Sem Imagem', 'Em Aprovação', 'Aprovado', 'Bloqueado']

            for (let i = 0; i < this.socios.length; i++) {
                const socio:{
                    status?:string
                } = this.socios[i];
                socio['status'] = statusAll[this.status]
            }

            let req = await request.uri('files/admin/generate_csv').post({
                data:this.socios,
                name:'ListSocios' 
            })

            this.linkFile  = ''
            this.errorFile = ''

            if(req.code() == 200){
                this.linkFile  = req.message().file
            } else {
                this.errorFile = req.message()
            }

            this.generating = false
        },

        async reload(){
            this.pagina = 1
            this.socios = []
            this.getList()
        },  

        async getList(){
            
            this.loading = true

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

            const list:[] = response.message()
            this.showbtn = list.length > 0
            for (let i = 0; i < list.length; i++)
                this.socios.push(list[i])
            
            this.key++;
            this.component = "ListSocios"

            this.loading = false
            
        },

        loadMore(){
            this.pagina++
            this.getList()
        },

        buscar(){
            this.socios = []
            this.pagina = 1
            this.buscou = true
            this.getList()
        },

        limpar(){
            this.socios = []
            this.pagina = 1
            this.buscou = false
            this.nome = ""
            this.cpf = ""
            this.np = ""
            this.getList()
        }

    }

})

</script>