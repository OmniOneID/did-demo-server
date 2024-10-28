let isMobile = false;

function checkMobile() {
  const width = window.innerWidth;

  if (width < 1024) {
    isMobile = true;
  } else {
    isMobile = false;
  }

  console.log("isMobile", isMobile);
}
checkMobile();

window.addEventListener("resize", checkMobile);

// 메뉴 선택
const main = document.querySelector("main");
const wrapper = document.querySelector(".wrapper");
const btnSelect = document.querySelectorAll(".btn-select");
const context = document.querySelector(".context");
const stepContent = document.querySelector(".step-content");
// const selectList = document.querySelector(".select-list");
btnSelect.forEach((item) => {
  item.addEventListener("click", (e) => {
    btnSelect.forEach((btn) => {
      btn.classList.remove("active");
    });
    const ref = item.dataset.ref;

    const contextItems = document.querySelectorAll(".context-item");
    contextItems.forEach((contextItem) => {
      context.classList.remove("show");
      contextItem.classList.remove("show");
      // selectList.classList.remove("flex-row");
    });

    const wrapper = document.querySelector(".wrapper");
    contextItems.forEach((contextItem) => {
      if (contextItem.dataset.ref === ref) {
        context.classList.add("show");
        wrapper.classList.add("active");
        contextItem.classList.add("show");
        // // selectList.classList.add("flex-row");

        if (isMobile) {
          stepContent.style.display = "none";
          main.style.bottom = "0";
        }
      }
    });

    item.classList.add("active");
  });
});

const btnTab = document.querySelectorAll(".btn-tab");
btnTab.forEach((item) => {
  item.addEventListener("click", (e) => {
    btnTab.forEach((btn) => {
      btn.classList.remove("active");
    });
    item.classList.add("active");

    const ref = item.dataset.ref;

    const itemBox = document.querySelectorAll(".item-box");
    itemBox.forEach((item) => {
      item.classList.remove("show");
    });
    itemBox.forEach((item) => {
      if (item.dataset.ref === ref) {
        item.classList.add("show");
      }
    });
  });
});

function handleReload() {
  console.log('click');
  location.reload()
}

// 팝업창위치
const pouparea = document.getElementById("PopupArea");

function handleEnterInfo(type) {
  switch (type) {
    case "사용자정보":
      window.open("/addUserInfo", "popup", "width=480,height=768");
      
      break;
    case "신분증정보":
      window.open("/addVcInfo", "popup", "width=480,height=768");
      break;

    default:
      break;
  }
}
// VC발급창 OPEN
async function openVCPopup() {

  if (isMobile) {
    try {
      // Fetch the external HTML file
      const response = await fetch("/qrPush");
      if (response.ok) {
        const externalHTML = await response.text();
        pouparea.innerHTML = externalHTML;
        getDid();
      } else {
        console.error("Failed to load the external HTML file.");
        alert("Error: Failed to load the required content. Please try again later.");
      }
    } catch (error) {
      console.error("Error fetching the external HTML file:", error);
      alert("Error: Unable to load the required content. Please check your connection and try again.");
    }
  } else {
    const userName = localStorage.getItem("userName");
    const vcComplete = localStorage.getItem("vcComplete");
    if (!userName || !vcComplete) {
      alert("User information is missing. Please ensure you have completed the registration process.");
      return;
    }
    try {
      // Fetch the external HTML file
      const response = await fetch("/vcPopup");
      if (response.ok) {
        const externalHTML = await response.text();
        pouparea.innerHTML = externalHTML;
        vcOfferRefresh();
      } else {
        console.error("Failed to load the external HTML file.");
      }
    } catch (error) {
      console.error("Error fetching the external HTML file:", error);
    }
  }
}
// 푸시알림창 OPEN
async function openPushPopup() {
  try {
    // Fetch the external HTML file
    const response = await fetch("/qrPush");
    if (response.ok) {
      const externalHTML = await response.text();
      pouparea.innerHTML = externalHTML;
      getDid();
    } else {
      console.error("Failed to load the external HTML file.");
    }
  } catch (error) {
    console.error("Error fetching the external HTML file:", error);
  }
}
// 이메일인증창 OPEN
async function openEmailPopup() {
  try {
    // Fetch the external HTML file
    const response = await fetch("/sendEmail");
    if (response.ok) {
      const externalHTML = await response.text();
      pouparea.innerHTML = externalHTML;
      getEmail();
    } else {
      console.error("Failed to load the external HTML file.");
    }
  } catch (error) {
    console.error("Error fetching the external HTML file:", error);
  }
}
// VP제출창 OPEN
async function openVPPopup() {
  try {
    // Fetch the external HTML file
    const response = await fetch("/vpPopup");
    if (response.ok) {
      const externalHTML = await response.text();
      pouparea.innerHTML = externalHTML;
      refreshImage();
    } else {
      console.error("Failed to load the external HTML file.");
    }
  } catch (error) {
    console.error("Error fetching the external HTML file:", error);
  }
}
// 팝업 CLOSE
function closePopup() {
  pouparea.innerHTML = "";
}

/////  vcPopup.js
let vcOfferQRCountdownTimer;
let vcOfferId;
async function submitCertificate() {
  try {
    const response = await fetch("/demo/api/issue-vc-result", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ offerId: vcOfferId }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }

    const data = await response.json();

    if (data.result) {
      alert("Mobile ID Issued Successfully");
      // 외부 HTML 파일 로드
      const externalResponse = await fetch("/vcSuccess");
      if (externalResponse.ok) {
        const externalHTML = await externalResponse.text();
        pouparea.innerHTML = externalHTML;
      } else {
        throw new Error("Failed to load the external HTML file.");
      }
    } else {
      // alert("모바일신분증 발급에 실패했습니다. QR을 다시 촬영해주세요.");
        alert("Failed to issue Mobile ID. Please scan the QR code again.");
    }
  } catch (error) {
    console.error("There has been a problem with your operation:", error);
    //alert("오류가 발생했습니다. 다시 시도해 주세요.");
    alert("An error occurred. Please try again.");
  }
}
// TAS 호출
function vcOfferRefresh() {
    vcOfferId="";
    fetch('/demo/api/vc-offer-refresh-call', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("responseTextArea").value = JSON.stringify(
        data,
        null,
        2
      );
      const imageData = data.qrImage;

      if (imageData) {
        const qrContainer = document.querySelector('.qr-img');
        let vcQrImage = document.getElementById("vcQrImage");
        if (!vcQrImage) {
          vcQrImage = document.createElement('img');
          vcQrImage.id = 'vcQrImage';
          vcQrImage.alt = 'Item Image';
          vcQrImage.style.maxWidth = '100%';
          vcQrImage.style.height = 'auto';
        }
        vcQrImage.src = "data:image/png;base64," + imageData;
        qrContainer.innerHTML = ''; // Clear any existing content
        qrContainer.appendChild(vcQrImage);
      }
      let validUntil = data.validUntil;
      let type = "vc";
      vcOfferId = data.offerId;
      startCountdown(validUntil, type);
    })
      .catch((error) => {
      document.getElementById("responseTextArea").value = "Error: " + error;
    });
}
function startCountdown(validUntil, type) {
  let countdownElement;
  let qrImage;
  const qrContainer = document.querySelector('.qr-img');
  if(type === "vp"){
    countdownElement = document.getElementById("vpOfferQRCountdown");
    qrImage = document.getElementById('vpQrImage');

  } else if(type === "vc"){
    countdownElement = document.getElementById("vcOfferQRCountdown");
    qrImage = document.getElementById('vcQrImage');
  }
  function updateCountdown() {
    const now = new Date().getTime();
    const validUntilTime = new Date(validUntil).getTime();
    const timeLeft = validUntilTime - now;

    if (timeLeft <= 0) {
      countdownElement.textContent = 'Expired';
      qrImage.style.display = 'none';
      qrContainer.textContent = 'Please click the Renew button';
      clearInterval(vcOfferQRCountdownTimer);
    } else {
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
      countdownElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    }
  }
  if (vcOfferQRCountdownTimer) {
    clearInterval(vcOfferQRCountdownTimer);
  }

  updateCountdown(); // 즉시 한 번 실행
  vcOfferQRCountdownTimer = setInterval(updateCountdown, 1000);
}// 1초마다 업데이트
///// vcPopup.js / END

///// qrPush.js
let countdown;
const pushButton = document.getElementById("pushButton");
const timerDisplay = document.getElementById("timer");
let now = new Date();
let offerId = "";
let did = "";

function getDid() {
  did = localStorage.getItem("did");
  if (!did) {
    document.getElementById("didDisplay").value = isMobile ? "Error loading DID" : "Please enter your DID";
  } else {
    document.getElementById("didDisplay").value = did;
  }

}
function qrPushSubmit() {
  const did = document.getElementById("didDisplay").value;
  if (did === "" || did === "Error loading DID" || did === "Please enter your DID") {
    alert("Failed to load DID.");
    return;
  }
  fetch("/demo/api/vc-offer-push", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      did: did,
    }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Network response was not ok.");
    })
    .then((data) => {
      if (data.result === "success") {
        alert("Push notification has been sent.");
        offerId = data.offerId;
        startTimer(60);
      } else {
        alert("Failed to send push notification. Please try again.");
      }
    })
    .catch((error) => {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    });
}
function startTimer(duration) {
  let timer = duration;
  pushButton.style.display = "none";
  timerDisplay.style.display = "block";

  countdown = setInterval(function () {
    let minutes = parseInt(timer / 60, 10);
    let seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    timerDisplay.textContent = minutes + ":" + seconds;

    if (--timer < 0) {
      clearInterval(countdown);
      pushButton.style.display = "inline-block";
      timerDisplay.style.display = "none";
    }
  }, 1000);
}
///// qrPush.js / END

///// sendEmail.js
function getEmail() {
  const email = localStorage.getItem("email");
  if (!email) {
    document.getElementById("emailDisplay").placeholder =
        "Please enter your email";
    return;
  }
  document.getElementById("emailDisplay").value = email;
}
function sendEmail() {
  vcOfferId = "";
  let email = document.getElementById("emailDisplay").value;
  if (email === "") {
    alert("Please enter your email.");
    return;
  }
  if (
    !email.includes("@") ||
    !email.includes(".") ||
    email.indexOf("@") > email.lastIndexOf(".")
  ) {
    alert("Invalid email format.");
    return;
  }
  // Add your fetch function here
  alert("QR code has been sent to " + email);
  fetch("/demo/api/vc-offer-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Network response was not ok.");
    })
    .then((data) => {
      offerId = data.offerId;
    })
    .catch((error) => {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    });

}
///// sendEmail.js / END

///// vpPopup.js
let vpOfferId;
function refreshImage() {
  vpOfferId="";
  fetch("/demo/api/vp-offer-refresh-call", { method: "POST" })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("responseTextArea").value = JSON.stringify(
        data,
        null,
        2
      );
      const imageData = data.qrImage;

      if (imageData) {
        const qrContainer = document.querySelector('.qr-img');
        let qrImage = document.getElementById("vpQrImage");
        if (!qrImage) {
          qrImage = document.createElement('img');
          qrImage.id = 'vpQrImage';
          qrImage.alt = 'Item Image';
          qrImage.style.maxWidth = '100%';
          qrImage.style.height = 'auto';
        }
        qrImage.src = "data:image/png;base64," + imageData;
        qrContainer.innerHTML = ''; // Clear any existing content
        qrContainer.appendChild(qrImage);
      }

      let validUntil = data.validUntil;
      let type = "vp";
      vpOfferId = data.offerId;
      startCountdown(validUntil, type);

    })
    .catch((error) => {
      document.getElementById("responseTextArea").value = "Error: " + error;
    });
}
async function submitVPComplete() {

  try {
    const response = await fetch("/demo/api/confirm-verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ offerId: vpOfferId }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }

    const data = await response.json();

    if (data.result) {
      alert("ID submission completed.");
      // 외부 HTML 파일 로드
      const externalResponse = await fetch("/success");
      if (externalResponse.ok) {
        const externalHTML = await externalResponse.text();
        pouparea.innerHTML = externalHTML;
        updateSuccessDialog(data);
      } else {
        throw new Error("Failed to load the external HTML file.");
      }
    } else {
        alert("ID submission failed. Please resubmit via QR code.");
    }
  } catch (error) {
    console.error("There has been a problem with your operation:", error);
    alert("An error occurred. Please try again.");
  }
}
function updateSuccessDialog(data) {
  const infoTable = document.querySelector('.info-table');
  if (!infoTable) {
    console.error('Info table container not found');
    return;
  }

  let tableHTML = '<table>';

  if (data.claims && Array.isArray(data.claims)) {
    data.claims.forEach(claim => {
      tableHTML += `
        <tr>
          <th>${claim.caption}</th>
          <td>${claim.value || 'No information'}</td>
        </tr>
      `;
    });
  }

  tableHTML += '</table>';

  infoTable.innerHTML = tableHTML;
}
///// vpPopup.js / END
