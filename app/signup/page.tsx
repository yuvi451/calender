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

    return (
        <div className="auth-card">
            <h2>Create Account</h2>
            <p>Sign up to track your monthly tasks.</p>
            <input placeholder="Name" ref={username} />
            <input placeholder="Email" ref={email} type="email" />
            <input placeholder="Password" ref={password} type="password" />
            <button className="btn-primary" onClick={signupUser}>Sign Up</button>
        </div>
    )
}