import { LoginFormValues } from "../../pages/login"
import { createServer, Model } from "miragejs"

export const environment = "development";
export function makeServer ({ environment }) {
    return createServer({
        environment,

        /*models: {
            movie: Model,
        },*/

        routes() {
            this.get("http://localhost:3000/api/login", () => (  {
                "code": 0,
                "msg": "success",
                "data": {
                  "token": "12xxxdsf",
                  "role": "12154545",
                }
              }))
        }
    })
}