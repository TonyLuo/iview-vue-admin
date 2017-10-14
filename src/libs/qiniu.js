import httpUtil from './httpUtil'

export default
{
  getToken () {
    return JSON.parse(localStorage.getItem('upload_token'))
  },
  hasValidToken () {
    const token = this.getToken();
    return token && token.expires_at && token.expires_at > new Date().getTime()
  },
  getUploadToken () {
    if (this.hasValidToken()) {
      return Promise.resolve(this.getToken())
    }
    return new Promise((resolve, reject) => {
      httpUtil.fetch({
        url: '/qiniu/get-upload-token',
        method: 'get'
      }).then(response => {
        const token = response.data.upload_token;
        const domainName = response.data.domain_name;
        let expiredAt = new Date();
        expiredAt.setSeconds(expiredAt.getSeconds() + response.data.expires_in);
        const uploadToken = {token: token, domain_name: domainName, expires_at: expiredAt.getTime()};
        localStorage.setItem('upload_token', JSON.stringify(uploadToken));
        resolve(uploadToken)
      }).catch(err => {
        reject(err)
      })
    })
  }

}
