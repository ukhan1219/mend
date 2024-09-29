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
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const getWeeklyAnalysis_1 = require("../ts/api/getWeeklyAnalysis");
const index_1 = require("../ts/index");
const Analysis = () => {
    const [analysis, setAnalysis] = (0, react_1.useState)("");
    const [userID, setUserID] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        const userInfo = (0, index_1.readCookie)();
        setUserID(userInfo.userID);
        const fetchAnalysis = () => __awaiter(void 0, void 0, void 0, function* () {
            if (userInfo.userID > 0) {
                const result = yield (0, getWeeklyAnalysis_1.getWeeklyAnalysis)(userInfo.userID); //replace w dynamic
                setAnalysis(result.analysisSummary || "No analysis available");
            }
            else {
                setAnalysis("User ID not found. Please Log In.");
            }
        });
        fetchAnalysis();
    }, []);
    return (<div>
            <h1>Your Weekly Analysis</h1>
            <p>{analysis}</p>
        </div>);
};
exports.default = Analysis;
