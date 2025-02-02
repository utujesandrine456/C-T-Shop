<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $names = $_POST['name'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $confirm = $_POST['confirm'];

    // Initialize an array to store error messages
    $errors = [];

    // Validate inputs
    if (empty($names) || empty($email) || empty($password) || empty($confirm)) {
        $errors[] = "All fields are required.";
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Enter a valid email.";
    }
    if ($password !== $confirm) {
        $errors[] = "Passwords don't match.";
    }

    // If there are errors, display them
    if (count($errors) > 0) {
        foreach ($errors as $error) {
            echo "<p style='color:red;'>$error</p>";
        }
    } else {
        // Hash the password
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        // Database connection
        $conn = new mysqli('localhost', 'root', '', 'form');

        // Check connection
        if ($conn->connect_error) {
            die('Connection failed: ' . $conn->connect_error);
        }

        // Prepare and bind
        $stmt = $conn->prepare('INSERT INTO signup (Email, Name, Password) VALUES (?, ?, ?)');
        if ($stmt === false) {
            die('Prepare failed: ' . htmlspecialchars($conn->error));
        }

        $bind = $stmt->bind_param("sss", $email, $names, $hashedPassword);
        if ($bind === false) {
            die('Bind failed: ' . htmlspecialchars($stmt->error));
        }

        // Execute the statement
        $exec = $stmt->execute();
        if ($exec) {
            echo "<p style='color:green;'>Registration successful!</p>";
        } else {
            // Check for duplicate email error
            if ($stmt->errno === 1062) {
                echo "<p style='color:red;'>This email is already registered.</p>";
            } else {
                echo "<p style='color:red;'>Error: " . htmlspecialchars($stmt->error) . "</p>";
            }
        }

        // Close statement and connection
        $stmt->close();
        $conn->close();
    }
}
?>
