export const token = state => {
  if(state.user.token && state.user.token.expiresTime){
    if(state.user.token.expiresTime > new Date().getTime()){
      return state.user.token.userToken
    }else{
      return null
    }
  }
}


