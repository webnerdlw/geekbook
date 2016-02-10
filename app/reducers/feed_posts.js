import { Map, fromJS } from 'immutable'

const defaultState = fromJS({
  posts: [],
  user_list: []
})

function replacePost(newPost, state) {
  let index = state.get('posts').findIndex(value => {
    return value.get('id') === newPost.get('id')
  })
  return state.setIn(['posts', index], newPost)
}

export default (state = defaultState, action) => {
  let post

  switch(action.type) {
    case 'fetchPosts':
      return fromJS(action.result.data.user)
    case 'createPost':
      post = fromJS(action.result.data.createPost)
      return state.updateIn(['posts'], posts => (
        posts.unshift(post)
      ))
    case 'addLike_REQUEST':
      post = Map(action.post)
      post = post.withMutations(map => {
        map.set('likes', post.get('likes') + 1).
          set('user_likes', post.get('user_likes').concat(action.user_id))
      })
      return replacePost(post, state)
    case 'addLike':
      let likedPost = fromJS(action.result.data.likePost)
      return replacePost(likedPost, state)
    case 'removeLike_REQUEST':
      post = fromJS(action.post)
      post = post.withMutations(map => {
        map.set('likes', post.get('likes') - 1).
          set('user_likes', post.get('user_likes').filterNot(id => id === action.user_id))
      })
      return replacePost(post, state)
    case 'removeLike':
      let unlikedPost = fromJS(action.result.data.unlikePost)
      return replacePost(unlikedPost, state)
    default:
      return state
  }
}
