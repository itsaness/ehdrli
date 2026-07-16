<script setup>
import { authClient } from '@/auth-client';
import { useRoute,useRouter } from 'vue-router';
import { ref,computed } from 'vue';
import { useI18n } from 'vue-i18n';
let router = useRouter();
let session = authClient.useSession();
let name = computed(()=>session?.value.data?.user?.name);
let route = useRoute();
let isMenu=ref(false);
let plans=ref([]);
let email = computed(()=>session.value?.data?.user?.email);
let verificationEmailError=ref(null);
let isEmailVerified=computed(()=>session.value?.data?.user?.emailVerified);
let verificationEmailSuccess=ref(null);
const {t,locale}=useI18n({useScope:"global"});



const getPlans = async()=>{
    try{
        let response = await fetch("https://api.ehdrli.com/api/plans");
        if(!response.ok){
            return;
        }
        let data = await response.json();
        plans.value=data;
    }catch(err){
        console.error(error.message);
    }
}
const handleCheckout = async(planId)=>{
    const options={
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        credentials:"include",
        body:JSON.stringify({planId:planId})
    }
    if(!session?.value.data){
      router.push("/login");
    }
    try{
    let response = await fetch("https://api.ehdrli.com/api/checkout",options);
    if(!response.ok){
        return;
    }
    let data = await response.json();
    window.location.href=data.checkoutURL;
    }catch(err){
    console.error(err.message);
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
getPlans();


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
    <article class="pricingpresentation">
        <h2>{{ $t("pricingtitle") }}</h2>
        <p>{{ $t("pricingp") }}</p>

    </article>
    <article class="plans">
        <article class="plan1">
            <h2>Plus</h2>
            <p><h2>{{plans[1]?.price}}</h2> <b>DA</b></p>
            <p>{{ $t("pricingfirstcard") }}</p>
            <ul>
                <li><img src="/check.png" alt="">
                <p>{{ $t("pricingadvantageone") }}</p></li>
                <li><img src="/check.png" alt="">
                <p>{{ $t("pricingadvantagetwo") }}</p></li>
                <li> <img src="/check.png" alt="">
                <p>{{ plans[1]?.character_limit }} {{ $t("pricingadvantagethree") }}</p></li>
               
           </ul>
           <button @click="handleCheckout(plans[1]?.id)">{{ $t("pricingfirstbutton") }}</button>

        </article>
        <article class="plan2">
            <h2 id="proplan">Pro</h2>
            <p><h2>{{ plans[0]?.price }}</h2><b>DA</b> </p>
            <p>{{ $t("pricingsecondcard") }}</p>
            <ul>
                <li><img src="/check.png" alt="">
                <p>{{ $t("pricingadvantageone") }}</p></li>
                <li><img src="/check.png" alt="">
                <p>{{ $t("pricingadvantagetwo") }}</p></li>
                <li> <img src="/check.png" alt="">
                <p>{{ plans[0]?.character_limit }} {{ $t("pricingadvantagethree") }}</p></li>
               
           </ul>
           <button id="plansjoinnowbtn" @click="handleCheckout(plans[0]?.id)">{{ $t("pricingsecondbutton") }}</button>

        </article>
        
    </article>
    <article class="faq">
        <h2>{{ $t("questiontitle") }}</h2>
        <article class="question">
            <p><strong>{{ $t("questionfirsttitle") }}</strong> </p>
            <p>{{ $t("questionfirstp") }}</p>
        </article>
         <article class="question">
            <p><strong>{{ $t("questionsecondtitle") }}</strong> </p>
            <p>{{ $t("questionsecondp") }}</p>
        </article>

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