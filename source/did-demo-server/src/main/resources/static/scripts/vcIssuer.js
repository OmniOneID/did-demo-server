let vcPopup;

document.getElementById("issueForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const popupWidth = Math.min(window.innerWidth * 0.9, 700);  // 화면의 90%를 차지하거나 최대 700px
    const popupHeight = Math.min(window.innerHeight * 0.9, 900); // 화면의 90%를 차지하거나 최대 900px

    const isMobile = /Mobi|Android/i.test(navigator.userAgent);

    const url = isMobile ? '/qrPush' : '/vcPopup';
    if (vcPopup && !vcPopup.closed) {
        vcPopup.focus();
        vcPopup.document.body.innerHTML = ''; // 기존 내용을 지움
    } else {
        vcPopup = window.open(url, 'popupWindow', `width=${popupWidth},height=${popupHeight},scrollbars=yes`);
    }

});
document.getElementById('mainTitle').addEventListener('click', function() {
    window.location.href = '/home';
});