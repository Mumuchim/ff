<?php
session_start();

if (isset($_POST['title']) && 
        isset($_POST['details']) && 
        isset($_POST['reportType']) && 
        isset($_POST['reportDate'])) {
    if (isset($_SESSION['user_id']) && isset($_SESSION['user_name'])) {
        $userName = $_SESSION['user_name'];
    } else {
        echo "<script>alert('You need to log in first!');</script>";
        exit;
    }

    include "db_conn.php";

    $title = $_POST['title'];
    $details = $_POST['details'];
    $reportType = $_POST['reportType'];
    $reportDate = $_POST['reportDate'];
    // $file_path = null;  // Default if no file is uploaded

    if (isset($_FILES['file_path']['name']) AND !empty($_FILES['file_path']['name'])) {
        $file_name = $_FILES['file_path']['name'];
        $tmp_name = $_FILES['file_path']['tmp_name'];
        $error = $_FILES['file_path']['error'];

        if ($error === 0) {
            $file_ext = pathinfo($file_name, PATHINFO_EXTENSION);
            $file_ext_lc = strtolower($file_ext);
            $allowed_exts = array('jpg', 'jpeg', 'png');

            if (in_array($file_ext_lc, $allowed_exts)) {
                $new_file_name = uniqid("$title", true) . '.' . $file_ext_lc;
                $file_upload_path = 'reports_upload' . $new_file_name;

                // Add extra error handling for move_uploaded_file
                if (move_uploaded_file($tmp_name, $file_upload_path)) {
                    $file_path = $new_file_name;
                } else {
                    echo "<script>alert('Failed to move uploaded file. Check directory permissions and file path.');</script>";
                    exit;
                }
            } else {
                echo "<script>alert('File type not allowed. Only JPG, JPEG, PNG are accepted.');</script>";
                exit;
            }
        } else {
            echo "<script>alert('Error during file upload. Error Code: $error');</script>";
            exit;
        }
    }

    $sql = "INSERT INTO reports (title, details, report_type, report_date, file_path, submitted_by) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    if ($stmt->execute([$title, $details, $reportType, $reportDate, $file_path, $userName])) {
        echo "<script>
                document.getElementById('myForm').style.display = 'none';
                showSuccessPopup('Report submitted successfully!');
              </script>";
    } else {
        echo "<script>alert('Failed to submit report');</script>";
    }
    exit;
} else {
    echo "<script>alert('Form submission error');</script>";
    exit;
}
