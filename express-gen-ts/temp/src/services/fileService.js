"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveBase64Image = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const uploadDir = path_1.default.join(__dirname, '../../uploads');
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
const saveBase64Image = (base64Image) => {
    if (!base64Image?.includes('base64')) {
        return '';
    }
    const matches = /^data:([A-Za-z-+/]+);base64,(.+)$/.exec(base64Image);
    if (!matches || matches.length !== 3) {
        return '';
    }
    const type = matches[1];
    const data = matches[2];
    const buffer = Buffer.from(data, 'base64');
    let extension = '';
    switch (type) {
        case 'image/jpeg':
        case 'image/jpg':
            extension = '.jpg';
            break;
        case 'image/png':
            extension = '.png';
            break;
        default:
            extension = '.jpg';
    }
    const fileName = `${(0, uuid_1.v4)()}${extension}`;
    const filePath = path_1.default.join(uploadDir, fileName);
    fs_1.default.writeFileSync(filePath, buffer);
    return `/uploads/${fileName}`;
};
exports.saveBase64Image = saveBase64Image;
