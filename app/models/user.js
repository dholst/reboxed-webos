User = Class.create({})

User.login = function(username, password, success, failure) {
  Redbox.login(username, password, User.loginSuccess.curry(success), failure)
}

User.loginSuccess = function(success) {
  User.current = new User()
  success()
}

