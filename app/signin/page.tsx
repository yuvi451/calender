"use client"
import { useRef } from "react";
import { auth, googleProvider, usersCollection } from "../../config/firebase-config";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth"
import { useRouter } from "next/navigation";
import { addDoc } from "firebase/firestore";

export default function Auth() {
    const email = useRef(null)
    const pass = useRef(null)
    const router = useRouter()

    async function signIn(){
        try{
            //@ts-ignore
            const signin = await signInWithEmailAndPassword(auth, email.current.value, pass.current.value)
            router.push("/")
        } catch (err) {
            alert(err)
        }
    }

    async function signInwithGoogle() {
        try{
            const res = await signInWithPopup(auth, googleProvider)
            const user = res.user

            await addDoc(usersCollection, {
                uid: user.uid,
                //@ts-ignore
                email: user.email, name: user.displayName,
                createdAt: new Date().toLocaleDateString()
            })
            router.push("/")
        } catch (err){
            console.error(err)
        }
    }

    return <div style={{width: 500}} className="div1">
        <input placeholder="Email..." ref={email}></input>
        <input placeholder="Password..." ref={pass} type="password"></input>
        <button onClick={signIn}>SignIn</button>
        <button onClick={signInwithGoogle}>SignIn with Google</button>
        <button onClick={() => router.push("/signup")}>SignUp</button>
    </div>

}


