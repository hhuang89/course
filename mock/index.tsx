//A mock server which return the login state
import { Model, createServer } from 'miragejs';

export const mockModels = {
  user: Model.extend({
       username: "John Doe"
  }),
}

export const mockFactories = {
}

export function makeServer({environment = "test"} = {}) {
  let server = createServer<typeof mockModels, typeof mockFactories>({
    environment,
    models: mockModels,
    routes() {
        this.get("/api/login", (schema) => {
            schema.create("user", {
                username: "Jane Doe"    // Great, no errors now
            })
            return {
                status: "OK"
            }
        })
    },
  })

  return server;
}

