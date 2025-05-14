const Product = require('../models/Product');

const { MENU_LINKS } = require('../constants/navigation');
const { STATUS_CODE } = require('../constants/statusCode');

const cartController = require('./cartController');

exports.getProductsView = async (request, response) => {
  try {
    const cartCount = await cartController.getProductsCount();
    const products = await Product.getAll();

    response.render('products.ejs', {
      headTitle: 'Shop - Products',
      path: '/',
      menuLinks: MENU_LINKS,
      activeLinkPath: '/products',
      products,
      cartCount,
    });
  } catch (error) {
    console.error('Error rendering products view:', error);
    response.status(500).render('error', {
      headTitle: 'Error',
      message: 'An error occurred while loading the products page',
    });
  }
};

exports.getAddProductView = async (request, response) => {
  try {
    const cartCount = await cartController.getProductsCount();

    response.render('add-product.ejs', {
      headTitle: 'Shop - Add product',
      path: '/add',
      menuLinks: MENU_LINKS,
      activeLinkPath: '/products/add',
      cartCount,
    });
  } catch (error) {
    console.error('Error rendering add product view:', error);
    response.status(500).render('error', {
      headTitle: 'Error',
      message: 'An error occurred while loading the add product page',
    });
  }
};

exports.getNewProductView = async (request, response) => {
  try {
    const cartCount = await cartController.getProductsCount();
    const newestProduct = await Product.getLast();

    response.render('new-product.ejs', {
      headTitle: 'Shop - New product',
      path: '/new',
      activeLinkPath: '/products/new',
      menuLinks: MENU_LINKS,
      newestProduct,
      cartCount,
    });
  } catch (error) {
    console.error('Error rendering new product view:', error);
    response.status(500).render('error', {
      headTitle: 'Error',
      message: 'An error occurred while loading the new product page',
    });
  }
};

exports.getProductView = async (request, response) => {
  try {
    const cartCount = await cartController.getProductsCount();
    const name = request.params.name;

    const product = await Product.findByName(name);

    if (!product) {
      return response.status(STATUS_CODE.NOT_FOUND).render('404', {
        headTitle: 'Product Not Found',
        menuLinks: MENU_LINKS,
        activeLinkPath: '',
        cartCount,
      });
    }

    response.render('product.ejs', {
      headTitle: 'Shop - Product',
      path: `/products/${name}`,
      activeLinkPath: `/products/${name}`,
      menuLinks: MENU_LINKS,
      product,
      cartCount,
    });
  } catch (error) {
    console.error('Error rendering product view:', error);
    response.status(500).render('error', {
      headTitle: 'Error',
      message: 'An error occurred while loading the product page',
    });
  }
};

exports.deleteProduct = async (request, response) => {
  try {
    const name = request.params.name;
    await Product.deleteByName(name);

    response.status(STATUS_CODE.OK).json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    response
      .status(500)
      .json({ success: false, message: 'Error deleting product' });
  }
};
