<script setup>
import { authClient } from '@/auth-client';
import { useRoute,useRouter } from 'vue-router';
import { ref,computed } from 'vue';
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
getPlans();


</script>
<template>
    <div class="navigationmenu" v-show="isMenu">
        <div class="navigationmenutitle">
             <h2>eHdlri</h2>
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
    <routerLink to="/"><h2>eHdrli</h2></routerLink> 
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
    
</header>
<main>
   <article v-show="session.data&&!isEmailVerified" class="emailverificationnotice">
    <p  style="color: green;" v-if="verificationEmailSuccess!=null">{{ verificationEmailSuccess }}</p>
    <p style="color:red" v-else-if="verificationEmailError!=null">{{ verificationEmailError }} </p>
    <p v-else>Please verify your email address to unlock all features.  <a href="#" @click.prevent="handleEmailVerification()">Resend Verification Link</a></p>

    </article>
    <article class="pricingpresentation">
        <h2>Simple pricing that scales with your needs</h2>
        <p>Start generating lifelike audio immediately and upgrade only when you need more power. We believe in straightforward, transparent pricing with no hidden fees—just choose the character limit that fits your monthly production, whether you are a solo creator or a growing business.</p>

    </article>
    <article class="plans">
        <article class="plan1">
            <h2>Plus</h2>
            <p><h2>{{plans[1]?.price}}</h2> <b>DA</b></p>
            <p>Essential voices and limits for your daily audio needs</p>
            <ul>
                <li><img src="/check.png" alt="">
                <p>Text To Speech Access</p></li>
                <li><img src="/check.png" alt="">
                <p>Ai Franco-darija to Arabic-darija</p></li>
                <li> <img src="/check.png" alt="">
                <p>{{ plans[1]?.character_limit }} Characters</p></li>
               
           </ul>
           <button @click="handleCheckout(plans[1]?.id)">Get Started</button>

        </article>
        <article class="plan2">
            <h2>Pro</h2>
            <p><h2>{{ plans[0]?.price }}</h2><b>DA</b> </p>
            <p>Maximum limits and priority generation for heavy users.</p>
            <ul>
                <li><img src="/check.png" alt="">
                <p>Text To Speech Access</p></li>
                <li><img src="/check.png" alt="">
                <p>Ai Franco-darija to Arabic-darija</p></li>
                <li> <img src="/check.png" alt="">
                <p>{{ plans[0]?.character_limit }} Characters</p></li>
               
           </ul>
           <button id="plansjoinnowbtn" @click="handleCheckout(plans[0]?.id)">Join Now</button>

        </article>
        
    </article>
    <article class="faq">
        <h2>Common Questions</h2>
        <article class="question">
            <p><strong>Can I get more characters if I run out before the month ends?</strong> </p>
            <p>Yes! If you run low on credits, you don't have to wait for your next billing cycle. You can simply purchase another plan at any time. Thanks to our credit-stacking system, your new characters are added instantly, and you will never lose any unused characters from your previous plan until their original expiration date.</p>
        </article>
         <article class="question">
            <p><strong>Whenever people buy AI voice generation, their #1 concern is whether they will get copyright strikes on YouTube or if they can use it for client work?</strong> </p>
            <p>Absolutely. Any audio you generate and download using our Plus or Pro plans is fully cleared for commercial use. You can monetize the voices on YouTube, use them in podcasts, video games, advertisements, or client projects without paying any extra royalties.</p>
        </article>

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
        <p>© 2026 eHdrli. All rights reserved.</p>
    </footer>
    </div>
   
</template>