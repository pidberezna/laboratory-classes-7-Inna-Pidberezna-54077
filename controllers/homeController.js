const { MENU_LINKS } = require('../constants/navigation');

const cartController = require('./cartController');

exports.getHomeView = async (request, response) => {
  try {
    const cartCount = await cartController.getProductsCount();

    response.render('home.ejs', {
      headTitle: 'Shop - Home',
      path: '/',
      activeLinkPath: '/',
      menuLinks: MENU_LINKS,
      cartCount,
    });
  } catch (error) {
    console.error('Error rendering home view:', error);
    response.status(500).render('error', {
      headTitle: 'Error',
      message: 'An error occurred while loading the home page',
    });
  }
};
