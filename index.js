const projectBurg = require('express')
const uuid = require('uuid')
const port = 3000

const api = projectBurg()
api.use(projectBurg.json())

const orders = []

const checkOrderId = (request, response, next) => {
    const { id } = request.params

    const index = orders.findIndex(order => order.id === id)

    if (index < 0) {
        return response.status(404).json("Order id not found!")
    }

    request.orderIndex = index
    request.orderId = id

    next()
}

const methodAndUrl = (request, response, next) => {
    console.log(request.method)
    console.log(request.url)

    next()
}

api.get('/orders', methodAndUrl, (request, response) => {
    return response.json(orders)
})

api.get('/order/:id', checkOrderId, methodAndUrl, (request, response) => {
    const index = request.orderIndex

    const orderConsult = orders[index]

    return response.json(orderConsult)
})

api.post('/order', methodAndUrl, (request, response) => {

    const { order, clientName, price } = request.body

    const createdOrder = { id: uuid.v4(), order, clientName, price, status: "Em preparação" }

    orders.push(createdOrder)

    return response.status(201).json(createdOrder)
})

api.put('/order/:id', checkOrderId, methodAndUrl, (request, response) => {
    const id = request.orderId
    const index = request.orderIndex
    const { order, clientName, price } = request.body

    const updatedOrder = { id, order, clientName, price, status: "Em preparação" }

    orders[index] = updatedOrder

    return response.json(orders)
})

api.patch('/order/:id/', checkOrderId, methodAndUrl, (request, response) => {
    const index = request.orderIndex

    const readyOrder = orders[index]
    readyOrder.status = "Pronto"
    orders[index] = readyOrder

    return response.json(readyOrder)
})

api.delete('/order/:id', checkOrderId, methodAndUrl, (request, response) => {
    const index = request.orderIndex

    orders.splice(index, 1)

    return response.status(204).json("O pedido foi cancelado.")
})

api.listen(port, () => {
    console.log(`Server is starting on port ${port}`)
})