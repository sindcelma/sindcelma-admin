<template>
    <div v-if="showAlert">
        <Alert :message="msg" :type="type" :key="keyAlert" style="position: fixed; z-index:99999999;"/>
    </div>
    <div style="position:absolute; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); z-index: 99999998;" v-if="showForm">
        <button @click="hideForm" type="button" class="btn-close p-2 m-2 rounded bg-danger" aria-label="Close" style="float:right; color:white"></button>
        <component 
            :is="component" 
            :convenio="convenios[atualKey]"
            :key="atualKey"
            @deleteConvenio="onDeleteConvenio"
            @addConvenio="onAddConvenio"
            @error="onError"
            @changeConvenio="onChangeConvenio"
        />
    </div>
    <div class="container-fluid">

        <div class="row">

            <div class="col-12 py-2">
                <button type="button" @click="newConvenio" class="btn btn-info">Novo Convênio</button>
            </div>
            <hr>

            <div class="col-12" v-if="!loading">
                <div class="col-12" v-if="convenios.length > 0">
                    <div class="row">
                        <div class="col-12 col-md-4 col-lg-3" v-for="convenio, key in convenios" :key="key" >
                            <div class="card">
                                <img :src="convenio.imagem" class="card-img-top" alt="...">
                                <div class="card-body">
                                    <h5 class="card-title">{{ convenio.titulo }}</h5>
                                    <button @click="openConvenio(key)" type="button" class="btn btn-primary">editar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <h5>Nenhum convênio cadastrado</h5>
                </div>
            </div>

        </div>

    </div>

</template>

<script lang="ts" setup>

import { defineComponent } from 'vue'
import request from '@/libs/request'
import EditConvenio from './EditConvenio.vue'
import AddConvenio from './AddConvenio.vue'

import Alert from '@/components/Alert.vue'

</script>

<script lang="ts">

interface Convenio {
    id:number,
    titulo:string,
    imagem:string
}

interface data {
    loading:boolean,
    convenios:Convenio[],
    showAlert:boolean,
    showForm:boolean,
    msg:string,
    type:string,
    keyAlert:number,
    atualKey:number,
    component:string,
    convenioSel:Convenio | null
}

export default defineComponent({

    components:{
        AddConvenio, EditConvenio
    },

    async created(){
        await this.list()
    },

    data():data {
        return {
            loading:true,
            showAlert:false,
            showForm:false,
            convenios:[],
            msg:'',
            type:'',
            keyAlert:1,
            component:'ListConvenios',
            atualKey:-1,
            convenioSel:null
        }
    },

    methods: {
        
        async list(){
            this.loading = true
            let res = await request.uri('convenios/list').get()
            if(res.code() == 200 && res.message().length > 0){
                this.convenios = res.message()
            }
            this.loading = false
        },  

        showMessage(message:string, type:string){
            this.msg  = message
            this.type = type
            this.keyAlert++
            this.showAlert = true
        },

        onError(message:string){
            this.showMessage(message, 'danger')
        },

        onDeleteConvenio(){
            this.list()
            this.showMessage('Convenio deletado com sucesso!', 'success')
            this.hideForm()
        },

        onAddConvenio(convenio:Convenio){
            this.convenios.push(convenio)
            this.showMessage('Convenio criado com sucesso!', 'success')
            this.hideForm()
        },

        onChangeConvenio(){
            this.showMessage('Convenio alterado com sucesso!', 'success')
        },

        hideForm(){
            this.showForm = false
        },
        
        newConvenio(){
            this.component = 'AddConvenio'
            this.showForm  = true
        },

        openConvenio(key:number){
            this.atualKey     = key
            this.convenioSel  = this.convenios[key]
            this.component    = 'EditConvenio'
            this.showForm     = true
        },
        
    },
})

</script> 