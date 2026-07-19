<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![project_license][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/itsaness/ehdrli">
    <img src="/frontend/hdrli/public/ehdrlilogo.png" alt="Logo" width="240" height="240">
  </a>

<h3 align="center">eHdrli</h3>

  <p align="center">
    project_description
    <br />
    <a href="https://github.com/itsaness/ehdrli"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/itsaness/ehdrli">View Demo</a>
    &middot;
    <a href="https://github.com/itsaness/ehdrli/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    &middot;
    <a href="https://github.com/itsaness/ehdrli/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project
[![Product Name Screen Shot][product-screenshot]](https://i.imgur.com/jUCyOMh.png)
<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* [![Vue][Vue.js]][Vue-url]
* ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
* ![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started
To get a local copy up and running follow these simple example steps.

### Prerequisites
* npm
  ```sh
  cd backend
  npm install npm@latest -g
  ```





### Installation


1. Clone the repo
   ```sh
   git clone https://github.com/itsaness/ehdrli.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Add your api keys (Elevenlabs,better-auth,Chargily,Resend,Google client id,Google client secret) and postgres database details 

4. create your postgres db this is psql commands to make it easier for you:
```
create table "user" ("id" text not null primary key, "name" text not null, "email" text not null unique, "emailVerified" boolean not null, "image" text, "createdAt" timestamptz default CURRENT_TIMESTAMP not null, "updatedAt" timestamptz default CURRENT_TIMESTAMP not null);

create table "session" ("id" text not null primary key, "expiresAt" timestamptz not null, "token" text not null unique, "createdAt" timestamptz default CURRENT_TIMESTAMP not null, "updatedAt" timestamptz not null, "ipAddress" text, "userAgent" text, "userId" text not null references "user" ("id") on delete cascade);

create table "account" ("id" text not null primary key, "accountId" text not null, "providerId" text not null, "userId" text not null references "user" ("id") on delete cascade, "accessToken" text, "refreshToken" text, "idToken" text, "accessTokenExpiresAt" timestamptz, "refreshTokenExpiresAt" timestamptz, "scope" text, "password" text, "createdAt" timestamptz default CURRENT_TIMESTAMP not null, "updatedAt" timestamptz not null);

create table "verification" ("id" text not null primary key, "identifier" text not null, "value" text not null, "expiresAt" timestamptz not null, "createdAt" timestamptz default CURRENT_TIMESTAMP not null, "updatedAt" timestamptz default CURRENT_TIMESTAMP not null);

create index "session_userId_idx" on "session" ("userId");

create index "account_userId_idx" on "account" ("userId");

create index "verification_identifier_idx" on "verification" ("identifier");
CREATE TABLE plans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,       -- e.g., 'Plus', 'Pro'
    character_limit INTEGER NOT NULL,       -- e.g., 10000, 30000
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Insert your two required plans
INSERT INTO plans (name, character_limit) VALUES
('Plus', 10000),
('Pro', 30000);

-- 3. Create the Subscriptions Table (Dynamic Data)
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Automatically generates UUIDs
    user_id TEXT NOT NULL,                         -- Links to better-auth's user table
    plan_id INTEGER REFERENCES plans(id),          -- Links to the plans table
    status VARCHAR(50) DEFAULT 'active',           -- 'active', 'canceled', 'expired'
    characters_used INTEGER DEFAULT 0,             -- Tracks how much of the limit they used
    current_period_end TIMESTAMP WITH TIME ZONE,   -- When the subscription renews/expires
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    checkout_id uuid
);
```

5. Change git remote url to avoid accidental pushes to base project
   ```sh
   git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git remote -v # confirm the changes
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Usage
Enter your script in text-to-speech page at http://localhost:5173/text-to-speech and then click generate.
in this exemple we entered this script "مع هدرلي رجّع أي كتيبة لأوديو احترافي في رمشة عين. خيّر الصوت لي يعجبك، أكتب واش راك حاب، وخلّي الذكاء الاصطناعي يدير خدمتوا"
<img src="https://i.imgur.com/3ekFZAt.png">
then the audio will look something like this
<a href="https://github.com/itsaness/ehdrli/blob/main/frontend/hdrli/public/ehdrli.mp3">View audio</a>




<p align="right">(<a href="#readme-top">back to top</a>)</p>




<!-- ROADMAP -->
## Roadmap

- [ ] Usage of elevenlabs v3 model with arabic voices from the shared library (audio accuracy is around 60% for darija).
- [ ] Payment is possible through Edahabia or Cib card using chargily.


See the [open issues](https://github.com/itsaness/ehdrli/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Top contributors:

<a href="https://github.com/itsaness/ehdrli/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=itsaness/ehdrli" alt="contrib.rocks image" />
</a>



<!-- LICENSE -->
## License

Distributed under the MIT license. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Sabbar Aness Abdelfattah  - anessabdelfattahs@gmail.com

Project Link: [https://github.com/itsaness/ehdrli](https://github.com/itsaness/ehdrli)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* []()
* []()
* []()

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/itsaness/ehdrli.svg?style=for-the-badge
[contributors-url]: https://github.com/itsaness/ehdrli/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/itsaness/ehdrli.svg?style=for-the-badge
[forks-url]: https://github.com/itsaness/ehdrli/network/members
[stars-shield]: https://img.shields.io/github/stars/itsaness/ehdrli.svg?style=for-the-badge
[stars-url]: https://github.com/itsaness/ehdrli/stargazers
[issues-shield]: https://img.shields.io/github/issues/itsaness/ehdrli.svg?style=for-the-badge
[issues-url]: https://github.com/itsaness/ehdrli/issues
[license-shield]: https://img.shields.io/github/license/itsaness/ehdrli.svg?style=for-the-badge
[license-url]: https://github.com/itsaness/ehdrli/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[product-screenshot]: https://i.imgur.com/jUCyOMh.png
<!-- Shields.io badges. You can a comprehensive list with many more badges at: https://github.com/inttter/md-badges -->



[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
