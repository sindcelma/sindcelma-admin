
<template>
    <div class="container">
        <div class="row">
            <div class="col-lg-8 py-4">
                <div class="mb-3">
                    <label for="tituloInputForm" class="form-label">Título</label>
                    <input v-model="titulo" type="text" class="form-control" id="tituloInputForm" placeholder="">

                    <div v-if="itens.length > 0" class="py-3">
                        <button @click="salvarCCT" type="button" class="btn btn-success">Salvar CCT</button>
                    </div>
                </div>

                <h4 class="mt-3">Cláusulas:</h4>

                <div class="row mt-2">
                    <div class="col-12" v-for="item in itens" :key="item">
                        <div class="row">
                            <div class="col-4">
                                <img :src="item.imagem" class="card-img-top" alt="">
                            </div>
                            <div class="col-8">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title">{{ item.item }}</h5>
                                        <p class="card-text">{{ item.resumo }}</p>
                                        <a href="#" @click="editItem(item)" class="btn btn-success">Editar</a> <a href="#" class="btn btn-danger" style="float:right;">Excluir</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-4 py-4">
                <div class="mb-3">
                    <div class="row">
                        <div class="col-12"><h3 class="text-center">Adicionar Cláusula</h3></div>
                        <div class="col-12">
                            <div v-if="imgTemp != ''">
                                <img :src="imgTemp" class="d-block mx-auto m-2" style="height: 100px;">
                            </div>
                            <UploadFile text="Imagem" dir="images/cct" @onUploaded="uploaded"/>
                            <div class="mb-3">
                                <label for="tituloInputForm" class="form-label">Título Cláusula</label>
                                <input type="text" v-model="modelFormItem.item" class="form-control" id="tituloInputForm" placeholder="">
                            </div>
                            <div class="mb-3">
                                <label for="tituloInputForm" class="form-label">Resumo</label>
                                <input type="text" v-model="modelFormItem.resumo" class="form-control" id="tituloInputForm" placeholder="">
                            </div>
                            <div class="mb-3">
                                <label for="exampleFormControlTextarea1" class="form-label">Texto</label>
                                <textarea v-model="modelFormItem.texto" class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                            </div>
                            <button @click="salvarItem" type="button" class="btn btn-success">Salvar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';
import UploadFile from '@/components/UploadFile.vue';
import request from '@/libs/request';

interface item_cct {
    imagem:string,
    item:string,
    resumo:string,
    texto:string
} 

interface modelFormItem {
    item:string,
    resumo:string,
    texto:string
}

interface data {
    titulo:string
    itens:item_cct[],
    imgTemp:string,
    modelFormItem:modelFormItem
}

export default defineComponent({

    components:{UploadFile},

    data():data {
        return {
            titulo:"",
            itens:[],
            imgTemp:"",
            modelFormItem:{
                item:"",
                resumo:"",
                texto:""
            }
        }
    },

    methods:{
        
        uploaded(img:string){
            this.imgTemp = img
        },
        
        editItem(item:item_cct){
            console.log(item);
            
        },

        salvarItem(){

            if(this.modelFormItem.item != "" 
            && this.modelFormItem.resumo != "" 
            && this.modelFormItem.texto != ""
            && this.imgTemp != ""){
                this.itens.push({
                    imagem:this.imgTemp,
                    item:this.modelFormItem.item,
                    resumo:this.modelFormItem.resumo,
                    texto:this.modelFormItem.texto
                })
                this.modelFormItem.item = ""
                this.modelFormItem.resumo = ""
                this.modelFormItem.texto = ""
                this.imgTemp = ""
            }
        },

        async salvarCCT(){
            
            
            if(this.titulo == "") return;
            
            console.log("salvando...");

            const reqCCT  = await request.uri('cct/add_cct').post({
                titulo:this.titulo
            })

            console.log(reqCCT);

            const cct_id  = reqCCT.message().cct_id;
            
            for (let i = 0; i < this.itens.length; i++) {
                console.log("salvando item...");
                const item    = this.itens[i];
                await request.uri('cct/add_item').post({
                    cct_id:cct_id,
                    item:item.item,
                    resumo:item.resumo,
                    texto:item.texto,
                    imagem:item.imagem
                })
            }

        }

    }
})

</script>