<script setup>
import { ref,computed,watch,inject } from 'vue';
import { useRoute } from 'vue-router';
import { authClient } from '@/auth-client';
import { useMediaQuery } from '@vueuse/core';
import { useLoading } from 'vue-loading-overlay';
import  VueToggles  from "vue-toggles";
import { useI18n } from 'vue-i18n';
let characters = ref({});
let route = useRoute();
let script = ref("");
const session = authClient.useSession();
let name = computed(()=>session?.value.data?.user?.name);
let audioResult = ref();
let voices=ref([]);
let currentAudio=null;
let selectedVoiceId=ref("");
let selectedVoiceIndex=ref(1);
let isExitVoices=ref(true);
let isMenu=ref(false);
let isLoading = ref(false);
let isLatinDarija = ref(false);
const $loading = inject("$loading");
const fullPage = ref(true);
const isLargeScreen = useMediaQuery('(min-width:769px)');
let email = computed(()=>session.value?.data?.user?.email);
let isEmailVerified=computed(()=>session.value?.data?.user?.emailVerified);
let verificationEmailError=ref(null);
let verificationEmailSuccess=ref(null);
const {t,locale}=useI18n({useScope:"global"});
let getCharacters = async ()=>{
    let options = {
        method:"GET",
        credentials:"include",
        headers:{
            "Content-Type":"application/json"
        },
    }
    try{
    let response = await fetch("https://api.ehdrli.com/api/characters",options);
    if(!response.ok){
        return;
    }
    let data = await response.json();
    characters.value = data.usage;
    }catch(err){
        console.error(err.message);
    }
}
let getVoices= async ()=>{
    try{
    let response = await fetch("https://api.ehdrli.com/api/voices");
    if(!response.ok){
        return;
    }
    let data = await response.json();
    voices.value=data;
    let voiceStillExists = voices.value.some((v)=>v.voiceId===selectedVoiceId.value);
    if(!voiceStillExists){
      selectedVoiceId.value=voices.value[0].voiceId;  
    }
    
    
    
    }catch(err){
        console.error(err.message);
    }
}
let selectVoice=(voiceId,index)=>{
    selectedVoiceId.value=voiceId;
    selectedVoiceIndex.value=index;
}
let generateAudio = async()=>{
    if(isLoading.value){
        return;
    }
    let options = {
        method:"POST",
        credentials:"include",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({text:script.value,voiceId:selectedVoiceId.value,isLatinDarija:isLatinDarija.value})
    }
      const loader = $loading.show({
        canCancel:false,
        isFullPage:true,
        transition:"fade",
        loader:"dots",
        backgroundColor:"#fff",
        opacity:0.5,

        
    });
    isLoading.value=true;
    try{
    let response = await fetch("https://api.ehdrli.com/api/voices",options);
    if(!response.ok){
        return;
    }
    let data = await response.blob();
  
    audioResult.value=URL.createObjectURL(data);
    await getCharacters();
    
    }catch(err){
        console.error(err.message);
    }finally{
        loader.hide();
        isLoading.value=false;
    }
}
let playVoices = (previewUrl)=>{
    if(currentAudio){
        currentAudio.pause();
        currentAudio.currentTime=0;
    }
    if(previewUrl){
    currentAudio=new Audio(previewUrl);
    currentAudio.play();  
    }
    
}
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

watch(isLargeScreen,(isLarge)=>{
    if(isLarge){
        isExitVoices.value=true;
    }
},{immediate:true});
const balance = computed(()=>characters.value?.remaining||0);
getCharacters();
getVoices();


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
    <main class="texttospeechmain">
         <article v-show="session.data&&!isEmailVerified" class="emailverificationnotice">
    <p  style="color: greenyellow;" v-if="verificationEmailSuccess!=null">{{ verificationEmailSuccess }}</p>
    <p style="color:red;" v-else-if="verificationEmailError!=null">{{ verificationEmailError }} </p>
    <p v-else>{{ $t("emailverificationnotice") }} <a href="#" @click.prevent="handleEmailVerification()">{{ $t("emailverificationlink") }}</a></p>

    </article>
        <article class="balance">
            <span id="chars" class="material-symbols-outlined">mode_heat</span><p>{{ $t("balance") }}:<span id="chars"><b>{{ balance }}</b> {{ $t("chars") }}</span></p>
       </article>
        <div class="texttospeechcontainer">
            <div class="texttospeechparent">
       <article class="voice" @click="isExitVoices=true">
        <div>
           <h2>{{ voices[selectedVoiceIndex]?.name }}</h2>
        <p>{{ voices[selectedVoiceIndex]?.category }} • {{ voices[selectedVoiceIndex]?.descriptive }}• {{ voices[selectedVoiceIndex]?.useCase }}</p>  
        </div>
       <span class="material-symbols-outlined">keyboard_arrow_down</span>
      </article>
      <article class="prompt">
        <p>{{ $t("whattosay") }}</p>
        <textarea :placeholder="$t('typescript')" v-model="script" :maxlength="5000"></textarea>
        <div class="promptresult" v-if="audioResult">
        <audio class="audioresult"  :src="audioResult" controls></audio>
        <a :href="audioResult" download="result.mp3"><button><span class="material-symbols-outlined">download</span>{{ $t("download") }}</button></a>
        </div>
        <div class="promptbtn">
        <p>{{script.length}}/{{ 5000 }} {{ $t("characters") }}</p>
<button  @click="generateAudio()" :disabled="isLoading"><span class="material-symbols-outlined">graphic_eq</span>{{ $t("scriptbutton") }}</button>
        </div>
        
     </article>
        </div>
        <div class="texttospeechchild">
       <article class="selectvoices" v-show="isExitVoices">
        <div class="selectvoicesexit" >
            <span class="material-symbols-outlined" @click="isExitVoices=false">remove</span>
          </div>
        <div class="selectvoicestitle">
          <h2>{{ $t("selectvoices") }}</h2>
        <span class="material-symbols-outlined" @click="isExitVoices=false">close</span>  
        </div>
        <div class="selectedvoice"  v-for="(voice,index) in voices"  @click="playVoices(voice.previewUrl),selectVoice(voice.voiceId,index)" :class="{isvoice:voice.voiceId==selectedVoiceId}" :key="index" >
        <div>
        <p><b>{{ voice?.name }}</b></p>
        <p>{{ voice?.category }} • {{ voice?.descriptive }} • {{ voice?.useCase }} </p>  
        </div> 
        <span class="material-symbols-outlined" v-show="voice.voiceId==selectedVoiceId">check_circle</span>
        </div>
        </article>
        </div>

        </div>
    
    </main>
    <footer >
    </footer>
    </div>
  
</template>