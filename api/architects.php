<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, PATCH, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = 'localhost';
$db   = 'consty';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';
$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

header('Content-Type: application/json');

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $stmt = $pdo->query('SELECT id, name, project_id, email, phone FROM architects ORDER BY id DESC');
        $architects = $stmt->fetchAll();
        echo json_encode(['architects' => $architects]);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        $name = $input['name'] ?? '';
        $project_id = $input['project_id'] ?? null;
        $email = $input['email'] ?? '';
        $phone = $input['phone'] ?? '';
        if (!$name || !$email) {
            http_response_code(400);
            echo json_encode(['error' => 'Architect name and email are required']);
            exit();
        }
        $stmt = $pdo->prepare('INSERT INTO architects (name, project_id, email, phone) VALUES (?, ?, ?, ?)');
        $stmt->execute([$name, $project_id, $email, $phone]);
        echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $input['id'] ?? null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Architect id is required']);
            exit();
        }
        $stmt = $pdo->prepare('DELETE FROM architects WHERE id = ?');
        $stmt->execute([$id]);
        echo json_encode(['success' => true]);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'PATCH') {
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $input['id'] ?? null;
        $fields = [];
        $params = [];
        if (isset($input['name'])) { $fields[] = 'name = ?'; $params[] = $input['name']; }
        if (isset($input['project_id'])) { $fields[] = 'project_id = ?'; $params[] = $input['project_id']; }
        if (isset($input['email'])) { $fields[] = 'email = ?'; $params[] = $input['email']; }
        if (isset($input['phone'])) { $fields[] = 'phone = ?'; $params[] = $input['phone']; }
        if (!$id || count($fields) === 0) {
            http_response_code(400);
            echo json_encode(['error' => 'Architect id and at least one field are required']);
            exit();
        }
        $params[] = $id;
        $stmt = $pdo->prepare('UPDATE architects SET ' . implode(', ', $fields) . ' WHERE id = ?');
        $stmt->execute($params);
        echo json_encode(['success' => true]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
