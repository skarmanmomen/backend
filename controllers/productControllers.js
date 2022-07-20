const Product = require("../models/productSchema")
const ErroHandler = require("../utils/errorHandler")
const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const ApiFeatures = require("../utils/ApiFeatures")


// scaffolding
const product = {}

// createProduct admin
product.createProduct = catchAsyncErrors(async (req, res, next) => {
    req.body.user = req.user._id;
    const product = await Product.create(req.body)
    res.status(201).json({ suc: true, product })
})


// prouduct udpate admin
product.updateProduct = catchAsyncErrors(async (req, res, next) => {

    let product = await Product.findById(req.params.id)
    if (!product) {
        return next(new ErroHandler("product not found!", 404))
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })

    res.status(201).json({ suc: true, product, msg: "product updated successfuly" })
})

// product delete admin
product.deleteProduct = catchAsyncErrors(async (req, res, next) => {

    let product = await Product.findById(req.params.id)
    if (!product) {
        return next(new ErroHandler("product not found!", 404))
    }
    await product.remove()
    res.status(200).json({ suc: true, msg: "product deleted successfully" })
}
)
// get all product 
product.getAllProducts = catchAsyncErrors(async (req, res, next) => {

    const resultPerPage = 5;
    const productCount = await Product.countDocuments()

    const apiFeatures = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter()
        .pagination(resultPerPage)

    const products = await apiFeatures.query
    res.status(200).json({ suc: true, productCount, products })
})

// get single product deatails
product.getSingleProduct = catchAsyncErrors(async (req, res, next) => {

    let product = await Product.findById(req.params.id)
    if (!product) {
        return next(new ErroHandler("product not found!", 404))
    }

    res.status(200).json({ suc: true, product })

})



//create reviews or already review
product.createReview = catchAsyncErrors(async (req, res, next) => {
    const { comment, rating, productId } = req.body;
    if (!productId) {
        return next(new ErroHandler("product is is required!", 404))
    }

    const review = {
        user: req.user.id,
        comment,
        rating: Number(rating)
    }

    const product = await Product.findById(productId)



    const isReviewed = product.reviews.find(
        (rev) => rev.user.toString() === req.user._id.toString()
    );

    console.log(isReviewed)
    if (isReviewed) {

        product.reviews.forEach((rev) => {
            if (rev.user.toString() === req.user.id.toString()) {
                rev.comment = comment;
                rev.rating = rating
            }
        });

    }
    else {
        product.reviews.push(review)
        product.numOfreviews = product.reviews.length;
    }

    //avg
    let avg = 0;

    product.reviews.forEach((rev) => {
        avg += rev.rating
    })

    product.ratings = avg / product.reviews.length;


    await product.save()
    res.status(201).json({ suc: true, msg: "review added successfully" })


})

// reviews
product.getAllReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id)

    if (!product) {
        return next(new ErroHandler("product not found!", 404))
    }

    res.status(200).json({ suc: true, reviews: product.reviews })
})


//  delete review
product.deleteReview = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.productId)
    if (!product) {
        return next(new ErroHandler("product not found!", 404))
    }

    const reviews = product.reviews.filter(rev => rev._id.toString() !== req.query.id)
    let avg = 0;

    reviews.forEach(rev => avg += rev.rating)

    const ratings = avg / reviews.length
    const numOfreviews = reviews.length

    await Product.findByIdAndUpdate(req.query.productId, { reviews, ratings, numOfreviews }, { new: true })

    res.status(201).json({ suc: true, msg: "review deleted successfulyl" })

})


module.exports = product