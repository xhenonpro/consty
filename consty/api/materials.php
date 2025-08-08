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
        $stmt = $pdo->query('SELECT id, name, quantity, price FROM materials ORDER BY id DESC');
        $materials = $stmt->fetchAll();
        echo json_encode(['materials' => $materials]);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        $name = $input['name'] ?? '';
        $quantity = $input['quantity'] ?? 0;
        $price = $input['price'] ?? 0;
        if (!$name) {
            http_response_code(400);
            echo json_encode(['error' => 'Material name is required']);
            exit();
        }
        $stmt = $pdo->prepare('INSERT INTO materials (name, quantity, price) VALUES (?, ?, ?)');
        $stmt->execute([$name, $quantity, $price]);
        echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $input['id'] ?? null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Material id is required']);
            exit();
        }
        $stmt = $pdo->prepare('DELETE FROM materials WHERE id = ?');
        $stmt->execute([$id]);
        echo json_encode(['success' => true]);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'PATCH') {
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $input['id'] ?? null;
        $name = $input['name'] ?? null;
        $quantity = $input['quantity'] ?? null;
        $price = $input['price'] ?? null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Material id is required']);
            exit();
        }
        $fields = [];
        $params = [];
        if ($name !== null) { $fields[] = 'name = ?'; $params[] = $name; }
        if ($quantity !== null) { $fields[] = 'quantity = ?'; $params[] = $quantity; }
        if ($price !== null) { $fields[] = 'price = ?'; $params[] = $price; }
        if (count($fields) === 0) {
            http_response_code(400);
            echo json_encode(['error' => 'No fields to update']);
            exit();
        }
        $params[] = $id;
        $stmt = $pdo->prepare('UPDATE materials SET ' . implode(', ', $fields) . ' WHERE id = ?');
        $stmt->execute($params);
        echo json_encode(['success' => true]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
