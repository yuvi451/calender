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

const localizer = momentLocalizer(moment)

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
        newData.forEach((a:any) => myEventsList.push({
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


  return<div>
    <MyCalendar myEventsList={eventList}></MyCalendar>

    <button onClick={() => router.push("/add-task")}>Add Tasks</button>
    <button onClick={signout}>SignOut</button>
  </div>
}