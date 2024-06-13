document.getElementById('startMiningBtn').addEventListener('click', function() {
    startMiningAnimation();
    startRealMining(); 
    sessionStorage.setItem('miningStarted', 'true'); 
    document.getElementById('startMiningBtn').style.display = 'none'; 
    document.getElementById('terminalOutput').classList.remove('hidden'); 
});



function startMiningAnimation(btn, terminalOutput) {
    btn.style.display = 'none'; 
    terminalOutput.classList.remove('hidden'); 

    function addMiningEntry() {
        const min = 0.0000001;
        const max = 0.05;
        const minedValue = (Math.random() * (max - min) + min).toFixed(16);
        const hash = generateHash(64);
        const newLine = document.createElement('div');
        newLine.textContent = `Mined bloco ${hash} / ${minedValue} BTC`;
        terminalOutput.appendChild(newLine);
        terminalOutput.scrollTop = terminalOutput.scrollHeight; 
    }

    setInterval(addMiningEntry, 400);
}



window.addEventListener('load', function() {
    if (sessionStorage.getItem('miningStarted') === 'true') {
        const btn = document.getElementById('startMiningBtn');
        const output = document.getElementById('terminalOutput');
        btn.style.display = 'none';
        output.classList.remove('hidden');
        continueMining(output);
    }
    if (sessionStorage.getItem('miningStarted2') === 'true') {
        recreateSecondInstance();
    }
});


function recreateSecondInstance() {
    const miningContainer = document.getElementById('miningBox').parentNode;

    if (!document.getElementById('miningInstance2')) {
        const newInstance = document.createElement('div');
        newInstance.className = 'center-box mining-start-box';
        newInstance.id = 'miningInstance2';

        const miningStatus = document.createElement('div');
        miningStatus.className = 'mining-status';
        newInstance.appendChild(miningStatus);

        const startMiningBtn2 = document.createElement('button');
        startMiningBtn2.textContent = 'Começar Mineração';
        startMiningBtn2.id = 'startMiningBtn2';
        newInstance.appendChild(startMiningBtn2);

        const terminalOutput2 = document.createElement('div');
        terminalOutput2.className = 'terminal-output hidden';
        terminalOutput2.id = 'terminalOutput2';
        newInstance.appendChild(terminalOutput2);

        miningContainer.appendChild(newInstance);

        startMiningBtn2.addEventListener('click', function() {
            startMiningAnimation(startMiningBtn2, terminalOutput2);
            startRealMining2();
            sessionStorage.setItem('miningStarted2', 'true'); 
        });
    }

    document.getElementById('startMiningBtn2').style.display = 'none';
    const output2 = document.getElementById('terminalOutput2');
    output2.classList.remove('hidden');
    continueMining(output2);

    const addInstanceBtn = document.getElementById('addInstanceBtn');
    if (addInstanceBtn) {
        addInstanceBtn.style.display = 'none';
    }
}


function continueMining(terminalOutput) {
    setInterval(function() {
        const min = 0.0000001;
        const max = 0.05;
        const minedValue = (Math.random() * (max - min) + min).toFixed(16);
        const hash = generateHash(64);
        const newLine = document.createElement('div');
        newLine.textContent = `Mined bloco ${hash} / ${minedValue} BTC`;
        terminalOutput.appendChild(newLine);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }, 400);
}


function generateHash(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}


function startRealMining() {
    const userId = getUserId();
    if (!userId) return; 

    fetch(`https://mineradoraapi-fda524168c07.herokuapp.com/start_mining?user_id=${userId}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Error starting mining:', data.error);
            } else {
                console.log('Mining started:', data.message);
            }
        })
        .catch(error => {
            console.error('Failed to start mining:', error);
        });
}


function getUserId() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        console.error('User ID is undefined. Please log in.');
        alert("Please log in to continue.");
        window.location.href = 'index.html';  
        return null;
    }
    return userId;
}



document.getElementById('profileBtn').addEventListener('click', function() {
    const userId = getUserId();
    if (!userId) return; 

    fetch(`https://mineradoraapi-fda524168c07.herokuapp.com/user_info?user_id=${userId}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
                return;
            }
            localStorage.setItem('userInfo', JSON.stringify(data)); 
            window.location.href = 'profile.html'; 
        })
        .catch(error => {
            console.error('Erro ao obter informações do usuário: ', error);
            alert('Falha ao obter informações do usuário.');
        });
});



document.getElementById('logoutBtn').addEventListener('click', function() {
    sessionStorage.clear(); 
    localStorage.clear(); 
    window.location.href = 'index.html';
});


document.getElementById('addInstanceBtn').addEventListener('click', function() {
    const miningContainer = document.getElementById('miningBox').parentNode;
    const newInstance = createInstanceDom(); 

    miningContainer.appendChild(newInstance);

    document.getElementById('startMiningBtn2').addEventListener('click', function() {
        startMiningAnimation(this, document.getElementById('terminalOutput2'));
        startRealMining2();
        sessionStorage.setItem('miningStarted2', 'true');
    });

    this.remove();
});

function createInstanceDom() {
    const newInstance = document.createElement('div');
    newInstance.className = 'center-box mining-start-box';
    newInstance.id = 'miningInstance2';

    const miningStatus = document.createElement('div');
    miningStatus.className = 'mining-status';
    newInstance.appendChild(miningStatus);

    const startMiningBtn2 = document.createElement('button');
    startMiningBtn2.textContent = 'Começar Mineração';
    startMiningBtn2.id = 'startMiningBtn2';
    newInstance.appendChild(startMiningBtn2);

    const terminalOutput2 = document.createElement('div');
    terminalOutput2.className = 'terminal-output hidden';
    terminalOutput2.id = 'terminalOutput2';
    newInstance.appendChild(terminalOutput2);

    return newInstance;
}

function startRealMining2() {
    const userId = getUserId();
    if (!userId) return;

    fetch(`https://mineradoraapi-fda524168c07.herokuapp.com/add_instance?user_id=${userId}`, {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error('Error starting second instance:', data.error);
        } else {
            console.log('Second instance started:', data.message);
        }
    })
    .catch(error => {
        console.error('Failed to start second instance:', error);
    });
}


if (window.Worker) {
    const miningWorker = new Worker('miningWorker.js');

    document.getElementById('startMiningBtn').addEventListener('click', function() {
        const btn = this;
        const output = document.getElementById('terminalOutput');
        startMiningAnimation(btn, output);
        startRealMining();
        sessionStorage.setItem('miningStarted', 'true');
        btn.style.display = 'none';
        output.classList.remove('hidden');
    });
    

    miningWorker.onmessage = function(event) {
        const terminalOutput = document.getElementById('terminalOutput');
        const newLine = document.createElement('div');
        newLine.textContent = event.data;
        terminalOutput.appendChild(newLine);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
}
