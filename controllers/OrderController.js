import OrderModel from "../models/Orders.js";


export const createOrder =  async (req, res) => {
    try {
        const doc = new OrderModel({
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            phone: req.body.phone,
            price : req.body.price,
            time: req.body.time,
            status: req.body.status,
            orders: req.body.orders,
            number: req.body.number,
        })
        const order = await doc.save()
        res.json(order)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось выполнить заявку на покупку'
        })
    }
}