<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Solo aceptar POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

// Recibir datos JSON
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data || !isset($data['title']) || !isset($data['content'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Datos incompletos']);
    exit;
}

// Generar nombre de archivo seguro
$title = preg_replace('/[^a-zA-Z0-9_-]/', '-', $data['title']);
$filename = $title . '-' . date('Ymd-His') . '.json';
$filepath = __DIR__ . '/' . $filename;

// Guardar instructivo
if (file_put_contents($filepath, $input) === false) {
    http_response_code(500);
    echo json_encode(['error' => 'No se pudo guardar el archivo']);
    exit;
}

// Respuesta OK
echo json_encode(['success' => true, 'file' => $filename]);
