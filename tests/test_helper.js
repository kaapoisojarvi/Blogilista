const Blog = require('../models/blog')
const User = require('../models/user')

initialBlogs = [
    {
      title: "testi10",
      author: "testi10",
      url: "www.testi10.com",
      likes: 15,
    },
    {
      title: "testi2",
      author: "testi2",
      url: "www.testi2.com",
      likes: 6,
    },
  ]

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

module.exports = {
    initialBlogs,
    usersInDb
}