let currentSelectedPlayer = null;

function openPlayersMenu() {
    document.getElementById('homeScreen').classList.remove('active');
    document.getElementById('playersScreen').classList.add('active');
    loadPlayers();
}

function openAdminMenu() {
    document.getElementById('homeScreen').classList.remove('active');
    document.getElementById('adminScreen').classList.add('active');
}

function openAnnouncement() {
    document.getElementById('adminScreen').classList.remove('active');
    document.getElementById('announcementScreen').classList.add('active');
}

function openTeleport() {
    alert('وظيفة النقل قيد التطوير');
}

function openSettings() {
    document.getElementById('adminScreen').classList.remove('active');
    document.getElementById('settingsScreen').classList.add('active');
}

function goHome() {
    document.getElementById('homeScreen').classList.add('active');
    document.getElementById('playersScreen').classList.remove('active');
    document.getElementById('adminScreen').classList.remove('active');
    document.getElementById('playerDetailScreen').classList.remove('active');
    document.getElementById('announcementScreen').classList.remove('active');
    document.getElementById('settingsScreen').classList.remove('active');
}

function goToAdmin() {
    document.getElementById('announcementScreen').classList.remove('active');
    document.getElementById('settingsScreen').classList.remove('active');
    document.getElementById('adminScreen').classList.add('active');
}

function goBack() {
    document.getElementById('playersScreen').classList.remove('active');
    document.getElementById('homeScreen').classList.add('active');
}

function backToPlayers() {
    document.getElementById('playerDetailScreen').classList.remove('active');
    document.getElementById('playersScreen').classList.add('active');
}

function loadPlayers() {
    fetch(`https://${GetParentResourceName()}/getPlayers`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify({})
    }).then(r => r.json()).then(players => {
        const playersList = document.getElementById('playersList');
        playersList.innerHTML = '';
        
        if (players && players.length > 0) {
            players.forEach(player => {
                const playerEl = document.createElement('div');
                playerEl.className = 'player-item';
                playerEl.innerHTML = `
                    <div>
                        <div class="player-name">${player.name}</div>
                        <div class="player-id">ID: ${player.id}</div>
                    </div>
                    <span>→</span>
                `;
                playerEl.onclick = () => selectPlayer(player);
                playersList.appendChild(playerEl);
            });
        } else {
            playersList.innerHTML = '<p style="color: white; text-align: center;">لا توجد لاعبين</p>';
        }
    }).catch(e => {
        console.error('Error loading players:', e);
    });
}

function selectPlayer(player) {
    currentSelectedPlayer = player;
    document.getElementById('playersScreen').classList.remove('active');
    document.getElementById('playerDetailScreen').classList.add('active');
    document.getElementById('playerName').textContent = player.name;
    document.getElementById('playerId').textContent = player.id;
    document.getElementById('playerDetailName').textContent = player.name;
}

function warnPlayer() {
    const message = prompt('رسالة التحذير:');
    if (message) {
        adminAction('warn', message);
    }
}

function freezePlayer() {
    adminAction('freeze', '');
}

function kickPlayer() {
    const message = prompt('سبب الطرد:');
    if (message !== null) {
        adminAction('kick', message);
    }
}

function banPlayer() {
    const message = prompt('سبب الحظر:');
    if (message !== null) {
        adminAction('ban', message);
    }
}

function adminAction(action, message) {
    if (!currentSelectedPlayer) return;
    
    fetch(`https://${GetParentResourceName()}/adminAction`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify({
            action: action,
            targetId: currentSelectedPlayer.id,
            message: message
        })
    });
    
    alert(`تم تنفيذ: ${action}`);
    backToPlayers();
}

function sendAnnouncement() {
    const text = document.getElementById('announcementText').value;
    if (text.trim() === '') {
        alert('يجب كتابة إعلان');
        return;
    }
    
    fetch(`https://${GetParentResourceName()}/adminAction`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify({
            action: 'announcement',
            message: text
        })
    });
    
    alert('تم إرسال الإعلان');
    document.getElementById('announcementText').value = '';
    goToAdmin();
}

window.addEventListener('message', function(event) {
    let item = event.data;
    if (item.action === 'show') {
        document.getElementById('phone').classList.remove('hidden');
        loadPlayers();
    } else if (item.action === 'hide') {
        document.getElementById('phone').classList.add('hidden');
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        fetch(`https://${GetParentResourceName()}/closePhone`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({})
        });
        document.getElementById('phone').classList.add('hidden');
    }
});