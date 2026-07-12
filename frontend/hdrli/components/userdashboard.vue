<script setup>
import { ref,computed } from 'vue';
import { useRoute,useRouter } from 'vue-router';
import { authClient } from '@/auth-client';
let isMenu = ref(false);
let route = useRoute();
let router = useRouter();
let isChangeEmail = ref(false);
const session=authClient.useSession();
let verificationEmailError=ref(null);
let isEmailVerified=computed(()=>session.value?.data?.user?.emailVerified);
let name = computed(()=>session.value?.data?.user?.name);
let verificationEmailSuccess=ref(null);
let changeEmailError=ref();
let changeEmailSuccess=ref();
let isLoading=ref();
let email=computed(()=>session.value?.data?.user?.email);
let newEmail=ref();
let emailRegex=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
let newPassword = ref(null);
let repeatedNewPassword = ref(null);
let passwordError=ref(null);
let passwordSuccess=ref(null);
let currentPassword=ref();
let isChangePassword=ref(false);
let subscriptions =ref([]);

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
        console.log(email.value);
        verificationEmailSuccess.value=`Verification email sent to ${email.value}`
    }catch(err){
        verificationEmailError.value="A network error occurred. Please try again later.";
    }

}
let checkEmail = ()=>{
    if(!newEmail.value||!emailRegex.test(newEmail.value)){
        changeEmailError.value="Invalid Email.";
        return;
    }
    changeEmailError.value=null;
}
let handleEmailChange = async()=>{
    if(isLoading.value){
        return;
    }
    isLoading.value=true;
    try{
      const {data,error}=await authClient.changeEmail({
        newEmail:newEmail.value,
        callbackURL:window.location.origin+"/account"

      })
      if(error){
        changeEmailError.value=error.message;
        return;
      }
      changeEmailSuccess=`a Change email confirmation sent to ${email.value}`;
    }catch(err){
        changeEmailError.value="A network error occurred. Please try again later."
    }finally{
        isLoading.value=false;
    }
}
let handleCancel=()=>{
    isChangeEmail=false;
    window.location.reload();
}
let checkPassword = ()=>
{  
    if(!currentPassword.value){
        passwordError.value="Password required.";
        return;
    }
    if(!newPassword.value||newPassword.value.length<8){
        passwordError.value="Password should be 8 characters long.";
        return;

    }
    if(newPassword.value!=repeatedNewPassword.value){
        passwordError.value="Passwords doesn't match."
        return;
    }
    passwordError.value=null;

}
let handlePasswordChange = async()=>{
    if(isLoading.value){
        return;
    }
    isLoading.value=true;
    try{
        const {data,error}=await authClient.changePassword({
            newPassword:repeatedNewPassword.value,
            currentPassword:currentPassword.value,
            revokeOtherSessions:true
        })
        if(error){
            passwordError.value=error.message;
            return;
        }
        passwordSuccess.value="Password changed Successfully !";
        isChangePassword.value=false;


    }catch(err){
        passwordError.value="a Network error occurred. Please try again later."

    }finally{
        isLoading.value=false;
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
let getSubscriptions = async ()=>{
    const options = {
        method:"GET",
        credentials:"include",
        headers:{
            "Content-Type":"application/json"
        }
    }
    try{
        let response = await fetch("https://api.ehdrli.com/api/characters",options);
        if(!response.ok){
            return;
        }
        let data = await response.json();
        subscriptions.value=data.usage.subscriptions;
        console.log(subscriptions.value);
    }catch(err){
        console.error(err.message);
    }
}
getSubscriptions();





</script>
<template>
 <div class="navigationmenu" v-show="isMenu">
        <div class="navigationmenutitle">
            <h2>eHdrli</h2>
             <span class="material-symbols-outlined" @click="isMenu=false">close_small</span>
        </div>
        <div class="navigationmenulinks">
            <ul>
        <routerLink to="/" :class="{isLink:route.path=='/'}"><li>Home</li></routerLink>
        <routerLink to="/pricing" :class="{isLink:route.path=='/pricing'}"><li>Pricing</li></routerLink>
        <routerLink to="/text-to-speech" :class="{isLink:route.path=='/text-to-speech'}"><li>Text to speech</li></routerLink>
        <routerLink to="/account" :class="{isLink:route.path=='/account'}"><li>Account</li></routerLink>

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
    <routerLink to="/"><h2>eHdrli</h2></routerLink> 
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
    
</header>
<main class="userdashboardsubscriptionmain">
    <article v-show="session.data&&!isEmailVerified" class="emailverificationnotice">
    <p  style="color: green;" v-if="verificationEmailSuccess!=null">{{ verificationEmailSuccess }}</p>
    <p style="color:red;" v-else-if="verificationEmailError!=null">{{ verificationEmailError }} </p>
    <p v-else>Please verify your email address to unlock all features.  <a href="#" @click.prevent="handleEmailVerification()">Resend Verification Link</a></p>

    </article>
    <div class="userdashboardcontainer">
     <article class="userdashboardhero">
        <h2>Hello, {{ name }}</h2>
        <p>Manage your sanctuary settings.</p>
    </article>
    <article class="userdashboardsecurity">
        <h2><span class="material-symbols-outlined">person</span>Account</h2>
        <div class="userdashboardsecurityemail">
         <p style="color:red" v-if="changeEmailError!=null" >{{ changeEmailError }}</p> 
        <p style="color:green" v-if="changeEmailSuccess!=null">{{ changeEmailSuccess }}</p>   
  <label for="email">Email Address</label>
        <input type="text" :placeholder="email" :disabled="!isChangeEmail" v-model="newEmail" @input="checkEmail()">
        <button v-if="!isChangeEmail" @click="isChangeEmail=true">Edit</button>  
        <div v-if="isChangeEmail" class="userdashboardchangeemail">
          <button @click="handleEmailChange()">Save</button>
          <button @click="handleCancel()">Cancel</button>
        </div>
         
        
        </div>
        <div class="userdashboardsecuritypassword">
             <p v-if="passwordSuccess!=null" style="color: green;">{{ passwordSuccess}}</p>
            <label for="email" v-if="!isChangePassword">Password</label>
        <input type="password" placeholder="●●●●●●●" v-if="!isChangePassword">
        <button v-if="!isChangePassword" @click="isChangePassword=true">Change Password</button> 
        <div v-if="isChangePassword">
            <p v-if="passwordError!=null" style="color: red;">{{ passwordError}}</p>
 <label for="email">Current password</label>
        <input type="password" placeholder="●●●●●●●" v-model="currentPassword">
        <label for="email">New password</label>
        <input type="password" placeholder="●●●●●●●" v-model="newPassword" @input="checkPassword()">
        <label for="email">Repeat new password</label>
        <input type="password" placeholder="●●●●●●●" v-model="repeatedNewPassword" @input="checkPassword()">
        <div v-if="isChangePassword" class="userdashboardchangeemail">
          <button @click="handlePasswordChange()">Save</button>
          <button @click="isChangePassword=false" id="passwordchangecancel">Cancel</button>
        </div>

        </div>

        </div>
    </article>
     <article class="userdashboardsubscriptions">
            <h2><span class="material-symbols-outlined">stars</span> Subscriptions</h2>
            <article class="subscriptioncontainer" v-for="subscription in subscriptions">
                <article class="userdashboardsubscription">
                      <div class="subscriptiontitle">
                  <h2 v-if="subscription.character_limit==10000">Plus Plan</h2>
                  <h2 v-if="subscription.character_limit==20000">Pro Plan</h2>
                  <p>Active</p>  
                </div> 
                <div class="subscriptioncontent">
                <p>Characters used  • {{ subscription.characters_used}} characters</p>
                <p><span class="material-symbols-outlined">calendar_month</span> Ends in {{ new Intl.DateTimeFormat("en-us",{month:"short",day:"numeric",year:"numeric"}).format(new Date(subscription.current_period_end))}}</p>
                </div>
                </article>
                
                
                
             
             
                



            </article>

        </article>
    </div>
</main>
</div>   
</template>