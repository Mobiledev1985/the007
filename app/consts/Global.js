import { Platform } from "react-native";
export const itemSkus = Platform.select({
  ios: [""],
  android: [""],
});

export const APPSTORE_URL = "https://";
export const BASE_URL = "https://";
export const MD5_BASE_URL = "https://";
export const BASE_URL_DEV = "https://";
export const MD5_BASE_URL_DEV = "https://";

export const BASE_PAGE_URL = "https://";
export const BASE_PAGE_URL2 = "https//";

export const PAYPAL_API = "https://";
export const PAYPAL_API_SANDBOX = "https://";
export const PAYPAL_CLIENTID = "-JgOqkJ";
export const PAYPAL_CLIENTID_SANDBOX = "-JgOqkJ";
export const PAYPAL_SECRETEKEY = "-0zPAEsk42NVo6";
export const PAYPAL_SECRETEKEY_SANDBOX = "-0zPAEsk42NVo6";
export const PAYPAL_REDIRECT_URL = "https://";

export const URL_PROFILE_TYPES = BASE_URL + "register";
export const URL_PROFILE_TYPES_DEV = BASE_URL_DEV + "register";
//export const TERMS_AND_CONDITIONS_URL = BASE_PAGE_URL + "page/disclaimers";
export const TERMS_AND_CONDITIONS_URL = "";
export const ABOUTUS_URL = "";
export const URL_LOGIN = BASE_URL + "login";
export const URL_REGISTERTYPE = BASE_URL + "register?type=2";
export const URL_REGISTER = BASE_URL + "signup";
export const URL_FORGOTPASSWORD = BASE_URL + "forgot-password";
export const URL_MY_PROFILE_DETAIL = BASE_URL + "profile/";
export const URL_EVENT_DETAIL = BASE_URL + "event/view/";
export const URL_EVENT_CANCEL = BASE_URL + "event-cancel/";
export const URL_EVENT_REMOVE = BASE_URL + "remove-event/";
export const URL_EVENT_JOIN = BASE_URL + "event/add-attend";
export const URL_EVENT_RSVP = BASE_URL + "event-rsvp";
export const URL_GENERATE_QR_CODE = BASE_URL + "generate-qr-code/";
export const URL_ADD_EVENT_COMMENT = BASE_URL + "event-discussion/add/";
export const URL_ACCEPT_REJECT = BASE_URL + "connection/action";
export const URL_CONNECT_REQUEST = BASE_URL + "connect-request";
export const URL_FILTER_OPTION = BASE_URL + "search?";
export const URL_RECENT_CHAT = BASE_URL + "messages";
export const URL_GET_MESSAGE = BASE_URL + "get/message";
export const URL_ADD_MESSAGE = BASE_URL + "message/add";
export const URL_GET_CHATLIST = BASE_URL + "get-user-chatlist";
export const URL_INVITE_USER = BASE_URL + "refer-friends";
export const URL_INVITEE_NON_MEMBER = BASE_URL + "send-email-sms";
