<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Emergency Fix</title>
    <link rel="stylesheet" href="css/fix.css">
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="icon"></div>
            <h2>Emergency Fix</h2>
            <button class="close-btn">✖</button>
        </div>
        <div class="content">
            <!-- Title Section -->
            <div class="info-box">
                <label class="label">TITLE:</label>
                <div class="data">Faucet Broken</div>
            </div>

            <!-- Report Type Section -->
            <div class="info-box">
                <label class="label">REPORT TYPE:</label>
                <div class="data">Plumbing Issue</div>
            </div>

            <!-- Date Section -->
            <div class="info-box">
                <label class="label">DATE:</label>
                <div class="data">2024-11-12</div>
            </div>

            <!-- Location Section -->
            <div class="info-box">
                <label class="label">LOCATION:</label>
                <div class="data">Main Hall - Restroom</div>
            </div>

            <div class="image-preview">
                <img id="reportImage" src="../img/faucet.jpg" alt="Report Image">
            </div>

            <div id="detailsArea" class="report-details"></div>

            <!-- Reported By Section -->
            <div class="info-box">
                <label class="label">REPORTED BY:</label>
                <div class="data">John Doe</div>
            </div>
        </div>
        <div class="footer">
            <button class="cancel-btn">Cancel Request</button>
        </div>
    </div>

    <script>
        window.onload = function() {
            const reportDetails = "Water leak near the faucet. The issue seems to be worsening, and there's a puddle forming.";
            document.getElementById('detailsArea').innerText = reportDetails;

            const closeButton = document.querySelector('.close-btn');
            closeButton.addEventListener('click', function() {
                alert('Close button clicked!');
            });
        };
    </script>
</body>
</html>