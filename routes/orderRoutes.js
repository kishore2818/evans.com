import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { protectAdmin } from './authRoutes.js';
import { protect } from './userRoutes.js';
import nodemailer from 'nodemailer';

const router = express.Router();

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD
  }
});

const ADMIN_ORDER_EMAIL = process.env.ADMIN_ORDER_EMAIL || 'kishoreabinash2005@gmail.com';

// @desc    Create new order & Send Email
// @route   POST /api/orders
// @access  Private
router.post('/', protect, async (req, res) => {
  const { items, totalAmount, shippingAddress, paymentStatus } = req.body;

  if (items && items.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  try {
    // ── QUEUE-BASED ATOMIC STOCK VALIDATION & DEDUCTION ──
    const deducted = [];
    let calculatedTotal = 0;

    for (const item of items) {
      const product = await Product.findOneAndUpdate(
        { _id: item.product, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { new: true }
      );

      if (!product) {
        // Restore stock for all previously deducted items
        for (const d of deducted) {
          await Product.findByIdAndUpdate(d.product, { $inc: { stock: d.quantity } });
        }
        const p = await Product.findById(item.product);
        const available = p ? p.stock : 0;
        return res.status(400).json({
          message: `Sorry! Only ${available} unit(s) of "${item.name}" left in stock. Please update your cart.`,
          productId: item.product,
          availableStock: available
        });
      }

      // Verify and fix price from DB
      const dbPrice = product.price * (1 - (product.discountPercentage || 0) / 100);
      item.price = dbPrice; // Update item price to DB price
      calculatedTotal += dbPrice * item.quantity;

      // Increment soldCount
      product.soldCount += item.quantity;
      await product.save();

      deducted.push({ product: item.product, quantity: item.quantity });
    }

    // All stock validated and deducted — create the order
    const order = new Order({
      user: req.user._id,
      items,
      totalAmount: calculatedTotal, // Use calculated total instead of frontend total
      shippingAddress,
      paymentStatus: paymentStatus || 'pending'
    });

    const createdOrder = await order.save();

    const orderedItemsHtml = items.map((item) => `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right;">₹${item.price}</td>
      </tr>
    `).join('');

    // Send Emails
    const emailHtml = `
      <h2>Order Confirmation</h2>
      <p>Thank you for your order, ${shippingAddress.name}!</p>
      <p><strong>Order ID:</strong> ${createdOrder._id}</p>
      <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
      <h3>Shipping Address:</h3>
      <p>${shippingAddress.address}, ${shippingAddress.city} - ${shippingAddress.pincode}</p>
      <p>Phone: ${shippingAddress.phone}</p>
    `;

    const mailOptions = {
      from: `"Evans Luxe Beauty" <${process.env.SMTP_EMAIL}>`,
      to: req.user.email,
      subject: 'Order Confirmation - Evans Luxe Beauty',
      html: emailHtml
    };

    const adminMailOptions = {
      from: `"Evans Luxe Beauty System" <${process.env.SMTP_EMAIL}>`,
      to: ADMIN_ORDER_EMAIL,
      subject: 'New Order Received - Evans Luxe Beauty',
      html: `
        <div style="font-family: Arial, sans-serif; color: #222; line-height: 1.5;">
          <div style="background: #5A2A6C; color: #fff; padding: 18px 24px; border-radius: 14px 14px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">New Order Received</h1>
            <p style="margin: 8px 0 0; color: #f3d36a; font-weight: 700;">A fresh order has been placed on Evans Luxe Beauty.</p>
          </div>

          <div style="border: 1px solid #eee; border-top: 0; padding: 24px; border-radius: 0 0 14px 14px;">
            <h2 style="margin-top: 0; color: #5A2A6C;">Order Summary</h2>
            <p><strong>Order ID:</strong> ${createdOrder._id}</p>
            <p><strong>Total Amount:</strong> ₹${totalAmount}</p>

            <h3 style="margin-top: 24px; color: #5A2A6C;">Shipping Address</h3>
            <p style="margin: 0;">
              ${shippingAddress.name}<br />
              ${shippingAddress.address}<br />
              ${shippingAddress.city} - ${shippingAddress.pincode}<br />
              Phone: ${shippingAddress.phone}
            </p>

            <h3 style="margin-top: 24px; color: #5A2A6C;">Products Ordered</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr>
                  <th style="text-align: left; padding: 10px 0; border-bottom: 2px solid #ddd;">Product</th>
                  <th style="text-align: center; padding: 10px 0; border-bottom: 2px solid #ddd;">Qty</th>
                  <th style="text-align: right; padding: 10px 0; border-bottom: 2px solid #ddd;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${orderedItemsHtml}
              </tbody>
            </table>
          </div>
        </div>
      `
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) console.error('Error sending confirmation email to user', error);
    });
    
    transporter.sendMail(adminMailOptions, (error) => {
      if (error) console.error('Error sending alert email to admin', error);
    });

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: 'Order creation failed', error: error.message });
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Get all orders (Admin only)
// @route   GET /api/orders/admin
// @access  Private (Admin)
router.get('/admin', protectAdmin, async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  try {
    const count = await Order.countDocuments({});
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ orders, page, pages: Math.ceil(count / pageSize), total: count });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private (Admin)
router.get('/:id', protectAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Update order status (with stock restore on cancel / re-deduct on uncancel)
// @route   PUT /api/orders/:id/status
// @access  Private (Admin)
router.put('/:id/status', protectAdmin, async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const previousStatus = order.orderStatus;
    const newStatus = orderStatus || order.orderStatus;

    // ── STOCK RESTORATION ON CANCELLATION ──
    if (newStatus === 'cancelled' && previousStatus !== 'cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.product,
          { $inc: { stock: item.quantity } }
        );
      }
    }

    // ── STOCK RE-DEDUCTION IF ADMIN REVERTS CANCELLATION ──
    if (previousStatus === 'cancelled' && newStatus !== 'cancelled') {
      const reDeducted = [];
      for (const item of order.items) {
        const updated = await Product.findOneAndUpdate(
          { _id: item.product, stock: { $gte: item.quantity } },
          { $inc: { stock: -item.quantity } },
          { new: true }
        );
        if (!updated) {
          // Rollback re-deductions already done
          for (const d of reDeducted) {
            await Product.findByIdAndUpdate(d.product, { $inc: { stock: d.quantity } });
          }
          const product = await Product.findById(item.product);
          return res.status(400).json({
            message: `Cannot reactivate: only ${product?.stock || 0} unit(s) of "${item.name}" available. Check inventory first.`
          });
        }
        reDeducted.push({ product: item.product, quantity: item.quantity });
      }
    }

    order.orderStatus = newStatus;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
