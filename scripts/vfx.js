const clamp = (x,min,max) => Math.min(Math.max(x, min), max);
let og_monkey;
let dog_monkey;
let loop;
let t = 0;
let canvas, context;
let loadingText;
let scale_factor = 1/2;
const max_width = 500;
const max_height = 500;
function clamp_WH(width,height){
    let sf = Math.min(max_width/width, max_height/height);
    sf = Math.min(1, sf);
    return [width*sf >>0, height*sf >>0];
}

window.onload = async function(){

    // Prepare Canvas
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    canvas.width = (983*scale_factor)>>0;
    canvas.height = (656*scale_factor)>>0;
    
    // Prepare loading text
    loadingText = document.getElementById("loading");
    loadingText.innerHTML = "Loading...";
    
    // Set green background
    context.fillStyle = "#00DD00"
    context.fillRect(0, 0, canvas.width, canvas.height);


    // Add event listener for file upload
    const fileInput = document.getElementById("imageFile");
    fileInput.addEventListener("change", handleFileSelect, false);

    // Load the default image
    let image = new Image();
    image.crossOrigin = "anonymous";
    image.src = "https://images.unsplash.com/flagged/photo-1566127992631-137a642a90f4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8M3x8fGVufDB8fHx8&w=1000&q=80";
    image.onload = function() {
        [canvas.width, canvas.height] = clamp_WH(image.naturalWidth, image.naturalHeight);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        gaussianBlurCanvas(canvas);
        loadingText.innerHTML = "Loaded";
    };

    
}

async function gaussianBlurCanvas(canvas){
    const context = canvas.getContext("2d");
    let imgdata = context.getImageData(0,0,canvas.width, canvas.height);
    let data = imgdata.data;
    og_monkey = [...data];

    let data1 = [...data];
    let data2 = [...data];
    let blur1 = gaussian_blur(data1, 0.3);
    let blur2 = gaussian_blur(data2, 0.01);

    for (let i = 0; i < data.length; i++) {
        if (i%4 == 3){continue}
        data[i] = 4*(blur1[i] - blur2[i]);
        data[i] = clamp(data[i], 0, 255);
    }
    
    dog_monkey = [...data];

    await context.putImageData(imgdata, 0,0);
    
    // loop = setInterval(lerp_next, 100);
}

// File Uploading

function handleFileSelect(event) { // File upload event handler
    var file = event.target.files[0];
    loadingText.innerHTML = "Loading...";

    var reader = new FileReader();
    reader.onload = function(e) {
        console.log("We made it here");
        newImage = new Image();
        newImage.crossOrigin = "anonymous";
        newImage.src = e.target.result;
        newImage.onload = function(){
            [canvas.width, canvas.height] = clamp_WH(newImage.naturalWidth, newImage.naturalHeight);
            console.log(canvas.width, canvas.height);
            context.drawImage(newImage, 0, 0, canvas.width, canvas.height);
            gaussianBlurCanvas(canvas);
            loadingText.innerHTML = "Loaded";
        };
    };

    reader.readAsDataURL(file);
}

function lerp_next(){
    let imgdata = context.getImageData(0,0,canvas.width, canvas.height);
    let data = imgdata.data;
    t += 1;
    lerp_val = (0+0*Math.sin(t/3))/2;
    for (let i = 0; i < data.length; i++) {
        if (i%4 == 3){continue}
        data[i] = (lerp_val*og_monkey[i] + (1-lerp_val)*dog_monkey[i])/2;
    }
    context.putImageData(imgdata, 0,0);
}

//VFX Algorithms

function triangle(data, invert = false){
    let r,g,b,a;
    let new_r,new_g,new_b,new_a;
    let p_i, p_j;

    const sin30 = 1/2;
    const sin60 = Math.sqrt(3)/2;
    const tan60 = Math.sqrt(3);

    for (let i = 0; i < data.length; i += 4) {
        // Get p_i = x, p_j = y
        p_i = (i/4>>0)%width; // >>0 truncates to integer
        p_j = (i/4>>0)/width>>0;

        r = data[i];
        g = data[i+1];
        b = data[i+2];
        a = data[i+3];
        
        let in_triangle = (tan60*p_i >= p_j && tan60*(width - p_i) >= p_j && p_j >= 0);
        if (invert){
            new_r = r + (255 - 2*r)*in_triangle;
            new_g = g + (255 - 2*g)*in_triangle;
            new_b = b + (255 - 2*b)*in_triangle;
            new_a = a;
        }else{
            new_r = 255*in_triangle;
            new_g = 255*in_triangle;
            new_b = 255*in_triangle;
            new_a = a;
        }
        
        data[i]   = new_r;
        data[i+1] = new_g;
        data[i+2] = new_b;
        data[i+3] = new_a;
    }
    return data;

}

function gaussian_blur(data, sharpness = 0.5){
    const width = canvas.width;
    const height = canvas.height;
    let r,g,b,a;
    let new_rgb;
    let p_i, p_j;
    let radius = 15;
    
    let kernel_cache = {};
    let kernel = function(a){
        if (! (a in kernel_cache)){
            kernel_cache[a] = Math.exp(-sharpness*(a));
        }
        return kernel_cache[a];
    }
    
    for (let idx = 0; idx < data.length; idx += 4) {
        // Get p_i = x, p_j = y
        p_i = (idx/4>>0)%width; // >>0 truncates to integer
        p_j = (idx/4>>0)/width>>0;

        r = data[idx];
        g = data[idx+1];
        b = data[idx+2];
        a = data[idx+3];
        

        new_rgb = [0,0,0];
        
        let integrated_kernel = 0;
        for (let i = -radius; i < radius; i += 1){ // For each point in the radius,
            for (let j = -radius; j < radius; j++) { // Add its contribution to the convolution
                
                let ker = kernel(i*i+j*j);
                integrated_kernel += ker;
                _i = clamp(p_i+i, 0, width-1);
                _j = clamp(p_j+j, 0, height-1);
                for(let c = 0; c < 3; c += 1){ // For each colour
                    new_rgb[c] += data[_i*4 + _j*4*width + c]*ker;
                }
            }
        }
        
        data[idx]   = new_rgb[0]/integrated_kernel;
        data[idx+1] = new_rgb[1]/integrated_kernel;
        data[idx+2] = new_rgb[2]/integrated_kernel;
        data[idx+3] = 255;
    }
    return data;

}

function diagonal_boundary(data){
    let r,g,b,a;
    let new_r,new_g,new_b,new_a;
    let p_i = 0; let p_j = 0;

    for (let i = 0; i < data.length; i += 4) {
        p_i = (i/4>>0)%width; // >>0 truncates to integer
        p_j = (i/4>>0)/width>>0;

        r = data[i];
        g = data[i+1];
        b = data[i+2];
        a = data[i+3];
        
        new_r = 255*(p_i > p_j);
        new_g = 255 - g;
        new_b = 255 - b;
        new_a = a;
        
        data[i]   = new_r;
        data[i+1] = new_g;
        data[i+2] = new_b;
        data[i+3] = new_a;
    }
    return data;

}