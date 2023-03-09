<template>
    <div class="container bg-white p-4 rounded mt-2">
        <div class="row">
            <div class="col">
                <h2>Novo Admin</h2>
            </div>
            <div class="col-12">
                <div class="mb-3">
                    <label for="nome" class="form-label">Nome:</label> 
                    <input v-model="nome" type="text" class="form-control" id="nome" placeholder="John Snow">
                </div> 
                <div class="mb-3">
                    <label for="email" class="form-label">E-mail</label> 
                    <input v-model="email" type="email" class="form-control" id="email" placeholder="john@got.com">
                </div> 
                <div class="mb-3">
                    <label for="senha" class="form-label">Senha:</label> 
                    <input v-model="senha" type="text" class="form-control" id="senha" placeholder="winter#is#coming">
                </div> 
                <hr>
                <h5>Permissões:</h5>
                <div v-for="perm,k in permissions" :key="k">
                    <div class="form-check form-switch">
                        <input v-model="perm.model" class="form-check-input" type="checkbox" role="switch" :id="perm.slug">
                        <label class="form-check-label" for="">{{ perm.nome }}</label>
                    </div>
                </div>
                <hr>
                <div class="mb-3">
                    <button class="btn btn-success" @click="salvar">SALVAR</button>
                </div> 
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { defineComponent } from 'vue'
import request from '@/libs/request'
</script>

<script lang="ts">

interface AdminI {
    id:number,
    nome:string,
    email:string,
    senha?:string,
    permissions:PermissionI[],
    permissoes:number[]
}

interface PermissionI {
    id:number,
    slug:string,
    nome:string,
    model?:boolean | null
}

interface data {
    permissions: PermissionI[],
    nome:string,
    email:string,
    senha:string
}

export default defineComponent({
    
    props:{
        permissionsList: {
            type:[], 
            required:true
        }   
    },

    created() {
        for (let i = 0; i < this.permissions.length; i++) {
            this.permissions[i].model = false
        }
    },

    data():data {
        return {
            permissions:this.permissionsList,
            nome:'',
            email:'',
            senha:''
        }
    },

    methods:{
        async salvar(){

            if(this.nome.trim() == "" || this.email.trim() == "" || this.senha.trim() == ""){
                this.$emit('error', 'Existem campos vazios')
                return
            }

            let adm:AdminI = {
                    id:0,
                    email:this.email,
                    senha:this.senha,
                    nome: this.nome,
                    permissions:[],
                    permissoes: this.permissions
                        .filter(p => p.model)
                        .map(f => f.id)
                }
            
            let req = 
                await request
                .uri('user/admin/add')
                .post(adm)
            
            if(req.code() == 200){
                
                adm.id = req.message().id
                
                for (let i = 0; i < this.permissions.length; i++) {
                    if(this.permissions[i].model){
                        adm.permissions.push(this.permissions[i])
                    }
                }

                this.$emit('addAdmin', adm)
            }
            
        }
    }
})

</script>