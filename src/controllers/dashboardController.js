const DashboardController = {
  index(req, res) {
    res.render('dashboard', { title: 'Dashboard', active: 'dashboard' });
  },

  transfer(req, res) {
    res.render('transfer', { title: 'Transfer', active: 'transfer' });
  },
};

module.exports = DashboardController;
