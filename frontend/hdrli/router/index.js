import { createWebHistory,createRouter } from "vue-router";
import homeView from "../views/homeView.vue";
import pricingView from "../views/pricingView.vue";
import loginView from "../views/loginView.vue";
import signupView from "../views/signupView.vue";
import texttospeechView from "../views/texttospeechView.vue";
import forgotpasswordView from "../views/forgotpasswordView.vue";
import resetpasswordView from "../views/resetpasswordView.vue";
import termsView from "../views/termsView.vue";
import privacyView from "../views/privacyView.vue";
import userdashboardView from "../views/userdashboardView.vue";
import { authClient } from "@/auth-client.js";





const routes = [
    {path:"/",name:"home",component:homeView},
    {path:"/pricing",name:"pricing",component:pricingView},
    {path:"/login",name:"login",component:loginView,meta:{requiresGuest:true}},
    {path:"/sign-up",name:"signup",component:signupView,meta:{requiresGuest:true}},
    {path:"/text-to-speech",name:"texttospeech",component:texttospeechView},
    {path:"/forgot-password",name:"forgotpassword",component:forgotpasswordView,meta:{requiresGuest:true}},
    {path:"/reset-password",name:"resetpassword",component:resetpasswordView,meta:{requiresGuest:true}},
    {path:"/terms",name:"terms",component:termsView},
    {path:"/privacy",name:"privacypolicy",component:privacyView},
    {path:"/account",name:"userdashboard",component:userdashboardView,meta:{requiresAuth:true}}


]

export const router = createRouter({
    history:createWebHistory(import.meta.env.BASE_URL),
    routes
})

router.beforeEach(async (to,from)=>{
    try{
    const {data:session} = await authClient.getSession();
    if(to.meta.requiresGuest){
        if(session){
             return {path:"/"};
        }
    }
    if(to.meta.requiresAuth){
        if(!session){
            return {path:"/login"};
        }
    }
    return true;
    }catch(err){
        if(to.meta.requiresAuth){
            return {path:"/login"};
        }
        return true;
        
    }
  

})