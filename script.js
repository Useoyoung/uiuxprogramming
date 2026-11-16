const serviceName = "반려식물 케어 서비스";
let isSubcribed = false;
let submitCount = 0;


function makeSubscribeMessage(email, subscribed) {
    if (subscribed == true) {
        return email + "로 신청이 완료되었습니다.";
    }
    
    return "이메일을 입력한 뒤 신청해주세요.";
}

const subscribeForm = document.querySelector("#subscribe-form");
const emailInput = document.querySelector("#email");
const subscribeButton = document.querySelector("#subscribeButton");
const subscribeMessage = document.querySelector("#subscribeMessage");

function handleSubscribe(event) {
    event.preventDefault();

    const subscriberEmail = emailInput.value.trim();

    if (subscriberEmail === "") {
        subscribeMessage.textContent = 
            "이메일을 입력한 뒤 신청해주세요.";
        emailInput.focus();
        return;
    }

    isSubcribed = true;
    submitCount += 1;

    subscribeMessage.textContent = 
        makeSubscribeMessage(subscriberEmail, isSubcribed);

    subscribeMessage.classList.add("is-success");

    subscribeButton.textContent = "신청 완료";
    subscribeButton.disabled = true;
}

subscribeForm.addEventListener("submit", handleSubscribe);

const themeButton = document.querySelector("#themeButton");
const nicknameInput = document.querySelector("#nickname");
const nicknameCount = document.querySelector("#nicknameCount");
const agreeCheck = document.querySelector("#agreeCheck");
const agreeMessage = document.querySelector("#agreeMessage");
const startButton = document.querySelector("#startButton");

function handleThemeClick() {
    /*console.log("click:", event.currentTarget.id);*/
    const isDark = document.body.classList.toggle("dark");

    themeButton.textContent = isDark ? "라이트 테마로 바꾸기" : "다크 테마로 바꾸기";
}

themeButton.addEventListener("click", handleThemeClick);

function handleNicknameInput() {
    /*console.log("input:", nicknameInput.value.length);*/
    const maxLength = nicknameInput.maxLength;
    const currentLength = Math.min(nicknameInput.value.length, maxLength);

    nicknameCount.textContent = currentLength + " / " + maxLength;
}

nicknameInput.addEventListener("input", handleNicknameInput);

function handleAgreeChange() {
    /*console.log("change:", agreeCheck.checked);*/
    const agreed = agreeCheck.checked;

    startButton.disabled = !agreed;
    agreeMessage.textContent = agreed
        ? "맞춤형 케어 설정을 시작할 수 있습니다."
        : "동의 후 맞춤형 케어 설정을 시작할 수 있습니다.";
    
    if (agreed) {
        agreeMessage.classList.add("is-ready");
    } else {
        agreeMessage.classList.remove("is-ready");
    }
}

agreeCheck.addEventListener("change", handleAgreeChange);

const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");

function resetTabsAndPanels() {
    tabs.forEach(function (tab) {
        tab.classList.remove("is-active");
        tab.setAttribute("aria-selected", "false");
    });
    panels.forEach(function (panel) {
        panel.classList.remove("is-active");
        panel.hidden = true;
    });
}

function activateTab(clickedTab) {
    const targetSelector = clickedTab.dataset.target;
    const targetPanel = document.querySelector(targetSelector);

    clickedTab.classList.add("is-active");
    clickedTab.setAttribute("aria-selected", "true");

    targetPanel.classList.add("is-active");
    targetPanel.hidden = false;
}

function handleTabClick(event) {
    resetTabsAndPanels();
    activateTab(event.currentTarget);
}

tabs.forEach(function (tab) {
    tab.addEventListener("click", handleTabClick);
});

const trainingFlow = document.querySelector("#training-flow");
const flowSteps = trainingFlow.querySelectorAll(".step");
const progressItems = trainingFlow.querySelectorAll(".progress__item");
const titleInput = document.querySelector("#presentation-title");
const titleError = document.querySelector("#title-error");
const titleField = document.querySelector("#title-field");
const titleHelp = document.querySelector("#title-help");
const titleCount = document.querySelector("#title-count");
const titleNext = document.querySelector("#title-next");
const durationRange = document.querySelector("#duration-range");
const durationValue = document.querySelector("#duration-value");
const qnaOption = document.querySelector("#qna-option");
const qnaOptions = document.querySelector("#qna-options");
const qnaInputs = document.querySelectorAll('input[name="qna-count"]');
const optionPrev = document.querySelector("#option-prev");
const optionNext = document.querySelector("#option-next");
const summaryPrev = document.querySelector("#summary-prev");
const restartButton = document.querySelector("#restart-button");
const summaryTitle = document.querySelector("#summary-title");
const summaryDuration = document.querySelector("#summary-duration");
const summaryQna = document.querySelector("#summary-qna");
const durationValues = ["3", "5", "10"];
const careForm = document.querySelector("#care-form");
let currentStep = 0;

const formData = {
    title:"", duration: "5", qna: false, qnaCount: "2"
};

const storageKey = "plant-care-settings-v1";
const planCount = document.querySelector("#plan-count");
const planList = document.querySelector("#plan-list");
const archiveStatus = document.querySelector("#archive-status");
const emptyState = document.querySelector("#empty-state");
const plantDialog = document.querySelector("#plant-dialog");
const plantDialogTitle = document.querySelector("#plant-dialog-title");
const plantDialogDate = document.querySelector("#plant-dialog-date");
const plantDialogName = document.querySelector("#plant-dialog-name");
const plantDialogDuration = document.querySelector("#plant-dialog-duration");
const plantDialogAge = document.querySelector("#plant-dialog-age");

const plantDialogEnvironment = document.querySelector("#plant-dialog-environment");

const navLinks = document.querySelectorAll(".main-nav a");

const menuToggle = document.querySelector("#menu-toggle");
const mainNav = document.querySelector("#main-nav");

const filterButtons = document.querySelectorAll(".filter-button");
let currentFilter = "all";

const dialogEnvironmentPlant = document.querySelector("#dialog-environment-plant");
const dialogEnvironmentDirection = document.querySelector("#dialog-environment-direction");
const dialogEnvironmentSeason = document.querySelector("#dialog-environment-season");
const dialogEnvironmentGlass = document.querySelector("#dialog-environment-glass");
const dialogEnvironmentCurtain = document.querySelector("#dialog-environment-curtain");
const dialogEnvironmentScreen = document.querySelector("#dialog-environment-screen");
const dialogEnvironmentShade = document.querySelector("#dialog-environment-shade");
const dialogEnvironmentDistance = document.querySelector("#dialog-environment-distance");
const dialogEnvironmentVentilation = document.querySelector("#dialog-environment-ventilation");

let plans = [];
let currentPlanId = "";

try {
    const savedPlans = JSON.parse(localStorage.getItem(storageKey) || "[]");

    if (Array.isArray(savedPlans)) {
        plans = savedPlans;
    }
} catch {
    plans = [];
}

function getFormValues() {
    return {
        title: formData.title,
        nickname: "",
        duration: formData.duration,
        qna: formData.qna,
        qnaCount: formData.qnaCount
    };
}

function savePlans() {
    try {
        localStorage.setItem(storageKey, JSON.stringify(plans));
        return true;
    } catch {
        return false;
    }
}

function updateCurrentNav() {
    const currentHash = window.location.hash;

    navLinks.forEach((link) => {
        const current = currentHash
            ? link.getAttribute("href") === currentHash
            : link === navLinks[0];
        
        link.classList.toggle("is-current", "page");

        if (current) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });
}

window.addEventListener("hashchange", updateCurrentNav);
updateCurrentNav();

menuToggle.addEventListener("click", () =>{
    const isOpen = mainNav.classList.toggle("is-open");

    menuToggle.textContent = isOpen ? "메뉴 닫기" : "메뉴 열기"
    menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        mainNav.classList.remove("is-open");
        menuToggle.textContent = "메뉴 열기";
        menuToggle.setAttribute("aria-expanded", "false");
    });
});

function getVisiblePlans() {
    return plans.filter((plan) => {
        if (currentFilter === "all") return true;
        if (currentFilter === "cancelled") return plan.cancelled;
        return !plan.cancelled;
    });
}

function renderPlans() {
    const visiblePlans = getVisiblePlans();

    planList.replaceChildren();
    emptyState.hidden = visiblePlans.length !==0;
    planList.hidden = visiblePlans.length === 0;

    const emptyTitle = emptyState.querySelector("h3");
    const emptyDescription = emptyState.querySelector("p");
    const emptyAction = emptyState.querySelector("a");

    if (visiblePlans.length === 0) {
        const filtered = currentFilter !== "all";
        emptyTitle.textContent = filtered
            ? "선택한 상태의 반려 식물이 없어요."
            : "아직 저장한 반려 식물이 없어요.";
        emptyDescription.textContent = filtered
            ? "다른 상태를 선택해보세요."
            : "첫 반려 식물을 설정하면 이곳에서 다시 볼 수 있습니다.";
        emptyAction.hidden = filtered;
    }

    planCount.textContent = String(visiblePlans.length);
    planCount.setAttribute(
        "aria-label",
        `현재 표시중인 식물 ${visiblePlans.length}개`
    );

    if (plans.length === 0) {
        emptyState.hidden = false;
        planList.hidden = true;
        return;
    }

    /*emptyState.hidden = true;
    planList.hidden = false;*/

    visiblePlans.forEach(function (plan) {
        const card = document.createElement("li");
        card.className = "saved-plant-card";

        card.className = `saved-plant-card${plan.cancelled ? " is-cancelled" : ""}`;

        const cardTop = document.createElement("div");
        cardTop.className = "saved-plant-card-top";

        const stateText = document.createElement("span");
        stateText.className = "saved-plant-state";
        stateText.textContent = plan.cancelled ? "취소됨" : "저장됨";
        cardTop.append(stateText);

        const title = document.createElement("h3");
        title.textContent = plan.title;

        const info = document.createElement("p");

        let ageText = "케어 설정 당일";

        card.append(title);

        const savedDate = new Date(plan.createdAt);

        if (!Number.isNaN(savedDate.getTime())) {
            const dateText = document.createElement("time");
            dateText.dateTime = plan.createdAt;
            dateText.textContent = new Intl.DateTimeFormat("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric"
            }).format(savedDate);
        
            cardTop.append(dateText);
        }

        if (plan.qna) {
            if (plan.qnaCount === "3") {
                ageText = "키운 지 3일 이상";
            } else {
                ageText = `키운 지 ${plan.qnaCount}일`;
            }
        }

        info.textContent = `${plan.duration}분 돌봄 · ${ageText}`;

        const openButton = document.createElement("button");
        openButton.type = "button";
        openButton.textContent = "정보 확인";
        openButton.dataset.action = "open";
        openButton.dataset.id = plan.id;

        const cancelButton = document.createElement("button");
        cancelButton.type = "button";
        cancelButton.textContent = plan.cancelled ? "취소 되돌리기" : "취소하기";
        cancelButton.dataset.action = "toggle";
        cancelButton.dataset.id = plan.id;

        const actions = document.createElement("div");
        actions.className = "saved-plant-actions";
        actions.append(openButton, cancelButton);

        card.append(cardTop, title, info, actions);
        /*card.append(title, info, openButton);*/
        planList.append(card);
    });
}

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        currentFilter = button.dataset.filter;

        filterButtons.forEach((item) => {
            const selected = item === button;
            item.classList.toggle("is-active", selected);
            item.setAttribute("aria-pressed", String(selected));
        });
        renderPlans();
    });
});

planList.addEventListener("click", function (event) {
    /*const button = event.target.closest('button[data-action="open"]');*/
    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const selectedPlan = plans.find(function (plan) {
        return plan.id === button.dataset.id;
    });

    if (!selectedPlan) return;

    if (button.dataset.action === "open") {
        plantDialogTitle.textContent = selectedPlan.title;
        plantDialogName.textContent = selectedPlan.title;
        plantDialogDuration.textContent = `${selectedPlan.duration}분`;

        if (selectedPlan.qna) {
            if (selectedPlan.qnaCount === "3") {
                plantDialogAge.textContent = "3일 이상";
            } else {
                plantDialogAge.textContent = `${selectedPlan.qnaCount}일`;
            }
        } else {
            plantDialogAge.textContent = "케어 설정 당일";
        }

        const savedDate = new Date(selectedPlan.createdAt);

        if (!Number.isNaN(savedDate.getTime())) {
            plantDialogDate.textContent =
                new Intl.DateTimeFormat("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }).format(savedDate);
        } else {
            plantDialogDate.textContent = "";
        }

        if (selectedPlan.environment) {
            const environment = selectedPlan.environment;

            plantDialogEnvironment.hidden = false;
            dialogEnvironmentPlant.textContent = environment.plantType;
            dialogEnvironmentDirection.textContent = environment.windowDirection;
            dialogEnvironmentSeason.textContent = environment.season;
            dialogEnvironmentGlass.textContent = environment.glassType;
            dialogEnvironmentCurtain.textContent = environment.curtain;
            dialogEnvironmentScreen.textContent = environment.screen;
            dialogEnvironmentShade.textContent = environment.shade;
            dialogEnvironmentDistance.textContent = environment.plantDistance;
            dialogEnvironmentVentilation.textContent = environment.ventilation;
        } else {
            plantDialogEnvironment.hidden = true;
        }

        plantDialog.showModal();
        return;
    }

    const wasCancelled = selectedPlan.cancelled;
    selectedPlan.cancelled = !wasCancelled;

    if (!savePlans()) {
        selectedPlan.cancelled = wasCancelled;
        archiveStatus.textContent = "취소 상태를 저장하지 못했습니다.";
        return;
    }

    renderPlans();
    archiveStatus.textContent = wasCancelled
        ? `'${selectedPlan.title}' 설정을 다시 사용할 수 있게 바꿨습니다.`
        : `'${selectedPlan.title}' 설정을 취소했습니다.`;
    /*plantDialogTitle.textContent = selectedPlan.title;
    plantDialogName.textContent = selectedPlan.title;
    plantDialogDuration.textContent = `${selectedPlan.duration}분`;

    if (selectedPlan.qna) {
        if (selectedPlan.qnaCount === "3") {
            plantDialogAge.textContent = "3일 이상";
        } else {
            plantDialogAge.textContent = `${selectedPlan.qnaCount}일`;
        }
    } else {
        plantDialogAge.textContent = "케어 설정 당일";
    }

    const savedDate = new Date(selectedPlan.createdAt);

    if (!Number.isNaN(savedDate.getTime())) {
        plantDialogDate.textContent =
            new Intl.DateTimeFormat("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric"
            }).format(savedDate);
    } else {
        plantDialogDate.textContent = "";
    }

    if (selectedPlan.environment) {
    const environment = selectedPlan.environment;

    plantDialogEnvironment.hidden = false;
    dialogEnvironmentPlant.textContent = environment.plantType;
    dialogEnvironmentDirection.textContent = environment.windowDirection;
    dialogEnvironmentSeason.textContent = environment.season;
    dialogEnvironmentGlass.textContent = environment.glassType;
    dialogEnvironmentCurtain.textContent = environment.curtain;
    dialogEnvironmentScreen.textContent = environment.screen;
    dialogEnvironmentShade.textContent = environment.shade;
    dialogEnvironmentDistance.textContent = environment.plantDistance;
    dialogEnvironmentVentilation.textContent = environment.ventilation;

    } else {
        plantDialogEnvironment.hidden = true;
    }

    plantDialog.showModal();*/
});

document.querySelector("#plant-dialog-close").addEventListener("click", function () {
    plantDialog.close();
});

document.querySelector("#plant-dialog-done").addEventListener("click", function () {
    plantDialog.close();
});

renderPlans();

/*function showStep(index) {
    flowSteps.forEach((step, i) => { step.hidden = i !== index; });
    progressItems.forEach((item, i) => {
        item.classList.toggle("is-active", i === index);
    });
}*/
function showStep(index) {
  currentStep = index;

  flowSteps.forEach((step, i) => {
    step.hidden = i !== index;
  });

  progressItems.forEach((item, i) => {
    item.classList.toggle("is-active", i === index);
  });

  const heading = flowSteps[index].querySelector("h3");
  heading.tabIndex = -1;
  heading.focus({ preventScroll: true });
}

const recordingDialog = document.querySelector("#recording-dialog");
const recordingCancle = document.querySelector("#recording-cancel");
const recordingConfirm = document.querySelector("#recording-confirm");

const saveButton = document.querySelector("#finish-button");
const submitStatus = document.querySelector("#submit-status");
const completeMessage = document.querySelector("#complete-message");
let isSubmitting = false;

function revokeRecordingAgreement() {
    agreeCheck.checked = false;
    trainingFlow.hidden = true;
    handleAgreeChange();
    agreeCheck.focus();
}

startButton.addEventListener("click", () => {
    if (!agreeCheck.checked) return;
    recordingDialog.showModal();
});
recordingCancle.addEventListener("click", () => {
    recordingDialog.close();
    revokeRecordingAgreement();
});
recordingDialog.addEventListener("cancel", revokeRecordingAgreement);
recordingConfirm.addEventListener("click", () => {
    if (!agreeCheck.checked) return;
    recordingDialog.close();
    trainingFlow.hidden = false;
    showStep(0);
    trainingFlow.scrollIntoView({ behavior: "smooth" });
    titleInput.focus();
});

function updateTitleExperience(){
    const length = titleInput.value.length;
    const valid = titleInput.value.trim().length >= 2;
    const hasError = titleInput.getAttribute("has-error") === "true";

    titleCount.textContent = `${length} / 60자`;
    /*titleCount.textContent = length + " / 60자";*/
    titleField.classList.toggle("has-error", hasError);
    titleField.classList.toggle("is-valid", valid && !hasError);
    titleHelp.textContent = hasError
        ? "입력 조건을 다시 확인해주세요."
        : valid
            ? "입력 조건을 충족했습니다."
    : "2자 이상 60자 이하로 입력해주세요."
}

function validateTitle() {
    const value = titleInput.value.trim();
    if (!value) {
        titleError.textContent = "반려 식물 이름을 입력해주세요.";
        titleInput.classList.add("aria-invalid");
        updateTitleExperience();
        titleInput.focus();
        return false;
    }
    if (value.length < 2){
        titleError.textContent = "반려 식물 이름은 2자 이상 입력해주세요.";
        titleInput.setAttribute("aria-invalid", "true");
        updateTitleExperience();
        titleInput.focus();
        return false;
    }
    titleError.textContent = "";
    titleInput.classList.remove("aria-invalid");
    updateTitleExperience();
    formData.title = value;
    return true;
}

titleInput.addEventListener("input", () => {
  if (titleInput.getAttribute("aria-invalid") === "true") {
    validateTitle();
  } else {
    updateTitleExperience();
  }
});

titleNext.addEventListener("click", () => {
    if (!validateTitle()) return;
    showStep(1);
});
updateTitleExperience();

durationRange.addEventListener("input", () => {
    durationValue.value = durationValues[durationRange.value] + "분";
});

function syncQnaOptions(){
    const open = qnaOption.checked;
    qnaOption.setAttribute("aria-expanded", String(open));
    qnaOptions.hidden = !open;
    qnaInputs.forEach((input) => {
        input.disabled = !open;
    });
}

/*qnaOption.addEventListener("change", () => {
    qnaOptions.hidden = !qnaOption.checked;
});*/
qnaOption.addEventListener("change", syncQnaOptions);
syncQnaOptions();

careForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (currentStep === 0) {
        if (validateTitle()) showStep(1);
        return;
    }
      if (currentStep === 1) {
        optionNext.click();
        return;
    }
    if (currentStep !== 2 || isSubmitting) return;

    if(!validateTitle()) {
        showStep(0);
        titleInput.focus();
        return;
    }

    setSubmitState("loading", "입력한 정보를 저장하고 있습니다.");
    window.setTimeout(() => {
        if (!saveCareSettings()) {
            setSubmitState("error", "저장하지 못했습니다. 입력 내용을 확인하고 다시 시도해주세요.");
            return;
        }
        setSubmitState("success", "정보 저장이 완료되었습니다.");
        showStep(3);
    }, 600);
});

optionPrev.addEventListener("click", () => showStep(0));
optionNext.addEventListener("click", () => {
    formData.duration = durationValues[durationRange.value];
    formData.qna = qnaOption.checked;
    const count = document.querySelector('input[name="qna-count"]:checked');
    formData.qnaCount = count.value;
    summaryTitle.textContent = formData.title;
    summaryDuration.textContent = formData.duration + "분";
    summaryQna.textContent = formData.qna ? formData.qnaCount + "일" : "0일";
    showStep(2);
});

function setSubmitState(state, message){
    isSubmitting = state === "loading";
    careForm.setAttribute("aria-busy", String(isSubmitting));
    saveButton.disabled = isSubmitting;
    saveButton.textContent = isSubmitting ? "저장하는 중..." : "설정 완료하기";
    submitStatus.textContent = message;
    submitStatus.classList.toggle("is-success", state === "success");
    submitStatus.classList.toggle("has-error", state === "error");
}

summaryPrev.addEventListener("click", () => showStep(1));
/*finishButton.addEventListener("click", () => showStep(3));*/
function saveCareSettings(){
    const plan = {
        id: typeof crypto.randomUUID === "function"
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random()}`,
        ...getFormValues(),
        cancelled: false,
        createdAt: new Date().toISOString()
    };

    plans.unshift(plan);
    if(!savePlans()){
        plans.shift();
        return false;
    }

    currentPlanId = plan.id;

    renderPlans();
    archiveStatus.textContent = `'${plan.title}' 정보를 저장했습니다.`;
    completeMessage.textContent = `'${plan.title}' 정보를 다시 열어볼 수 있습니다.`;
    return true;
}

restartButton.addEventListener("click", () => {
    formData.title = "";
    formData.duration = "5";
    formData.qna = false;
    formData.qnaCount = "2";
    titleInput.value = "";
    titleError.textContent = "";
    /*titleInput.classList.remove("has-error");*/
    titleInput.removeAttribute("has-error");
    titleField.classList.remove("is-valid", "has-error");
    updateTitleExperience();
    setSubmitState("idle", "");
    durationRange.value = "1";
    durationValue.value = "5분";
    qnaOption.checked = false;
    syncQnaOptions();
    document.querySelector('input[name="qna-count"][value="2"]').checked = true;
    summaryTitle.textContent = "";
    summaryDuration.textContent = "";
    summaryQna.textContent = "";
    showStep(0);
});

const environmentStartButton = document.querySelector("#environment-start-button");
const environmentFlow = document.querySelector("#environment-flow");
const environmentSteps = environmentFlow.querySelectorAll(".environment-step");
const environmentProgressItems = environmentFlow.querySelectorAll(".environment-progress-item");

const plantTypeInput = document.querySelector("#plant-type");
const plantTypeError = document.querySelector("#plant-type-error");
const environmentError = document.querySelector("#environment-error");
const environmentSaveStatus = document.querySelector("#environment-save-status");
const environmentFinishButton = document.querySelector("#environment-finish-button");
const environmentSummaryPlant = document.querySelector("#environment-summary-plant");
const environmentSummaryDirection = document.querySelector("#environment-summary-direction");
const environmentSummarySeason = document.querySelector("#environment-summary-season");
const environmentSummaryGlass = document.querySelector("#environment-summary-glass");
const environmentSummaryCurtain = document.querySelector("#environment-summary-curtain");
const environmentSummaryScreen = document.querySelector("#environment-summary-screen");
const environmentSummaryShade = document.querySelector("#environment-summary-shade");
const environmentSummaryDistance = document.querySelector("#environment-summary-distance");
const environmentSummaryVentilation = document.querySelector("#environment-summary-ventilation");

const environmentData = {plantType: "", windowDirection: "", season: "", glassType: "", curtain: "", screen: "", shade: "", plantDistance: "", ventilation: ""};

function showEnvironmentStep(stepIndex) {
    environmentSteps.forEach(function (step, index) {
        step.hidden = index !== stepIndex;
    });

    environmentProgressItems.forEach(function (item, index) {
        item.classList.toggle("is-active", index === stepIndex);
    });
}

environmentStartButton.addEventListener("click", function () {
    trainingFlow.hidden = true;
    environmentFlow.hidden = false;
    showEnvironmentStep(0);
    environmentFlow.scrollIntoView({ behavior: "smooth" });
});

document.querySelector("#back-to-care-button").addEventListener("click", function () {
    environmentFlow.hidden = true;
    trainingFlow.hidden = false;
    showStep(3);
});

document.querySelector("#plant-type-next").addEventListener("click", function () {
    const plantType = plantTypeInput.value.trim();

    if (plantType === "") {
        plantTypeError.textContent = "식물 종류를 입력해주세요.";
        plantTypeInput.focus();
        return;
    }

    environmentData.plantType = plantType;
    plantTypeError.textContent = "";
    showEnvironmentStep(1);
});

const environmentNext = document.querySelector("#environment-next");
const directionError = document.querySelector("#direction-error");

environmentNext.addEventListener("click", function () {
    const selectedDirection = document.querySelector('input[name="window-direction"]:checked');
    const selectedSeason = document.querySelector('input[name="season"]:checked');

    if (!selectedDirection || !selectedSeason) {
        directionError.textContent = "창문 방향과 계절을 각각 선택해주세요.";
        return;
    }

    directionError.textContent = "";
    environmentData.windowDirection = selectedDirection.value;
    environmentData.season = selectedSeason.value;

    showEnvironmentStep(2);
});

const environmentPrevButtons = environmentFlow.querySelectorAll(".environment-prev");

environmentPrevButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        const currentStep = Array.from(environmentSteps).findIndex(
            function (step) {
                return !step.hidden;
            }
        );

        showEnvironmentStep(currentStep - 1);
    });
});

document.querySelector("#environment-confirm-button").addEventListener("click", function () {
    const selectedGlass = document.querySelector('input[name="glass-type"]:checked');
    const selectedCurtain = document.querySelector('input[name="curtain"]:checked');
    const selectedScreen = document.querySelector('input[name="screen"]:checked');
    const selectedShade = document.querySelector('input[name="shade"]:checked');
    const selectedDistance = document.querySelector('input[name="plant-distance"]:checked');
    const selectedVentilation = document.querySelector('input[name="ventilation"]:checked');

    if (!selectedGlass || !selectedCurtain || !selectedScreen || !selectedShade || !selectedDistance || !selectedVentilation) {
        environmentError.textContent = "각 항목을 선택한 뒤 내용 확인하기를 눌러주세요.";
        return;
    }

    environmentData.glassType = selectedGlass.value;
    environmentData.curtain = selectedCurtain.value;
    environmentData.screen = selectedScreen.value;
    environmentData.shade = selectedShade.value;
    environmentData.plantDistance = selectedDistance.value;
    environmentData.ventilation = selectedVentilation.value;

    environmentError.textContent = "";

    environmentSummaryPlant.textContent = environmentData.plantType;
    environmentSummaryDirection.textContent = environmentData.windowDirection;
    environmentSummarySeason.textContent = environmentData.season;
    environmentSummaryGlass.textContent = environmentData.glassType;
    environmentSummaryCurtain.textContent = environmentData.curtain;
    environmentSummaryScreen.textContent = environmentData.screen;
    environmentSummaryShade.textContent = environmentData.shade;
    environmentSummaryDistance.textContent = environmentData.plantDistance;
    environmentSummaryVentilation.textContent = environmentData.ventilation;

    showEnvironmentStep(3);
});

/*document.querySelector("#environment-finish-button").addEventListener("click", function () {
    showEnvironmentStep(4);
});*/
environmentFinishButton.addEventListener("click", function () {
    if (environmentFinishButton.disabled) return;

    const savedPlan = plans.find(function (plan) {
        return plan.id === currentPlanId;
    });

    if (!savedPlan) {
        environmentSaveStatus.textContent = "저장한 반려 식물 정보를 찾을 수 없습니다.";
        return;
    }

    const previousEnvironment = savedPlan.environment;

    environmentFlow.setAttribute("aria-busy", "true");
    environmentFinishButton.disabled = true;
    environmentFinishButton.textContent = "저장하는 중...";
    environmentSaveStatus.textContent = "일조량·환기 환경 정보를 저장하고 있습니다.";

    window.setTimeout(function () {
        savedPlan.environment = {
            ...environmentData
        };

        if (!savePlans()) {
            savedPlan.environment = previousEnvironment;
            environmentFlow.setAttribute("aria-busy", "false");
            environmentFinishButton.disabled = false;
            environmentFinishButton.textContent = "설정 완료하기";
            environmentSaveStatus.textContent = "저장하지 못했습니다. 다시 시도해주세요.";
            return;
        }

        archiveStatus.textContent = `‘${savedPlan.title}’의 모든 정보를 저장했습니다.`;

        renderPlans();

        environmentFlow.setAttribute("aria-busy", "false");
        environmentFinishButton.disabled = false;
        environmentFinishButton.textContent = "설정 완료하기";
        showEnvironmentStep(4);
    }, 600);
});


document.querySelector("#environment-restart-button").addEventListener("click", function () {
    environmentData.plantType = "";
    environmentData.windowDirection = "";
    environmentData.season = "";
    environmentData.glassType = "";
    environmentData.curtain = "";
    environmentData.screen = "";
    environmentData.shade = "";
    environmentData.plantDistance = "";
    environmentData.ventilation = "";

    plantTypeInput.value = "";
    plantTypeError.textContent = "";
    directionError.textContent = "";
    environmentError.textContent = "";

    document.querySelectorAll('#environment-flow input[type="radio"]').forEach(function (radio) {
        radio.checked = false;
    });

    environmentSummaryPlant.textContent = "";
    environmentSummaryDirection.textContent = "";
    environmentSummarySeason.textContent = "";
    environmentSummaryGlass.textContent = "";
    environmentSummaryCurtain.textContent = "";
    environmentSummaryScreen.textContent = "";
    environmentSummaryShade.textContent = "";
    environmentSummaryDistance.textContent = "";
    environmentSummaryVentilation.textContent = "";

    showEnvironmentStep(0);
    environmentFlow.scrollIntoView({ behavior: "smooth" });
});


document.querySelector("#environment-close-button").addEventListener("click", function () {
    environmentFlow.hidden = true;
});

/*console.log(typeof serviceName);
console.log(typeof isSubcribed);
console.log(typeof submitCount);

console.log(makeSubscribeMessage("", false));
console.log(makeSubscribeMessage("learner@example.com", true));*/

/*console.log(subscribeForm);
console.log(emailInput);
console.log(subscribeButton);
console.log(subscribeMessage);*/
