function saveMobileUserInfo() {
    const lastname = document.getElementById('lastName').value.trim();
    const firstname = document.getElementById('firstName').value.trim();
    const lastNameError = document.getElementById('lastNameError');
    const firstNameError = document.getElementById('firstNameError');

    // Reset error messages
    lastNameError.style.display = 'none';
    firstNameError.style.display = 'none';

    let hasError = false;

    if (!lastname) {
        lastNameError.textContent = 'Last name is required. Please enter it.';
        lastNameError.style.display = 'block';
        hasError = true;
    }

    if (!firstname) {
        firstNameError.textContent = 'First name is required. Please enter it.';
        firstNameError.style.display = 'block';
        hasError = true;
    }

    if (hasError) {
        return;
    }

    // The rest of the function remains the same
    fetch('/demo/api/save-user-info', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ lastname, firstname })
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw err; });
            }
            return response.json();
        }).then(data => {
        console.log(data);
        let userId = data.userId;
        const userInfo = {
            userId: userId,
            username: `${lastname}${firstname}`
        };
        try {
            if (isMobile.any()) {
                if (isMobile.Android()) {
                    window.android.onCompletedUserInfoUpload(JSON.stringify(userInfo));
                } else if (isMobile.iOS()) {
                    window.webkit.messageHandlers.onCompletedUserInfoUpload.postMessage(JSON.stringify(userInfo));
                }
            } else {
                localStorage.setItem('userName', userInfo.username);
            }
            showMobileAlert("User information saved successfully.");
        } catch (e) {
            console.error('Error calling mobile:', e);
            showMobileAlert("Error: Failed to save user information.");
        }
    }).catch(error => {
        console.error(error);
        if (isMobile.any()) {
            if (isMobile.Android()) {
                window.android.onFailedUserInfoUpload();
            } else if (isMobile.iOS()) {
                window.webkit.messageHandlers.onFailedUserInfoUpload.postMessage();
            }
        }
        showMobileAlert("Error: " + (error.message || "Failed to save user information."));
        console.error('There has been a problem with your fetch operation:', error);
    });
}


function showMobileAlert(message) {
    if (isMobile.Android()) {
        // Try different possible interfaces
        if (typeof window.android !== 'undefined' && typeof window.android.showAlert === 'function') {
            window.android.showAlert(message);
        } else if (typeof window.Android !== 'undefined' && typeof window.Android.showAlert === 'function') {
            window.Android.showAlert(message);
        } else {
            console.log("Android alert:", message);  // Fallback to console.log
        }
    } else if (isMobile.iOS()) {
        // Try different possible interfaces
        if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.showAlert) {
            window.webkit.messageHandlers.showAlert.postMessage(message);
        } else if (typeof window.showAlert === 'function') {
            window.showAlert(message);
        } else {
            console.log("iOS alert:", message);  // Fallback to console.log
        }
    } else {
        alert(message);  // Fallback for non-mobile environments
    }
}

// isMobile 객체 정의 (이전과 동일)
const isMobile = {
    Android: () => navigator.userAgent.match(/Android/i) !== null,
    iOS: () => navigator.userAgent.match(/iPhone|iPad|iPod/i) !== null,
    any: function() {
        return (this.Android() || this.iOS());
    }
};