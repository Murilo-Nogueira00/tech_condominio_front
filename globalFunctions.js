const API_URL = "http://127.0.0.1:8000";

const checkAPIStatus = async () => {
    try {
        const response = await fetch(`${API_URL}/status`);

        if (response.status === 200) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Erro ao verificar o status da API:', error);
        return false;
    }
}

const updateAPIIndicator = async () => {
    const isAPIWorking = await checkAPIStatus();

    const indicator = document.getElementById("api-status-indicator");
    if (isAPIWorking) {
        indicator.style.backgroundColor = "#00FF00"; // Verde claro
    } else {
        indicator.style.backgroundColor = "red";
    }
}
