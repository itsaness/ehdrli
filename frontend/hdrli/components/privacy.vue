<script setup>
import { ref,computed } from 'vue';
import { useRoute,useRouter } from 'vue-router';
import { authClient } from '@/auth-client';
let route = useRoute();
let router = useRouter();
const session =  authClient.useSession();
let email = computed(()=>session.value?.data?.user?.email);
let isEmailVerified=computed(()=>session.value?.data?.user?.emailVerified);
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
</script>
<template>
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
<main class="termscontainer">
    <article v-show="session.data&&!isEmailVerified" class="emailverificationnotice">
     <p>Please verify your email address to unlock all features.  <a href="/" @click="handleEmailVerification()">Resend Verification Link</a></p>
    </article>
    <article class="terms">
        <h2>Privacy Policy</h2>
        <p><b>Effective Date:</b> July 5, 2026</p>
        <p>Welcome to Dzoin ("we," "our," or "us"). We are committed to protecting your personal data in strict compliance with <b>Algerian Law No. 18-07</b> of June 10, 2018, relating to the protection of natural persons in the processing of personal data.</p>
        <ol>
            <li>Data We Collect</li>
            <p>We collect the information necessary to provide our services, including:</p>
            <ul>
                <li>Identity & Contact Data: </li>
                <p>Name, email address, phone number.</p>
                <li>Technical Data: </li>
                <p>IP address, browser type, and cookies for site functionality.</p>
            </ul>
            <li>How We Use Your Data</li>
            <p>We only use your data to:</p>
            <ul>
                <li>Provide and maintain our services.</li>
                <li>Manage your account and process transactions.</li>
                <li>Respond to your support requests.</li>
            </ul>
            <li>Data Protection and Sharing</li>
            <p>We do not sell your personal data. We implement strict security measures to protect your information from unauthorized access. We do not transfer your personal data outside of Algeria without your explicit consent or legal necessity.</p>
            <li>Data Retention</li>
            <p>We retain your personal data only as long as necessary to fulfill the purposes of our service or to comply with Algerian legal obligations.</p>
            <li>Your Rights Under Law 18-07</li>
            <p>You have the right to:</p>
            <ul>
                <li><b>Access:</b> Request a copy of your personal data.</li>
                <li><b>Rectify:</b>Ask us to correct inaccurate data.</li>
                <li><b>Delete: </b>Request the deletion of your data.</li>
                <li><b>Object or Withdraw Consent:</b> Stop us from processing your data at any time.</li>
            </ul>
            <li>Contact Us</li>
            <p>To exercise your rights or ask questions, please contact us at:</p>
            <ul>
                <li><b>Email:</b>support@dzoin.com</li>
            </ul>
            <p>By using our services, you consent to the collection and use of your data as described in this policy.</p>
            </ol>

       
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
        <p>© 2026 hdrli. All rights reserved.</p>
    </footer>
</template>