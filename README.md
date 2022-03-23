## NestJs REST API based on FreeCodeCamp tutorial

### Installation and running

1. Clone the repo
  ```sh
  git clone https://github.com/Bagogoo/WeatherApp.git
  ```
2. Install NPM packages
  ```sh
  npm install
  ```
3. Start postgres in docker and push migrations
  ```sh
  npm run db:dev:restart
  ```
4. Run API
  ```sh
  npm run start:dev
  ```
5. Run e2e tests
  ```sh
  npm run test:e2e 
  ```