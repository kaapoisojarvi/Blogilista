const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()
})

describe('When there is initially some blogs saved', () => {
  describe('GET requests', () => {
    test('There is correct amount of blogs returned', async () => {
      const response = await api.get('/api/blogs')
      expect(response.type).toBe('application/json')
      expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('Unique blog identifier is id', async () => {
      const response = await api.get('/api/blogs')
      expect(response.body[0].id).toBeDefined()
    })
  })

  describe('POST requests', () => {
    test('New blogs are added to the database', async () => {
      const newBlog = {
        title: "testi2",
        author: "testi2",
        url: "www.testi2.com",
        likes: 5,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const response = await api.get('/api/blogs')

      const contents = response.body.map(r => r.title)

      expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
      expect(contents).toContain('testi2')
    })

    test('Blog is added correctly with likes value 0', async () => {
      const newBlog = {
        title: "testi3",
        author: "testi3",
        url: "www.testi3.com",
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const response = await api.get('/api/blogs')

      const contents = response.body.map(r => r.likes)

      expect(response.body).toHaveLength(helper.initialBlogs.length + 1)

      expect(contents).toContain(0)
    })

    test('Blog without title is not added', async () => {
      const newBlog = {
        author: "testi4",
        url: "www.testi4.com",
        likes: 1,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    })

    test('Blog without url is not added', async () => {
      const newBlog = {
        title: "testi5",
        author: "testi5",
        likes: 1,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    })
  })

  describe('DELETE requests', () => {
    test('Blog is deleted correctly', async () => {
      const response = await api.get('/api/blogs')
      const blogToDelete = response.body[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const responseAfterDelete = await api.get('/api/blogs')

      const contents = responseAfterDelete.body.map(r => r.title)

      expect(responseAfterDelete.body).toHaveLength(helper.initialBlogs.length - 1)
      expect(contents).not.toContain(blogToDelete.title)
    })
  })

  describe('PUT requests', () => {
    test('Blog is updated correctly', async () => {
      const response = await api.get('/api/blogs')
      const blogToUpdate = response.body[0]

      const updatedBlog = {
        title: "testi10",
        author: "testi10",
        url: "www.testi10.com",
        likes: 100,
      }

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      
      responseAfterUpdate = await api.get('/api/blogs')

      contents = responseAfterUpdate.body.map(r => r.likes)

      expect(contents).toContain(100)
    })
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})