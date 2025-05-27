let vcPopup;

document.getElementById("issueForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const popupWidth = Math.min(window.innerWidth * 0.9, 700);  
    const popupHeight = Math.min(window.innerHeight * 0.9, 900); 

    const isMobile = /Mobi|Android/i.test(navigator.userAgent);

    const url = isMobile ? '/qrPush' : '/vcPopup';
    if (vcPopup && !vcPopup.closed) {
        vcPopup.focus();
        vcPopup.document.body.innerHTML = ''; 
    } else {
        vcPopup = window.open(url, 'popupWindow', `width=${popupWidth},height=${popupHeight},scrollbars=yes`);
    }

});
document.getElementById('mainTitle').addEventListener('click', function() {
    window.location.href = '/home';
});