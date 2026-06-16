"use client"
import { useRef, useEffect } from "react";
import { auth, googleProvider, usersCollection } from "../../config/firebase-config";
import { signInWithEmailAndPassword, signInWithRedirect, getRedirectResult } from "firebase/auth"
import { useRouter } from "next/navigation";
import { addDoc } from "firebase/firestore";

export default function Auth() {
    const email = useRef(null)
    const pass = useRef(null)
    const router = useRouter()

    useEffect(() => {
        getRedirectResult(auth).then(async (result) => {
            if (result) {
                const user = result.user
                await addDoc(usersCollection, {
                    uid: user.uid,
                    email: user.email,
                    name: user.displayName,
                    createdAt: new Date().toLocaleDateString()
                })
                router.push("/")
            }
        }).catch(console.error)
    }, [])

    async function signIn(){
        try{
            //@ts-ignore
            await signInWithEmailAndPassword(auth, email.current.value, pass.current.value)
            router.push("/")
        } catch (err) {
            alert(err)
        }
    }

    async function signInwithGoogle() {
        try{
            await signInWithRedirect(auth, googleProvider)
        } catch (err){
            console.error(err)
        }
    }

    return (
        <div className="auth-card">
            <h2>Sign In</h2>
            <p>Welcome back! Enter your details below.</p>
            <input placeholder="Email" ref={email} type="email" />
            <input placeholder="Password" ref={pass} type="password" />
            <button className="btn-primary" onClick={signIn}>Sign In</button>
            <button className="btn-google" onClick={signInwithGoogle}>Sign In with Google</button>
            <button className="btn-secondary" onClick={() => router.push("/signup")}>Create an Account</button>
        </div>
    )
}
