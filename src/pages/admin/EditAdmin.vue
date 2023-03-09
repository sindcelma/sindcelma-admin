<template>
    <div class="container bg-white p-4 rounded mt-2">
        <div class="row">
            <div class="col">
                <h2>Admin</h2>
            </div>
            <div class="col-12">
                <div class="mb-3">
                    <label for="nome" class="form-label">Nome:</label> 
                    <input v-model="admin.nome" type="text" class="form-control" id="nome" placeholder="John Snow" readonly>
                </div> 
                <div class="mb-3">
                    <label for="email" class="form-label">E-mail</label> 
                    <input v-model="admin.email" type="email" class="form-control" id="email" placeholder="john@got.com" readonly>
                </div> 
                <hr>
                <h5>Permissões:</h5>
                <div v-for="perm,k in perms" :key="k">
                    <div class="form-check form-switch">
                        <input v-model="perm.model" class="form-check-input" type="checkbox" role="switch" :id="perm.slug">
                        <label class="form-check-label" for="">{{ perm.nome }}</label>
                    </div>
                </div>
                <hr>
                <div class="mb-3">
                    <button class="btn btn-success" @click="salvar">SALVAR</button>
                </div> 
                <div class="mt-5 pt-5">
                    <button class="btn btn-sm btn-danger" @click="deletar">excluir</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>

import request from '@/libs/request';
import { defineComponent } from 'vue'

</script>

<script lang="ts">

interface PermissionI {
    id:number,
    slug:string,
    nome:string,
    model?:boolean | null
}

interface AdminI {
    id:number,
    nome:string,
    email:string,
    permissions:PermissionI[],
}


interface data {
    permissions: PermissionI[],
    admin:AdminI,
    perms:PermissionI[]
}

export default defineComponent({
    
    props:{

        adminSel: {
            type: Object as () => AdminI,
            required:true
        },

        permissionsList: {
            type:[], 
            required:true
        },
        
    },

    created() {
  
        const ids = this.admin.permissions.map(permission => permission.id)
     
        for (let i = 0; i < this.permissions.length; i++) {
            let perm = this.permissions[i]
            perm.model = ids.includes(perm.id)
            this.perms.push(perm)
        }
    
    },

    data():data {
        return {
            perms:[],
            permissions:this.permissionsList,
            admin:this.adminSel
        }
    },

    methods: {
        async salvar(){
            let onlyTrue = this.perms.filter(p => p.model)

            let req = await request.uri('user/admin/change')
            .post({
                permissoes: onlyTrue.map(f => f.id),
                id: this.admin.id
            })

            if(req.code() == 200){
                this.admin.permissions = onlyTrue
                this.$emit('changePermissions')
            }
        },
        async deletar(){
            let req = await request.uri('user/admin/delete')
            .post({
                id: this.admin.id
            })

            if(req.code() == 200){
                this.$emit('deleteAdmin')
            }
        }
    },

})
</script>