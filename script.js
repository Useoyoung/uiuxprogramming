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
const titleNext = document.querySelector("#title-next");
const durationRange = document.querySelector("#duration-range");
const durationValue = document.querySelector("#duration-value");
const qnaOption = document.querySelector("#qna-option");
const qnaOptions = document.querySelector("#qna-options");
const optionPrev = document.querySelector("#option-prev");
const optionNext = document.querySelector("#option-next");
const summaryPrev = document.querySelector("#summary-prev");
const finishButton = document.querySelector("#finish-button");
const restartButton = document.querySelector("#restart-button");
const summaryTitle = document.querySelector("#summary-title");
const summaryDuration = document.querySelector("#summary-duration");
const summaryQna = document.querySelector("#summary-qna");
const durationValues = ["3", "5", "10"];

const formData = {
    title:"", duration: "5", qna: false, qnaCount: "2"
};

function showStep(index) {
    flowSteps.forEach((step, i) => { step.hidden = i !== index; });
    progressItems.forEach((item, i) => {
        item.classList.toggle("is-active", i === index);
    });
}

const recordingDialog = document.querySelector("#recording-dialog");
const recordingCancle = document.querySelector("#recording-cancel");
const recordingConfirm = document.querySelector("#recording-confirm");

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

function validateTitle() {
    const value = titleInput.value.trim();
    if (!value) {
        titleError.textContent = "반려 식물 이름을 입력해주세요.";
        titleInput.classList.add("has-error");
        titleInput.focus();
        return false;
    }
    titleError.textContent = "";
    titleInput.classList.remove("has-error");
    formData.title = value;
    return true;
}

titleNext.addEventListener("click", () => {
    if (!validateTitle()) return;
    showStep(1);
});

durationRange.addEventListener("input", () => {
    durationValue.value = durationValues[durationRange.value] + "분";
});
qnaOption.addEventListener("change", () => {
    qnaOptions.hidden = !qnaOption.checked;
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

summaryPrev.addEventListener("click", () => showStep(1));
finishButton.addEventListener("click", () => showStep(3));
restartButton.addEventListener("click", () => {
    formData.title = "";
    formData.duration = "5";
    formData.qna = false;
    formData.qnaCount = "2";
    titleInput.value = "";
    titleError.textContent = "";
    titleInput.classList.remove("has-error");
    durationRange.value = "1";
    durationValue.value = "5분";
    qnaOption.checked = false;
    qnaOptions.hidden = true;
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

document.querySelector("#environment-finish-button").addEventListener("click", function () {
    showEnvironmentStep(4);
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