const User = require('../models/user');
module.exports = (userProps) => {
       const user = new User(userProps);
        return user.save();
}