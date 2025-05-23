
const AppState = {
  userInfo: null,
  serverSettings: null,
  vcSchemaData: null,
  
  // 앱 초기화 함수
  async init() {
    try {
      await this.loadUserInfo();
      await this.loadServerSettings();
      await this.loadVcSchemas();
      console.log('App state initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize app state:', error);
      return false;
    }
  },
  
  // 사용자 정보 로드
  async loadUserInfo() {
    try {
      const response = await fetch('/demo/api/user-info');
      if (response.status === 404) {
        this.userInfo = {};
        return null;
      }
      if (!response.ok) throw new Error('Failed to load user information');
      this.userInfo = await response.json();
      return this.userInfo;
    } catch (error) {
      console.error('Error loading user information:', error);
      this.userInfo = {}; // 기본값 설정
      return null;
    }
  },
  
  // 서버 설정 로드
  async loadServerSettings() {
    try {
      const response = await fetch('/demo/api/server-settings');
      if (response.status === 404) {
        this.serverSettings = {};
        return null;
      }
      if (!response.ok) throw new Error('Failed to load server settings');
      this.serverSettings = await response.json();
      return this.serverSettings;
    } catch (error) {
      console.error('Error loading server settings:', error);
      this.serverSettings = {}; // 기본값 설정
      return null;
    }
  },
  
  // VC Schema 데이터 로드
  async loadVcSchemas() {
    try {
      const response = await fetch('/demo/api/vc-schemas');
      if (!response.ok) throw new Error('Failed to fetch VC Schemas');
      
      const data = await response.json();
      this.vcSchemaData = data.vcSchemaList || [];
      return this.vcSchemaData;
    } catch (error) {
      console.error('Error fetching VC schemas:', error);
      this.vcSchemaData = [];
      return [];
    }
  },
  
  // getter 메서드들
  getDid() {
    return this.userInfo?.did || '';
  },
  
  getEmail() {
    return this.userInfo?.email || '';
  },
  
  getUserName() {
    if (!this.userInfo) return '';
    return `${this.userInfo.lastname || ''} ${this.userInfo.firstname || ''}`.trim();
  },
  
  getVcPlanIssuance() {
    return this.serverSettings?.vcPlan || '';
  },
  
  getVpPolicy() {
    return this.serverSettings?.vpPolicy || '';
  }
};

// 모바일 감지
let isMobile = false;

function checkMobile() {
  const width = window.innerWidth;
  isMobile = width < 1024;
  console.log("isMobile", isMobile);
}

// 페이지 로드 시 초기화 함수
async function initPage() {
  showLoading();
  
  try {
    // 앱 상태 초기화
    await AppState.init();
    
    // UI 요소 초기화
    updateUserGreeting();
    populateVcSchemaSelect();
    populateFormWithSavedData();
    populateServerSettingsForm();
    
    // UI 이벤트 리스너 설정
    setupEventListeners();
  } catch (error) {
    console.error('Error initializing page:', error);
  } finally {
    hideLoading();
  }
}

// UI 이벤트 리스너 설정
function setupEventListeners() {
  // 메뉴 선택 리스너
  const btnSelect = document.querySelectorAll(".btn-select");
  btnSelect.forEach((item) => {
    item.addEventListener("click", handleMenuSelection);
  });
  
  // 탭 선택 리스너
  const btnTab = document.querySelectorAll(".btn-tab");
  btnTab.forEach((item) => {
    item.addEventListener("click", handleTabSelection);
  });
  
  // VC Schema 변경 리스너
  const vcSchemaSelect = document.getElementById('vcSchema');
  if (vcSchemaSelect) {
    vcSchemaSelect.addEventListener('change', displayIdentificationForm);
  }
}

// 메뉴 선택 처리
function handleMenuSelection(e) {
  const btnSelect = document.querySelectorAll(".btn-select");
  const context = document.querySelector(".context");
  const main = document.querySelector("main");
  const stepContent = document.querySelector(".step-content");
  const wrapper = document.querySelector(".wrapper");
  
  btnSelect.forEach((btn) => {
    btn.classList.remove("active");
  });
  
  const ref = this.dataset.ref;
  this.classList.add("active");
  
  const contextItems = document.querySelectorAll(".context-item");
  contextItems.forEach((contextItem) => {
    context.classList.remove("show");
    contextItem.classList.remove("show");
  });
  
  contextItems.forEach((contextItem) => {
    if (contextItem.dataset.ref === ref) {
      context.classList.add("show");
      wrapper.classList.add("active");
      contextItem.classList.add("show");
      
      if (isMobile) {
        stepContent.style.display = "none";
        main.style.bottom = "0";
      }
    }
  });
}

// 탭 선택 처리
function handleTabSelection(e) {
  const btnTab = document.querySelectorAll(".btn-tab");
  btnTab.forEach((btn) => {
    btn.classList.remove("active");
  });
  this.classList.add("active");
  
  const ref = this.dataset.ref;
  
  const itemBox = document.querySelectorAll(".item-box");
  itemBox.forEach((item) => {
    item.classList.remove("show");
  });
  itemBox.forEach((item) => {
    if (item.dataset.ref === ref) {
      item.classList.add("show");
    }
  });
}

// 사용자 환영 메시지 업데이트
function updateUserGreeting() {
  const greetingElement = document.getElementById('userGreeting');
  if (!greetingElement) return;
  
  const userName = AppState.getUserName();
  if (userName) {
    greetingElement.textContent = `${userName} 님 반갑습니다!`;
  } else {
    greetingElement.textContent = '반갑습니다! 사용자 정보를 입력해주세요!';
  }
}

// VC Schema 선택 상자 채우기
function populateVcSchemaSelect() {
  const schemas = AppState.vcSchemaData;
  if (!schemas || schemas.length === 0) return;
  
  const selectElement = document.getElementById('vcSchema');
  if (!selectElement) return;
  
  // 기존 옵션 초기화 (첫 번째 기본 옵션은 유지)
  while (selectElement.options.length > 1) {
    selectElement.remove(1);
  }
  
  // 새 옵션 추가
  schemas.forEach((schema, index) => {
    const option = document.createElement('option');
    option.value = index; // 인덱스를 값으로 사용
    option.textContent = schema.title;
    selectElement.appendChild(option);
  });
}

// 저장된 사용자 정보로 폼 채우기
function populateFormWithSavedData() {
  const userInfo = AppState.userInfo;
  if (!userInfo || !userInfo.firstname) return;
  
  // 기본 사용자 정보 채우기
  const firstnameInput = document.getElementById('firstname');
  const lastnameInput = document.getElementById('lastname');
  const didInput = document.getElementById('did');
  const emailInput = document.getElementById('email');
  
  if (firstnameInput) firstnameInput.value = userInfo.firstname || '';
  if (lastnameInput) lastnameInput.value = userInfo.lastname || '';
  if (didInput) didInput.value = userInfo.did || '';
  if (emailInput) emailInput.value = userInfo.email || '';
  
  // 스키마 선택 및 동적 폼 생성
  if (userInfo.vcSchemaId && AppState.vcSchemaData) {
    let schemaIndex = userInfo.vcSchemaIndex;
    
    if (schemaIndex === undefined || !AppState.vcSchemaData[schemaIndex] || 
        AppState.vcSchemaData[schemaIndex].schemaId !== userInfo.vcSchemaId) {
      schemaIndex = AppState.vcSchemaData.findIndex(schema => schema.schemaId === userInfo.vcSchemaId);
    }
    
    if (schemaIndex >= 0) {
      const selectElement = document.getElementById('vcSchema');
      if (selectElement) {
        selectElement.value = schemaIndex;
        createDynamicForm(schemaIndex);
        
        // 필드 값 채우기
        setTimeout(() => {
          if (userInfo.fields) {
            Object.keys(userInfo.fields).forEach(key => {
              const input = document.getElementById(key);
              if (input) {
                input.value = userInfo.fields[key];
              }
            });
          }
        }, 300);
      }
    }
  }
}

// 서버 설정 폼 채우기
function populateServerSettingsForm() {
  const settings = AppState.serverSettings;
  if (!settings) return;
  
  const tasServerInput = document.getElementById('tasServer');
  const issuerServerInput = document.getElementById('issuerServer');
  const caServerInput = document.getElementById('caServer');
  const verifierServerInput = document.getElementById('verifierServer');
  const vcPlanInput = document.getElementById('vcPlanIssuance');
  const vpPolicyInput = document.getElementById('vpPolicySubmission');
  
  if (tasServerInput && settings.tasServer) tasServerInput.value = settings.tasServer;
  if (issuerServerInput && settings.issuerServer) issuerServerInput.value = settings.issuerServer;
  if (caServerInput && settings.caServer) caServerInput.value = settings.caServer;
  if (verifierServerInput && settings.verifierServer) verifierServerInput.value = settings.verifierServer;
  if (vcPlanInput && settings.vcPlan) {
    vcPlanInput.value = settings.vcPlanName || settings.vcPlan;
    vcPlanInput.setAttribute('data-id', settings.vcPlan);
  }
  if (vpPolicyInput && settings.vpPolicy) {
    vpPolicyInput.value = settings.vpPolicyName || settings.vpPolicy;
    vpPolicyInput.setAttribute('data-id', settings.vpPolicy);
  }
}

// 동적 폼 생성
function createDynamicForm(schemaIndex) {
  const schemas = AppState.vcSchemaData;
  
  // 선택된 스키마가 없거나 잘못된 경우 처리
  if (!schemas || schemaIndex === "" || !schemas[schemaIndex]) {
    const formsContainer = document.getElementById('identificationForms');
    if (formsContainer) formsContainer.style.display = 'none';
    return;
  }
  
  const schema = schemas[schemaIndex];
  const formsContainer = document.getElementById('identificationForms');
  if (!formsContainer) return;
  
  // 폼 컨테이너 표시
  formsContainer.style.display = 'block';
  formsContainer.innerHTML = ''; // 기존 내용 초기화
  
  // 폼 생성
  const formDiv = document.createElement('div');
  formDiv.className = 'identification-form';
  
  // 제목 추가
  const titleDiv = document.createElement('div');
  titleDiv.className = 'label';
  titleDiv.innerHTML = `
    <p>${schema.title}</p>
    <div class="divider"></div>
  `;
  formDiv.appendChild(titleDiv);
  
  // 입력 필드 그룹 생성
  const inputGroupDiv = document.createElement('div');
  inputGroupDiv.className = 'input-group';
  
  // 모든 클레임과 네임스페이스 정보 수집
  if (schema.vcSchema && schema.vcSchema.credentialSubject && schema.vcSchema.credentialSubject.claims) {
    schema.vcSchema.credentialSubject.claims.forEach(claim => {
      // 네임스페이스 정보 가져오기
      const namespace = claim.namespace ? claim.namespace.id : '';
      
      if (claim.items && Array.isArray(claim.items)) {
        claim.items.forEach(item => {
          const inputDiv = document.createElement('div');
          inputDiv.className = 'input';
          
          // 라벨 생성
          const labelP = document.createElement('p');
          labelP.textContent = item.caption || item.id;
          
          // 필수 표시 (모든 필드를 필수로 가정)
          const requiredSpan = document.createElement('span');
          requiredSpan.className = 'color-error';
          requiredSpan.textContent = '*';
          labelP.appendChild(requiredSpan);
          
          inputDiv.appendChild(labelP);
          
          // 입력 요소 생성
          const inputElement = document.createElement('input');
          inputElement.type = item.type === 'number' ? 'number' : 'text';
          
          // 중요: ID를 namespace.id 형태로 설정
          const fieldId = namespace ? `${namespace}.${item.id}` : item.id;
          
          inputElement.id = fieldId;
          inputElement.name = fieldId;
          inputElement.placeholder = `Enter ${item.caption || item.id}`;
          inputElement.required = true;
          inputElement.setAttribute('data-caption', item.caption || item.id);
          inputElement.setAttribute('data-original-id', item.id);
          inputElement.setAttribute('data-namespace', namespace);
          
          inputDiv.appendChild(inputElement);
          inputGroupDiv.appendChild(inputDiv);
        });
      }
    });
  }
  
  formDiv.appendChild(inputGroupDiv);
  formsContainer.appendChild(formDiv);
}

function displayIdentificationForm() {
  const vcSchema = document.getElementById('vcSchema').value;
  createDynamicForm(vcSchema);
}

// 사용자 정보 저장
async function saveUserInfo() {
  const schemaSelect = document.getElementById('vcSchema');
  if (!schemaSelect) return;
  
  const schemaIndex = schemaSelect.value;
  
  // 스키마가 선택되지 않은 경우
  if (!schemaIndex || schemaIndex === "") {
    alert('Please select a credential type');
    return;
  }
  
  const schemas = AppState.vcSchemaData;
  if (!schemas || !schemas[schemaIndex]) {
    alert('Invalid credential type');
    return;
  }
  
  const schema = schemas[schemaIndex];
  
  // 기본 사용자 정보
  const firstname = document.getElementById('firstname')?.value || '';
  const lastname = document.getElementById('lastname')?.value || '';
  const did = document.getElementById('did')?.value || '';
  const email = document.getElementById('email')?.value || '';
  
  // 기본 유효성 검사
  if (!firstname || !lastname) {
    alert('Please enter required user information');
    return;
  }
  
  // 사용자 정보 객체 생성
  const userInfo = {
    firstname,
    lastname,
    did,
    email,
    vcSchemaId: schema.schemaId,
    vcSchemaTitle: schema.title,
    vcSchemaIndex: schemaIndex // 나중에 폼 자동 생성을 위해 인덱스 저장
  };
  
  const dynamicFields = {};
  const inputs = document.querySelectorAll('#identificationForms input');
  
  // 각 입력 필드를 순회하면서 namespace.id 형태의 키로 값을 저장
  inputs.forEach(input => {
    if (input.id && input.value) {
      dynamicFields[input.id] = input.value;
    } else if (input.required) {
      alert(`Please fill out all required fields: ${input.getAttribute('data-caption') || input.name}`);
      throw new Error('Required fields missing');
    }
  });
  
  userInfo.fields = dynamicFields;
  
  try {
    showLoading();
    
    const response = await fetch('/demo/api/save-user-info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userInfo)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to save user information');
    }
    
    // 로컬 상태 업데이트
    AppState.userInfo = userInfo;
    updateUserGreeting();
    
    alert('User information saved successfully!');
  } catch (error) {
    console.error('Error saving user information:', error);
    if (error.message !== 'Required fields missing') {
      alert('Failed to save user information. Please try again.');
    }
  } finally {
    hideLoading();
  }
}

// 서버 설정 저장
async function saveServerSettings() {
  // 서버 설정 값 가져오기
  const tasServer = document.getElementById('tasServer')?.value || '';
  const issuerServer = document.getElementById('issuerServer')?.value || '';
  const caServer = document.getElementById('caServer')?.value || '';
  const verifierServer = document.getElementById('verifierServer')?.value || '';
  
  // 정책 설정 값 가져오기
  const vcPlanInput = document.getElementById('vcPlanIssuance');
  const vpPolicyInput = document.getElementById('vpPolicySubmission');
  
  const vcPlan = vcPlanInput ? vcPlanInput.getAttribute('data-id') || vcPlanInput.value : '';
  const vcPlanName = vcPlanInput ? vcPlanInput.value : '';
  
  const vpPolicy = vpPolicyInput ? vpPolicyInput.getAttribute('data-id') || vpPolicyInput.value : '';
  const vpPolicyName = vpPolicyInput ? vpPolicyInput.value : '';

  // 기본 유효성 검사
  if (!tasServer || !issuerServer || !caServer || !verifierServer) {
    alert('Please enter all server URLs');
    return;
  }

  // 설정 객체 생성
  const settings = {
    tasServer,
    issuerServer,
    caServer,
    verifierServer,
    vcPlan,
    vcPlanName,
    vpPolicy,
    vpPolicyName
  };

  try {
    showLoading();
    
    const response = await fetch('/demo/api/server-settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings)
    });

    if (!response.ok) {
      throw new Error('Failed to save server settings');
    }
    
    // 로컬 상태 업데이트
    AppState.serverSettings = settings;
    
    alert('Server settings saved successfully!');
  } catch (error) {
    console.error('Error saving server settings:', error);
    alert('Failed to save server settings. Please try again.');
  } finally {
    hideLoading();
  }
}

// 연결 테스트
async function testConnection() {
  const tasServer = document.getElementById('tasServer')?.value || '';
  const issuerServer = document.getElementById('issuerServer')?.value || '';
  const caServer = document.getElementById('caServer')?.value || '';
  const verifierServer = document.getElementById('verifierServer')?.value || '';

  if (!tasServer || !issuerServer || !caServer || !verifierServer) {
    alert('Please enter all server URLs to test connections');
    return;
  }

  const settings = {
    tasServer,
    issuerServer,
    caServer,
    verifierServer
  };

  try {
    showLoading();
    
    const response = await fetch('/demo/api/test-connection', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings)
    });

    if (!response.ok) {
      throw new Error('Connection test failed');
    }

    const results = await response.json();

    if (results.allSuccess) {
      alert('All server connections successful!');
    } else {
      const failedServers = results.results
        .filter(result => !result.success)
        .map(result => result.server);
      alert(`Connection failed for: ${failedServers.join(', ')}. Please check your server settings and try again.`);
    }
  } catch (error) {
    console.error('Error testing connections:', error);
    alert('Failed to test connections. Please try again.');
  } finally {
    hideLoading();
  }
}

// VC Plan 검색
async function searchVcPlanIssuance() {
  try {
    showLoading();
    
    const response = await fetch('/demo/api/vc-plans');
    if (!response.ok) throw new Error('Failed to fetch VC Plans');
    
    const data = await response.json();
    const vcPlans = data || [];
    
    hideLoading();
    
    if (vcPlans.length === 0) {
      alert('No VC plans available. Please try again later.');
      return;
    }
    
    // 검색 팝업 생성
    const popup = document.createElement('div');
    popup.className = 'search-popup';
    
    let popupContent = `
      <div class="search-popup-content">
        <h3>Select VC Plan</h3>
        <div class="search-input-container">
          <input type="text" id="vcPlanSearch" placeholder="Search VC plan..." class="search-popup-input" oninput="filterVcPlans()">
        </div>
        <div class="search-results" id="vcPlanResults">
    `;
    
    // 각 VC Plan에 대한 옵션 추가
    vcPlans.forEach((plan, index) => {
      const displayName = plan.name || plan.vcPlanId;
      popupContent += `
        <div class="search-option" data-index="${index}">
          <input type="radio" id="vcplan_${index}" name="vcPlanSelection" value="${plan.vcPlanId}">
          <label for="vcplan_${index}">${displayName}</label>
        </div>
      `;
    });
    
    popupContent += `
        </div>
        <div class="search-popup-buttons">
          <button class="btn-secondary" onclick="closeSearchPopup()">Cancel</button>
          <button class="btn-primary" onclick="selectVcPlan()">Select</button>
        </div>
      </div>
    `;
    
    popup.innerHTML = popupContent;
    document.body.appendChild(popup);
    
    // 팝업 데이터 저장
    window._popupData = {
      items: vcPlans,
      type: 'vcplan'
    };
    
  } catch (error) {
    hideLoading();
    console.error('Error searching VC plans:', error);
    alert('Failed to load VC plans. Please try again later.');
  }
}

// VC Plan 선택
function selectVcPlan() {
  if (!window._popupData || window._popupData.type !== 'vcplan') return;
  
  const selected = document.querySelector('input[name="vcPlanSelection"]:checked');
  if (!selected) {
    alert('Please select a VC Plan');
    return;
  }
  
  const index = parseInt(selected.closest('.search-option').getAttribute('data-index'));
  const plan = window._popupData.items[index];
  
  if (!plan) {
    alert('Selected plan not found');
    return;
  }
  
  // UI 업데이트
  const vcPlanInput = document.getElementById('vcPlanIssuance');
  if (vcPlanInput) {
    vcPlanInput.value = plan.name || plan.vcPlanId;
    vcPlanInput.setAttribute('data-id', plan.vcPlanId);
  }
  
  // 서버에 현재 VC Plan 저장
  saveCurrentVcPlan(plan);
  
  closeSearchPopup();
}

async function saveCurrentVcPlan(plan) {
  try {
    showLoading();
    
    const response = await fetch('/demo/api/current-vc-plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        vcPlanId: plan.vcPlanId,
        manager: plan.manager || ''
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to update current VC Plan');
    }
    
    // AppState 객체 업데이트 (있는 경우)
    if (typeof AppState !== 'undefined') {
      if (!AppState.serverSettings) AppState.serverSettings = {};
      AppState.serverSettings.vcPlan = plan.vcPlanId;
      AppState.serverSettings.vcPlanName = plan.name || plan.vcPlanId;
    }
    
    console.log('Selected VC Plan saved:', plan.vcPlanId);
  } catch (error) {
    console.error('Error saving current VC Plan:', error);
    alert('Failed to save VC Plan selection. Please try again.');
  } finally {
    hideLoading();
  }
}

async function searchVpPolicy() {
  try {
    showLoading();
    
    const response = await fetch('/demo/api/vp-policies');
    if (!response.ok) throw new Error('Failed to fetch VP Policies');
    
    const data = await response.json();
    const vpPolicies = data || [];
    
    hideLoading();
    
    if (vpPolicies.length === 0) {
      alert('No VP policies available. Please try again later.');
      return;
    }
    
    // 검색 팝업 생성
    const popup = document.createElement('div');
    popup.className = 'search-popup';
    
    let popupContent = `
      <div class="search-popup-content">
        <h3>Select VP Policy</h3>
        <div class="search-input-container">
          <input type="text" id="vpPolicySearch" placeholder="Search VP policy..." class="search-popup-input" oninput="filterVpPolicies()">
        </div>
        <div class="search-results" id="vpPolicyResults">
    `;
    
    // 각 VP Policy에 대한 옵션 추가
    vpPolicies.forEach((policy, index) => {
      const displayName = policy.policyTitle || policy.policyId;
      popupContent += `
        <div class="search-option" data-index="${index}">
          <input type="radio" id="vppolicy_${index}" name="vpPolicySelection" value="${policy.policyId}">
          <label for="vppolicy_${index}">${displayName}</label>
        </div>
      `;
    });
    
    popupContent += `
        </div>
        <div class="search-popup-buttons">
          <button class="btn-secondary" onclick="closeSearchPopup()">Cancel</button>
          <button class="btn-primary" onclick="selectVpPolicy()">Select</button>
        </div>
      </div>
    `;
    
    popup.innerHTML = popupContent;
    document.body.appendChild(popup);
    
    // 팝업 데이터 저장
    window._popupData = {
      items: vpPolicies,
      type: 'vppolicy'
    };
    
  } catch (error) {
    hideLoading();
    console.error('Error searching VP policies:', error);
    alert('Failed to load VP policies. Please try again later.');
  }
}

function selectVpPolicy() {
  if (!window._popupData || window._popupData.type !== 'vppolicy') return;
  
  const selected = document.querySelector('input[name="vpPolicySelection"]:checked');
  if (!selected) {
    alert('Please select a VP Policy');
    return;
  }
  
  const index = parseInt(selected.closest('.search-option').getAttribute('data-index'));
  const policy = window._popupData.items[index];
  
  if (!policy) {
    alert('Selected policy not found');
    return;
  }
  
  // UI 업데이트
  const vpPolicyInput = document.getElementById('vpPolicySubmission');
  if (vpPolicyInput) {
    vpPolicyInput.value = policy.policyTitle || policy.policyId;
    vpPolicyInput.setAttribute('data-id', policy.policyId);
  }
  
  // 서버에 현재 VP Policy 저장
  saveCurrentVpPolicy(policy);
  
  closeSearchPopup();
}

async function saveCurrentVpPolicy(policy) {
  try {
    showLoading();
    
    const response = await fetch('/demo/api/current-vp-policy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        vpPolicyId: policy.policyId
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to update current VP Policy');
    }
    
    // AppState 객체 업데이트 (있는 경우)
    if (typeof AppState !== 'undefined') {
      if (!AppState.serverSettings) AppState.serverSettings = {};
      AppState.serverSettings.vpPolicy = policy.policyId;
      AppState.serverSettings.vpPolicyName = policy.policyTitle || policy.policyId;
    }
    
    console.log('Selected VP Policy saved:', policy.policyId);
  } catch (error) {
    console.error('Error saving current VP Policy:', error);
    alert('Failed to save VP Policy selection. Please try again.');
  } finally {
    hideLoading();
  }
}

// VC Plan 선택 처리
async function handleVcPlanSelection(plan) {
  const vcPlanInput = document.getElementById('vcPlanIssuance');
  if (!vcPlanInput) return;
  
  // UI 업데이트
  vcPlanInput.value = plan.name || plan.vcPlanId;
  vcPlanInput.setAttribute('data-id', plan.vcPlanId);
  
  try {
    const response = await fetch('/demo/api/current-vc-plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        vcPlanId: plan.vcPlanId,
        manager: plan.manager || ''
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to update current VC Plan');
    }
    
    // 앱 상태 업데이트
    if (!AppState.serverSettings) AppState.serverSettings = {};
    AppState.serverSettings.vcPlan = plan.vcPlanId;
    AppState.serverSettings.vcPlanName = plan.name || plan.vcPlanId;
    
    console.log('Selected VC Plan saved:', plan.vcPlanId);
  } catch (error) {
    console.error('Error saving current VC Plan:', error);
    alert('Failed to save VC Plan selection. Please try again.');
  }
}
// VC Plan 필터링
function filterVcPlans() {
  const searchTerm = document.getElementById('vcPlanSearch').value.toLowerCase();
  const options = document.querySelectorAll('#vcPlanResults .search-option');
  
  options.forEach(option => {
    const label = option.querySelector('label').textContent.toLowerCase();
    if (label.includes(searchTerm)) {
      option.style.display = 'flex';
    } else {
      option.style.display = 'none';
    }
  });
}

// VP Policy 선택 처리
async function handleVpPolicySelection(policy) {
  const vpPolicyInput = document.getElementById('vpPolicySubmission');
  if (!vpPolicyInput) return;
  
  // UI 업데이트
  vpPolicyInput.value = policy.policyTitle || policy.policyId;
  vpPolicyInput.setAttribute('data-id', policy.policyId);
  
  try {
    const response = await fetch('/demo/api/current-vp-policy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ vpPolicyId: policy.policyId })
    });
    
    if (!response.ok) {
      throw new Error('Failed to update current VP Policy');
    }
    
    // 앱 상태 업데이트
    if (!AppState.serverSettings) AppState.serverSettings = {};
    AppState.serverSettings.vpPolicy = policy.policyId;
    AppState.serverSettings.vpPolicyName = policy.policyTitle || policy.policyId;
    
    console.log('Selected VP Policy saved:', policy.policyId);
  } catch (error) {
    console.error('Error saving current VP Policy:', error);
    alert('Failed to save VP Policy selection. Please try again.');
  }
}

// VP Policy 필터링
function filterVpPolicies() {
  const searchTerm = document.getElementById('vpPolicySearch').value.toLowerCase();
  const options = document.querySelectorAll('#vpPolicyResults .search-option');
  
  options.forEach(option => {
    const label = option.querySelector('label').textContent.toLowerCase();
    if (label.includes(searchTerm)) {
      option.style.display = 'flex';
    } else {
      option.style.display = 'none';
    }
  });
}

// 검색 팝업 생성
function createSearchPopup(title, items, valueGetter, displayGetter, onSelect) {
  hideLoading();
  
  const popup = document.createElement('div');
  popup.className = 'search-popup';
  
  let popupContent = `
    <div class="search-popup-content">
      <h3>${title}</h3>
      <div class="search-input-container">
        <input type="text" id="popupSearch" placeholder="Search..." class="search-popup-input" oninput="filterPopupItems()">
      </div>
      <div class="search-results" id="popupResults">
  `;
  
  items.forEach((item, index) => {
    const value = valueGetter(item);
    const display = displayGetter(item);
    
    popupContent += `
      <div class="search-option" data-index="${index}">
        <input type="radio" id="option_${index}" name="popupSelection" value="${value}">
        <label for="option_${index}">${display}</label>
      </div>
    `;
  });
  
  popupContent += `
      </div>
      <div class="search-popup-buttons">
        <button class="btn-secondary" onclick="closeSearchPopup()">Cancel</button>
        <button class="btn-primary" onclick="selectPopupItem()">Select</button>
      </div>
    </div>
  `;
  
  popup.innerHTML = popupContent;
  document.body.appendChild(popup);
  
  // 저장: 항목 목록과 선택 핸들러를 전역 변수에 저장
  window._popupData = {
    items,
    onSelect
  };
}

// 팝업 항목 필터링
function filterPopupItems() {
  const searchTerm = document.getElementById('popupSearch').value.toLowerCase();
  const options = document.querySelectorAll('#popupResults .search-option');
  
  options.forEach(option => {
    const label = option.querySelector('label').textContent.toLowerCase();
    if (label.includes(searchTerm)) {
      option.style.display = 'flex';
    } else {
      option.style.display = 'none';
    }
  });
}

// 팝업 항목 선택
function selectPopupItem() {
  const selected = document.querySelector('input[name="popupSelection"]:checked');
  if (!selected) {
    alert('Please select an item');
    return;
  }
  
  const index = selected.closest('.search-option').getAttribute('data-index');
  const selectedItem = window._popupData.items[index];
  
  closeSearchPopup();
  window._popupData.onSelect(selectedItem);
}

// 검색 팝업 닫기
function closeSearchPopup() {
  const popup = document.querySelector('.search-popup');
  if (popup) {
    document.body.removeChild(popup);
  }
  window._popupData = null;
}


// VC 발급창 열기
async function openVCPopup() {
  if (isMobile) {
    try {
      const response = await fetch("/qrPush");
      if (response.ok) {
        const externalHTML = await response.text();
        document.getElementById("PopupArea").innerHTML = externalHTML;
        const didElement = document.getElementById("didDisplay");
        if (didElement) {
          const did = AppState.getDid();
          didElement.value = did || (isMobile ? "Error loading DID" : "Please enter your DID");
        }
      } else {
        console.error("Failed to load the external HTML file.");
        alert("Error: Failed to load the required content. Please try again later.");
      }
    } catch (error) {
      console.error("Error fetching the external HTML file:", error);
      alert("Error: Unable to load the required content. Please check your connection and try again.");
    }
  } else {
    try {
      // 먼저 사용자 정보 확인
      if (!AppState.userInfo || !AppState.userInfo.firstname) {
        alert("User information is missing. Please ensure you have completed the registration process.");
        return;
      }
      
      const response = await fetch("/vcPopup");
      if (response.ok) {
        const externalHTML = await response.text();
        document.getElementById("PopupArea").innerHTML = externalHTML;
        vcOfferRefresh();
      } else {
        console.error("Failed to load the external HTML file.");
        alert("Error: Failed to load the required content. Please try again later.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  }
}

// 푸시 알림창 열기
async function openPushPopup() {
  try {
    const response = await fetch("/qrPush");
    if (response.ok) {
      const externalHTML = await response.text();
      document.getElementById("PopupArea").innerHTML = externalHTML;
      const didElement = document.getElementById("didDisplay");
      if (didElement) {
        const did = AppState.getDid();
        didElement.value = did || (isMobile ? "Error loading DID" : "Please enter your DID");
      }
    } else {
      console.error("Failed to load the external HTML file.");
      alert("Error: Failed to load the required content. Please try again later.");
    }
  } catch (error) {
    console.error("Error fetching the external HTML file:", error);
    alert("Error: Unable to load the required content. Please check your connection and try again.");
  }
}

// 이메일 인증창 열기
async function openEmailPopup() {
  try {
    const response = await fetch("/sendEmail");
    if (response.ok) {
      const externalHTML = await response.text();
      document.getElementById("PopupArea").innerHTML = externalHTML;            
      const emailElement = document.getElementById("emailDisplay");
      if (emailElement) {
        const email = AppState.getEmail();
        if (email) {
          emailElement.value = email;
        } else {
          emailElement.placeholder = "Please enter your email";
        }
      }
    } else {
      console.error("Failed to load the external HTML file.");
      alert("Error: Failed to load the required content. Please try again later.");
    }
  } catch (error) {
    console.error("Error fetching the external HTML file:", error);
    alert("Error: Unable to load the required content. Please check your connection and try again.");
  }
}

// VP 제출창 열기
async function openVPPopup() {
  try {
    const response = await fetch("/vpPopup");
    if (response.ok) {
      const externalHTML = await response.text();
      document.getElementById("PopupArea").innerHTML = externalHTML;
      refreshImage();
    } else {
      console.error("Failed to load the external HTML file.");
      alert("Error: Failed to load the required content. Please try again later.");
    }
  } catch (error) {
    console.error("Error fetching the external HTML file:", error);
    alert("Error: Unable to load the required content. Please check your connection and try again.");
  }
}

// 팝업 닫기
function closePopup() {
  document.getElementById("PopupArea").innerHTML = "";
}

// QR 푸시 알림 제출
function qrPushSubmit() {
  const didElement = document.getElementById("didDisplay");
  if (!didElement) return;
  
  const did = didElement.value;
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
        window.offerId = data.offerId;
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
      alert("An error occurred. Please try again.");
    });
}

// 이메일 전송
function sendEmail() {
  const emailElement = document.getElementById("emailDisplay");
  if (!emailElement) return;
  
  const email = emailElement.value;
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
  
  fetch("/demo/api/vc-offer-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email }),
  })
    .then((response) => {
      if (response.ok) {
        alert("QR code has been sent to " + email);
        return response.json();
      }
      throw new Error("Network response was not ok.");
    })
    .then((data) => {
      window.offerId = data.offerId;
    })
    .catch((error) => {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
      alert("An error occurred. Please try again.");
    });
}

// 인증서 제출
async function submitCertificate() {
  if (!window.vcOfferId) {
    alert("No active offer ID found. Please refresh the QR code.");
    return;
  }
  
  try {
    showLoading();
    
    const response = await fetch("/demo/api/issue-vc-result", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ offerId: window.vcOfferId }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }

    const data = await response.json();

    if (data.result) {
      alert("Mobile ID Issued Successfully");
      
      // 성공 페이지 로드
      const externalResponse = await fetch("/vcSuccess");
      if (externalResponse.ok) {
        const externalHTML = await externalResponse.text();
        document.getElementById("PopupArea").innerHTML = externalHTML;
      } else {
        throw new Error("Failed to load the success page.");
      }
    } else {
      alert("Failed to issue Mobile ID. Please scan the QR code again.");
    }
  } catch (error) {
    console.error("There has been a problem with your operation:", error);
    alert("An error occurred. Please try again.");
  } finally {
    hideLoading();
  }
}

// VP 검증 결과 제출
async function submitVPComplete() {
  if (!window.vpOfferId) {
    alert("No active offer ID found. Please refresh the QR code.");
    return;
  }

  try {
    showLoading();
    
    const response = await fetch("/demo/api/confirm-verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ offerId: window.vpOfferId }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }

    const data = await response.json();

    if (data.result) {
      alert("ID submission completed.");
      
      // 성공 페이지 로드
      const externalResponse = await fetch("/success");
      if (externalResponse.ok) {
        const externalHTML = await externalResponse.text();
        document.getElementById("PopupArea").innerHTML = externalHTML;
        updateSuccessDialog(data);
      } else {
        throw new Error("Failed to load the success page.");
      }
    } else {
      alert("ID submission failed. Please resubmit via QR code.");
    }
  } catch (error) {
    console.error("There has been a problem with your operation:", error);
    alert("An error occurred. Please try again.");
  } finally {
    hideLoading();
  }
}

// 성공 다이얼로그 업데이트
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

// VC Offer QR 코드 갱신
function vcOfferRefresh() {
  window.vcOfferId = "";
  
  showLoading();
  
  fetch('/demo/api/vc-offer-refresh-call', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      hideLoading();
      
      // 응답 텍스트 영역 업데이트 (디버그용)
      const responseTextArea = document.getElementById("responseTextArea");
      if (responseTextArea) {
        responseTextArea.value = JSON.stringify(data, null, 2);
      }
      
      // QR 이미지 업데이트
      const imageData = data.qrImage;
      if (imageData) {
        const qrContainer = document.querySelector('.qr-img');
        if (qrContainer) {
          let vcQrImage = document.getElementById("vcQrImage");
          if (!vcQrImage) {
            vcQrImage = document.createElement('img');
            vcQrImage.id = 'vcQrImage';
            vcQrImage.alt = 'Item Image';
            vcQrImage.style.maxWidth = '100%';
            vcQrImage.style.height = 'auto';
          }
          vcQrImage.src = "data:image/png;base64," + imageData;
          qrContainer.innerHTML = ''; // 기존 내용 삭제
          qrContainer.appendChild(vcQrImage);
        }
      }
      
      // Offer ID 및 카운트다운 설정
      const validUntil = data.validUntil;
      window.vcOfferId = data.offerId;
      startCountdown(validUntil, "vc");
    })
    .catch((error) => {
      hideLoading();
      console.error("Error refreshing VC offer:", error);
      const responseTextArea = document.getElementById("responseTextArea");
      if (responseTextArea) {
        responseTextArea.value = "Error: " + error;
      }
      alert("Failed to refresh QR code. Please try again.");
    });
}

// VP QR 코드 갱신
function refreshImage() {
  window.vpOfferId = "";
  
  showLoading();
  
  fetch("/demo/api/vp-offer-refresh-call", { method: "POST" })
    .then((response) => response.json())
    .then((data) => {
      hideLoading();
      
      // 응답 텍스트 영역 업데이트 (디버그용)
      const responseTextArea = document.getElementById("responseTextArea");
      if (responseTextArea) {
        responseTextArea.value = JSON.stringify(data, null, 2);
      }
      
      // QR 이미지 업데이트
      const imageData = data.qrImage;
      if (imageData) {
        const qrContainer = document.querySelector('.qr-img');
        if (qrContainer) {
          let qrImage = document.getElementById("vpQrImage");
          if (!qrImage) {
            qrImage = document.createElement('img');
            qrImage.id = 'vpQrImage';
            qrImage.alt = 'Item Image';
            qrImage.style.maxWidth = '100%';
            qrImage.style.height = 'auto';
          }
          qrImage.src = "data:image/png;base64," + imageData;
          qrContainer.innerHTML = ''; // 기존 내용 삭제
          qrContainer.appendChild(qrImage);
        }
      }
      
      // Offer ID 및 카운트다운 설정
      const validUntil = data.validUntil;
      window.vpOfferId = data.offerId;
      startCountdown(validUntil, "vp");
    })
    .catch((error) => {
      hideLoading();
      console.error("Error refreshing VP offer:", error);
      const responseTextArea = document.getElementById("responseTextArea");
      if (responseTextArea) {
        responseTextArea.value = "Error: " + error;
      }
      alert("Failed to refresh QR code. Please try again.");
    });
}

// QR 코드 카운트다운 시작
function startCountdown(validUntil, type) {
  let countdownElement;
  let qrImage;
  const qrContainer = document.querySelector('.qr-img');
  
  if (type === "vp") {
    countdownElement = document.getElementById("vpOfferQRCountdown");
    qrImage = document.getElementById('vpQrImage');
  } else if (type === "vc") {
    countdownElement = document.getElementById("vcOfferQRCountdown");
    qrImage = document.getElementById('vcQrImage');
  }
  
  if (!countdownElement || !qrImage || !qrContainer) return;
  
  function updateCountdown() {
    const now = new Date().getTime();
    const validUntilTime = new Date(validUntil).getTime();
    const timeLeft = validUntilTime - now;

    if (timeLeft <= 0) {
      countdownElement.textContent = 'Expired';
      qrImage.style.display = 'none';
      qrContainer.textContent = 'Please click the Renew button';
      clearInterval(window.qrCountdownTimer);
    } else {
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
      countdownElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
  }
  
  if (window.qrCountdownTimer) {
    clearInterval(window.qrCountdownTimer);
  }

  updateCountdown(); // 즉시 한 번 실행
  window.qrCountdownTimer = setInterval(updateCountdown, 1000); // 1초마다 업데이트
}

// 푸시 버튼 타이머 시작
function startTimer(duration) {
  const pushButton = document.getElementById("pushButton");
  const timerDisplay = document.getElementById("timer");
  
  if (!pushButton || !timerDisplay) return;
  
  let timer = duration;
  pushButton.style.display = "none";
  timerDisplay.style.display = "block";

  if (window.countdown) {
    clearInterval(window.countdown);
  }

  window.countdown = setInterval(function () {
    let minutes = parseInt(timer / 60, 10);
    let seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    timerDisplay.textContent = minutes + ":" + seconds;

    if (--timer < 0) {
      clearInterval(window.countdown);
      pushButton.style.display = "inline-block";
      timerDisplay.style.display = "none";
    }
  }, 1000);
}

// 로딩 표시
function showLoading() {
  let loadingOverlay = document.getElementById('loadingOverlay');
  
  // 로딩 오버레이가 없으면 생성
  if (!loadingOverlay) {
    loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loadingOverlay';
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(loadingOverlay);
  }
  
  loadingOverlay.style.display = 'flex';
}

// 로딩 숨기기
function hideLoading() {
  const loadingOverlay = document.getElementById('loadingOverlay');
  if (loadingOverlay) {
    loadingOverlay.style.display = 'none';
  }
}

// 페이지 리로드
function handleReload() {
  location.reload();
}

// 모바일 확인 및 이벤트 바인딩
window.addEventListener("resize", checkMobile);
checkMobile();

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', initPage);

// 스키마 선택기 열기 (모바일용)
async function openVcSchemaSelector() {
  try {
    showLoading();
    
    // VC Schema 목록이 없으면 로드
    if (!AppState.vcSchemaData || AppState.vcSchemaData.length === 0) {
      await AppState.loadVcSchemas();
    }
    
    const schemas = AppState.vcSchemaData;
    hideLoading();
    
    if (schemas.length === 0) {
      alert('No credential types available. Please try again later.');
      return;
    }
    
    createSearchPopup(
      'Select Credential Type',
      schemas,
      schema => schema.schemaId,
      schema => schema.title,
      handleSchemaSelection
    );
  } catch (error) {
    hideLoading();
    console.error('Error opening schema selector:', error);
    alert('Failed to load credential types. Please try again later.');
  }
}

// 스키마 선택 처리 (모바일용)
function handleSchemaSelection(schema) {
  // 선택된 스키마로 addVcInfo 페이지 열기
  const userInfo = AppState.userInfo || {};
  const did = userInfo.did || '';
  const userName = AppState.getUserName();
  
  window.open(`/addVcInfo?did=${encodeURIComponent(did)}&userName=${encodeURIComponent(userName)}&vcSchemaId=${encodeURIComponent(schema.schemaId)}`, "popup", "width=480,height=768");
}

// 정보 입력 처리 (모바일용)
function handleEnterInfo(type) {
  switch (type) {
    case "사용자정보":
      window.open("/addUserInfo", "popup", "width=480,height=768");
      break;
    case "신분증정보":
      // 모바일 환경에서는 먼저 신분증 종류 선택 팝업을 보여줌
      if (isMobile) {
        openVcSchemaSelector();
      } else {
        window.open("/addVcInfo", "popup", "width=480,height=768");
      }
      break;
    default:
      break;
  }
}