<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$dir = __DIR__;
$files = glob($dir . '/*.json');
$instructivos = [];
foreach ($files as $file) {
    $name = basename($file);
    $data = json_decode(file_get_contents($file), true);
    $instructivos[] = [
        'file' => $name,
        'title' => isset($data['title']) ? $data['title'] : $name,
        'modified' => isset($data['modified']) ? $data['modified'] : date('c', filemtime($file))
    ];
}
echo json_encode($instructivos);
