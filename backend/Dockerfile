FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps


COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the application
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
