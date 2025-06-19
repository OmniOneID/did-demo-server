
const AppState = {
  userInfo: null,
  serverSettings: null,
  vcSchemaData: null,
  vcPlanData: null, 
  

  async init() {
    try {
      await this.loadUserInfo();
      await this.loadServerSettings();
      await this.loadVcPlans(); 
      console.log('App state initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize app state:', error);
      return false;
    }
  },

  async loadVcPlans() {
    try {
      const response = await fetch('/demo/api/all-vc-plans');
      if (!response.ok) throw new Error('Failed to fetch VC Plans');
      
      const data = await response.json();
      this.vcPlanData = data.items || [];
      return this.vcPlanData;
    } catch (error) {
      console.error('Error fetching VC plans:', error);
      this.vcPlanData = [];
      return [];
    }
  },

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
      this.userInfo = {}; 
      return null;
    }
  },
  
  
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
      this.serverSettings = {}; 
      return null;
    }
  },
  
  
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

let isMobile = false;

function checkMobile() {
  const width = window.innerWidth;
  isMobile = width < 1024;
  console.log("isMobile", isMobile);
}

async function initPage() {
  showLoading();
  
  try {
    await AppState.init();
    
    updateUserGreeting();
    populateVcPlanSelect(); 
    populateFormWithSavedData();
    populateServerSettingsForm();
    
    setupEventListeners();
  } catch (error) {
    console.error('Error initializing page:', error);
  } finally {
    hideLoading();
  }
}

function setupEventListeners() {
  const btnSelect = document.querySelectorAll(".btn-select");
  btnSelect.forEach((item) => {
    item.addEventListener("click", handleMenuSelection);
  });
  
  const btnTab = document.querySelectorAll(".btn-tab");
  btnTab.forEach((item) => {
    item.addEventListener("click", handleTabSelection);
  });
  
  
  const vcSchemaSelect = document.getElementById('vcSchema');
  if (vcSchemaSelect) {
    vcSchemaSelect.addEventListener('change', displayIdentificationForm);
  }
}


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


function updateUserGreeting() {
  const greetingElement = document.getElementById('userGreeting');
  if (!greetingElement) return;
  
  const userName = AppState.getUserName();
  if (userName) {
    greetingElement.textContent = `Hello, ${userName}`;
  } else {
    greetingElement.textContent = 'Welcome! Please enter your user information!';
  }
}

function populateVcPlanSelect() {
  const plans = AppState.vcPlanData;
  if (!plans || plans.length === 0) return;
  
  const selectElement = document.getElementById('vcSchema'); 
  if (!selectElement) return;
  
  while (selectElement.options.length > 1) {
    selectElement.remove(1);
  }
  
  plans.forEach((plan, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = plan.name;
    selectElement.appendChild(option);
  });
}


function populateFormWithSavedData() {
  const userInfo = AppState.userInfo;
  if (!userInfo || !userInfo.firstname) return;
  

  const firstnameInput = document.getElementById('firstname');
  const lastnameInput = document.getElementById('lastname');
  const didInput = document.getElementById('did');
  const emailInput = document.getElementById('email');
  
  if (firstnameInput) firstnameInput.value = userInfo.firstname || '';
  if (lastnameInput) lastnameInput.value = userInfo.lastname || '';
  if (didInput) didInput.value = userInfo.did || '';
  if (emailInput) emailInput.value = userInfo.email || '';
  

  if (userInfo.vcPlanIndex !== undefined && AppState.vcPlanData && AppState.vcPlanData.length > 0) {
    const selectElement = document.getElementById('vcSchema');
    if (selectElement && userInfo.vcPlanIndex < AppState.vcPlanData.length) {
      selectElement.value = userInfo.vcPlanIndex;
      
      displayIdentificationForm().then(() => {
        setTimeout(() => {
          if (userInfo.fields) {
            Object.keys(userInfo.fields).forEach(key => {
              const input = document.getElementById(key);
              if (input) {
                input.value = userInfo.fields[key];
              }
            });
          }
        }, 500);
      }).catch(error => {
        console.error('Error restoring form data:', error);
      });
    }
  }
}


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


function createDynamicForm(schemaIndex) {
  const schemas = AppState.vcSchemaData;

  if (!schemas || schemaIndex === "" || !schemas[schemaIndex]) {
    const formsContainer = document.getElementById('identificationForms');
    if (formsContainer) formsContainer.style.display = 'none';
    return;
  }
  
  const schema = schemas[schemaIndex];
  const formsContainer = document.getElementById('identificationForms');
  if (!formsContainer) return;
  
  
  formsContainer.style.display = 'block';
  formsContainer.innerHTML = '';
  
  const formDiv = document.createElement('div');
  formDiv.className = 'identification-form';
  
  const titleDiv = document.createElement('div');
  titleDiv.className = 'label';
  titleDiv.innerHTML = `
    <p>${schema.title}</p>
    <div class="divider"></div>
  `;
  formDiv.appendChild(titleDiv);
  
  const inputGroupDiv = document.createElement('div');
  inputGroupDiv.className = 'input-group';
  
  if (schema.vcSchema && schema.vcSchema.credentialSubject && schema.vcSchema.credentialSubject.claims) {
    schema.vcSchema.credentialSubject.claims.forEach(claim => {
      const namespace = claim.namespace ? claim.namespace.id : '';
      
      if (claim.items && Array.isArray(claim.items)) {
        claim.items.forEach(item => {
          const inputDiv = document.createElement('div');
          inputDiv.className = 'input';
          
          const labelP = document.createElement('p');
          labelP.textContent = item.caption || item.id;
          
          const requiredSpan = document.createElement('span');
          requiredSpan.className = 'color-error';
          requiredSpan.textContent = '*';
          labelP.appendChild(requiredSpan);
          
          inputDiv.appendChild(labelP);
          
          const inputElement = document.createElement('input');
          inputElement.type = item.type === 'number' ? 'number' : 'text';
          
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

async function displayIdentificationForm() {
  const vcPlanSelect = document.getElementById('vcSchema');
  const planIndex = vcPlanSelect.value;

  const schemaSection = document.getElementById('credentialSchemaSection');
  const definitionSection = document.getElementById('credentialDefinitionSection');

  if (schemaSection) {
    schemaSection.style.display = 'none';
    schemaSection.innerHTML = '';
  }
  if (definitionSection) {
    definitionSection.style.display = 'none';
    definitionSection.innerHTML = '';
  }

  if (!planIndex || planIndex === "") {
    return;
  }

  const plan = AppState.vcPlanData[planIndex];
  if (!plan) return;

  showLoading();

  try {
    if (plan.credentialSchema && plan.credentialSchema.id) {
      await createCredentialSchemaForm(plan);
    }
    if (plan.credentialDefinition && plan.credentialDefinition.schemaId) {
      await createCredentialDefinitionForm(plan.credentialDefinition.schemaId);
    }
  } catch (error) {
    console.error('Error creating dynamic forms:', error);
    alert('Failed to load form fields. Please try again.');
  } finally {
    hideLoading();
  }
}

async function createCredentialSchemaForm(plan) {
  const schemaUrl = plan.credentialSchema.id;
  const schemaName = extractSchemaName(schemaUrl);

  if (!schemaName) {
    console.error('Failed to extract schema name from URL:', schemaUrl);
    return;
  }

  try {
    const response = await fetch(`/demo/api/vc-schema/${schemaName}`);
    if (!response.ok) throw new Error('Failed to fetch schema details');

    const schemaData = await response.json();
    const schemaSection = document.getElementById('credentialSchemaSection');
    if (!schemaSection) return;
    schemaSection.style.display = 'block';
    schemaSection.innerHTML = '';
    const titleDiv = document.createElement('div');
    titleDiv.className = 'credential-section-title';
    titleDiv.textContent = schemaData.title || 'Credential Information';
    schemaSection.appendChild(titleDiv);

    const inputGroupDiv = document.createElement('div');
    inputGroupDiv.className = 'input-group';

    if (schemaData.vcSchema && schemaData.vcSchema.credentialSubject && schemaData.vcSchema.credentialSubject.claims) {
      schemaData.vcSchema.credentialSubject.claims.forEach(claim => {
        const namespace = claim.namespace ? claim.namespace.id : '';

        if (claim.items && Array.isArray(claim.items)) {
          claim.items.forEach(item => {
            const inputDiv = createInputField(item, namespace, 'schema');
            inputGroupDiv.appendChild(inputDiv);
          });
        }
      });
    }

    schemaSection.appendChild(inputGroupDiv);

  } catch (error) {
    console.error('Error creating credential schema form:', error);
    const schemaSection = document.getElementById('credentialSchemaSection');
    if (schemaSection) {
      schemaSection.style.display = 'none';
      schemaSection.innerHTML = '';
    }
    throw error;
  }
}

function extractSchemaName(schemaUrl) {
  try {
    const url = new URL(schemaUrl);
    const params = new URLSearchParams(url.search);
    return params.get('name');
  } catch (e) {
    const match = schemaUrl.match(/name=([^&]+)/);
    return match ? match[1] : null;
  }
}

function createInputField(item, namespace, source) {
  const inputDiv = document.createElement('div');
  inputDiv.className = 'input';
  
  const labelP = document.createElement('p');
  labelP.textContent = item.caption || item.label || item.id;
  
  const requiredSpan = document.createElement('span');
  requiredSpan.className = 'color-error';
  requiredSpan.textContent = '*';
  labelP.appendChild(requiredSpan);
  
  inputDiv.appendChild(labelP);
  
  const inputElement = document.createElement('input');
  
  const itemType = (item.type || 'STRING').toUpperCase();
  inputElement.type = itemType === 'NUMBER' ? 'number' : 'text';
  
  const fieldId = namespace ? `${namespace}.${item.label || item.id}` : (item.label || item.id);
  
  inputElement.id = fieldId;
  inputElement.name = fieldId;
  inputElement.placeholder = `Enter ${item.caption || item.label || item.id}`;
  inputElement.required = true;
  inputElement.setAttribute('data-source', source);
  inputElement.setAttribute('data-caption', item.caption || item.label || item.id);
  inputElement.setAttribute('data-namespace', namespace);
  
  inputDiv.appendChild(inputElement);
  return inputDiv;
}

async function createCredentialDefinitionForm(schemaId) {
  try {
    const response = await fetch(`/demo/api/credential-schema?credentialSchemaId=${encodeURIComponent(schemaId)}`);
    if (!response.ok) throw new Error('Failed to fetch credential definition');

    const definitionData = await response.json();
    const definitionSection = document.getElementById('credentialDefinitionSection');
    if (!definitionSection) return;
    definitionSection.style.display = 'block';
    definitionSection.innerHTML = '';
    const titleDiv = document.createElement('div');
    titleDiv.className = 'credential-section-title';
    titleDiv.textContent = 'ZKP Information';
    definitionSection.appendChild(titleDiv);

    const inputGroupDiv = document.createElement('div');
    inputGroupDiv.className = 'input-group';

    if (definitionData.attrTypes && Array.isArray(definitionData.attrTypes)) {
      definitionData.attrTypes.forEach(attrType => {
        const namespace = attrType.namespace ? attrType.namespace.id : '';

        if (attrType.items && Array.isArray(attrType.items)) {
          attrType.items.forEach(item => {
            const inputDiv = createInputField(item, namespace, 'definition');
            inputGroupDiv.appendChild(inputDiv);
          });
        }
      });
    }

    definitionSection.appendChild(inputGroupDiv);

  } catch (error) {
    console.error('Error creating credential definition form:', error);
    const definitionSection = document.getElementById('credentialDefinitionSection');
    if (definitionSection) {
      definitionSection.style.display = 'none';
      definitionSection.innerHTML = '';
    }
  }
}


async function saveUserInfo() {
  const planSelect = document.getElementById('vcSchema');
  if (!planSelect) return;

  const planIndex = planSelect.value;

  if (!planIndex || planIndex === "") {
    alert('Please select a credential type');
    return;
  }

  const plans = AppState.vcPlanData;
  if (!plans || !plans[planIndex]) {
    alert('Invalid credential type');
    return;
  }

  const plan = plans[planIndex];

  const firstname = document.getElementById('firstname')?.value || '';
  const lastname = document.getElementById('lastname')?.value || '';
  const did = document.getElementById('did')?.value || '';
  const email = document.getElementById('email')?.value || '';

  if (!firstname || !lastname) {
    alert('Please enter required user information');
    return;
  }

  const userInfo = {
    firstname,
    lastname,
    did,
    email,
    vcPlanId: plan.vcPlanId,
    vcPlanName: plan.name,
    vcPlanIndex: planIndex,
    vcSchemaId: plan.credentialSchema.id,
  };

  const dynamicFields = {};
  const schemaSection = document.getElementById('credentialSchemaSection');
  const definitionSection = document.getElementById('credentialDefinitionSection');
  
  let hasError = false;
  if (schemaSection && schemaSection.style.display !== 'none') {
    const schemaInputs = schemaSection.querySelectorAll('input');
    schemaInputs.forEach(input => {
      if (input.required && !input.value) {
        alert(`Please fill out all required fields: ${input.getAttribute('data-caption')}`);
        hasError = true;
        return;
      }
      if (input.id && input.value) {
        dynamicFields[input.id] = input.value;
      }
    });
  }

  if (definitionSection && definitionSection.style.display !== 'none') {
    const definitionInputs = definitionSection.querySelectorAll('input');
    definitionInputs.forEach(input => {
      if (input.required && !input.value) {
        alert(`Please fill out all required fields: ${input.getAttribute('data-caption')}`);
        hasError = true;
        return;
      }
      if (input.id && input.value) {
        dynamicFields[input.id] = input.value;
      }
    });
  }

  if (hasError) return;

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

    AppState.userInfo = userInfo;
    updateUserGreeting();

    alert('User information saved successfully!');
  } catch (error) {
    console.error('Error saving user information:', error);
    alert('Failed to save user information. Please try again.');
  } finally {
    hideLoading();
  }
}

async function saveServerSettings() {
  const tasServer = document.getElementById('tasServer')?.value?.trim() || '';
  const issuerServer = document.getElementById('issuerServer')?.value?.trim() || '';
  const caServer = document.getElementById('caServer')?.value?.trim() || '';
  const verifierServer = document.getElementById('verifierServer')?.value?.trim() || '';
  
  // VC Plan 정보 - 선택사항
  const vcPlanInput = document.getElementById('vcPlanIssuance');
  const vcPlan = vcPlanInput ? (vcPlanInput.getAttribute('data-id') || vcPlanInput.value?.trim() || '') : '';
  const vcPlanName = vcPlanInput ? (vcPlanInput.value?.trim() || '') : '';
  
  // VP Policy 정보 - 선택사항  
  const vpPolicyInput = document.getElementById('vpPolicySubmission');
  const vpPolicy = vpPolicyInput ? (vpPolicyInput.getAttribute('data-id') || vpPolicyInput.value?.trim() || '') : '';
  const vpPolicyName = vpPolicyInput ? (vpPolicyInput.value?.trim() || '') : '';

  // 필수 서버 URL 검증
  if (!tasServer || !issuerServer || !caServer || !verifierServer) {
    alert('Please enter all required server URLs (TAS, Issuer, CA, Verifier)');
    return;
  }

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
    
    AppState.serverSettings = settings;
    
    alert('Server settings saved successfully!');
  } catch (error) {
    console.error('Error saving server settings:', error);
    alert('Failed to save server settings. Please try again.');
  } finally {
    hideLoading();
  }
}

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
  
  const vcPlanInput = document.getElementById('vcPlanIssuance');
  if (vcPlanInput) {
    vcPlanInput.value = plan.name || plan.vcPlanId;
    vcPlanInput.setAttribute('data-id', plan.vcPlanId);
  }
  
  
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
  
  
  const vpPolicyInput = document.getElementById('vpPolicySubmission');
  if (vpPolicyInput) {
    vpPolicyInput.value = policy.policyTitle || policy.policyId;
    vpPolicyInput.setAttribute('data-id', policy.policyId);
  }
  
  
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


async function handleVcPlanSelection(plan) {
  const vcPlanInput = document.getElementById('vcPlanIssuance');
  if (!vcPlanInput) return;
  
  
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
    
    
    if (!AppState.serverSettings) AppState.serverSettings = {};
    AppState.serverSettings.vcPlan = plan.vcPlanId;
    AppState.serverSettings.vcPlanName = plan.name || plan.vcPlanId;
    
    console.log('Selected VC Plan saved:', plan.vcPlanId);
  } catch (error) {
    console.error('Error saving current VC Plan:', error);
    alert('Failed to save VC Plan selection. Please try again.');
  }
}

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


async function handleVpPolicySelection(policy) {
  const vpPolicyInput = document.getElementById('vpPolicySubmission');
  if (!vpPolicyInput) return;
  
  
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
    
    
    if (!AppState.serverSettings) AppState.serverSettings = {};
    AppState.serverSettings.vpPolicy = policy.policyId;
    AppState.serverSettings.vpPolicyName = policy.policyTitle || policy.policyId;
    
    console.log('Selected VP Policy saved:', policy.policyId);
  } catch (error) {
    console.error('Error saving current VP Policy:', error);
    alert('Failed to save VP Policy selection. Please try again.');
  }
}


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
  
  
  window._popupData = {
    items,
    onSelect
  };
}


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


function closeSearchPopup() {
  const popup = document.querySelector('.search-popup');
  if (popup) {
    document.body.removeChild(popup);
  }
  window._popupData = null;
}



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


function closePopup() {
  document.getElementById("PopupArea").innerHTML = "";
}


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
      hideLoading();const responseTextArea = document.getElementById("responseTextArea");
      if (responseTextArea) {
        responseTextArea.value = JSON.stringify(data, null, 2);
      }
      
    
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
          qrContainer.innerHTML = '';qrContainer.appendChild(vcQrImage);
        }
      }
      
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

function refreshImage() {
  window.vpOfferId = "";
  
  showLoading();
  
  fetch("/demo/api/vp-offer-refresh-call", { method: "POST" })
    .then((response) => response.json())
    .then((data) => {
      hideLoading();

      const responseTextArea = document.getElementById("responseTextArea");
      if (responseTextArea) {
        responseTextArea.value = JSON.stringify(data, null, 2);
      }
      
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
          qrContainer.innerHTML = '';qrContainer.appendChild(qrImage);
        }
      }
      
      
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

  updateCountdown(); 
  window.qrCountdownTimer = setInterval(updateCountdown, 1000); 
}


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


function showLoading() {
  let loadingOverlay = document.getElementById('loadingOverlay');
  
  
  if (!loadingOverlay) {
    loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loadingOverlay';
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(loadingOverlay);
  }
  
  loadingOverlay.style.display = 'flex';
}


function hideLoading() {
  const loadingOverlay = document.getElementById('loadingOverlay');
  if (loadingOverlay) {
    loadingOverlay.style.display = 'none';
  }
}


function handleReload() {
  location.reload();
}


window.addEventListener("resize", checkMobile);
checkMobile();


document.addEventListener('DOMContentLoaded', initPage);


async function openVcSchemaSelector() {
  try {
    showLoading();
    
    
    if (!AppState.vcSchemaData || AppState.vcSchemaData.length === 0) {
      await AppState.loadVcSchemas();
    }
    
    const schemas = AppState.vcSchemaData;  hideLoading();
    
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


function handleSchemaSelection(schema) {

  const userInfo = AppState.userInfo || {};
  const did = userInfo.did || '';
  const userName = AppState.getUserName();
  
  window.open(`/addVcInfo?did=${encodeURIComponent(did)}&userName=${encodeURIComponent(userName)}&vcSchemaId=${encodeURIComponent(schema.schemaId)}`, "popup", "width=480,height=768");
}

function handleEnterInfo(type) {
  switch (type) {
    case "사용자정보":
      window.open("/addUserInfo", "popup", "width=480,height=768");
      break;
    case "신분증정보":
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