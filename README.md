# Landing page for tech program

This is a Next.js full-stack project for the Landing page for tech program. The original project is available at https://www.figma.com/design/T7KMBduLGWb4XKDcMkrQZE/Landing-page-for-tech-program.

## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.

Run `npm run build` to create a production build.

Run `npm run start` to start the production server.

## Environment variables

Create a `.env.local` file with:

```
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB=720Degree_academy
PAYSTACK_SECRET_KEY=your_paystack_secret_key
PAYSTACK_CALLBACK_URL=https://your-domain.com/payment/verify
ADMIN_TOKEN=change_this_admin_token
```

The Paystack webhook endpoint is available at `/api/paystack/webhook`.
The Paystack verification page is available at `/payment/verify`.
The admin dashboard is available at `/admin` (requires `ADMIN_TOKEN`).

## Prisma

After installing Prisma dependencies, run:

```
npx prisma generate
```
