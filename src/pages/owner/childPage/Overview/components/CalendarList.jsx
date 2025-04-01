import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar';
import { createEventsServicePlugin } from '@schedule-x/events-service';
import React, { useEffect, useState } from 'react'
import styles from './CalendarList.module.scss';
import '@schedule-x/theme-default/dist/index.css'
export default function CalendarList() {

    const eventsService = useState(() => createEventsServicePlugin())[0]
 
    const calendar = useCalendarApp({
    views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
    events: [
      {
        id: '1',
        title: 'Event 1',
        start: '2025-03-24 04:50',
        end: '2025-03-24 06:50',
      },{
        id: '2',
        title: 'Event 2',
        start: '2025-03-24 05:00',
        end: '2025-03-24 07:50',
      },
      {
        id: '3',
        title: 'Event 3',
        start: '2025-03-24 05:10',
        end: '2025-03-24 11:50',
      },
      {
        id: '4',
        title: 'Event 4',
        start: '2025-03-24 04:00',
        end: '2025-03-24 12:50',
      },
    ],
    plugins: [eventsService]
  })
 
  useEffect(() => {
    // get all events
    eventsService.getAll()
  }, [])
 
  return (
    <div className={styles.calendarContainer}>
      <ScheduleXCalendar  calendarApp={calendar} />
    </div>
  )
}