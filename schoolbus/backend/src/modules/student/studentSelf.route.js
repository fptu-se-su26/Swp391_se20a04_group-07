const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { verifyToken, authorizeRoles } = require('../../middlewares/auth.middleware');
const { Trip, Route, RouteStop, UserDriver, Student, ClassRoom, TripAttendance, RouteSubscription, Notification } = require('../../models');

const studentAuth = [verifyToken, authorizeRoles('student')];

const todayVN = () => {
    const vnTime = new Date(Date.now() + 7 * 60 * 60 * 1000);
    return vnTime.toISOString().split('T')[0];
};

router.get('/profile', ...studentAuth, async (req, res, next) => {
    try {
        const s = await Student.findByPk(req.user.id, {
            include: [{ model: ClassRoom, as: 'classInfo', attributes: ['id', 'class_name', 'grade'], required: false }],
        });
        if (!s) return res.status(404).json({ success: false, message: 'Không tìm thấy học sinh' });
        res.json({ success: true, data: { ...s.toJSON(), role: 'student' } });
    } catch (e) { next(e); }
});

router.get('/my-route', ...studentAuth, async (req, res, next) => {
    try {
        const sub = await RouteSubscription.findOne({
            where: { student_id: req.user.id, status: 'active' },
            include: [{ model: Route, include: [{ model: RouteStop, separate: true, order: [['stop_order', 'ASC']] }] }],
        });
        res.json({ success: true, data: sub });
    } catch (e) { next(e); }
});

router.get('/trips/current', ...studentAuth, async (req, res, next) => {
    try {
        const today = todayVN();
        const trip = await Trip.findOne({
            where: { scheduled_date: today, status: 'in_progress' },
            include: [
                { 
                    model: TripAttendance, 
                    where: { student_id: req.user.id }, 
                    required: true,
                    include: [{ model: Student, as: 'student' }]
                },
                { 
                    model: Route,
                    include: [{ model: RouteStop, separate: true, order: [['stop_order', 'ASC']] }]
                },
                { model: UserDriver, as: 'driver', attributes: ['full_name', 'phone'] },
            ],
        });
        res.json({ success: true, data: trip });
    } catch (e) { next(e); }
});

router.get('/schedule/week', ...studentAuth, async (req, res, next) => {
    try {
        const anchor = req.query.date
            ? new Date(`${req.query.date}T00:00:00.000Z`)
            : new Date(Date.now() + 7 * 60 * 60 * 1000);
        if (isNaN(anchor.getTime())) {
            throw Object.assign(new Error('Tham số date không hợp lệ (định dạng YYYY-MM-DD)'), { status: 400 });
        }
        const day = anchor.getUTCDay();
        const monday = new Date(anchor);
        monday.setUTCDate(anchor.getUTCDate() - (day === 0 ? 6 : day - 1));
        const sunday = new Date(monday);
        sunday.setUTCDate(monday.getUTCDate() + 6);
        const mondayStr = monday.toISOString().split('T')[0];
        const sundayStr = sunday.toISOString().split('T')[0];

        const trips = await Trip.findAll({
            where: { scheduled_date: { [Op.between]: [mondayStr, sundayStr] } },
            include: [
                { model: TripAttendance, where: { student_id: req.user.id }, required: true },
                { model: Route, attributes: ['route_name', 'route_code'] },
            ],
            order: [['scheduled_date', 'ASC'], ['scheduled_start', 'ASC']],
        });
        res.json({ success: true, data: trips, meta: { monday: mondayStr, sunday: sundayStr } });
    } catch (e) { next(e); }
});

router.get('/notifications', ...studentAuth, async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;
        const { count, rows } = await Notification.findAndCountAll({
            where: { user_id: req.user.id, user_type: 'student', recalled_at: null },
            order: [['pinned', 'DESC'], ['sent_at', 'DESC']],
            limit, offset,
        });
        const unread = await Notification.count({
            where: { user_id: req.user.id, user_type: 'student', is_read: false, recalled_at: null }
        });
        res.json({ success: true, data: { total: count, unread, data: rows } });
    } catch (e) { next(e); }
});

router.patch('/notifications/:id/read', ...studentAuth, async (req, res, next) => {
    try {
        await Notification.update({ is_read: true }, { where: { id: req.params.id, user_id: req.user.id, user_type: 'student' } });
        res.json({ success: true });
    } catch (e) { next(e); }
});

router.patch('/notifications/read-all', ...studentAuth, async (req, res, next) => {
    try {
        await Notification.update({ is_read: true }, { where: { user_id: req.user.id, user_type: 'student', is_read: false } });
        res.json({ success: true });
    } catch (e) { next(e); }
});

module.exports = router;