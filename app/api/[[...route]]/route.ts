// import { Hono } from 'hono'
// import { handle } from 'hono/vercel'

// // Create the main Hono app
// const app = new Hono().basePath('/api')

// // Health check
// app.get('/health', (c) => {
//   return c.json({ 
//     status: 'ok', 
//     message: 'FocusFlow Hono API is running!',
//     timestamp: new Date().toISOString(),
//     version: '1.0.0'
//   })
// })

// // Export the handlers
// export const GET = handle(app)
// export const POST = handle(app)
// export const PUT = handle(app)
// export const DELETE = handle(app)
// export const PATCH = handle(app)