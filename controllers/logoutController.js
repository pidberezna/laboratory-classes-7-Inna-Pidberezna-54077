const { LOGOUT_LINKS } = require('../constants/navigation');
const logger = require('../utils/logger');

const cartController = require('./cartController');

exports.getLogoutView = async (request, response) => {
  try {
    const cartCount = await cartController.getProductsCount();

    response.render('logout.ejs', {
      headTitle: 'Shop - Logout',
      path: '/logout',
      activeLinkPath: '/logout',
      menuLinks: LOGOUT_LINKS,
      cartCount,
    });
  } catch (error) {
    console.error('Error rendering logout view:', error);
    response.status(500).render('error', {
      headTitle: 'Error',
      message: 'An error occurred while loading the logout page',
    });
  }
};

exports.killApplication = (request, response) => {
  logger.getProcessLog();
  process.exit();
};
