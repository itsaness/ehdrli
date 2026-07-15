<script setup>
import { watch,onMounted } from 'vue';
import { RouterView } from 'vue-router';
import { useI18n } from 'vue-i18n';
const {locale}=useI18n();
onMounted(()=>{
    let savedLanguageSetting = localStorage.getItem(("savedLanguage"));
    if(savedLanguageSetting){
        locale.value=savedLanguageSetting;
    }
})
watch(locale,(newVal)=>{
    localStorage.setItem("savedLanguage",newVal);
})


</script>

<template>
 <RouterView/>
</template>


