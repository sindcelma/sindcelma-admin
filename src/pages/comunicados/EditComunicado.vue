<template>
    <div class="container-fluid bg-white">
        <div class="row">
            <div class="col-12">
                <div class="row">
                    <div class="col-6">
                        <div v-if="image">
                            <img :src="image" class="w-100 d-block mx-auto"/>
                        </div>
                    </div>
                    <div class="col-6">
                        <h5>Adicionar imagem:</h5>
                        <UploadFile text="Fazer upload" dir="images/noticias" @onUploaded="uploaded"/>
                    </div>
                </div>
                <div class="mb-3">
                    <label for="expire" class="form-label">Expira em:</label> 
                    <input v-model="expire" type="date" class="form-control" id="expire" placeholder="" style="max-width:200px;">
                </div> 
                <div class="mb-3">
                    <label for="titulo" class="form-label">Título:</label> 
                    <input v-model="titulo" type="text" class="form-control" id="titulo" placeholder="" >
                </div> 
                <div class="mb-3">
                    <label for="floatingTextarea">Texto:</label>
                    <textarea style="min-height: 300px;" v-model="text" class="form-control" placeholder="" id="floatingTextarea"></textarea>
                </div>
                <div class="mb-3">
                    <button class="btn btn-success" type="button" @click="salvarEdit">salvar edição</button>
                </div>

                <br><br><br><br><br><br>
                <br><br><br><br><br><br>
                <br><br><br><br><br><br>
                <div class="mb-3">
                    <button class="btn btn-danger" type="button" @click="deleteComunicado">deletar comunicado</button>
                </div>

            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { defineComponent, defineProps } from "vue"
import helper from '@/libs/helpers'
import request from "@/libs/request";
import UploadFile from "@/components/UploadFile.vue";
defineProps({
    comunicadoSel:{
        type: Object as () => Comunicado,
        required:true
    }
})
</script>

<script lang="ts">

interface Comunicado {
    id:number,
    titulo:string,
    image:string | null,
    texto:string,
    expire:string
}

export default defineComponent({

    components:{UploadFile},

    data() {
        return {
            comunicado:this.comunicadoSel,
            id:this.comunicadoSel.id,
            image:this.comunicadoSel.image,
            expire:helper.brToDate(helper.dateToBr(this.comunicadoSel.expire)),
            titulo:this.comunicadoSel.titulo,
            text:this.comunicadoSel.texto
        }
    },

    methods: {

        async uploaded(imagem:string){
            this.image = imagem
        },

        async salvarEdit(){

            let req = await request.uri('comunicados/edit').post({
                id:this.id,
                image:this.image,
                expire:this.expire,
                titulo:this.titulo,
                texto:this.text,
            })

            if(req.code() == 200){

                this.comunicado.image  = this.image
                this.comunicado.expire = this.expire
                this.comunicado.titulo = this.titulo
                this.comunicado.texto  = this.text
                
                return this.$emit('changeComunicado')
            } 

            this.$emit('error', req.message())

        },

        async deleteComunicado(){

            let req = await request.uri('comunicados/status').post({
                id:this.id
            })

            if(req.code() == 200){
                return this.$emit('deleteComunicado')
            } else {
                this.$emit('error', req.message())
            }

        }

    },
})
</script>