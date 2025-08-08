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
        // Auto-complete projects whose end_date is today or in the past
        $pdo->query("UPDATE projects SET status = 'completed' WHERE end_date IS NOT NULL AND end_date <= CURDATE() AND status != 'completed'");
        $stmt = $pdo->query('SELECT id, name, status, start_date, end_date FROM projects ORDER BY id DESC');
        $projects = $stmt->fetchAll();
        echo json_encode(['projects' => $projects]);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        $name = $input['name'] ?? '';
        $status = $input['status'] ?? 'ongoing';
        $start_date = $input['start_date'] ?? null;
        $end_date = $input['end_date'] ?? null;
        if (!$name) {
            http_response_code(400);
            echo json_encode(['error' => 'Project name is required']);
            exit();
        }
        $stmt = $pdo->prepare('INSERT INTO projects (name, status, start_date, end_date) VALUES (?, ?, ?, ?)');
        $stmt->execute([$name, $status, $start_date, $end_date]);
        echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $input['id'] ?? null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Project id is required']);
            exit();
        }
        $stmt = $pdo->prepare('DELETE FROM projects WHERE id = ?');
        $stmt->execute([$id]);
        echo json_encode(['success' => true]);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'PATCH') {
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $input['id'] ?? null;
        $action = $input['action'] ?? null;
        if (!$id || !$action) {
            http_response_code(400);
            echo json_encode(['error' => 'Project id and action are required']);
            exit();
        }
        if ($action === 'pause') {
            $stmt = $pdo->prepare('UPDATE projects SET status = ? WHERE id = ?');
            $stmt->execute(['paused', $id]);
        } elseif ($action === 'start' || $action === 'resume') {
            $stmt = $pdo->prepare('UPDATE projects SET status = ? WHERE id = ?');
            $stmt->execute(['ongoing', $id]);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid action']);
            exit();
        }
        echo json_encode(['success' => true]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
