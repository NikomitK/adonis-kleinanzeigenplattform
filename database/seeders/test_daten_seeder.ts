import Image from '#models/image'
import Listing from '#models/listing'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await User.createMany([
        {
            username: 'nikomitk',
            firstname: 'Nikolas',
            lastname: 'Bodenmüller',
            email: 'inf22023@lehre.dhbw-stuttgart.de',
            password: 'test',
            picture: 'nikomitk.webp',
            number: null
        },
        {
            username: 'buegelbrett',
            email: 'buegel@brett.de',
            password: 'test',
            picture: 'buegelbrett.jpg'
        },
        {
            username: 'asdfkeinplan',
            email: 'test@test.com',
            password: 'test',
            picture: 'default.png'
        }
    ])

    await Listing.createMany([
        {
            username: 'nikomitk',
            title: 'Gniesbert',
            description: 'Mein scheiss Hund Gniesbert ist schon wieder in meinen Gaming pc geklettert, weshalb ich ihn verkaufen muss. Er ist 3 Jahre alt und hat schon 2 mal meinen Gaming pc zerstört. Ich verkaufe ihn für 999999€. Versand ist möglich, er läuft dann zu dir.',
            price: '9999',
            negotiable: false,
            shipping: true,
            shipping_price: '0',
            status: 'active'
        },
        {
            username: 'buegelbrett',
            title: 'Mich',
            description: 'Ich bin ein Bügelbrett. Ich bin 1 Jahr alt und habe schon 1000 Hemden gebügelt. Ich bin sehr gut erhalten und habe keine Gebrauchsspuren. Ich verkaufe mich für 100€. Versand ist möglich.',
            price: '0',
            negotiable: false,
            shipping: false,
            status: 'active'
        },
        {
            username: 'nikomitk',
            title: 'Fast neues Auto',
            description: 'Hat ein paar kleine Kratzer und Dellen, aber das ist der Charakterdes Autos.',
            price: '10',
            status: 'active'
        },
        {
            username: 'buegelbrett',
            title: 'Alles',
            description: 'Ich verkaufe alles was existiert.',
            price: '66.6',
            status: 'active',
        },
        {
            username: 'buegelbrett',
            title: 'Applegoogle',
            description: 'ApplegoogleApplegoogleApplegoogleApplegoogleApplegoogleApplegoogleApplegoogle',
            price: '8',
            status: 'active'
        },
        {
            username: 'asdfkeinplan',
            title: 'bwl präsentation',
            description: 'schwibke wibke',
            price: '3.00',
            status: 'active'
        }
    ])
    
    await Image.createMany([
        {path: 'gniesbert.webp', listing_id: 1},
        {path: 'sven.webp', listing_id: 2},
        {path: 'auto.webp', listing_id: 3},
        {path: 'alles.webp', listing_id: 4},
        {path: 'apple-google.webp', listing_id: 5},
        {path: 'bwl1.webp', listing_id: 6},
        {path: 'bwl2.webp', listing_id: 6},
        {path: 'bwl3.webp', listing_id: 6},
        {path: 'bwl4.webp', listing_id: 6},
        {path: 'bwl5.webp', listing_id: 6},
        {path: 'bwl6.webp', listing_id: 6},
        {path: 'bwl7.webp', listing_id: 6}
    ])
  }
}