<template>

    <div class="container-fluid">
        <div class="row justify-content-center">
            <div class="col-12 border" v-if="!loading">
                <div v-if="name == ''">
                    <h5 class="text-center">{{ text }}</h5>
                </div>
                <p class="text-center text-danger">{{ errorMessage }}</p>
                <div v-if="name != ''">
                    <button @click="name = ''" type="button" class="btn-close d-block mx-auto text-danger" aria-label="Close"></button>
                    <p class="text-center">{{ name }}</p>
                </div>
                <div v-if="name == ''">
                    <input v-on:change="onLoadFile" class="custom-file-input mx-auto d-block border my-3" type="file"/>
                </div>
                <div v-if="name != ''">
                    <button @click="upload" class="btn btn-success d-block mx-auto m-2">SALVAR</button>
                </div>
            </div>
            <div class="col-12 border" v-else>
                <div class="spinner-border text-danger d-block mx-auto p-2 m-3" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="text-center">fazendo o upload do arquivo</p>
            </div>
        </div>
    </div>

</template>

<script setup lang="ts">
import request from '@/libs/request';
import Compress from 'compress.js';
import { defineComponent, defineProps } from 'vue'
defineProps({
    size: Number,
    dir: { type: String, required: true },
    text: { type: String, required: true }
})
</script>

<script lang="ts">

interface data {
    files:any[],
    loading:boolean,
    name:string,
    errorMessage:string,
    tamanho:Number,
    directory:string
}

export default defineComponent({
    data():data {
        return {
            files:[],
            loading:false,
            name:"",
            errorMessage:"",
            tamanho: this.size,
            directory: this.dir
        }
    },

    methods:{
        
        onLoadFile(event:Event){
            this.files = [...event.target.files];
            this.name = this.files[0].name
        },

        async upload(){
            
            this.loading = true

            const compress = new Compress()

            let vars = {}

            if(this.tamanho != undefined){
                vars = {
                    size: 4, 
                    maxWidth: this.tamanho
                }
            } else {
                vars = {
                    size: 4
                }
            }

            const images = await compress.compress(this.files, vars)
            const file   = Compress.convertBase64ToFile(images[0].data, images[0].ext) 
            const image  = await request.uploadFile(this.directory, file, images[0].ext.split('/')[1])

            if(image){
                this.errorMessage = ""
                this.name = ""
                this.onUploaded(image)
            } else {
                this.errorMessage = "ocorreu um erro no servidor ao tentar fazer o upload do arquivo:"
            }

            this.loading = false

        },
        onUploaded(image:string){
            this.$emit('onUploaded', image)
        }
    }
})

</script>

<style scoped>

.custom-file-input::-webkit-file-upload-button {
    visibility: hidden;
}
.custom-file-input::before {
    width: 100%;
    content: 'selecionar arquivo';
    display: inline-block;
    border: 1px solid #999;
    border-radius: 3px;
    padding: 5px 8px;
    outline: none;
    white-space: nowrap;
    -user-select: none;
    cursor: pointer;
    text-shadow: 1px 1px #fff;
    font-weight: 700;
    font-size: 10pt;
    text-align: center;
}
.custom-file-input:hover::before {
    border-color: black;
}
.custom-file-input:active::before {
    background: -webkit-linear-gradient(top, #e3e3e3, #f9f9f9);
}

</style>