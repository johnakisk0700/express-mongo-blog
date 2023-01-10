"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Subscribe_1 = __importDefault(require("../database/models/Subscribe"));
const asyncHandler_1 = __importDefault(require("../helpers/asyncHandler"));
const router = express_1.default.Router();
//GET the list of subscribes
router.get("/", (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    Subscribe_1.default.find(function (err, subscribes) {
        res.json(subscribes);
    });
})));
router.get("/all", (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const subscribes = yield Subscribe_1.default.find();
    res.json(subscribes);
})));
//POST a subscribe data
router.post("/", (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    Subscribe_1.default.findOne({ email: req.body.email }, function (err, subscribe) {
        if (subscribe) {
            console.log("found", subscribe);
            res
                .status(204)
                .send({ success: false, msg: "Email already exists." });
        }
        else {
            Subscribe_1.default.create(req.body, function (err, subscribe) {
                res.json(subscribe);
            });
        }
    });
})));
exports.default = router;
