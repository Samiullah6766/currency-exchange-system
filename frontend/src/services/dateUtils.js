import moment from "moment-jalaali";

export const toShamsi = (gregorianDate) => {
    if (!gregorianDate) return "";
    return moment(gregorianDate).format("jYYYY/jMM/jDD");
  };

  export  const currencyLabel = (type) => {
    switch ((type || "").toUpperCase()) {
      case "DOLLAR":
        return "USD";
      case "AFGHANI":
        return "AFG";
      case "KALDARA":
        return "کالدار";
      case "EURO":
        return "یورو";
      case "TOMAN":
        return "تومان";
      default:
        return type || "";
    }
  };