login User
Steps:

Create User:

enter email and password
salt/hash user password
store user into database
return success
Login

find user by request email value
if found compare passwords
passwords good send JSON Web Token

Json web token dea authorization kora hoise 

add token expire time

add refresh token
access token e unauthorize paile tokhon refresh token dea notun arekta access token generate kore felbo

two ways to get red of unauthorized
1.Login again with email and pass
2.Login using refresh token

access token expire hoe gele access token dea refresh token generate kore kaj korte hoy
login korar smy je acces token generate hoy seta header er moddhe dhukay profile show korte hoy