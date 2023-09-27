<?php
require_once('phpqrcode/qrlib.php');

function create_qrcode($qrid){
    $data = 'https://sdocamnorte.com/veriweb/certification.php?id=' . $qrid; // The data to encode in the QR code
    
    $filename = '../download/qr_code_' . $qrid .'.png'; // The path to save the generated QR code image
    $logo = '../download/logo.png'; // The path to the logo image
    
    QRcode::png($data, $filename, QR_ECLEVEL_L, 10); // Generate the QR code and save it as an image
    
    $qrCode = imagecreatefrompng($filename); // Load the QR code image
    $logoImage = imagecreatefrompng($logo); // Load the logo image
    
    $qrCodeSize = getimagesize($filename); // Get the size of the QR code image
    $logoSize = getimagesize($logo); // Get the size of the logo image
    
    $logoWidth = $logoSize[0]; // Get the width of the logo
    $logoHeight = $logoSize[1]; // Get the height of the logo
    
    $logoX = ($qrCodeSize[0] - $logoWidth) / 2; // Calculate the X position for the logo
    $logoY = ($qrCodeSize[1] - $logoHeight) / 2; // Calculate the Y position for the logo
    
    imagecopy($qrCode, $logoImage, $logoX, $logoY, 0, 0, $logoWidth, $logoHeight); // Merge the QR code and the logo
    
    imagepng($qrCode, $filename); // Save the final QR code image with the logo
    
   // header('Content-Type: image/png'); // Set the content type header
   // readfile($filename); // Output the QR code image to the browser
    
}


?>