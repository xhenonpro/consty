<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Role');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }
header('Content-Type: application/json');

require_once 'db.php';

$role = $_SERVER['HTTP_ROLE'] ?? ($_GET['role'] ?? 'user');
if ($role !== 'admin') {
    http_response_code(403);
    echo json_encode(['error' => 'Forbidden']);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->query('SELECT id, username, email, password, role, created_at FROM users ORDER BY id DESC');
    echo json_encode(['users' => $stmt->fetchAll()]);
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $username = $input['username'] ?? '';
    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';
    $role = $input['role'] ?? 'user';
    if (!$username || !$email || !$password) {
        http_response_code(400);
        echo json_encode(['error' => 'All fields required']);
        exit();
    }
    $hash = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)');
    $stmt->execute([$username, $email, $hash, $role]);
    echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
} elseif ($_SERVER['REQUEST_METHOD'] === 'PATCH') {
    $input = json_decode(file_get_contents('php://input'), true);
    $id = $input['id'] ?? null;
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'User id required']);
        exit();
    }
    $fields = [];
    $params = [];
    if (isset($input['username'])) { $fields[] = 'username = ?'; $params[] = $input['username']; }
    if (isset($input['email'])) { $fields[] = 'email = ?'; $params[] = $input['email']; }
    if (isset($input['role'])) { $fields[] = 'role = ?'; $params[] = $input['role']; }
    if (isset($input['password']) && $input['password']) {
        $fields[] = 'password = ?';
        $params[] = password_hash($input['password'], PASSWORD_DEFAULT);
    }
    if (count($fields) === 0) {
        http_response_code(400);
        echo json_encode(['error' => 'No fields to update']);
        exit();
    }
    $params[] = $id;
    $stmt = $pdo->prepare('UPDATE users SET ' . implode(', ', $fields) . ' WHERE id = ?');
    $stmt->execute($params);
    echo json_encode(['success' => true]);
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $input = json_decode(file_get_contents('php://input'), true);
    $id = $input['id'] ?? null;
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'User id required']);
        exit();
    }
    $stmt = $pdo->prepare('DELETE FROM users WHERE id = ?');
    $stmt->execute([$id]);
    echo json_encode(['success' => true]);
}
