import { EventEmitter } from "events";

import Dispatcher from "./dispatcher";
import Constants from "./constants";
import getSidebarNavItems from "../data/sidebar-nav-items";
import { useHistory } from "react-router-dom";

let _store = {
  menuVisible: false,
  navItems: getSidebarNavItems(),
  user: null,
};

class Store extends EventEmitter {
  constructor() {
    super();

    this.registerToActions = this.registerToActions.bind(this);
    this.toggleSidebar = this.toggleSidebar.bind(this);

    Dispatcher.register(this.registerToActions.bind(this));
  }

  registerToActions({ actionType, payload }) {
    switch (actionType) {
      case Constants.TOGGLE_SIDEBAR:
        this.toggleSidebar();
        break;
      case Constants.USER_LOG_IN:
        this.addUser();
        break;
      default:
    }
  }

  toggleSidebar() {
    _store.menuVisible = !_store.menuVisible;
    this.emit(Constants.CHANGE);
  }

  addUser() {
    _store.user = JSON.parse(localStorage.getItem("user"));
    this.emit(Constants.CHANGE);
  }

  removeUser() {
    _store.user = null;
    this.emit(Constants.CHANGE);
    localStorage.clear()
  }

  getMenuState() {
    return _store.menuVisible;
  }

  getSidebarItems() {
    const user = this.getUser();

    if (user == null) {
      const history = useHistory();
      history.push("/login")
    }

    console.log(user)
    const isCaretaker = user.is_full_time != undefined;
    const isAdmin = user.is_pcs_admin;
    const isPetowner = user.is_pet_owner;

    if (isAdmin) return _store.navItems.filter(x => x.to != "/care-taker" || x.to != "/pet-owner" )
    if (isCaretaker && isPetowner) return _store.navItems.filter(x => x.to != "/admin")
    if (isCaretaker) return _store.navItems.filter(x => x.to != "/admin" || x.to != "/pet-owner")
    if (isPetowner) return _store.navItems.filter(x => x.to != "/admin" || x.to != "/care-taker")
    // return _store.navItems;
  }

  getUser() {
    _store.user = JSON.parse(localStorage.getItem("user"));
    console.log(_store.user)
    console.log(_store.navItems)
    return _store.user;
  }

  addChangeListener(callback) {
    this.on(Constants.CHANGE, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(Constants.CHANGE, callback);
  }
}

export default new Store();
