let vcPopup;
document.getElementById("vpSubmitButton").addEventListener("click", function(event) {
    event.preventDefault();

    if (vcPopup && !vcPopup.closed) {
        vcPopup.focus();
        vcPopup.document.body.innerHTML = ''; 
    } else {
        vcPopup = window.open('/vpPopup', 'popupWindow', 'width=700,height=900,scrollbars=yes');
    }

});
document.getElementById('mainTitle').addEventListener('click', function() {
    window.location.href = '/home';
});