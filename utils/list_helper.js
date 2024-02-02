
const dummy = (blogs) => {
    return 1
  }

const totalLikes = (blogs) => {
  var totalLikes = 0
  blogs.forEach(element => {
    totalLikes += element.likes;
  })
  return totalLikes
}

const favouriteBlog = (blogs) => {
  if (blogs.length == 0){
    return 0
  }

  const favourite = blogs.reduce(function(prev, current) {
    return (prev && prev.likes > current.likes) ? prev : current
})

  return {
    title: favourite.title,
    author: favourite.author,
    likes: favourite.likes
  }
}

const mostLikes = (blogs) => {
  if (blogs.length == 0){
    return 0
  }

  const authors = new Map()

  blogs.forEach(blog => {

    const author = blog.author
    const likes = blog.likes

    if (authors.has(author)){
      authors.set(author,authors.get(author) + likes)
    }else{
      authors.set(author,likes)
    }
  })

  const favourite = [...authors.entries()].reduce(function(prev, current) {
    return (prev[1] > current[1]) ? prev : current
  })

  return {
    author: favourite[0],
    likes: favourite[1]
  }
}
  
module.exports = {
   dummy,
   totalLikes,
   favouriteBlog,
   mostLikes
}