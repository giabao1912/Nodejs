const express = require('express')
const Router = express.Router()
const { validationResult } = require('express-validator')
const CheckLogin = require('../auth/CheckLogin')
const Order = require('../models/OrderModel')
const Product = require('../models/ProductModel')

Router.get('/', CheckLogin, async (req, res) => {
    try {
        const { email } = req.user;

        // Kiểm tra xem email có được cung cấp không
        if (!email) {
            return res.status(400).json({ message: 'Email is required for searching orders' });
        }

        // Tìm đơn hàng có chứa email trong mảng sản phẩm
        const orders = await Order.find({ 'email': email });

        res.json({ code: 0, message: 'Đọc danh sách đơn hàng thành công', data: orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

Router.post('/', CheckLogin, async (req, res) => {
    try {
        const result = validationResult(req);

        if (result.errors.length === 0) {
            // Lấy từ người id và số lượng
            const { products } = req.body;

            // Kiểm tra xem có sản phẩm nào không
            if (!products || products.length === 0) {
                throw new Error('Không có sản phẩm trong đơn hàng');
            }

            // Tạo 1 list chỉ chứa duy nhất id lấy từ JSON
            const productIds = products.map(product => product.id);

            // Kiểm tra trong mongose xem các sản phẩm có tồn tại không
            const productsInDb = await Product.find({ _id: { $in: productIds } });
            if (productsInDb.length !== products.length) {
                throw new Error('Một hoặc nhiều sản phẩm không tồn tại');
            }

            // Tham chiếu sản phẩm đã tìm vào sản phẩm trong Order
            const productsWithQuantity = products.map(product => {
                const foundProduct = productsInDb.find(p => p._id.toString() === product.id);
                return {
                    _id: foundProduct.id,
                    quantity: product.quantity,
                    name: foundProduct.name,
                    price: foundProduct.price
                };
            });

            // Tạo đơn hàng với người dùng
            const newOrder = new Order({
                email: req.user.email, // Assuming email comes from request or elsewhere
                products: productsWithQuantity
            });

            // Lưu đơn hàng vào cơ sở dữ liệu
            await newOrder.save();

            res.json({ code: 1, message: 'Thêm đơn hàng thành công', data: newOrder });
        } else {
            const messages = result.mapped();
            const message = Object.values(messages)[0];

            res.json({ code: 1, message: message });
        }
    } catch (error) {
        res.json({ code: 0, message: error.message });
    }
})

Router.get('/:id', CheckLogin, (req, res) => {
    let { id } = req.params
    if (!id) {
        return res.json({ code: 1, message: 'Không có thông tin đơn hàng' })
    }
    Order.findById(id)
        .then(p => {
            if (p) {
                return res.json({ code: 0, message: 'Đã tìm thấy đơn hàng', data: p })
            }
            else return res.json({ code: 2, message: 'Không tìm thấy đơn hàng' })
        })
        .catch(e => {
            if (e.message.includes('Cast to ObjectId failed')) {
                return res.json({ code: 3, message: 'Đây không phải là một id hợp lệ' })
            }
        })
})

Router.delete('/:id', CheckLogin, (req, res) => {
    let { id } = req.params
    if (!id) {
        return res.json({ code: 1, message: 'Không có thông tin mã đơn hàng' })
    }
    Order.findByIdAndDelete(id)
        .then(p => {
            if (p) {
                return res.json({ code: 0, message: 'Đã xóa đơn hàng', data: p })
            }
            else return res.json({ code: 2, message: 'Không tìm thấy đơn hàng' })
        })
        .catch(e => {
            if (e.message.includes('Cast to ObjectId failed')) {
                return res.json({ code: 3, message: 'Đây không phải là một id hợp lệ' })
            }
        })
})

Router.put('/:id', CheckLogin, async (req, res) => {
    const orderId = req.params.id;
    const { products } = req.body;

    try {
        // Kiểm tra xem có sản phẩm nào không
        if (!products || products.length === 0) {
            throw new Error('Không có sản phẩm trong đơn hàng');
        }

        // Tạo 1 list chỉ chứa duy nhất id lấy từ JSON
        const productIds = products.map(product => product.id);

       // Kiểm tra trong mongose xem các sản phẩm có tồn tại không
        const productsInDb = await Product.find({ _id: { $in: productIds } });
        if (productsInDb.length !== products.length) {
            throw new Error('Một hoặc nhiều sản phẩm không tồn tại');
        }

        // Tham chiếu sản phẩm đã tìm vào sản phẩm trong Order
        const productsWithQuantity = products.map(product => {
            const foundProduct = productsInDb.find(p => p._id.toString() === product.id);
            return {
                _id: foundProduct.id,
                quantity: product.quantity,
                name: foundProduct.name,
                price: foundProduct.price
            };
        });

        // Tìm id của order 
        const orderToUpdate = await Order.findById(orderId);

        // Cập nhật sản phẩm mới trong order
        orderToUpdate.products = productsWithQuantity;

        // Cập nhật đơn hàng vào cơ sở dữ liệu
        const updatedOrder = await orderToUpdate.save();

        res.json({ code: 1, message: 'Cập nhật đơn hàng thành công', data: updatedOrder });
    } catch (error) {
        res.json({ code: 0, message: error.message });
    }
});

module.exports = Router