<script setup>
import { authClient } from '@/auth-client';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
let email=ref();
let password=ref();
let isLoading=ref();
let loginError=ref(null);
let router=useRouter();
const {t}=useI18n();
let handleLogin = async()=>{
    if(isLoading.value){
        return;
    }
    isLoading.value=true;
    try{
        const{data,error}=await authClient.signIn.email({
            email:email.value,
            password:password.value
        })
        if(error){
         loginError.value=error.message;
        }else{
         router.push("/");
        }
    }catch(err){
        loginError.value="Network error. Please try again later."
    }finally{
        isLoading.value=false;
    }

}
let handleSocialSignUp=async()=>{
    if(isLoading.value){
        return;
    }
    isLoading.value=true;
    try{
        const {data,error}=await authClient.signIn.social({
            provider:"google",
            callbackURL:window.location.origin + "/"
        });
        if(error){
            loginError.value=error.message;
        }else{
            router.push("/");
        }
        }catch(err){
            loginError.value="Network error occured. Please try again later."
        }finally{
            isLoading.value=false;
        }
    }

</script>
<template>
    <header>

    </header>
    <main class="loginbody">
        <div class="loginpresentation">
      <article class="logintitle">
        <h2>Join eHdrli</h2>
        <p>{{ $t("logintitle") }}</p>
      </article>
      <article class="loginformcontainer">
        <form action="" class="loginform" @submit.prevent="handleLogin()">
        <p v-if="loginError!=null" style="color:red">{{ loginError }}</p>
           <label for="email">{{ $t("email") }}</label>
           <div class="inputfield">
                <span class="material-symbols-outlined">mail</span>
                <input type="text" name="email"  placeholder="hello@example.com" v-model="email" required>
            </div> 
            <div class="passwordlabel">
               <label for="password">{{ $t("password") }}</label> 
               <a href="/forgot-password">{{ $t("forgotpassword") }}</a>
            </div>
            <div class="inputfield">
                <span class="material-symbols-outlined">lock</span>
            <input type="password" name="password" placeholder="••••••••" v-model="password" required>
            </div>
            <button type="submit">{{ $t("signinbtn") }} <span class="material-symbols-outlined">arrow_forward</span></button>
            <p>{{ $t("continuewith") }}</p>
            <button type="button" @click="handleSocialSignUp()"><img src="../public//google.png" alt="">Google</button>
            <p>{{ $t("noaccount") }} <routerLink to="/sign-up">{{ $t("signup") }}</routerLink></p>
    
       
        </form>
      
        

      </article>
       <footer class="loginfooter">
     <p>{{ $t("agree") }} <a href="/terms"> {{ $t("terms") }}</a> {{ $t("and") }}<a href="/privacy">{{ $t("privacy") }}</a></p>
    </footer>
        </div>
        
    </main>
    
    
</template>