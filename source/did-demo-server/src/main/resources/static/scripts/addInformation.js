// document.getElementById('birthdate').addEventListener('input', function(e) {
//     let input = e.target;
//     let value = input.value.replace(/\D/g, '');
//     let formattedDate = '';

//     if (value.length > 0) {
//         formattedDate = value.substring(0, 4);
//         if (value.length > 4) {
//             formattedDate += '-' + value.substring(4, 6);
//         }
//         if (value.length > 6) {
//             formattedDate += '-' + value.substring(6, 8);
//         }
//     }

//     input.value = formattedDate;

//     // Validate the date
//     let dateRegex = /^(\d{4})-(\d{2})-(\d{2})$/;
//     let match = formattedDate.match(dateRegex);

//     if (match) {
//         let year = parseInt(match[1]);
//         let month = parseInt(match[2]) - 1;
//         let day = parseInt(match[3]);
//         let date = new Date(year, month, day);

//         if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
//             input.setCustomValidity('Please enter a valid date.');
//         } else {
//             input.setCustomValidity('');
//         }
//     } else if (formattedDate.length === 10) {
//         input.setCustomValidity('Please enter a valid date in the format YYYY-MM-DD.');
//     } else {
//         input.setCustomValidity('');
//     }
// });

// function saveUserInfo() {

//     const lastname = document.getElementById('lastname').value || '';
//     const firstname = document.getElementById('firstname').value || '';
//     const birthdate = document.getElementById('birthdate').value || '';
//     const address = document.getElementById('address').value || '';
//     const licenseNum = document.getElementById('licenseNum').value || '';
//     const issueDate = document.getElementById('issueDate').value || '';


//     if (!firstname || !lastname || !birthdate || !licenseNum || !issueDate || !address) {
//         alert("Please fill in all required information. (First Name, Last Name, Date of Birth, License Number, Issue Date)");
//         return; // 함수 실행 중단
//     }
//     const did = document.getElementById('did').value || '';
//     const email = document.getElementById('email').value || '';

//     const isMobile = {
//         Android: () => navigator.userAgent.match(/Android/i) !== null,
//         iOS: () => navigator.userAgent.match(/iPhone|iPad|iPod/i) !== null,
//         any: function() {
//             return (this.Android() || this.iOS());
//         }
//     };

//     fetch('/demo/api/save-user-info', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ did, birthdate, email, address, licenseNum, issueDate, lastname, firstname})
//     }).then(response => {
//         if (response.ok) {
//             return response.json();
//         }
//         throw new Error('Network response was not ok.');
//     }).then(data => {

//         let userId = data.userId;
//         const userInfo = {
//             userId: userId,
//             username: `${lastname}${firstname}`
//         };
//         if (localStorage.getItem("vcComplete")){
//             localStorage.removeItem("vcComplete");
//         }
//         let vcComplete = "success";

//         try {
//             if (isMobile.any()) {
//                 if (isMobile.Android()) {
//                     window.android.onCompletedUserInfoUpload(JSON.stringify(userInfo));
//                 } else if (isMobile.iOS()) {
//                     window.webkit.messageHandlers.onCompletedUserInfoUpload.postMessage(JSON.stringify(userInfo));
//                 }
//             } else {
//                 localStorage.setItem('did', did);
//                 localStorage.setItem('email', email);
//                 localStorage.setItem('vcComplete', vcComplete);
//                 localStorage.setItem('userName', userInfo.username);
//             }
//             alert("User information saved successfully.");
//         } catch (e) {
//             console.error('Error calling mobile:', e);
//             alert("Error calling mobile.");
//         }

//         // window.location.href = '/home';
//     }).catch(error => {
//         console.error('There has been a problem with your fetch operation:', error);
//         alert("There has been a problem with your fetch operation.");
//     });

// }