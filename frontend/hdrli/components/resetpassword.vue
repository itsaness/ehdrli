<script setup>
import { ref } from 'vue';
import { authClient } from '@/auth-client';
import { useRoute,useRouter } from 'vue-router';
let newPassword=ref();
let repeatedPassword=ref();
let passwordError=ref(null);
let route=useRoute();
let router=useRouter();
let isLoading=ref();
let passwordSuccess=ref(null);
const token = route.query.token;
let checkPassword=()=>{
    if(newPassword.value<8 || !newPassword.value){
        passwordError.value="Password must be atleast 8 characters long.";
        return;
    }
    else if(newPassword.value != repeatedPassword.value){
        passwordError.value="Passwords doesn't match.";
        return;
    }else{
        passwordError.value=null;
    }
}

let handlePasswordReset=async()=>{
    if(isLoading.value){
        return;
    }
    isLoading.value=true;
    try{
        if(newPassword.value==repeatedPassword.value){
            const {data,error}=await authClient.resetPassword({
                newPassword:repeatedPassword.value,
                token:token
            })
            if(error){
            passwordError.value=error.message;
            }

        }
        passwordSuccess.value="Password has been changed successfully.";
        router.push("/login");
    }catch(err){
        passwordError.value="A network error occured. Please try again later."
    }finally{
        isLoading.value=false;
    }
}


</script>
<template>
    <main class="changepasswordmain">
        <h2>Dzoin</h2>
        <hr>
        <article class="changepasswordhero">
             <h2>Create New Password</h2> 
             <p style="color:red" v-if="passwordError!=null">{{ passwordError }}</p>
                <form action="" class="changepasswordform" @submit.prevent="handlePasswordReset()">
                <label for="password">New Password</label>
                <div class="changepasswordinput">
                  <span class="material-symbols-outlined">lock</span>
                  <input type="password" placeholder="••••••••" name="password" v-model="newPassword" required>  
                </div>
                <label for="newpassword">Confirm New Password</label>
                
                <div class="changepasswordinput">
               <span class="material-symbols-outlined">lock</span>
               <input type="password" placeholder="••••••••" name="newpassword" v-model="repeatedPassword" required>
                </div>
                <button type="submit">Set New Password</button>
                <RouterLink to="/login"><span class="material-symbols-outlined">arrow_left_alt</span> Back to Sign in</RouterLink>
                </form>
        </article>
   
    
    </main>
</template>