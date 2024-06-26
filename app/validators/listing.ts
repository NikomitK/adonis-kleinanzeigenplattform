import vine from '@vinejs/vine'

export const lisitingFormValidator = vine.compile(
    vine.object({
        title: vine.string().trim().minLength(4).maxLength(80),
        description: vine.string().trim().maxLength(1000).minLength(10),
        price: vine.number().min(0.00).transform((value) => {
            return value.toFixed(2).toString()
        }),
        shipping_price: vine.number().min(0.00).transform((value) => {
            return value.toFixed(2).toString()
        }).optional(),
        
    })
)

export const singleImageValidator = vine.compile(
    vine.object({
        images: vine.file({
            size: '10mb',
            extnames: ['jpg', 'png', 'jpeg', 'webp']
        })
    })
)

export const multipleImageValidator = vine.compile(
    vine.object({
        images: vine.array(
            vine.file({
                size: '10mb',
                extnames: ['jpg', 'png', 'jpeg', 'webp']
            })
        )
    })
)