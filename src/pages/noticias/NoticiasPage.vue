<template>
    <div v-if="showAlert">
        <Alert :message="msg" :type="type" :key="keyAlert" style="position: fixed; z-index:999999999;"/>
    </div>
    <div style="position:absolute; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); z-index: 99999998;" v-if="showForm">
        <button @click="hideForm" type="button" class="btn-close p-2 m-2 rounded bg-danger" aria-label="Close" style="float:right; color:white"></button>
        <component 
            :is="component" 
            :noticiaSel="noticia"
            @addNoticia="onAddNoticia" 
            @deleteNoticia="onDeleteNoticia" 
            @changeNoticia="onChangeNoticia"
            @error="onError"
        />
    </div>
    <div class="container-fluid">
        <div class="row">
            <div class="col-12 py-2">
                <button @click="novaNoticia" type="button" class="btn btn-info">Nova Noticia</button>
            </div>
            <div class="col-12">
                <div class="row">
                    <div class="col-12 col-md-4 col-lg-3" v-for="not, key in noticias" :key="key">
                        <div class="card">
                            <img :src="not.imagem" class="card-img-top" >
                            <div class="card-body">
                                <h5 class="card-title">{{ not.titulo }}</h5>
                                <p>{{ not.subtitulo }}</p>
                                <button @click="openNoticia(key)" type="button" class="btn btn-primary">editar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col py-5" v-show="showMoreBtn">
                <button @click="carregarMais" class="btn btn-success mx-auto d-block" >carregar mais noticias</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { defineComponent } from 'vue';
import AddNoticia from './AddNoticia.vue';
import EditNoticia from './EditNoticia.vue';
import Alert from '@/components/Alert.vue';
import request from '@/libs/request';
</script>

<script lang="ts">

interface Noticia {
    id:number,
    titulo:string,
    imagem:string,
    subtitulo:string
}

interface data {
    
    noticias:Noticia[],
    noticia:Noticia | null,

    showAlert:boolean,
    msg:string,
    type:string,
    keyAlert:number,

    showForm:boolean,
    component:string,
    page:number,
    showMoreBtn:boolean

}

export default defineComponent({

    created() {
        this.list()
    },

    components:{
        AddNoticia, EditNoticia, Alert
    },

    data():data {
        return {

            noticias:[],
            noticia:null,

            showAlert:true,
            msg:'',
            type:'',
            keyAlert:0,

            showForm:false,
            component:'',
            page:1,
            showMoreBtn:true

        }
    },

    methods: {

        async list(){
            
            let req = await request.uri('noticias/list/'+this.page).post({})
            
            let nots:Noticia[] = []

            console.log(req.code());
            

            if(req.code() == 200){
                nots = req.message()
                nots.forEach(not => this.noticias.push(not));
                this.showMoreBtn = nots.length > 0
            }
            
        },

        async carregarMais(){
            this.page = this.page + 1
            this.list()
        },

        novaNoticia(){
            this.component = 'AddNoticia'
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

        openNoticia(key:number){
            this.noticia = this.noticias[key]
            this.component = 'EditNoticia'
            this.showForm = true
        },

        onAddNoticia(){
            this.showForm = false
            this.showMessage('Noticia adicionada com sucesso!', 'success')
            this.noticias = []
            this.page = 1
            this.list()
        },

        onChangeNoticia(){
            this.showMessage('Noticia alterada com sucesso!', 'success')
        },

        onDeleteNoticia(){
            this.showForm = false
            this.showMessage('Noticia deletada com sucesso!', 'success')
            this.noticias = []
            this.page = 1
            this.list()
        },

    },

})
</script>