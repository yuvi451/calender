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

    return (
        <div className="form-card">
            <h2>Add New Task</h2>
            <div className="form-group">
                <label>Title</label>
                <input placeholder="Task title..." ref={title} />
            </div>
            <div className="form-group">
                <label>Description</label>
                <input placeholder="Short description..." ref={description} />
            </div>
            <div className="form-group">
                <label>Frequency (months)</label>
                <input placeholder="e.g. 1 for monthly, 3 for quarterly..." ref={freq} type="number" />
            </div>
            <div className="form-group">
                <label>Start Date</label>
                <input type="date" ref={startdate} />
            </div>
            <div className="btn-row">
                <button className="btn-primary" onClick={addTask}>Add Task</button>
                <button className="btn-secondary" onClick={() => router.push("/")}>Cancel</button>
            </div>
        </div>
    )
}