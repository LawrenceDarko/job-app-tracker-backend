"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import './cronjobs/cronJobs'; 
const mongoose_1 = __importDefault(require("mongoose"));
const db_1 = __importDefault(require("./config/db"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const compression_1 = __importDefault(require("compression"));
const path_1 = __importDefault(require("path"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const body_parser_1 = __importDefault(require("body-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, compression_1.default)({
    level: 6,
    threshold: 10 * 1000,
    filter: (req, res) => {
        if (req.headers['x-no-compression']) {
            return false;
        }
        return compression_1.default.filter(req, res);
    }
}));
// Middleware
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000', 'https://fynnq.vercel.app', 'https://www.fynnq.com', 'https://fynnq.com'],
    credentials: true,
}));
app.use(body_parser_1.default.json());
// app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express_1.default.static(path_1.default.join(process.cwd(), 'uploads')));
// Database connection
mongoose_1.default.connect(db_1.default.url)
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));
// Subscription Routes
app.use(express_1.default.json());
// Routes
app.use('/api/auth', authRoutes_1.default);
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
