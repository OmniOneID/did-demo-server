const isMobile = {
    Android: () => navigator.userAgent.match(/Android/i) !== null,
    iOS: () => navigator.userAgent.match(/iPhone|iPad|iPod/i) !== null,
    any: function() {
        return (this.Android() || this.iOS());
    }
};

window.addEventListener('load', setIdNameFromURL);
function setIdNameFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const didParam = urlParams.get('did');
    const nameParam = urlParams.get('userName');
    if (didParam && nameParam) {
        const didInput = document.getElementById('did');
        const userName = document.getElementById('userName');
        if (didInput) {
            didInput.value = didParam;
        }
        if (userName) {
            userName.value = nameParam;
        }

    }
}

function saveVcInfo() {
    const birthdate = document.getElementById('birthdate').value || '';
    const address = document.getElementById('address').value || '';
    const licenseNum = document.getElementById('licenseNum').value || '';
    const issueDate = document.getElementById('issueDate').value || '';
    const did = document.getElementById('did').value || '';
    const userName = document.getElementById('userName').value || '';

    const birthdateError = document.getElementById('birthdateError');
    const addressError = document.getElementById('addressError');
    const issueDateError = document.getElementById('issueDateError');
    const licenseNumError = document.getElementById('licenseNumError');

    // Reset error messages
    birthdateError.style.display = 'none';
    addressError.style.display = 'none';
    issueDateError.style.display = 'none';
    licenseNumError.style.display = 'none';

    let hasError = false;

    if (!birthdate) {
        birthdateError.textContent = 'Birthdate is required. Please enter it.';
        birthdateError.style.display = 'block';
        hasError = true;
    }

    if (!address) {
        addressError.textContent = 'Address is required. Please enter it.';
        addressError.style.display = 'block';
        hasError = true;
    }

    if (!licenseNum) {
        licenseNumError.textContent = 'License Number is required. Please enter it.';
        licenseNumError.style.display = 'block';
        hasError = true;
    }

    if (!issueDate) {
        issueDateError.textContent = 'Issue Date is required. Please enter it.';
        issueDateError.style.display = 'block';
        hasError = true;
    }


    if (hasError) {
        return;
    }

    const data = {
        birthdate,
        address,
        licenseNum,
        issueDate,
        did,
        userName
    };

    fetch('/demo/api/save-vc-info', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {throw err;});
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            if (isMobile.any()) {
                if (isMobile.Android()) {
                    window.android.onCompletedAddVcUpload();
                } else if (isMobile.iOS()) {
                    // alert("ios에서 Vc 저장 성공");
                    alert('The ID information has been saved');
                    window.webkit.messageHandlers.onCompletedAddVcUpload.postMessage("success");
                }
            } else {
                //alert('신분증 정보가 저장되었습니다');
                alert('ID information has been saved');
            }

        })
        .catch(error => {
            console.error(error);
            if (isMobile.any()) {
                if (isMobile.Android()) {
                    window.android.onFailedAddVcUpload();
                } else if (isMobile.iOS()) {
                    // alert("ios에서 Vc 저장 실패");
                    alert('Failed to save ID information');
                    window.webkit.messageHandlers.onFailedAddVcUpload.postMessage("failed");
                }
            } else {
                alert(error.message);
            }
        });
}