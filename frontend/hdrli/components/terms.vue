<script setup>
import { ref,computed } from 'vue';
import { useRoute,useRouter } from 'vue-router';
import { authClient } from '@/auth-client';
import { useI18n } from 'vue-i18n';
let route = useRoute();
let router = useRouter();
const session =  authClient.useSession();
let email = computed(()=>session.value?.data?.user?.email);
let isEmailVerified=computed(()=>session.value?.data?.user?.emailVerified);
let verificationEmailError=ref(null);
let verificationEmailSuccess=ref(null);
let isMenu=ref(false);
const {t,locale}=useI18n({useScope:"global"});
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
    <p  style="color: green;" v-if="verificationEmailSuccess!=null">{{ verificationEmailSuccess }}</p>
    <p style="color:red" v-else-if="verificationEmailError!=null">{{ verificationEmailError }} </p>
    <p v-else>Please verify your email address to unlock all features.  <a href="#" @click.prevent="handleEmailVerification()">Resend Verification Link</a></p>

    </article>
    <article class="terms">
        <h2>Terms of Service for eHdrli</h2>
        <p><b>Effective Date:</b> July 5, 2026</p>
        <p><b>Platform:eHdrli (the "Platform", "Service", "we", "us", or "our")</b></p>
        <p>Welcome to eHdrli. These Terms of Service ("Terms") govern your access to and use of the eHdrli website, applications, and AI text-to-speech (TTS) and voice cloning services.
           By registering an account, purchasing a subscription, or using our Services, you agree to be bound by these Terms. If you do not agree to these Terms, you must not use our Services.</p>
        <ol>
            <li>Description of Service</li>
            <p>eHdrli is an artificial intelligence platform that allows users to generate audio from text, clone voices, and utilize synthetic voices for various applications. The output generated by eHdrli is determined by the text prompts and audio samples provided by the user.</p>
            <li>Payments and Strict No Refund Policy</li>
            <ul>
                <li><b>2.1 Digital Goods:</b></li>
                <p>By purchasing a subscription or credit package on eHdrli, you acknowledge that you are purchasing instant access to digital, intangible goods and computational processing power.</p>
                <li><b>2.2 NO REFUND POLICY:</b></li>
                <p><b>All sales are final. eHdrli enforces a strict NO REFUND policy. </b> Once a payment is processed and credits or characters are added to your account, we cannot offer refunds, prorated refunds, or credits for any unused characters, canceled subscriptions, or dissatisfaction with the generated audio.</p>
                <li>2.3 Account Bans:</li>
                <p>If your account is suspended or terminated due to a violation of these Terms (e.g., generating illegal content or unauthorized voice cloning), you forfeit any remaining credits and will not be refunded.</p>
            </ul>
            <li>Acceptable Use and Ethics</li>
            <p>You are solely responsible for the text you input and the audio you generate using eHdrli. By using our Services, you agree to strictly abide by the following rules:</p>
            <ul>
                <li><b>3.1 Consent for Voice Cloning:</b></li>
                <p>You must possess explicit, legally valid consent from the individual whose voice you are cloning. You may not clone the voices of politicians, public figures, celebrities, or any private citizen without their written permission.</p>
                <li><b>3.2 Prohibited Content:</b></li>
                <p>You may not use eHdrli to generate audio that is:</p>
                <ul>
                    <li>Fraudulent, deceptive, or intended for scams (e.g., deepfake phishing).</li>
                    <li>Defamatory, libelous, or harmful to an individual's reputation.</li>
                    <li>In violation of Algerian criminal law or cybercrime laws.</li>
                    <li>Inciting violence, hatred, racism, or discrimination.</li>
                </ul>
                <li><b>3.3 Platform Rights:</b></li>
                <p>We reserve the right to monitor generated content using automated systems to ensure compliance. We retain the right to instantly terminate accounts found violating these rules.</p>
            </ul>
            <li>Intellectual Property</li>
            <ul>
                <li><b>4.1 Your Input and Output:</b></li>
                <p> You retain ownership of the original text you submit to eHdrli. Subject to your compliance with these Terms, eHdrli grants you a commercial license to use the audio files you generate using your purchased credits.</p>
                <li><b>4.2 Our Technology:</b></li>
                <p>eHdrli retains all intellectual property rights to the platform, the underlying AI models, the website design, and our brand identity. You may not reverse-engineer, decompile, or attempt to extract our source code.</p>
            </ul>
            <li>Data Privacy and Algerian Law (Law No. 18-07)</li>
            <p>Your privacy is important to us. eHdrli complies with the laws of the People's Democratic Republic of Algeria, specifically Law No. 18-07 dated June 10, 2018, relating to the protection of natural persons in the processing of personal data.</p>
            <ul>
                <li><b>5.1 Data Collection: </b></li>
                <p>We collect necessary data (email, payment info, uploaded voice samples) solely for providing the Service.</p>
                <li><b>5.2 Voice Data:</b></li>
                <p>Uploaded audio samples used for cloning are processed securely and are never used to train our base models without your explicit consent.</p>
                <li><b>5.3 User Rights: </b></li>
                <p>Under Law 18-07, you have the right to access, rectify, or request the deletion of your personal data by contacting our support team.</p>

            </ul>
            <li>Disclaimer of Warranties</li>
            <p>eHdrli is provided on an "AS IS" and "AS AVAILABLE" basis. We make no guarantees that the Service will be uninterrupted, error-free, or that the generated audio will meet your specific subjective expectations. We disclaim all warranties, express or implied.</p>
            <li>Limitation of Liability</li>
            <p>To the maximum extent permitted by Algerian law, eHdrli, its founders, and affiliates shall not be liable for any indirect, incidental, special, or consequential damages resulting from:</p>
            <ol>
                <li>Your use or inability to use the Service.</li>
                <li>Any unauthorized access to your account.</li>
                <li>Any legal claims made against you by third parties due to the audio you generated using our platform.</li>
            </ol>
            <li>Governing Law and Jurisdiction</li>
            <p>These Terms shall be governed by and construed in accordance with the laws of the People's Democratic Republic of Algeria.
Any dispute, controversy, or claim arising out of or relating to these Terms, or the breach, termination, or invalidity thereof, shall be subject to the exclusive jurisdiction of the competent courts </p>
             <li>Modifications to Terms</li>
             <p>We reserve the right to modify these Terms at any time. We will notify users of significant changes via email or an alert on the platform. Continued use of eHdrli after changes are published constitutes your acceptance of the revised Terms.</p>
</ol>
    <p><b>Contact Us</b> If you have any questions about these Terms, please contact us at: support@ehdrli.com</p>
        
       
    </article>
        <article class="terms" dir="rtl">
        <h2>شروط الخدمة لـ eHdrli</h2>
        <p><b>تاريخ السريان:</b> 5 يوليو 2026</p>
        <p><b>المنصة: eHdrli (يُشار إليها بـ "المنصة" أو "الخدمة" أو "نحن" أو "لنا")</b></p>
        <p>مرحباً بك في eHdrli. تحكم شروط الخدمة هذه ("الشروط") وصولك إلى واستخدامك لموقع eHdrli الإلكتروني وتطبيقاته وخدمات تحويل النص إلى كلام (TTS) واستنساخ الأصوات بالذكاء الاصطناعي.
           بتسجيل حساب أو شراء اشتراك أو استخدام خدماتنا، فإنك توافق على الالتزام بهذه الشروط. إذا كنت لا توافق على هذه الشروط، يجب عليك عدم استخدام خدماتنا.</p>
        <ol>
            <li>وصف الخدمة</li>
            <p>eHdrli هي منصة ذكاء اصطناعي تتيح للمستخدمين توليد الصوت من النص، واستنساخ الأصوات، واستخدام الأصوات الاصطناعية في تطبيقات متنوعة. يتحدد الناتج الذي تولده eHdrli بناءً على النصوص التوجيهية والعينات الصوتية التي يقدمها المستخدم.</p>
            <li>المدفوعات وسياسة عدم الاسترداد الصارمة</li>
            <ul>
                <li><b>2.1 البضائع الرقمية:</b></li>
                <p>بشراء اشتراك أو حزمة رصيد على eHdrli، فإنك تُقر بأنك تشتري وصولاً فورياً إلى سلع رقمية غير ملموسة وقدرة معالجة حسابية.</p>
                <li><b>2.2 سياسة عدم الاسترداد:</b></li>
                <p><b>جميع المبيعات نهائية. تطبق eHdrli سياسة صارمة لعدم الاسترداد.</b> بمجرد معالجة الدفع وإضافة الرصيد أو الأحرف إلى حسابك، لا يمكننا تقديم استرداد أو استرداد نسبي أو رصيد مقابل أي أحرف غير مستخدمة أو اشتراكات ملغاة أو عدم الرضا عن الصوت المولّد.</p>
                <li>2.3 حظر الحسابات:</li>
                <p>إذا تم تعليق حسابك أو إنهاؤه بسبب انتهاك هذه الشروط (مثل توليد محتوى غير قانوني أو استنساخ الأصوات بدون إذن)، فإنك تفقد أي رصيد متبقٍ ولن يتم استرداده.</p>
            </ul>
            <li>الاستخدام المقبول والأخلاقيات</li>
            <p>أنت المسؤول الوحيد عن النص الذي تدخله والصوت الذي تولده باستخدام eHdrli. باستخدام خدماتنا، فإنك توافق على الالتزام الصارم بالقواعد التالية:</p>
            <ul>
                <li><b>3.1 الموافقة على استنساخ الأصوات:</b></li>
                <p>يجب أن تمتلك موافقة صريحة وصالحة قانونياً من الشخص الذي تقوم باستنساخ صوته. لا يجوز لك استنساخ أصوات السياسيين أو الشخصيات العامة أو المشاهير أو أي مواطن خاص دون إذن خطي منهم.</p>
                <li><b>3.2 المحتوى المحظور:</b></li>
                <p>لا يجوز لك استخدام eHdrli لتوليد صوت:</p>
                <ul>
                    <li>احتيالي أو مضلل أو مخصص للاحتيال (مثل التصيد الاحتيالي بالتزييف العميق).</li>
                    <li>تشهيري أو مسيء لسمعة شخص ما.</li>
                    <li>ينتهك قانون العقوبات الجزائري أو قوانين الجرائم الإلكترونية.</li>
                    <li>يحرض على العنف أو الكراهية أو العنصرية أو التمييز.</li>
                </ul>
                <li><b>3.3 حقوق المنصة:</b></li>
                <p>نحتفظ بالحق في مراقبة المحتوى المولّد باستخدام أنظمة آلية لضمان الامتثال. ونحتفظ بالحق في إنهاء الحسابات التي تنتهك هذه القواعد فوراً.</p>
            </ul>
            <li>الملكية الفكرية</li>
            <ul>
                <li><b>4.1 مدخلاتك ومخرجاتك:</b></li>
                <p>تحتفظ بملكية النص الأصلي الذي تقدمه إلى eHdrli. مع التزامك بهذه الشروط، تمنحك eHdrli ترخيصاً تجارياً لاستخدام الملفات الصوتية التي تولدها باستخدام رصيدك المشترى.</p>
                <li><b>4.2 تقنيتنا:</b></li>
                <p>تحتفظ eHdrli بجميع حقوق الملكية الفكرية للمنصة ونماذج الذكاء الاصطناعي الأساسية وتصميم الموقع وهويتنا التجارية. لا يجوز لك إجراء هندسة عكسية أو تفكيك أو محاولة استخراج كودنا المصدري.</p>
            </ul>
            <li>خصوصية البيانات والقانون الجزائري (القانون رقم 18-07)</li>
            <p>خصوصيتك مهمة بالنسبة لنا. تمتثل eHdrli لقوانين جمهورية الجزائر الديمقراطية الشعبية، وتحديداً القانون رقم 18-07 المؤرخ في 10 يونيو 2018، المتعلق بحماية الأشخاص الطبيعيين في معالجة البيانات الشخصية.</p>
            <ul>
                <li><b>5.1 جمع البيانات:</b></li>
                <p>نجمع البيانات الضرورية (البريد الإلكتروني ومعلومات الدفع والعينات الصوتية المرفوعة) حصراً لتقديم الخدمة.</p>
                <li><b>5.2 بيانات الصوت:</b></li>
                <p>تُعالَج العينات الصوتية المرفوعة للاستنساخ بشكل آمن ولا تُستخدم أبداً لتدريب نماذجنا الأساسية دون موافقتك الصريحة.</p>
                <li><b>5.3 حقوق المستخدم:</b></li>
                <p>بموجب القانون 18-07، يحق لك الوصول إلى بياناتك الشخصية أو تصحيحها أو طلب حذفها عن طريق التواصل مع فريق الدعم.</p>
            </ul>
            <li>إخلاء المسؤولية عن الضمانات</li>
            <p>تُقدَّم eHdrli على أساس "كما هي" و"كما هو متاح". لا نضمن أن الخدمة ستكون دون انقطاع أو خالية من الأخطاء، أو أن الصوت المولّد سيلبي توقعاتك الذاتية المحددة. نتبرأ من جميع الضمانات، الصريحة منها والضمنية.</p>
            <li>تحديد المسؤولية</li>
            <p>إلى أقصى حد يسمح به القانون الجزائري، لن تكون eHdrli ومؤسسوها وشركاؤها مسؤولين عن أي أضرار غير مباشرة أو عرضية أو خاصة أو تبعية ناتجة عن:</p>
            <ol>
                <li>استخدامك للخدمة أو عدم قدرتك على استخدامها.</li>
                <li>أي وصول غير مصرح به إلى حسابك.</li>
                <li>أي مطالبات قانونية مقدمة ضدك من أطراف ثالثة بسبب الصوت الذي ولّدته باستخدام منصتنا.</li>
            </ol>
            <li>القانون الحاكم والاختصاص القضائي</li>
            <p>تخضع هذه الشروط وتُفسَّر وفقاً لقوانين جمهورية الجزائر الديمقراطية الشعبية. أي نزاع أو خلاف أو مطالبة ناشئة عن هذه الشروط أو المتعلقة بها، أو عن إخلالها أو إنهائها أو بطلانها، تخضع للاختصاص القضائي الحصري للمحاكم المختصة.</p>
            <li>التعديلات على الشروط</li>
            <p>نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سنُخطر المستخدمين بالتغييرات الجوهرية عبر البريد الإلكتروني أو تنبيه على المنصة. استمرار استخدام eHdrli بعد نشر التغييرات يُعدّ قبولاً منك للشروط المعدّلة.</p>
        </ol>
    <p><b>تواصل معنا:</b> إذا كان لديك أي أسئلة حول هذه الشروط، يرجى التواصل معنا على: support@ehdrli.com</p>
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