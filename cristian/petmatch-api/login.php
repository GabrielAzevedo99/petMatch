<?php

session_start();

header("Content-Type: application/json");

$data =
json_decode(
file_get_contents("php://input"),
true
);

$login =
trim($data["login"] ?? "");

$senha =
trim($data["senha"] ?? "");

$arquivo =
__DIR__ . "/data/usuarios.json";

if (!file_exists($arquivo)) {

echo json_encode([

"success" => false,
"message" => "Arquivo não encontrado"

]);

exit;

}

$conteudo =
file_get_contents($arquivo);

$usuarios =
json_decode($conteudo, true);

if (
$usuarios === null ||
!is_array($usuarios)
){

echo json_encode([

"success" => false,
"message" => "JSON inválido"

]);

exit;

}

foreach ($usuarios as $user) {

if (
    (trim($user["login"]) === $login || trim($user["email"]) === $login) &&
    trim($user["senha"]) === $senha
) {

    $_SESSION["usuario"] = $login;

    echo json_encode([
        "success" => true
    ]);

    exit;
}

}

echo json_encode([

"success" => false,
"message" => "Login inválido"

]);