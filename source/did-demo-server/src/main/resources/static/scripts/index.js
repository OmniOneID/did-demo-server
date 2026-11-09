
// Cached VP policies (loaded on page init)
let cachedVpPolicies = [];
// Set when the last policy load failed, so we can tell "no policies registered"
// apart from "Verifier server unreachable"
let vpPolicyLoadError = null;

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
      await this.loadVpPolicies();
      console.log('App state initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize app state:', error);
      return false;
    }
  },

  async loadVpPolicies() {
    vpPolicyLoadError = null;
    try {
      const response = await fetch('/demo/api/vp-policies');
      if (!response.ok) {
        let detail = null;
        try {
          detail = await response.json();
        } catch (parseError) {
          // non-JSON error body, fall back to the generic message below
        }
        console.error('VP policies API error:', response.status, detail);
        vpPolicyLoadError = {
          message: (detail && detail.message) || ('Failed to fetch VP policies (HTTP ' + response.status + ').'),
          verifierUrl: detail && detail.verifierUrl
        };
        cachedVpPolicies = [];
        return [];
      }
      const data = await response.json();
      console.log('VP policies loaded:', data);
      cachedVpPolicies = data || [];
      return cachedVpPolicies;
    } catch (error) {
      console.error('Error fetching VP policies:', error);
      vpPolicyLoadError = { message: 'Cannot reach the Demo server. Please check that it is running.' };
      cachedVpPolicies = [];
      return [];
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

function getVcPlanId(plan) {
  return plan?.vcPlanId || plan?.id || plan?.vcPlan?.vcPlanId || plan?.vcPlan?.id || '';
}

function getVcPlanDisplayName(plan) {
  return plan?.name || plan?.title || plan?.vcPlanName || plan?.vcPlan?.name || plan?.vcPlan?.title || getVcPlanId(plan);
}

function getVcPlanManager(plan) {
  return plan?.manager || plan?.issuer || plan?.vcPlan?.manager || plan?.vcPlan?.issuer || '';
}

function setSelectedVcPlanInput(plan) {
  const vcPlanInput = document.getElementById('vcPlanIssuance');
  if (!vcPlanInput) return;

  const vcPlanId = getVcPlanId(plan);
  const displayName = getVcPlanDisplayName(plan);

  vcPlanInput.value = displayName;
  vcPlanInput.setAttribute('data-id', vcPlanId);
  vcPlanInput.dispatchEvent(new Event('change', { bubbles: true }));
}

let isMobile = false;

function checkMobile() {
  isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
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
  if (!this.dataset.ref) return;
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
    option.textContent = getVcPlanDisplayName(plan);
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

  if (tasServerInput && settings.tasServer) tasServerInput.value = settings.tasServer;
  if (issuerServerInput && settings.issuerServer) issuerServerInput.value = settings.issuerServer;
  if (caServerInput && settings.caServer) caServerInput.value = settings.caServer;
  if (verifierServerInput && settings.verifierServer) verifierServerInput.value = settings.verifierServer;
  if (vcPlanInput && settings.vcPlan) {
    vcPlanInput.value = settings.vcPlanName || settings.vcPlan;
    vcPlanInput.setAttribute('data-id', settings.vcPlan);
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
    vcPlanId: getVcPlanId(plan),
    vcPlanName: getVcPlanDisplayName(plan),
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

    const { pii } = await response.json();
    const vcResponse = await fetch('/demo/api/save-vc-info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...userInfo, pii })
    });
    if (!vcResponse.ok) {
      throw new Error('Failed to save VC information');
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
  
  const vcPlanInput = document.getElementById('vcPlanIssuance');
  const vcPlan = vcPlanInput ? (vcPlanInput.getAttribute('data-id') || vcPlanInput.value?.trim() || '') : '';
  const vcPlanName = vcPlanInput ? (vcPlanInput.value?.trim() || '') : '';
  

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
    vcPlanName
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
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to save server settings');
    }
    
    const result = await response.json();
    AppState.serverSettings = settings;
    
    if (result.success) {
      alert('Server settings saved successfully!\n\n' + 
            'Changes have been applied immediately - no restart required.\n\n' +
            'Current URLs:\n' +
            `TAS: ${result.currentUrls?.tasServer || tasServer}\n` +
            `Issuer: ${result.currentUrls?.issuerServer || issuerServer}\n` +
            `CA: ${result.currentUrls?.caServer || caServer}\n` +
            `Verifier: ${result.currentUrls?.verifierServer || verifierServer}`);
    } else {
      alert('Server settings saved but there might be issues: ' + (result.message || 'Unknown error'));
    }
    
  } catch (error) {
    console.error('Error saving server settings:', error);
    alert('Failed to save server settings: ' + error.message);
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
      alert('✅ All server connections successful!\n\n' + 
            results.message + '\n\n' +
            'The URLs have been applied and are ready for use.');
    } else {
      const failedServers = results.results
        .filter(result => !result.success)
        .map(result => `${result.server}: ${result.message}`);
      
      const successServers = results.results
        .filter(result => result.success)
        .map(result => result.server);
        
      let message = '❌ Connection test results:\n\n';
      
      if (successServers.length > 0) {
        message += '✅ Successful: ' + successServers.join(', ') + '\n\n';
      }
      
      message += '❌ Failed:\n' + failedServers.join('\n');
      message += '\n\nPlease check the failed URLs and try again.';
      
      alert(message);
    }
  } catch (error) {
    console.error('Error testing connections:', error);
    alert('Failed to test connections: ' + error.message + '\n\nPlease check your network connection and try again.');
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
      const vcPlanId = getVcPlanId(plan);
      const displayName = getVcPlanDisplayName(plan);
      popupContent += `
        <div class="search-option" data-index="${index}">
          <input type="radio" id="vcplan_${index}" name="vcPlanSelection" value="${vcPlanId}">
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
  
  setSelectedVcPlanInput(plan);
  
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
        vcPlanId: getVcPlanId(plan),
        manager: getVcPlanManager(plan)
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to update current VC Plan');
    }
    
    
    if (typeof AppState !== 'undefined') {
      if (!AppState.serverSettings) AppState.serverSettings = {};
      AppState.serverSettings.vcPlan = getVcPlanId(plan);
      AppState.serverSettings.vcPlanName = getVcPlanDisplayName(plan);
    }
    
    console.log('Selected VC Plan saved:', getVcPlanId(plan));
  } catch (error) {
    console.error('Error saving current VC Plan:', error);
    alert('Failed to save VC Plan selection. Please try again.');
  } finally {
    hideLoading();
  }
}

// searchVpPolicy, selectVpPolicy, saveCurrentVpPolicy removed — replaced by policy modal (TO-BE B)


async function handleVcPlanSelection(plan) {
  setSelectedVcPlanInput(plan);
  
  try {
    const response = await fetch('/demo/api/current-vc-plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        vcPlanId: getVcPlanId(plan),
        manager: getVcPlanManager(plan)
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to update current VC Plan');
    }
    
    
    if (!AppState.serverSettings) AppState.serverSettings = {};
    AppState.serverSettings.vcPlan = getVcPlanId(plan);
    AppState.serverSettings.vcPlanName = getVcPlanDisplayName(plan);
    
    console.log('Selected VC Plan saved:', getVcPlanId(plan));
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


// handleVpPolicySelection, filterVpPolicies removed — replaced by policy modal (TO-BE B)


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
  const vcPlanInput = document.getElementById('vcPlanIssuance');
  const vcPlanId = vcPlanInput?.getAttribute('data-id');
  if (!vcPlanId) {
    alert("Please select a VC Plan before proceeding.");
    return;
  }
  window.currentVcPlanId = vcPlanId;

  if (isMobile) {
    try {
      const response = await fetch("/qrPush");
      if (response.ok) {
        const externalHTML = await response.text();
        document.getElementById("PopupArea").innerHTML = externalHTML;
        const didElement = document.getElementById("didDisplay");
        if (didElement) {
          const did = AppState.getDid();
          didElement.value = did || "Error loading DID";
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
        if (!confirm("User information has not been entered.\n\nIf the VC policy is in TEST mode, issuance will proceed with auto-generated data.\n\nContinue?")) {
          return;
        }
      }

      const response = await fetch("/vcPopup");
      if (response.ok) {
        const externalHTML = await response.text();
        document.getElementById("PopupArea").innerHTML = externalHTML;
        vcOfferRefresh(vcPlanId);
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
  // Always refresh policy list from server
  showLoading();
  await AppState.loadVpPolicies();
  hideLoading();

  if (vpPolicyLoadError) {
    const urlHint = vpPolicyLoadError.verifierUrl
      ? '\n\nVerifier URL: ' + vpPolicyLoadError.verifierUrl
      : '';
    alert(vpPolicyLoadError.message + urlHint);
    return;
  }

  if (cachedVpPolicies.length === 0) {
    alert('No policies available. Please register policies in the Admin console first.');
    return;
  }

  renderPolicyModal(cachedVpPolicies);
  document.getElementById('policyModal').style.display = 'flex';
}

function renderPolicyModal(policies) {
  // Build filter chips from unique protocol types
  const protocolTypes = [...new Set(policies.map(p => (p.protocolType || 'DID_VP').toUpperCase()))];
  const filterRow = document.getElementById('policyFilterRow');
  filterRow.innerHTML = '<button class="filter-chip active" onclick="filterPolicies(this, \'all\')">All</button>';
  protocolTypes.forEach(type => {
    const badgeClass = type === 'DID_VP' ? 'did-vp' : 'oid4vp';
    const badgeLabel = type === 'DID_VP' ? 'DID VP' : 'OID4VP';
    filterRow.innerHTML += `<button class="filter-chip" onclick="filterPolicies(this, '${type}')"><span class="protocol-badge ${badgeClass}" style="margin:0">${badgeLabel}</span></button>`;
  });

  // Build policy list
  const listEl = document.getElementById('policyList');
  const emptyMsg = document.getElementById('policyEmptyMsg');
  listEl.innerHTML = '';

  if (policies.length === 0) {
    emptyMsg.style.display = 'block';
    return;
  }
  emptyMsg.style.display = 'none';

  policies.forEach((policy, index) => {
    const pType = (policy.protocolType || 'DID_VP').toUpperCase();
    const badgeClass = pType === 'DID_VP' ? 'did-vp' : 'oid4vp';
    const badgeLabel = pType === 'DID_VP' ? 'DID VP' : 'OID4VP';
    const displayName = policy.policyTitle || policy.policyId;

    const item = document.createElement('div');
    item.className = 'policy-item';
    item.dataset.type = pType;
    item.dataset.policyId = policy.policyId;
    item.dataset.policyTitle = displayName;
    item.onclick = () => { document.getElementById('policyRadio_' + index).checked = true; };
    item.innerHTML = `
      <input type="radio" id="policyRadio_${index}" name="policySelection" value="${index}">
      <label for="policyRadio_${index}">
        <span class="policy-name">${displayName}</span>
        <span class="protocol-badge ${badgeClass}">${badgeLabel}</span>
      </label>
    `;
    listEl.appendChild(item);
  });
}

function filterPolicies(btn, type) {
  btn.closest('.filter-row').querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('#policyList .policy-item').forEach(item => {
    item.style.display = (type === 'all' || item.dataset.type === type) ? '' : 'none';
  });
}

function closePolicyModal() {
  document.getElementById('policyModal').style.display = 'none';
}

async function confirmPolicySelection() {
  const selected = document.querySelector('input[name="policySelection"]:checked');
  if (!selected) {
    alert('Please select a policy.');
    return;
  }

  const index = parseInt(selected.value);
  const policy = cachedVpPolicies[index];
  if (!policy) {
    alert('Selected policy not found.');
    return;
  }

  // Close policy modal
  closePolicyModal();

  // Store selected policy info for refreshImage
  window._selectedPolicy = policy;

  // Open QR popup (vpPopup.html) and trigger verification
  try {
    const response = await fetch("/vpPopup");
    if (response.ok) {
      const externalHTML = await response.text();
      document.getElementById("PopupArea").innerHTML = externalHTML;
      refreshImageWithPolicy(policy);
    } else {
      alert("Error: Failed to load the QR popup. Please try again.");
    }
  } catch (error) {
    console.error("Error loading QR popup:", error);
    alert("Error: Unable to load the QR popup. Please try again.");
  }
}


function closePopup() {
  if (window.statusPollingTimer) {
    clearInterval(window.statusPollingTimer);
    window.statusPollingTimer = null;
  }
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
      vcPlanId: window.currentVcPlanId,
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
    body: JSON.stringify({ email: email, vcPlanId: window.currentVcPlanId }),
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
  // OID4VP: completion is detected from the session status, so check the status on manual confirmation
  if (window.vpProtocol === 'OID4VP') {
    if (!window.vpSessionId) {
      alert("No active session found. Please refresh the QR code.");
      return;
    }
    try {
      showLoading();
      const response = await fetch('/demo/api/verification-status/' + window.vpSessionId);
      if (!response.ok) throw new Error("Network response was not ok.");
      const status = await response.json();
      hideLoading();

      if (status.status === 'COMPLETED') {
        if (window.statusPollingTimer) clearInterval(window.statusPollingTimer);
        alert("ID submission completed.");
        const externalResponse = await fetch("/success");
        if (externalResponse.ok) {
          const externalHTML = await externalResponse.text();
          document.getElementById("PopupArea").innerHTML = externalHTML;
          updateSuccessDialog({ claims: status.claims || [], format: status.format, protocol: 'OID4VP' });
        }
      } else if (status.status === 'PENDING') {
        alert("Waiting for wallet to submit VP. Please scan the QR code first.");
      } else {
        alert("Verification " + status.status.toLowerCase() + ".");
      }
    } catch (error) {
      hideLoading();
      console.error("Error checking status:", error);
      alert("An error occurred. Please try again.");
    }
    return;
  }

  // DID VP: existing confirm-verify flow
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

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}

// escapeHtml() targets text nodes, so double quotes (") pass through unchanged. Putting the value into an attribute
// such as title="..." could break it (JSON values always contain ") or allow attribute injection, so escape it separately.
function escapeAttr(str) {
  return escapeHtml(str).replace(/"/g, '&quot;');
}

// If the claim value is JSON (object/array), show it indented in a <pre>; otherwise show plain text.
// Show at most 3 lines (CSS line-clamp) and truncate with "..." so the popup does not grow and hide the confirm button,
// but keep the full value in the title tooltip so no data is hidden.
function formatClaimValue(rawValue) {
  if (rawValue === null || rawValue === undefined || rawValue === '') {
    return 'No information';
  }
  const str = String(rawValue);
  const trimmed = str.trim();
  let displayText = str;
  let isJson = false;
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      displayText = JSON.stringify(JSON.parse(trimmed), null, 2);
      isJson = true;
    } catch (e) {
      // Looks like JSON but failed to parse; show it as plain text
    }
  }
  const tag = isJson ? 'pre' : 'span';
  const cls = isJson ? 'claim-value-json claim-value-clamp' : 'claim-value-clamp';
  return `<${tag} class="${cls}" title="${escapeAttr(displayText)}">${escapeHtml(displayText)}</${tag}>`;
}

function updateSuccessDialog(data) {
  const infoTable = document.querySelector('.info-table');
  if (!infoTable) {
    console.error('Info table container not found');
    return;
  }

  const currentProtocol = window.vpProtocol || 'DID_VP';
  let tableHTML = '<table>';

  // Protocol row
  tableHTML += `
    <tr>
      <th>Protocol</th>
      <td>${currentProtocol === 'DID_VP' ? 'DID VP' : 'OID4VP'}</td>
    </tr>
  `;

  if (data.format) {
    tableHTML += `
      <tr>
        <th>Format</th>
        <td>${escapeHtml(data.format)}</td>
      </tr>
    `;
  }

  if (data.claims && Array.isArray(data.claims)) {
    data.claims.forEach(claim => {
      const caption = escapeHtml(claim.caption);
      const captionAttr = escapeAttr(claim.caption);
      tableHTML += `
        <tr>
          <th title="${captionAttr}">${caption}</th>
          <td>${formatClaimValue(claim.value)}</td>
        </tr>
      `;
    });
  }

  tableHTML += '</table>';

  infoTable.innerHTML = tableHTML;
}

function vcOfferRefresh(vcPlanId) {
  window.vcOfferId = "";

  showLoading();

  fetch('/demo/api/vc-offer-refresh-call', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ vcPlanId: vcPlanId || window.currentVcPlanId }),
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

// ─────────────────────────────────────────────────────────
// VC Issuance tab: switch protocol sub-tabs and open OID4VC Settings
// ─────────────────────────────────────────────────────────

const VC_PROTO_STEPS = {
  opendid: [
    { num: 1, label: 'Select VC Plan' },
    { num: 2, label: 'Scan QR in app' },
    { num: 3, label: 'Receive VC' },
  ],
  oid4vc: [
    { num: 1, label: 'Enter User ID' },
    { num: 2, label: 'Open Settings' },
    { num: 3, label: 'Scan QR & issue' },
  ],
};

const VC_PROTO_DESC = {
  opendid:
    '<strong>OpenDID</strong> — native flow used in the OmniOne ecosystem. ' +
    'The wallet app scans a QR and receives the VC directly.',
  oid4vc:
    '<strong>OID4VC</strong> — OpenID standard flow (OID4VCI) for cross-platform interop. ' +
    'A compliant wallet scans the QR and confirms with a Tx Code.',
};

function renderProtoSteps(proto) {
  const container = document.getElementById('vcProtoSteps');
  if (!container) return;
  const steps = VC_PROTO_STEPS[proto] || [];
  container.innerHTML = steps
    .map((s, i) => {
      const pill =
        `<div class="proto-step">` +
        `<span class="proto-step-num">${s.num}</span>` +
        `<span class="proto-step-label">${s.label}</span>` +
        `</div>`;
      const arrow = i < steps.length - 1 ? `<span class="proto-step-arrow">›</span>` : '';
      return pill + arrow;
    })
    .join('');
}

function renderProtoDesc(proto) {
  const container = document.getElementById('vcProtoDesc');
  if (!container) return;
  container.innerHTML = VC_PROTO_DESC[proto] || '';
}

function handleVcProtoSelection(proto) {
  const scope = document.querySelector('.context-item[data-ref="VC 발급"]');
  if (!scope) return;
  scope.querySelectorAll('.vc-proto-tabs .btn-tab').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.vcProto === proto);
  });
  scope.querySelectorAll('.vc-proto-panel').forEach((panel) => {
    panel.classList.toggle('hidden', panel.dataset.vcProto !== proto);
  });
  renderProtoDesc(proto);
  renderProtoSteps(proto);
  if (proto === 'oid4vc') {
    loadOid4vcCredentialConfigs();
  }
}

// OID4VC: fill the select with the credential ids that can be issued, taken from the Issuer metadata.
// Called when the OID4VC Issuing sub-tab opens. If the Issuer is not set or the lookup fails, only a placeholder notice is shown.
async function loadOid4vcCredentialConfigs() {
  const select = document.getElementById('oid4vcCredentialId');
  if (!select) return;

  const prev = select.value;
  select.innerHTML = '<option value="">Loading…</option>';
  select.disabled = true;

  try {
    const res = await fetch('/demo/api/oid4vc-metadata');
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success || !Array.isArray(data.ids) || data.ids.length === 0) {
      // The server's message is a human-readable notice and the raw exception comes only in detail,
      // so the select shows only the notice and the technical cause goes to the console and tooltip.
      const msg = (data && data.message) || 'No credentials available';
      if (data && data.detail) {
        console.error('OID4VC metadata load failed:', data.error, data.issuerUrl, data.detail);
      }
      // issuerUrl is user input from Server Settings, so set it through a DOM property instead of innerHTML
      select.innerHTML = '<option value=""></option>';
      const opt = select.options[0];
      opt.textContent = msg;
      if (data && data.issuerUrl) opt.title = 'Issuer URL: ' + data.issuerUrl;
      return;
    }
    select.innerHTML =
      '<option value="">Select a credential</option>' +
      data.ids.map((id) => `<option value="${id}">${id}</option>`).join('');
    // Restore the previous selection if it is still in the list
    if (prev && data.ids.includes(prev)) select.value = prev;
  } catch (e) {
    console.error('Failed to load OID4VC credential configs:', e);
    select.innerHTML = '<option value="">Cannot reach the Demo server — check that it is running</option>';
  } finally {
    select.disabled = false;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document
    .querySelectorAll('.vc-proto-tabs .btn-tab[data-vc-proto]')
    .forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        handleVcProtoSelection(btn.dataset.vcProto);
      });
    });
  renderProtoDesc('opendid');
  renderProtoSteps('opendid');
});

// The Issuer domain always comes from the saved Server Settings value.
// The backend issuer.url changes only on Save (ConfigService.updateServerSettings),
// so the unsaved input value would make the frontend (claims-page) and the backend proxy (metadata/offer) disagree.
// Always use the saved AppState value (the same as issuer.url) to keep them in sync.
function getIssuerOrigin() {
  const raw = (AppState?.serverSettings?.issuerServer || '').trim();
  if (!raw) return '';
  try {
    return new URL(raw).origin;
  } catch {
    try {
      return new URL(raw.startsWith('http') ? raw : 'http://' + raw).origin;
    } catch {
      return '';
    }
  }
}

function requireIssuerOrigin() {
  const origin = getIssuerOrigin();
  if (!origin) {
    alert('Please configure Issuer Server in Server Settings first.');
    return '';
  }
  return origin;
}

function openOID4VCIssuerSettings() {
  const input = document.getElementById('oid4vcUserId');
  const userId = (input && input.value || '').trim();
  if (!userId) {
    alert('Please enter User ID first.');
    if (input) input.focus();
    return;
  }
  const origin = requireIssuerOrigin();
  if (!origin) return;
  const url = `${origin}/claims-page?userId=${encodeURIComponent(userId)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

async function openOID4VCPopup() {
  const input = document.getElementById('oid4vcUserId');
  const userId = (input && input.value || '').trim();
  if (!userId) {
    alert('Please enter User ID first.');
    if (input) input.focus();
    return;
  }

  const credentialSelect = document.getElementById('oid4vcCredentialId');
  const credentialConfigurationId = (credentialSelect && credentialSelect.value || '').trim();
  if (!credentialConfigurationId) {
    alert('Please select a credential to issue.');
    if (credentialSelect) credentialSelect.focus();
    return;
  }

  if (isMobile) {
    try {
      const response = await fetch('/qrPush');
      if (response.ok) {
        document.getElementById('PopupArea').innerHTML = await response.text();
      } else {
        alert('Error: Failed to load the required content. Please try again later.');
      }
    } catch (error) {
      console.error('Error fetching the external HTML file:', error);
      alert('Error: Unable to load the required content. Please check your connection and try again.');
    }
    return;
  }

  try {
    const response = await fetch('/vcPopup');
    if (response.ok) {
      document.getElementById('PopupArea').innerHTML = await response.text();
      configureVcPopupForOID4VC();
      oid4vcOfferRefresh();
    } else {
      alert('Error: Failed to load the required content. Please try again later.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
  }
}

// In OID4VC mode, right after vcPopup opens, remove the OpenDID-only UI and insert the Tx Code field.
// vcPopup.html is shared with OpenDID, so these changes are applied in JS.
// OID4VC has no expiry and no issuance confirm step, so only Renew and Close are shown.
function configureVcPopupForOID4VC() {
  const dialog = document.getElementById('Dialog-VC');
  if (!dialog) return;

  // Renew button: switch to the OID4VC offer function (the label stays the same)
  const renewBtn = dialog.querySelector('.btn-refresh');
  if (renewBtn) {
    renewBtn.setAttribute('onclick', 'oid4vcOfferRefresh()');
    renewBtn.onclick = (e) => { e.preventDefault(); oid4vcOfferRefresh(); };
  }

  // Hide the Time left section: OID4VC QR codes do not expire
  const counter = dialog.querySelector('.counter');
  if (counter) counter.style.display = 'none';

  // Hide the "Validity period" label as well, since there is no expiry
  const validityLabel = dialog.querySelector('.refresh-item p');
  if (validityLabel) validityLabel.style.display = 'none';

  // Hide the "Receive mobile push" area: it is an OpenDID (TAS) only flow
  const otherProcess = dialog.querySelector('.other-process');
  if (otherProcess) otherProcess.style.display = 'none';

  // Hide the "Check issuance" button: OID4VC has no server-side confirm step
  const submitBtn = dialog.querySelector('.modal-footer .btn-primary');
  if (submitBtn) submitBtn.style.display = 'none';

  // Insert the Transaction Code field
  const qrImg = dialog.querySelector('.qr-img');
  if (qrImg && !document.getElementById('vcTxCodeBox')) {
    const box = document.createElement('div');
    box.id = 'vcTxCodeBox';
    box.className = 'vc-tx-code';
    box.innerHTML =
      '<label for="vcTxCode">Transaction Code</label>' +
      '<input id="vcTxCode" type="text" maxlength="6" readonly value="" />';
    qrImg.insertAdjacentElement('afterend', box);
  }
}

function oid4vcOfferRefresh() {
  window.vcOfferId = '';

  const input = document.getElementById('oid4vcUserId');
  const userId = (input && input.value || '').trim();

  const credentialSelect = document.getElementById('oid4vcCredentialId');
  const credentialConfigurationId = (credentialSelect && credentialSelect.value || '').trim();

  showLoading();

  // Same-origin proxy endpoint. The server relays it to the Issuer URL from Server Settings.
  fetch('/demo/api/oid4vc-offer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      credentialConfigurationId,
      grantType: 'pre-authorized_code',
      offerType: 'reference',
      scheme: 'openid-credential-offer:',
    }),
  })
    .then(async (response) => {
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        if (err.detail) {
          console.error('OID4VC offer failed:', err.error, err.issuerUrl, err.detail);
        }
        // Show the server's notice as-is; other errors fall back to the generic message in the catch below
        const userError = new Error(err.message || `HTTP ${response.status}`);
        userError.userFacing = true;
        throw userError;
      }
      return response.json();
    })
    .then((data) => {
      hideLoading();

      const responseTextArea = document.getElementById('responseTextArea');
      if (responseTextArea) {
        responseTextArea.value = JSON.stringify(data, null, 2);
      }

      // If the Issuer serializes the ResponseEntity as-is, the response looks like {body:{...}, headers, statusCode}.
      const payload = (data && typeof data === 'object' && data.body) ? data.body : data;

      const qrPayload = payload.qrImage || payload.qrCode || payload.image || payload.qr;
      if (qrPayload) {
        const qrContainer = document.querySelector('.qr-img');
        if (qrContainer) {
          let vcQrImg = document.getElementById('vcQrImage');
          if (!vcQrImg) {
            vcQrImg = document.createElement('img');
            vcQrImg.id = 'vcQrImage';
            vcQrImg.alt = 'Item Image';
            vcQrImg.style.maxWidth = '100%';
            vcQrImg.style.height = 'auto';
          }
          vcQrImg.src = qrPayload.startsWith('data:')
            ? qrPayload
            : 'data:image/png;base64,' + qrPayload;
          vcQrImg.style.display = '';
          qrContainer.innerHTML = '';
          qrContainer.appendChild(vcQrImg);
        }
      }

      const txCodeInput = document.getElementById('vcTxCode');
      if (txCodeInput) {
        txCodeInput.value = payload.txCode || '';
      }

      window.vcOfferId = payload.offerId || '';

      // OID4VC QR codes do not expire, so no countdown is used
      if (window.qrCountdownTimer) clearInterval(window.qrCountdownTimer);
    })
    .catch((error) => {
      hideLoading();
      console.error('Error generating OID4VC QR:', error);
      const responseTextArea = document.getElementById('responseTextArea');
      if (responseTextArea) {
        responseTextArea.value = 'Error: ' + error;
      }
      alert(error.userFacing
        ? error.message
        : 'Failed to generate OID4VC QR. Check console for details.');
    });
}

// Called from confirmPolicySelection() with the selected policy object
function refreshImageWithPolicy(policy) {
  window.vpOfferId = "";
  window.vpSessionId = "";
  window.vpProtocol = "";
  window._selectedPolicy = policy;

  showLoading();

  const policyId = policy.policyId;
  const policyTitle = policy.policyTitle || policy.policyId;

  fetch("/demo/api/initiate-verification", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ policyId: policyId })
  })
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
            qrImage.alt = 'QR Code';
            qrImage.style.maxWidth = '100%';
            qrImage.style.height = 'auto';
          }
          qrImage.src = "data:image/png;base64," + imageData;
          qrContainer.innerHTML = '';
          qrContainer.appendChild(qrImage);
        }
      }

      window.vpProtocol = data.protocol || (policy.protocolType || 'DID_VP').toUpperCase();
      window.vpSessionId = data.sessionId || "";
      window.vpOfferId = data.offerId || "";

      if (data.validUntil) {
        startCountdown(data.validUntil, "vp");
      } else if (window.vpProtocol === 'OID4VP') {
        const ttl = new Date(Date.now() + 300000).toISOString();
        startCountdown(ttl, "vp");
      }

      // Update protocol info in QR popup
      const protocolLabel = document.getElementById("vpProtocolType");
      if (protocolLabel) {
        const isDidVp = window.vpProtocol === 'DID_VP';
        protocolLabel.textContent = isDidVp ? 'DID VP' : 'OID4VP';
        protocolLabel.className = 'protocol-badge ' + (isDidVp ? 'did-vp' : 'oid4vp');
      }
      const policyLabel = document.getElementById("vpPolicyName");
      if (policyLabel) {
        policyLabel.textContent = policyTitle;
      }
      const flowInfo = document.getElementById("vpFlowInfo");
      if (flowInfo) {
        if (window.vpProtocol === 'DID_VP') {
          flowInfo.textContent = '\u2460 Profile \u2192 \u2461 VP Submit (E2E) \u2192 \u2462 Confirm';
        } else {
          flowInfo.textContent = '\u2460 Authorization Request \u2192 \u2461 VP Token Submit';
        }
      }

      // OID4VP: check the status manually with the "Submission Complete" button (no automatic polling)
      // submitVPComplete() checks the status instead of polling
    })
    .catch((error) => {
      hideLoading();
      console.error("Error initiating verification:", error);
      const responseTextArea = document.getElementById("responseTextArea");
      if (responseTextArea) {
        responseTextArea.value = "Error: " + error;
      }
      alert("Failed to initiate verification. Please try again.");
    });
}

// Legacy refreshImage - now delegates to refreshImageWithPolicy using stored policy
function refreshImage() {
  if (window._selectedPolicy) {
    refreshImageWithPolicy(window._selectedPolicy);
    return;
  }
  alert("Please select a VP Policy first.");
}

// OID4VP status polling
function startStatusPolling(sessionId) {
  if (window.statusPollingTimer) {
    clearInterval(window.statusPollingTimer);
  }

  window.statusPollingTimer = setInterval(async () => {
    try {
      const response = await fetch('/demo/api/verification-status/' + sessionId);
      if (!response.ok) return;
      const status = await response.json();

      if (status.status === 'COMPLETED') {
        clearInterval(window.statusPollingTimer);
        alert("VP submission completed via OID4VP.");
        const externalResponse = await fetch("/success");
        if (externalResponse.ok) {
          const externalHTML = await externalResponse.text();
          document.getElementById("PopupArea").innerHTML = externalHTML;
          updateSuccessDialog({ claims: [], protocol: 'OID4VP' });
        }
      } else if (status.status === 'FAILED' || status.status === 'EXPIRED') {
        clearInterval(window.statusPollingTimer);
        alert("Verification " + status.status.toLowerCase() + ". Please try again.");
      }
    } catch (e) {
      console.error("Status polling error:", e);
    }
  }, 3000); // poll every 3 seconds
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
