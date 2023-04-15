<script setup lang="ts">
import { defineComponent } from 'vue'
</script>

<script lang="ts">

import User        from '@/model/User'
import request     from '@/libs/request'
import LoginView   from '@/components/LoginView.vue'
import MainPage    from '@/pages/MainPage.vue';
import LoadingView from '@/components/LoadingView.vue'
import router      from '@/router/index';

export default defineComponent({

    components:{LoginView, LoadingView, MainPage},

    data(){
        return {
            component: 'LoadingView'
        }
    },

    created(){
        request.setCallbackCloseFunc(this.close_app)
        this.checkSession()
    },

    methods: {

        async checkSession(){
            
            this.component = 'LoadingView'
            
            if(router.currentRoute.value.fullPath == '/'){
                router.push('/home')
            }
            
            let cookie = request.getCookie(request.NAME_REMEMBER_TK)
            
            if(!cookie){
                this.component = 'LoginView'
                return
            }
            
            const response = await request.uri('user/rememberme').post({
                rememberme:cookie,
                type:'Admin'
            }) 
            
            if(response.code() == 200){
               
                const message = response.message()
                request.setSession(message.session)
                
                User.email  = message.user.email
                User.nome   = message.user.nome
                User.access = message.user.access
                User.master = message.user.master

                this.component = 'MainPage'
                
                return
            } 

            this.component = 'LoginView'

        },

        close_app(){
            request.setSession('')
            request.removeCookie(request.NAME_REMEMBER_TK)
            this.checkSession()
        }

    }
})
</script>

<template>
    <component :is="component" @onCheckSession="checkSession"></component>    
</template>

