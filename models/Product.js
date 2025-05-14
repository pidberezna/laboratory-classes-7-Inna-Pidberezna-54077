const { getDatabase } = require('../database');

const COLLECTION_NAME = 'products';

class Product {
  constructor(name, description, price) {
    this.name = name;
    this.description = description;
    this.price = price;
  }

  static async getAll() {
    const db = getDatabase();
    try {
      return await db.collection(COLLECTION_NAME).find().toArray();
    } catch (error) {
      console.error('Error retrieving products:', error);
      return [];
    }
  }

  static async add(product) {
    const db = getDatabase();
    try {
      const existingProduct = await db
        .collection(COLLECTION_NAME)
        .findOne({ name: product.name });
      if (existingProduct) {
        return await db
          .collection(COLLECTION_NAME)
          .updateOne({ name: product.name }, { $set: product });
      } else {
        return await db.collection(COLLECTION_NAME).insertOne(product);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  }

  static async findByName(name) {
    const db = getDatabase();
    try {
      return await db.collection(COLLECTION_NAME).findOne({ name: name });
    } catch (error) {
      console.error(`Error finding product with name ${name}:`, error);
      return null;
    }
  }

  static async deleteByName(name) {
    const db = getDatabase();
    try {
      return await db.collection(COLLECTION_NAME).deleteOne({ name: name });
    } catch (error) {
      console.error(`Error deleting product with name ${name}:`, error);
      throw error;
    }
  }

  static async getLast() {
    const db = getDatabase();
    try {
      const products = await db
        .collection(COLLECTION_NAME)
        .find()
        .sort({ _id: -1 })
        .limit(1)
        .toArray();

      return products.length > 0 ? products[0] : null;
    } catch (error) {
      console.error('Error retrieving last product:', error);
      return null;
    }
  }
}

module.exports = Product;
