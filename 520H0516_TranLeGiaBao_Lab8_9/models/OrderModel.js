const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId,
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        default: 1, 
    },
});

const OrderSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    products: [ProductSchema], 
    totalPrice: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

OrderSchema.pre('save', async function (next) {
    try {
        // Tính tổng giá của các sản phẩm trong đơn hàng, nhân giá với số lượng
        const products = await this.model('Product').find({ _id: { $in: this.products.map(p => p._id) } });
        const total = products.reduce((acc, product) => {
            const orderProduct = this.products.find(p => p._id.toString() === product._id.toString());
            return acc + product.price * orderProduct.quantity;
        }, 0);

        // Cập nhật trường totalPrice
        this.totalPrice = total;

        next();
    } catch (error) {
        next(error);
    }
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
