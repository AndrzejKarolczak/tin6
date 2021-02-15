const localhost = '127.0.0.1';
const http = require('http');
const urlService = require('url');
const malformedUrlMessage = 'Malformed URL. Should be http://localhost:3000/[operation]?x=[number]&y=[number].'
    + '<br/>Where [operation]: add|subtract|multiply|divide.';

function validate(fieldValue) {
    let numberValue = Number(fieldValue);
    return fieldValue !== "" && !isNaN(numberValue);
}

function processOperation(pathname, x, y) {
    let a = Number(x);
    let b = Number(y);

    switch (pathname) {
        case '/divide':
            return `The result of the '${pathname.substr(1)}' operation is: ${a / b}.`;
        case '/multiply':
            return `The result of the '${pathname.substr(1)}' operation is: ${a * b}.`;
        case '/add':
            return `The result of the '${pathname.substr(1)}' operation is: ${a + b}.`;
        case '/subtract':
            return `The result of the '${pathname.substr(1)}' operation is: ${a - b}.`;
        default:
            return "Malformed URL. The only supported operations (pathnames) are 'add', 'subtract', 'multiply', 'divide'.";
    }
}

function createResponse(url) {
    let urlObject = new URL(url);
    let search_params = urlObject.searchParams;
    let body;

    if (search_params.has('x') && search_params.has('y')) {
        let x = search_params.get('x');
        let y = search_params.get('y');
        if (validate(x) && validate(y)) {
            body = processOperation(urlObject.pathname, x, y);
        } else {
            body = malformedUrlMessage;
        }
    } else {
        body = malformedUrlMessage;
    }

    return `<!DOCTYPE html>
                <html lang="en">
                    <head>
                    <meta charset="UTF-8">
                    <title>Response</title>
                    </head>
                    <body>
                        ${body}
                    </body>
                </html>`;
}

function service(req, res) {
    let response = createResponse('http://' + req.headers.host + req.url); //skąd wziąć protokół?
    res.write(response);
    res.end();
}

const server = http.createServer(service);
server.listen(3000, localhost);