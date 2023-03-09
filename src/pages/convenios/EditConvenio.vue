<template>
    <div class="container-fluid p-2 bg-white">
        <div class="row">
            <div class="col-12">
                <div class="row">
                    <div class="col-6">
                        <img :src="imagem" class="w-100 d-block mx-auto"/>
                    </div>
                    <div class="col-6">
                        <h5>Editar imagem:</h5>
                        <UploadFile text="Fazer upload" dir="images/convenios" @onUploaded="uploaded"/>
                    </div>
                </div>
                <div class="mb-3">
                    <label for="titulo" class="form-label">Título:</label> 
                    <input v-model="titulo" type="text" class="form-control" id="titulo" placeholder="" >
                </div> 
                <div class="mb-3">
                    <label for="floatingTextarea">Descrição:</label>
                    <textarea style="min-height: 200px;" v-model="descr" class="form-control" placeholder="" id="floatingTextarea"></textarea>
                </div>
                <div class="mb-3">
                    <button class="btn btn-success" type="button" @click="salvarEdicao">salvar alterações</button>
                </div>
                <br><br><br><br>
                <br><br><br><br>
                <br><br><br><br>
                <br><br><br><br>
                <div class="mb-3">
                    <button class="btn btn-danger" type="button" @click="deletar">deletar</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import UploadFile from '@/components/UploadFile.vue';
import request from '@/libs/request';
import { defineComponent, defineProps } from 'vue';

interface Convenio {
    id:number,
    titulo:string,
    imagem:string
} 

defineProps({
    convenio:{
        type: Object as () => Convenio,
        required: true
    }
})

</script>

<script lang="ts">
export default defineComponent({

    created() {
        this.getDescr()
    },

    data() {
        return {
            id:this.convenio.id,
            titulo:this.convenio.titulo,
            imagem:this.convenio.imagem,
            descr:''
        }
    },

    methods: {

        async getDescr(){

            let res = await request.uri('convenios/selected').post({
                id: this.id
            })
            
            this.descr = res.message()[0].descricao

        },

        async salvarEdicao(){

            let res = await request.uri('convenios/edit').post({
                id:        this.id,
                titulo:    this.titulo,
                imagem:    this.imagem,
                descricao: this.descr
            })

            if(res.code() == 200){
                this.convenio.titulo = this.titulo
                this.convenio.imagem = this.imagem
                this.$emit('changeConvenio')
            }

        },

        async uploaded(imagem:string){
            this.imagem = imagem
        },

        async deletar(){
            let res = await request.uri('convenios/delete').post({
                id:        this.id
            })

            if(res.code() == 200){
                this.$emit('deleteConvenio')
            } else {
                this.$emit('error', 'Erro ao tentar deletar')
            }
        }

    },

})
</script>