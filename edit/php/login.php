<?php 
session_start();

if (isset($_POST['uname']) && isset($_POST['pass'])) {

    include "../db_conn.php";

    $uname = $_POST['uname'];
    $pass = $_POST['pass'];

    $data = "uname=" . $uname;

    if (empty($uname)) {
        $em = "User name is required";
        header("Location: ../login.php?error=$em&$data");
        exit;
    } else if (empty($pass)) {
        $em = "Password is required";
        header("Location: ../login.php?error=$em&$data");
        exit;
    } else {

        $sql = "SELECT * FROM users WHERE username = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$uname]);

        if ($stmt->rowCount() == 1) {
            $user = $stmt->fetch();

            $username = $user['username'];
            $password = $user['password'];
            $fname = $user['fname'];
            $id = $user['id'];
            $role = $user['role']; // Assuming 'role' column exists in the users table
            $pp = $user['pp'];

            if ($username === $uname) {
                if (password_verify($pass, $password)) {
                    // Set session variables for user ID and name
                    $_SESSION['user_id'] = $id;
                    $_SESSION['user_name'] = $fname;
                    $_SESSION['pp'] = $pp;

                    // Redirect based on role
                    if ($role === "admin") {
                        header("Location: ../home.php"); // Redirect admin to home.php
                    } else {
                        header("Location: ../map.php"); // Redirect student to map.php
                    }
                    exit;
                } else {
                    $em = "Incorrect username or password";
                    header("Location: ../login.php?error=$em&$data");
                    exit;
                }
            } else {
                $em = "Incorrect username or password";
                header("Location: ../login.php?error=$em&$data");
                exit;
            }

        } else {
            $em = "Incorrect username or password";
            header("Location: ../login.php?error=$em&$data");
            exit;
        }
    }

} else {
    header("Location: ../login.php?error=error");
    exit;
}
