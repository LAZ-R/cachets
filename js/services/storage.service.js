import { APP_LOCAL_STORAGE_ID } from "../../app-properties.js";
import { getFormatedDateString } from "../main.js";

const STORAGE = localStorage;
const appLocalStorageId = APP_LOCAL_STORAGE_ID;

export const setStorage = () => {
  if (STORAGE.getItem(`${appLocalStorageId}FirstTime`) === null) {
    STORAGE.setItem(`${appLocalStorageId}FirstTime`, '0');
    
    let userTMP = {
      history:  [],
    };
    STORAGE.setItem(`${appLocalStorageId}User`, JSON.stringify(userTMP));
  } else {
  }
}

export const getUser = () => {
  return JSON.parse(STORAGE.getItem(`${appLocalStorageId}User`));
}
export const setUser = (user) => {
  STORAGE.setItem(`${appLocalStorageId}User`, JSON.stringify(user));
}

export const setNewDayBloc = (date) => {
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  console.log(date);
  const dateString = getFormatedDateString(date).slice(0, 10);
  console.log(dateString);
  const dayBloc = {
    date: dateString,
    morningKeppra: false,
    morningLacosamide: false,
    eveningKeppra: false,
    eveningLacosamide: false,
  }
  let user = getUser();
  user.history.push(dayBloc);
  setUser(user);
}

export const getTodayDayBloc = (todayDate) => {
  const todayDateString = getFormatedDateString(todayDate).slice(0, 10);
  let user = getUser();
  for (let dayBloc of user.history) {
    if (dayBloc.date == todayDateString) {
      return dayBloc;
    }
  }
  // If no today bloc
  setNewDayBloc(todayDate);
  let user2 = getUser();
  for (let dayBloc of user2.history) {
    if (dayBloc.date == todayDateString) {
      return dayBloc;
    }
  }
}

export const changeTodayPillStatus = (todayDate, pillId) => {
  const todayDateString = getFormatedDateString(todayDate).slice(0, 10);
  let user = getUser();
  for (let dayBloc of user.history) {
    if (dayBloc.date == todayDateString) {
      switch (pillId) {
        case 'morningKeppra':
          dayBloc.morningKeppra = !dayBloc.morningKeppra;
          break;
        case 'morningLacosamide':
          dayBloc.morningLacosamide = !dayBloc.morningLacosamide;
          break;
        case 'eveningKeppra':
          dayBloc.eveningKeppra = !dayBloc.eveningKeppra;
          break;
        case 'eveningLacosamide':
          dayBloc.eveningLacosamide = !dayBloc.eveningLacosamide;
          break;
        default:
          break;
      }
    }
  }
  setUser(user);
}