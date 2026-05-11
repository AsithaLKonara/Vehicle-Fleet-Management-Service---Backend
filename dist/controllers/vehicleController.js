"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVehicle = exports.updateVehicle = exports.createVehicle = exports.getVehicle = exports.listVehicles = void 0;
const vehicleService = __importStar(require("../services/vehicleService"));
const asyncWrapper_1 = require("../utils/asyncWrapper");
exports.listVehicles = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
    const { status, type, search, page, limit } = req.query;
    const result = await vehicleService.getAllVehicles({
        status: status,
        type: type,
        search: search,
        page: page ? parseInt(page) : undefined,
        limit: limit ? parseInt(limit) : undefined,
    });
    res.status(200).json({ success: true, data: result.vehicles, meta: { total: result.total, page: result.page, limit: result.limit } });
});
exports.getVehicle = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
    const vehicle = await vehicleService.getVehicleById(req.params.id);
    if (!vehicle) {
        return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }
    res.status(200).json({ success: true, data: vehicle });
});
exports.createVehicle = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
    const vehicle = await vehicleService.createVehicle(req.body);
    res.status(201).json({ success: true, data: vehicle });
});
exports.updateVehicle = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
    const vehicle = await vehicleService.updateVehicle(req.params.id, req.body);
    res.status(200).json({ success: true, data: vehicle });
});
exports.deleteVehicle = (0, asyncWrapper_1.asyncWrapper)(async (req, res) => {
    await vehicleService.deleteVehicle(req.params.id);
    res.status(204).send();
});
