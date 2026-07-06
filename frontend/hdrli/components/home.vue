<script setup>
import { ref,watch,computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useRoute,useRouter } from 'vue-router';
import { authClient } from '@/auth-client';
let route = useRoute();
let router = useRouter();
const session = authClient.useSession();
let name = computed(()=>session.value?.data?.user?.name);
let email = computed(()=>session.value?.data?.user?.email);
let isMenu=ref(false);
let verificationEmailError=ref(null);
let isEmailVerified=computed(()=>session.value?.data?.user?.emailVerified);
let handleSignout=async()=>
{
    try{
        const {error} = await authClient.signOut();
        if(error){
            return;
        }
        window.location.reload();
    }catch(err){
        console.error(err.message);
    }
}
let handleEmailVerification =async ()=>{
    try{
        let {data,error}=authClient.sendVerificationEmail({
            email:email.value,
            callbackURL:"/"
        });
        if(error){
            return;
        }
    }catch(err){
        verificationEmailError.value=err.message;
    }

}
console.log(isEmailVerified.value);


</script>
<template>
    <div class="navigationmenu" v-show="isMenu">
        <div class="navigationmenutitle">
            <h2> Dzoin</h2>
             <span class="material-symbols-outlined" @click="isMenu=false">close_small</span>
        </div>
        <div class="navigationmenulinks">
            <ul>
        <routerLink to="/" :class="{isLink:route.path=='/'}"><li>Home</li></routerLink>
        <routerLink to="/pricing" :class="{isLink:route.path=='/pricing'}"><li>Pricing</li></routerLink>
        <routerLink to="/text-to-speech" :class="{isLink:route.path=='/text-to-speech'}"><li>Text to speech</li></routerLink>
            </ul>

        </div>
        <div class="navmenubtn">
<button v-show="!session.data" @click="$router.push('/login')">Sign in</button>
        <button v-show="session.data" @click="handleSignout()">Sign out</button>
        </div>
        


    </div>
<div class="maincontainer">
<header>
    <nav class="nav">
    <div class="navlogo">
    <routerLink to="/"><h2>  Dzoin</h2></routerLink> 
    </div>
    
    <ul>
        <routerLink to="/" :class="{isLink:route.path=='/'}"><li>Home</li></routerLink>
        <routerLink to="/pricing" :class="{isLink:route.path=='/pricing'}"><li>Pricing</li></routerLink>
        <routerLink to="/text-to-speech" :class="{isLink:route.path=='/text-to-speech'}"><li>Text to speech</li></routerLink>
    </ul>
    <div class="navbtn" v-show="!session.data">
    <button @click="$router.push('/login')">Login</button>
    <button @click="$router.push('/sign-up')">Sign up</button>
    </div>
    <div class="navperson" v-show="session.data">
        <p>{{ name }}</p>
        <button @click="handleSignout()">Sign out</button>
    </div>
    <span class="material-symbols-outlined" @click="isMenu=true">menu</span>
    </nav>
    <hr>
</header>
<main>
    <article v-show="session.data&&!isEmailVerified" class="emailverificationnotice">
     <p>Please verify your email address to unlock all features.  <a href="/" @click="handleEmailVerification()">Resend Verification Link</a></p>
    </article>
    <article class="presentation">
        <div>
          <h2>Next-Generation AI Voice Generation</h2>
        <p>
            Turn any text into natural, professional-grade audio instantly. 
            Choose from dozens of hyper-realistic voices across multiple languages, 
            type your script, and download your audio in seconds.
        </p>
        <div class="presentationbtn" v-show="!session">
        <button @click="$router.push('/login')">Sign Up</button>
        <button @click="$router.push('/pricing')">Pricing</button>
        </div>   
        <div class="presentationbtn" v-show="session">
        <button @click="$router.push('/text-to-speech')">Text to speech</button>
        <button @click="$router.push('/pricing')">Pricing</button>
        </div>
        </div>
         <article class="audiovisual">
        <av-line  :line-width="2" line-color="lime" src="/ehdrli.mp3" download></av-line>
     </article>
    </article>
     <article class="howitworks">
        <h2>How It Works in 2 Simple Steps</h2>
        <div class="howtocontainer">
            <article class="howtocontent">
          <span class="material-symbols-outlined">script</span>
        <h2>Input Text & Select a Voice</h2>
        <p>Type or paste your script into our editor. Choose from our diverse library of hyper-realistic, multilingual AI voices and adjust the tone to perfectly match your project.</p>
        <article class="howtocontentprompt">
            <p>"مع هدرلي رجّع أي كتيبة لأوديو احترافي في رمشة عين. خيّر الصوت لي يعجبك، أكتب واش راك حاب، وخلّي الذكاء الاصطناعي يدير خدمتوا"</p>
        </article>
        </article>
        <article class="howtocontent">
          <span class="material-symbols-outlined">wand_stars</span>
        <h2>Generate & Download</h2>
        <p>Click generate and let our advanced AI engine process your text in seconds. Preview the audio stream instantly, then download your studio-quality MP3 file ready for use.</p>
        <av-line  :line-width="2" line-color="lime" src="/ehdrli.mp3"></av-line>
        </article>
        </div>
        
    </article>
    <article class="quote">
    <span class="material-symbols-outlined">format_quote</span>
    <h2>"We started this project with one simple goal: to remove the friction between a great script and professional audio. Your words deserve to be heard, and you shouldn't need a recording studio to make that happen."</h2>
    <p>hdrli ceo</p>
    </article>
</main>
 <footer class="footer">
        <h2>eHdrli</h2>
        <div class="footerlinks">
            <RouterLink to="/privacy"><p :class="{isLink:route.path=='/privacy'}">Privacy</p></RouterLink>
            <RouterLink to="/terms"><p :class="{isLink:route.path=='/terms'}">Terms</p></RouterLink>
            <RouterLink to="/pricing"><p :class="{isLink:route.path=='/pricing'}">Pricing</p></RouterLink>
            <RouterLink to="/text-to-speech"><p :class="{isLink:route.path=='/text-to-speech'}">Text to speech</p></RouterLink>
        </div>
        <div class="footersocials">
            <a href=""><img src="/instagram.svg" alt=""></a>
            <a href=""><img src="/facebook.svg" alt=""></a>
            <a href=""><img src="/x.svg" alt=""></a>
            <a href=""><img src="/whatsapp.svg" alt=""></a>

        </div>
        <p>© 2026 hdrli. All rights reserved.</p>
    </footer>
</div>
</template>