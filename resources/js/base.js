//import '../scss/base.scss'

import { createEvent } from 'ics';

const reminderLink = document.getElementById('reminder-link')
if (reminderLink) {
    const date = new Date();

    const event = {
        start: [date.getFullYear(), date.getMonth(), date.getDate() + 1, date.getHours(), date.getMinutes()],
        duration: { minutes: 30 },
        title: 'Kleinanzeigenplattform auschecken',
        description: 'Dies ist dein gesetzter Reminder, um auf Nikos Kleinanzeigenplattform zu schauen, ob es neue Anzeigen gibt! :D',
        location: 'http://localhost:3333',
        url: 'http://localhost:3333',
    }


    const filename = 'KleinanzeigenReminder.ics'
    const file = await new Promise((resolve, reject) => {
        createEvent(event, (error, value) => {
            if (error) {
                reject(error)
            }

            resolve(new File([value], filename, { type: 'text/calendar' }))
        })
    })
    const url = URL.createObjectURL(file);

    reminderLink.href = url;
    reminderLink.download = filename;
}