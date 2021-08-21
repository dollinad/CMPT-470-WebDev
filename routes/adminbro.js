const User = require('../models/user');
const AdminBroMongoose = require('@admin-bro/mongoose')
const AdminBro = require('admin-bro')
const AdminBroExpressjs = require('@admin-bro/express')

AdminBro.registerAdapter(AdminBroMongoose)

const adminBro = new AdminBro ({
    resources: [User],
    rootPath: '/admin',
    dashboard: {
        component: AdminBro.bundle('../views/adminDashboard')
      },
})


const ADMIN = {
    email: process.env.ADMIN_EMAIL || 'admin',
    password: process.env.ADMIN_PASSWORD || 'password'
}

const router = AdminBroExpressjs.buildAuthenticatedRouter(adminBro, {
    authenticate: async (email, password) => {
        if (ADMIN.password === password && ADMIN.email === email) {
        return ADMIN
        }
        return null
    },
    cookieName: 'admin-bro',
    cookiePassword: 'somepassword',
});


module.exports = router;