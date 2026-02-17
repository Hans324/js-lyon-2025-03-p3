FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Installer netcat pour le wait-for-mysql.sh
RUN apt-get update && apt-get install -y netcat-openbsd && rm -rf /var/lib/apt/lists/*


COPY wait-for-mysql.sh /wait-for-mysql.sh
RUN chmod +x /wait-for-mysql.sh

EXPOSE 3310

CMD ["/wait-for-mysql.sh", "npm", "run", "dev"]
