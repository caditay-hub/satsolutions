export const openapi = {
  openapi: "3.0.3",
  info: {
    title: "SAT Solutions API",
    version: "1.0.0"
  },
  servers: [{ url: "http://localhost:4000" }],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" }
    }
  },
  paths: {
    "/health": { get: { responses: { "200": { description: "OK" } } } },
    "/auth/login": { post: { responses: { "200": { description: "Login" } } } },
    "/auth/refresh": { post: { responses: { "200": { description: "Refresh token" } } } },
    "/auth/logout": { post: { responses: { "204": { description: "Logout" } } } },
    "/categories": { get: { responses: { "200": { description: "Categories" } } } },
    "/products": { get: { responses: { "200": { description: "Products" } } } },
    "/products/{slug}": { get: { responses: { "200": { description: "Product" } } } },
    "/news": { get: { responses: { "200": { description: "News" } } } },
    "/news/{slug}": { get: { responses: { "200": { description: "Post" } } } },
    "/site-pages/{key}": { get: { responses: { "200": { description: "Site page" } } } },
    "/admin/stats": { get: { security: [{ bearerAuth: [] }], responses: { "200": { description: "Stats" } } } },
    "/admin/uploads/images": {
      post: { security: [{ bearerAuth: [] }], responses: { "201": { description: "Upload image" } } }
    },
    "/admin/site-pages/{key}": {
      get: { security: [{ bearerAuth: [] }], responses: { "200": { description: "Site page (admin)" } } },
      put: { security: [{ bearerAuth: [] }], responses: { "200": { description: "Upsert site page (admin)" } } }
    }
  }
} as const;

