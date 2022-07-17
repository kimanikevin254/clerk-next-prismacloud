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
