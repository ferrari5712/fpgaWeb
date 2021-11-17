

function makeRequest(url){
    httpRequest = new XMLHttpRequest();
    let fpganum = Number(document.getElementById("fpganum").value);
    let text = document.getElementById("encryptText").value;
    let maxTry = Number(document.getElementById("maxTry").value);
    let targetPassword = document.getElementById("targetHash").value;
    let newDIV = document.getElementById("result");
    let endFlag = false;
    newDIV.innerHTML = '';
    let data = new FormData();
    let totalMax = 0;
    data.append("fpganum", fpganum);
    data.append("encryptText", text);
    if(!httpRequest) {
        console.log('Error cannot create XMLHTTP instance');
        return false;
    }

    if (maxTry > 2000) {
        setTimeout(function () {
            endFlag = true;
        }, 6000);
    }

    for (let i=0; i<fpganum; i++){
        let progressbar = document.createElement("div");
        progressbar.className = "progress";
        progressbar.innerHTML = "<p>[FPGA"+i+"]</p><img src='/assets/images.jpg'><div class='progress-bar' id='progressbar"+i+"' " +
            "role='progressbar' " +
            "aria-valuenow='0' " +
            "aria-valuemin='0' " +
            "aria-valuemax='100'></div>";
        newDIV.appendChild(progressbar);
        let hrline = document.createElement("hr");
        newDIV.appendChild(hrline);
    }

    for (let j=0; j<fpganum; j++){
        let progressbar = document.getElementById("progressbar"+j);
        let current_progress = j * maxTry;
        let barMax = (maxTry * (j + 1))
        progressbar.setAttribute('aria-valuenow', current_progress);
        // progressbar.style.width = current_progress+"%";
        progressbar.style.width = "0%";
        let interval = setInterval(function () {
            //let randomValue = Math.floor(Math.random() * (100 - 2) + 2);
            if(checkSha(text,current_progress,targetPassword)){
                endFlag = true;
            }
            if (endFlag === true ) {
                clearInterval(interval);
            }
            current_progress += 1;
            if (current_progress >= barMax-1) {
                current_progress = barMax-1;
                totalMax += current_progress;
                clearInterval(interval);
            }
            progressbar.setAttribute('aria-valuenow', current_progress);
            // progressbar.innerText = current_progress + "% complete";
            progressbar.innerText = current_progress + "/" + (barMax - 1);
            progressbar.style.width = (((current_progress - (maxTry * j)) / (barMax - (maxTry * j)))*100)+"%";
            // console.log(current_progress/maxTry)
        }, 50);
    }


    // const form = document.getElementById("encyptForm");
    // form.submit();
    let requestInterval = setInterval(function () {
        if (endFlag === true) {
            httpRequest.onreadystatechange = result;
            httpRequest.open('POST', url);
            httpRequest.send(data);
            clearInterval(requestInterval);
        }else if(totalMax === maxTry*fpganum){
            let newDIV = document.getElementById("result");
            let textnode = document.createTextNode("Decryption failed");
            let hrnode = document.createElement("hr")
            newDIV.appendChild(textnode);
            newDIV.appendChild(hrnode);
            clearInterval(requestInterval);
        }else{

        }
    }, 500)
}

function checkSha(password, number, targetPassword) {
    let testPassword = password + number;
    if(hex_sha512(testPassword) === targetPassword.toLowerCase()) {
        return true
    } else {
        return false
    }
}

function result(){
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
            const result = JSON.parse(httpRequest.responseText);
            console.log(result);
            let newDIV = document.getElementById("result");
            let resultDIV = document.createElement("div");
            resultDIV.innerHTML = "Decryption success.<br> result : " + result.result;
            // let textnode1 = document.createTextNode("Decryption success.<br>")
            // let textnode = document.createTextNode("result:"+result.result);
            let hrnode = document.createElement("hr")
            newDIV.appendChild(resultDIV);
            // newDIV.appendChild(textnode1);
            // newDIV.appendChild(textnode);
            newDIV.appendChild(hrnode);
        }else{
            console.log('request failed.');
        }
    }
}

var btn = document.getElementById('submitbtn');

btn.addEventListener('click', function(){
    console.log("btn clicked");
    console.log(hex_sha512('abc2000'));
    makeRequest('/fpga_form');
});