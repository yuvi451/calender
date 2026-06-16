"use client"
import { useEffect, useState } from "react"
import { auth, tasksCollection } from "../config/firebase-config"
import { onAuthStateChanged } from "firebase/auth"
import { useRouter } from "next/navigation"
import { signOut } from "firebase/auth"
import { getDocs } from "firebase/firestore"
import { Calendar, momentLocalizer, View } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment)

// Fully controlled calendar — bypasses the broken uncontrollable wrapper
// that uses deprecated React lifecycle methods incompatible with React 19
function MyCalendar({ myEventsList, isMobile }: { myEventsList: any[], isMobile: boolean }) {
  const [date, setDate] = useState(new Date())
  const [view, setView] = useState<View>(isMobile ? 'agenda' : 'month')

  useEffect(() => {
    setView(isMobile ? 'agenda' : 'month')
  }, [isMobile])

  return (
    <Calendar
      localizer={localizer}
      events={myEventsList}
      startAccessor="start"
      endAccessor="end"
      style={{ height: isMobile ? 450 : 500 }}
      date={date}
      view={view}
      onNavigate={(newDate: Date) => setDate(newDate)}
      onView={(newView: View) => setView(newView)}
      views={['month', 'week', 'agenda']}
    />
  )
}

export default function Home() {
  const [eventList, seteventList] = useState([])
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsMobile(window.innerWidth < 640)
    const onResize = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        const dataSnapshot = await getDocs(tasksCollection)
        const dataList = dataSnapshot.docs.map(a => ({
          id: a.id,
          ...a.data()
        }))
        //@ts-ignore
        const newData = dataList.filter(a => a.userId == uid)

        const myEventsList: any[] = []
        newData.forEach((a:any) => myEventsList.push({
          title: a.title,
          start: new Date(a.Date),
          end: moment(new Date(a.Date)).add(1, 'days').toDate(),
        }))

        seteventList(myEventsList)
        setLoading(false)
      } else {
        router.push("/signin")
      }
    });
    return () => unsubscribe()
  }, [])

  async function signout(){
    try{
      await signOut(auth)
    } catch (err){
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="main-card">
      <div className="page-header">
        <h1>Monthly Tasks</h1>
        <button className="btn-danger" onClick={signout}>Sign Out</button>
      </div>
      <div className="calendar-wrapper">
        <MyCalendar myEventsList={eventList} isMobile={isMobile} />
      </div>
      <div className="btn-row">
        <button className="btn-primary" onClick={() => router.push("/add-task")}>+ Add Task</button>
      </div>
    </div>
  )
}
