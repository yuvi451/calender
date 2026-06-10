"use client"
import { auth, usersCollection } from "../../config/firebase-config"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { useRef } from "react"
import { addDoc } from "firebase/firestore" 
import { useRouter } from "next/navigation"

export default function SignUp(){
    const email = useRef(null)
    const password = useRef(null)
    const username = useRef(null)
    const router = useRouter()

    async function signupUser() {
        try{
            //@ts-ignore
            const userCredentials = await createUserWithEmailAndPassword(auth, email.current.value, password.current.value)
            await addDoc(usersCollection, {
                uid: userCredentials.user.uid,
                //@ts-ignore
                email: email.current.value, name: username.current.value,
                createdAt: new Date().toLocaleDateString()
            })

            router.push("/")
        } catch (err){
            alert(err)
        }

    }

    return <div>
        <input placeholder="Name" ref={username}></input>
        <input placeholder="Email..." ref={email}></input>
        <input placeholder="Password..." ref={password} type="password"></input>
        <button onClick={signupUser}>SignUp</button>
    </div>
}