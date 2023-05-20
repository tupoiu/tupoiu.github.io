width = 500;
height = 500;


window.onload = async function(){
    const canvas = document.getElementById("canvas");
    const fileInput = document.getElementById("csvFile");
    
    // Initialise canvas to blank background
    context = canvas.getContext("2d");
    canvas.width = width; 
    canvas.height = height;
    clearBG();

    // Add event listener to update display when .csv is uploaded
    fileInput.addEventListener("change", handleFileSelect, false);


    // Set up slider
    const slider = document.getElementById("slider");
    const sliderValue = document.getElementById("sliderValue");

    // Add event listener to the slider
    slider.addEventListener("input", function() {
        const slider_value = slider.value;
        sliderValue.textContent = "Slider Value: " + slider_value;
    });
}

function clearBG(){
    context.clearRect(0,0,width,height);
}

function handleFileSelect(event) {
    var file = event.target.files[0];

    var reader = new FileReader();
    reader.onload = function(e) {
        var contents = e.target.result;

        // Parse CSV data using PapaParse
        var parsedData = Papa.parse(contents, { header: true });

        // Access the parsed data and populate the table
        var points = parsedData.data;
        drawPoints(points);

        // Rotate and redraw the points every frame
        var t = 0;
        loop = setInterval(
            function(){
                clearBG();
                newPoints = getRotatedPoints(points, slider.value/50);
                drawPoints(newPoints);
            }, 20);
    };

    reader.readAsText(file);
}

function drawPoints(points){
    let size = 5;

    points.forEach(point => {
        let cx = point["x"]*width/3 + width/2;
        let cy = point["y"]*height/3 + height/2;
        let alpha = 1/3+(1-point["z"])/3;

        context.fillStyle = "#000000";
        context.globalAlpha = alpha;
        context.beginPath();
        context.arc(cx>>0, cy>>0, size, 0, 2*Math.PI);
        context.fill();
    });
}

function rotatePoints(points, theta){
    for (let i = 0; i < points.length; i++) {
        points[i] = rotate_y(points[i], theta);
    }
}

function getRotatedPoints(points, theta){
    let newPoints = [];
    for (let i = 0; i < points.length; i++) {
        newPoints[i] = rotate_y(points[i], theta);
    }
    return newPoints;
}

function rotate_y(point, theta){
    px = point["x"];
    py = point["y"];
    pz = point["z"];
    x = Math.cos(theta) * px - Math.sin(theta) * pz;
    y = py;
    z = Math.sin(theta) * px + Math.cos(theta) * pz;
    let new_point = {"x":x, "y":y, "z":z}
    return new_point;
}