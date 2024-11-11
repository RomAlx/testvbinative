<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Origin: *');

/**
 * Считываем файл data.json
 *
 * @return mixed|string[]
 */
function readJsonFile() {
    $currentDir = __DIR__;
    $jsonFile = $currentDir . '/data.json';

    if (!file_exists($jsonFile)) {
        return ['error' => 'File not found'];
    }

    $jsonContent = file_get_contents($jsonFile);
    return json_decode($jsonContent, true);
}

/**
 * Функция фильтрации по имени
 *
 * @param $data
 * @param $searchTerm
 * @return array|string[]
 */
function filterByName($data, $searchTerm) {
    if (strlen($searchTerm) < 3) {
        return ['error' => 'Search term must be at least 3 characters long'];
    }

    return array_filter($data, function ($item) use ($searchTerm) {
        return stripos($item['first_name'], $searchTerm) !== false;
    });
}

$data = readJsonFile();

if(isset($data['error'])) {
    http_response_code(400);
    echo json_encode($data);
    exit;
}

if (isset($_GET['search'])) {
    $searchTerm = trim($_GET['search']);
    $filteredData = filterByName($data, $searchTerm);

    if (isset($filteredData['error'])) {
        http_response_code(400);
        echo json_encode($filteredData);
        exit;
    }

    echo json_encode(array_values($filteredData));
} else {
    echo json_encode($data);
}
