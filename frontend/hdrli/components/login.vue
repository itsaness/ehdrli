<script setup>
import { authClient } from '@/auth-client';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
let email=ref();
let password=ref();
let isLoading=ref();
let loginError=ref(null);
let router=useRouter();
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
        <div class="loginpictures">
            <img src="../public/back.jpg" alt="">
            <img src="../public/front.jpg" alt="">

        </div>
        <div class="loginpresentation">
      <article class="logintitle">
        <h2>Join Dzoin</h2>
        <p>Welcome back log in to your account to continue generating lifelike audio.</p>
      </article>
      <article class="loginformcontainer">
        <form action="" class="loginform" @submit.prevent="handleLogin()">
        <p v-if="loginError!=null" style="color:red">{{ loginError }}</p>
           <label for="email">Email address</label>
           <div class="inputfield">
                <span class="material-symbols-outlined">mail</span>
                <input type="text" name="email"  placeholder="hello@example.com" v-model="email" required>
            </div> 
            <div class="passwordlabel">
               <label for="password">Password</label> 
               <a href="/forgot-password">Forgot password ?</a>
            </div>
            <div class="inputfield">
                <span class="material-symbols-outlined">lock</span>
            <input type="password" name="password" placeholder="••••••••" v-model="password" required>
            </div>
            <button type="submit">Sign in <span class="material-symbols-outlined">arrow_forward</span></button>
            <p>OR CONTINUE WITH</p>
            <button type="button" @click="handleSocialSignUp()"><img src="../public//google.png" alt="">Google</button>
            <p>Don't have an account ? <routerLink to="/sign-up">Sign up</routerLink></p>
    
       
        </form>
      
        

      </article>
       <footer class="loginfooter">
     <p>By authenticating, you agree to our <a href="">Terms</a> and <a href="">Privacy Policy.</a></p>
    </footer>
        </div>
        
    </main>
    
    
</template>