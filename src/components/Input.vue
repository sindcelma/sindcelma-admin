<template>
    <div class="input-group mb-3">
        <div v-if="icon">
            <span class="input-group-text" :id="`input-${label}`">{{ icon }}</span>
        </div>
        <input v-model="value" :type="type" class="form-control" :placeholder="placeholder" :aria-label="placeholder" :aria-describedby="`input-${label}`">
        <div class="w-100">
            <span class="text-danger"><small>{{ error }}</small></span>
        </div>
    </div>
</template>

<script setup lang="ts">

import { defineComponent, defineProps } from 'vue';

defineProps({
    regex: String,
    messageError:String,
    icon: String,
    type: { type:String, required: true },
    label: { type:String, required: true },
    placeholder: { type:String, required: true }
})

</script>

<script lang="ts">

export default defineComponent({
    data(){
        return {
            value:"",
            error:""
        }
    },
    methods:{
        checkValue(value:string){
            if(this.regex)
                return new RegExp(this.regex, 'gi').test(value)
            return true
        }
    },
    watch: {
        value(newVal, oldVal){
            let status = this.checkValue(newVal)
            if(!status) this.error = this.messageError ? this.messageError : `O campo ${this.label} está fora do padrão`
            else this.error = ""           
            this.$emit('onChange', newVal, oldVal, status)
        },
    }
})

</script>