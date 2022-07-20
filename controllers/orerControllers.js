const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const Order = require("../models/orderSchema");
const ErroHandler = require("../utils/errorHandler");
const Product = require("../models/productSchema")


const order = {}

order.newOrder = catchAsyncErrors(async (req, res, next) => {
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body;


    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
    })

    res.status(201).json({ suc: true, msg: "order created successfully", order })

})

// get single order 
order.getsingleOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email avatar")
    if (!order) {
        return next(new ErroHandler("order not found with this id", 404))
    }
    res.status(200).json({ suc: true, order })
})

// myorder
order.myorders = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.find({ user: req.user._id })

    res.status(200).json({ suc: true, order })
})

// admin
order.getAllorders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find()

    let totalAmount = 0;
    orders.forEach((order) => {
        totalAmount += order.totalPrice
    })

    res.status(200).json({ suc: true, totalAmount, orders })
})



//update order status
order.updateOrderStatus = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id)
 
    if (order.orderStatus === "Delivered") {
        return next(new ErroHandler("You have already delivered this product!", 404))
    }

    order.orderItems.forEach(async (orders) => {
        await updateStock(orders.product, orders.quantity)
    })

    order.orderStatus = req.body.orderStatus

    if (req.body.orderStatus === "Delivered") {
        order.deliveredAt = Date.now()
    }

    await order.save()

    res.status(201).json({ suc: true, msg: "order status udpated successfully" })

})

async function updateStock(id, quantity) {

    const product = await Product.findById(id)
 
    product.stock -= quantity

    await product.save()
}

// delete order

order.deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id)
    if (!order) {
        return next(new ErroHandler("order not found with this id", 404))
    }
    await order.remove()
    res.status(200).json({ suc: true, msg: "delete order successfully" })
})




module.exports = order