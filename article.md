### Build an app with Clerk, Prisma Cloud, and NextJS
Clerk is an easy-to-use, customizable and secure customer identity platform that provides you with multiple authentication strategies for your application. This platform helps developers to handle user management processes for their applications so that they can focus on their core business of developement and avoid re-inventing the wheel in user authentication strategies.

Clerk can be used to add customer identity management to your application, handle authentication for your application, add custom sign-in methods, help users track the devices signed into their accounts, provide leaked passwords protection, and many more [features](https://clerk.dev/#home-features).

In this article, you will learn how to build an app using Clerk, Prisma Cloud, and NextJS. This will be a simple application that understand how to implement authentication in your NextJS application using Clerk and only show the data from the database to the authenticated users.

#### The Tech Stack
- [NextJS](https://nextjs.org/) is a framewok built on top of React that is optimized for developer experience by providing all the features required to build powerful and highly interactive applications with no configuration required.

- [Clerk](https://clerk.dev/) is a customer identity platform compatible with popular stacks such as JavaScript, React, NextJS, Ruby, Firebase and others that allows you to implement a strong authentication system in your application by providing pre-built components such as <SignIn />, <SignUp />, and <UserProfile />. Clerk supports multiple authentication strategies such as passwords, magic links, social logins, Web3, multifactor authentication and email + SMS passcodes that you can implement in your application.

- [Prisma Cloud](https://cloud.prisma.io/) is a cloud-based collaborative environment that provides support to developers using [Prisma](https://www.prisma.io/). It provides you with an online data browser that that allows you to easily collaborate on data with your team, a query console, and ability to integrate with your Prisma databases and schema. 

- [Heroku](https://www.heroku.com/) is a cloud platform that allows developers that allows developers to build, run and operate applications.

- [PostgreSQL](https://www.postgresql.org/) is an advanced open-source relational database management system.

### Building an app with Clerk, Prisma Cloud, and NextJS

#### Prerequisites
To follow along in building this app, you need to have the following set up:
- A code editor of your choice.
- [NodeJS](https://nodejs.org/en/download/), [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm), and [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/) installed on your development machine.
- The following accounts:
    * [Clerk](https://dashboard.clerk.dev/?_gl=1*h4f8z7*_ga*NzcwODM4Mzg0LjE2NTc4MTE1Nzk.*_ga_NCD16E224E*MTY1ODAzMjk1OS41LjEuMTY1ODAzNjQyNi42MA..).
    * [Prisma Cloud](https://cloud.prisma.io/).
    * [Heroku](https://signup.heroku.com/).

#### Creating a NextJS Application
The easiest way to create an NextJS application is by using `create-next-app` that sets up everything for you automatically. To create the appplication, run the following command in the terminal:

```bash
yarn create next-app clerk-prisma
```
This application will only contain a navigation bar and and content area. Open `pages/index.js` and replace the existing code with the following:

```js
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <h2>My Tasks</h2>
      </nav>

      <div>
        <p>Sign in to view your tasks!</p>
      </div>
    </div>
  )
}
```

To provide some styling for the application, open `styles/Home.module.css` and replace the existing code with the following:
```css
.container {
  margin: 1rem auto;
  max-width: 760px;
  text-align: center;
}

.nav{
  background: gray;
  padding: .2rem;
}
```

Run the command the folowing command in the terminal to start a development server:
```bash
yarn dev
```
Open http://localhost:3000/ in your browser and you should see the following:

<!-- ![An image showing a website created with NextJS](./nextjs-website.png) -->

#### Adding Clerk
To add Clerk for user authentication in the application, open the [Clerk dashboard](https://dashboard.clerk.dev/) in your browser and create a new application.

<!-- ![An image showing the creation of a new app on the Clerk dashboard](./clerk-new-app.png) -->

Provide the application name and choose the default settings which allow the user to sign in using email and password or use their Google accounts. Click `FINISH` and you will be navigated to your application details page.

> Creating a new application in Clerk automatically creates a new development instance optimized for local application development.

#### Adding Sign up and Sign in Functionality to the Application Using Clerk
In this section, you will add sign up and sign forms, and build a page that is only visible to authenticated users.

Run the following command in your terminal to install Clerk's Next.js SDK that gives you access to various prebuilt components, hooks and other features provided by Clerk.

```bash
yarn add @clerk/nextjs
```
You now need to link your local development with the Clerk instance created when you initialized a new app in Clerk. On your Clerk dashboard [API Keys page](https://dashboard.clerk.dev/last-active?path=api-keys&_gl=1*bszys4*_ga*NzcwODM4Mzg0LjE2NTc4MTE1Nzk.*_ga_NCD16E224E*MTY1ODA0MjUyOS43LjEuMTY1ODA0MzgyMS4xMA..), copy the `Frontend API key` and paste in an `env.local` file in your project root folder as shown below:

```env
NEXT_PUBLIC_CLERK_FRONTEND_API={your_frontend_api_key}
```

Open the terminal to kill the running application by pressing `CTRL+C` or `CMD+C` and relaunch it again with the command below to load the environment variables:

```npx
yarn dev
```

To use the Clerk context in the application, the entire application needs to be wrapped in the <ClerkProvider /> component. To achieve this, open the `pages/_app.js` file and replace the existing content with the following:

```js
import '../styles/globals.css'
import { ClerkProvider } from '@clerk/nextjs'

function MyApp({ Component, pageProps }) {
  return(
    <ClerkProvider {...pageProps}>
      <Component {...pageProps} />
    </ClerkProvider>
  )
}

export default MyApp
```

Its time to add a sign in button and some content for authenticated users. This will be achieved by using some components and a hook provided by Clerk. These are:
- useUser() - This is a hook used to access the current user and state(whether logged in or not).
- <SignInButton /> - displays a Sign in button on the webpage.
- <SignUpButton /> - displays a Sign up button on the webpage.
- <UserButton /> - displays a button for the current user to access his/her profile details.

Learn more about Clerk's components, hooks and helper functions in the [official documentation](https://clerk.dev/docs/component-reference/overview).

Open `pages/index.js` file and replace it with the following code:

```js
import styles from '../styles/Home.module.css'

import { useUser, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";


export default function Home() {
  const { isSignedIn, isLoading, user } = useUser()
  return (
    <div className={styles.container}>

      <nav className={styles.nav}>
        <h2>My Tasks</h2>
        {
          isSignedIn ?

          (<UserButton />) :

          (
            <div>
              <SignInButton />
              <SignUpButton />
            </div>
          )
        }
      </nav>

      <div>
        {
          isLoading ? 

          (<></>) :

          (
            <div>
              {
                isSignedIn ?

                (
                  <div>
                    <p>Welcome {user.firstName}!</p>
                  </div>
                ) :
                (
                  <p>Sign in to view your tasks!</p>
                )
              }
            </div>
          )
        }
      </div>

    </div>
  )
}
```
With the code above, here are the views for signed in and users who have have not signed in:

Signed Out Users:
<!-- ![An image showing the view for users who have not signed in](./signed-out-users-view.png) -->

Signed In Users:
<!-- ![An image showing the view for users who have signed in](./signedin-users-view.png) -->

#### Adding Prisma to the Application
To add Prisma to the application, run the following commands in your terminal:

```bash
yarn add -D prisma

yarn add @prisma/client

npx prisma init
```
The first command installs Prisma as dev dependency amd gives you access to the Prisma CLI. The second command installs Prisma Client which is a query builder and the last command initializes Prisma in your application. Initializing Prisma creates a `prisma` folder with `schema.prisma` file and a `.env` file in the project root folder with the `DATABASE_URL`.

To connect to Prisma Cloud, open https://cloud.prisma.io in your browser and create a new project. On the `Configure project` page, provide a project name, connect your Github account and click the `Create a repository` option. Click `Next` and go to the next page.

<!-- ![An image showing the project configuration page](./configure-project.png) -->

On the `Select template` page, select the `Empty` template option and click `Next`.
<!-- ![An image showing the select template page](./select-template.png) -->

On the `Configure environment` page, click on `Provision a new database`, select `HEROKU PostgreSQL` as the database provider, click `Sign in with Heroku` to connect your Heroku account and click `Create project`. After signing with Heroku, provide a Heroku App name for your application that is globally unique.
<!-- ![An image showing the configure environment page](./configure-environment.png) -->

On the `Deploy project page`, copy the `DATABASE_URL` and `DATABASE_MIGRATE_URL` provided to your local `.env` file and click `DONE`. Replace the already existing content in the `.env` file.
<!-- ![An image showing the deploy project page](./deploy-project.png) -->

#### Creating a Shadow Database Manually
Some prisma command which are used only in development such as `prisma migrate` need a second temporary database that is automatically created and deleted every time time these commands are run. Some databases which are hosted on the cloud only allow you to create databases via the interface. Since the Heroku PostgreSQL is hosted on the cloud, you need to create a shadow database manually and copy the connection string. To learn more about Prisma shadow databases, click [here](https://www.prisma.io/docs/concepts/components/prisma-migrate/shadow-database).

To create the shadow database, open your [Heroku dashboard](https://dashboard.heroku.com/apps), locate the newly created project and open it. Under the `Resources` tab, click on the `Add-ons` search bar and type `Heroku Postgres`. Click on the first option to add the database.
<!-- ![An image showing the Heroku Resources page](./heroku-resource-tab.png)  -->

Note: You will now have two databases as shown below:
<!-- ![An image showing the two databases on Heroku](./heroku-2-dbs.png) -->

Click on the one on top(the one you create manually) to open its details. On the `Settings` tab under `Database Credentials`, click on `View Credentials` and copy the database `URI` which will allow you to connect to the database from your local application.
<!-- ![An image showing the shadow DB details page](./shadow-db-details.png) -->

Open add the `URI` to the `.env` file with the key `SHADOW_DATABASE_URL`.

Your `.env` file should now have the following details:

```env
DATABASE_URL={YOUR DATABASE URL}

DATABASE_MIGRATE_URL={YOUR DATABASE MIGRATE URL}

SHADOW_DATABASE_URL={YOUR SHADOW DATABASE URL}
```

#### Defining a Schema For Your Model
To define a schema for your tasks model, open the `prisma/schema.prisma` file and replace the existing content with the following:

```prisma
datasource db {
  provider = "postgres"
  url      = env("DATABASE_MIGRATE_URL")
  shadowDatabaseUrl = env("SHADOW_DATABASE_URL")
  referentialIntegrity = "prisma"
}

generator client {
  provider = "prisma-client-js"
  previewFeatures = ["referentialIntegrity"]
}

model Tasks {
  id  String  @id @default(cuid())
  task String
}
```
The `datasource db` provides details for connecting to the database for running migrations and querying. Later on when querying, the value for `url` in `database db` will be switched to `env("DATABASE_URL")`. This is because currently, the Data Proxy can only used to query the database with Prisma Client as discussed [here](https://www.prisma.io/docs/data-platform/data-proxy#important-considerations-about-the-data-proxy). The `DATABASE_MIGRATE_URL` contains a direct connection string to the database will be used to run migrations.

The model will only contain two fileds: `id` which represent the task id and `task` will contain the task name.

#### Running the Migrations and Adding Some Data With Prisma
To run the migrations and add the `tasks` table to the database, run the following command in your terminal and provide a name for the new migration: 

```bash
npx prisma migrate dev
```

When the migration runs successfully, you should see this message on the terminal:
<!-- ![An image showing a successful prisma migration](./successful-migration.png) -->

Now that your database is in sync with your schema, you can add some data with Prisma. To do this run the following command in your terminal to open Prisma Studio in your browser:

```bash
npx prisma studio
```

After Prisma Studio loads, select your model to add some data. Add a few tasks as shown below and save the changes.
<!-- ![An image showing Prisma Studio interface](./prisma-add-tasks.png) -->

### Showing the Data to Authenticated Users
Open the `prisma/schema.prisma` file and change the `url` value in the `datasource db` to `env("DATABASE_URL")`. The `prisma/schema.prisma` file should now look like this:

```prisma
datasource db {
  provider = "postgres"
  url      = env("DATABASE_URL")
  shadowDatabaseUrl = env("SHADOW_DATABASE_URL")
  referentialIntegrity = "prisma"
}

generator client {
  provider = "prisma-client-js"
  previewFeatures = ["referentialIntegrity"]
}

model Tasks {
  id  String  @id @default(cuid())
  task String
}
```

Next, you need to fetch the data from the database. This can be achieved by modifying the `pages/index.js` file as shown below:
```js
import styles from '../styles/Home.module.css'

import { useUser, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient

export default function Home({ tasks }) {
  const { isSignedIn, isLoading, user } = useUser()
  return (
    <div className={styles.container}>

      <nav className={styles.nav}>
        <h2>My Tasks</h2>
        {
          isSignedIn ?

          (<UserButton />) :

          (
            <div>
              <SignInButton />
              <SignUpButton />
            </div>
          )
        }
      </nav>

      <div>
        {
          isLoading ? 

          (<></>) :

          (
            <div>
              {
                isSignedIn ?

                (
                  <div>
                    <p>Welcome {user.firstName}!</p>
                    {
                      tasks ? 

                      (
                        tasks.map(task => (
                          <p>{task.task}</p>
                        ))
                      ) :

                      (<div></div>)
                    }
                  </div>
                ) :
                (
                  <p>Sign in to view your tasks!</p>
                )
              }
            </div>
          )
        }
      </div>

    </div>
  )
}

export async function getServerSideProps(){
  const tasks = await prisma.tasks.findMany()
  return {
    props: {
      tasks: tasks
    }
  }
}
```

Open http://localhost:3000/ on your browser and you should be able to see the tasks you just added after logging in.

<!-- ![An image showing the added tasks after logging in](./added-tasks.png) -->

### Conclusion
In this article, you have learned about Clerk,a powerful service that can handle user identity management for you. You have also learned about the various use cases of Clerk, a few of its components and hooks, and how you can integrate it into your NextJS application to easily handle user authentication. Lastly, you have learned how to integrate Prisma into the application, use Prisma Cloud and add some data to your cloud hosted database on Heroku and create a shadow database manually which is a big challenge for some developers.

The full code for the application can be accessed [here]().