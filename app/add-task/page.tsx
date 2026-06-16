"use client"

import { useRef, useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth, tasksCollection } from "../../config/firebase-config"
import { useRouter } from "next/navigation"
import { addDoc } from "firebase/firestore"

export default function AddTask() {
    const title = useRef(null)
    const description = useRef(null)
    const startdate = useRef(null)
    const freq = useRef(null)
    const router = useRouter()

    const [user, setUser] = useState("")

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
        if (user) {
            const uid = user.uid;
            setUser(uid)
        } else {
            router.push("/signin")
        }
        });
    }, [])

    async function addTask(){
        for(let i = 0; i < 12; i++){
            const date = new Date(startdate.current.value)
            date.setMonth(date.getMonth() + i * Number(freq.current ? freq.current.value: 0))
            await addDoc(tasksCollection, {
                userId: user,
                //@ts-ignore
                title: title.current.value, description: description.current.value, 
                Date: date.toDateString(),
                //@ts-ignore
                isCompleted: false
            })
        }

        router.push("/")
    }

    return <div className="div1">
        <div className="div2">
            Title: <input ref={title}></input>
        </div>
        <div className="div2">
            Description: <input ref={description}></input>
        </div>
        <div className="div2">
            Frequency: <input ref={freq}></input>
        </div>
        <div className="div2">
            Start-Date: <input type="date" ref={startdate}></input>
        </div>
        <button onClick={addTask}>Add Task</button>
    </div>
}