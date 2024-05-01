import vine from '@vinejs/vine'

function trimPrice(value: number) {

}

export const lisitingFormValidator = vine.compile(
    vine.object({
        title: vine.string().minLength(5).maxLength(80),
        description: vine.string().minLength(10).maxLength(500),
        price: vine.number().min(0.00).transform((value) => {
            return value.toFixed(2).toString()
        }),
        shipping_price: vine.number().min(0.00).transform((value) => {
            return value.toFixed(2).toString()
        }),
    })
)