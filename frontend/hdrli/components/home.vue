<script setup>
import { ref,watch,computed,onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { useRoute,useRouter } from 'vue-router';
import { authClient } from '@/auth-client';
import { useI18n} from 'vue-i18n';
let route = useRoute();
let router = useRouter();
const session = authClient.useSession();
let name = computed(()=>session.value?.data?.user?.name);
let email = computed(()=>session.value?.data?.user?.email);
let isMenu=ref(false);
let verificationEmailError=ref(null);
let isEmailVerified=computed(()=>session.value?.data?.user?.emailVerified);
let verificationEmailSuccess=ref(null);
const {t,locale}=useI18n({useScope:"global"});
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
    verificationEmailError.value=null;
    verificationEmailSuccess.value=null;
    try{
        let {data,error}=await authClient.sendVerificationEmail({
            email:email.value,
            callbackURL:window.location.origin+"/"
        });
        if(error){
            verifyEmailError.value=error.message;
            return;
        }
        verificationEmailSuccess.value=`Verification email sent to ${email.value}`
    }catch(err){
        verificationEmailError.value="A network error occurred. Please try again later.";
    }

}
let switchLanguage=()=>{
    if(locale.value=="en"){
        locale.value="ar";
    }else if(locale.value=="ar"){
        locale.value="en";
    }
}





</script>
<template>
    <div class="navigationmenu" v-show="isMenu">
        <div class="navigationmenutitle">
            <h2>eHdrli</h2>
             <span class="material-symbols-outlined" @click="isMenu=false">close_small</span>
        </div>
        <div class="navigationmenulinks">
            <ul>
        <routerLink to="/" :class="{isLink:route.path=='/'}"><li>{{ $t("home") }}</li></routerLink>
        <routerLink to="/pricing" :class="{isLink:route.path=='/pricing'}"><li>{{ $t("pricing") }}</li></routerLink>
        <routerLink to="/text-to-speech" :class="{isLink:route.path=='/text-to-speech'}"><li>{{ $t("texttospeech") }}</li></routerLink>
        <routerLink to="/account" :class="{isLink:route.path=='/account'}"><li>{{ $t("account") }}</li></routerLink>

            </ul>
        
       
        </div>
        <div class="navmenubtn">
<button v-show="!session.data" @click="$router.push('/login')">{{$t("login")}}</button>
        <button v-show="session.data" @click="handleSignout()">{{ $t("signout") }}</button>
        </div>
        


    </div>
<div class="maincontainer">
<header>
    <nav class="nav">
    <div class="navlogo">
    <routerLink to="/"><h2>eHdrli</h2></routerLink> 
    </div>
    
    <ul>
        <routerLink to="/" :class="{isLink:route.path=='/'}"><li>{{ $t("home") }}</li></routerLink>
        <routerLink to="/pricing" :class="{isLink:route.path=='/pricing'}"><li>{{ $t("pricing") }}</li></routerLink>
        <routerLink to="/text-to-speech" :class="{isLink:route.path=='/text-to-speech'}"><li>{{ $t("texttospeech") }}</li></routerLink>

    </ul>
    

    



    <div class="navbtn" v-show="!session.data">
    <span @click="switchLanguage()"><img src="/language.png" alt="" ></span>
    <button @click="$router.push('/login')">{{ $t("login") }}</button>
    <button @click="$router.push('/sign-up')">{{ $t("signup") }}</button>
    </div>
    <div class="navperson" v-show="session.data">
        <span @click="switchLanguage()"><img src="/language.png" alt="" ></span>
        <p @click="$router.push('/account')">{{ name }}</p>
        <button @click="handleSignout()">{{ $t("signout") }}</button>
    </div>
    <div class="language">
        <span @click="switchLanguage()"><img src="/language.png" alt="" ></span>
       <span class="material-symbols-outlined" @click="isMenu=true">menu</span> 
    </div>
    
    </nav>
    
</header>
<main>
    <article v-show="session.data&&!isEmailVerified" class="emailverificationnotice">
    <p  style="color: greenyellow;" v-if="verificationEmailSuccess!=null">{{ verificationEmailSuccess }}</p>
    <p style="color:red;" v-else-if="verificationEmailError!=null">{{ verificationEmailError }} </p>
    <p v-else>{{ $t("emailverificationnotice") }} <a href="#" @click.prevent="handleEmailVerification()">{{ $t("emailverificationlink") }}</a></p>

    </article>
    <article class="presentation">
        <div>
          <h2>{{$t("landingpagetitle")}}</h2>
        <p>
           {{$t("langingpagep")}}
        </p>
        <div class="presentationbtn" v-show="!session">
        <button @click="$router.push('/login')">{{ $t("signup") }}</button>
        <button @click="$router.push('/pricing')">{{ $t("pricing") }}</button>
        </div>   
        <div class="presentationbtn" v-show="session">
        <button @click="$router.push('/text-to-speech')">{{ $t("texttospeech") }}</button>
        <button @click="$router.push('/pricing')">{{ $t("pricing") }}</button>
        </div>
        </div>
         <article class="audiovisual">
        <av-line  :line-width="2" line-color="lime" src="/ehdrli.mp3" download></av-line>
     </article>
    </article>
     <article class="howitworks">
        <h2>{{ $t("langinepagepresentationtitle") }}</h2>
        <div class="howtocontainer">
            <article class="howtocontent">
          <span class="material-symbols-outlined">script</span>
        <h2>{{ $t("langinepagefirstcardtitle") }}</h2>
        <p>{{ $t("langinepagefirstcardp") }}</p>
        <article class="howtocontentprompt">
            <p>"مع هدرلي رجّع أي كتيبة لأوديو احترافي في رمشة عين. خيّر الصوت لي يعجبك، أكتب واش راك حاب، وخلّي الذكاء الاصطناعي يدير خدمتوا"</p>
        </article>
        </article>
        <article class="howtocontent">
          <span class="material-symbols-outlined">wand_stars</span>
        <h2>{{$t('landingpagesecondcardtitle')}}</h2>
        <p>{{$t('landingpagesecondcardp')}}</p>
        <div class="howtocontentaudio">
          <av-line  :line-width="2" line-color="lime" src="/ehdrli.mp3"></av-line>      
        </div>
            
        </article>
        </div>
        
    </article>
    <article class="quote">
    <span class="material-symbols-outlined">format_quote</span>
    <h2>"{{$t('landingpagequote')}}"</h2>
    <p>{{ $t("landingepagequoter") }}</p>
    </article>
</main>
 <footer class="footer">
        <h2>eHdrli</h2>
        <div class="footerlinks">
            <RouterLink to="/privacy"><p :class="{isLink:route.path=='/privacy'}">{{ $t("privacy") }}</p></RouterLink>
            <RouterLink to="/terms"><p :class="{isLink:route.path=='/terms'}">{{ $t("terms") }}</p></RouterLink>
            <RouterLink to="/pricing"><p :class="{isLink:route.path=='/pricing'}">{{ $t("pricing") }}</p></RouterLink>
            <RouterLink to="/text-to-speech"><p :class="{isLink:route.path=='/text-to-speech'}">{{ $t("texttospeech") }}</p></RouterLink>
        </div>
        <div class="footersocials">
            <a href="https://www.instagram.com/ehdlriofficial/"><img src="/instagram.png" alt=""></a>
            <a href="https://www.facebook.com/profile.php?id=61592043687803"><img src="/facebook.png" alt=""></a>
            <a href="https://x.com/ehdrli"><img src="/twitter.png" alt=""></a>
            <a href="https://wa.me/message/W4NC7XUGTV5NF1"><img src="/whatsapp.png" alt=""></a>

        </div>
        <p>© {{ $t("rights") }}</p>
    </footer>
</div>
</template>