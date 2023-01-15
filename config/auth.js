module.exports = {
    'facebookAuth' : {
        'clientID'      : '501177410360990', 
        'clientSecret'  : 'd3e9081825029e61d9b41e2ac43dbd71', 
        'callbackURL'   : 'http://localhost:8080/auth/facebook/callback',
        'profileURL'    : 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
        'profileFields' : ['id', 'emails', 'name'] // For requesting permissions from Facebook API
    },
    'googleAuth' : {
        'clientID'      : '1091841965143-ibkr9jmpfuu8r4a0cqc7de06q17ns1gl.apps.googleusercontent.com', 
        'clientSecret'  : 'nGYOBOiKesqnEwQ16W_rlEnE', 
        'callbackURL'   : 'http://localhost:8080/auth/google/callback'
    }
}