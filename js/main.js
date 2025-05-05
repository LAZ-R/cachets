import { APP_NAME, APP_VERSION } from "../app-properties.js";
import { getSvgIcon } from "./services/icons.service.js";
import { logAppInfos, setHTMLTitle } from "./utils/UTILS.js";
import { setStorage } from "./services/storage.service.js";
import { getTodayDayBloc } from "./services/storage.service.js";
import { changeTodayPillStatus } from "./services/storage.service.js";
import { getUser } from "./services/storage.service.js";

// VARIABLES //////////////////////////////////////////////////////////////////////////////////////
const HEADER = document.getElementById('header');
const MAIN = document.getElementById('main');
let isHistoryVisible = false;

const TODAY_DATE = new Date();
TODAY_DATE.setHours(0);
TODAY_DATE.setMinutes(0);
TODAY_DATE.setSeconds(0);
TODAY_DATE.setMilliseconds(0);

console.log(TODAY_DATE);


// FUNCTIONS //////////////////////////////////////////////////////////////////////////////////////

const getFrenchFormatedDateString = (date, showDayName) => {
  const day = date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate();
  const month = date.getMonth() + 1 < 10 ? '0'+(date.getMonth() + 1) : (date.getMonth() + 1);
  const year = date.getFullYear();
  if (showDayName) {
    let dayName = '';
    const dayNumber = Number(date.getDay());

    switch (dayNumber) {
      case 0: dayName = 'DIM'; break;
      case 1: dayName = 'LUN'; break;
      case 2: dayName = 'MAR'; break;
      case 3: dayName = 'MER'; break;
      case 4: dayName = 'JEU'; break;
      case 5: dayName = 'VEN'; break;
      case 6: dayName = 'SAM'; break;
    
      default: break;
    }
    
    return `${dayName} ${day}/${month}/${year}`;
  } else {
    return `${day}/${month}/${year}`;
  }
}

export const getFormatedDateString = (date) => {
  const day = date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate();
  const month = date.getMonth() + 1 < 10 ? '0'+(date.getMonth() + 1) : (date.getMonth() + 1);
  const year = date.getFullYear();
  
  return `${year}-${month}-${day}`;
}

// USER INTERACTIONS ##########################################################

// HEADER =================================================
const onHistoryButtonClick = () => {
  console.log(TODAY_DATE);
  const historyElement = document.getElementById('history');
  if (isHistoryVisible) {
    historyElement.style.display = 'none';
  } else {
    historyElement.style.display = 'flex';
  }

  isHistoryVisible = !isHistoryVisible;
}
window.onHistoryButtonClick = onHistoryButtonClick;

// HOMEPAGE ===============================================

const onPillButtonClick = (pillId) => {
  console.log(pillId);
  changeTodayPillStatus(TODAY_DATE, pillId);
  TODAY_DAY_BLOC = getTodayDayBloc(TODAY_DATE);
  refreshHomepageContainer();
  renderHistorySection();
}
window.onPillButtonClick = onPillButtonClick;

// IHM RENDER #################################################################

// HOMEPAGE ===============================================

const setHomepage = () => {
  setHTMLTitle(APP_NAME);
  renderHomepageHeader();

  let str = `
    <h1>${getFrenchFormatedDateString(TODAY_DATE, true)}</h1>
    <div id="homepageContainer" class="homepage-container"></div>
  `;
  MAIN.innerHTML = str;

  setTimeout(() => {
    refreshHomepageContainer();
  }, 10);
}

const refreshHomepageContainer = () => {
  const homepageContainer = document.getElementById('homepageContainer');
  homepageContainer.innerHTML = `
    <div class="half-day-container">
      <span class="half-day-title">Matin</span>
      <img class="half-day-icon" src="./medias/images/sunrise.png" />
      <div class="half-day-buttons-container">
        <button onclick="onPillButtonClick('morningKeppra')" id="morningKeppra" class="button solid ${TODAY_DAY_BLOC.morningKeppra == true ? 'success' : ''}">
          <span>Keppra</span>  
          <div class="img-container">
            <img src="./medias/images/keppra.png" />
          </div>
        </button>
        <button onclick="onPillButtonClick('morningLacosamide')" id="morningLacosamide" class="button solid ${TODAY_DAY_BLOC.morningLacosamide == true ? 'success' : ''}">
          <span>Lacosamide</span>  
          <div class="img-container">
            <img src="./medias/images/lacosamide.png" />
          </div>
        </button>
      </div>
    </div>
    <div class="half-day-container">
      <span class="half-day-title">Soir</span>
      <img class="half-day-icon" src="./medias/images/sunset.png" />
      <div class="half-day-buttons-container">
        <button onclick="onPillButtonClick('eveningKeppra')" id="eveningKeppra" class="button solid ${TODAY_DAY_BLOC.eveningKeppra == true ? 'success' : ''}">
          <span>Keppra</span>  
          <div class="img-container">
            <img src="./medias/images/keppra.png" />
          </div>
        </button>
        <button onclick="onPillButtonClick('eveningLacosamide')" id="eveningLacosamide" class="button solid ${TODAY_DAY_BLOC.eveningLacosamide == true ? 'success' : ''}">
          <span>Lacosamide</span>  
          <div class="img-container">
            <img src="./medias/images/lacosamide.png" />
          </div>
        </button>
      </div>
    </div>
  `;
}

const renderHomepageHeader = () => {
  HEADER.innerHTML = `
    <p>Cachets v ${APP_VERSION}</p>
    <button onclick="onHistoryButtonClick()" class="button outlined primary" style="padding: 4px 8px;">
      ${getSvgIcon('list', 's')}
    </button>
  `;
}

const renderHistorySection = () => {
  const user = getUser();
  let str = ``;
  for (let dayBloc of user.history.reverse()) {
    str += getDayBlocIhm(dayBloc);
  }
  const historySection = document.getElementById('history');
  historySection.innerHTML = str;
}

const getDayBlocIhm = (dayBloc) => {
  let dateString = dayBloc.date;
  let date = new Date(dateString);
  return `
    <div class="day-bloc ${(date.getDate() == TODAY_DATE.getDate() && date.getMonth() == TODAY_DATE.getMonth() && date.getFullYear() == TODAY_DATE.getFullYear()) ? 'today' : ''}">
      <span class="day-bloc-date">${getFrenchFormatedDateString(date, true)}</span>
      <div class="day-bloc-half-days">
        <div class="day-bloc-half-day">
          <img class="half-day-icon" src="./medias/images/sunrise.png" />
          <div class="half-day-pills">
            <div class="half-day-pill">
              <div class="img-container ${dayBloc.morningKeppra ? 'success' : ''}">
                <img src="./medias/images/keppra.png" />
              </div>
              <!-- <span class="taken-bloc ${dayBloc.morningKeppra ? 'success' : ''}"></span> -->
            </div>
            <div class="half-day-pill">
              <div class="img-container ${dayBloc.morningLacosamide ? 'success' : ''}">
                <img src="./medias/images/lacosamide.png" />
              </div>
              <!-- <span class="taken-bloc ${dayBloc.morningLacosamide ? 'success' : ''}"></span> -->
            </div>  
          </div>
        </div>
        <div class="day-bloc-half-day">
          <img class="half-day-icon" src="./medias/images/sunset.png" />
          <div class="half-day-pills">
            <div class="half-day-pill">
              <div class="img-container ${dayBloc.eveningKeppra ? 'success' : ''}">
                <img src="./medias/images/keppra.png" />
              </div>
              <!-- <span class="taken-bloc ${dayBloc.eveningKeppra ? 'success' : ''}"></span> -->
            </div>
            <div class="half-day-pill">
              <div class="img-container ${dayBloc.eveningLacosamide ? 'success' : ''}">
                <img src="./medias/images/lacosamide.png" />
              </div>
              <!-- <span class="taken-bloc ${dayBloc.eveningLacosamide ? 'success' : ''}"></span> -->
            </div>  
          </div>
        </div>
      </div>
    </div>
    
    ${date.getDay() === 1 ? '<hr>' : ''}
  `;
}

// INITIALIZATION /////////////////////////////////////////////////////////////////////////////////

logAppInfos(APP_NAME, APP_VERSION);
setHTMLTitle(APP_NAME);
setStorage();

let TODAY_DAY_BLOC = getTodayDayBloc(TODAY_DATE);
//console.log(TODAY_DAY_BLOC);

// EXECUTION //////////////////////////////////////////////////////////////////////////////////////
setHomepage()
renderHistorySection();