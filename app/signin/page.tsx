"use client"
import { useRef, useEffect } from "react";
import { auth, googleProvider, db } from "../../config/firebase-config";
import { signInWithEmailAndPassword, signInWithPopup, onAuthStateChanged } from "firebase/auth"
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";

export default function Auth() {
    const email = useRef(null)
    const pass = useRef(null)
    const router = useRouter()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) router.push("/")
        })
        return () => unsubscribe()
    }, [])

    async function signIn() {
        try {
            //@ts-ignore
            await signInWithEmailAndPassword(auth, email.current.value, pass.current.value)
        } catch (err) {
            alert(err)
        }
    }

    async function signInwithGoogle() {
        try {
            const result = await signInWithPopup(auth, googleProvider)
            const user = result.user
            // setDoc with merge: creates the user doc if new, skips if already exists
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email: user.email,
                name: user.displayName,
                createdAt: new Date().toLocaleDateString()
            }, { merge: true })
        } catch (err: any) {
            alert("Google sign-in failed: " + err.message)
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
