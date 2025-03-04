<?php
require 'JazzcashApi.php'; // Make sure to correctly reference your JazzcashApi file

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Collect data from the request
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Create an instance of your JazzcashApi class
    $jazzcash = new JazzcashApi();

    // Prepare form data as per your JavaScript request
    $form_data = [
        'paymentMethod' => 'jazzcashMobile',  // could be dynamic based on user selection
        'price' => 100, // replace with the actual amount, e.g. from the clicked invoice
        'jazz_cash_no' => $data['phone'], // mobile number from request
        'cnic_digits' => $data['cnic'], // CNIC from request
    ];

    $response = $jazzcash->createCharge($form_data);

    echo json_encode($response);
    exit;
}
?>
