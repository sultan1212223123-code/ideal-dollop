function openAdminMenu() {
    document.getElementById('homeScreen').classList.remove('active');
    document.getElementById('adminScreen').classList.add('active');
}

function goBack() {
    document.getElementById('adminScreen').classList.remove('active');
    document.getElementById('homeScreen').classList.add('active');
}

function adminAction(action) {
    fetch(`https://${GetParentResourceName()}/adminAction`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify({ action: action })
    });
}

window.addEventListener('message', function(event) {
    let item = event.data;
    if (item.action === 'show') {
        document.getElementById('phone').classList.remove('hidden');
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