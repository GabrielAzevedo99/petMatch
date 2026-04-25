// ===== REGEX SENHA =====

const senhaRegex =
/^(?=.*[!@#$%^&*]).{6,}$/;

// ===== CADASTRO =====

const cadastroForm =
document.getElementById("cadastroForm");

if (cadastroForm) {

cadastroForm.addEventListener(
"submit",
function(e){

e.preventDefault();

const email =
document.getElementById("email").value;

const login =
document.getElementById("login").value;

const senha =
document.getElementById("senha").value;

if (!senhaRegex.test(senha)) {

alert(
"Senha deve ter 6+ caracteres e 1 especial"
);

return;

}

// salvar usuário
const usuario = {
email,
login,
senha
};

localStorage.setItem(
`user-${login}`,
JSON.stringify(usuario)
);

alert("Cadastro realizado!");

window.location.href =
"login.html";

});
}

// ===== LOGIN =====

const loginForm =
document.getElementById("loginForm");

if (loginForm) {

loginForm.addEventListener(
"submit",
function(e){

e.preventDefault();

const loginEmail =
document.getElementById("loginEmail").value;

const senha =
document.getElementById("loginSenha").value;

// procurar usuário
let usuario = null;

for (let key in localStorage) {

if (key.startsWith("user-")) {

const user =
JSON.parse(localStorage.getItem(key));

if (
user.login === loginEmail ||
user.email === loginEmail
) {

usuario = user;

}

}

}

if (!usuario) {

alert("Usuário não encontrado");

return;

}

if (usuario.senha !== senha) {

alert("Senha inválida");

return;

}

// ===== CRIAR TOKEN =====

const token =
Math.random()
.toString(36)
.substring(2);

localStorage.setItem(
"sessionToken",
token
);

localStorage.setItem(
"usuarioLogado",
usuario.login
);

alert("Login realizado!");

window.location.href =
"index.html";

});
}

// ===== RECUPERAÇÃO =====

const recuperarForm =
document.getElementById("recuperarForm");

if (recuperarForm) {

recuperarForm.addEventListener(
"submit",
function(e){

e.preventDefault();

const email =
document.getElementById(
"emailRecuperar"
).value;

// gerar token
const token =
Math.random()
.toString(36)
.substring(2);

localStorage.setItem(
"resetToken",
token
);

// simulação email
alert(

`Token enviado para ${email}
(Token simulado: ${token})`

);

});
}

// ===== VALIDAR SESSÃO =====

function validarSessao(){

const token =
localStorage.getItem("sessionToken");

if (!token){

window.location.href =
"login.html";

}

}