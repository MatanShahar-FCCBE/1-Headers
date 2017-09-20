import * as http from "http";
import * as fs from "fs";

interface IResponse {
    ipAddress: string,
    language: string,
    hostOs: string
}

export default function serverMain(req: http.IncomingMessage, res: http.ServerResponse) {
    if(req.method != "GET")
    {
        res.statusCode = 405;
        res.end();
        return;
    }

    if(req.url.toLowerCase() == "/whoami")
    {
        returnRequest(req, res);
        return;
    }

    fs.readFile('dist/index.html', (err, data) => {
        if (err)
        {
            console.log(data);
            res.statusCode = 404;
            res.end();
            return;
        }

        res.writeHead(200, { 'Content-Type': 'text/html', 'Content-Length': data.length });
        res.write(data);
        res.end();
    });
}

function returnRequest(req: http.IncomingMessage, res: http.ServerResponse) {
    var data = buildResponse(req);

    res.writeHead(200, { 'Content-Type': 'text/json', 'Content-Length': data.length });
    res.write(data);
    res.end();
}

function buildResponse(request: http.IncomingMessage): string {
    var response: IResponse = {
        language: getClientLanguage(request),
        ipAddress: getIpAddress(request),
        hostOs: getClientOs(request)
    };

    return JSON.stringify(response);
}

function getIpAddress(request: http.IncomingMessage): string {
    var xforwardHeader = <string>request.headers['x-forwarded-for'];

    var ip = xforwardHeader || 
        request.connection.remoteAddress || 
        request.socket.remoteAddress ||
        null;

    return ip;
}

function getClientLanguage(request: http.IncomingMessage): string {
    var langHeader = <string>request.headers["accept-language"];
    if (!langHeader)
        return null;

    return langHeader.split(',')[0];
}


function getClientOs(request: http.IncomingMessage): string {
    var userAgent = <string>request.headers["user-agent"];
    if (!userAgent)
        return null;

    var regex = /.+\((.+)\)(.+)\(.+\).*/;
    return regex.exec(userAgent)[1];
}