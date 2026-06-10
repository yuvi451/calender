"use client"
import { useEffect, useState } from "react"
import { auth, tasksCollection, db } from "../config/firebase-config"
import { onAuthStateChanged } from "firebase/auth"
import { useRouter } from "next/navigation"
import { signOut } from "firebase/auth"
import { getDocs, updateDoc, doc } from "firebase/firestore"
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { title } from "process"

const localizer = momentLocalizer(moment)

const myEventsList = [
  {
    title: 'Team Meeting',
    start: new Date(), // Starts right now
    end: new Date(moment().add(1, 'hours').toDate()), // Ends in 1 hour
  },
  {
    title: 'Lunch Break',
    start: new Date(moment().add(2, 'days').toDate()), 
    end: new Date(moment().add(2, 'days').add(1, 'hours').toDate()), 
  }
];

const MyCalendar = ({myEventsList}: any) => (
  <div>
    <Calendar
      localizer={localizer}
      events={myEventsList}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
    />
  </div>
)

export default function Home() {
  const [eventList, seteventList] = useState([])
  const router = useRouter()

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        const dataSnapshot = await getDocs(tasksCollection)
        const dataList = dataSnapshot.docs.map(a => ({
          id: a.id,
          ...a.data()
        }))
        //@ts-ignore
        const newData = dataList.filter(a => a.userId == uid)
        
        const myEventsList = []
        newData.forEach(a => myEventsList.push({
          title: a.title,
          start: new Date(a.Date),
          end: moment(new Date(a.Date)).add(1, 'days').toDate(),
        }))
        
        seteventList(myEventsList)
      } else {
        router.push("/signin")
      }
    });
  }, [])

   async function signout(){
        try{
            await signOut(auth)
        } catch (err){
            console.error(err)
        }
    }

  async function check(id) {
    const updatedTasks = tasks.map(ele => {
      if (ele.id === id) {
        return { ...ele, isCompleted: true }
      }
      return ele;
    });
    
    // Update the UI immediately
    const p =  doc(db, "tasks", id)
    await updateDoc(p, {
      isCompleted: true
    })

    setTasks(updatedTasks);
  }

  return<div>
    <MyCalendar myEventsList={eventList}></MyCalendar>
    {/* {tasks.map(a => <div>
      {a?.title} : {a.Date}
      {a.isCompleted ? <input type="checkbox" checked disabled></input>: <input type="checkbox" onClick={() => check(a.id)}></input>} 
      </div>)} */}
    <button onClick={() => router.push("/add-task")}>Add Tasks</button>
    <button onClick={signout}>SignOut</button>
  </div>
}