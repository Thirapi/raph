document.addEventListener('DOMContentLoaded', function() {
    // Menangani klik tombol Start
    var startButton = document.getElementById('startButton');
    startButton.addEventListener('click', function(e) {
        e.stopPropagation(); // Menghentikan event dari menyebabkan penyebaran (bubbling) ke elemen lain
        toggleShutdownMenu(); // Memunculkan atau menyembunyikan menu shutdown
    });

    // Fungsi untuk memunculkan atau menyembunyikan menu shutdown
    function toggleShutdownMenu() {
        var shutdownMenu = document.getElementById('shutdownMenu');
        if (window.getComputedStyle(shutdownMenu).display === 'block') {
            shutdownMenu.style.display = 'none'; // Sembunyikan menu jika sudah terbuka
        } else {
            shutdownMenu.style.display = 'block'; // Tampilkan menu shutdown
        }
    }

    // Menangani klik di luar menu shutdown untuk menutup menu
    document.addEventListener('click', function(e) {
        var shutdownMenu = document.getElementById('shutdownMenu');
        var startButton = document.getElementById('startButton');

        // Cek apakah yang diklik bukan bagian dari menu shutdown atau tombol Start
        if (!shutdownMenu.contains(e.target) && e.target !== startButton) {
            shutdownMenu.style.display = 'none'; // Sembunyikan menu shutdown
        }
    });

    // Menangani klik opsi shutdown
    var shutdownOption = document.getElementById('shutdownOption');
    shutdownOption.addEventListener('click', function(e) {
        e.preventDefault(); // Menghentikan aksi default dari link
        alert('Shutdown Process Placeholder!'); // Contoh: Jalankan proses shutdown
    });

    // // Menangani klik opsi restart
    // var restartOption = document.getElementById('restartOption');
    // restartOption.addEventListener('click', function(e) {
    //     e.preventDefault(); // Menghentikan aksi default dari link
    //     alert('Restart Process Placeholder!'); // Contoh: Jalankan proses restart
    // });

    // Memanggil fungsi updateClock() untuk pertama kali
    updateClock();
});

// Fungsi untuk mengupdate dan menampilkan jam real-time
function updateClock() {
    var clockElement = document.getElementById('clock');
    if (!clockElement) return; // Pastikan elemen clock tersedia

    function updateTime() {
        var currentTime = new Date();

        var hours = currentTime.getHours();
        var minutes = currentTime.getMinutes();
        var seconds = currentTime.getSeconds();

        // Format waktu menjadi HH:MM:SS AM/PM
        var amPM = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // Jam 0 diubah menjadi 12 (format 12-hour)
        minutes = minutes < 10 ? '0' + minutes : minutes; // Menambahkan leading zero pada menit
        seconds = seconds < 10 ? '0' + seconds : seconds; // Menambahkan leading zero pada detik

        var clockString = hours + ':' + minutes + ':' + seconds + ' ' + amPM;
        clockElement.textContent = clockString; // Memasukkan waktu ke dalam elemen clock
    }

    updateTime(); // Panggil updateTime() pertama kali

    // Mengupdate jam setiap detik (rekursif)
    setInterval(updateTime, 1000);
}

// Fungsi untuk membuka aplikasi chat
function openChatApp() {
    var chatApp = document.getElementById('chatApp');
    chatApp.style.display = 'block';
}

// Fungsi untuk meminimalkan aplikasi chat
function minimizeChatApp() {
    var chatApp = document.getElementById('chatApp');
    chatApp.style.display = 'none';
}

// Fungsi untuk menutup aplikasi chat
function closeChatApp() {
    var chatApp = document.getElementById('chatApp');
    chatApp.style.display = 'none';
}

// Fungsi untuk mengirim pesan
function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const messageText = messageInput.value.trim();

    if (messageText) {
        displayMessage('You', messageText); // Tampilkan pesan pengguna
        messageInput.value = ''; // Bersihkan input setelah pesan terkirim
    }
}

function loginUser(username, password) {
    return fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Authentication failed');
        }
        return response.json();
    })
    .then(data => {
        return data.token;
    })
    .catch(error => {
        console.error('Login failed:', error.message);
        return null;
    });
}

function sendMessage(token, sender, recipient, text) {
    return fetch('/api/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ sender, recipient, text })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to send message');
        }
        return response.json();
    })
    .then(data => {
        console.log('Message sent successfully:', data);
    })
    .catch(error => {
        console.error('Error sending message:', error.message);
    });
}

// Contoh penggunaan loginUser dan sendMessage
const username = 'user';
const password = 'password';

loginUser(username, password)
    .then(token => {
        if (token) {
            console.log('Login successful! Token:', token);

            // Contoh pengiriman pesan setelah login berhasil
            const sender = 'user1';
            const recipient = 'user2';
            const messageText = 'Hello there!';

            sendMessage(token, sender, recipient, messageText);
        } else {
            console.log('Login failed!');
        }
    });
