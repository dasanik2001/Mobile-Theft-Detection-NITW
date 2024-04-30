const checkAuth = {
    isAuthenticated: false,
    tokenKey: 'jwt_token', 
  
    authenticate(result, cb) {

      const token = result
      localStorage.setItem(this.tokenKey, token);
      const expirationTime = Date.now() + 10 * 60 * 1000;
    
      this.isAuthenticated = true;
      cb();
      // const token = 'dummy_token';
      // // const userToken = jwt.sign({ username }, 'your_secret_key');
      // localStorage.setItem(this.tokenKey, token)
      // const expirationTime = Date.now() + 10 * 60 * 1000;
      localStorage.setItem('token_expiration', expirationTime);

      // this.isAuthenticated = true;
      // cb();
    },
  
    signout() {
     
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem('token_expiration');
  
      this.isAuthenticated = false;
      // cb();
    },
  
  
    checkTokenValidity() {
      const token = localStorage.getItem(this.tokenKey);
      const expirationTime = localStorage.getItem('token_expiration');
  
   
      if (!token || !expirationTime) {
        this.isAuthenticated = false;
        return false;
      }
  
      
      if (Date.now() < Number(expirationTime)) {
        this.isAuthenticated = true;
        return true;
      } else {
       
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem('token_expiration');
        this.isAuthenticated = false;
        return false;
      }
    }
  };
  
  export default checkAuth;
  