import Axios from '../../src/index'
const instance = Axios.create({
  xsrfCookieName: 'XSRF-TOKEN-D',
  xsrfHeaderName: 'X-XSRF-TOKEN-D'
})
instance.get('/xsrf/setCookie').then(res => {
  instance.get('/more/get').then(res => {
    console.log(res)
  })
})
