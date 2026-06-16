"use client"
import { useRef, useEffect } from "react";
import { auth, googleProvider, usersCollection } from "../../config/firebase-config";
import { signInWithEmailAndPassword, signInWithRedirect, getRedirectResult, onAuthStateChanged } from "firebase/auth"
import { useRouter } from "next/navigation";
import { addDoc } from "firebase/firestore";

export default function Auth() {
    const email = useRef(null)
    const pass = useRef(null)
    const router = useRouter()

    useEffect(() => {
        // Redirect to home if already signed in (catches redirect result too)
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) router.push("/")
        })

        // Save Google user profile after redirect, then let onAuthStateChanged handle nav
        getRedirectResult(auth).then(async (result) => {
            if (result) {
                try {
                    await addDoc(usersCollection, {
                        uid: result.user.uid,
                        email: result.user.email,
                        name: result.user.displayName,
                        createdAt: new Date().toLocaleDateString()
                    })
                } catch (_) {}
            }
        }).catch((err) => alert("Google sign-in error: " + err.message))

        return () => unsubscribe()
    }, [])

    async function signIn(){
        try{
            //@ts-ignore
            await signInWithEmailAndPassword(auth, email.current.value, pass.current.value)
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
