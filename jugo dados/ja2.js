const { ethers } = window;

let provider;
let signer;
let gameWalletContract;

const contractAddress = "0x478a95dEa262198EEBE713E9624214eEc6A686B4"; // Dirección del contrato
const abi = [
    "function deposit(address token, uint256 amount) external",
    "function withdraw(address token, uint256 amount) external",
    "function getBalance(address user, address token) external view returns (uint256)",
    "function addAcceptedToken(address token) external",
    "function removeAcceptedToken(address token) external",
    "function emergencyToggle(bool _status) external",
    "function ownerWithdraw(address token, uint256 amount) external"
];

async function init() {
    if (window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        gameWalletContract = new ethers.Contract(contractAddress, abi, signer);
        await updateBalance();
    } else {
        alert("MetaMask no está instalado");
    }
}

async function connectWallet() {
    try {
        await provider.send("eth_requestAccounts", []);
        await updateBalance();
    } catch (error) {
        console.error(error);
    }
}

async function depositToken() {
    const tokenAddress = prompt("0xBE0F4b2Fc8070B31398694220381392a0Cb9Caf5");
    const amount = prompt("Introduce el monto a depositar:");
    if (tokenAddress && amount && !isNaN(amount)) {
        try {
            const tx = await gameWalletContract.deposit(tokenAddress, ethers.utils.parseUnits(amount.toString(), 18));
            await tx.wait();
            alert("Depósito realizado con éxito");
            await updateBalance();
        } catch (error) {
            console.error(error);
            alert("Error al realizar el depósito");
        }
    }
}

async function withdrawToken() {
    const tokenAddress = prompt("0xBE0F4b2Fc8070B31398694220381392a0Cb9Caf5");
    const amount = prompt("Introduce el monto a retirar:");
    if (tokenAddress && amount && !isNaN(amount)) {
        try {
            const tx = await gameWalletContract.withdraw(tokenAddress, ethers.utils.parseUnits(amount.toString(), 18));
            await tx.wait();
            alert("Retiro realizado con éxito");
            await updateBalance();
        } catch (error) {
            console.error(error);
            alert("Error al realizar el retiro");
        }
    }
}

async function updateBalance() {
    try {
        const userAddress = await signer.getAddress();
        const tokenAddress = "0x..."; // Dirección del token
        const balance = await gameWalletContract.getBalance(userAddress, tokenAddress);
        document.getElementById('balance-amount').textContent = ethers.utils.formatUnits(balance, 18);
    } catch (error) {
        console.error(error);
        alert("Error al obtener el saldo");
    }
}

function copyAddress() {
    const address = document.getElementById('recharge-wallet-address').textContent;
    navigator.clipboard.writeText(address)
        .then(() => alert('0xBE0F4b2Fc8070B31398694220381392a0Cb9Caf5'))
        .catch(err => console.error('Error al copiar la dirección', err));
}

function openRechargeModal() {
    document.getElementById('recharge-modal').style.display = 'flex';
}

function closeRechargeModal() {
    document.getElementById('recharge-modal').style.display = 'none';
}

document.querySelector('#recharge-wallet-address').addEventListener('click', openRechargeModal);
document.querySelector('.close').addEventListener('click', closeRechargeModal);

window.onload = init;
