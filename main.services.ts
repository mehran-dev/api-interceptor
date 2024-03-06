// <import handler
import requestModel from "./apiHandlers";
// import handler>

// <import types
import { Request, Response, RequestBody } from "@/lib/types/services.types";
// import types>

class Main {

    requestObj: RequestBody;
    url: string;

    constructor(requestObj : RequestBody = null) {
        this.requestObj = requestObj;
        this.url = "api/main/";
    }

    async postLogin() : Promise<Response | undefined> {

        const apiObj: Request = {
            url : this.url + 'login',
            method : 'post',
            reqObj : this.requestObj
        };

        return await requestModel.response(apiObj);
    };
};

export default Main;