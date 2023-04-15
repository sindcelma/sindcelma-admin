<template>
    <div v-if="showAlert">
        <Alert :message="msg" :type="type" :key="keyAlert" style="position: fixed; z-index:999999999;"/>
    </div>
    <div style="position:absolute; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); z-index: 99999998;" v-if="showForm">
        <button @click="hideForm" type="button" class="btn-close p-2 m-2 rounded bg-danger" aria-label="Close" style="float:right; color:white"></button>
        <component 
            :is="component" 
            :comunicadoSel="comunicado"
            @addComunicado="onAddComunicado" 
            @deleteComunicado="onDeleteComunicado" 
            @changeComunicado="onChangeComunicado"
            @error="onError"
        />
    </div>
    <div class="container-fluid">
        <div class="row">
            <div class="col-12 py-2">
                <button @click="novoComunicado" type="button" class="btn btn-info">Novo Comunicado</button>
            </div>
            <hr>
            <div class="col-12">
                <div class="row">
                    <div class="col-12 col-md-4 col-lg-3" v-for="com, key in comunicados" :key="key">
                        <div class="card">
                            <div v-if="com.image">
                                <img :src="com.image" class="card-img-top" >
                            </div>
                            <div class="card-body">
                                <h5 class="card-title">{{ com.titulo }}</h5>
                                <span>Expira em: {{ helper.dateToBr(com.expire) }}</span>
                                <p>{{ com.texto }}</p>
                                <button @click="openComunicado(key)" type="button" class="btn btn-primary">editar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { defineComponent } from 'vue';
import Alert from '@/components/Alert.vue';
import request from '@/libs/request';
import helper from '@/libs/helpers'
import AddComunicado from './AddComunicado.vue';
import EditComunicado from './EditComunicado.vue';
</script>

<script lang="ts">

interface Comunicado {
    id:number,
    titulo:string,
    image:string | null,
    texto:string,
    expire:string
}

interface data {
    
    comunicados:Comunicado[],
    comunicado:Comunicado | null,

    showAlert:boolean,
    msg:string,
    type:string,
    keyAlert:number,

    showForm:boolean,
    component:string,
    showMoreBtn:boolean

}

export default defineComponent({

    created() {
        this.list()
    },

    components:{
        Alert, AddComunicado, EditComunicado
    },

    data():data {
        return {

            comunicados:[],
            comunicado:null,

            showAlert:false,
            msg:'',
            type:'',
            keyAlert:0,

            showForm:false,
            component:'',
            showMoreBtn:true

        }
    },

    methods: {

        async list(){
            let req = await request.uri('comunicados/list_active').get()
            if(req.code() == 200) this.comunicados = req.message()
        },

        novoComunicado(){
            this.component = 'AddComunicado'
            this.showForm = true
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

        hideForm(){
            this.showForm = false
        },

        openComunicado(key:number){
            this.comunicado = this.comunicados[key]
            this.component = 'EditComunicado'
            this.showForm = true
        },

        onAddComunicado(){
            this.showForm = false
            this.showMessage('Comunicado adicionado com sucesso!', 'success')
            this.comunicados = []
            this.list()
        },

        onChangeComunicado(){
            this.showMessage('Comunicado alterado com sucesso!', 'success')
        },

        onDeleteComunicado(){
            this.showForm = false
            this.showMessage('Comunicado desativado com sucesso!', 'success')
            this.comunicados = []
            this.list()
        },

    },

})
</script>