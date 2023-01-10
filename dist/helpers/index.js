"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyPagination = exports.toMonthName = void 0;
const greekMonths = [
    "Ιανουάριος",
    "Φεβρουάριος",
    "Μάρτιος",
    "Απρίλιος",
    "Μάιος",
    "Ιούνιος",
    "Ιούλιος",
    "Αύγουστος",
    "Σεπτέμβριος",
    "Οκτώβριος",
    "Νοέμβριος",
    "Δεκέμβριος",
];
function toMonthName(monthNumber, lang) {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    if (lang === "en")
        return date.toLocaleString("en-US", {
            month: "long",
        });
    if (lang === "el")
        return greekMonths[monthNumber];
}
exports.toMonthName = toMonthName;
function applyPagination(query, { page, perPage }) {
    page--;
    return query.skip(page * perPage).limit(perPage);
}
exports.applyPagination = applyPagination;
