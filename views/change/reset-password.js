//bring all your element to the DOM
    const form = document.getElementById('form');
    const newPassword = document.getElementById('new-password');
    const confirmPassword = document.getElementById('confirm-password');
    const email = new URLSearchParams(window.location.search).get('email');
    
    function notify(msg, type) {
                    const n = document.getElementById('notification');
                    n.textContent = msg;
                    n.className = `notification ${type}`;
                    n.style.display = 'block';
                    setTimeout(() => n.style.display = 'none', 5000);
        }

form.addEventListener('submit', async function (e) {
    e.preventDefault();
    if (newPassword.value !== confirmPassword.value) {
        notify('Passwords do not match. Please try again.', 'error');
        confirmPassword.focus();
        return
    }

    const result =await fetch('https://adefemecommerce.onrender.com/api/users/changepassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email || sessionStorage.getItem('email'),
            newPassword: newPassword.value
        })
    })
    console.log(result)
    const data = await result.json();
    console.log(data)
    if (result.ok) {
        notify('Password changed successfully. You can now log in with your new password.','success');
        window.location.href = '../login.html';
    } else {
        notify(`Error changing password: ${data.message}`, 'error');
    }
})

