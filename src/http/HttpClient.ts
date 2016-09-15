import * as axios from 'axios';
import {RequestOptions, Response} from './HttpClientInterface';
import {AuthDefaults} from '../auth/authenticator/config/Config';
import {BaseHttpClient} from './BaseHttpClient';
import AxiosXHRConfig = Axios.AxiosXHRConfig;

export class HttpClient extends BaseHttpClient {
    request(method: string, url: string, options?: RequestOptions): Promise<Response> {
        return new Promise<Response>((resolve: (response: Response) => void, reject: (error: Response) => void) => {
            options = options ? options : <RequestOptions>{};
            let requestOptions = <AxiosXHRConfig<string>>{
                method: method,
                url: url,
                responseType: 'text',
                transformResponse: function(d) { return typeof d == 'string' ? d : `${d}`}
            };

            if(this.hasAuthenticationInfo()) {
                options.headers = options.headers || {};
                options.headers[AuthDefaults.AUTHENTICATION_HEADER] = this.getAuthenticationHeader();
            }

            if (options.body) requestOptions.data = typeof options.body == 'string' ? <string>options.body : JSON.stringify(options.body);
            if (options.query) requestOptions.params = options.query;
            if (options.headers) requestOptions.headers = options.headers;
            if (options.files) throw new Error('Not implemented');
            if (options.formData) throw new Error('Not implemented');
            if (options.timeout) requestOptions.timeout = options.timeout;
            if (options.connectionTimeout) throw new Error('Not implemented');

            axios<string>(requestOptions)
                .then((response) => {
                    let finalResponse: Response = {
                        status: response.status,
                        body: response.data,
                        headers: response.headers
                    };

                    if(response.status < 300) {
                        resolve(finalResponse);
                    } else {
                        reject(finalResponse);
                    }
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

}