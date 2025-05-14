const { getDatabase } = require('../database');
const Product = require('./Product');

const COLLECTION_NAME = 'carts';

class Cart {
  constructor() {}

  static async add(productName) {
    const db = getDatabase();
    try {
      const product = await Product.findByName(productName);

      if (!product) {
        throw new Error(`Product '${productName}' not found.`);
      }

      const cart = await db
        .collection(COLLECTION_NAME)
        .findOne({ cart_id: 'main' });

      if (!cart) {
        await db.collection(COLLECTION_NAME).insertOne({
          cart_id: 'main',
          items: [{ product, quantity: 1 }],
        });
      } else {
        const existingItemIndex = cart.items.findIndex(
          (item) => item.product.name === productName
        );

        if (existingItemIndex >= 0) {
          cart.items[existingItemIndex].quantity += 1;
          await db
            .collection(COLLECTION_NAME)
            .updateOne({ cart_id: 'main' }, { $set: { items: cart.items } });
        } else {
          await db
            .collection(COLLECTION_NAME)
            .updateOne(
              { cart_id: 'main' },
              { $push: { items: { product, quantity: 1 } } }
            );
        }
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
      throw error;
    }
  }

  static async getItems() {
    const db = getDatabase();
    try {
      const cart = await db
        .collection(COLLECTION_NAME)
        .findOne({ cart_id: 'main' });
      return cart ? cart.items : [];
    } catch (error) {
      console.error('Error retrieving cart items:', error);
      return [];
    }
  }

  static async getProductsQuantity() {
    const db = getDatabase();
    try {
      const cart = await db
        .collection(COLLECTION_NAME)
        .findOne({ cart_id: 'main' });

      if (!cart || !cart.items?.length) {
        return 0;
      }

      return cart.items.reduce((total, item) => {
        return total + item.quantity;
      }, 0);
    } catch (error) {
      console.error('Error calculating cart quantity:', error);
      return 0;
    }
  }

  static async getTotalPrice() {
    const db = getDatabase();
    try {
      const cart = await db
        .collection(COLLECTION_NAME)
        .findOne({ cart_id: 'main' });

      if (!cart || !cart.items?.length) {
        return 0;
      }

      return cart.items.reduce((total, item) => {
        return total + item.product.price * item.quantity;
      }, 0);
    } catch (error) {
      console.error('Error calculating cart total price:', error);
      return 0;
    }
  }

  static async clearCart() {
    const db = getDatabase();
    try {
      await db
        .collection(COLLECTION_NAME)
        .updateOne({ cart_id: 'main' }, { $set: { items: [] } });
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }
}

module.exports = Cart;
