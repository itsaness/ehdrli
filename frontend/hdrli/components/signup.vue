<script setup>
import { ref } from 'vue';
import { authClient } from '@/auth-client.js';
import { useRouter } from 'vue-router';
let username=ref();
let email=ref();
let password = ref(null);
let isLoading=ref();
let registerError=ref(null);
let passwordError=ref(null);
let emailError=ref(null);
let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
let router=useRouter();
let handleEmail =()=>{
    if(!email.value||!emailRegex.test(email.value)){
        emailError.value="email address incorrect.";
    }else{
        emailError.value=null;
    }
}
let handlePassword = ()=>{
    if(!password.value||password.value.length<8){
    passwordError.value="Password should be atleast 8 characters long.";
    }else{
      passwordError.value=null;  
    }}
let handleSignUp = async ()=>{
    if(isLoading.value){
        return;
    }
    isLoading.value=true;
    try{
        const {data,error} = await authClient.signUp.email({
            name:username.value,
            email:email.value,
            password:password.value
    })
    if(error){
        registerError.value=error.message;
    }else{
        registerError.value=null;
        router.push("/");
    }
    }catch(err){
        registerError.value="A network error occured. Please try again later."
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
            registerError.value=error.message;
        }else{
            router.push("/");
        }
        }catch(err){
            registerError.value="Network error occured. Please try again later."
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
        <h2>Dzoin</h2>
        <p>Create your account join us today and start transforming your text into studio-quality voiceovers.</p>
      </article>
      <article class="loginformcontainer">
        <form action="" class="loginform" @submit.prevent="handleSignUp">
        <p v-show="registerError!=null" style="color:red">{{ registerError }}</p>
            <label for="name">Full Name</label>
            <div class="inputfield">
                <span class="material-symbols-outlined">person</span>
                <input type="text" name="email"  placeholder="Jane Doe" v-model="username" required>
            </div> 
           <label for="email">Email address</label>
           <div class="inputfield">
                <span class="material-symbols-outlined">mail</span>
                <input type="text" name="email"  placeholder="hello@example.com" v-model="email" @input="handleEmail()" required>
            </div> 
            <p v-if="emailError!=null" style="color:red">{{ emailError }}</p>
            <div class="passwordlabel">
               <label for="password">Password</label> 
               <a href="/forgot-password">Forgot password ?</a>
            </div>

            <div class="inputfield">
                <span class="material-symbols-outlined">lock</span>
            <input type="password" name="password" placeholder="••••••••" v-model="password" @input="handlePassword()" required>
            </div>
             <p style="color:red" v-show="passwordError!=null">{{ passwordError }}</p>
            <button type="submit">Sign up <span class="material-symbols-outlined">arrow_forward</span></button>
            <p>OR CONTINUE WITH</p>
            <button type="button" @click="handleSocialSignUp()"><img src="../public//google.png" alt="">Google</button>
            <p>Already registered ? <routerLink to="/login">Sign in</routerLink></p>

        </form>
      
        

      </article>
      <footer class="loginfooter">
     <p>By authenticating, you agree to our <a href="">Terms</a> and <a href="">Privacy Policy.</a></p>
    </footer>
        </div>
    </main>
</template>