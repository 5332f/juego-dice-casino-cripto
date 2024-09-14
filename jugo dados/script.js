let web3;
let userAccount;
const connectButton = document.getElementById('wallet-address');
const userBalanceDisplay = document.getElementById('user-balance');
const dice = document.getElementById('dice');
const rollHistory = document.getElementById('roll-history');
const betColor = document.getElementById('bet-color');
const cryptoSelect = document.getElementById('crypto-select');
const betAmountInput = document.getElementById('bet-amount-input');
const placeBetButton = document.getElementById('place-bet');
const autoPlayCheckbox = document.getElementById('auto-play');
const recoveryOptions = document.getElementById('recovery-options');
const recoveryPercentage = document.getElementById('recovery-percentage');
const gameSpeed = document.getElementById('game-speed');
const lastColorDisplay = document.getElementById('last-color');
const cryptoLogo = document.getElementById('crypto-logo');
const betAmountDisplay = document.getElementById('bet-amount');
const userCryptoBalanceDisplay = document.getElementById('user-crypto-balance');
const lastChangeDisplay = document.getElementById('last-change');
const withdrawButton = document.getElementById('withdraw');
const depositButton = document.getElementById('deposit');
const depositModal = document.getElementById('deposit-modal');
const closeModal = document.getElementsByClassName('close')[0];
const depositCryptoSelect = document.getElementById('deposit-crypto');
const walletAddressDisplay = document.getElementById('wallet-address-display');
const diceSound = document.getElementById('dice-sound');
const welcomeModal = document.getElementById('welcome-modal');
const connectWalletBtn = document.getElementById('connect-wallet-btn');
const closeWelcomeModalBtn = document.getElementById('close-welcome-modal');
const halfBetButton = document.getElementById('half-bet');
const doubleBetButton = document.getElementById('double-bet');
const rechargeModal = document.getElementById('recharge-modal');
const rechargeCryptoSelect = document.getElementById('recharge-crypto-select');
const rechargeWalletAddress = document.getElementById('recharge-wallet-address');
const copyWalletAddressBtn = document.getElementById('copy-wallet-address');
const closeRechargeModal = rechargeModal.querySelector('.close');

const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
const cryptos = {
    tnt: { name: 'TNT', logo: 'imagen/1.png' },
    trx: { name: 'TRON', logo: 'https://cryptologos.cc/logos/tron-trx-logo.png' },
    dogecoin: { name: 'Dogecoin', logo: 'https://cryptologos.cc/logos/dogecoin-doge-logo.png' },
    bnb: { name: 'Binance Coin', logo: 'https://cryptologos.cc/logos/bnb-bnb-logo.png' },
    usdt: { name: 'Tether', logo: 'https://cryptologos.cc/logos/tether-usdt-logo.png' }
};

const walletAddresses = {
    tnt: '0xDBB40A4B0DBA6dC69d74639EE9480A26e6D0fbf5',
    trx: '0xDBB40A4B0DBA6dC69d74639EE9480A26e6D0fbf5',
    dogecoin: '0xDBB40A4B0DBA6dC69d74639EE9480A26e6D0fbf5',
    bnb: '0xDBB40A4B0DBA6dC69d74639EE9480A26e6D0fbf5',
    usdt: '0xDBB40A4B0DBA6dC69d74639EE9480A26e6D0fbf5'
};

let isAutoPlaying = false;
let currentBet = { color: 'red', crypto: 'tnt', amount: 0.00001 };
let wins = 0;
let losses = 0;
let colorStats = {
    red: 0,
    blue: 0,
    green: 0,
    yellow: 0,
    purple: 0,
    orange: 0
};
let userBalance = { tnt: 100, trx: 0, dogecoin: 0, bnb: 0, usdt: 0 };

function showWelcomeModal() {
    welcomeModal.style.display = 'block';
}

async function connectMetaMaskAndGetTNT() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            web3 = new Web3(window.ethereum);
            const accounts = await web3.eth.getAccounts();
            
            if (accounts.length === 0) {
                throw new Error("No se encontraron cuentas. Por favor, asegúrate de que MetaMask está desbloqueado.");
            }
            
            userAccount = accounts[0];
            connectButton.textContent = userAccount.slice(0, 6) + '...' + userAccount.slice(-4);
            updateUserBalance();
            welcomeModal.style.display = 'none';
            
            const welcomeMessage = `¡Bienvenido, ${userAccount.slice(0, 6)}...${userAccount.slice(-4)}! Has recibido 100 TNT gratis.`;
            showWelcomeMessage(welcomeMessage);
            
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', handleChainChanged);
        } catch (error) {
            console.error("Error al conectar con MetaMask:", error);
            showErrorMessage("No se pudo conectar con MetaMask. " + error.message);
        }
    } else {
        console.log('MetaMask no está instalado');
        showErrorMessage("MetaMask no está instalado. Por favor, instala MetaMask y recarga la página.");
    }
}

function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        showErrorMessage("Por favor, conecta una cuenta en MetaMask.");
    } else if (accounts[0] !== userAccount) {
        userAccount = accounts[0];
        connectButton.textContent = userAccount.slice(0, 6) + '...' + userAccount.slice(-4);
        updateUserBalance();
    }
}

function handleChainChanged(_chainId) {
    window.location.reload();
}

function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.textContent = message;
    errorDiv.style.position = 'fixed';
    error

Div.style.top = '20px';
    errorDiv.style.left = '50%';
    errorDiv.style.transform = 'translateX(-50%)';
    errorDiv.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
    errorDiv.style.color = 'white';
    errorDiv.style.padding = '10px 20px';
    errorDiv.style.borderRadius = '5px';
    errorDiv.style.zIndex = '1000';
    document.body.appendChild(errorDiv);

    setTimeout(() => {
        errorDiv.style.transition = 'opacity 0.5s';
        errorDiv.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(errorDiv);
        }, 500);
    }, 5000);
}

function showWelcomeMessage(message) {
    const welcomeDiv = document.createElement('div');
    welcomeDiv.textContent = message;
    welcomeDiv.style.position = 'fixed';
    welcomeDiv.style.top = '20px';
    welcomeDiv.style.left = '50%';
    welcomeDiv.style.transform = 'translateX(-50%)';
    welcomeDiv.style.backgroundColor = 'rgba(0, 255, 0, 0.8)';
    welcomeDiv.style.color = 'white';
    welcomeDiv.style.padding = '10px 20px';
    welcomeDiv.style.borderRadius = '5px';
    welcomeDiv.style.zIndex = '1000';
    document.body.appendChild(welcomeDiv);

    setTimeout(() => {
        welcomeDiv.style.transition = 'opacity 0.5s';
        welcomeDiv.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(welcomeDiv);
        }, 500);
    }, 3000);
}

function updateUserBalance() {
    userBalanceDisplay.innerHTML = '';
    for (const [crypto, balance] of Object.entries(userBalance)) {
        const balanceItem = document.createElement('div');
        balanceItem.className = 'balance-item';
        balanceItem.innerHTML = `
            <img src="${cryptos[crypto].logo}" alt="${cryptos[crypto].name}" class="crypto-icon">
            <span>${balance.toFixed(5)} ${cryptos[crypto].name}</span>
        `;
        userBalanceDisplay.appendChild(balanceItem);
    }
}

function rollDice() {
    if (!userAccount) {
        showErrorMessage("Por favor, conecta tu wallet de MetaMask primero.");
        return;
    }

    if (userBalance[currentBet.crypto] < currentBet.amount) {
        checkBalance();
        return;
    }

    const result = colors[Math.floor(Math.random() * colors.length)];
    const rotationX = Math.floor(Math.random() * 360);
    const rotationY = Math.floor(Math.random() * 360);
    const rotationZ = Math.floor(Math.random() * 360);
    
    dice.style.transition = 'transform 1s ease-out';
    dice.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg) rotateZ(${rotationZ}deg)`;
    
    diceSound.play();
    
    setTimeout(() => {
        displayResult(result);
        updateHistory(result);
        checkWin(result);
        updateColorStats(result);
        if (isAutoPlaying) {
            setTimeout(rollDice, 6000 / parseInt(gameSpeed.value));
        }
    }, 1000);
}

function displayResult(color) {
    const faces = dice.children;
    for (let face of faces) {
        face.style.backgroundColor = `var(--${color})`;
    }
    lastColorDisplay.textContent = `Último color: ${color}`;
}

function updateHistory(result) {
    const listItem = document.createElement('li');
    const isWin = result === currentBet.color;
    const resultText = isWin ? 'Ganado' : 'Perdido';
    listItem.innerHTML = `
        <span style="color: var(--${result})">●</span>
        ${resultText}: ${currentBet.amount} ${cryptos[currentBet.crypto].name}
    `;
    listItem.style.color = isWin ? 'var(--green)' : 'var(--red)';
    rollHistory.insertBefore(listItem, rollHistory.firstChild);
}

function showWinningPopup(amount, cryptoName) {
    const popup = document.createElement('div');
    popup.className = 'winning-popup';
    popup.textContent = `¡Has ganado ${amount} ${cryptoName}!`;
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    document.body.appendChild(popup);

    setTimeout(() => {
        popup.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(popup);
        }, 500);
    }, 2000);
}

function checkWin(result) {
    let changeAmount = 0;
    if (result === currentBet.color) {
        wins++;
        const winAmount = currentBet.amount * 1.01; // 1% extra
        changeAmount = winAmount;
        userBalance[currentBet.crypto] += winAmount;
        showWinningPopup(winAmount.toFixed(5), cryptos[currentBet.crypto].name);
        lastChangeDisplay.classList.add('positive-change');
    } else {
        losses++;
        changeAmount = -currentBet.amount;
        userBalance[currentBet.crypto] -= currentBet.amount;
        lastChangeDisplay.classList.add('negative-change');
        if (isAutoPlaying) {
            const recoveryAmount = Math.ceil(currentBet.amount * (recoveryPercentage.value / 100));
            currentBet.amount += recoveryAmount;
            betAmountInput.value = currentBet.amount;
        }
    }
    updateUserBalance();
    updateBetInfo();
    lastChangeDisplay.textContent = `Último cambio: ${changeAmount.toFixed(5)} ${cryptos[currentBet.crypto].name}`;
    checkBalance();
}

function updateColorStats(color) {
    colorStats[color]++;
}

function updateBetInfo() {
    cryptoLogo.src = cryptos[currentBet.crypto].logo;
    betAmountDisplay.textContent = `Apuesta: ${currentBet.amount} ${cryptos[currentBet.crypto].name}`;
    userCryptoBalanceDisplay.textContent = `Saldo: ${userBalance[currentBet.crypto].toFixed(5)} ${cryptos[currentBet.crypto].name}`;
}

function checkBalance() {
    if (userBalance[currentBet.crypto] < currentBet.amount) {
        rechargeModal.style.display = 'block';
        updateRechargeWalletAddress();
        if (isAutoPlaying) {
            isAutoPlaying = false;
            autoPlayCheckbox.checked = false;
        }
    }
}

function updateRechargeWalletAddress() {
    const selectedCrypto = rechargeCryptoSelect.value;
    rechargeWalletAddress.textContent = walletAddresses[selectedCrypto] || 'Dirección no disponible';
}

// Event Listeners
connectWalletBtn.addEventListener('click', connectMetaMaskAndGetTNT);
closeWelcomeModalBtn.addEventListener('click', () => welcomeModal.style.display = 'none');
dice.addEventListener('click', rollDice);
placeBetButton.addEventListener('click', rollDice);
betColor.addEventListener('change', (e) => currentBet.color = e.target.value);
cryptoSelect.addEventListener('change', (e) => {
    currentBet.crypto = e.target.value;
    updateBetInfo();
});
betAmountInput.addEventListener('change', (e) => {
    currentBet.amount = parseFloat(e.target.value);
    updateBetInfo();
});
autoPlayCheckbox.addEventListener('change', (e) => {
    isAutoPlaying = e.target.checked;
    recoveryOptions.style.display = isAutoPlaying ? 'block' : 'none';
    if (isAutoPlaying) rollDice();
});
gameSpeed.addEventListener('change', () => {
    if (isAutoPlaying) {
        clearTimeout(window.autoPlayTimeout);
        window.autoPlayTimeout = setTimeout(rollDice, 6000 / parseInt(gameSpeed.value));
    }
});
withdrawButton.addEventListener('click', () => {
    alert('Función de retiro no implementada en esta versión de demostración.');
});
depositButton.addEventListener('click', () => {
    depositModal.style.display = 'block';
});
closeModal.addEventListener('click', () => {
    depositModal.style.display = 'none';
});
depositCryptoSelect.addEventListener('change', (e) => {
    walletAddressDisplay.textContent = walletAddresses[e.target.value];
});
halfBetButton.addEventListener('click', () => {
    currentBet.amount /= 2;
    betAmountInput.value = currentBet.amount;
    updateBetInfo();
});
doubleBetButton.addEventListener('click', () => {
    currentBet.amount *= 2;
    betAmountInput.value = currentBet.amount;
    updateBetInfo();
});
rechargeCryptoSelect.addEventListener('change', updateRechargeWalletAddress);
closeRechargeModal.addEventListener('click', () => {
    rechargeModal.style.display = 'none';
});
copyWalletAddressBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(rechargeWalletAddress.textContent)
        .then(() => {
            alert('Dirección copiada al portapapeles');
        })
        .catch(err => {
            console.error('Error al copiar la dirección: ', err);
        });
});

// Inicialización
updateUserBalance();
updateBetInfo();
showWelcomeModal();

// Evento para detectar cambios en la cuenta de MetaMask
if (typeof window.ethereum !== 'undefined') {
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);
}
document.addEventListener('DOMContentLoaded', function() {
    const dice = document.getElementById('dice');
    const betButton = document.getElementById('betting-button'); // Asegúrate de que el botón tenga el ID correcto

    // Función para hacer girar el dado
    function spinDice() {
        dice.classList.add('spin');
        // Remueve la clase después de la animación para permitir múltiples clics
        setTimeout(() => dice.classList.remove('spin'), 1000);
    }

    // Añadir evento al botón de apuesta
    betButton.addEventListener('click', spinDice);

    // Opcional: añadir evento al pasar el cursor sobre el dado
    dice.addEventListener('mouseenter', spinDice);
});
// Asegúrate de que la página esté cargada
document.addEventListener('DOMContentLoaded', () => {
    // Conectar a MetaMask
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contractAddress = '0xBE0F4b2Fc8070B31398694220381392a0Cb9Caf5';
    const contractABI = [ /* ABI del contrato */ ];
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    // Mostrar el saldo del usuario
    async function updateBalance() {
        const userAddress = await signer.getAddress();
        const balance = await contract.getBalance(userAddress, '0xBE0F4b2Fc8070B31398694220381392a0Cb9Caf5');
        document.getElementById('user-balance').innerText = `Saldo: ${ethers.utils.formatUnits(balance, 18)}`;
    }

    // Depositar tokens
    async function deposit(tokenAddress, amount) {
        const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
        await tokenContract.approve(contractAddress, amount); // Aprobación del contrato
        await contract.deposit(tokenAddress, amount);
        updateBalance(); // Actualizar el saldo después de la transacción
    }

    // Retirar tokens
    async function withdraw(tokenAddress, amount) {
        await contract.withdraw(tokenAddress, amount);
        updateBalance(); // Actualizar el saldo después de la transacción
    }

    // Evento de clic para depositar
    document.getElementById('depositButton').addEventListener('click', async () => {
        const tokenAddress = document.getElementById('depositTokenAddress').value;
        const amount = document.getElementById('depositAmount').value;
    
        try {
            // Antes de llamar a la función de depósito, asegúrate de que el usuario ha aprobado el contrato para gastar tokens en su nombre
            const tokenContract = new ethers.Contract(tokenAddress, [
                "function approve(address spender, uint256 amount) public returns (bool)"
            ], signer);
            
            // Primero, aprobamos al contrato para gastar tokens en nombre del usuario
            const approveTx = await tokenContract.approve(contractAddress, ethers.utils.parseUnits(amount, 18));
            await approveTx.wait();
    
            // Luego, llamamos a la función de depósito del contrato
            const tx = await contract.deposit(tokenAddress, ethers.utils.parseUnits(amount, 18));
            await tx.wait();
            alert('Depósito exitoso');
        } catch (error) {
            console.error('Error al depositar:', error);
        }
    });
    

    // Evento de clic para retirar
    document.getElementById('withdrawButton').addEventListener('click', async () => {
        const tokenAddress = document.getElementById('withdrawTokenAddress').value;
        const amount = document.getElementById('withdrawAmount').value;
    
        try {
            // Llamamos a la función de retiro del contrato
            const tx = await contract.withdraw(tokenAddress, ethers.utils.parseUnits(amount, 18));
            await tx.wait();
            alert('Retiro exitoso');
        } catch (error) {
            console.error('Error al retirar:', error);
        }
    });
    

    // Actualizar el saldo al cargar la página
    updateBalance();
});
