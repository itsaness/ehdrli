<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { authClient } from '@/auth-client';
let email = ref();
let route = useRoute();
let isLoading=ref();
let resetError=ref(null);
let resetSuccess=ref(null);
let handleReset = async()=>{
    if(isLoading.value){
        return;
    }
    isLoading.value=true;
    try{
        const{data,error}=await authClient.requestPasswordReset({
            email:email.value,
            redirectTo:"https://dzoin.com/reset-password"
        })
        if(error){
            resetError.value=error.message;
            return;
        }
        resetSuccess.value="Reset password link sent to your email."
    }catch(err){
      resetError.value="A network error occured. Please try again later"
      return;
    }finally{
        isLoading.value=false;
    }
}

</script>
<template>
    <header>
    </header>
    <main class="resetpasswordmain">
        <div class="resetpasswordimg">
            <img src="../public/studio.svg" alt="">
        </div>
        <div>
       <form class="resetpasswordinput" @submit.prevent="handleReset()">
        <p  style="color:green" v-if="resetSuccess!=null">{{ resetSuccess }}</p>
        <p v-if="resetError!=null" style="color:red">{{ resetError }}</p>
        <article class="resetpasswordhero">
        <h2>Forgot your password ?</h2>
        <p>Enter your email address and we'll send you a link to reset your password.</p>
       </article>
        <label for="email"></label>
        <input type="text" placeholder="    hello@example.com" v-model="email" required>
        <button type="submit" :disabled="resetSuccess!=null">Send Reset Link<span class="material-symbols-outlined">arrow_forward</span></button>
        <RouterLink to="/login"><span class="material-symbols-outlined">arrow_left_alt</span> Back to Sign in</RouterLink>
    </form>
        </div>
        
       
    </main>
 
 
   
</template>