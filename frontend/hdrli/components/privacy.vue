<script setup>
import { ref,computed } from 'vue';
import { useRoute,useRouter } from 'vue-router';
import { authClient } from '@/auth-client';
import { useI18n } from 'vue-i18n';
const {t,locale}=useI18n({useScope:"global"});
let isMenu=ref(false);
let route = useRoute();
let router = useRouter();
const session =  authClient.useSession();
let email = computed(()=>session.value?.data?.user?.email);
let isEmailVerified=computed(()=>session.value?.data?.user?.emailVerified);
let verificationEmailError=ref(null);
let verificationEmailSuccess=ref(null);
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
<main class="termscontainer">
    <article v-show="session.data&&!isEmailVerified" class="emailverificationnotice">
    <p  style="color: greenyellow;" v-if="verificationEmailSuccess!=null">{{ verificationEmailSuccess }}</p>
    <p style="color:red;" v-else-if="verificationEmailError!=null">{{ verificationEmailError }} </p>
    <p v-else>{{ $t("emailverificationnotice") }} <a href="#" @click.prevent="handleEmailVerification()">{{ $t("emailverificationlink") }}</a></p>

    </article>
    <article class="terms">
        <h2>Privacy Policy</h2>
        <p><b>Effective Date:</b> July 5, 2026</p>
        <p>Welcome to eHdrli ("we," "our," or "us"). We are committed to protecting your personal data in strict compliance with <b>Algerian Law No. 18-07</b> of June 10, 2018, relating to the protection of natural persons in the processing of personal data.</p>
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
                <li><b>Email:</b>support@ehdrli.com</li>
            </ul>
            <p>By using our services, you consent to the collection and use of your data as described in this policy.</p>
            </ol>

       
    </article>
        <article class="terms" dir="rtl">
        <h2>سياسة الخصوصية</h2>
        <p><b>تاريخ السريان:</b> 5 يوليو 2026</p>
        <p>مرحباً بك في eHdrli ("نحن" أو "لنا" أو "خاصتنا"). نحن ملتزمون بحماية بياناتك الشخصية وفقاً لأحكام <b>القانون الجزائري رقم 18-07</b> المؤرخ في 10 يونيو 2018، المتعلق بحماية الأشخاص الطبيعيين في معالجة البيانات الشخصية.</p>
        <ol>
            <li>البيانات التي نجمعها</li>
            <p>نجمع المعلومات الضرورية لتقديم خدماتنا، بما في ذلك:</p>
            <ul>
                <li>بيانات الهوية والتواصل:</li>
                <p>الاسم وعنوان البريد الإلكتروني ورقم الهاتف.</p>
                <li>البيانات التقنية:</li>
                <p>عنوان IP ونوع المتصفح وملفات تعريف الارتباط لضمان وظائف الموقع.</p>
            </ul>
            <li>كيف نستخدم بياناتك</li>
            <p>نستخدم بياناتك فقط من أجل:</p>
            <ul>
                <li>تقديم خدماتنا والحفاظ عليها.</li>
                <li>إدارة حسابك ومعالجة المعاملات.</li>
                <li>الرد على طلبات الدعم الخاصة بك.</li>
            </ul>
            <li>حماية البيانات ومشاركتها</li>
            <p>نحن لا نبيع بياناتك الشخصية. نطبق تدابير أمنية صارمة لحماية معلوماتك من الوصول غير المصرح به. ولا ننقل بياناتك الشخصية خارج الجزائر دون موافقتك الصريحة أو الضرورة القانونية.</p>
            <li>الاحتفاظ بالبيانات</li>
            <p>نحتفظ ببياناتك الشخصية فقط طالما كان ذلك ضرورياً لتحقيق أغراض خدمتنا أو للامتثال للالتزامات القانونية الجزائرية.</p>
            <li>حقوقك بموجب القانون 18-07</li>
            <p>يحق لك:</p>
            <ul>
                <li><b>الوصول:</b> طلب نسخة من بياناتك الشخصية.</li>
                <li><b>التصحيح:</b> طلب تصحيح البيانات غير الدقيقة.</li>
                <li><b>الحذف:</b> طلب حذف بياناتك.</li>
                <li><b>الاعتراض أو سحب الموافقة:</b> إيقاف معالجة بياناتك في أي وقت.</li>
            </ul>
            <li>تواصل معنا</li>
            <p>لممارسة حقوقك أو طرح أسئلتك، يرجى التواصل معنا على:</p>
            <ul>
                <li><b>البريد الإلكتروني:</b> support@ehdrli.com</li>
            </ul>
            <p>باستخدام خدماتنا، فإنك توافق على جمع واستخدام بياناتك كما هو موضح في هذه السياسة.</p>
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