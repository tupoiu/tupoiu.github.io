
let prevInit = window.onload;
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

window.onload = function(){
    prevInit();

    headers = document.getElementsByTagName("h1");
    console.log(headers);

    for (let i = 0; i < headers.length; i++) {
        const initialText = headers[i].innerText;

        headers[i].onmouseover = hoverEvent => {
            maxIterations = initialText.length;
            let iterations = 0;
            let interval = setInterval(()=>{
                text = initialText.split("")
                .map(function(letter, index){
                    if (index < iterations){
                        return initialText.split("")[index];
                    }else{
                        return alphabet[Math.floor(26*Math.random())]
                    }
                })
                .join("");

                hoverEvent.target.innerText = text;

                iterations += 1/2;
                if (iterations > initialText.length) {
                    clearInterval(interval);
                }
            }, 50);
        }
    }
}
