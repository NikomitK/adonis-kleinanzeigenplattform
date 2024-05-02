import vine from '@vinejs/vine'

export const lisitingFormValidator = vine.compile(
    vine.object({
        title: vine.string().trim().minLength(5).maxLength(80),
        description: vine.string().trim().maxLength(1000).minLength(50),
        price: vine.number().min(0.00).transform((value) => {
            return value.toFixed(2).toString()
        }),
        shipping_price: vine.number().min(0.00).transform((value) => {
            return value.toFixed(2).toString()
        }).optional(),
    })
)