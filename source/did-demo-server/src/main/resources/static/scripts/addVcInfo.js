// const isMobile = {
//     Android: () => navigator.userAgent.match(/Android/i) !== null,
//     iOS: () => navigator.userAgent.match(/iPhone|iPad|iPod/i) !== null,
//     any: function() {
//         return (this.Android() || this.iOS());
//     }
// };

// // URL에서 파라미터를 가져오는 함수
// function getUrlParameter(name) {
//     name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
//     var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
//     var results = regex.exec(location.search);
//     return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
// }

// // 페이지 로드시 URL에서 파라미터 읽기
// window.addEventListener('load', setParamsFromURL);
// function setParamsFromURL() {
//     const urlParams = new URLSearchParams(window.location.search);
//     const didParam = urlParams.get('did');
//     const nameParam = urlParams.get('userName');
//     const vcSchemaIdParam = urlParams.get('vcSchemaId');

//     // ID, 이름 설정
//     if (didParam && nameParam) {
//         const didInput = document.getElementById('did');
//         const userName = document.getElementById('userName');
//         if (didInput) {
//             didInput.value = didParam;
//         }
//         if (userName) {
//             userName.value = nameParam;
//         }
//     }

//     // VC Schema ID가 있으면 스키마 정보 가져와서 동적 폼 생성
//     if (vcSchemaIdParam) {
//         const vcSchemaIdInput = document.getElementById('vcSchemaId');
//         if (vcSchemaIdInput) {
//             vcSchemaIdInput.value = vcSchemaIdParam;
//         }

//         // 로딩 표시
//         if (document.getElementById('loadingOverlay')) {
//             document.getElementById('loadingOverlay').style.display = 'flex';
//         }

//         fetchVcSchema(vcSchemaIdParam);
//     } else {
//         setupValidationListeners();

//         if (document.getElementById('loadingOverlay')) {
//             document.getElementById('loadingOverlay').style.display = 'none';
//         }
//     }
// }

// // 폼 필드 유효성 검사
// function validateField(fieldId, value) {
//     const errorElement = document.getElementById(`${fieldId}Error`);
//     if (!errorElement) return true;

//     // 필드별 유효성 검사 규칙
//     if (!value || value.trim() === '') {
//         errorElement.textContent = `${fieldId.charAt(0).toUpperCase() + fieldId.slice(1)} is required. Please enter it.`;
//         errorElement.style.display = 'block';
//         return false;
//     }

//     // 날짜 형식 검사 (YYYY-MM-DD)
//     if (fieldId === 'birthdate' || fieldId === 'issueDate' || fieldId === 'expiryDate') {
//         const datePattern = /^\d{4}-\d{2}-\d{2}$/;
//         if (!datePattern.test(value)) {
//             errorElement.textContent = 'Please enter a date in the format YYYY-MM-DD';
//             errorElement.style.display = 'block';
//             return false;
//         }
//     }

//     errorElement.style.display = 'none';
//     return true;
// }

// // 유효성 검사 이벤트 리스너 설정
// function setupValidationListeners() {
//     const inputFields = document.querySelectorAll('.input-group input, #dynamicForm input');
//     inputFields.forEach(input => {
//         input.addEventListener('blur', function() {
//             validateField(this.id, this.value);
//         });
//     });
// }

// // VC Schema 가져오기 - 업데이트된 버전
// async function fetchVcSchema(schemaName) {
//     try {
//         const response = await fetch(`/demo/api/vc-schema/${schemaName}`);
//         if (!response.ok) {
//             throw new Error('Failed to fetch VC Schema');
//         }
//         const schema = await response.json();
//         createDynamicForm(schema);
//         if (document.getElementById('loadingOverlay')) {
//             document.getElementById('loadingOverlay').style.display = 'none';
//         }
//     } catch (error) {
//         console.error('Error fetching VC schema:', error);
//         alert('Failed to load VC Schema information. Please try again later.');

//         // 오류 발생 시 기본 폼 유지하고 로딩 숨기기
//         if (document.getElementById('loadingOverlay')) {
//             document.getElementById('loadingOverlay').style.display = 'none';
//         }
//     }
// }

// // 전체 VC Schema 목록 가져오기 (필요한 경우 사용)
// async function fetchVcSchemas() {
//     try {
//         const response = await fetch('/demo/api/vc-schemas');
//         if (!response.ok) {
//             throw new Error('Failed to fetch VC Schemas');
//         }
//         return await response.json();
//     } catch (error) {
//         console.error('Error fetching VC schemas:', error);
//         alert('Failed to load VC Schemas. Please try again later.');
//         return { vcSchemaList: [] };
//     }
// }

// // 동적 폼 생성 함수
// function createDynamicForm(schema) {
//     const formContainer = document.getElementById('dynamicForm');
//     if (!formContainer) return;

//     formContainer.innerHTML = ''; // 기존 내용 초기화

//     // 폼 제목 업데이트
//     const formTitle = document.getElementById('formTitle');
//     if (formTitle) {
//         formTitle.textContent = schema.title || 'Identification Information';
//     }

//     // 모든 claims 내의 모든 items를 추출
//     const allItems = [];
//     if (schema.vcSchema && schema.vcSchema.credentialSubject && schema.vcSchema.credentialSubject.claims) {
//         schema.vcSchema.credentialSubject.claims.forEach(claim => {
//             if (claim.items && Array.isArray(claim.items)) {
//                 claim.items.forEach(item => {
//                     allItems.push({
//                         id: item.id,
//                         caption: item.caption,
//                         type: item.type,
//                         required: item.required !== false // 기본적으로 필수로 가정
//                     });
//                 });
//             }
//         });
//     }

//     // 입력 필드 생성
//     allItems.forEach(item => {
//         const inputDiv = document.createElement('div');
//         inputDiv.className = 'input';

//         // 라벨 생성
//         const labelP = document.createElement('p');
//         labelP.textContent = item.caption;

//         // 필수 표시
//         if (item.required) {
//             const requiredSpan = document.createElement('span');
//             requiredSpan.className = 'color-error';
//             requiredSpan.textContent = '*';
//             labelP.appendChild(requiredSpan);
//         }

//         inputDiv.appendChild(labelP);

//         // 입력 요소 생성
//         const inputElement = document.createElement('input');
//         inputElement.type = item.type === 'date' ? 'text' : (item.type || 'text');
//         inputElement.id = item.id;
//         inputElement.name = item.id;
//         inputElement.placeholder = `Enter ${item.caption}`;
//         inputElement.required = item.required;
//         inputElement.setAttribute('data-caption', item.caption);

//         // 날짜 형식 필드에 대한 속성 추가
//         if (item.type === 'date') {
//             inputElement.pattern = "\\d{4}-\\d{2}-\\d{2}";
//             inputElement.title = "Please enter a date in the format YYYY-MM-DD";
//             inputElement.placeholder = "YYYY-MM-DD";
//         }

//         inputDiv.appendChild(inputElement);
//         formContainer.appendChild(inputDiv);

//         // 에러 메시지 요소 추가
//         const errorDiv = document.createElement('div');
//         errorDiv.id = `${item.id}Error`;
//         errorDiv.className = 'error-valid-message';
//         formContainer.appendChild(errorDiv);
//     });

//     // 유효성 검사 이벤트 리스너 설정
//     setupValidationListeners();
// }

// // 데이터 저장
// function saveVcInfo() {
//     let formData = {};
//     let hasError = false;

//     // VC Schema ID 확인
//     const vcSchemaId = document.getElementById('vcSchemaId')?.value;

//     if (vcSchemaId) {
//         // 동적 폼에서 데이터 수집
//         const inputs = document.querySelectorAll('#dynamicForm input');
//         inputs.forEach(input => {
//             // 유효성 검사
//             if (!validateField(input.id, input.value)) {
//                 hasError = true;
//             }

//             if (input.id) {
//                 formData[input.id] = input.value || '';
//             }
//         });
//     } else {
//         // 기본 폼에서 데이터 수집
//         const birthdate = document.getElementById('birthdate').value || '';
//         const address = document.getElementById('address').value || '';
//         const licenseNum = document.getElementById('licenseNum').value || '';
//         const issueDate = document.getElementById('issueDate').value || '';

//         const birthdateError = document.getElementById('birthdateError');
//         const addressError = document.getElementById('addressError');
//         const issueDateError = document.getElementById('issueDateError');
//         const licenseNumError = document.getElementById('licenseNumError');

//         // Reset error messages
//         birthdateError.style.display = 'none';
//         addressError.style.display = 'none';
//         issueDateError.style.display = 'none';
//         licenseNumError.style.display = 'none';

//         if (!birthdate) {
//             birthdateError.textContent = 'Birthdate is required. Please enter it.';
//             birthdateError.style.display = 'block';
//             hasError = true;
//         }

//         if (!address) {
//             addressError.textContent = 'Address is required. Please enter it.';
//             addressError.style.display = 'block';
//             hasError = true;
//         }

//         if (!licenseNum) {
//             licenseNumError.textContent = 'License Number is required. Please enter it.';
//             licenseNumError.style.display = 'block';
//             hasError = true;
//         }

//         if (!issueDate) {
//             issueDateError.textContent = 'Issue Date is required. Please enter it.';
//             issueDateError.style.display = 'block';
//             hasError = true;
//         }

//         formData = {
//             birthdate,
//             address,
//             licenseNum,
//             issueDate
//         };
//     }

//     if (hasError) {
//         return;
//     }

//     // 기본 필드 추가
//     const did = document.getElementById('did').value || '';
//     const userName = document.getElementById('userName').value || '';

//     const data = {
//         ...formData,
//         did,
//         userName
//     };

//     if (vcSchemaId) {
//         data.vcSchemaId = vcSchemaId;
//     }

//     // 로딩 표시
//     if (document.getElementById('loadingOverlay')) {
//         document.getElementById('loadingOverlay').style.display = 'flex';
//     }

//     // API 엔드포인트 결정 (스키마 ID 유무에 따라)
//     //const apiEndpoint = vcSchemaId ? '/demo/api/save-vc-schema-info' : '/demo/api/save-vc-info';
//     const apiEndpoint = '/demo/api/save-user-info';

//     fetch(apiEndpoint, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(data)
//     })
//         .then(response => {
//             if (!response.ok) {
//                 return response.json().then(err => { throw err; });
//             }
//             return response.json();
//         })
//         .then(data => {
//             console.log(data);
//             window.android.onCompletedAddVcUpload();
//             // 로딩 숨기기
//             if (document.getElementById('loadingOverlay')) {
//                 document.getElementById('loadingOverlay').style.display = 'none';
//             }

//             if (isMobile.any()) {
//                 if (isMobile.Android()) {
//                     // Android 네이티브 앱에 완료 메시지 전송
//                     if (window.android) {
//                         window.android.onCompletedAddVcUpload();
//                     }
//                 } else if (isMobile.iOS()) {
//                     // iOS 네이티브 앱에 완료 메시지 전송
//                     alert('The ID information has been saved');
//                     if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.onCompletedAddVcUpload) {
//                         window.webkit.messageHandlers.onCompletedAddVcUpload.postMessage("success");
//                     }
//                 }
//             } else {
//                 alert('ID information has been saved');
//             }
//         })
//         .catch(error => {         
//             console.error(error);

//             // 로딩 숨기기
//             if (document.getElementById('loadingOverlay')) {
//                 document.getElementById('loadingOverlay').style.display = 'none';
//             }

//             if (isMobile.any()) {
//                 if (isMobile.Android()) {
//                     // Android 네이티브 앱에 실패 메시지 전송
//                     if (window.android) {
//                         window.android.onFailedAddVcUpload();
//                     }
//                 } else if (isMobile.iOS()) {
//                     // iOS 네이티브 앱에 실패 메시지 전송
//                     alert('Failed to save ID information');
//                     if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.onFailedAddVcUpload) {
//                         window.webkit.messageHandlers.onFailedAddVcUpload.postMessage("failed");
//                     }
//                 }
//             } else {
//                 alert(error.message || 'Failed to save ID information');
//             }
//         });
// }