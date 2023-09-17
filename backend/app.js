var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user');
var messagesRouter = require('./routes/messages');
var commonService = require('./services/common')

var app = express();
let http = require('http');
let server = http.Server(app);
const port = process.env.PORT || 3000;

let socketIO = require('socket.io');
let io = socketIO(server);

io.on('connection', (socket) => {
    socket.on('join', (data) => {
        console.log('data in "join": ', data);
        socket.join(data.room);
        socket.broadcast.to(data.room).emit('user joined');
    });

    socket.on('message', (data) => {
        console.log('data in "message": ', data);
        commonService.addMessage(data.from_user, data.to_user, data.message);
        // io.in(data.room).emit('new message', {user: data.user, message: data.message});
        io.in(data.room).emit('new message', data);
    });
});
// var corsOptions = {
// 	origin: 'http://localhost:4200/',
// 	optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/messages', messagesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
server.listen(port, () => {
    console.log(`started on port: ${port}`);
});