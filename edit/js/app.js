document.getElementById('secondFloor').style.display = 'none';

function showFloor(floor) {
    const firstFloor = document.getElementById('firstFloor');
    const secondFloor = document.getElementById('secondFloor');
    
    if (floor === 1) {
        firstFloor.style.display = 'block';
        secondFloor.style.display = 'none';
    } else if (floor === 2) {
        firstFloor.style.display = 'none';
        secondFloor.style.display = 'block';
    }
}

function addPathListeners(paths, svgId) {
    const nameLabel = document.getElementById('name');
    const slidingColumn = document.getElementById('slidingColumn');

    paths.forEach(path => {
        path.addEventListener('mouseover', () => {
            nameLabel.style.opacity = '1';
            nameLabel.querySelector('#namep').innerText = `${svgId} - ${path.id}`;
        });

        path.addEventListener('mousemove', (e) => {
            nameLabel.style.left = `${e.pageX + 10}px`;
            nameLabel.style.top = `${e.pageY - 20}px`;
        });

        path.addEventListener('mouseout', () => {
            nameLabel.style.opacity = '0';
        });

        path.addEventListener('click', () => {
            slidingColumn.classList.add('show');
            document.getElementById('pins').innerHTML = `<div class="pin">You clicked on: ${svgId} - ${path.id}</div>`;
        });
    });
}

addPathListeners(document.querySelectorAll('#firstFloor .allPaths'), 'First Floor');
addPathListeners(document.querySelectorAll('#secondFloor .allPaths'), 'Second Floor');

document.getElementById("closeButton").addEventListener("click", function () {
    document.getElementById("slidingColumn").classList.remove("show");
});

let pinPositions = [];

function savePinPositions() {
    localStorage.setItem("pinPositions", JSON.stringify(pinPositions));
}

function loadPinPositions() {
    const savedPositions = JSON.parse(localStorage.getItem("pinPositions"));
    if (savedPositions) {
        savedPositions.forEach(position => {
            const pinElement = document.createElement('div');
            pinElement.classList.add('pin');
            pinElement.style.position = 'absolute';
            pinElement.style.top = position.top;
            pinElement.style.left = position.left;
            pinElement.id = position.pinId;
            document.getElementById("mapContainer").appendChild(pinElement);

            pinElement.addEventListener('click', () => {
                showCustomModal(position.pinId);
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const mapContainer = document.getElementById('mapContainer');

    function makeDraggable(pin) {
        let isDragging = false;
        let offsetX, offsetY;

        function onMouseMove(e) {
            if (isDragging) {
                pin.style.position = 'absolute';
                pin.style.left = `${e.clientX - offsetX}px`;
                pin.style.top = `${e.clientY - offsetY}px`;
            }
        }

        function onMouseUp() {
            isDragging = false;

            const pinId = pin.id;
            pinPositions = pinPositions.filter(p => p.pinId !== pinId);
            pinPositions.push({
                pinId: pinId,
                top: pin.style.top,
                left: pin.style.left
            });
            savePinPositions();

            pin.style.position = "absolute";
            showCustomModal(pinId);

            pin.removeEventListener('mousedown', onMouseDown);
            pin.removeEventListener('mousemove', onMouseMove);
            pin.removeEventListener('mouseup', onMouseUp);

            pin.addEventListener('click', () => {
                showCustomModal(pinId);
            });

            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        function onMouseDown(e) {
            isDragging = true;
            offsetX = e.clientX - pin.getBoundingClientRect().left;
            offsetY = e.clientY - pin.getBoundingClientRect().top;

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        }

        pin.addEventListener('mousedown', onMouseDown);
    }

    function clonePin(pin, x, y) {
        const clone = pin.cloneNode(true);
        const pinId = `pin-${Date.now()}`;
        clone.id = pinId;
        clone.style.position = 'absolute';
        clone.style.left = `${x}px`;
        clone.style.top = `${y}px`;
        mapContainer.appendChild(clone);

        makeDraggable(clone);
        pinPositions.push({ pinId: pinId, top: clone.style.top, left: clone.style.left });
        savePinPositions();

        clone.addEventListener('click', () => {
            showCustomModal(pinId);
        });
    }

    function enablePinPlacement(icon) {
        icon.addEventListener('click', function (e) {
            const mapRect = mapContainer.getBoundingClientRect();
            const x = e.clientX - mapRect.left;
            const y = e.clientY - mapRect.top;
            clonePin(icon, x, y);
        });
    }

    enablePinPlacement(cautionIcon);
    enablePinPlacement(cleaningIcon);
    enablePinPlacement(electricalIcon);
    enablePinPlacement(itIcon);
    enablePinPlacement(repairIcon);
    enablePinPlacement(requestIcon);

    function showCustomModal(pinId) {
        const modal = document.createElement('div');
        modal.classList.add('custom-modal');

        const reportsButton = document.createElement('button');
        reportsButton.textContent = 'Reports';
        const statusButton = document.createElement('button');
        statusButton.textContent = 'Status';
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove Pin';
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';

        modal.appendChild(reportsButton);
        modal.appendChild(statusButton);
        modal.appendChild(removeButton);
        modal.appendChild(cancelButton);

        document.body.appendChild(modal);

        reportsButton.addEventListener('click', () => {
            openForm(); // Open the report popup
        });

        statusButton.addEventListener('click', () => {
            window.location.href = '/pages/status.html';
            document.body.removeChild(modal);
        });

        removeButton.addEventListener('click', () => {
            const pinElement = document.getElementById(pinId);
            if (pinElement) {
                mapContainer.removeChild(pinElement);
                pinPositions = pinPositions.filter(p => p.pinId !== pinId);
                savePinPositions();
            }
            document.body.removeChild(modal);
        });

        cancelButton.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    }
});

// Load saved pins from localStorage when the page loads
window.onload = function() {
    loadPinPositions();
};

function openForm() {
    document.getElementById("myForm").style.display = "block";
}
  
function closeForm() {
    document.getElementById("myForm").style.display = "none";
}

// Function to show success pop-up in the center of the page
function showSuccessPopup(message) {
    const popup = document.createElement("div");
    popup.classList.add("success-popup");
    popup.textContent = message;

    document.body.appendChild(popup);

    // Center the pop-up on the page
    popup.style.top = `${window.scrollY + window.innerHeight / 2 - popup.offsetHeight / 2}px`;
    popup.style.left = `${window.scrollX + window.innerWidth / 2 - popup.offsetWidth / 2}px`;

    // Automatically remove the pop-up after 3 seconds
    setTimeout(() => {
        popup.remove();
    }, 3000);
}

// Function to handle form submission and close the form
document.querySelector(".form-container").onsubmit = function(e) {
    e.preventDefault(); // Prevent the form from submitting normally

    const formData = new FormData(this); // Collect form data

    // Send data using AJAX
    fetch("submit_report.php", {
        method: "POST",
        body: formData,
    })
    .then(response => response.text())
    .then(data => {
        if (data.includes('Report submitted successfully!')) {
            showSuccessPopup("Submitted successfully!");
            // Hide the form
            document.getElementById("myForm").style.display = "none"; 
        } else {
            alert("Error: " + data);
        }
    })
    .catch(error => console.error("Error:", error));
};
