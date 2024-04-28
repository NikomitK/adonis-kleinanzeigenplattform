import Achievment from '#models/achievment'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
    async run() {
        await Achievment.createMany([
            {
                title: 'Erstverkäufer',
                description: 'Stelle ein erstes Produkt zum Verkauf ein.',
                icon: 'Erstverkaeufer'
            },
            {
                title: 'Schriftsteller',
                description: 'Veröffentliche eine Anzeige, deren Beschreibung über 100 Zeichen lang ist.',
                icon: 'Schriftsteller'
            },
            {
                title: 'Anzeigen-veteran',
                description: 'Veröffentliche 20 Anzeigen.',
                icon: 'Anzeigenveteran'
            },
            {
                title: 'Gesprächs-Enthusiast',
                description: 'Schreibe 50 Nachrichten.',
                icon: 'Gespraechsenthusiast'
            },
            {
                title: 'Treuer Nutzer',
                description: 'Stelle über ein Jahr nach deiner Registrierung eine Anzeige ein.',
                icon: 'Treuer_Nutzer'
            }
        ])
    }
}